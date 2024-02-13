const nodemailer=require("nodemailer");

const createMailTransporter = () => {
    const transporter =nodemailer.createTransport({
        service:"Gmail",
        host : "smtp.gmail.com",
        port : 465,
        secure : true,
        auth:{
            user: "humansharmaindia@gmail.com",
            pass: "llnf tecz lktf cmuc ",
        },
    });
    return transporter;
}

module.exports={ createMailTransporter};