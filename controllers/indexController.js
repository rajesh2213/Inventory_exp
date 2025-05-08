const { getAllGenres } = require('../models/genreModel');

exports.index = async (req, res) => {
    let genres = await getAllGenres();
    if(!genres) {
        genres = [];
    }
    res.render('../views/index', {genres: genres})
}

