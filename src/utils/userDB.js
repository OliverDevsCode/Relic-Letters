import { db } from "./firebaseConfig";
import { doc,setDoc,getDocs,addDoc,updateDoc,collection,query,where,deleteDoc,orderBy } from "firebase/firestore";

async function createUser(userObj) {
  if(!userObj){
    return false;
  }
  const {userId,username,houseNumber,streetName,cityName,postcode} = userObj;

  try{
    await setDoc(doc(db,"users",userId),{
      userId: userId,
      username: username,
      houseNumber: houseNumber,
      streetName: streetName,
      cityName: cityName,
      postcode: postcode
    });

    await addDoc(collection(db, "houses"), {
      occupiedBy: userId,
      houseNumber,
      streetName,
      cityName,
      postcode
    });

    return true
  } catch(error){
    console.error("Error writing user",error)
    return error.message || "An unexpected database error occurred.";
  }
  
}


export {createUser};