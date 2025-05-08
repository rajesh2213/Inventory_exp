const { validateKey, getCountries } = require('../commonHandler');
const { addGame, getGamesByGenre } = require('../models/gameModel');
const { getAllGenres } = require('../models/genreModel');
const { getAllDevelopers } = require('../models/developerModel');


const game_create_get = async (req,res) =>{
    let genres = await getAllGenres()
    let developers = await getAllDevelopers()
    if(!genres) genres = [];
    if(!developers) developers = [];
    res.render('../views/game/form', {isEdit: false, genres:genres, developers:developers, error: null})
}

const game_create_post = async (req,res) =>{
    const genres = await getAllGenres()
    const developers = await getAllDevelopers()
    const { name, description, releaseDt, selectedGenre, selectedDeveloper, key} = req.body
    console.log(name, description, releaseDt, selectedGenre, selectedDeveloper, key)
    if(!validateKey(key)){
        res.status(400).render('../views/game/form', {isEdit: false, genres:genres,developers:developers, error: 'Secret key is wrong'})
        return
    }
    try{
        await addGame(name, description, releaseDt, selectedGenre, selectedDeveloper);
        res.redirect('/')
    }catch(err){
        if(err.message === 'Game already exists'){
            res.status(400).render('../views/game/form', {isEdit: false, genres:genres,developers:developers, error: 'Game already exists'})
        }else{
            res.status(500).render('../views/game/form', {isEdit: false, genres:genres,developers:developers, error: 'Internal Server Error...Please try again'})
        }
    }
}

const game_list_by_genre = async (req,res) =>{
    const genreId = req.params.genreId
    let games = null;
    let countries = null;
    try{
        const gameData = await getGamesByGenre(genreId)
        countries = await getCountries();
        if(!gameData || gameData.length === 0){
            res.status(404).render('../views/game/list', {games: [],byGenre: false, error: 'No games found for this genre'})
            return;
        }
        
        games = gameData.map((game)=>{
            const match = countries.find((country)=> country.name == game.developer_country)
            return {
                ...game,
                developer_countryFlag: match ? match.flag : null
            }
        })
        console.log(games[0])
        res.render('../views/game/list', {games: games ,byGenre: true, error: null})
    }catch(err){
        console.error('Error fetching games by genre:', err);
        res.status(500).render('../views/game/list', {games: games,byGenre: false, error: 'Internal Server Error...Please try again'})
    }
}



module.exports = {
    game_create_get,
    game_create_post,
    game_list_by_genre
}