// screens/OrderHistoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'orders');
        // Query orders for this user using the local createdAt field for ordering.
        const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Orders fetched:", ordersList);
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  const renderItem = ({ item }) => {
    // Format the createdAt field for display. It might be a Firestore Timestamp or a JS Date.
    let orderDate = "Pending";
    if (item.createdAt) {
      if (item.createdAt.seconds) {
        orderDate = new Date(item.createdAt.seconds * 1000).toLocaleString();
      } else {
        orderDate = new Date(item.createdAt).toLocaleString();
      }
    }
    return (
      <View style={styles.orderItem}>
        <Text style={styles.orderText}>Order ID: {item.id}</Text>
        <Text style={styles.orderText}>
          Total: ${item.total ? parseFloat(item.total).toFixed(2) : '0.00'}
        </Text>
        <Text style={styles.orderText}>Status: {item.status}</Text>
        <Text style={styles.orderText}>Placed on: {orderDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {orders.length === 0 ? (
        <Text>You have no past orders.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  orderItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  orderText: { fontSize: 16 },
});
