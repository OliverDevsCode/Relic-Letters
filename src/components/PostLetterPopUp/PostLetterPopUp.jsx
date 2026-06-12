import React, { useEffect, useState } from 'react';
import './PostLetterPopUp.css';
import { getDraftLetters } from '../../utils/userDB';
import LetterPopUp from '../LetterPopUp/LetterPopUp';
import LetterCard from '../LetterCard/LetterCard';
import { useAuth } from '../../contexts/authContext';
import { attemptToast } from '../../utils/inAppNotifications';

//address book
import AddressBook from '../AddressBook/AddressBook';

// api 
import { postLetterAPI } from '../../utils/requests';

//dynamic postageTypes
import postageData from '../../utils/postageTypes.json';

const PostLetterPopUp = ({setPosting,username }) => {
  const [userLetters, setUserLetters] = useState([]);
  const [postageType, setPostageType] = useState(postageData[1]?.name || 'pigeon');
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  // Step management: 1 = Select Letter, 2 = Select Postage, 3 = Enter Address
  const [currentStep, setCurrentStep] = useState(1);

  // Address data
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [postCode, setPostCode] = useState('');
  const [previewLetter,setPreviewLetter] = useState(false);
  const [addressBookPopUp,setAddressBookPopUp] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const handlePreviewLetter = (id) => {
    console.log("opening letter:", id);
    const letter = userLetters.find(l => l.letterId === id);
    if (letter) {
      setPreviewLetter(true);
      setSelectedLetter(letter);
    }
  };

  const handleSelectLetter = (id) => {
    console.log("opening letter:", id);
    const letter = userLetters.find(l => l.letterId === id);
    if (letter) {
      setSelectedLetter(letter);
      setCurrentStep(2); // Move to Postage selection
    }
  };

  const handleCloseLetter = (id) => {
      setSelectedLetter([]);
      setPreviewLetter(false);
  };

  const handleSendLetter = async () => {
    // Basic validation
    if (!houseNumber || !streetName || !postCode) {
      alert("Please fill out all address fields before sending.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        senderId: currentUser?.uid,
        sender: username,
        letter: selectedLetter,
        houseNumber,
        streetName,
        postCode,
        postage:postageType,
      };

      console.log("Sending letter payload:", payload);
      const letterPromise = postLetterAPI(payload);

      attemptToast({
        title:'Sent Letter',
        message:'Stamped and ready!',
        promise:letterPromise
      })
      const response = await letterPromise;
      console.log(response);
      
      // Close popup after success
      setPosting(false);
    } catch (error) {
      console.error("Failed to post letter:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function fetchLetters() {
      if (currentUser) {
        const uid = currentUser.uid;
        console.log(`fetching postable letters with userId ${uid}`);
        try {
          const letterData = await getDraftLetters(uid);
          setUserLetters(letterData);
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchLetters();
  }, [currentUser]);

  const formatCarrierName = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatTime = (days) => {
    if (days === 0) return 'Instant';
    return days === 1 ? '1 day' : `${days} days`;
  };

  const retroInputStyle = {
    fontFamily: "'Courier New', monospace",
    padding: '8px',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-heading)',
    border: '2px solid var(--border)',
    width: '100%',
    boxSizing: 'border-box'
  };

  const retroBtnStyle = {
    fontFamily: "'Courier New', monospace",
    padding: '4px 8px',
    cursor: 'pointer',
    background: 'none',
    border: '2px solid var(--border)',
    color: 'var(--text-heading)'
  };

  return (
    <div className='popup-backdrop'>
      {previewLetter && (
        <LetterPopUp letter={selectedLetter} closeLetter={handleCloseLetter}/>
      )}
      {addressBookPopUp && (
        <div className="address-book-modal-layer">
          <AddressBook 
            setAddressBookPopUp={setAddressBookPopUp} 
            setHouseNumber={setHouseNumber} 
            setPostCode={setPostCode} 
            setStreetName={setStreetName} 
          />
        </div>
      )}
      <div className='letter-tray' onClick={(e) => e.stopPropagation()}>
        
        <p style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>
            {currentStep === 1 && "Select Letter to Post"}
            {currentStep === 2 && "Select Postage Method"}
            {currentStep === 3 && "Enter Delivery Address"}
          </span>
          <span 
            className='retro-close' 
            onClick={() => setPosting(false)}
            style={{ cursor: 'pointer', padding: '0 4px' }}
          >
            [X]
          </span>
        </p>
        
        {currentStep === 1 && (
          <div className="letter-tray-scrollable">
            {userLetters.length === 0 ? (
              <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>No drafts available.</p>
            ) : (
              userLetters.map((data) => (
                <div key={data.letterId || data.id} className="letter-select-row">
                  <div className="letter-card-flex-wrapper">
                    <LetterCard
                      id={data.letterId}
                      title={data.title}
                      date={data.date}
                      sender={data.sender}
                      openLetter={handlePreviewLetter}
                    />
                  </div>
                  <button 
                    className="select-draft-btn" 
                    onClick={() => handleSelectLetter(data.letterId || data.id)}
                  >
                    Select
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className='postage-options' style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ border: 'none', textShadow: 'none', fontSize: '0.95rem', margin: 0 }}>
              Carrier for: <strong>{selectedLetter?.title}</strong>
            </p>
            
            <select 
              value={postageType} 
              onChange={(e) => setPostageType(e.target.value)}
              style={retroInputStyle}
            >
              {postageData.map((option) => (
                <option key={option.name} value={option.name}>
                  {formatCarrierName(option.name)} ({formatTime(option.time)}) reliability: {option.reliability}/10
                </option>
              ))}
            </select>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button style={retroBtnStyle} onClick={() => setCurrentStep(1)}>
                [Back]
              </button>
              <button 
                className='send-button' 
                style={{ ...retroBtnStyle, marginLeft: 'auto' }}
                onClick={() => setCurrentStep(3)}
              >
                Next: Address &rarr;
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className='address-form' style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ border: 'none', textShadow: 'none', fontSize: '0.95rem', margin: 0 }}>
              Posting: "<strong>{selectedLetter?.title}"</strong> via {postageType}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem' }}>House Number / Name:</label>
              <input 
                type="text" 
                value={houseNumber} 
                onChange={(e) => setHouseNumber(e.target.value)} 
                placeholder="e.g., 221B"
                style={retroInputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem' }}>Street Name:</label>
              <input 
                type="text" 
                value={streetName} 
                onChange={(e) => setStreetName(e.target.value)} 
                placeholder="e.g., Baker Street"
                style={retroInputStyle}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem' }}>Postcode / ZIP:</label>
              <input 
                type="text" 
                value={postCode} 
                onChange={(e) => setPostCode(e.target.value)} 
                placeholder="e.g., NW1 6XE"
                style={retroInputStyle}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button style={retroBtnStyle} onClick={() => setCurrentStep(2)} disabled={isSubmitting}>
                [Back]
              </button>
              <button 
                className='send-button' 
                onClick={()=>{setAddressBookPopUp(true)}}
                disabled={isSubmitting}
                style={{
                  ...retroBtnStyle,
                  marginLeft: 'auto',
                  backgroundColor: 'var(--text-heading)',
                  color: 'var(--bg-main)',
                  fontWeight: 'bold',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
              Address Book
              </button>
              <button 
                className='send-button' 
                onClick={handleSendLetter}
                disabled={isSubmitting}
                style={{
                  ...retroBtnStyle,
                  marginLeft: 'auto',
                  backgroundColor: 'var(--text-heading)',
                  color: 'var(--bg-main)',
                  fontWeight: 'bold',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Letter'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PostLetterPopUp;