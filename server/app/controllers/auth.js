const bcrypt = require('bcryptjs');
const crypto=require("crypto");
const User = require('../models/user');
const mailservice = require('../services/email');
const { EMAIL_PROVIDER } = require('../constants');
const logger = require('../core/logger');
const { errorResponse, successResponse } = require('../core/response');
const { createJWTAccessToken, decodeDataFromJWTToken } = require('../utils/utils');
const sgMail = require('@sendgrid/mail');
const { sendVerificationMail} = require('../utils/sendVerificationMail');

sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .send(
                    errorResponse(400, null, `Email or Password missing in request body`)
                );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send(
                errorResponse(404, null, `User with the specified email not found`)
            );
        }

        if (user && user.provider !== EMAIL_PROVIDER.Email) {
            return res.status(400).send(
                errorResponse(400, null, `That email address is already in use using ${user.provider} provider.`)
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send(
                errorResponse(400, null, `Inorrect Password`)
            );
        }

        const payload = {
            id: user.id,
            email: user.email
        };

        const token = createJWTAccessToken(payload)

        if (!token) {
            throw new Error();
        }

        const data = {
            tokenType: 'Bearer',
            token: `${token}`,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                active: user.active,
                verified: user.verified,
                avatar:user.avatar
            }
        }

        res.status(200).send(
            successResponse(200, data)
        );
    } catch (err) {
        logger.fatal(err)
        res.status(500).send(
            errorResponse(500, err.message, "Your request can't be processed. Please try again!")
        );
    }
}

const register = async (req, res) => {
    try {
        const { email, firstName, lastName, password,phone } = req.body;

        if (!email) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter an email address.')
            );
        }

        if (!firstName || !lastName) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter your full name.')
            );
        }

        if (!password) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter a password.')
            );
        }
        if (!phone) {
            return res.status(400).send(
                errorResponse(400, null, 'You must enter a phone number.')
            );
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send(
                errorResponse(400, null, 'The email address is already in use')
            );
        }
     

const emailToken = crypto.randomBytes(64).toString("hex")

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            emailToken
           // verified: false
        });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);

        user.password = hash;
        const registeredUser = await user.save();

        sendVerificationMail(user);

     

        const payload = {
            id: registeredUser.id,
            email: registeredUser.email
        };

        const token = createJWTAccessToken(payload)

    

        const data = {
            tokenType: 'Bearer',
            token: `${token}`,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verified:user.verified,
                emailToken : user.emailToken
            }
        }

        res.status(200).send(
            successResponse(200, data)
        );
    } catch (err) {
        logger.fatal(err)
        res.status(400).send(
            errorResponse(400, err, "Your request can't be processed. Please try again!")
        );
    }


}




const verifyEmail = async (req, res) => {
    try {

        const emailToken=req.body.emailToken;
        // console.log(emailToken)

        if (emailToken === null) {
            
            return res.status(400).send(
                errorResponse(400, emailToken, "EmailToken not found......!")
            )
        }

        const user=await User.findOne({emailToken});

        if(user){
            user.emailToken=null;
            user.verified=true;

            await user.save();

           
            const payload = {
                id: user._id,
                email: user.email
            };
        const token = createJWTAccessToken(payload)


            res.status(200).json({
                _id:user._id,
                email:user.email,
                token,
                verified: user?.verified,

            });

        }else res.status(404).json("Email verification failed, invalid token!");
    }
    catch (err) {    
    logger.fatal(err)
        res.status(500).send(
            errorResponse(500, err, "Your request can't be processed. Please try try again!")
        );
    }

}

const resetpassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send(
                errorResponse(400, null, "Email is required!")
            )
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).send(
                errorResponse(400, null, "User with the specified email not found!")
            );
        }

        const payload = {
            id: existingUser.id,
            email: existingUser.email
        };

        const resetToken = createJWTAccessToken(payload)

        existingUser.resetPasswordToken = resetToken;
        existingUser.resetPasswordExpires = Date.now() + 3600000;

        existingUser.save();

        await mailservice.sendEmail(
            existingUser.email,
            'reset',
            req.headers.host + '/api',
            { resetToken }
        );

        res.status(200).send(
            successResponse(200, null, 'Please Check Your registered email for link')
        );
    } catch (err) {
        res.status(500).send(
            errorResponse(500, err.message, "Internal Server Error")
        );
    }
}

const resetpasswordtoken = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400)
                .send(
                    errorResponse(400, null, "Please Enter Password")
                )
        }

        const resetUser = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!resetUser) {
            return res.status(400).send(
                errorResponse(400, null, "Your token has expired. Please attempt to reset your password again.")
            )
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        resetUser.password = hash;
        resetUser.resetPasswordToken = undefined;
        resetUser.resetPasswordExpires = undefined;

        resetUser.save();

        // await mailservice.sendEmail(resetUser.email, 'reset-confirmation');

        res.status(200)
            .send(
                successResponse(200, null, "Password Reset Successfully.")
            )
    } catch (error) {
        res.status(500).send(
            errorResponse(500, null, "Something went wrong. Please try again.")
        )
    }
}

const verifyJWTToken = async (req, res) => {
    res.status(200).send(
        successResponse(200, null, "Valid JWT Token")
    )
}

const getCurrentActiveUser = async (req, res) => {
    let user = req.auth
    user.password = null
    res.status(200).send(
        successResponse(200, user)
    )
}

module.exports = {
    login,
    register,
    resetpassword,
    resetpasswordtoken,
    verifyEmail,
    verifyJWTToken,
    getCurrentActiveUser
}