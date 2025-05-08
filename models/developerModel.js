const pool = require('../models/pool')
async function addDeveloper(name, country){
    try{
        await pool.query(`
            INSERT INTO developers (name, country)
            VALUES ($1, $2)    
        `,[name, country])
    }catch(err){
        if(err.code === '23505'){   
            console.error('Developer already exists')
            throw new Error('Developer already exists')
        }else{
            console.error('Error adding developer', err)
        }
    }
}

async function getAllDevelopers(){
    try{
        const {rows} = await pool.query(`
            SELECT * FROM developers;  
            `)
        return rows
    }catch(err){
        console.error('Error Fetching Developers')
    }
}

module.exports = {
    addDeveloper,
    getAllDevelopers
}