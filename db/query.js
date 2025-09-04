import pool from './pool.js';

const myQuery = 
    `SELECT ga.game_name, STRING_AGG(DISTINCT developer_name, ', ') as developers, STRING_AGG(DISTINCT genre_name, ', ') as genres
    FROM developers d
    JOIN game_developers gd USING (developer_id)
    JOIN games ga USING (game_id)
    JOIN game_genres gg using (game_id)
    JOIN genres ge USING (genre_id)
`;

async function getAllInventory() {
    const updatedQuery = myQuery +
    `GROUP BY game_name
    `;
    const { rows } = await pool.query(updatedQuery);
    return rows;
}

async function getInventoryByQuery(query) { // incomplete
    const updatedQuery = myQuery + 
    ` WHERE game_name IN (SELECT ga.game_name
        FROM developers d
        JOIN game_developers gd USING (developer_id)
        JOIN games ga USING (game_id)
        JOIN game_genres gg using (game_id)
        JOIN genres ge USING (genre_id)
        WHERE genre_name IN ('Action', 'Adventure') AND developer_name IN ('Mojang Studios', 'Rockstar Games')          //replace with query params
        GROUP By game_name
        HAVING COUNT(DISTINCT genre_name) = 2 AND COUNT(DISTINCT developer_name) = 2)           //number = num of queries params
        GROUP BY game_name
    `;
    const { rows } = await pool.query(updatedQuery);
    return rows;
}

async function getProductBySearch(search) {
    const updatedQuery = myQuery +
    `WHERE UPPER(game_name) LIKE UPPER('%$1%') OR UPPER(developer_name) LIKE UPPER('%$1%')
    GROUP BY game_name
    `;
    const { rows } = await pool.query(updatedQuery, [search]);
    return rows;
}

async function updateProductByName(product, data) {
    
}

async function deleteProductByName(product) {
    const deleteQuery = `DELETE FROM games WHERE game_id = $1 
        DELETE FROM game_developers WHERE game_id = $1
        DELETE FROM game_genres WHERE game_id = $1
    `;
    const productId = await pool.query('SELECT game_id FROM games WHERE game_name = $1', [product]);
    await pool.query(deleteQuery, [productId]);
}



export default { getAllInventory, getInventoryByQuery, getProductBySearch, deleteProductByName };