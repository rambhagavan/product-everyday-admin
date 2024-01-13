const extend = require('lodash/extend');
const { successResponse, errorResponse } = require('../core/response');
const logger = require('../core/logger');
const fs = require("fs");
const {cloudinaryUploadImg,cloudinaryDeleteImg} = require('../utils/cloudinary');

const upload = async (req, res) => {
    try {
        const url_list = []
        console.log(req.files)
        for(const file of req.files) {
            console.log(file.path)
            let result = await cloudinaryUploadImg(file.path,'images')
            url_list.push(result)
            fs.unlinkSync(file.path)
        }
        res.status(200).send(
            successResponse(200, url_list, null)
        )
    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}


const remove = async (req, res) => {
    try {
        let id = req.params.id
        const deleted = cloudinaryDeleteImg(id, "images");
        return res.status(200).send(
            successResponse(200, deleted, `Image has been deleted successfully!`)
        );

    } catch (err) {
        logger.fatal(err)
        return res.status(400).send(
            errorResponse(400, err.message, 'Your request could not be processed. Please try again.')
        )
    }
}

module.exports = {
    upload,
    remove
}