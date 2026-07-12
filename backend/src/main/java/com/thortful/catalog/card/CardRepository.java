package com.thortful.catalog.card;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardRepository extends JpaRepository<Card, Long> {

    @Query("""
            SELECT card FROM Card card
            WHERE (:search IS NULL
                OR LOWER(card.title) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(card.artist) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:category IS NULL OR card.category = :category)
            """)
    Page<Card> findCatalog(
            @Param("search") String search,
            @Param("category") CardCategory category,
            Pageable pageable);
}
