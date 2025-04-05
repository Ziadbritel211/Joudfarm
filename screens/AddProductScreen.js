// screens/AddProductScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RoleContext } from '../RoleContext';

export default function AddProductScreen() {
  const { role } = useContext(RoleContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { farmId } = route.params; // farmId passed from FarmDetailsScreen

  // Restrict access to farmers only:
  if (role !== 'farmer') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Access Denied. Only farmers can add products.
        </Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleAddProduct = async () => {
    if (!productName || !price) {
      Alert.alert('Please fill in product name and price');
      return;
    }
    try {
      await addDoc(collection(db, 'products'), {
        farmId,
        productName,
        price,
        description,
      });
      Alert.alert('Product added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error adding product', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Product</Text>
      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { height: 80 }]}
        multiline
      />
      <Button title="Add Product" onPress={handleAddProduct} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center', marginBottom: 20 },
});
