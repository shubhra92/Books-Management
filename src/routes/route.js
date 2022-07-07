const express=require('express')
const router=express.Router()

const reviewController=require("../controllers/reviewController")


router.post('/books/:bookId/review', reviewController.addReview)

module.exports=router