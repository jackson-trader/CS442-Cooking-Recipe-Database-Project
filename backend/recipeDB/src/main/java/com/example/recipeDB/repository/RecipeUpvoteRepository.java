package com.example.recipeDB.repository;

import com.example.recipeDB.models.Recipe;
import com.example.recipeDB.models.RecipeUpvote;
import com.example.recipeDB.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecipeUpvoteRepository extends JpaRepository<RecipeUpvote, Integer> {
    long countByRecipe(Recipe recipe);
    boolean existsByRecipeAndUser(Recipe recipe, User User);
    void deleteByRecipeAndUser(Recipe recipe, User User);
    Optional<RecipeUpvote> findByRecipeAndUser(Recipe recipe, User user);
}
