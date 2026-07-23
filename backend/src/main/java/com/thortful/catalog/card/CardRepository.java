package com.thortful.catalog.card;

import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CardRepository extends JpaRepository<Card, Long> {

    // filter by price range, search, and category
    @Query("""
            SELECT card FROM Card card
            WHERE (:search IS NULL
                OR LOWER(card.title) LIKE LOWER(CONCAT('%', :search, '%'))
                OR LOWER(card.artist) LIKE LOWER(CONCAT('%', :search, '%')))
            AND (:category IS NULL OR card.category = :category)
            AND (:minPrice IS NULL OR card.price >= :minPrice)
            OR (:maxPrice IS NULL OR card.price <= :maxPrice)
            """)
    Page<Card> findCatalog(
            @Param("search") String search,
            @Param("category") CardCategory category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
}
