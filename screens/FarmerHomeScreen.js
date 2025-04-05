// screens/FarmerHomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';

export default function FarmerHomeScreen({ navigation }) {
  const [farms, setFarms] = useState([]);
  const user = auth.currentUser;
  
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

  const handleSignOut = async () => {
    await signOut(auth);
    navigation.replace('Login');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FarmDetails', { farm: item })}
      style={styles.item}
    >
      <Text style={styles.itemText}>{item.name} - {item.location}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to JoudFarm, Farmer {user?.email}</Text>
      <Button title="Add Farm" onPress={() => navigation.navigate('AddFarm')} />
      <FlatList data={farms} renderItem={renderItem} keyExtractor={(item) => item.id} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Logout" color="red" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', marginBottom: 10 },
  itemText: { fontSize: 18 },
});
