package com.thortful.catalog.card;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CardResponse(
        Long id,
        String title,
        String artist,
        CardCategory category,
        BigDecimal price,
        LocalDateTime createdAt) {

    public static CardResponse from(Card card) {
        return new CardResponse(
                card.getId(),
                card.getTitle(),
                card.getArtist(),
                card.getCategory(),
                card.getPrice(),
                card.getCreatedAt());
    }
}
