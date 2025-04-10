// screens/FarmDetailsScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { RoleContext } from '../RoleContext';
import { CartContext } from '../CartContext';

export default function FarmDetailsScreen({ route, navigation }) {
  const { farm } = route.params;
  const { role } = useContext(RoleContext);
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  // Debug logs to verify role and farm object
  console.log("FarmDetailsScreen: role =", role);
  console.log("FarmDetailsScreen: farm object =", farm);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const productList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(product => product.farmId === farm.id);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, [farm.id]);

  const handleChat = () => {
    const currentUserId = auth.currentUser.uid;
    // For testing: if farm.farmerId is undefined, use a dummy value
    const farmerId = farm.farmerId || 'dummyFarmerId';
    if (!farm.farmerId) {
      console.warn("handleChat: farm.farmerId is missing, using dummyFarmerId for testing.");
    }
    // Generate a unique chatId by sorting the IDs alphabetically
    const chatId = [currentUserId, farmerId].sort().join('_');
    const otherUserName = farm.farmerName ? farm.farmerName : 'Farmer';
    console.log("Navigating to Chat with chatId:", chatId, "and otherUserName:", otherUserName);
    navigation.navigate('Chat', { chatId, otherUserName });
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text>Price: ${item.price}</Text>
      {item.description ? <Text>Description: {item.description}</Text> : null}
      {role === 'farmer' ? (
        <Button title="Edit Product" onPress={() => alert('Edit functionality not implemented')} />
      ) : (
        <Button title="Add to Cart" onPress={() => addToCart(item)} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{farm.name}</Text>
      <Text style={styles.detail}>Location: {farm.location}</Text>
      <Text style={styles.detail}>Product: {farm.product}</Text>
      
      {/* Display debug info for farmerId */}
      <Text style={styles.debug}>Debug: farmerId = {farm.farmerId ? farm.farmerId : 'undefined (using dummy)'}</Text>
      
      {/* For farmers */}
      {role === 'farmer' && (
        <Button title="Add Product" onPress={() => navigation.navigate('AddProduct', { farmId: farm.id })} />
      )}
      
      {/* For consumers: always show the chat button */}
      {role === 'consumer' && (
        <Button title="Chat with Farmer" onPress={handleChat} />
      )}
      
      <Text style={styles.subtitle}>Products:</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  detail: { fontSize: 18, marginBottom: 10 },
  subtitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  productItem: { padding: 15, backgroundColor: '#f1f1f1', borderRadius: 8, marginVertical: 8 },
  productName: { fontSize: 18, fontWeight: 'bold' },
  debug: { color: 'blue', marginVertical: 10, fontSize: 14 },
});
