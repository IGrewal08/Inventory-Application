#! /usr/bin/env node
import { Client } from "pg";
import "dotenv/config";

const sql_create = `
    Create TABLE IF NOT EXISTS games (
  game_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  game_name VARCHAR(255) NOT NULL,
  game_price NUMERIC NOT NULL DEFAULT 0.0,
  game_quantity INT NOT NULL DEFAULT 0
);

Create TABLE IF NOT EXISTS developers (
  developer_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  developer_name VARCHAR(255) NOT NULL
);

Create TABLE IF NOT EXISTS genres (
  genre_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  genre_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS game_developers (
	game_id INT REFERENCES games(game_id),
 	developer_id INT REFERENCES developers(developer_id),
	PRIMARY KEY (game_id, developer_id)
);

CREATE TABLE IF NOT EXISTS game_genres (
  game_id INT REFERENCES games(game_id),
  genre_id INT REFERENCES genres(genre_id),
  PRIMARY KEY (game_id, genre_id)
);
`;

const sql_insert = `
INSERT INTO games (game_name, game_price, game_quantity) 
VALUES 
('Minecraft', 9.99, 10),
('GTA 5', 29.99, 15),
('Skyrim', 19.99, 20);

INSERT INTO developers (developer_name)
VALUES
('Mojang Studios'),
('Rockstar Games'),
('Bethesda Studios');

INSERT INTO genres (genre_name)
VALUES
('Advanture'),
('Action'),
('Role-Playing'),
('Shooter'),
('Platformer');
*/
/*
INSERT INTO game_developers (game_id, developer_id) 
VALUES (1, 1), (2, 2), (3, 3);

INSERT INTO game_genres (game_id, genre_id)
VALUES (1, 1), (1, 2), (2, 2), (2, 3), (2, 4), (3, 1), (3, 2);
`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: `postgresql://${process.env.USER}:${process.env.PASS}@localhost:5432/${process.env.DB}`;
    });
    await client.connect();
    await client.query(sql_create);
    await client.query(sql_insert);
    await client.end();
    console.log("seeding complete");
}


