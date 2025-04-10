// screens/RoleSelectionScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { RoleContext } from '../RoleContext';

export default function RoleSelectionScreen({ navigation }) {
  const { setRole } = useContext(RoleContext);

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
    // Navigate to Login (or another screen) after selecting the role
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      <Button title="Consumer" onPress={() => selectRole('consumer')} />
      <Button title="Farmer" onPress={() => selectRole('farmer')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
