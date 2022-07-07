const express=require("express")
const router=express.Router()
const {createbook,getBooks,getBooksById,updatedetails,deletebook}=require("../controller/bookController")
const {createUser}=require("../controller/userController")



router.post("/user",createUser)
router.post("/books",createbook)
router.get("/books",getBooks)
router.get("/books/:bookId",getBooksById)
router.put("/books/:bookId",updatedetails)
router.delete("/books/:bookId",deletebook)









module.exports=router