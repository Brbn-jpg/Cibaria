package com.kk.cibaria.user;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import com.kk.cibaria.rating.Rating;
import com.kk.cibaria.recipe.Recipe;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class UserEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "username")
  private String username;

  @Column(name = "password")
  private String password;

  @Column(name = "email")
  private String email;

  @Column(name = "role")
  private String role = "USER";

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  @JsonManagedReference("user")
  private List<Rating> rating;

  @ManyToMany
  @JoinTable(name = "favourite_recipes",
  joinColumns = @JoinColumn(name = "user_id"),
  inverseJoinColumns = @JoinColumn(name = "recipe_id"))
  List<Recipe> favouriteRecipes;

}
