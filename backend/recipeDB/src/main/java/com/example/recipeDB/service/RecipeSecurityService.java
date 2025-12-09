package com.example.recipeDB.service;

import com.example.recipeDB.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RecipeSecurityService {
    private final RecipeRepository recipeRepository;

    public boolean isOwner(int recipeId, Authentication auth) {
      var recipe = recipeRepository.findById(recipeId).orElse(null);
      if (recipe == null || recipe.getOwner() == null) {
          return false;
      }
        return recipe.getOwner().getUsername().equals(auth.getName());
    }
}
