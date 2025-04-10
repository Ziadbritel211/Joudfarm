// screens/ChatListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function ChatListScreen() {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatData);
    });

    return () => unsubscribe();
  }, []);

  const openChat = (chatId, otherUserName) => {
    navigation.navigate('Chat', { chatId, otherUserName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Chats</Text>
      {chats.length === 0 ? (
        <Text>No messages yet</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const otherUserId = item.participants.find(id => id !== auth.currentUser.uid);
            const otherUserName = item.participantNames ? item.participantNames[otherUserId] : 'User';
            return (
              <TouchableOpacity
                style={styles.chatItem}
                onPress={() => openChat(item.id, otherUserName)}
              >
                <Text style={styles.chatText}>{otherUserName}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 5,
  },
  chatText: { fontSize: 18 }
});
