const express=require("express")
const router=express.Router()
const {createbook,getBooks,getBooksById,updatedetails,deletebook}=require("../controller/bookController")
const {createUser}=require("../controller/userController")
const {addReview,deleteReview,updateReview}=require("../controller/reviewController")


// ========================================User================================================
router.post("/user",createUser)

// ========================================Book================================================

router.post("/books",createbook)
router.get("/books",getBooks)
router.get("/books/:bookId",getBooksById)
router.put("/books/:bookId",updatedetails)
router.delete("/books/:bookId",deletebook)


// ========================================Review================================================

router.post("/books/:bookId/review",addReview)
router.put('/books/:bookId/review/:reviewId', updateReview)
router.delete('/books/:bookId/review/:reviewId', deleteReview)








module.exports=router
