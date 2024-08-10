// network call code
import URL from "../utils/constant.js"; 
async function doNetworkcall(){
    try{
    const Response = await fetch(URL);
         console.log('Response',Response);
    const Object = await Response.json(); //block
         console.log('JSON',Object);
    return Object; //wrap promise
    }
    catch(err){
        console.log('Some Problem in API Call ', err);
        throw err;  
    }
    // const promise =  fetch(URL); //Assing to thread
    // console.log('promise is ', promise);
    // promise.then(function(response){
    //     console.log(response);
    // }).catch(function(err){
    //     console.log('Error ', err);
    // });
    // console.log('Good Bye');
}
export default doNetworkcall;