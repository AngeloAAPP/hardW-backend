const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

const sendResetPasswordMail = async({name, to, token}) => {
    const email = {
        from: process.env.MAIL_USER,
        to,
        subject: 'Recuperação de senha - hardW',
        text: `Olá ${name}, notamos que você solicitou a redefinição de senha. O token para prosseguir com 
        a solicitação é ${token}. Se não foi você, ignore esta mensagem.`,
        html: `
            <h2> Olá, ${name} </h2>
            <p> notamos que você solicitou a redefinição de senha. Clique no link abaixo ou cole a url no navegador
            para prosseguir com a redefinição </p>
            <a href = "https://hardw-marketplace.herokuapp.com/reset-password/${token}" 
                style = "display: block; 
                         color: white; 
                         background-color: black; 
                         border: none; 
                         max-width: 200px; 
                         margin: 0 auto; 
                         text-align: center; 
                         text-decoration: none; 
                         padding: 10px"
                        
            >Refedinir</a>
            <p> https://hardw-marketplace.herokuapp.com/reset-password/${token} </p>
            <p> Se não foi você, <strong> ignore esta mensagem <strong>. </p>
        `
    }
    await transporter.sendMail(email)
}

module.exports = {sendResetPasswordMail}