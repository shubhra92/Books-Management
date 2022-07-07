const mongoose=require('mongoose')
const reviewModel=require("../models/reviewModel")
const bookModel=require("../models/bookModel")
const { isValid, isValidbody, isValidnumber,isValidString } = require("./validator")


const addReview=async function(req,res){
try{

    let book_id=req.params.bookId
    let data=req.body


    if(!isValidbody(data)){
        return res.status(400).send("Please enter the review Details")
   }

    if(!isValid(data.reviewedBy)){
        return res.status(400).send({ status: false, message: "Reviewer name must be present" })
    }

    if (!data.reviewedBy.match(/^[a-zA-Z. ]+$/)) {
        return res.status(400).send({ status: false, msg: "Reviewer can't be a number" }) 
    }

    if(!isValid(data.rating)){
        return res.status(400).send({ status: false, message: "Rating must be present" })
    }

    if (!(data.rating >= 1 && data.rating <= 5)) {
        return res.status(400).send({ status: false, message: "Rating must be in between 1 to 5." })
    }

    if(!isValid(data.review)){
        return res.status(400).send({ status: false, message: "Review must be present" })
    }
    if (!mongoose.isValidObjectId(book_id)) {
        return res.status(400).send({ status: false, message: "Invalid BookId." })
    }
    
    let checkBook=await bookModel.findById(book_id)

    if(!checkBook){
        return res.status(404).send({ status: false, message: "BookId Not Found" })
    }

    data.bookId=checkBook._id
    data.reviewedAt = new Date()
   
    let saveReview=await reviewModel.create(data)

    if (saveReview) {
        await bookModel.findOneAndUpdate({ _id: saveReview.bookId }, { $inc: { reviews: 1 } })
    }

    const reviewDetails = await reviewModel.findOne({ _id: saveReview._id }).select({__v: 0,createdAt: 0,updatedAt: 0,isDeleted: 0})
    
    checkBook.reviewsData=reviewDetails

    res.status(201).send({ status: true, message: "review created successfully", data: checkBook })
}
catch(err){
    res.status(500).send({ status: false, Error: err.message })
}
}




module.exports = { addReview};