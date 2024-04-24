import fs from 'fs';
import fsExtra from 'fs-extra';
import { exec } from 'child_process';
import path from 'path';
import os from 'os';
import { Octokit } from '@octokit/core';

const barebonesPath = './bare-app';

async function ensureRepositoryExists(accessToken, repository) {

  const octokit = new Octokit({ auth: accessToken });
  const [owner, repoName] = repository.split('/');

  try {
   
    await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo: repoName,
    });

    console.log('Repository exists');
  } catch (error) {

    if (error.status === 404) {
      console.log('Repository does not exist, creating...');
      try {
        const response = await octokit.request('POST /user/repos', {
          name: repoName,
          private: false, 
        });

        console.log('Repository created successfully:', response.data.html_url);
      } catch (createError) {
        console.error('Failed to create repository:', createError);
        throw createError;
      }
    } else {
      console.error('Error checking repository existence:', error);
      throw error;
    }
  }
}

function gitCommand(command, cwd, accessToken = '') {
  return new Promise((resolve, reject) => {
      exec(command, { cwd, env: { ...process.env, 'GIT_ASKPASS': 'echo', 'GIT_USERNAME': 'x-access-token', 'GIT_PASSWORD': accessToken } }, (error, stdout, stderr) => {
          if (error) {
              console.error(`exec error: ${error}`);
              return reject(error);
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
          resolve(stdout);
      });
  });
}

async function pushProjectToGitHub(accessToken, repository, files) {
  
  const projectName = files[0].project_name.split(' ').join('_');
  const owner = repository.split('/')[0];
  repository = `${owner}/${projectName}`;

  const tempProjectDir = path.join(os.tmpdir(), repository);
  await fsExtra.copy(barebonesPath, tempProjectDir);
 
  try {

    // if (!fs.existsSync(projectDir)){
    //     fs.mkdirSync(projectDir, { recursive: true });
    // }

    // files.forEach(file => {
    //   const directoryPath = path.join(projectDir, file.file_path);
    //   fs.mkdirSync(directoryPath, { recursive: true });
  
    //   const jsxFilePath = path.join(directoryPath, file.page_name+".jsx"); 
    //   fs.writeFileSync(jsxFilePath, file.content, 'utf8');
  
    //   const cssFilePath = path.join(directoryPath, file.page_name+".css");
    //   fs.writeFileSync(cssFilePath, file.style, 'utf8');
    // });


    files.forEach(({ file_path, page_name, content, style, route }) => {
      // Create and write JSX files
      const jsxFilePath = path.join(tempProjectDir, 'src', 'app', route, `page.jsx`);
      fsExtra.outputFileSync(jsxFilePath, content);
  
      // Create and write CSS files (if any)
      if (style) {
        const cssFilePath = path.join(tempProjectDir, 'src', 'app', route, `styles.css`);
        fsExtra.outputFileSync(cssFilePath, style);
      }
    });

    await gitCommand('git init', tempProjectDir);
    await gitCommand('git add .', tempProjectDir);
    await gitCommand(`git commit -m "Initial commit"`, tempProjectDir);

    await ensureRepositoryExists(accessToken, repository);
    
    const repoUrlWithToken = `https://x-access-token:${accessToken}@github.com/${repository}.git`;

    try {
        await gitCommand(`git remote add origin ${repoUrlWithToken}`, tempProjectDir);
    } catch (error) {
        if (error.message.includes("remote origin already exists")) {
            await gitCommand(`git remote set-url origin ${repoUrlWithToken}`, tempProjectDir);
        } else {
            throw error;
        }
    }

    await gitCommand('git push -u origin main', tempProjectDir);

  } catch (error) {

    console.error('Failed to push project to GitHub:', error);

  } finally {

    console.log('Cleaning up temporary directory...');
    fs.rmdirSync(tempProjectDir, { recursive: true });

  }
}

async function checkTokenScopes(access_token) {
  const octokit = new Octokit({ auth: access_token });

  try {
    const response = await octokit.request('GET /user');
    // Inspect the response headers for scope information
    const scopes = response.headers['x-oauth-scopes'];
    
    return scopes;
  } catch (error) {
    console.error('Error checking token scopes:', error);
  }
}

export { pushProjectToGitHub, checkTokenScopes };