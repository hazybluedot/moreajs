import React, { useState, useEffect, useContext, createContext } from "react";
import { fetchEnv, abort } from "../lib/efapi";

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state

function useProvideAuth() {
  const [user, setUser] = useState(null);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const signin = (email, password) => {
    //TODO: implement
    console.log('signin: Not implemented');
  };

  const signup = (email, password) => {
    //TODO: implement
    console.log('signup: Not implemented');
  };

  const signout = () => {
    console.log('signout: Not implemented');
    //TODO: implement
    /*
    return firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(false);
      });
        */
  };

  const sendPasswordResetEmail = email => {
    console.log('sendPasswordResetEmail: Not implemented');
    /*
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        return true;
      });*/
  };

  const confirmPasswordReset = (code, password) => {
    console.log('confirmPasswordReset: Not implemented');
    /*
    return firebase
      .auth()
      .confirmPasswordReset(code, password)
      .then(() => {
        return true;
      });
    */
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.

  useEffect(() => {

    const promise = fetchEnv().then(env => {
      console.log('fetchEnv().then', env);
      if (env.user) {
        setUser(env.user);
      } else {
        setUser(false);
      }
    });

    // Cleanup subscription on unmount
    return () => { abort() };
  }, []);

  

  // Return the user object and auth methods
  return {
    user,
    signin,
    signup,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset
  };
}