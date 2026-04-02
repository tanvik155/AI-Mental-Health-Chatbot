import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const GenderScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);

  const handleContinue = () => {
    if (selected) {
      navigation.navigate('Dashboard');
    }
  };

  const Option = ({title}) => (
    <TouchableOpacity
      style={[
        styles.option,
        selected === title && styles.optionSelected,
      ]}
      onPress={() => setSelected(title)}>
      <Text
        style={[
          styles.optionText,
          selected === title && styles.optionTextSelected,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Text style={styles.title}>Select Your Gender</Text>
        <Text style={styles.subtitle}>
          This helps us personalize your experience
        </Text>

        <View style={styles.optionsContainer}>
          <Option title="Female" />
          <Option title="Male" />
          {/* <Option title="Non-binary" /> */}
          <Option title="Prefer not to say" />
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            !selected && {opacity: 0.4},
          ]}
          onPress={handleContinue}
          disabled={!selected}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GenderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9DB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  option: {
    backgroundColor: '#FFF3B0',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 15,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#FFD60A',
  },
  optionText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#222',
    fontWeight: '700',
  },
  continueButton: {
    marginTop: 40,
    backgroundColor: '#FFC300',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});