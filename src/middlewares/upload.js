const multer = require('multer')


const storage = multer.diskStorage({ 
    destination: function(req, file, cb) {
        cb(null, 'src/static/users_books')
    },
    filename: function(req, file, cb) {
        cb(null, 'image_' + file.originalname)
    }
 })

const isFile = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        return cb(null, true)
    }else {
        return cb(new Error('Only image files allowed!'))
    }
}


const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 3 * 1024 * 1024
    },
    fileFilter: isFile
}).array('files')


function Upload(req, res, next) {
    upload(req, res, err => {

        if(err instanceof multer.MulterError){
            return res.status(400).send(err.message)

        }else if(err){
            return res.status(400).send(err.message)

        }
        
        next()
    })
}

module.exports = Upload