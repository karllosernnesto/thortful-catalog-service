package com.thortful.catalog.card;

public class CardNotFoundException extends RuntimeException {

    public CardNotFoundException(long id) {
        super("Card %d was not found".formatted(id));
    }
}
