// screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Modal, 
  TouchableOpacity 
} from 'react-native';
import { auth, db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phone, setPhone] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhone(data.phone || '');
          console.log("Fetched phone from Firestore:", data.phone);
        } else {
          console.log("No additional profile data found");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user.uid]);

  const handleUpdateProfile = async () => {
    console.log("Update Profile clicked. DisplayName:", displayName, "Phone:", phone);
    try {
      // Update the display name in Firebase Auth
      await updateProfile(user, { displayName });
      // Reload the user data to ensure changes are applied immediately
      await user.reload();
      console.log("User updated:", auth.currentUser);
      // Update (or merge) additional fields (like phone) in Firestore
      await setDoc(doc(db, 'users', user.uid), { phone }, { merge: true });
      console.log("Firestore update successful");
      // Show success modal
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />

      <Modal
        transparent={true}
        animationType="slide"
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Profile Updated</Text>
            <Text>Your profile has been updated successfully.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    marginTop: 50 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  label: { 
    fontSize: 16, 
    marginBottom: 10 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
