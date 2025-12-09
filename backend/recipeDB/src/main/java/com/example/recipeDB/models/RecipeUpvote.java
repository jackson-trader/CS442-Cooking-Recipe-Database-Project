package com.example.recipeDB.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "recipe_upvotes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"recipe_id", "user_id"})
)
@Getter
@Setter
public class RecipeUpvote {

    @Id
    @SequenceGenerator(
            name = "recipe_upvotes_seq_gen",
            sequenceName = "recipe_upvotes_seq",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "recipe_upvotes_seq_gen")
    private Integer id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
