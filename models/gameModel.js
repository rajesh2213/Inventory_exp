const pool = require('../models/pool');

const addGame = async (name, description, releaseDt, genreId, developerId) => {
    try{
        const results = await pool.query(`
            INSERT INTO games (title, description, release_date) 
            VALUES ($1, $2, $3) RETURNING id   
        `, [name, description || null, releaseDt])

        const gameId = results.rows[0].id

        await pool.query(`
            INSERT INTO game_genres (game_id, genre_id) 
            VALUES ($1, $2)
        `, [gameId, genreId])

        await pool.query(`
            INSERT INTO game_developers (game_id, developer_id) 
            VALUES ($1, $2)
        `, [gameId, developerId])
    }
    catch(err){
        if(err.code === '23505') { 
            console.error('Game already exists');
            throw new Error('Game already exists');
        } else {
            console.error('Error adding game', err);
            throw err;
        }
    }
}

const getGamesByGenre = async (genreId) => {
    try {
        const { rows } = await pool.query(`
            SELECT games.id, games.title, games.description, games.release_date, 
            g.id AS genre_id, g.name AS genre_name, 
            d.id AS developer_id, d.name AS developer_name, d.country AS developer_country
            FROM games
            JOIN game_genres gg ON games.id = gg.game_id
            JOIN game_developers gd ON games.id = gd.game_id
            JOIN genres g ON g.id = gg.genre_id
            JOIN developers d ON d.id = gd.developer_id
            WHERE g.id = $1
            ORDER BY games.release_date DESC
        `, [genreId]);
        return rows;
    } catch (err) {
        console.error('Error fetching games by genre:', err);
        throw err;
    }
}

module.exports = {
    addGame,
    getGamesByGenre
}