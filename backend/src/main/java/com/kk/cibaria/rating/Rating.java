package com.kk.cibaria.rating;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.kk.cibaria.recipe.Recipe;
import com.kk.cibaria.user.UserEntity;
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
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int ratingId;

  @ManyToOne
  @JoinColumn(name = "user_id")
  @JsonBackReference("user")
  private UserEntity user;

  @ManyToOne
  @JoinColumn(name = "recipe_id")
  @JsonBackReference("rating")
  private Recipe recipe;

  private int value;
}
