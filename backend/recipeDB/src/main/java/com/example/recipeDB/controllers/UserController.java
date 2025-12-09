package com.example.recipeDB.controllers;

import com.example.recipeDB.models.User;
import com.example.recipeDB.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController()
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @PostMapping("/create")
    public String createUser(
            @RequestParam String username,
            @RequestParam String email,
            @RequestParam String password
    ) {
        if(userRepository.existsByUsername(username)) {
            return "Username already exists";
        }

        if(userRepository.existsByEmail(email)) {
            return "Email already exists";
        }

        User user = new User();
        String encoded = passwordEncoder.encode(password);
        user.setUsername(username);
        user.setPassword(encoded);
        user.setEmail(email);
        userRepository.save(user);
        return "User created";
    }

    @GetMapping("/all")
    public Iterable<User> getUsers() {
        return userRepository.findAll();
    }
    @GetMapping("/i/{id}")
    public User getUserById(@PathVariable int id) {
        return userRepository.findById(id).orElse(null);
    }

    @GetMapping("/u/{username}")
    public Optional<User> getUserByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username);
    }

}
