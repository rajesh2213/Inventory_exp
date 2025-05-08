const pool = require('../models/pool');

const getAllGenres = async () => {
    try{
        const { rows } = await pool.query('SELECT * FROM genres')
        return rows;
    }catch(err){
        console.error('Error fetching genres', err);
    }
}

async function addGenre(name) {
    try{
        await pool.query('INSERT INTO genres (name) VALUES ($1)', [name]);
    }catch(err){
        if (err.code === '23505') { // Unique constraint violation
            console.error('Genre already exists');
            throw new Error('Genre already exists');
        } else {
            console.error('Error adding genre', err);
        }
    }
}

async function getGenreById(id) {
    try {
        const result = await pool.query('SELECT * FROM genres WHERE id = $1', [id]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Error fetching genre by ID:', err);
        throw err;
    }
}

async function editGenre(id, name) {
    try {
        await pool.query('UPDATE genres SET name = $1 WHERE id = $2', [name, id]);
    } catch (err) {
        if(err.code === '23505') { 
            console.error('Genre already exists');
            throw new Error('Genre already exists');
        }else{
            console.error('Error updating genre:', err);
            throw err;
        }
    }
}


module.exports = {
    getAllGenres,
    addGenre,
    getGenreById,
    editGenre
}