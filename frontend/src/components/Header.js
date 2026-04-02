import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';

const Header = () => {
  const handleBackPress = () => {
    Alert.alert('Back', 'Are you sure you want to go back?', [
      {text: 'Cancel', onPress: () => {}, style: 'cancel'},
      {text: 'Yes', onPress: () => console.log('Going back')},
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>MindCare</Text>
        <Text style={styles.subtitle}>Your safe space 💗</Text>
      </View>
      <View style={styles.spacer} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: 55,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffe0',
    borderBottomWidth: 1,
    borderColor: '#daa520',
  },

  backButton: {
    padding: 8,
    marginRight: 12,
  },

  backButtonText: {
    fontSize: 24,
    color: '#d9cb08',
    fontWeight: 'bold',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d9cb08',
  },

  subtitle: {
    fontSize: 12,
    color: '#b8860b',
    marginTop: 3,
  },

  spacer: {
    width: 40,
  },
});