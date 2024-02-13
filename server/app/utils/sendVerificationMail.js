//const nodemailer=require("nodemailer");
const { createMailTransporter} =require("./createMailTransporter");

const  sendVerificationMail = (user) => {
    const transporter =createMailTransporter();

    const mailOptions = {
        from :"shopping app",
        to: user.email,
        subject: "verify your email...",
        html: `<p> Hello ${user.firstname}, verify ur email by clicking this link</p>
        <a href ='http://localhost:3000/verification?emailToken=${user.emailToken}'> Verifiy your email
        </a>`,
    };

    transporter.sendMail(mailOptions,(error, info)=>{
        if(error){
            console.log(error);
        }else{
            console.log(user.email);
        }
    });

}

module.exports={ sendVerificationMail };