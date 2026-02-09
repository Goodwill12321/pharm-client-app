package com.pharma.clientapp.service;

import com.pharma.clientapp.dto.SertLinksRequest;
import com.pharma.clientapp.dto.CertificateSearchRequest;
import com.pharma.clientapp.dto.CertificateInfoDto;
import com.pharma.clientapp.dto.CertificateAutocompleteDto;
import com.pharma.clientapp.entity.Sert;
import com.pharma.clientapp.entity.SertGoods;
import com.pharma.clientapp.entity.SertGoodsId;
import com.pharma.clientapp.entity.SertSeries;
import com.pharma.clientapp.entity.SertSeriesId;
import com.pharma.clientapp.entity.Good;
import com.pharma.clientapp.entity.Series;
import com.pharma.clientapp.entity.InvoiceH;
import com.pharma.clientapp.repository.SertRepository;
import com.pharma.clientapp.repository.SertGoodsRepository;
import com.pharma.clientapp.repository.SertSeriesRepository;
import com.pharma.clientapp.repository.InvoiceHRepository;
import com.pharma.clientapp.repository.GoodRepository;
import com.pharma.clientapp.repository.SeriesRepository;
import com.pharma.clientapp.repository.SertGoodsBatchRepositoryImpl;
import com.pharma.clientapp.repository.SertSeriesBatchRepositoryImpl;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SertService {
    private final SertRepository sertRepository;
    private final SertGoodsRepository sertGoodsRepository;
    private final SertSeriesRepository sertSeriesRepository;
    private final InvoiceHRepository invoiceHRepository;
    private final GoodRepository goodRepository;
    private final SeriesRepository seriesRepository;
    private final SertGoodsBatchRepositoryImpl sertGoodsBatchRepository;
    private final SertSeriesBatchRepositoryImpl sertSeriesBatchRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    public SertService(SertRepository sertRepository,
                      SertGoodsRepository sertGoodsRepository,
                      SertSeriesRepository sertSeriesRepository,
                      InvoiceHRepository invoiceHRepository,
                      GoodRepository goodRepository,
                      SeriesRepository seriesRepository,
                      SertGoodsBatchRepositoryImpl sertGoodsBatchRepository,
                      SertSeriesBatchRepositoryImpl sertSeriesBatchRepository) {
        this.sertRepository = sertRepository;
        this.sertGoodsRepository = sertGoodsRepository;
        this.sertSeriesRepository = sertSeriesRepository;
        this.invoiceHRepository = invoiceHRepository;
        this.goodRepository = goodRepository;
        this.seriesRepository = seriesRepository;
        this.sertGoodsBatchRepository = sertGoodsBatchRepository;
        this.sertSeriesBatchRepository = sertSeriesBatchRepository;
    }

    public List<Sert> findAll() {
        return sertRepository.findAll();
    }

    public Optional<Sert> findById(String uid) {
        return sertRepository.findById(uid);
    }

    public Sert save(Sert sert) {
        return sertRepository.save(sert);
    }

    public void deleteById(String uid) {
        sertRepository.deleteById(uid);
    }

    /**
     * Сохраняет список сертификатов (batch insert/update).
     * Если uid уже есть в базе — запись обновляется, иначе создается новая.
     */
    public List<Sert> saveAll(List<Sert> serts) {
        return sertRepository.saveAll(serts);
    }

    /**
     * Updates a certificate and its associations with goods and series in a single transaction
     * @param request The update request containing certificate and association data
     * @return The updated Sert entity
     */
    @Transactional
    public Sert updateSertWithLinks(SertLinksRequest request) {
        // 1. Update or create the Sert
        Sert existingSert = sertRepository.findById(request.getSertUid())
                .orElse(new Sert());
        
        existingSert.setUid(request.getSertUid());
        existingSert.setImage(request.getImage());
        existingSert.setSertNo(request.getSertNo());
        Sert sert = sertRepository.save(existingSert);
        
        // 2. Handle SertGoods associations
        if (request.getGoodUids() != null) {
            // Then add all new associations
            if (!request.getGoodUids().isEmpty()) {
                List<SertGoods> toAdd = request.getGoodUids().stream()
                        .map(uid -> {
                            SertGoods sg = new SertGoods();
                            sg.setSert(sert);
                            Good good = new Good();
                            good.setUid(uid);
                            sg.setGood(good);
                            return sg;
                        })
                        .collect(Collectors.toList());
                
                if (!toAdd.isEmpty()) {
                    try {
                        sertGoodsRepository.saveAll(toAdd);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to save SertGoods associations. Make sure all good UIDs exist.", e);
                    }
                }
            }
        }
        
        // 3. Handle SertSeries associations
        if (request.getSeriesUids() != null) {
            // Then add all new associations
            if (!request.getSeriesUids().isEmpty()) {
                List<SertSeries> toAdd = request.getSeriesUids().stream()
                        .map(uid -> {
                            SertSeries ss = new SertSeries();
                            ss.setSert(sert);
                            Series series = new Series();
                            series.setUid(uid);
                            ss.setSeries(series);
                            return ss;
                        })
                        .collect(Collectors.toList());
                
                if (!toAdd.isEmpty()) {
                    try {
                        sertSeriesRepository.saveAll(toAdd);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to save SertSeries associations. Make sure all series UIDs exist.", e);
                    }
                }
            }
        }
        
        return sert;
    }
    
    /**
     * Updates multiple certificates with their links in a single transaction
     * @param serts List of certificates to update
     * @param links List of links to update
     * @return List of updated certificates
     */
    @Transactional
    public List<Sert> batchUpdateSertsWithLinks(List<Sert> serts, Map<String, SertLinksRequest> links) {
        if (serts == null || serts.isEmpty()) {
            return Collections.emptyList();
        }
        
        // 1. Save all certificates first
        List<Sert> savedSerts = sertRepository.saveAll(serts);
        Map<String, Sert> sertMap = savedSerts.stream()
                .collect(Collectors.toMap(Sert::getUid, Function.identity()));
        
        // 2. Process all goods links directly using only UIDs
        List<SertGoods> allGoodsLinks = new ArrayList<>();
        List<SertSeries> allSeriesLinks = new ArrayList<>();
        
        links.forEach((sertUid, linkRequest) -> {
            Sert sert = sertMap.get(sertUid);
            if (sert == null) return;
            
            // Process goods links - create proxies with only UID
            if (linkRequest.getGoodUids() != null && !linkRequest.getGoodUids().isEmpty()) {
                linkRequest.getGoodUids().forEach(goodUid -> {
                    SertGoods sg = new SertGoods();
                    sg.setSert(sert);
                    
                    // Create proxy Good without loading from DB
                    Good good = entityManager.getReference(Good.class, goodUid);
                    sg.setGood(good);
                    
                    // Set composite ID
                    sg.setId(new SertGoodsId(sert.getUid(), goodUid));
                    
                    allGoodsLinks.add(sg);
                });
            }
            
            // Process series links - create proxies with only UID
            if (linkRequest.getSeriesUids() != null && !linkRequest.getSeriesUids().isEmpty()) {
                linkRequest.getSeriesUids().forEach(seriesUid -> {
                    SertSeries ss = new SertSeries();
                    ss.setSert(sert);
                    
                    // Create proxy Series without loading from DB
                    Series series = entityManager.getReference(Series.class, seriesUid);
                    ss.setSeries(series);
                    
                    // Set composite ID
                    ss.setId(new SertSeriesId(sert.getUid(), seriesUid));
                    
                    allSeriesLinks.add(ss);
                });
            }
        });
        
        // 3. Save all links in batches using upsert to handle duplicates
        if (!allGoodsLinks.isEmpty()) {
            upsertSertGoods(allGoodsLinks);
        }
        
        if (!allSeriesLinks.isEmpty()) {
            upsertSertSeries(allSeriesLinks);
        }
        
        return savedSerts;
    }
    
    /**
     * Upsert sert_goods records (insert or update on conflict) - TRUE BATCH version
     */
    private void upsertSertGoods(List<SertGoods> sertGoods) {
        sertGoodsBatchRepository.batchUpsertSertGoods(sertGoods);
    }
    
    /**
     * Upsert sert_series records (insert or update on conflict) - TRUE BATCH version
     */
    private void upsertSertSeries(List<SertSeries> sertSeries) {
        sertSeriesBatchRepository.batchUpsertSertSeries(sertSeries);
    }
    
    /**
     * Поиск сертификатов по различным фильтрам - МАКСИМАЛЬНО ОПТИМАЛЬНЫЙ ВАРИАНТ
     * @param searchRequest Параметры поиска
     * @return Список найденных сертификатов с связанными данными
     */
    public List<CertificateInfoDto> searchCertificates(CertificateSearchRequest searchRequest) {
        // Предпроверка: если все фильтры пустые, возвращаем пустой результат
        boolean hasInvoiceNumber = searchRequest.getInvoiceNumber() != null && !searchRequest.getInvoiceNumber().trim().isEmpty();
        boolean hasProductName = searchRequest.getProductName() != null && !searchRequest.getProductName().trim().isEmpty();
        boolean hasSeriesName = searchRequest.getSeriesName() != null && !searchRequest.getSeriesName().trim().isEmpty();
        boolean hasCertificateNumber = searchRequest.getCertificateNumber() != null && !searchRequest.getCertificateNumber().trim().isEmpty();
        
        if (!hasInvoiceNumber && !hasProductName && !hasSeriesName && !hasCertificateNumber) {
            return List.of();
        }
        
        List<SertRepository.CertificateSearchRow> rows = sertRepository.findCertificateInfoDtoWithDynamicFilters(
            hasInvoiceNumber ? searchRequest.getInvoiceNumber() : null,
            hasProductName ? searchRequest.getProductName() : null,
            hasSeriesName ? searchRequest.getSeriesName() : null,
            hasCertificateNumber ? searchRequest.getCertificateNumber() : null
        );

        List<CertificateInfoDto> result = new ArrayList<>();
        for (SertRepository.CertificateSearchRow row : rows) {
            result.add(new CertificateInfoDto(
                row.getUid(),
                row.getCertificateNumber(),
                row.getImagePath(),
                row.getLinkType(),
                row.getProductName(),
                row.getProductUid(),
                row.getSeriesName(),
                row.getSeriesUid()
            ));
        }

        return result;
    }
    
    /**
     * Автодополнение для полей поиска
     * @param type Тип данных (INVOICE, PRODUCT, SERIES, CERTIFICATE)
     * @param query Строка поиска
     * @return Список предложений для автодополнения
     */
    public List<CertificateAutocompleteDto> autocomplete(String type, String query) {
         return autocomplete(type, query, null, null, null, 10); // по умолчанию 10 результатов
    }
    
    /**
     * Автодополнение для полей поиска с иерархической фильтрацией
     * @param type Тип данных (INVOICE, PRODUCT, SERIES, CERTIFICATE)
     * @param query Строка поиска
     * @param invoiceNumber Опциональный фильтр по номеру накладной
     * @param productName Опциональный фильтр по наименованию товара
     * @param seriesName Опциональный фильтр по наименованию серии
     * @return Список предложений для автодополнения
     */
    public List<CertificateAutocompleteDto> autocomplete(String type, String query, String invoiceNumber, String productName, String seriesName) {
        return autocomplete(type, query, invoiceNumber, productName, seriesName, 10); // по умолчанию 10 результатов
    }
    
    /**
     * Автодополнение для полей поиска с иерархической фильтрацией и настраиваемым лимитом
     * @param type Тип данных (INVOICE, PRODUCT, SERIES, CERTIFICATE)
     * @param query Строка поиска
     * @param invoiceNumber Опциональный фильтр по номеру накладной
     * @param productName Опциональный фильтр по наименованию товара
     * @param seriesName Опциональный фильтр по наименованию серии
     * @param limit Максимальное количество результатов
     * @return Список предложений для автодополнения
     */
    public List<CertificateAutocompleteDto> autocomplete(String type, String query, String invoiceNumber, String productName, String seriesName, int limit) {
        List<CertificateAutocompleteDto> results = new ArrayList<>();
        
        switch (type.toUpperCase()) {
            case "INVOICE":
                // Для накладной игнорируем другие фильтры, так как это верхний уровень иерархии
                List<InvoiceH> invoices = invoiceHRepository.findByDocNumContainingIgnoreCaseWithLimit(query, limit);
                
                for (InvoiceH inv : invoices) {
                    results.add(new CertificateAutocompleteDto(inv.getDocNum(), "INVOICE"));
                }
                break;
                
            case "PRODUCT":
                // Фильтруем товары по накладной, если она указана
                List<Good> goods;
                if (invoiceNumber != null && !invoiceNumber.trim().isEmpty()) {
                    goods = goodRepository.findByNameContainingIgnoreCaseAndInvoiceWithLimit(query, invoiceNumber, limit);
                } else {
                    goods = goodRepository.findByNameContainingIgnoreCaseWithLimit(query, limit);
                }
                
                for (Good good : goods) {
                    results.add(new CertificateAutocompleteDto(good.getName(), "PRODUCT"));
                }
                break;
                
            case "SERIES":
                // Фильтруем серии по накладной и/или товару, если они указаны
                List<Series> seriesList;
                if (invoiceNumber != null && !invoiceNumber.trim().isEmpty() && productName != null && !productName.trim().isEmpty()) {
                    seriesList = seriesRepository.findByNameContainingIgnoreCaseAndInvoiceAndProductWithLimit(query, invoiceNumber, productName, limit);
                } else if (invoiceNumber != null && !invoiceNumber.trim().isEmpty()) {
                    seriesList = seriesRepository.findByNameContainingIgnoreCaseAndInvoiceWithLimit(query, invoiceNumber, limit);
                } else if (productName != null && !productName.trim().isEmpty()) {
                    seriesList = seriesRepository.findByNameContainingIgnoreCaseAndProductWithLimit(query, productName, limit);
                } else {
                    seriesList = seriesRepository.findByNameContainingIgnoreCaseWithLimit(query, limit);
                }
                
                for (Series series : seriesList) {
                    results.add(new CertificateAutocompleteDto(series.getName(), "SERIES"));
                }
                break;
                
            case "CERTIFICATE":
                // Фильтруем сертификаты по всем указанным параметрам
                List<Sert> serts;
                if (invoiceNumber != null && !invoiceNumber.trim().isEmpty() && 
                    productName != null && !productName.trim().isEmpty() && 
                    seriesName != null && !seriesName.trim().isEmpty()) {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseAndInvoiceAndProductAndSeriesWithLimit(query, invoiceNumber, productName, seriesName, limit);
                } else if (invoiceNumber != null && !invoiceNumber.trim().isEmpty() && productName != null && !productName.trim().isEmpty()) {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseAndInvoiceAndProductWithLimit(query, invoiceNumber, productName, limit);
                } else if (invoiceNumber != null && !invoiceNumber.trim().isEmpty() && seriesName != null && !seriesName.trim().isEmpty()) {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseAndInvoiceAndSeriesWithLimit(query, invoiceNumber, seriesName, limit);
                } else if (productName != null && !productName.trim().isEmpty() && seriesName != null && !seriesName.trim().isEmpty()) {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseAndProductAndSeriesWithLimit(query, productName, seriesName, limit);
                } else if (invoiceNumber != null && !invoiceNumber.trim().isEmpty()) {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseAndInvoiceWithLimit(query, invoiceNumber, limit);
                } else if (productName != null && !productName.trim().isEmpty()) {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseAndProductWithLimit(query, productName, limit);
                } else if (seriesName != null && !seriesName.trim().isEmpty()) {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseAndSeriesWithLimit(query, seriesName, limit);
                } else {
                    serts = sertRepository.findBySertNoContainingIgnoreCaseWithLimit(query, limit);
                }
                
                for (Sert sert : serts) {
                    results.add(new CertificateAutocompleteDto(sert.getSertNo(), "CERTIFICATE"));
                }
                break;
        }
        
        return results;
    }
}

