import pool from "./pool.js";

const myQuery = `SELECT ga.game_name as name, ga.game_price as price, ga.game_quantity as quantity, game_description as description, 
STRING_AGG(DISTINCT developer_name, ', ') as developers, STRING_AGG(DISTINCT genre_name, ', ') as genres
FROM developers d
JOIN game_developers gd USING (developer_id)
JOIN games ga USING (game_id)
JOIN game_genres gg using (game_id)
JOIN genres ge USING (genre_id)
`;

const groupingQuery = ` GROUP BY game_name, game_price, game_quantity, game_description;`;

/* All Items from tables */
export const queryAllInventory = async () => {
  const { rows } = await pool.query(myQuery + groupingQuery);
  return rows;
};

export const queryAllGenres = async () => {
  const { rows } = await pool.query(
    "SELECT DISTINCT genre_id as id, genre_name as name FROM genres"
  );
  return rows;
};

export const queryAllDevelopers = async () => {
  const { rows } = await pool.query(
    "SELECT DISTINCT developer_id as id, developer_name as name FROM developers"
  );
  return rows;
};

/* Sort and Filter */
export const queryInventoryByFilter = async (query) => {
  const { genre, developer, sort } = query;
  let filterQuery = "";
  let sortQuery = "";

  let genreArray = [];
  let developerArray = [];

  if (genre != undefined || developer != undefined) {
    filterQuery = `
      WHERE
    `;

    if (genre != undefined) {
      !Array.isArray(genre)
        ? genreArray.push(genre)
        : (genreArray = [...genre]);
      if (genreArray.length === 1) {
        filterQuery += ` genre_name = '${genreArray[0]}' `;
      } else {
        const dynamicPlaceHolder = genreArray
          .map((element) => `'${element}'`)
          .join(", ");
        filterQuery += ` genre_name IN (${dynamicPlaceHolder})
      `;
      }
    }

    if (genre != undefined && developer != undefined) {
      filterQuery += " AND ";
    }

    if (developer != undefined) {
      !Array.isArray(developer)
        ? developerArray.push(developer)
        : (developerArray = [...developer]);
      if (developerArray.length === 1) {
        filterQuery += ` developer_name = '${developerArray[0]}' `;
      } else {
        const dynamicPlaceHolder = developerArray
          .map((element) => `'${element}'`)
          .join(", ");
        filterQuery += ` developer_name IN (${dynamicPlaceHolder})
      `;
      }
    }
  }

  if (sort != undefined) {
    const column = sort.split("_");
    const allowedSorts = ["price", "name", "ASC", "DESC"];
    if (allowedSorts.includes(column[0]) && allowedSorts.includes(column[1])) {
      sortQuery = ` ORDER BY ${column[0]} ${column[1]};`;
    }
  }

  const { rows } = await pool.query(
    myQuery +
      filterQuery +
      "GROUP BY game_name, game_price, game_quantity, game_description" +
      sortQuery
  );
  return rows;
};

export const queryProductBySearch = async (search) => {
  const updatedQuery =
    `WHERE UPPER(game_name) LIKE UPPER($1) OR UPPER(developer_name) LIKE UPPER($1)
    ` + groupingQuery;

  const { rows } = await pool.query(myQuery + updatedQuery, [`%${search}%`]);
  return rows;
};

/* Individual Items */
export const queryGetProduct = async (product) => {
  const { rows } = await pool.query(
    myQuery +
      `WHERE game_name = $1 
      ` +
      groupingQuery,
    [product]
  );
  return rows[0];
};

export const queryUpdateProduct = async (data) => {
  const { name, price, quantity, description, developer, genre, _name } = data;

  const { rows } = await pool.query(
    `SELECT game_id FROM games WHERE game_name = $1`,
    [_name]
  );
  const id = rows[0].game_id;

  await pool.query(`DELETE FROM game_developers WHERE game_id = $1`, [id]);
  await pool.query(`DELETE FROM game_genres WHERE game_id = $1`, [id]);
  await pool.query(
    `UPDATE games SET game_name=$1, game_price=$2, game_quantity=$3, game_description=$4 WHERE game_id=$5;`,
    [name, Number(price), Number(quantity), description, id]
  );

  insertNewDevGenres(id, developer, genre);
};

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

export const queryPostNewProduct = async (product) => {
  const { name, price, quantity, description, developer, genre } = product;
  let formattedDevelopers = developer.filter((element) => element != "-");
  let formattedGenres = genre.filter((element) => element != "-");
  formattedDevelopers = [...new Set(formattedDevelopers)];
  formattedGenres = [...new Set(formattedGenres)];

  await pool.query(
    "INSERT INTO games (game_name, game_price, game_quantity, game_description) VALUES ($1, $2, $3, $4)",
    [name, price, quantity, description]
  );
  const { rows } = await pool.query(
    "SELECT game_id FROM games WHERE game_name = $1",
    [name]
  );
  const id = rows[0].game_id;
  insertNewDevGenres(id, developer, genre);
};

export const queryPostGenre = async (genre) => {
  await pool.query("INSERT INTO genres (genre_name) VALUES ($1)", [genre]);
};

export const queryPostDeveloper = async (developer) => {
  await pool.query("INSERT INTO developers (developer_name) VALUES ($1)", [developer]);
};

async function insertNewDevGenres(id, developer, genre) {
  let formattedDevelopers = developer.filter((element) => element != "-");
  let formattedGenres = genre.filter((element) => element != "-");
  formattedDevelopers = [...new Set(formattedDevelopers)];
  formattedGenres = [...new Set(formattedGenres)];

  if (formattedDevelopers.length != 0) {
    let formattedString = "";
    for (let i = 0; i <= formattedDevelopers.length - 1; i++) {
      formattedString += `($1, $${i + 2})`;
      if (i != formattedDevelopers.length - 1) {
        formattedString += ", ";
      }
    }
    await pool.query(
      `INSERT INTO game_developers (game_id, developer_id) VALUES ${formattedString}`,
      [id, ...formattedDevelopers]
    );
  }

  if (formattedGenres.length != 0) {
    let formattedString = "";
    for (let i = 0; i <= formattedGenres.length - 1; i++) {
      formattedString += `($1, $${i + 2})`;
      if (i != formattedGenres.length - 1) {
        formattedString += ", ";
      }
    }
    await pool.query(
      `INSERT INTO game_genres (game_id, genre_id) VALUES ${formattedString}`,
      [id, ...formattedGenres]
    );
  }
}
