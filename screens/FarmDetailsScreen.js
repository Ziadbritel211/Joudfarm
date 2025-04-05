// screens/FarmDetailsScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { RoleContext } from '../RoleContext';
import { CartContext } from '../CartContext';

export default function FarmDetailsScreen({ route, navigation }) {
  const { farm } = route.params;
  const { role } = useContext(RoleContext);
  const { addToCart } = useContext(CartContext); // This will now be defined via CartProvider
  const [products, setProducts] = useState([]);

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

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Text style={styles.productName}>{item.productName}</Text>
      <Text>Price: ${item.price}</Text>
      {item.description ? <Text>Description: {item.description}</Text> : null}
      {role === 'farmer' ? (
        <Button title="Edit Product" onPress={() => alert('Edit not implemented')} />
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
      
      {/* Only show Add Product button for farmers */}
      {role === 'farmer' && (
        <Button
          title="Add Product"
          onPress={() => navigation.navigate('AddProduct', { farmId: farm.id })}
        />
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
});
