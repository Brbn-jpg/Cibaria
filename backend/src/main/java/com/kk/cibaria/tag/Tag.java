package com.kk.cibaria.tag;

import com.fasterxml.jackson.annotation.JsonBackReference;

import com.kk.cibaria.recipe.Recipe;
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
@Table(name = "Tag")
@Data
@NoArgsConstructor
public class Tag {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  private String tagName;

  @ManyToOne
  @JoinColumn(name = "recipe_id")
  @JsonBackReference("tag")
  private Recipe recipe;
}
