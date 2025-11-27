BEGIN;


-- Users
INSERT INTO users (userid, username, password, email) VALUES
(1,  'Jackson',     '5nP!g656',   'jtrader@pnw.edu'),
(2,  'Alex',        'T88aW9]%',   'bryan140@pnw.edu'),
(3,  'Diego',       'eP947=3X',   'larad@pnw.edu'),
(4,  'Mark',        'Q38h!0aS',   'packm@pnw.edu'),
(5,  'JohnathanT',  '5-oZ98yv',   'jtaylor22@gmail.com'),
(6,  'LebronJames', '5Tj}6£1C',   'ljamesking23@pnw.edu'),
(7,  'MariaR',      '2Kd77v+s',   'mariarom3@gmail.com'),
(8,  'RajPatel',    '23oW-u1O',   'raj53patel@gmail.com'),
(9,  'EmmaGreen',   '0a9X3>y',  'emma3442@yahoo.com'),  
(10, 'Betty',       '1c2Go7|#',   'bakerbetty64@proton.me');


SELECT setval('users_seq', (SELECT GREATEST(COALEdoesSCE(MAX(userid),0), 1) FROM users));

-- Recipes
INSERT INTO recipes
(recipeid, title, description, steps, prep_time, cook_time, servings, difficulty, image_url, upvotes, user_id)
VALUES
(1,
 'Classic Spaghetti Bolognese',
 'A traditional Italian pasta dish made with ground beef, tomato sauce, and aromatic herbs.',
 'Boil salted water and cook spaghetti until al dente. Heat olive oil in a large pan and sauté onions and garlic. Add ground beef and cook until browned. Stir in tomato sauce, diced tomatoes, and Italian herbs. Simmer for 30–40 minutes, stirring occasionally. Drain pasta and toss with sauce before serving.',
 15, 45, 4, 3, 'https://i.imgur.com/Gj1rbVs.jpeg', 0, 1),
(2,
 'Chicken Alfredo Pasta',
 'Creamy fettuccine pasta with grilled chicken and a rich Parmesan sauce.',
 'Cook fettuccine pasta according to package instructions. In a skillet, melt butter and add minced garlic. Pour in heavy cream and simmer for 3–4 minutes. Stir in Parmesan cheese until the sauce thickens. Add grilled chicken slices and combine with pasta. Garnish with parsley and serve warm.',
 10, 20, 3, 2, 'https://i.imgur.com/C7iDFd5.jpeg', 0, 2),
(3,
 'Vegetable Stir-Fry',
 'Quick and healthy stir-fried vegetables tossed in soy sauce and sesame oil.',
 'Wash and chop vegetables into bite-sized pieces. Heat sesame oil in a wok over high heat. Add garlic and ginger and stir-fry for 30 seconds. Toss in vegetables and cook for 5–7 minutes. Add soy sauce and stir until vegetables are tender. Serve hot with rice or noodles.',
 10, 10, 2, 1, 'https://i.imgur.com/2yCENAx.jpeg', 0, 3),
(4,
 'Homemade Margherita Pizza',
 'Fresh pizza dough topped with tomato sauce, mozzarella, and basil.',
 'Preheat oven to 475°F. Roll out pizza dough on a floured surface. Spread tomato sauce evenly across the dough. Add slices of mozzarella and fresh basil leaves. Drizzle with olive oil and bake for 12–15 minutes. Slice and serve immediately.',
 20, 15, 2, 3, 'https://i.imgur.com/Qxb6R7N.jpeg', 0, 4),
(5,
 'Beef Tacos',
 'Crispy taco shells filled with seasoned beef, lettuce, cheese, and salsa.',
 'Heat oil in a pan and cook ground beef until browned. Add taco seasoning and a splash of water and simmer for 5 minutes. Warm taco shells in the oven or on a pan. Fill shells with beef, lettuce, cheese, and salsa. Top with sour cream or avocado if desired.',
 10, 15, 4, 2, 'https://i.imgur.com/Hp9Ira1.jpeg', 0, 5),
(6,
 'Lemon Garlic Chicken',
 'Baked chicken breasts in a tangy lemon-garlic sauce.',
 'Preheat oven to 400°F. Mix lemon juice, minced garlic, olive oil, and herbs. Marinate chicken breasts for 15–30 minutes. Place in a baking dish and pour remaining marinade on top. Bake for 25 minutes or until fully cooked. Garnish with parsley and serve.',
 10, 25, 4, 2, 'https://i.imgur.com/37i7knX.jpeg', 0, 6),
(7,
 'Chocolate Chip Cookies',
 'Soft and chewy cookies loaded with chocolate chips.',
 'Preheat oven to 350°F. Cream butter, sugar, and brown sugar until smooth. Beat in eggs and vanilla extract. Stir in flour, baking soda, and salt. Fold in chocolate chips. Drop spoonfuls of dough onto a baking sheet. Bake 10–12 minutes until golden brown.',
 15, 10, 24, 2, 'https://i.imgur.com/nkifI8d.jpeg', 0, 7),
(8,
 'Caesar Salad',
 'Crisp romaine lettuce tossed with Caesar dressing, croutons, and Parmesan.',
 'Wash and chop romaine lettuce. Prepare dressing with mayonnaise, lemon juice, garlic, and Parmesan. Toss lettuce with dressing until evenly coated. Add croutons and extra Parmesan cheese. Serve immediately.',
 10, 0, 2, 1, 'https://i.imgur.com/79OPJRV.jpeg', 0, 8),
(9,
 'Pancakes',
 'Fluffy breakfast pancakes served with syrup and butter.',
 'In a bowl, whisk together flour, sugar, baking powder, and salt. Add milk, egg, and melted butter and stir until smooth. Heat a nonstick pan over medium heat. Pour ¼ cup of batter per pancake. Flip when bubbles appear and cook until golden. Serve with syrup or butter.',
 10, 10, 4, 1, 'https://i.imgur.com/a4R7WRd.jpeg', 0, 9),
(10,
 'Sushi Rolls',
 'Hand-rolled sushi filled with rice, nori, cucumber, and tuna.',
 'Cook sushi rice and season with rice vinegar, sugar, and salt. Place a sheet of nori on a bamboo mat. Spread rice evenly, leaving a small edge uncovered. Add fillings such as tuna, cucumber, or avocado. Roll tightly using the mat and seal with water. Slice into pieces and serve with soy sauce.',
 30, 0, 4, 5, 'https://i.imgur.com/JbQh5QW.jpeg', 0, 10);


SELECT setval('recipes_seq', (SELECT GREATEST(COALESCE(MAX(recipeid),0), 1) FROM recipes));


-- Recipe Tags

-- 1: Bolognese
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(1, 'HIGH_PROTEIN');

-- 2: Chicken Alfredo
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(2, 'HIGH_PROTEIN'),
(2, 'QUICK_EASY');

-- 3: Veg Stir-Fry
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(3, 'VEGAN'),
(3, 'QUICK_EASY');

-- 4: Margherita Pizza
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(4, 'VEGETARIAN');

-- 5: Beef Tacos
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(5, 'HIGH_PROTEIN'),
(5, 'QUICK_EASY');

-- 6: Lemon Garlic Chicken
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(6, 'HIGH_PROTEIN'),
(6, 'DAIRY_FREE'),
(6, 'LOW_CARB'),
(6, 'KETO');

-- 7: Cookies
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(7, 'DESSERT');

-- 8: Caesar Salad
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(8, 'APPETIZER'),
(8, 'QUICK_EASY');

-- 9: Pancakes
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(9, 'DESSERT'),
(9, 'QUICK_EASY');

-- 10: Sushi
INSERT INTO recipe_tags (recipe_recipeid, tags) VALUES
(10, 'HIGH_PROTEIN'),
(10, 'DAIRY_FREE');

-- Recipe Ingredients 
-- 1: Bolognese
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(1, 'PASTA'),
(1, 'BEEF'),
(1, 'TOMATOES'),
(1, 'ONIONS'),
(1, 'GARLIC'),
(1, 'OLIVE_OIL'),
(1, 'BASIL');

-- 2: Chicken Alfredo
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(2, 'PASTA'),
(2, 'CHICKEN'),
(2, 'BUTTER'),
(2, 'MILK'),
(2, 'CHEESE'),
(2, 'GARLIC');

-- 3: Veg Stir-Fry
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(3, 'GARLIC'),
(3, 'ONIONS'),
(3, 'CARROTS'),
(3, 'PEAS'),
(3, 'SPINACH'),
(3, 'MUSHROOMS'),
(3, 'OLIVE_OIL');

-- 4: Margherita Pizza
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(4, 'FLOUR'),
(4, 'TOMATOES'),
(4, 'CHEESE'),
(4, 'BASIL'),
(4, 'OLIVE_OIL');

-- 5: Beef Tacos
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(5, 'BEEF'),
(5, 'LETTUCE'),
(5, 'CHEESE'),
(5, 'TOMATOES'),
(5, 'ONIONS');

-- 6: Lemon Garlic Chicken
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(6, 'CHICKEN'),
(6, 'GARLIC'),
(6, 'OLIVE_OIL'),
(6, 'BASIL');

-- 7: Chocolate Chip Cookies
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(7, 'FLOUR'),
(7, 'BUTTER'),
(7, 'EGGS'),
(7, 'SUGAR'),
(7, 'CHOCOLATE'),
(7, 'VANILLA');

-- 8: Caesar Salad
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(8, 'LETTUCE'),
(8, 'CHEESE'),
(8, 'BREAD'),
(8, 'OLIVE_OIL'),
(8, 'VINEGAR');

-- 9: Pancakes
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(9, 'FLOUR'),
(9, 'MILK'),
(9, 'EGGS'),
(9, 'BUTTER'),
(9, 'SUGAR'),
(9, 'VANILLA');

-- 10: Sushi Rolls
INSERT INTO recipe_ingredients (recipe_recipeid, ingredients) VALUES
(10, 'RICE'),
(10, 'CUCUMBERS'),
(10, 'SALMON');


-- COMMENTS
INSERT INTO comments (text, user_id, recipe_id) VALUES
('So good! The sauce was perfect.', 2, 1),
('Added mushrooms and it slapped.', 3, 1),
('Easy weeknight dinner.', 5, 2),
('Kids loved these cookies.', 7, 7),
('Great recipe.', 8, 1),
('Needed more garlic for my taste.', 6, 6),
('Super quick and tasty!', 4, 3),
('Crust came out crispy. Nice.', 9, 4);

-- UPVOTES
INSERT INTO upvotes (user_id, recipe_id) VALUES
(1,1),(2,1),(3,1),(4,2),(5,7),(6,6),(8,4),(9,4);

UPDATE recipes r
SET upvotes = u.cnt
FROM (SELECT recipe_id, COUNT(*) AS cnt FROM upvotes GROUP BY recipe_id) u
WHERE r.recipeid = u.recipe_id;

COMMIT;
