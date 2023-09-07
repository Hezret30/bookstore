const jwt = require('jsonwebtoken')
const { env } = require('../../config/config')

function guard (req, res, next) {
    const auth_header = req.get("Authorization")

    if (auth_header) {
        const token = auth_header.split('Bearer ')[1]

        if (!token) return res.sendStatus(401)

        try {
            const decoded_data = jwt.verify(token, env.access_key)
            req.id = decoded_data.data

            next()
        } catch (error) {
            return res.status(403).send({message: error.message})
    }
    } else (
        res.status(403).send({message: 'Unauthorized'})
    )

    
}

module.exports = guard
