package com.kk.cibaria.model;


import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Recipe")
@Data
@NoArgsConstructor
public class Recipe {
  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "recipe_name")
  private String recipeName;

  @Column(name = "created_at")
  private Date createdAt;

  @Column(name = "difficulty")
  private int difficulty;

  @Column(name = "ingredients")
  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<Ingredient> ingredients;

  @Column(name = "prepare_time")
  private int prepareTime; // in minutes

  @Column(name = "servings")
  private int servings;

  @Column(name = "category")
  private String category;

  @Column(name = "tag")
  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference
  private List<Tag> tag;

  @Column(name = "rating")
  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonManagedReference(value = "recipe-rating")
  private List<Rating> ratings;

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(referencedColumnName = "id",name = "file_id")
  @JsonManagedReference
  private FileEntity file;

}
