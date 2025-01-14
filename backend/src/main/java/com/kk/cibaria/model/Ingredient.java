package com.kk.cibaria.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Ingredient")
@Data
@NoArgsConstructor
public class Ingredient {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private int id;
  @Column(name = "ingredient_name")
  private String ingredientName;
  @Column(name = "quantity")
  private int quantity;
  @Column(name = "unit")
  private String unit;

  @ManyToOne
  @JoinColumn(name = "recipe_id", nullable = true)
  @JsonBackReference
  private Recipe recipe;
}
