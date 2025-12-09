package com.example.recipeDB.dto;

public record CommentDTO (
        Integer commentID,
        Integer recipeID,
        String content,
        String commenterUsername
)
{}
