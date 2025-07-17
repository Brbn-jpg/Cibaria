package com.kk.cibaria.step;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.kk.cibaria.recipe.Recipe;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Step {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "recipeId")
    @JsonBackReference
    private Recipe recipe;

    public Step(String content, Recipe recipe){
        this.content=content;
        this.recipe = recipe;
    }
}
