import React, { createContext, useState,useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    
    const [userConnect, setuserConnect] = useState(() => {
        const savedUserConnect = localStorage.getItem('userConnect');
        return savedUserConnect === 'true';
      });
    
      const [connectedUser, setconnectedUser] = useState(() => {
        const savedUser = localStorage.getItem('connectedUser');
        return savedUser ? JSON.parse(savedUser) : null;
      });
    
      useEffect(() => {
        localStorage.setItem('userConnect', userConnect);
      }, [userConnect]);
    
      useEffect(() => {
        localStorage.setItem('connectedUser', JSON.stringify(connectedUser));
      }, [connectedUser]);
    
    
      const deleteUser = (id) => {
        setconnectedUser(false)
        setuserConnect(false)
    }
    

    return (
        <UserContext.Provider value={{ userConnect, setuserConnect, connectedUser, setconnectedUser, deleteUser }}>
            {children}
        </UserContext.Provider>
    );
};
