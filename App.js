// App.js
import React, { useState, useEffect, useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import RoleSelectionScreen from './screens/RoleSelectionScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import FarmerHomeScreen from './screens/FarmerHomeScreen';
import ConsumerHomeScreen from './screens/ConsumerHomeScreen';
import FarmDetailsScreen from './screens/FarmDetailsScreen';
import AddFarmScreen from './screens/AddFarmScreen';
import AddProductScreen from './screens/AddProductScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PushNotificationTestScreen from './screens/PushNotificationTestScreen';

import { RoleProvider, RoleContext } from './RoleContext';
import { CartProvider } from './CartContext';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { role } = useContext(RoleContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  
  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        role === null ? (
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )
      ) : (
        role === 'farmer' ? (
          <>
            <Stack.Screen name="FarmerHome" component={FarmerHomeScreen} />
            <Stack.Screen name="FarmDetails" component={FarmDetailsScreen} />
            <Stack.Screen name="AddFarm" component={AddFarmScreen} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
            <Stack.Screen name="FarmDetails" component={FarmDetailsScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="PushNotificationTest" component={PushNotificationTestScreen} />
          </>
        )
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <RoleProvider>
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </RoleProvider>
  );
}
