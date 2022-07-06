const Bookmodel = require("../models/bookModel")
const reviewmodel=require("../models/reviewModel")
const { isValid, isValidbody, isValidnumber,isValidString } = require("./validator")
const mongoose=require("mongoose")

const createbook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (!isValidbody(data)) {
            return res.status(400).send({ status: false, message: "no data found" })
        }

        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "plz enter title" })
        }
        if (!isValid(excerpt)) {
            return res.status(400).send({ status: false, message: "plz enter excerpt" })
        }
        if (!isValid(userId)) {
            return res.status(400).send({ status: false, message: "plz enter userId" })
        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "plz enter ISBN" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "plz enter category" })
        }

        if (Array.isArray(subcategory)) {
            if (subcategory.length === 0) {
                return res.status(400).send({ status: false, message: "plz enter subcategory as a empty array" })
            }
            data["subcategory"] = [...subcategory]
            //it's checking subcategory as a string
        } else if (isValid(subcategory)) {

            data["subcategory"] = subcategory.trim()
        } else {
            return res.status(400).send({ status: false, message: "plz enter subcategory as a empty string" })
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "plz enter releasedAt" })
        }



        const book = await Bookmodel.create(data)
        return res.status(201).send({ status: true, data: book })


    } catch (err) {
       return res.status(500).send({ status: false, message: err.message })

    }
}






module.exports = { createbook}