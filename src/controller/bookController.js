const Bookmodel = require("../models/bookModel")
const reviewmodel=require("../models/reviewModel")
const { isValid, isValidbody, isValidnumber,isValidString } = require("./validator")
const mongoose=require("mongoose")
const bookModel = require("../models/bookModel")
const userModel=require("../models/userModel")
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
        if(!mongoose.isValidObjectId(userId)){
            return res.status(400).send({ status: false, message: "plz enter Valid userID" })

        }
        if (!isValid(ISBN)) {
            return res.status(400).send({ status: false, message: "plz enter ISBN" })
        }
        if (!isValid(category)) {
            return res.status(400).send({ status: false, message: "plz enter category" })
        }

        if (Array.isArray(subcategory)) { 
            let arr=[] 
            if (subcategory.length === 0) {
                return res.status(400).send({ status: false, message: "subcategory can not be empty array" })
            }
            subcategory.forEach(x=>{
                if(isValid(x)){
                    arr.push(x)
                }
            })
            if (arr.length === 0) {
                return res.status(400).send({ status: false, message: "subcategory can not be empty array" })
            }
            data["subcategory"] = [...arr]
            //it's checking subcategory as a string
        } else if (isValid(subcategory)) {

            data["subcategory"] = subcategory.trim()
        } else {
            return res.status(400).send({ status: false, message: "subcategory can not be empty array" })
        }
        if (!isValid(releasedAt)) {
            return res.status(400).send({ status: false, message: "plz enter releasedAt" })
        }
        //Title and IsBN unique checking
        const uniqueCheck=await bookModel.findOne({$or:[{title},{ISBN}]})
        if(uniqueCheck){
            if(uniqueCheck.title==title){
                return res.status(400).send({ status: false, message: "title alraedy exist" })
            
            }else{
                return res.status(400).send({ status: false, message: "ISBN alraedy exist" })
  
            }
        }

        //userId exist or not
        const userDetails=await userModel.findOne({_id:userId})
        console.log(userDetails)
            if(!userDetails){
                return res.status(404).send({ status: false, message: "user not exist" })

            
        }



        const book = await Bookmodel.create(data)
        return res.status(201).send({ status: true, data: book })


    } catch (err) {
       return res.status(500).send({ status: false, message: err.message })

    }
}






module.exports = { createbook}