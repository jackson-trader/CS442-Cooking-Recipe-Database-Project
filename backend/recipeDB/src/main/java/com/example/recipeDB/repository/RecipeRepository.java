package com.example.recipeDB.repository;

import com.example.recipeDB.enums.Tag;
import com.example.recipeDB.models.Recipe;
import com.example.recipeDB.models.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

import java.util.Collection;
import java.util.List;

public interface RecipeRepository extends CrudRepository<Recipe, Integer> {
    List<Recipe> findDistinctByTagsIn(Collection<Tag> tags);

    @EntityGraph(attributePaths = "owner")
    List<Recipe> findAll();
}
