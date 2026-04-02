import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const FloatingFooter = ({active, navigation}) => {
  const Tab = ({label, screen, emoji}) => {
    const isActive = active === screen;

    return (
      <TouchableOpacity
        style={styles.tab}
        onPress={() => navigation.navigate(screen)}>
        <Text style={[styles.icon, isActive && styles.activeIcon]}>
          {emoji}
        </Text>
        <Text style={[styles.text, isActive && styles.activeText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Tab label="Home" screen="Dashboard" emoji="🏠" />
      <Tab label="Journal" screen="Journal" emoji="📓" />
      <Tab label="Profile" screen="Profile" emoji="👤" />
    </View>
  );
};

export default FloatingFooter;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fdf0a9',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  tab: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    color: '#888',
  },
  activeIcon: {
    color: '#FF6B9A',
  },
  text: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  activeText: {
    color: '#FF6B9A',
    fontWeight: '600',
  },
});