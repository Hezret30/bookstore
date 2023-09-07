const sharp = require('sharp')

const inputFile = 'image_IMG_20220412_214745.jpg'
const dest = 'image_IMG_20220412_214745.webp'

sharp(inputFile).toFormat('webp', {quality: 80}).toFile(dest)
