package com.thortful.catalog.card;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CardApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CardRepository repository;

    @Test
    void seedsRealisticCatalogVolume() {
        org.assertj.core.api.Assertions.assertThat(repository.count()).isEqualTo(CardSeedData.SEED_COUNT);
    }

    @Test
    void returnsAPageWithStableNewestFirstSorting() throws Exception {
        mockMvc.perform(get("/api/cards").param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(5)))
                .andExpect(jsonPath("$.content[0].id").value(1_200))
                .andExpect(jsonPath("$.content[1].id").value(1_199))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(5))
                .andExpect(jsonPath("$.totalElements").value(1_200))
                .andExpect(jsonPath("$.totalPages").value(240))
                .andExpect(jsonPath("$.first").value(true))
                .andExpect(jsonPath("$.last").value(false));
    }

    @Test
    void searchesTitleAndArtistCaseInsensitively() throws Exception {
        mockMvc.perform(get("/api/cards").param("search", "bIrThDaY").param("size", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(200))
                .andExpect(jsonPath("$.content[*].title", everyItem(org.hamcrest.Matchers.containsString("Birthday"))));

        mockMvc.perform(get("/api/cards").param("search", "maya patel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(80))
                .andExpect(jsonPath("$.content[*].artist", everyItem(is("Maya Patel"))));
    }

    @Test
    void combinesSearchAndCategoryFiltering() throws Exception {
        mockMvc.perform(get("/api/cards")
                        .param("search", "Maya Patel")
                        .param("category", "ANNIVERSARY"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(40))
                .andExpect(jsonPath("$.content[*].artist", everyItem(is("Maya Patel"))))
                .andExpect(jsonPath("$.content[*].category", everyItem(is("ANNIVERSARY"))));
    }

    @Test
    void rejectsInvalidPaginationAndCategoryValues() throws Exception {
        mockMvc.perform(get("/api/cards").param("page", "-1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request parameter"));

        mockMvc.perform(get("/api/cards").param("size", "101"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request parameter"));

        mockMvc.perform(get("/api/cards").param("category", "NOT_A_CATEGORY"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request parameter"));
    }

    @Test
    void createsAValidatedCardAndReturnsItsLocation() throws Exception {
        mockMvc.perform(post("/api/cards")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "  A Brilliant New Adventure  ",
                                  "artist": "  Jamie Stone  ",
                                  "category": "CONGRATULATIONS",
                                  "price": 3.49
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.matchesPattern("/api/cards/\\d+")))
                .andExpect(jsonPath("$.id", greaterThan(1_200)))
                .andExpect(jsonPath("$.title").value("A Brilliant New Adventure"))
                .andExpect(jsonPath("$.artist").value("Jamie Stone"))
                .andExpect(jsonPath("$.category").value("CONGRATULATIONS"))
                .andExpect(jsonPath("$.price").value(3.49))
                .andExpect(jsonPath("$.createdAt").exists());
    }

    @Test
    void returnsFieldErrorsForAnInvalidCard() throws Exception {
        mockMvc.perform(post("/api/cards")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": " ",
                                  "artist": "",
                                  "category": null,
                                  "price": 0
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request"))
                .andExpect(jsonPath("$.errors.title").exists())
                .andExpect(jsonPath("$.errors.artist").exists())
                .andExpect(jsonPath("$.errors.category").exists())
                .andExpect(jsonPath("$.errors.price").exists());
    }

    @Test
    void deletesAnExistingCardAndReturnsNotFoundWhenRepeated() throws Exception {
        mockMvc.perform(delete("/api/cards/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/cards/1"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Card not found"))
                .andExpect(jsonPath("$.detail").value("Card 1 was not found"));
    }
}
