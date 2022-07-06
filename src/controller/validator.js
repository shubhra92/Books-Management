
const isValid=function(x){
    if(typeof x==="undefined" || typeof x===null) return false
    if(typeof x==="string" && x.trim().length===0 ) return false
    return true
}

const isValidnumber=function(x){
    if(typeof x==="undefined" || typeof x===null) return false
    if(typeof x!=="number" )return false
    return true
}

const isValidString=function(x){
    if(typeof x==="string" && x.trim().length===0) return false
    return true  
}
const isValidbody=function(x){
    return Object.keys(x).length>0
}
module.exports={isValid,isValidnumber,isValidbody,isValidString}