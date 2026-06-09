import React, { useEffect,useState } from 'react'
import './DrawerPopUp.css'
import { useAuth } from '../../contexts/authContext';
import { getRecievedLetters,getUserDoc } from '../../utils/userDB';
import { RetroDrawer } from '../RetroDrawer/RetroDrawer';
import LetterPopUp from '../LetterPopUp/LetterPopUp';


const DrawerPopUp = ({finished}) => {

  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [username,setUsername] = useState('UNKNOWN');
  const [recievedLetters,setRecievedLetters] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedLetter,setSelectedLetter] = useState({});

  useEffect(()=>{
    async function fetchUserData(){
    try {
          const userData = await getUserDoc(userId);
          setUsername(userData.username);
          console.log("userdata:",userData);
          //fetch letters
          const userLetters = await getRecievedLetters(userId);
          console.log(userLetters);
          setRecievedLetters(userLetters)
        } catch (error) {
          console.error(error);
        }
    }
    fetchUserData();
  },[userId])

  const handleSelectLetter = (id) => {
    console.log("opening letter:", id);
    for (let index = 0; index < recievedLetters.length; index++) {
      const letter = recievedLetters[index];
      if(letter.letterId === id){
        setSelectedLetter(letter);
      } 
    }
    // You can handle opening the text layout view here!
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      if (finished) finished();
    }, 200); // Matches your 0.2s CSS transition length!
  };

  const handleCloseLetter = () => {
    setSelectedLetter(null);
  };

  return (
    <div className='drawer-pop-up-backdrop'>
      {selectedLetter && (
        <LetterPopUp letter={selectedLetter} closeLetter={handleCloseLetter}/>
      )}
      <RetroDrawer 
        isOpen={isDrawerOpen} 
        letters={recievedLetters} 
        onSelectLetter={handleSelectLetter}
        close={finished}
      />
    </div>
  );
}

export default DrawerPopUp