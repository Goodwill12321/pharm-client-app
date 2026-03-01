//t
package com.pharma.clientapp.service;

import com.pharma.clientapp.dto.SertImageLinksRequest;
import com.pharma.clientapp.dto.SertImageRequestDto;
import com.pharma.clientapp.dto.CertificateSearchRequest;
import com.pharma.clientapp.dto.CertificateInfoDto;
import com.pharma.clientapp.dto.CertificateAutocompleteDto;
import com.pharma.clientapp.entity.Good;
import com.pharma.clientapp.entity.Series;
import com.pharma.clientapp.entity.InvoiceH;
import com.pharma.clientapp.entity.SertImage;
import com.pharma.clientapp.entity.SertImageGoods;
import com.pharma.clientapp.entity.SertImageGoodsId;
import com.pharma.clientapp.entity.SertImageSeries;
import com.pharma.clientapp.entity.SertImageSeriesId;
import com.pharma.clientapp.entity.Sert;
import com.pharma.clientapp.repository.GoodRepository;
import com.pharma.clientapp.repository.InvoiceHRepository;
import com.pharma.clientapp.repository.SertBatchRepositoryImpl;
import com.pharma.clientapp.repository.SertImageGoodsBatchRepositoryImpl;
import com.pharma.clientapp.repository.SertImageGoodsRepository;
import com.pharma.clientapp.repository.SertImageRepository;
import com.pharma.clientapp.repository.SertImageSeriesBatchRepositoryImpl;
import com.pharma.clientapp.repository.SertImageSeriesRepository;
import com.pharma.clientapp.repository.SertRepository;
import com.pharma.clientapp.repository.SeriesRepository;
import com.pharma.clientapp.repository.SertImageBatchRepositoryImpl;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SertService {
    private final SertRepository sertRepository;
    private final SertImageRepository sertImageRepository;
    private final SertImageBatchRepositoryImpl sertImageBatchRepository;
    private final SertBatchRepositoryImpl sertBatchRepository;
    private final SertImageGoodsRepository sertImageGoodsRepository;
    private final SertImageSeriesRepository sertImageSeriesRepository;
    private final InvoiceHRepository invoiceHRepository;
    private final GoodRepository goodRepository;
    private final SeriesRepository seriesRepository;
    private final SertImageGoodsBatchRepositoryImpl sertImageGoodsBatchRepository;
    private final SertImageSeriesBatchRepositoryImpl sertImageSeriesBatchRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    public SertService(SertRepository sertRepository,
                      SertImageRepository sertImageRepository,
                      SertImageGoodsRepository sertImageGoodsRepository,
                      SertImageSeriesRepository sertImageSeriesRepository,
                      InvoiceHRepository invoiceHRepository,
                      GoodRepository goodRepository,
                      SeriesRepository seriesRepository,
                      SertImageBatchRepositoryImpl sertImageBatchRepository,
                      SertBatchRepositoryImpl sertBatchRepository,
                      SertImageGoodsBatchRepositoryImpl sertImageGoodsBatchRepository,
                      SertImageSeriesBatchRepositoryImpl sertImageSeriesBatchRepository) {
        this.sertRepository = sertRepository;
        this.sertImageRepository = sertImageRepository;
        this.sertImageGoodsRepository = sertImageGoodsRepository;
        this.sertImageSeriesRepository = sertImageSeriesRepository;
        this.invoiceHRepository = invoiceHRepository;
        this.goodRepository = goodRepository;
        this.seriesRepository = seriesRepository;
        this.sertImageBatchRepository = sertImageBatchRepository;
        this.sertBatchRepository = sertBatchRepository;
        this.sertImageGoodsBatchRepository = sertImageGoodsBatchRepository;
        this.sertImageSeriesBatchRepository = sertImageSeriesBatchRepository;
    }

    public List<Sert> findAll() {
        return sertRepository.findAll();
    }

    public Optional<Sert> findById(String uid) {
        return sertRepository.findById(uid);
    }

    @Transactional
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
    @Transactional
    public List<Sert> saveAll(List<Sert> serts) {
        return sertRepository.saveAll(serts);
    }

    /**
     * Updates a certificate and its associations with goods and series in a single transaction
     * @param imageDto The image data containing uidImage, sertNo, image
     * @param links The links data containing goodUids and seriesUids
     * @return The updated SertImage entity
     */
    @Transactional
    public SertImage updateSertWithLinks(SertImageRequestDto imageDto, SertImageLinksRequest links) {
        if (imageDto == null || imageDto.getUidImage() == null || imageDto.getUidImage().isBlank()) {
            throw new IllegalArgumentException("uidImage is required");
        }

        Sert sert = upsertSertBySertNo(imageDto.getSertNo());

        SertImage image = sertImageRepository.findById(imageDto.getUidImage())
                .orElseGet(SertImage::new);
        image.setUid(imageDto.getUidImage());
        image.setImage(imageDto.getImage());
        image.setSert(sert);
        image.setIsDel(false);
        SertImage savedImage = sertImageRepository.save(image);

        // Links to goods
        if (links != null && links.getGoodUids() != null && !links.getGoodUids().isEmpty()) {
            List<SertImageGoods> toAdd = links.getGoodUids().stream()
                    .map(goodUid -> {
                        SertImageGoods sg = new SertImageGoods();
                        sg.setSertImage(savedImage);
                        Good good = entityManager.getReference(Good.class, goodUid);
                        sg.setGood(good);
                        sg.setId(new SertImageGoodsId(savedImage.getUid(), goodUid));
                        return sg;
                    })
                    .collect(Collectors.toList());
            sertImageGoodsRepository.saveAll(toAdd);
        }

        // Links to series
        if (links != null && links.getSeriesUids() != null && !links.getSeriesUids().isEmpty()) {
            List<SertImageSeries> toAdd = links.getSeriesUids().stream()
                    .map(seriesUid -> {
                        SertImageSeries ss = new SertImageSeries();
                        ss.setSertImage(savedImage);
                        Series series = entityManager.getReference(Series.class, seriesUid);
                        ss.setSeries(series);
                        ss.setId(new SertImageSeriesId(savedImage.getUid(), seriesUid));
                        return ss;
                    })
                    .collect(Collectors.toList());
            sertImageSeriesRepository.saveAll(toAdd);
        }

        return savedImage;
    }
    
    /**
     * Updates multiple certificates with their links in a single transaction
     * @param serts List of certificates to update
     * @param links List of links to update
     * @return List of updated certificates
     */
    @Transactional
    public List<SertImage> batchUpdateSertsWithLinks(List<SertImageRequestDto> imageDtos, Map<String, SertImageLinksRequest> links) {
        if (imageDtos == null || imageDtos.isEmpty()) {
            return Collections.emptyList();
        }

        log.info("Starting batch update with {} images and {} links", imageDtos.size(), links.size());
        
        // Convert DTOs to SertImage entities for processing
        List<SertImage> images = imageDtos.stream()
                .map(dto -> {
                    SertImage img = new SertImage();
                    img.setUid(dto.getUidImage());
                    img.setImage(dto.getImage());
                    return img;
                })
                .collect(Collectors.toList());
        
        // Debug: log incoming images
        for (int i = 0; i < Math.min(images.size(), 3); i++) {
            SertImage img = images.get(i);
            SertImageRequestDto dto = imageDtos.get(i);
            log.debug("Incoming image {}: uid={}, sertNo={}, image={}", 
                     i, img.getUid(), dto.getSertNo(), img.getImage());
        }

        // Upsert images in bulk (sert will be created/updated as needed)
        // First, collect all unique sertNos that need to be created/updated
        Set<String> sertNosToProcess = new HashSet<>();
        
        for (int i = 0; i < imageDtos.size(); i++) {
            SertImageRequestDto dto = imageDtos.get(i);
            String sertNo = normalizeSertNo(dto.getSertNo());
            
            if (sertNo != null) {
                sertNosToProcess.add(sertNo);
            }
        }
        
        log.info("Processing {} unique sertNos: {}", sertNosToProcess.size(), sertNosToProcess);
        
        // Batch upsert Serts for all needed sertNos
        Map<String, String> sertNoToUidMap = new HashMap<>();
        if (!sertNosToProcess.isEmpty()) {
            List<SertBatchRepositoryImpl.SertRow> sertRows = new ArrayList<>();
            for (String sertNo : sertNosToProcess) {
                String uid = UUID.randomUUID().toString();
                sertRows.add(new SertBatchRepositoryImpl.SertRow(uid, sertNo, null, false, false, LocalDateTime.now(), LocalDateTime.now()));
                sertNoToUidMap.put(sertNo, uid);
            }
            sertBatchRepository.batchUpsertSerts(sertRows);
        }
        
        // Load all existing Serts for the needed sertNos (including newly created)
        List<Sert> existingSerts = sertRepository.findBySertNoIn(new ArrayList<>(sertNosToProcess));
        Map<String, Sert> sertByNo = existingSerts.stream()
                .collect(Collectors.toMap(Sert::getSertNo, Function.identity()));
        
        // Now create image rows with proper sert references (from memory, not DB)
        List<SertImageBatchRepositoryImpl.SertImageRow> toUpsert = new ArrayList<>();
        int skippedImages = 0;
        int processedImages = 0;
        int imagesWithoutCert = 0;
        
        for (int i = 0; i < imageDtos.size(); i++) {
            SertImageRequestDto dto = imageDtos.get(i);
            SertImage img = images.get(i);
            String sertNo = normalizeSertNo(dto.getSertNo());
            
            // Find Sert by sertNo from memory map (existing or newly created)
            Sert sert = sertNo != null ? sertByNo.get(sertNo) : null;
            
            if (sert != null) {
                toUpsert.add(new SertImageBatchRepositoryImpl.SertImageRow(img.getUid(), sert.getUid(), img.getImage(), false));
                processedImages++;
            } else {
                // Image without certificate - add with NULL sert_uid
                toUpsert.add(new SertImageBatchRepositoryImpl.SertImageRow(img.getUid(), null, img.getImage(), false));
                imagesWithoutCert++;
            }
        }
        
        log.info("Batch processing images: total={}, toUpsert={}, processed={}, skipped={}, without_cert={}", 
                 images.size(), toUpsert.size(), processedImages, skippedImages, imagesWithoutCert);
        
        //log.info("Batch upserting  SertImage rows: \n" + toUpsert.toString());
        
        if (!toUpsert.isEmpty()) {
            sertImageBatchRepository.batchUpsertSertImages(toUpsert);
        }

        // Reload saved images
        List<String> uidImages = images.stream().map(SertImage::getUid).toList();
        List<SertImage> savedImages = sertImageRepository.findByUidIn(uidImages);
        Map<String, SertImage> imageMap = savedImages.stream().collect(Collectors.toMap(SertImage::getUid, Function.identity()));

        // Links in bulk
        List<SertImageGoods> allGoodsLinks = new ArrayList<>();
        List<SertImageSeries> allSeriesLinks = new ArrayList<>();

        //log.info("*** Processing  links: {}", links.toString());    

        links.forEach((uidImage, linkRequest) -> {
            SertImage img = imageMap.get(uidImage);
            if (img == null) {
                log.warn("Image {} not found in imageMap", uidImage);
                return;
            }
            log.info("Processing image {} with good links: {}", uidImage, linkRequest.getGoodUids().toString());    
            if (linkRequest.getGoodUids() != null && !linkRequest.getGoodUids().isEmpty()) {
                linkRequest.getGoodUids().forEach(goodUid -> {
                    SertImageGoods sg = new SertImageGoods();
                    sg.setSertImage(img);
                    Good good = entityManager.getReference(Good.class, goodUid);
                    sg.setGood(good);
                    sg.setId(new SertImageGoodsId(img.getUid(), goodUid));
                    allGoodsLinks.add(sg);
                });
            }
            //log.info("Processing image {} with series links: {}", uidImage, linkRequest.getSeriesUids().toString());    
            if (linkRequest.getSeriesUids() != null && !linkRequest.getSeriesUids().isEmpty()) {
                linkRequest.getSeriesUids().forEach(seriesUid -> {
                    SertImageSeries ss = new SertImageSeries();
                    ss.setSertImage(img);
                    Series series = entityManager.getReference(Series.class, seriesUid);
                    ss.setSeries(series);
                    ss.setId(new SertImageSeriesId(img.getUid(), seriesUid));
                    allSeriesLinks.add(ss);
                });
            }
        });

        // Batch save links
        if (!allGoodsLinks.isEmpty()) {
            sertImageGoodsBatchRepository.batchUpsertSertImageGoods(allGoodsLinks);
        }
        if (!allSeriesLinks.isEmpty()) {
            sertImageSeriesBatchRepository.batchUpsertSertImageSeries(allSeriesLinks);
        }

        return savedImages;
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
                row.getUidImage(),
                row.getSertUid(),
                row.getCertificateNumber(),
                row.getImagePath(), // Исправлено: getImagePath() вместо getImage()
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
         return autocomplete(type, query, null, null, null, 20); // по умолчанию 20 результатов
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
        return autocomplete(type, query, invoiceNumber, productName, seriesName, 20); // по умолчанию 20 результатов
    }

    /**
     * Автодополнение для полей поиска с иерархической фильтрацией и настраиваемым лимитом
     * @param type Тип данных (INVOICE, PRODUCT, SERIES, CERTIFICATE)
     * @param query Строка поиска
     * @param invoiceNumber Опциональный фильтр по номеру накладной
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

    private Sert upsertSertBySertNo(String sertNo) {
        String normalized = normalizeSertNo(sertNo);
        if (normalized == null) {
            return null;
        }

        return sertRepository.findFirstBySertNoIgnoreCase(normalized)
                .orElseGet(() -> createSertWithSertNo(normalized));
    }

    private Sert createSertWithSertNo(String sertNo) {
        Sert s = new Sert();
        s.setSertNo(sertNo);
        return sertRepository.save(s);
    }

    private String normalizeSertNo(String sertNo) {
        if (sertNo == null) return null;
        String trimmed = sertNo.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
    
    /**
     * Находит информацию о сертификате по UID изображения
     * @param imageUid UID изображения сертификата
     * @return Optional с информацией о сертификате
     */
    public Optional<CertificateInfoDto> findCertificateByImageUid(String imageUid) {
        return sertImageRepository.findById(imageUid)
            .map(sertImage -> {
                CertificateInfoDto dto = new CertificateInfoDto();
                dto.setUidImage(sertImage.getUid());
                dto.setImagePath(sertImage.getImage()); // Исправлено: getImage() вместо getImagePath()
                dto.setCreateTime(sertImage.getCreateTime());
                
                // Получаем информацию о сертификате
                if (sertImage.getSert() != null) {
                    dto.setSertUid(sertImage.getSert().getUid());
                    dto.setCertificateNumber(sertImage.getSert().getSertNo());
                }
                
                // Получаем информацию о привязках к товарам
                List<SertImageGoods> goodsLinks = sertImageGoodsRepository.findBySertImageUid(sertImage.getUid()); // Исправлено: через репозиторий
                if (goodsLinks != null && !goodsLinks.isEmpty()) {
                    SertImageGoods firstLink = goodsLinks.get(0); // Исправлено: get(0) вместо iterator()
                    if (firstLink.getGood() != null) {
                        dto.setProductUid(firstLink.getGood().getUid());
                        dto.setProductName(firstLink.getGood().getName());
                    }
                }
                
                // Получаем информацию о привязках к сериям
                List<SertImageSeries> seriesLinks = sertImageSeriesRepository.findBySertImageUid(sertImage.getUid()); // Исправлено: через репозиторий
                if (seriesLinks != null && !seriesLinks.isEmpty()) {
                    SertImageSeries firstLink = seriesLinks.get(0); // Исправлено: get(0) вместо iterator()
                    if (firstLink.getSeries() != null) {
                        dto.setSeriesUid(firstLink.getSeries().getUid());
                        dto.setSeriesName(firstLink.getSeries().getName());
                    }
                }
                
                // Определяем тип привязки
                if (dto.getSeriesUid() != null) {
                    dto.setLinkType("SERIES");
                } else if (dto.getProductUid() != null) {
                    dto.setLinkType("PRODUCT");
                } else {
                    dto.setLinkType("NONE");
                }
                
                return dto;
            });
    }
    
    /**
     * Находит информацию о сертификатах по списку UID изображений
     * @param imageUids список UID изображений сертификатов
     * @return список информации о сертификатах
     */
    public List<CertificateInfoDto> findCertificatesByImageUids(List<String> imageUids) {
        if (imageUids == null || imageUids.isEmpty()) {
            return Collections.emptyList();
        }
        
        return sertImageRepository.findAllById(imageUids).stream()
                .map(sertImage -> {
                    CertificateInfoDto dto = new CertificateInfoDto();
                    dto.setUidImage(sertImage.getUid());
                    dto.setImagePath(sertImage.getImage());
                    dto.setCreateTime(sertImage.getCreateTime());

                    if (sertImage.getSert() != null) {
                        dto.setSertUid(sertImage.getSert().getUid());
                        dto.setCertificateNumber(sertImage.getSert().getSertNo());
                    }

                    List<SertImageGoods> goodsLinks = sertImageGoodsRepository.findBySertImageUid(sertImage.getUid());
                    if (goodsLinks != null && !goodsLinks.isEmpty()) {
                        SertImageGoods firstGoodsLink = goodsLinks.get(0);
                        if (firstGoodsLink.getGood() != null) {
                            dto.setProductUid(firstGoodsLink.getGood().getUid());
                            dto.setProductName(firstGoodsLink.getGood().getName());
                        }
                    }

                    List<SertImageSeries> seriesLinks = sertImageSeriesRepository.findBySertImageUid(sertImage.getUid());
                    if (seriesLinks != null && !seriesLinks.isEmpty()) {
                        SertImageSeries firstSeriesLink = seriesLinks.get(0);
                        if (firstSeriesLink.getSeries() != null) {
                            dto.setSeriesUid(firstSeriesLink.getSeries().getUid());
                            dto.setSeriesName(firstSeriesLink.getSeries().getName());
                        }
                    }

                    if (dto.getSeriesUid() != null) {
                        dto.setLinkType("SERIES");
                    } else if (dto.getProductUid() != null) {
                        dto.setLinkType("PRODUCT");
                    } else {
                        dto.setLinkType("NONE");
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<CertificateInfoDto> findCertificatesByProductUids(List<String> productUids) {
        if (productUids == null || productUids.isEmpty()) {
            return Collections.emptyList();
        }

        return sertImageRepository.findByProductUids(productUids).stream()
                .map(sertImage -> {
                    CertificateInfoDto dto = new CertificateInfoDto();
                    dto.setUidImage(sertImage.getUid());
                    dto.setImagePath(sertImage.getImage());
                    dto.setCreateTime(sertImage.getCreateTime());

                    if (sertImage.getSert() != null) {
                        dto.setSertUid(sertImage.getSert().getUid());
                        dto.setCertificateNumber(sertImage.getSert().getSertNo());
                    }

                    List<SertImageGoods> goodsLinks = sertImageGoodsRepository.findBySertImageUid(sertImage.getUid());
                    if (goodsLinks != null && !goodsLinks.isEmpty()) {
                        SertImageGoods firstGoodsLink = goodsLinks.get(0);
                        if (firstGoodsLink.getGood() != null) {
                            dto.setProductUid(firstGoodsLink.getGood().getUid());
                            dto.setProductName(firstGoodsLink.getGood().getName());
                        }
                    }

                    List<SertImageSeries> seriesLinks = sertImageSeriesRepository.findBySertImageUid(sertImage.getUid());
                    if (seriesLinks != null && !seriesLinks.isEmpty()) {
                        SertImageSeries firstSeriesLink = seriesLinks.get(0);
                        if (firstSeriesLink.getSeries() != null) {
                            dto.setSeriesUid(firstSeriesLink.getSeries().getUid());
                            dto.setSeriesName(firstSeriesLink.getSeries().getName());
                        }
                    }

                    if (dto.getSeriesUid() != null) {
                        dto.setLinkType("SERIES");
                    } else if (dto.getProductUid() != null) {
                        dto.setLinkType("PRODUCT");
                    } else {
                        dto.setLinkType("NONE");
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }
}

