import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login pressed');
    navigation.navigate('Gender');
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      <View style={styles.innerContainer}>
        
        {/* Center Image */}
        <Image
          source={require('../assets/login.png')}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>

        {/* Email */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Do not have account - Sign up link */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Do not have an account? </Text>
          <TouchableOpacity onPress={handleSignupPress}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9db',
    justifyContent: 'center',
  },

  innerContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },

  image: {
    width: 400,
    height: 250,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    color: '#6b5500',
  },

  input: {
    width: '100%',
    backgroundColor: '#f0eee3',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
  },

  button: {
    width: '100%',
    backgroundColor: '#ffd43b',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontWeight: '600',
    color: '#5c4500',
    fontSize: 16,
  },

  footerContainer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerText: {
    color: '#7a6500',
    fontSize: 13,
  },

  signupLink: {
    color: '#ffd700',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});