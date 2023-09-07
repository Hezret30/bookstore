const nodemailer = require('nodemailer')
const { env } = require('../../config/config')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.USER,
        pass: env.PASSWORD
    }
})  

const sendEmail = (req, _, next) => {
    const mailConfigurations = {
        from: env.USER,

        to: req.body.email,

        subject: 'ACHIEVEMENT',

        text: `${12312313}`
    }

    transporter.sendMail(mailConfigurations, (err, _) => {
        if (err) throw err
        console.log('SENT SUCCESSFULLY')
        next()
    })
}

module.exports = sendEmail
