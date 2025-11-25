BEGIN;


DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipe_tags CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP SEQUENCE IF EXISTS users_seq CASCADE;
DROP SEQUENCE IF EXISTS recipes_seq CASCADE;


CREATE SEQUENCE users_seq START 1;
CREATE SEQUENCE recipes_seq START 1;


CREATE TABLE users (
    userid     INTEGER PRIMARY KEY DEFAULT nextval('users_seq'),
    username   VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    CONSTRAINT uq_users_username_email UNIQUE (username, email)
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_username ON users (username);


CREATE TABLE recipes (
    recipeid     INTEGER PRIMARY KEY DEFAULT nextval('recipes_seq'),
    title        VARCHAR(255) NOT NULL,
    description  TEXT,                    
    prep_time    INTEGER,
    cook_time    INTEGER,
    servings     INTEGER,
    difficulty   INTEGER,
    upvotes      INTEGER DEFAULT 0 NOT NULL,
    steps        VARCHAR(5000),
    image_url    TEXT,
    user_id      INTEGER NOT NULL,

    CONSTRAINT fk_recipes_user
        FOREIGN KEY (user_id) REFERENCES users(userid)
        ON DELETE CASCADE
);

CREATE INDEX idx_recipes_user_id ON recipes (user_id);
CREATE INDEX idx_recipes_title ON recipes (title);

CREATE TABLE recipe_tags (
    recipe_recipeid INTEGER NOT NULL,
    tags            VARCHAR(64) NOT NULL,
    CONSTRAINT fk_recipe_tags_recipe
        FOREIGN KEY (recipe_recipeid) REFERENCES recipes(recipeid)
        ON DELETE CASCADE,
    CONSTRAINT ck_recipe_tags_valid
        CHECK (tags IN (
            'VEGAN',
            'VEGETARIAN',
            'GLUTEN_FREE',
            'DAIRY_FREE',
            'KETO',
            'PALEO',
            'LOW_CARB',
            'HIGH_PROTEIN',
            'QUICK_EASY',
            'DESSERT',
            'APPETIZER'
        )),
    CONSTRAINT pk_recipe_tags PRIMARY KEY (recipe_recipeid, tags)
);


CREATE INDEX idx_recipe_tags_tag ON recipe_tags (tags);


CREATE TABLE recipe_ingredients (
    recipe_recipeid INTEGER NOT NULL,
    ingredients     VARCHAR(64) NOT NULL,
    CONSTRAINT fk_recipe_ingredients_recipe
        FOREIGN KEY (recipe_recipeid) REFERENCES recipes(recipeid)
        ON DELETE CASCADE,
    CONSTRAINT ck_recipe_ingredients_valid
        CHECK (ingredients IN (
            'SUGAR','SALT','FLOUR','BUTTER','EGGS','MILK',
            'CHICKEN','BEEF','RICE','PASTA','TOMATOES','ONIONS',
            'GARLIC','PEPPER','CHEESE','LETTUCE','CARROTS','POTATOES',
            'CUCUMBERS','OLIVE_OIL','VINEGAR','CHOCOLATE','HONEY','VANILLA',
            'CINNAMON','BASIL','OREGANO','BREAD','SHRIMP','HALIBUT',
            'SPINACH','SALMON','MUSHROOMS','PEAS'
        )),
    CONSTRAINT pk_recipe_ingredients PRIMARY KEY (recipe_recipeid, ingredients)
);


CREATE INDEX idx_recipe_ingredients_ing ON recipe_ingredients (ingredients);



DROP TABLE IF EXISTS upvotes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;


CREATE TABLE comments (
    commentid    SERIAL PRIMARY KEY,
    text         VARCHAR(1000) NOT NULL,
    user_id      INTEGER NOT NULL,
    recipe_id    INTEGER NOT NULL,
    created_at   TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE,
    CONSTRAINT fk_comments_recipe
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipeid) ON DELETE CASCADE
);
CREATE INDEX idx_comments_recipe ON comments (recipe_id);
CREATE INDEX idx_comments_user   ON comments (user_id);


CREATE TABLE upvotes (
    user_id     INTEGER NOT NULL,
    recipe_id   INTEGER NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW() NOT NULL,
    CONSTRAINT fk_upvotes_user
        FOREIGN KEY (user_id) REFERENCES users(userid) ON DELETE CASCADE,
    CONSTRAINT fk_upvotes_recipe
        FOREIGN KEY (recipe_id) REFERENCES recipes(recipeid) ON DELETE CASCADE,
    CONSTRAINT pk_upvotes PRIMARY KEY (user_id, recipe_id)
);
CREATE INDEX idx_upvotes_recipe ON upvotes (recipe_id);

COMMIT;
