// screens/RoleSelectionScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RoleContext } from '../RoleContext';

export default function RoleSelectionScreen({ navigation }) {
  const { setRole } = useContext(RoleContext);

  const chooseFarmer = () => {
    setRole('farmer');
    navigation.replace('Login');
  };

  const chooseConsumer = () => {
    setRole('consumer');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role for JoudFarm</Text>
      <Button title="I am a Farmer" onPress={chooseFarmer} />
      <Button title="I am a Consumer" onPress={chooseConsumer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
