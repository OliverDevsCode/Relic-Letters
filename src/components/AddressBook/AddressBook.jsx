import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/authContext';
import AddressCard from '../AddressCard/AddressCard';
import { getUserContacts,addContactToContacts } from '../../utils/userDB';
import { attemptToast } from '../../utils/inAppNotifications';
import './AddressBook.css'
const AddressBook = ({setPostCode,setStreetName,setHouseNumber,setAddressBookPopUp}) => {

  //state holders
  const [contacts,setContacts] = useState([]);
  const [addContact,setAddContant] = useState(false); //boolean for modal popup

  //for adding contact
  const [savedName,setSavedName] = useState('');
  const [savedHouseNumber,setSavedHouseNumber] = useState('');
  const [savedStreetName,setSavedStreetName] = useState('');
  const [savedCityName,setSavedCityName] = useState('');

  //error
  const [error,setError] = useState(''); //set if contact details incorrect

  //auth
  const { currentUser } = useAuth();

  useEffect(()=>{
    getContacts();
  },[])

   async function getContacts() {
      const userId = currentUser?.uid;

      console.log(`Fetching ${userId}'s contacts`)
      //fetch contacts
      try { 
        const promise = getUserContacts(userId);
        attemptToast({title:"Here you go",message:"addresses gathered",promise})
        const response = await promise;
        console.log(response);
        setContacts(response);
      } catch (error) {
        console.error(error)
      }
    }

  const addToAddressBook = async() => {
    //check all fields
    const userId = currentUser?.uid;
    const promise = addContactToContacts(savedName,savedHouseNumber,savedStreetName,savedCityName,userId);
    attemptToast({title:"Added!",message:"Go send them a letter",promise});
    const result = await promise
    if(result.error === true){
      setError(result.message);
    }else{
      setError('');
      const localContact = {savedName,houseNumber:savedHouseNumber,streetName:savedStreetName,cityName:savedCityName,postcode:result.postcode} //save writes
      setAddContant(false);
      //delete previous with same details aside from savedName
      console.log("contacts before",contacts)
      setContacts(prevContacts => {
      const filtered = prevContacts.filter(c => {
        // Check if it's the exact same location
        const isSameAddress = 
          c.houseNumber === savedHouseNumber &&
          c.streetName === savedStreetName &&
          c.cityName === savedCityName;

        // Keep it ONLY if it is a completely different address
        return !isSameAddress;
      });

      return [localContact, ...filtered];
    });
    }
  }

  const handleSelectAddress = (contact) => {
    setHouseNumber(contact.houseNumber);
    setStreetName(contact.streetName);
    setPostCode(contact.postcode);
    setAddressBookPopUp(false);
  }

  const handleAddAddress = (contact) => {
    setAddContant(!addContact);
  }


  return (
    <div className='address-book-container'>
      <p>Your Address Book</p>
      {(!contacts || contacts.length === 0) && (
        <p>Empty I'm Afraid</p>
      )}
      <div className='address-cards-list'>
        {contacts.map((contact) => (
          <AddressCard 
            key={contact.id || contact.savedName} 
            contact={contact} 
            handleSelectAddress={handleSelectAddress}
          />
        ))}
      </div>
      {addContact && (
        <form className='add-contact-form' onSubmit={(e) => e.preventDefault()}>
          <input 
            placeholder='Name' 
            type='text'
            value={savedName}
            onChange={(e) => setSavedName(e.target.value)}
          />
          <input 
            placeholder='House Number' 
            type='text'
            value={savedHouseNumber}
            onChange={(e) => setSavedHouseNumber(e.target.value)}
          />
          <input 
            placeholder='Street Name' 
            type='text'
            value={savedStreetName}
            onChange={(e) => setSavedStreetName(e.target.value)}
          />
          <input 
            placeholder='City Name' 
            type='text'
            value={savedCityName}
            onChange={(e) => setSavedCityName(e.target.value)}
          />
          <button onClick={addToAddressBook}>Save Address</button>
          {error && (
            <p>{error}</p>
          )}
        </form>
      )}
      <button onClick={handleAddAddress}>
        {addContact ? '[Cancel]' : 'Add Address'}
      </button>
      <button onClick={(e)=>setAddressBookPopUp(false)}>Close</button>
    </div>
  )
}

export default AddressBook