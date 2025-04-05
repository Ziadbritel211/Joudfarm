// screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function HomeScreen({ navigation }) {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const farmsSnapshot = await getDocs(collection(db, 'farms'));
        const farmsList = farmsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFarms(farmsList);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchFarms();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FarmDash!</Text>

      <Button title="Add New Farm" onPress={() => navigation.navigate('AddFarm')} />

      <FlatList
        data={farms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.farmItem}
            onPress={() => navigation.navigate('FarmDetails', { farm: item })}
          >
            <Text style={styles.farmName}>{item.name}</Text>
            <Text>{item.location}</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Logout" color="red" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  farmItem: { padding: 15, borderBottomWidth: 1, marginBottom: 10 },
  farmName: { fontWeight: 'bold', fontSize: 18 },
});
