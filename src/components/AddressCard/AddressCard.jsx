import React, { useState } from 'react';
import './AddressCard.css';

const AddressCard = ({ contact, handleSelectAddress}) => {
  const [viewAddress, setViewAddress] = useState(false);

  return (
    <div className='contact-card'>
      {/* Added the missing contact-name class here */}
      <p className='contact-name'>{contact.savedName}</p>

      {viewAddress && (
        <div className='address-detail'>
          <p>{contact.houseNumber} {contact.streetName}</p>
          <p>{contact.cityName}</p>
          <p>{contact.postcode}</p>
        </div>
      )}

      {/* Row wrapper to prevent buttons from ballooning across your screen */}
      <div className='contact-card-actions'>
        <button 
          className='view-address-btn' 
          onClick={() => setViewAddress(!viewAddress)}
        >
          {viewAddress ? 'Hide' : 'View'}
        </button>
        <button 
          className='select-address-btn' 
          onClick={() => handleSelectAddress(contact)}
        >
          Select &rarr;
        </button>
      </div>
    </div>
  );
};

export default AddressCard;