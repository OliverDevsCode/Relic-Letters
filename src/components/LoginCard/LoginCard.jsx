import React,{useEffect,useState} from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebaseConfig';
import './LoginCard.css'
import { doPasswordReset } from '../../utils/auth';


const LoginCard = ({ onSuccess }) => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Sign-in error:', err.message);
      setError('Invalid email or password');
    }
  };

  async function forgotPassword() {
    if(email){
      try {
        const repsonse = await doPasswordReset(email)
        console.log(repsonse)
        setError("Email Reset Send (check Spam or Junk)")
      } catch (error) {
        console.error("error changing password",error)
        setError(error);
      }
    }else{
      setError('Invalid email')
    }
  }

  return (
    <div className='existing-user'>
      <p className='login-prompt'>Already your house?</p>
      <form className='login-form' onSubmit={(e) => { e.preventDefault(); signIn(); }}>
        <input 
          className='email-field' 
          type='email' 
          placeholder='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          className='password-field' 
          type='password' 
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className='enter-button' type="submit">Enter Home</button>
      </form>
      <p className='reset-prompt'>Forgotten your keys?</p>
      <button className='reset-button'>Reset Password</button>

    </div>
  )
}

export default LoginCard