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
@Table(name = "Rating")
@Data
@NoArgsConstructor
public class Rating {
  @Column(name = "rating_id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int ratingId;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = true)
  @JsonBackReference(value = "user-rating")
  private UserEntity user;

  @ManyToOne
  @JoinColumn(name = "recipe_id", nullable = true)
  @JsonBackReference(value = "recipe-rating")
  private Recipe recipe;

  @Column(name = "value")
  private int value;
}
