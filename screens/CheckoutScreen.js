// screens/CheckoutScreen.js
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native';
import { CartContext } from '../CartContext';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

export default function CheckoutScreen() {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  // Calculate total cost from cart items
  const totalCost = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

  const handleConfirmOrder = async () => {
    try {
      // Create an order record in Firestore
      const orderData = {
        userId: auth.currentUser.uid,
        items: cartItems,
        total: totalCost,
        timestamp: serverTimestamp(),
        createdAt: new Date(),
        status: 'placed',
      };
      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      setModalVisible(false);
      navigation.navigate("OrderConfirmation");
    } catch (error) {
      Alert.alert("Error placing order", error.message);
    }
  };

  const handlePlaceOrder = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      {cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>
                {item.productName} - ${item.price}
              </Text>
            </View>
          )}
        />
      )}
      <Text style={styles.total}>Total: ${totalCost.toFixed(2)}</Text>
      <Button
        title="Place Order"
        onPress={handlePlaceOrder}
        disabled={cartItems.length === 0}
      />
      <Button title="Go Back" onPress={() => navigation.goBack()} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            <Text style={styles.modalText}>
              Your order total is ${totalCost.toFixed(2)}. Do you want to place the order?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmOrder}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  itemText: { fontSize: 18 },
  total: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center'
  },
  modalButtonConfirm: {
    backgroundColor: '#28a745'
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
