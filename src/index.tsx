/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';
import {
  MsalProvider,
  MsalAuthenticationTemplate,
} from '@azure/msal-react';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== 'string') {
  throw new Error('set REACT_APP_GEMINI_API_KEY in .env');
}

const AZURE_CLIENT_ID = process.env.REACT_APP_AZURE_CLIENT_ID as string;
const AZURE_TENANT_ID = process.env.REACT_APP_AZURE_TENANT_ID as string;
if (!AZURE_CLIENT_ID || !AZURE_TENANT_ID) {
  throw new Error(
    'set REACT_APP_AZURE_CLIENT_ID and REACT_APP_AZURE_TENANT_ID in .env'
  );
}

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate interactionType={InteractionType.Redirect}>
        <LiveAPIProvider options={{ apiKey: API_KEY }}>
          <App />
        </LiveAPIProvider>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
