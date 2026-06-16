import React,{useState} from 'react'
import { auth } from '../../utils/firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { generatePostcode } from '../../utils/postFunctions';
import { createUser } from '../../utils/userDB';
import { getExisting } from '../../utils/houseDB';
import './SignUpCard.css'

const SignUpCard = ({onSuccess}) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [streetName, setStreetName] = useState('');
  const [cityName, setCityName] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [tos,setTos] = useState(false);
  const [error, setError] = useState('');


  const signUp = async () => {

    if(!password){
      setError("Please enter a password")
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if(tos === false){
      setError("Please agree to terms of service")
      return;
    }

    if(!username){
      setError("Please enter a username")
      return;
    }

    if(!email){
      setError("Please enter an email")
      return;
    }

    const postcode = generatePostcode(houseNumber,streetName,cityName);

    if (!postcode) {
      setError("Please ensure your street and city names are at least 4 characters long.");
      return;
    }

    console.log(`postcode generated: ${postcode}`);

    try {

      const houseObj = { houseNumber, streetName, cityName };
      const houseData = await getExisting(houseObj);
      
      if (houseData.isTaken) {
        setError("Someone has already moved into that house number on this street!");
        return;
      }


      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userData = {userId,username,houseNumber,streetName,cityName,postcode};

      //WRITE USER DATABASE FILE

      const addStatus = await createUser(userData);
      if(addStatus == true){
        //success
        onSuccess();
      }else{
        setError(addStatus);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='new-user'>
      <p className='create-prompt'>Want to move in?</p>
      <p className='create-prompt-2'>Create an account</p>
      <form className='create-form' onSubmit={(e) => e.preventDefault()}>
        <input 
          className='username-field' 
          type='text' 
          name='username'
          placeholder='username'
          autocomplete='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          className='email-field' 
          type='email' 
          name='email'
          autoComplete='email'
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          className='password-field' 
          type='password' 
          placeholder='password'
          autoComplete='new-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input 
          className='password-field' 
          type='password' 
          autoComplete='new-password'
          placeholder='confirm password'
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <p>Choosing your fantasy house!</p>
        <input 
          className='house-num-field' 
          type='text'
          placeholder='Enter fantasy house number'
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
        />
        <input 
          className='street-field' 
          type='text'
          placeholder='Enter fantasy street name'
          value={streetName}
          onChange={(e) => setStreetName(e.target.value)}
        />
        <input 
          className='city-field' 
          type='text'
          placeholder='Enter fantasy city name'
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <div className="tos-container">
          <input type="checkbox" id="tos" value={tos} onChange={(e) => setTos(e.target.checked)}/>
          <label htmlFor="tos">
            I agree to the{' '}
            <Link to="/legal" style={{ color: '#e10600', textDecoration: 'underline' }}>
              Terms Of Service
            </Link>
          </label>
        </div>
        {error && <p className="error">{error}</p>}
        <button className='enter-button' onClick={signUp}>Move In</button>
      </form>
    </div>
  )
}

export default SignUpCard