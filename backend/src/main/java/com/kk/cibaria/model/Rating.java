package com.kk.cibaria.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "Rating")
public class Rating {
  @Column(name = "rating_id")
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int ratingId;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnore
  private User user;

  @ManyToOne
  @JoinColumn(name = "recipe_id", nullable = false)
  @JsonIgnore
  private Recipe recipe;

  @Column(name = "value")
  private int value;

  public Rating() {
  }

  public Rating(User user, Recipe recipe, int value) {
    this.user = user;
    this.recipe = recipe;
    this.value = value;
  }

  public int getRatingId() {
    return ratingId;
  }

  public void setRatingId(int ratingId) {
    this.ratingId = ratingId;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Recipe getRecipe() {
    return recipe;
  }

  public void setRecipe(Recipe recipe) {
    this.recipe = recipe;
  }

  public int getValue() {
    return value;
  }

  public void setValue(int value) {
    this.value = value;
  }

}
