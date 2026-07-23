package com.thortful.catalog.card;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CardService {

    static final Sort CATALOG_SORT = Sort.by(
            Sort.Order.desc("createdAt"),
            Sort.Order.desc("id"));

    private final CardRepository repository;
    private final Clock clock;

    public CardService(CardRepository repository) {
        this.repository = repository;
        this.clock = Clock.systemUTC();
    }

    @Transactional(readOnly = true)
    public Page<CardResponse> findCards(String search, CardCategory category, int page, int size,
                                        Double minPrice, Double maxPrice) {
        String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
        BigDecimal price_min = minPrice != null ? BigDecimal.valueOf(minPrice) : null;
        BigDecimal price_max = maxPrice != null ? BigDecimal.valueOf(maxPrice) : null;
        PageRequest pageRequest = PageRequest.of(page, size, CATALOG_SORT);

        return repository.findCatalog(normalizedSearch, category, price_min, price_max, pageRequest)
                .map(CardResponse::from);
    }

    @Transactional
    public CardResponse create(CreateCardRequest request) {
        Card card = new Card(
                request.title().trim(),
                request.artist().trim(),
                request.category(),
                request.price(),
                LocalDateTime.now(clock));

        return CardResponse.from(repository.save(card));
    }

    @Transactional
    public void delete(long id) {
        if (!repository.existsById(id)) {
            throw new CardNotFoundException(id);
        }
        repository.deleteById(id);
    }
}
