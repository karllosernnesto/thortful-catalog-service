package com.thortful.catalog.card;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class CardSeedData implements ApplicationRunner {

    static final int SEED_COUNT = 1_200;
    private static final LocalDateTime SEED_START = LocalDateTime.of(2025, 1, 1, 9, 0);

    private static final String[] ARTISTS = {
            "Maya Patel", "Theo Clarke", "Sofia Bennett", "Noah Williams", "Amara Okafor",
            "Leo Martins", "Freya Hughes", "Milo Chen", "Nina Rossi", "Oscar Green",
            "Layla Ahmed", "Elliot Price", "Ivy Morgan", "Ravi Shah", "Clara Evans"
    };

    private static final String[] STYLES = {
            "Bright", "Cheeky", "Colourful", "Cosy", "Floral",
            "Joyful", "Minimal", "Playful", "Retro", "Whimsical"
    };

    private static final String[] MESSAGES = {
            "Another Brilliant Year", "Best Day Ever", "Big Happy Wishes", "Celebrate in Style",
            "Cheers to You", "For a Wonderful Human", "Good Things Ahead", "Hip Hip Hooray",
            "Made with Love", "Sending All the Joy", "So Much to Celebrate", "You Are Amazing"
    };

    private final CardRepository repository;

    public CardSeedData(CardRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) {
            return;
        }

        CardCategory[] categories = CardCategory.values();
        List<Card> cards = new ArrayList<>(SEED_COUNT);
        for (int index = 0; index < SEED_COUNT; index++) {
            CardCategory category = categories[index % categories.length];
            String title = "%s %s - %s"
                    .formatted(STYLES[index % STYLES.length], displayName(category), MESSAGES[index % MESSAGES.length]);
            String artist = ARTISTS[index % ARTISTS.length];
            BigDecimal price = BigDecimal.valueOf(249 + (index % 151), 2);
            LocalDateTime createdAt = SEED_START.plusMinutes(index);
            cards.add(new Card(title, artist, category, price, createdAt));
        }

        repository.saveAll(cards);
    }

    private String displayName(CardCategory category) {
        return switch (category) {
            case NEW_BABY -> "New Baby";
            case THANK_YOU -> "Thank You";
            default -> category.name().charAt(0) + category.name().substring(1).toLowerCase();
        };
    }
}
