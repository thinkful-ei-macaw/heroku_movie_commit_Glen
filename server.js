require('dotenv').config();

const express = require('express')
const morgan = require('morgan')
console.log(process.env.API_TOKEN)
const app = express()
const store = require('./store')
const cors = require('cors')

// const API_TOKEN = process.env.API_TOKEN


app.use(morgan('dev'))
app.use(cors())

function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
}



function handleGetTypes(req, res) {

    let filterData = [...store];

    // When searching by average vote, users are searching for Movies with an avg_vote that is greater than or equal to the supplied number.

    for (let key in req.query) {
        console.log(key, filterData.length)

        if (key === 'avg_vote') {
            filterData = filterData.filter(movie => movie.avg_vote >= parseFloat(req.query.avg_vote))
            console.log("After vote filtering", filterData.length)
        } else {
            filterData = filterData.filter(movie => movie[key].toLowerCase() === req.query[key].toLowerCase())
        }
    }
    //variable country is identical to req.query["country"]

    return res.json(filterData)
}


app.get('/movie', validateBearerToken, handleGetTypes)


const PORT = 8000
// const PORT = process.env.port || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})