import React, { useState } from 'react';
import './styles/Loginpop.css';
// import { assets } from './assets';
import axios from 'axios';
import cookie from 'js-cookie';
import toast from 'react-hot-toast';

const Loginpopup = ({ setshowlogin }) => {
  const [currState, setcurrState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // const getCsrfToken = () => {
  //   const token = document.querySelector('[name=csrfmiddlewaretoken]');
  //   return token ? token.value : cookie.get('csrftoken');  // If it's stored in cookies
  // };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    const csrfToken = cookie.get('csrftoken'); // Get CSRF token from cookies
    console.log('CSRF Token:', csrfToken);

    if (currState === 'Sign Up') {
    try {
      // const csrfToken = getCsrfToken();  // Get the CSRF token
      console.log(email, username, password);
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        email,
        username , // Send name only for Sign Up
        password,
      }, {
        headers: {
          'X-CSRFToken': csrfToken  // Include the CSRF token in the request headers
        }
      });

      toast.success('Successfully created!');
      console.log(response);
    } catch (error) {
      console.error('Error:', error);
      toast.error('User already exists!');
    }
  } else {
    try {
      // const csrfToken = getCsrfToken();  // Get the CSRF token
      // const csrfToken = cookie.get('csrftoken'); // Get CSRF token from cookies

      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        username,
        password
      }
    );
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      console.log(response);
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Invalid email or password!');
    }
  }
    setshowlogin(false);
  };
  return (
    <div className="login-popup">
      <form className='login-popup-container' onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <p onClick={() => setshowlogin(false)} >X</p>
        </div>
        <div className="login-popup-input">
          
            <input
              type="text"
              placeholder='Your name'
              value={username}
              onChange={handleNameChange}
              required
            />
          {currState === 'Sign Up' && (
          <input
            type="email"
            id='email'
            value={email}
            placeholder='Your Email'
            onChange={handleEmailChange}
            required
          />
        )}
          <input
            type="password"
            id='password'
            value={password}
            placeholder='Password'
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type='submit'>{currState === 'Sign Up' ? 'Sign Up' : 'Login'}</button>
        <div className="login-popup-condition">
          <input type="checkbox" name="login-checkbox" id="login-checkbox" required />
          <p>By continuing, you agree to our <span>Terms and Privacy Policy</span></p>
        </div>
        {
          currState === 'Login'
            ? <p>Create a new account? <span onClick={() => setcurrState('Sign Up')}>Click here</span></p>
            : <p>Already have an account? <span onClick={() => setcurrState('Login')}>Login here</span></p>
        }
      </form>
    </div>
  );
};

export default Loginpopup;
