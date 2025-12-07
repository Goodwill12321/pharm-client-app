package com.pharma.clientapp.repository;

import com.pharma.clientapp.entity.ClientContact;
import org.springframework.data.jpa.repository.JpaRepository;
/*import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;*/

import java.util.List;
import java.util.Optional;

public interface ClientContactRepository extends JpaRepository<ClientContact, Long> {
    
    /*@Modifying
    @Transactional
    @Query("DELETE FROM ClientContact cc WHERE cc.contactUid = :contactUid")*/
    void deleteAllByContactUid(String contactUid);

    List<ClientContact> findByContactUid(String contactUid);

    Optional<ClientContact> findByClientUidAndContactUid(String clientUid, String contactUid);
}
