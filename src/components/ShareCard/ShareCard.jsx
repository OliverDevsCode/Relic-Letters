import React, { useEffect, useState } from 'react';
import './ShareCard.css';
import { findHouse } from '../../utils/houseDB';
import { useAuth } from '../../contexts/authContext';

const ShareCard = ({ onClose }) => {
  const [houseNum, setHouseNum] = useState('');
  const [streetName, setStreetName] = useState('');
  const [cityName, setCityName] = useState('');
  const [postcode, setPostcode] = useState('');
  
  // Track which field is currently copied
  const [copiedField, setCopiedField] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function getHouse() {
      const userId = currentUser.uid;
      const houseDoc = await findHouse(userId);
      if (houseDoc) {
        setCityName(houseDoc.cityName);
        setStreetName(houseDoc.streetName);
        setPostcode(houseDoc.postcode);
        setHouseNum(houseDoc.houseNumber); // Fixed field naming mismatch
      }
    }
    getHouse();
  }, [currentUser.uid]);

  // Handle individual copy buttons
  const handleCopy = async (text, fieldKey) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Automatically reset the "Copied!" state
  useEffect(() => {
    if (!copiedField) return;
    const timer = setTimeout(() => setCopiedField(null), 1500);
    return () => clearTimeout(timer);
  }, [copiedField]);

  return (
    <div className='share-card'>
      {/* Address Rows */}
      <div className="share-row">
        <p><span className="label">House Number:</span> {houseNum}</p>
        <button onClick={() => handleCopy(houseNum, 'house')}>
          {copiedField === 'house' ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="share-row">
        <p><span className="label">Street Name:</span> {streetName}</p>
        <button onClick={() => handleCopy(streetName, 'street')}>
          {copiedField === 'street' ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="share-row">
        <p><span className="label">City Name:</span> {cityName}</p>
        <button onClick={() => handleCopy(cityName, 'city')}>
          {copiedField === 'city' ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="share-row">
        <p><span className="label">Postcode:</span> {postcode}</p>
        <button onClick={() => handleCopy(postcode, 'postcode')}>
          {copiedField === 'postcode' ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Main Action Footer Button */}
      <button className="close-btn" onClick={onClose}>Close</button>
    </div>
  );
};

export default ShareCard;