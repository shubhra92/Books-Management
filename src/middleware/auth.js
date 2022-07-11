const Bookmodel = require("../models/bookModel")
const userModel = require("../models/userModel")
const { isValid} = require("../validator/validator")



const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")



const authentication = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) {
            return res.status(400).send({ status: false, message: "token is not present" })

        }
        let error = null
        jwt.verify(token, "This-is-a-secret-key", function (err, decoded) {
            if (err) return error = err.message
        })

        if (error == "invalid token") return res.status(400).send({ status: false, message: error })
        if (error) return res.status(400).send({ status: false, message: "authorisation not successfull" })

        next()


    } catch (err) {
        res.status(500).send({ status: false, message: err.message })

    }
}


const authorisation = async (req, res, next) => {
    try {
        const token = req.headers["x-api-key"]
        let decodetoken = jwt.decode(token, "This-is-a-secret-key")

        const bookId = req.params.bookId
        //for createuser we are taking userId from body
        const userId = req.body.userId

        if (bookId) {
            if (!mongoose.isValidObjectId(bookId)) {
                return res.status(400).send({ status: false, message: "bookId is not valid" })
            }
            const getbooks = await Bookmodel.findOne({ _id: bookId, userId: decodetoken.userId })
            if (!getbooks) {
                return res.status(403).send({ status: false, message: "authorisation not successfull" })
            }
        } else if (isValid(userId)) {
                if (mongoose.isValidObjectId(userId.toString())) {
                    const userDetails = await userModel.findOne({ _id: userId })
                    if (userDetails) {
                        if (userId != decodetoken.userId) {
                            return res.status(403).send({ status: false, message: "authorisation not successfull by userId" })
                        }
                    } else { req.userDetails = userDetails }
                } else req.isValidObjectId = null
            }else req.isValidUserId = null
        
        




        next()
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })

    }
}
module.exports = { authentication, authorisation }