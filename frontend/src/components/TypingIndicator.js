import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TypingIndicator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AI is typing...</Text>
    </View>
  );
};

export default TypingIndicator;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
  },

  text: {
    color: '#ffd700',
    fontStyle: 'italic',
  },
});