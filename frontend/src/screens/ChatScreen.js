import React, {useState} from 'react';
import Header from '../components/Header';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import {sendMessageToBot} from '../api/chatApi';

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi, I am here for you 💗',
      sender: 'bot',
    },
  ]);

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = {
    id: Date.now().toString(),
    text: input,
    sender: 'user',
  };

  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setTyping(true);

  const botResponse = await sendMessageToBot(input);

  const botMessage = {
    id: Date.now().toString() + '_bot',
    text: botResponse.text,
    sender: 'bot',
    emotion: botResponse.emotion,
  };

  setMessages(prev => [...prev, botMessage]);
  setTyping(false);
};

  return (
    <KeyboardAvoidingView
  style={styles.container}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
  
  <Header />
      
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <MessageBubble message={item.text} sender={item.sender} />
        )}
        contentContainerStyle={styles.chatContainer}
      />

      {typing && <TypingIndicator />}

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffe0',
  },

  chatContainer: {
    padding: 16,
  },
});