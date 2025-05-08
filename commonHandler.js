const validateKey = (key) => {
    if (!key || key != process.env.KEY) {
        return false
    }
    return true
}

const formatCountries = (countries) => {
    return countries.map((country) => {
        return { name: country.name.common, flag: country.flags.png }
    }).sort((a, b) => a.name.localeCompare(b.name))
}

const getCountries = async () => {
    const url = 'https://restcountries.com/v3.1/independent?status=true&fields=name,flags';
    const now = Date.now()
    let catchedCountries = null;
    let lastFetch = null
    const CACHE_DURATION = 1000 * 60 * 60 * 24
    if(!catchedCountries || (now - lastFetch) > CACHE_DURATION){
        try{
            const response = await fetch(url);
            const data = await response.json();
            if(!data || data.length === 0){
                throw new Error('No countries found')
            }
            catchedCountries = formatCountries(data);
            lastFetch = now
        }catch(err){
            console.error('Error fetching countries', err)
            throw err;
        }
    }
    return catchedCountries
}

module.exports = {
    validateKey,
    formatCountries,
    getCountries
}