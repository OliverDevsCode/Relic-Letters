import React,{useState} from 'react'

const SignUpCard = ({onSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='new-user'>
      <p className='create-prompt'>Want to move in?</p>
      <p className='create-prompt-2'>Create an account</p>
      <form className='create-form'>
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
        <button className='enter-button'>Move In</button>
      </form>
    </div>
  )
}

export default SignUpCard