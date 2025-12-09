package com.example.recipeDB.models;


import com.example.recipeDB.enums.Ingredient;
import com.example.recipeDB.enums.Tag;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(
        name = "recipes"
)
public class Recipe {
    @Id
    // TODO: later we can get rid of this and use generation auto, this was to match the SQL scripts
    @SequenceGenerator(
            name = "recipes_seq_gen",
            sequenceName = "recipes_seq",
            allocationSize = 1 //
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "recipes_seq_gen")
    private Integer recipeID;
    private String title;
    private String description;
    private Integer prepTime;
    private Integer cookTime;
    private Integer servings;
    private Integer difficulty;
    // set default value to 0
    private Integer upvotes = 0;

    @Column(length = 5000)
    private String steps;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User owner;

//    private String recipeOwner;

    private String imageUrl;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Tag> tags;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private List<Ingredient> ingredients;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
}
