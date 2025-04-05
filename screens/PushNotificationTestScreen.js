// screens/PushNotificationTestScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../notifications';
import { useNavigation } from '@react-navigation/native';

// Configure how notifications are handled when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function PushNotificationTestScreen() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    // Register for push notifications and get token
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Listener for receiving notifications while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener for responses (when user taps the notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification response:", response);
    });

    return () => {
      // Clean up the listeners on unmount
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Push Notifications Test</Text>
      <Text style={styles.label}>Your Expo Push Token:</Text>
      <Text style={styles.token}>{expoPushToken}</Text>
      {notification && (
        <Text style={styles.notification}>
          Last Notification: {JSON.stringify(notification.request.content)}
        </Text>
      )}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    marginTop: 50, 
    alignItems: 'center' 
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  token: { fontSize: 14, textAlign: 'center', marginHorizontal: 20, marginBottom: 20 },
  notification: { fontSize: 14, textAlign: 'center', marginTop: 20 },
});
