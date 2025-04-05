// screens/OrderConfirmationScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function OrderConfirmationScreen() {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thank You!</Text>
      <Text>Your order has been placed successfully.</Text>
      <Button title="Back to Home" onPress={() => navigation.navigate("ConsumerHome")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent:"center", alignItems:"center", padding:20 },
  title: { fontSize: 26, fontWeight:"bold", marginBottom:20 },
});
