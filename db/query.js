import pool from './pool.js';

async function getAllInventory() {
    const myQuery = `
        SELECT ga.game_name, STRING_AGG(DISTINCT developer_name, ', ') as developers, STRING_AGG(DISTINCT genre_name, ', ') as genres
        FROM developers d
        JOIN game_developers gd USING (developer_id)
        JOIN games ga USING (game_id)
        JOIN game_genres gg using (game_id)
        JOIN genres ge USING (genre_id)
        GROUP BY game_name;
    `;
    const { rows } = await pool.query(myQuery);
    return rows;
}