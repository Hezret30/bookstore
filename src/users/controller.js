const pool = require('../../db')
const queries = require('./queries')
const fs = require('fs')
const bcrypt = require('bcrypt')

///////////////////////////// USERS /////////////////////////////


const getUser = async (req, res) => {
    const id = req.id
    
    const { rows } = await pool.query(queries.getUser, [id])
    res.status(200).json(rows)      
}


const getUserBooks = async (req, res) => {
    const id = req.id

    const { rows } = await pool.query(queries.getUserBooks, [id])
    res.status(200).json(rows)
}


const getUserBook = async (req, res) => {
    const id = req.id
    const book_id = req.params.id
    
    const { rows } = await pool.query(queries.getUserBook, [book_id, id])

    if (rows.length === 0) {
        res.status(404).send({message : "NO"})
    } else {
        res.status(200).json(rows)
    }
}


const updateUser = (req, res) => {
    const user_id = req.id
    const { username, phone, email, city} = req.body

    pool.query(queries.updateUser, [username, phone, email, city, user_id], (err, _) => {
        if (err) throw err
        res.status(200).json({ message: 'SUCCESS'})
    })

}


const changePassword = async (req, res) => {
    const user_id = req.id
    const { new_password, confirm_password } = req.body

    if (new_password !== confirm_password) {
        res.send({ message: "NOT MATCH"})
    } else {
        let hashedPassword = await bcrypt.hash(new_password, 10)
        pool.query(queries.changePassword, [hashedPassword, user_id], (err, _) => {
            if (err) throw err
            res.status(200).json({ message: 'SUCCESS'})
        })
    }
}



const deleteUser = (req, res) => {
    const user_id = req.id

    pool.query(queries.deleteUser, [user_id], (err, _) => {
        if (err) throw err
        res.status(200).json({ message: 'SUCCESS'})
    })
}



///////////////////////////// BOOKS /////////////////////////////

const addBook = async (req, res) => {
    const id = req.id
    const files = req.files
    const { title, author, description, language, category_id, price } = req.body
    const errors = []

    if (files.length === 0) {
        errors.push({ message: "NO PHOTO"})
    } 
    
    if (!title || !author || !description || !language || !category_id || !price) {
        errors.push({ message: 'ALL FIELDS REQUIRED'})
    }
    
    if (errors.length > 0) {
        if (files.length >= 1) {
            fs.unlinkSync(`src/static/users_books/${files[0].filename}`)
        }

        res.send(errors)
    } else {
        const img_url = 'localhost:8000/static/users_books/' + files[0].filename
        
        pool.query(queries.addBook, [title, author, img_url, description, language, category_id, price, id], (err, _) => {
            if (err) throw err
            res.status(200).send({ message: "SUCCESS" })
        })
    }
}


const updateBook = async (req, res) => {
    const user_id = req.id
    const book_id = req.params.id
    const files = req.files
    const { title, author, img_url, description, language, category_id, price } = req.body

    const { rows } = await pool.query(queries.getUserBook, [book_id, user_id])

    if (rows.length === 0) {
        if (files.length >= 1) {
            fs.unlinkSync(`src/static/users_books/${files[0].filename}`)
        }
        res.status(404).send({message : "NO"})
    }

    else if (files.length === 0) {
        pool.query(queries.updateBookNoImage, [title, author, description, language, category_id, price, book_id, user_id], (error, _) => {
            if (error) throw error
            res.status(200).send({message : `Book with ID ${book_id} was updated!`})
        })
    } 

    else if (files.length != 0) {
        console.log('changes');
        const oldImage = img_url.split('/')
        const img_name = 'localhost:8000/static/users_books/' + files[0].filename
        fs.unlinkSync(`src/static/users_books/${oldImage[oldImage.length - 1]}`)
        pool.query(queries.updateBookWithImage, [title, author, img_name, description, language, category_id, price, book_id, user_id], (error, _) => {
            if (error) throw error
            res.status(200).send(`Book with ID ${book_id} was updated!`)
        })
    }
}  


const deleteBook = async (req, res) => {
    const user_id = req.id
    const book_id = req.params.id
    const { img_url } = req.body

    const { rows } = await pool.query(queries.getUserBook, [book_id, user_id])

    if (rows.length === 0) {
        res.status(404).send({message : "NO"})
    } else {
        const oldImage = img_url.split('/')
        pool.query(queries.deleteBook, [book_id, user_id], (err, _) => {
            if (err) throw err
            fs.unlinkSync(`src/static/users_books/${oldImage[oldImage.length - 1]}`)
            res.status(200).json({ message: `BOOK ID ${book_id} DELETED`})
        })
    }
}


module.exports = {
    getUser,
    getUserBooks,
    getUserBook,
    updateUser,
    deleteUser,
    changePassword,
    addBook,
    updateBook,
    deleteBook,
}