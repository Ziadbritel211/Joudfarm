// screens/AddFarmScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AddFarmScreen({ navigation }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [product, setProduct] = useState('');

  const handleAddFarm = async () => {
    if (!name || !location || !product) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    try {
      await addDoc(collection(db, 'farms'), {
        name,
        location,
        product,
      });
      Alert.alert('Farm added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error adding farm:', error.message);
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
});
