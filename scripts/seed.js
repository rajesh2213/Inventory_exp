require('dotenv').config();

const { Client } = require('pg')
const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

async function seed() {
    try {
        await client.connect()

        // await client.query(`
        //     DELETE FROM games; DELETE FROM genres; DELETE FROM developers; 
        //     DELETE FROM game_genres; DELETE FROM game_developers;`)

        await client.query(`
            TRUNCATE TABLE games, genres, developers, game_genres, game_developers RESTART IDENTITY CASCADE;
            `)    
            
        const { rows: [r1] } = await client.query(`
                INSERT INTO games (title, release_date, description) 
                VALUES ($1, $2, $3)
            `, ['The Legend of Zelda: Breath of the Wild', '2017-03-03', 'An open-world action-adventure game set in a fantasy world.'])

        const { rows: [d1] } = await client.query(`
                INSERT INTO developers (name, country) 
                VALUES ($1, $2)
            `, ['Nintendo', 'Japan'])

        const { rows: [g1] } = await client.query(`
                INSERT INTO genres (name) 
                VALUES ($1)
            `, ['Action-Adventure'])

        console.log('Inserted game, developer, and genre')

        await client.query(`
            INSERT into game_genres (game_id, genre_id)
            VALUES ((SELECT id from games where title = $1), 
            (SELECT id from genres where name = $2))
            `, ['The Legend of Zelda: Breath of the Wild', 'Action-Adventure'])

        await client.query(`
            INSERT INTO game_developers (game_id, developer_id)
            VALUES ((SELECT id FROM games WHERE title = $1),
            (SELECT id FROM developers WHERE name = $2))
            `, ['The Legend of Zelda: Breath of the Wild', 'Nintendo'])

        console.log('Linked game, genre and developer')

    } catch (err) {
        console.error('Error seeding database', err)
    } finally {
        await client.end()
    }
}
seed()
