require('dotenv').config();
const { Client } = require('pg');

const sql = `
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(255) NOT NULL,
        release_date DATE,
        description VARCHAR(255)
    );
    
    CREATE TABLE IF NOT EXISTS genres (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS developers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        country TEXT
    );

    CREATE TABLE IF NOT EXISTS game_genres (
        game_id INTEGER REFERENCES games(id) ON DELETE RESTRICT,
        genre_id INTEGER REFERENCES genres(id) ON DELETE RESTRICT,
        PRIMARY KEY (game_id, genre_id)
    );

    CREATE TABLE IF NOT EXISTS game_developers (
        game_id INTEGER REFERENCES games(id) ON DELETE RESTRICT,
        developer_id INTEGER REFERENCES developers(id) ON DELETE RESTRICT,
        PRIMARY KEY (game_id, developer_id)
    );
`

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

const createTables = async () => {
    try{
        await client.connect();
        await client.query(sql);
        console.log('Tables created successfully');
    }catch(err){
        console.error('Error creating tables', err);
    }finally{
        await client.end();
    }
}
createTables();