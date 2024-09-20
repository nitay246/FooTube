// contexts/AppProvider.js
import React from 'react';
import { UserProvider } from './UserContext';
import { VideoProvider } from './VideoContext';

const AppProvider = ({ children }) => {
    return (
        
        <UserProvider>
            <VideoProvider>
                {children}
            </VideoProvider>
        </UserProvider>
        
    );
};

export default AppProvider;
