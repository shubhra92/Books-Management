const { isValid, isValidbody} = require("./validator")
const mongoose=require("mongoose")
const bookModel = require("../models/bookModel")
const userModel=require("../models/userModel")
const createbook = async function (req, res) {
    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory} = data
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
        
        let obj={title, excerpt, userId, ISBN, category, subcategory,releasedAt:new Date()}



        const book = await bookModel.create(obj)
        return res.status(201).send({ status: true, data: book })


    } catch (err) {
       return res.status(500).send({ status: false, message: err.message })

    }
}


const getBooks = async function (req, res) {

    try {
        let query = req.query
        let { userId, subcategory, category } = query

        let obj={}
        
        
        // if (!isValidbody(query)) {
        //     return res.status(400).send({ status: false, message: "no data found" })
        // }
        
        
        if (isValid(userId)) {
            if(!mongoose.isValidObjectId(userId)){
                return res.status(400).send({ status: false, message: "plz enter Valid userID" })
    
            }
            obj.userId=userId
        }
       
       
    
       if (isValid(category)) {
           obj.category=category 
    }
    console.log(Object.prototype.toString.call(subcategory))
      

          
            //it's checking subcategory as a string
            
         if (isValid(subcategory)) {
            let a=subcategory.trim().split(",").map(x=>x.trim())
            console.log(a)
        obj.subcategory= {$all:a}
        }


    //   if(Object.keys(obj).length==0){
    //        return res.status(409).send({ status: false })

    //     }
        // obj.isDeleated=false

        const books = await bookModel.find({...obj,isDeleted:false}).select({createdAt:0,updatedAt:0,__v:0,subcategory:0,isDeleated:0})
        if(!books.length){
            return res.status(408).send({ status: false,message:"there is no book found" })

        }
       return res.status(200).send({ status: true, query:books })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const getBooksById=async function(req,res){
    try{
        const bookId=req.params.bookId
          
      if (!mongoose.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "bookId is not valid" })
    }

      let allbooks=await bookModel.findOne({_id:bookId,isDeleated:false}).lean().select({__v:0})
      if(!allbooks){
        return res.status(400).send({ status: false, message: "books not found" })

      }
      let review=await reviewmodel.find({bookId:bookId,isDeleated:false}).select({createdAt:0,updateAt:0,__v:0})
     

    
      
    //   let r=await internModel.find({collegeId:collegeId},{_id:1,updatedAt:0,createdAt:0,isDeleted:0,__v:0,collegeId:0}).lean()
      allbooks.reviewsData=[...review]

      console.log(allbooks.reviewsData)
      console.log(allbooks)
     return res.status(200).send({ status: true,bookId:allbooks})

       }catch(err){
        res.status(500).send({ status: false, message: err.message })
 
    }

}


const updatedetails=async function(req,res){
    try{
     const bookId=req.params.bookId
     const requestbody=req.body
     let{title,excerpt,releaseAt,ISBN}=requestbody

     if (!mongoose.isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: "Id is not valid" })
    }

     if (!isValidbody(requestbody)) {
        return res.status(400).send({ status: false, message: "body can't be empty " })
    }
    // it's checking whether id given or not
    // if(!isvalid(data)){
    //     return res.status(400).send({ status: false, message: "plz dont provide empty Id params" })
    // }
    //id is checking whether valid or not
    
    
  


    let obj={}

    if(isValid(title)){
        title=title.trim()
        const titleCheck=await bookModel.findOne({title})
        if(titleCheck)return res.status(400).send({ status: false, message: "title already exist" })
       obj.title=title
    }
    if(isValid(excerpt)){
     obj.excerpt=excerpt.trim()
    }
    if(isValid(releaseAt)){
        obj.releaseAt=releaseAt.trim()
    }
    if(isValid(ISBN)){
        ISBN=ISBN.trim()
        const ISBNCheck=await bookModel.findOne({ISBN})
        if(ISBNCheck)return res.status(400).send({ status: false, message: "ISBN already exist" })
     obj.ISBN=ISBN
    }
    if(!isValidbody(obj)){
        return res.status(400).send({ status: false, message:"you can update by only ISBN,releaseAt,title,excerpt" })
}


   
     let updateBook=await bookModel.findByIdAndUpdate(bookId,obj,{new:true})
     res.status(200).send({ status: false, requestbody:updateBook })

    }catch(err){
        return res.status(500).send({ status: false, message: err.message })

    }
}

const deletebook=async function(req,res){
    try{
        let idparams=req.params.bookId
        if (!mongoose.isValidObjectId(idparams)) {
            return res.status(400).send({ status: false, message: "Id is not valid" })
        }
        let deletedbook=await bookModel.findOneAndUpdate({_id:idparams,isDeleted:false},{isDeleted:true,deletedAt:new Date()},{new:true})
        if(!deletedbook){
            return res.status(404).send({ status: false, message: "no book found" })
        }
        return res.status(200).send({ status: true,data:deletedbook})

    }catch(err){
        return res.status(500).send({ status: false, message: err.message })

    }
}



module.exports = { createbook,getBooks,getBooksById,updatedetails,deletebook}