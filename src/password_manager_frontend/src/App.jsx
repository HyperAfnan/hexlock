import { useState, useEffect } from 'react';
import Auth from './components/auth';
import Dashboard from './components/dashboard';
import { AuthClient } from "@dfinity/auth-client";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);

  // Initialize auth client on component mount
  useEffect(() => {
    const initAuth = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      // Check if the user is already authenticated
      const authenticated = await client.isAuthenticated();
      if (authenticated) {
        const userIdentity = client.getIdentity();
        setIdentity(userIdentity);
        setIsAuthenticated(true);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    if (!authClient) return;

    await authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        const userIdentity = authClient.getIdentity();
        setIdentity(userIdentity);
        setIsAuthenticated(true);
      },
      onError: (error) => {
        console.error("Login failed", error);
        // You could add user feedback here
      }
    });
  };

  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
  };

  return (
    <main>
      {!isAuthenticated ? (
        <Auth onLogin={login} />
      ) : (
        <Dashboard identity={identity} onLogout={logout} />
      )}
    </main>
  );
}

export default App;
