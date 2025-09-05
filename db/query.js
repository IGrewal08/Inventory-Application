import pool from "./pool.js";

const myQuery = `SELECT ga.game_name as name, ga.game_price as price, ga.game_quantity as quantity,
STRING_AGG(DISTINCT developer_name, ', ') as developers, STRING_AGG(DISTINCT genre_name, ', ') as genres
FROM developers d
JOIN game_developers gd USING (developer_id)
JOIN games ga USING (game_id)
JOIN game_genres gg using (game_id)
JOIN genres ge USING (genre_id)
`;

export const queryAllInventory = async () => {
  const { rows } = await pool.query(
    myQuery + "GROUP BY game_name, game_price, game_quantity;"
  );
  return rows;
};

export const queryAllGenres = async () => {
    const { rows } = await pool.query('SELECT DISTINCT genre_name as name FROM genres');
    return rows;
}

export const queryInventoryByFilter = async (query) => {
  // incomplete
  const updatedQuery = ` WHERE game_name IN (SELECT ga.game_name
        FROM developers d
        JOIN game_developers gd USING (developer_id)
        JOIN games ga USING (game_id)
        JOIN game_genres gg using (game_id)
        JOIN genres ge USING (genre_id)
        WHERE genre_name IN ('Action', 'Adventure') AND developer_name IN ('Mojang Studios', 'Rockstar Games')          //replace with query params
        GROUP By game_name
        HAVING COUNT(DISTINCT genre_name) = 2 AND COUNT(DISTINCT developer_name) = 2)           //number = num of queries params
        GROUP BY game_name, game_price, game_quantity;
    `;
  const { rows } = await pool.query(myQuery + updatedQuery);
  return rows;
};

export const queryProductBySearch = async (search) => {
  const updatedQuery = `WHERE UPPER(game_name) LIKE UPPER($1) OR UPPER(developer_name) LIKE UPPER($1)
    GROUP BY game_name, game_price, game_quantity;
    `;

  const { rows } = await pool.query(myQuery + updatedQuery, [`%${search}%`]);
  return rows;
};

export const queryUpdateProduct = async (product, data) => {};

export const queryDeleteProduct = async (product) => {
  const deleteQuery = `DELETE FROM games WHERE game_id = $1 
        DELETE FROM game_developers WHERE game_id = $1
        DELETE FROM game_genres WHERE game_id = $1
`;
  const productId = await pool.query(
    "SELECT game_id FROM games WHERE game_name = $1",
    [product]
  );
  await pool.query(deleteQuery, [productId]);
};
