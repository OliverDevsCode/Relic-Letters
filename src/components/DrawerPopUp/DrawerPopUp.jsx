import React, { useEffect,useState } from 'react'
import './DrawerPopUp.css'
import { useAuth } from '../../contexts/authContext';
import { getRecievedLetters,getUserDoc } from '../../utils/userDB';
import { RetroDrawer } from '../RetroDrawer/RetroDrawer';


const DrawerPopUp = ({finished}) => {

  const { currentUser } = useAuth();
  const userId = currentUser.uid;
  const [username,setUsername] = useState('UNKNOWN');
  const [recievedLetters,setRecievedLetters] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

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
    console.log("Inspecting received parchment:", id);
    // You can handle opening the text layout view here!
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      if (finished) finished();
    }, 200); // Matches your 0.2s CSS transition length!
  };

  return (
    <div className='drawer-pop-up-backdrop'>
      <div className='drawer-text-header'>
        <p>Welcome back, {username}.</p>
        <p>Enjoy your collection!</p>
        <button className="drawer-close-btn" onClick={handleCloseDrawer}>✕ CLOSE CABINET</button>
      </div>

      <RetroDrawer 
        isOpen={isDrawerOpen} 
        letters={recievedLetters} 
        onSelectLetter={handleSelectLetter}
      />
    </div>
  );
}

export default DrawerPopUp