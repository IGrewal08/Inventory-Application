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
('EA Sports FC, 69.99, 30),
('Marvel's Spider-Man RE', 49.99, 50),
('Grand Turismo 7', 69.99, 80),
('Stardew Valley', 14.99, 100),
('Elden Ring', 59.99, 120),
('The Last of Us Part 2 RE', 49.99, 100),
('Grand Theft Auto', 19.99, 150),
('Forza Horizon 5', 59.99, 25),

INSERT INTO developers (developer_name)
VALUES
('Electronic Arts Inc'),
('Sony Interactive Entertainment'),
('ConcernedApe LLC'),
('Bandai Namco Entertainment America'),
('FromSoftware'),
('Rockstar Games'),
('Microsoft Co.'),
('Turn10 Studios'),

INSERT INTO genres (genre_name)
VALUES
('Sport'),
('Action'),
('Driving'),
('Racing'),
('Simulation'),
('Role Playing'),
('Adventure'),

INSERT INTO game_developers (game_id, developer_id) 
VALUES (1, 1), (2, 2), (3, 2), (4, 3), (5, 4), (5, 5), (6, 2), (7, 6), (8, 7), (8, 8), ;

INSERT INTO game_genres (game_id, genre_id)
VALUES (1, 1), (2, 2), (3, 3), (3, 4), (4, 5), (4, 6), (4, 7), (5, 6), (6, 2), (6, 7), (7, 2), (7, 7) (8, 3), (8, 4);
`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: `postgresql://${process.env.ROLE_NAME}:${process.env.ROLE_PASSWORD}@localhost:5432/${process.env.DATABASE_NAME}`,
    });
    await client.connect();
    await client.query(sql_create);
    await client.query(sql_insert);
    await client.end();
    console.log("seeding complete");
}

main();

