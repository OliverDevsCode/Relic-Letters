import { db } from "./firebaseConfig";
import { doc,setDoc,getDocs,getDoc,addDoc,updateDoc,collection,query,where,deleteDoc,orderBy } from "firebase/firestore";

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
/**
 * Add letter to user account
 * Letter = STILL BEING WRITTEN
 * TO SEND USE sendLetter!!!
 * @param {*} letterObj 
 */
async function saveLetter(letterObj, userId) {
  if (!userId || !letterObj) return false;

  const { letterId, sender,title, textData, status } = letterObj;

  const letterData = {
    sender: sender || "",
    title: title,
    content: textData || "",
    date: new Date().toISOString(),
    status: status || "STILL BEING WRITTEN"
  };

  try {
    if (letterId) {
      const letterRef = doc(db, "users", userId, "letters", letterId);
      
      await updateDoc(letterRef, letterData);
      console.log(`Draft updated successfully: ${letterId}`);
      return letterId;
      
    } else {
      const userLettersCollectionRef = collection(db, "users", userId, "letters");
      const newDocRef = await addDoc(userLettersCollectionRef, letterData);
      
      console.log(`New draft recorded with autoId: ${newDocRef.id}`);
      return newDocRef.id;
    }
  } catch (error) {
    console.error("Error saving letter draft:", error);
    return false;
  }
}

/**
 * Send letter to a user account
 * Letter = WRITTEN
 * To SAVE letters USE saveLetter!!!
 * @param {*} letterObj 
 * @param {*} recipient 
 */
async function sendLetter(letterObj,recipient) {
  
}

/**
 * Retrieves a user's profile data directly using their Firebase Auth UID.
 * @param {string} userId - The unique authentication UID of the user.
 * @returns {Promise<Object|false>} The user's data object if found, or false.
 */
async function getUserDoc(userId) {
  if (!userId) return false;

  try {
    // Point directly to the exact user document via its document ID
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      // Return the actual profile data (username, houseNumber, postcode, etc.)
      return docSnap.data();
    } else {
      console.log(`No user profile found matching UID: ${userId}`);
      return false;
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    return false;
  }
}


export {createUser,saveLetter,sendLetter,getUserDoc};