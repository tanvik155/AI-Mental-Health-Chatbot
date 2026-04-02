import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const getEmotionColor = (emotion) => {
  if (!emotion) return '#ffffff';

  switch (emotion.toLowerCase()) {
    case 'sad':
      return '#ffffff';
    case 'anxious':
      return '#ffffff';
    case 'happy':
      return '#ffffff';
    case 'stressed':
      return '#ffffff';
    default:
      return '#ffffff';
  }
};

const MessageBubble = ({message, sender, emotion}) => {
  const isUser = sender === 'user';

  return (
    <View
      style={[
        styles.container,
        isUser
          ? styles.userBubble
          : { ...styles.botBubble, backgroundColor: getEmotionColor(emotion) },
      ]}>
      
      <Text style={isUser ? styles.userText : styles.botText}>
        {message}
      </Text>

      {!isUser && emotion && (
        <Text style={styles.emotionText}>
          {emotion}
        </Text>
      )}
      
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  container: {
    padding: 14,
    borderRadius: 18,
    maxWidth: '75%',
    marginBottom: 12,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffd700',
  },

  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffe0',
  },

  userText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 20,
  },

  botText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 20,
  },

  emotionText: {
    marginTop: 6,
    fontSize: 11,
    color: '#daa520',
    fontStyle: 'italic',
  },
});