// screens/FarmerHomeScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { RoleContext } from '../RoleContext';

export default function FarmerHomeScreen({ navigation }) {
  const [farms, setFarms] = useState([]);
  const { role, setRole } = useContext(RoleContext);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'farms'));
        const farmList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFarms(farmList);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFarms();
  }, []);

  // For testing, listen to a dummy chat conversation for unread messages.
  useEffect(() => {
    const currentUserId = auth.currentUser.uid;
    const dummyConsumerId = 'dummyConsumer';
    const chatId = [currentUserId, dummyConsumerId].sort().join('_');
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    // Query for messages where read is false and sender is not current user
    const q = query(messagesRef, where('read', '==', false), where('senderId', '!=', currentUserId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setUnreadCount(querySnapshot.size);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  const handleChangeRole = () => {
    setRole(null);
    navigation.replace('RoleSelection');
  };

  // Test Chat button for the farmer branch (for testing purposes)
  const handleTestChat = () => {
    const currentUserId = auth.currentUser.uid;
    const dummyConsumerId = 'dummyConsumer';
    const chatId = [currentUserId, dummyConsumerId].sort().join('_');
    navigation.navigate('Chat', { chatId, otherUserName: 'Consumer Test' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FarmDetails', { farm: item })} style={styles.item}>
      <Text style={styles.itemText}>{item.name} - {item.location}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to JoudFarm, Farmer {auth.currentUser.email}</Text>
      <Button title="Add Farm" onPress={() => navigation.navigate('AddFarm')} />
      <FlatList data={farms} renderItem={renderItem} keyExtractor={(item) => item.id} />
      
      <View style={styles.buttonContainer}>
        <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      </View>
      
      <View style={styles.chatButtonContainer}>
        <Button title="Test Chat" onPress={handleTestChat} />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      
      <Button title="Change Role" onPress={handleChangeRole} />
      <Button title="Logout" color="red" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  itemText: { fontSize: 18 },
  buttonContainer: { marginVertical: 10 },
  chatButtonContainer: {
    marginVertical: 10,
    alignSelf: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
