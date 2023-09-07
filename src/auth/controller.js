const bcrypt = require('bcrypt')
const pool = require('../../db')
const { env } = require('../../config/config')
const create_token = require('../tool/token')
const jwt = require('jsonwebtoken')


const sign_up = async (req, res, next) => {
    let {username, phone, email, city, password} = req.body
    
    let errors = []
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email])

    if (rows.length) {
        res.status(400).json({ message: 'User with this email exits!'})
    } else {
        let hashedPassword = await bcrypt.hash(password, 10)
        pool.query('INSERT INTO users (username, phone, email, city, password) VALUES ($1, $2, $3, $4, $5)', [username, phone, email, city, hashedPassword], (error, _) => {
            if (error) throw error
            res.send({ message: "SUCCESS"})
            next()
        })
    }
}


const sign_in = async (req, res) => {
    
    const user_info = req.body

    async function get_user  (user) {
        const { rows } = await pool.query('SELECT id, email, password FROM users WHERE email = $1', [user.email])
        if (rows.length === 0) return 0

        const validPassword = await bcrypt.compare(user.password, rows[0].password)
        if (!validPassword) return 0

        // console.log(rows[0]);
        return rows[0].id
    }

    const id = await get_user(user_info)
    // console.log(id);

    if (id === 0) return res.status(400).send('Invalid email or password')

    const access_token = create_token(id, env.access_key, env.access_time)
    const refresh_token = create_token(id, env.refresh_key, env.refresh_time)

    return res.status(200).send({access_token, refresh_token})
}


const refresh_token = (req, res) => {
    const auth_header = req.get("Authorization")
    const token = auth_header.split('Bearer ')[1]

    try {
        const decoded_data = jwt.verify(token, env.refresh_key)
        const access_token = create_token(
            decoded_data.data, env.access_key, env.access_time
        )
        
        return res.status(200).send({access_token})

    } catch (error) {
        // console.log(error.message);
        return res.status(401).send({ message: error.message})
    }
}

module.exports = {
    sign_up,
    sign_in,
    refresh_token
}
