const pool =  require('../../db')
const queries = require('./queries')

const getBooks = async (req, res) => {

    const { page, limit, sort_by } = req.query
    console.log(req.query);
    const offset = page * limit - limit

    console.log(sort_by);

    const { rows } = await pool.query(`SELECT id, title, author, price FROM books ORDER BY ${sort_by} LIMIT ${limit} OFFSET ${offset}`)

    res.status(200).json(rows)
}

const getBook = async (req, res) => {
    let id = req.params.id

    const { rows } = await pool.query(queries.getBook, [id])
    const errors = []

    if (rows.length === 0) errors.push({ message: 'BOOK NOT EXISTS!'})
    
    if (errors.length > 0) {
        res.status(404).send(errors)
    } else {
        res.status(200).json(rows)
    }   
}

const getBooksByCategory = async (req, res) => {
    let id = req.params.id
    
    const { rows } = await pool.query(queries.getBooksByCategory, [id])
    const errors = []
    
    if (rows.length === 0) errors.push({ message: 'CATEGORY NOT EXISTS!'})
    
    if (errors.length > 0) {
        res.status(404).send(errors)
    } else {
        res.status(200).json(rows)
    }
}


const getCategories = async (req, res) => {
    const {rows} = await pool.query(queries.getCategories)
    res.status(200).json(rows)
}



module.exports = {
    getBooks,
    getBook,
    getBooksByCategory,
    getCategories,
}
