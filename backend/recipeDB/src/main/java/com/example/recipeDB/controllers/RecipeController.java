package com.example.recipeDB.controllers;


import com.example.recipeDB.dto.CommentDTO;
import com.example.recipeDB.dto.RecipeDTO;
import com.example.recipeDB.enums.Ingredient;
import com.example.recipeDB.enums.Tag;
import com.example.recipeDB.helper.Utils;
import com.example.recipeDB.models.Comment;
import com.example.recipeDB.models.Recipe;
import com.example.recipeDB.models.RecipeUpvote;
import com.example.recipeDB.models.User;
import com.example.recipeDB.repository.CommentRepository;
import com.example.recipeDB.repository.RecipeRepository;
import com.example.recipeDB.repository.RecipeUpvoteRepository;
import com.example.recipeDB.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final RecipeUpvoteRepository recipeUpvoteRepository;

    public RecipeController(RecipeRepository recipeRepository, UserRepository userRepository,
                            CommentRepository commentRepository, RecipeUpvoteRepository recipeUpvoteRepository) {
        this.recipeRepository = recipeRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.recipeUpvoteRepository = recipeUpvoteRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/create")
    public String createRecipe(
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam Integer prepTime,
        @RequestParam Integer cookTime,
        @RequestParam Integer servings,
        @RequestParam Integer difficulty,
        @RequestParam String steps,
        @RequestParam List<Tag> tags,
        @RequestParam String imageUrl,
        @RequestParam List<Ingredient> ingredients,
        Authentication auth
    ) {
        Recipe recipe = new Recipe();
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow( () -> new IllegalStateException("User not found"));

        recipe.setTitle(title);
        recipe.setDescription(description);
        recipe.setPrepTime(prepTime);
        recipe.setCookTime(cookTime);
        recipe.setServings(servings);
        recipe.setDifficulty(difficulty);
        recipe.setSteps(steps);
        recipe.setTags(tags);
        recipe.setImageUrl(imageUrl);
        recipe.setIngredients(ingredients);
        recipe.setOwner(user);
        recipeRepository.save(recipe);
        return "Recipe created";
    }

    @GetMapping("/all")
    public List<RecipeDTO> all() {
        return recipeRepository.findAll().stream()
                .map(r -> {
                    long upvoteCount = recipeUpvoteRepository.countByRecipe(r);
                    return Utils.mapToRecipeDTO(r, upvoteCount);
                })
                .toList();
    }

    @GetMapping("/r/byId/{recipeID}")
    public RecipeDTO getRecipeById(@PathVariable int recipeID) {
        Recipe recipe = recipeRepository.findById(recipeID).orElse(null);
        assert recipe != null;
        long upvoteCount = recipeUpvoteRepository.countByRecipe(recipe);
        return Utils.mapToRecipeDTO(recipe, upvoteCount);
    }

    @GetMapping("/u/{username}")
    public List<RecipeDTO> getRecipesByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        assert user != null;
        return user.getRecipes().stream()
                .map(r -> {
                    long upvoteCount = recipeUpvoteRepository.countByRecipe(r);
                    return Utils.mapToRecipeDTO(r, upvoteCount);
                })
                .toList();
    }

    @PreAuthorize("@recipeSecurityService.isOwner(#recipeID, authentication)")
    @PutMapping("/r/{recipeID}/edit")
    public ResponseEntity<Recipe> editRecipe(
            @PathVariable int recipeID,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer prepTime,
            @RequestParam(required = false) Integer cookTime,
            @RequestParam(required = false) Integer servings,
            @RequestParam(required = false) Integer difficulty,
            @RequestParam(required = false) String steps,
            @RequestParam(required = false) List<Tag> tags,
            @RequestParam(required = false) String imageUrl,
            @RequestParam(required = false) List<Ingredient> ingredients
    ) {
        Recipe recipe = recipeRepository.findById(recipeID).orElseThrow(
                () -> new IllegalStateException("Recipe with ID " + recipeID + " does not exist.")
        );
        if(title != null) recipe.setTitle(title);
        if(description != null) recipe.setDescription(description);
        if(prepTime != null) recipe.setPrepTime(prepTime);
        if(cookTime != null) recipe.setCookTime(cookTime);
        if(servings != null) recipe.setServings(servings);
        if(difficulty != null) recipe.setDifficulty(difficulty);
        if(steps != null) recipe.setSteps(steps);
        if(tags != null) recipe.setTags(tags);
        if(imageUrl != null) recipe.setImageUrl(imageUrl);
        if(ingredients != null) recipe.setIngredients(ingredients);

        recipeRepository.save(recipe);
        return ResponseEntity.ok(recipe);
    }

    @PreAuthorize("@recipeSecurityService.isOwner(#recipeID, authentication)")
    @DeleteMapping("/r/{recipeID}/delete")
    public ResponseEntity<?> deleteRecipe(
            @PathVariable int recipeID
    ) {
        Recipe recipe = recipeRepository.findById(recipeID).orElse(null);
        if (recipe == null) {
            return ResponseEntity.notFound().build();
        }
        recipeRepository.delete(recipe);
        return ResponseEntity.ok("Deleted recipe with ID " + recipeID);
    }

    @GetMapping("/tags")
    public List<RecipeDTO> getByTags(@RequestParam List<Tag> tags) {
        if (tags == null || tags.isEmpty()) return List.of();
        return recipeRepository.findDistinctByTagsIn(tags)
                .stream()
                .map(r -> {
                    long upvoteCount = recipeUpvoteRepository.countByRecipe(r);
                    return Utils.mapToRecipeDTO(r, upvoteCount);
        }).toList();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/r/{recipeID}/comment")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable int recipeID,
            @RequestParam String text,
            Authentication auth
    ) {
        Recipe recipe = recipeRepository.findById(recipeID).orElseThrow(
                () -> new IllegalStateException("Recipe with ID " + recipeID + " does not exist.")
        );
        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow( () -> new IllegalStateException("User not found"));

        Comment comment = new Comment();
        comment.setText(text);
        comment.setRecipe(recipe);
        comment.setAuthor(user);
        Comment saved = commentRepository.save(comment);

        CommentDTO response = new CommentDTO(
                saved.getId(),
                saved.getRecipe().getRecipeID(),
                saved.getText(),
                saved.getAuthor().getUsername()
        );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("isAuthenticated()")
    @Transactional
    @PostMapping("/r/{recipeID}/upvote")
    public ResponseEntity<?> toggleUpvote(
            @PathVariable int recipeID,
            Authentication auth
    ) {
        Recipe recipe = recipeRepository.findById(recipeID)
                .orElseThrow(() -> new IllegalStateException(
                        "Recipe with ID " + recipeID + " not found"));

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        var existingOpt = recipeUpvoteRepository.findByRecipeAndUser(recipe, user);

        final boolean nowUpvoted;
        if (existingOpt.isPresent()) {
            recipeUpvoteRepository.delete(existingOpt.get());
            nowUpvoted = false;
        } else {
            RecipeUpvote upvote = new RecipeUpvote();
            upvote.setRecipe(recipe);
            upvote.setUser(user);
            recipeUpvoteRepository.save(upvote);
            nowUpvoted = true;
        }

        long newCount = recipeUpvoteRepository.countByRecipe(recipe);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "upvotes", newCount,
                        "upvoted", nowUpvoted
                )
        );
    }

}
