
const SchemaValidate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body)
    if(error){
        res.status(400).json({
            error: error.details
        })
    } else {
        next()
    }
}

module.exports = SchemaValidate
