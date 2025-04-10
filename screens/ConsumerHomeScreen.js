// screens/ConsumerHomeScreen.js
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { collection, getDocs, collectionGroup, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { RoleContext } from '../RoleContext';

export default function ConsumerHomeScreen({ navigation }) {
  const [farms, setFarms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { role, setRole } = useContext(RoleContext);

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

  useEffect(() => {
    // Query all unread messages for current user from any chat
    const q = query(
      collectionGroup(db, 'messages'),
      where('recipientId', '==', auth.currentUser.uid),
      where('read', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FarmDetails', { farm: item })} style={styles.item}>
      <Text style={styles.itemText}>{item.name} - {item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to JoudFarm, Consumer {auth.currentUser.email}</Text>
      <FlatList data={farms} renderItem={renderItem} keyExtractor={(item) => item.id} />
      <Button title="View Cart" onPress={() => navigation.navigate('Cart')} />
      <Button title="View Order History" onPress={() => navigation.navigate('OrderHistory')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      
      {/* Chat Button with unread badge */}
      <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ChatList')}>
        <Text style={styles.chatButtonText}>Chat</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

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
  chatButton: {
    marginVertical: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButtonText: { color: '#fff', fontSize: 18 },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
