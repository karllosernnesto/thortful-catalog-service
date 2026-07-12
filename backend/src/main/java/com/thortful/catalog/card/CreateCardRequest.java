package com.thortful.catalog.card;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateCardRequest(
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 80) String artist,
        @NotNull CardCategory category,
        @NotNull @DecimalMin("0.01") @DecimalMax("999.99") @Digits(integer = 3, fraction = 2) BigDecimal price) {
}
