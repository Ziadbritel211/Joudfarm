// RoleContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RoleContext = createContext();

export function RoleProvider({ children }) {
  // Initially, role is null
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loadRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        if (storedRole) {
          setRole(storedRole);
          console.log("Loaded role from AsyncStorage:", storedRole);
        } else {
          console.log("No role found in AsyncStorage.");
        }
      } catch (e) {
        console.error("Failed to load role from AsyncStorage", e);
      }
    };
    loadRole();
  }, []);

  const updateRole = async (newRole) => {
    try {
      await AsyncStorage.setItem('userRole', newRole);
      console.log("Saved role to AsyncStorage:", newRole);
    } catch (e) {
      console.error("Failed to save role to AsyncStorage", e);
    }
    setRole(newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </RoleContext.Provider>
  );
}
