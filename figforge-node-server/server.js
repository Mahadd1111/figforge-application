import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { pushProjectToGitHub, checkTokenScopes } from './githubFunctions.js';
import { fetchProjectDetails } from './supabase.js';


dotenv.config();

const app = express();
const port = 3001; 

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';
const CALLBACK_URL = 'http://localhost:3001/github/callback';

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'], 
  credentials: true 
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/auth/github', (req, res) => {
    const redirectUri = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&scope=repo`;
    res.redirect(redirectUri);
});

app.get('/github/callback', async (req, res) => {
    
    const { code } = req.query;
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: CALLBACK_URL,
      }),
    });
  
    const tokenData = await tokenResponse.json();
    if (tokenData.access_token) {
      // Redirect the user back to your application or handle the token as needed
      console.log(tokenData)
        res.redirect(`http://localhost:3000/dashboard?token=${tokenData.access_token}`);
    } else {
      res.send('Error obtaining access token');
    }
});

app.post('/push-code', async (req, res) => {
    console.log(req.body)
    const { accessToken, repository } = req.body;
  
    try {
      const projectDetails = await fetchProjectDetails(repository.split('/')[1]);
      const result = await pushProjectToGitHub(accessToken, repository, projectDetails);
      res.send({ success: true });
    } catch (error) {
      console.error('Failed to push code:', error);
      res.status(500).send({ success: false, message: 'Failed to push code to GitHub.' });
    }
});

app.get('/check-token-scopes', async (req, res) => {

    const { access_token } = req.query;
  
    try {
      const scopes = await checkTokenScopes(access_token);
      res.send({ success: true, scopes });
    } catch (error) {
      console.error('Failed to check token scopes:', error);
      res.status(500).send({ success: false, message: 'Failed to check token scopes.' });
    }
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


  