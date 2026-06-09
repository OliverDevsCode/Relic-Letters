import { db } from "./firebaseConfig";
import { doc,setDoc,getDocs,addDoc,updateDoc,collection,query,where,deleteDoc,orderBy } from "firebase/firestore";


/**
 * Checks if a house address is already registered in the system.
 * @param {Object} houseObj - Object containing houseNumber, streetName, and cityName
 * @returns {Promise<boolean>} True if the house exists, false if it's available
 */
async function getExisting(houseCheckObj) {
  if (!houseCheckObj) return false;
  const { houseNumber, streetName, cityName } = houseCheckObj;

  try {
    const housesRef = collection(db, "houses");
    
    // Querying across the public collection using standard filters
    const q = query(
      housesRef,
      where("houseNumber", "==", houseNumber),
      where("streetName", "==", streetName),
      where("cityName", "==", cityName)
    );

    const querySnapshot = await getDocs(q);
    
    // If it's not empty, someone already claimed it!
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking for existing house:", error);
    return true; // Safety guardrail
  }
}

export { getExisting };