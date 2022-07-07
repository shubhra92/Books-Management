const isValid=function(x){
    if(typeof x==="undefined" || typeof x===null) return false
    if(typeof x==="string" && x.trim().length===0 ) return false
    return true
}

const isvalidnumber=function(x){
    if(typeof x==="undefined" || typeof x===null) return false
    if(typeof x!=="number" )return false
    return true
}

const isvalidString=function(x){
    if(typeof x==="string" && x.trim().length===0) return false
    return true  
}
const isvalidbody=function(x){
    return Object.keys(x).length>0
}
module.exports={isValid,isvalidnumber,isvalidbody,isvalidString}