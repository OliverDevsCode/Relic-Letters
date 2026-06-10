import { db } from "./firebaseConfig";
import { collection,doc,getDoc, getDocs, query, where,writeBatch } from 'firebase/firestore';
import postageData from './postageTypes.json';

/**
 * 
 * @param {*} houseNum string
 * @param {*} streetName string >= 4 in length
 * @param {*} city string >= 4 in length
 * @returns postcode
 */
function generatePostcode(houseNum,streetName,city){

  
  const parsedHouseNum = parseInt(houseNum);

  //make usable
  const cleanStreet = streetName.replace(/[\s0-9]+/g, '').toLowerCase();
  const cleanCity = city.replace(/[\s0-9]+/g, '').toLowerCase();

  console.log(`Parsed: ${parsedHouseNum} || ${cleanStreet} || ${cleanCity}`);


  //input santiation
  if(!cleanStreet || cleanStreet.length <4 || !cleanCity || cleanCity.length <4 || 
    isNaN(parsedHouseNum) || parsedHouseNum < 0 || parsedHouseNum >999){

    return false;
  }
  

  //find midpoints
  const streetMidIndex = Math.floor(cleanStreet.length / 2);
  const cityMidIndex = Math.floor(cleanCity.length / 2);

  const streetPart = cleanStreet.substring(streetMidIndex - 1, streetMidIndex + 2);
  const cityPart = cleanCity.substring(0, 3);

  return `${streetPart}${parsedHouseNum} ${cityPart}`.toUpperCase();

}

/**
 * Retrieves letters you have
 * @param {*} userId 
 */
async function getDeliveredLetters(userId) {
  if (!userId) {
    console.error("No userId to fetch posts for");
    return [];
  }

  try {
    //fetch user post
    const postCollectionRef = collection(db, 'users', userId, 'post');
    const querySnapshot = await getDocs(postCollectionRef);
    
    const now = new Date();
    const deliveredLetters = [];

    querySnapshot.forEach((doc) => {
      const letterData = doc.data();
      
      //santise inputs
      if (!letterData.createdAt || !letterData.postage) return;

      
      const createdAtDate = letterData.createdAt.toDate 
        ? letterData.createdAt.toDate() 
        : new Date(letterData.createdAt);

      // match posate type
      const postageConfig = postageData.find(p => p.name === letterData.postage);
      
      if (!postageConfig) {
        console.warn(`Unknown postage type: "${letterData.postage}" on letter ${doc.id}`);
        return;
      }

      // calculate delivery time
      const deliveryDurationMs = postageConfig.time * 24 * 60 * 60 * 1000;
      const deliveryExpectedTime = new Date(createdAtDate.getTime() + deliveryDurationMs);

      // if delivery time = in past - show to user
      if (now >= deliveryExpectedTime) {
        deliveredLetters.push({
          id: doc.id,
          ...letterData,
          deliveredAt: deliveryExpectedTime.toISOString() //deliver time for ui sorting
        });
      }
    });

    //delete all the letters and store them in users/letters

    return deliveredLetters.sort((a, b) => b.deliveredAt - a.deliveredAt);

  } catch (error) {
    console.error("Error fetching or computing delivered letters:", error);
    return [];
  }
}

async function collectLetters(userId, collectedIds) {
  if (!userId) {
    console.error("No userId provided for collecting mail");
    return { success: false, error: "Missing userId" };
  }
  
  if (!collectedIds || collectedIds.length === 0) {
    console.warn("No letter IDs provided to collect");
    return { success: true, count: 0 };
  }

  try {
    const batch = writeBatch(db);
    let itemsProcessed = 0;

    const postCollectionRef = collection(db, 'users', userId, 'post');
    const lettersCollectionRef = collection(db, 'users', userId, 'letters');

    for (const letterId of collectedIds) {
      const sourceDocRef = doc(postCollectionRef, letterId);
      const targetDocRef = doc(lettersCollectionRef, letterId);

      // fetch the document data from the post collection
      const docSnap = await getDoc(sourceDocRef);

      if (docSnap.exists()) {
        const letterData = docSnap.data();

        //write to letters collection in the batch
        batch.set(targetDocRef, {
          ...letterData,
          status: 'received', 
          collectedAt: new Date() 
        });

        batch.delete(sourceDocRef);
        itemsProcessed++;
      } else {
        console.warn(`Letter with ID ${letterId} not found in post tray.`);
      }
    }

    // commit all operations to Firestore simultaneously
    if (itemsProcessed > 0) {
      await batch.commit();
      console.log(`Successfully collected ${itemsProcessed} letters to inventory.`);
      return { success: true, count: itemsProcessed };
    }

    return { success: false, error: "No valid letters were found to process" };

  } catch (error) {
    console.error("Error executing batch mail collection:", error);
    return { success: false, error: error.message };
  }
}

export {generatePostcode,getDeliveredLetters,collectLetters};