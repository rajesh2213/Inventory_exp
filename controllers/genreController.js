require('dotenv').config()
const { validateKey } = require('../commonHandler')
const { addGenre, getGenreById, editGenre } = require('../models/genreModel');

exports.genre_create_get = async (req, res) =>{
    res.render('../views/genre/form', {title: 'Create Genre', error: null})
}

exports.genre_create_post = async (req, res) =>{
    const { name , key} = req.body
    console.log(name, key)
    if(!key || key != process.env.KEY){
        res.status(501).render('../views/genre/form', {title: 'Create Genre', error: 'Secret key is wrong'})
        return
    }
    try{
        await addGenre(name);
        res.redirect('/')
    }catch(err){
        if(err.message === 'Genre already exists'){
            res.status(400).render('../views/genre/form', {title: 'Create Genre', error: 'Genre already exists'})
        }else{
            res.status(500).render('../views/genre/form', {title: 'Create Genre', error: 'Internal Server Error...Please try again'})
        }
    }
}

exports.genre_edit_get = async (req,res)=>{
    const id  = req.params.genreId
    const {name} = await getGenreById(id)
    res.render('../views/genre/form', {title: 'Edit Genre', error: null, name: name, id: id})
}

exports.genre_edit_post = async (req,res)=>{
    const id = req.params.genreId
    const {name, key} = req.body

    if(!validateKey(key)){
        res.status(400).render('../views/genre/form', {title: 'Edit Genre', error: 'Secret key is wrong', name: name, id: id})
        return
    }
    try{
        await editGenre(id, name)
        res.redirect('/')
    }catch(err){
        if(err.message === 'Genre already exists'){
            res.status(400).render('../views/genre/form', {title: 'Edit Genre', error: 'Genre already exists', name: name, id: id})
        }else{
            res.status(500).render('../views/genre/form', {title: 'Edit Genre', error: 'Internal Server Error...Please try again', name: name, id: id})
        }
    }
}