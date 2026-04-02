import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!name || !email || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Signup pressed with:', {name, email, newPassword});
    navigation.navigate('Gender');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          
          {/* Welcome Message */}
          <Text style={styles.greeting}>Hi there! 👋</Text>

          {/* Title */}
          <Text style={styles.title}>Create Your Account</Text>

          {/* Name */}
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          {/* Email */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* New Password */}
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#888"
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          {/* Confirm Password */}
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          {/* Signup Button */}
          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Already have account */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginPress}>
              <Text style={styles.footerLink}>Login here</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffe0',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  innerContainer: {
    paddingHorizontal: 30,
    paddingVertical: 40,
    alignItems: 'center',
  },

  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    color: '#d9cb08',
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: '#6b5500',
  },

  input: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#daa520',
  },

  button: {
    width: '100%',
    backgroundColor: '#ffd700',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    fontWeight: '600',
    color: '#5c4500',
    fontSize: 16,
  },

  footerContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    color: '#7a6500',
    fontSize: 13,
  },

  footerLink: {
    color: '#ffd700',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
