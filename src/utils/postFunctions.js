
/**
 * 
 * @param {*} houseNum string
 * @param {*} streetName string >= 4 in length
 * @param {*} city string >= 4 in length
 * @returns postcode
 */
export default function generatePostcode(houseNum,streetName,city){

  
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

export {generatePostcode};