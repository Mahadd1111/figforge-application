import React, { useState, useEffect } from 'react';
import { InputField, Button, SizedBox } from '../../components/index';
//import Cookies from 'js-cookie';

import './Login.css';
import { verifyUserKey } from './Auth';
import { useUser } from '../../context/UserContext';
import { useRouter } from '../../context/RouterContext';

export default function Login() {
  const [userKey, setUserKey] = useState<string>('');
  const { userData, setUserData } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log('useEffect to Search');
    window.addEventListener('message', (event) => {
      const message = event.data.pluginMessage;
      console.log(message);
      if (message.type === 'getData') {
        setUserKey(message.value);

        console.log(message.value);
      }
    });
    parent.postMessage({ pluginMessage: { type: 'getData', key: 'userKey' } }, '*');
  }, []);

  useEffect(() => {
    // setUserKey('84b3c67a-5cbb-4a9a-88a3-b2af0ee6e822');

    handleLogin(new Event('submit'));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await verifyUserKey(userKey);

      if (response[0].is_authenticated) {
        // Update your user context with the fetched data
        setUserData(response[0]);

        console.log(userData);
        // write the key to the cookies to later use on restart
        //const cookies = new Cookies();
        //cookies.set('userKey', userKey, { path: '/' });

        parent.postMessage({ pluginMessage: { type: 'storeData', key: 'userKey', value: userKey } }, '*');

        router.navigate('/projects');
      } else {
        // Handle the case where authentication fails
        console.error('User verification failed');
        // Potentially setUserData to null or show an error message
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      // Handle error case
    }
  };

  return (
    <div className="login-page">
      <div className="heading">
        <h2 className="bold gray-900">
          <p className="welcome-text gray-500">WELCOME TO</p>
          <span className="primary-500">Fig</span>Forge
        </h2>
        <SizedBox height="40px" />
        <p className="sm-normal gray-500">Please connect your account to get started</p>
      </div>

      <form className="key-input" onSubmit={handleLogin}>
        <InputField
          label="API Key"
          placeholder="Enter your API key"
          value={userKey}
          onChange={(e) => {
            setUserKey(e.target.value);
            console.log(userKey);
          }}
        />
        <Button type="primary" size="md" submit={true} children="Connect my Account" width="w-full" />
      </form>
    </div>
  );
}
