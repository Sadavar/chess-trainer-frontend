import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useAppContext } from './AppContext.jsx';
import { HoverCard, Button, Text, Group } from '@mantine/core';
import Header from './Header.jsx';


export default function Login() {
  const { user, setUser } = useAppContext();
  // This function will be called upon a successful login
  const handleSuccess = (credentialResponse) => {
    // If you are using the authorization code flow, you will receive a code to be exchanged for an access token
    console.log(credentialResponse)
    const decoded = jwtDecode(credentialResponse.credential);
    console.log(decoded)
    setUser(decoded.email)
  };

  const handleError = (errorResponse) => {
    console.error('Google login failed', errorResponse);
  };

  if (user) {
    return (
      <div>
        <h1>Welcome {user}!</h1>
      </div>
    )
  } else {
    return (
      <div>
        <Header />
        <h1>Please login</h1>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap={true}
          flow="auth-code"
        />
      </div>
    );
  }
}
