package com.example.recipeDB.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;


@Setter
@Getter
@Entity
@Slf4j
@Table(
        name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = {"username", "email"})
)
public class User {
    @Id
    // TODO: later we can get rid of this and use generation auto, this was to match the SQL scripts
    @SequenceGenerator(
            name = "users_seq_gen",
            sequenceName = "users_seq",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq_gen")
    private Integer userID;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false, length = 255)
    private String password;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Recipe> recipes = new ArrayList<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();
}
