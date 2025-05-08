const { formatCountries, validateKey, getCountries } = require('../commonHandler');
const { addDeveloper } = require('../models/developerModel');

exports.developer_create_get =async (req, res) =>{
    try{        
        const countries = await getCountries();
        res.render('../views/developer/form', {isEdit: false, error: null, countries:countries})

    }catch(err){
        res.render('../views/developer/form', {isEdit: false, error: 'Internal Server Error...Please try again', countries:null})
    }
}

exports.developer_create_post = async (req, res) =>{
    let countries = null;
    try{
        countries = await getCountries();
        const { name, country, key} = req.body
        if(!validateKey(key)){
            res.status(400).render('../views/developer/form', {isEdit: false, error: 'Secret key is wrong', countries:countries})
            return;
        }
        await addDeveloper(name, country);
        res.redirect('/')
    }catch(err){
        if(err.message === 'Developer already exists'){
            res.status(400).render('../views/developer/form', {isEdit: false, error: 'Developer already exists', countries:countries})
        }else{
            res.status(500).render('../views/developer/form', {isEdit: false, error: 'Internal Server Error...Please try again', countries:countries})
        }
        console.error('Error adding developer', err)
    }
}