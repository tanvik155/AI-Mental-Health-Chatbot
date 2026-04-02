import React from 'react';
import {View, TextInput, TouchableOpacity, Text, StyleSheet} from 'react-native';

const ChatInput = ({value, onChange, onSend}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Share what's on your mind..."
        placeholderTextColor="#999"
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={onSend}>
        <Text style={styles.send}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#daa520',
    backgroundColor: '#ffffe0',
  },

  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  button: {
    marginLeft: 10,
    backgroundColor: '#ffd700',
    borderRadius: 14,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },

  send: {
    color: '#fff',
    fontWeight: '600',
  },
});