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

const sql_games_data = [
  { name: "EA Sports FC", price: 69.99, quantity: 30 },
  { name: "Marvel's SpiderMan", price: 49.99, quantity: 50 },
  { name: "Grand Turismo 7", price: 69.99, quantity: 80 },
  { name: "Stardew Valley", price: 14.99, quantity: 100 },
  { name: "Elden Ring", price: 59.99, quantity: 120 },
  { name: "The Last of Us Part 2 RE", price: 49.99, quantity: 100 },
  { name: "Grand Theft Auto", price: 19.99, quantity: 150 },
  { name: "Forza Horizon 5", price: 59.99, quantity: 25 },
  { name: "Assassin's Creed Shadows", price: 69.99, quantity: 150 },
  { name: "Far Cry 5", price: 59.99, quantity: 125 },
  { name: "Kingdom Come: Deliverance 2", price: 69.99, quantity: 200 },
  { name: "Dark Souls 2", price: 29.99, quantity: 50 },
  { name: "Witcher 3: Wild Hunt", price: 49.99, quantity: 100 },
  { name: "Resident Evil 7 biohazard", price: 19.99, quantity: 60 },
  { name: "L.A. Noire", price: 19.99, quantity: 25 },
];

const sql_developers_data = [
  { name: "Electronic Arts Inc" },
  { name: "Sony Interactive Entertainment" },
  { name: "ConcernedApe LLC" },
  { name: "Bandai Namco Entertainment America" },
  { name: "FromSoftware" },
  { name: "Rockstar Games" },
  { name: "Microsoft Co." },
  { name: "Turn10 Studios" },
  { name: "Ubisoft Entertainment" },
  { name: "Deep Silver" },
  { name: "CD Projekt SA" },
  { name: "Capcom Co." },
];

const sql_genres_data = [
  { genre: "Sport" },
  { genre: "Action" },
  { genre: "Driving" },
  { genre: "Racing" },
  { genre: "Simulation" },
  { genre: "Role Playing" },
  { genre: "Adventure" },
  { genre: "Shooter" },
];

const game_values = sql_games_data
  .map((data) => `('${data.name}', ${data.price}, ${data.quantity})`)
  .join(", ");
const developer_values = sql_developers_data
  .map((data) => `('${data.name}')`)
  .join(", ");
const genre_values = sql_genres_data
  .map((data) => `('${data.name}')`)
  .join(", ");
const sql_insert = `
INSERT INTO games (game_name, game_price, game_quantity) 
VALUES ${game_values};

INSERT INTO developers (developer_name)
VALUES ${developer_values};

INSERT INTO genres (genre_name)
VALUES ${genre_values};

INSERT INTO game_developers (game_id, developer_id) 
VALUES (1, 1), (2, 2), (3, 2), (4, 3), (5, 4), (5, 5), (6, 2), (7, 6), (8, 7), (8, 8), (9, 9), (10, 9), (11, 10), (12, 4), (12, 5), (13, 11), (14, 12), (15, 6);

INSERT INTO game_genres (game_id, genre_id)
VALUES (1, 1), (2, 2), (3, 3), (3, 4), (4, 5), (4, 6), (4, 7), (5, 6), (6, 2), (6, 7), (7, 2), (7, 7), (8, 3), (8, 4), (9, 6), (10, 2), (10, 8), (11, 6), (12, 6), (12, 7), (13, 6), (13, 2), (14, 2), (14, 7), (15, 2), (15, 7);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.ROLE_NAME}@localhost:5432/${process.env.DATABASE_NAME}`,
  });
  await client.connect();
  await client.query(sql_create);
  await client.query(sql_insert);
  await client.end();
  console.log("seeding complete");
}

main();
