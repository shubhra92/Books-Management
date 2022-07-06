const express=require("express")
const router=express.Router()
const {createbook}=require("../controller/bookController")


router.post("/books",createbook)




module.exports=router