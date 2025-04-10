// screens/AddFarmScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function AddFarmScreen({ navigation }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [product, setProduct] = useState('');

  const handleAddFarm = async () => {
    try {
      const farmData = {
        name,
        location,
        product,
        farmerId: auth.currentUser.uid,  // Save the current user's UID as the farmerId
        farmerName: auth.currentUser.displayName || '', // Optional: Save the display name
      };
      await addDoc(collection(db, 'farms'), farmData);
      Alert.alert("Farm Added", "Your farm has been added successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Farm</Text>
      <TextInput
        style={styles.input}
        placeholder="Farm Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Product"
        value={product}
        onChangeText={setProduct}
      />
      <Button title="Add Farm" onPress={handleAddFarm} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
