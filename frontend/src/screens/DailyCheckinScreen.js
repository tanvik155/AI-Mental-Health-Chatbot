import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import FloatingFooter from '../components/FloatingFooter';

const { width } = Dimensions.get('window');

const DailyCheckinScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEnergy, setSelectedEnergy] = useState(null);
  const [selectedSleep, setSelectedSleep] = useState(null);
  const [selectedStress, setSelectedStress] = useState(null);
  const [gratitude, setGratitude] = useState(['', '', '']);
  const [reflection, setReflection] = useState('');
  const [goal, setGoal] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(1));

  // Mock check-in history
  const [checkins, setCheckins] = useState([
    {
      id: '1',
      date: '2024-01-15',
      mood: { name: 'Happy', emoji: '😊', score: 4 },
      energy: { name: 'Energetic', emoji: '⚡', score: 4 },
      sleep: { name: 'Good', emoji: '😊', score: 4 },
      stress: { name: 'Low', emoji: '🙂', score: 4 },
      gratitude: ['Family time', 'Good weather', 'Delicious lunch'],
      reflection: 'Productive day at work',
    },
    {
      id: '2',
      date: '2024-01-14',
      mood: { name: 'Calm', emoji: '🌤️', score: 3 },
      energy: { name: 'Moderate', emoji: '🌊', score: 3 },
      sleep: { name: 'Fair', emoji: '😐', score: 3 },
      stress: { name: 'Moderate', emoji: '😐', score: 3 },
      gratitude: ['Morning walk', 'Coffee', 'Good book'],
      reflection: 'Took time to relax',
    },
  ]);

  const moods = [
    { name: 'Amazing', emoji: '🤩', score: 5, color: '#FFD93D', description: 'Feeling fantastic!' },
    { name: 'Happy', emoji: '😊', score: 4, color: '#A8E6CF', description: 'Good vibes today' },
    { name: 'Okay', emoji: '😐', score: 3, color: '#FFB347', description: 'Could be better' },
    { name: 'Down', emoji: '😔', score: 2, color: '#FF8B94', description: 'Not feeling great' },
    { name: 'Stressed', emoji: '😫', score: 1, color: '#FF6B6B', description: 'Feeling overwhelmed' },
  ];

  const energyLevels = [
    { name: 'Energetic', emoji: '⚡', score: 5, description: 'Full of energy!' },
    { name: 'Active', emoji: '💪', score: 4, description: 'Feeling productive' },
    { name: 'Moderate', emoji: '🌊', score: 3, description: 'Steady pace' },
    { name: 'Tired', emoji: '😴', score: 2, description: 'Low energy' },
    { name: 'Exhausted', emoji: '🛌', score: 1, description: 'Need rest' },
  ];

  const sleepQuality = [
    { name: 'Excellent', emoji: '🌟', score: 5, description: 'Slept like a baby' },
    { name: 'Good', emoji: '😊', score: 4, description: 'Well rested' },
    { name: 'Fair', emoji: '😐', score: 3, description: 'Could be better' },
    { name: 'Poor', emoji: '😔', score: 2, description: 'Tossed and turned' },
    { name: 'Terrible', emoji: '😫', score: 1, description: 'Barely slept' },
  ];

  const stressLevels = [
    { name: 'None', emoji: '😌', score: 5, description: 'Completely relaxed' },
    { name: 'Low', emoji: '🙂', score: 4, description: 'Minor stress' },
    { name: 'Moderate', emoji: '😐', score: 3, description: 'Managing' },
    { name: 'High', emoji: '😰', score: 2, description: 'Feeling pressure' },
    { name: 'Severe', emoji: '😫', score: 1, description: 'Overwhelmed' },
  ];

  // Recommendations based on mood and stress
  const getRecommendations = (mood, stress) => {
    const moodObj = moods.find(m => m.name === mood);
    const stressObj = stressLevels.find(s => s.name === stress);
    
    if (moodObj?.score <= 2 || stressObj?.score <= 2) {
      return {
        title: '💙 Take a Moment',
        suggestions: [
          'Try a 5-minute breathing exercise',
          'Listen to calming music',
          'Reach out to a friend or family member',
          'Take a short walk outside',
        ],
        action: 'Try Relaxation',
        actionRoute: 'Relax',
      };
    } else if (moodObj?.score >= 4 && stressObj?.score >= 4) {
      return {
        title: '✨ Keep the Momentum',
        suggestions: [
          'Share your positive energy with someone',
          'Write down what made you feel good today',
          'Set a small goal for tomorrow',
          'Practice gratitude before sleeping',
        ],
        action: 'Journal Your Joy',
        actionRoute: 'Journal',
      };
    } else {
      return {
        title: '🌱 Nurture Your Wellbeing',
        suggestions: [
          'Take 10 minutes for yourself today',
          'Stay hydrated and eat well',
          'Get some fresh air',
          'Do one thing you enjoy',
        ],
        action: 'Chat with AI',
        actionRoute: 'Chat',
      };
    }
  };

  // Generate personalized insights
  const getInsights = (mood, energy, sleep, stress) => {
    const insights = [];
    const moodScore = moods.find(m => m.name === mood)?.score || 3;
    const energyScore = energyLevels.find(e => e.name === energy)?.score || 3;
    const sleepScore = sleepQuality.find(s => s.name === sleep)?.score || 3;
    const stressScore = stressLevels.find(s => s.name === stress)?.score || 3;

    if (moodScore < 3) {
      insights.push("Your mood seems low today. Remember that it's okay to not be okay.");
    }
    if (energyScore < 3) {
      insights.push("Low energy levels suggest you might need some rest or nourishment.");
    }
    if (sleepScore < 3) {
      insights.push("Poor sleep can affect your mood and energy. Consider a relaxing bedtime routine.");
    }
    if (stressScore < 3) {
      insights.push("High stress levels detected. Taking small breaks can help manage stress.");
    }
    if (moodScore >= 4 && energyScore >= 4) {
      insights.push("You're in a great state today! Use this positive energy wisely.");
    }
    
    if (insights.length === 0) {
      insights.push("You're doing well! Small consistent efforts lead to lasting wellbeing.");
    }
    
    return insights;
  };

  const animateTransition = (newStep) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setStep(newStep));
  };

  const handleNext = () => {
    if (step === 1 && !selectedMood) {
      Alert.alert('Select Mood', 'Please select how you\'re feeling today');
      return;
    }
    if (step === 2 && !selectedEnergy) {
      Alert.alert('Select Energy', 'Please select your energy level');
      return;
    }
    if (step === 3 && !selectedSleep) {
      Alert.alert('Select Sleep', 'Please rate your sleep quality');
      return;
    }
    if (step === 4 && !selectedStress) {
      Alert.alert('Select Stress', 'Please rate your stress level');
      return;
    }
    if (step === 5 && gratitude.some(g => g.trim() === '')) {
      Alert.alert('Complete Gratitude', 'Please fill in all three things you\'re grateful for');
      return;
    }
    if (step === 6 && !reflection.trim()) {
      Alert.alert('Share Reflection', 'Please share a brief reflection about your day');
      return;
    }
    
    if (step < 7) {
      animateTransition(step + 1);
    } else {
      submitCheckin();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      animateTransition(step - 1);
    }
  };

  const submitCheckin = () => {
    const moodObj = moods.find(m => m.name === selectedMood);
    const energyObj = energyLevels.find(e => e.name === selectedEnergy);
    const sleepObj = sleepQuality.find(s => s.name === selectedSleep);
    const stressObj = stressLevels.find(s => s.name === selectedStress);
    
    const newCheckin = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      mood: moodObj,
      energy: energyObj,
      sleep: sleepObj,
      stress: stressObj,
      gratitude: gratitude.filter(g => g.trim() !== ''),
      reflection: reflection,
      goal: goal,
    };

    setCheckins([newCheckin, ...checkins]);
    
    // Calculate overall wellness score
    const totalScore = (moodObj.score + energyObj.score + sleepObj.score + stressObj.score) / 4;
    const wellnessScore = (totalScore / 5) * 100;
    
    // Generate insights and recommendations
    const insights = getInsights(selectedMood, selectedEnergy, selectedSleep, selectedStress);
    const recommendations = getRecommendations(selectedMood, selectedStress);
    
    setCompletionData({
      wellnessScore: Math.round(wellnessScore),
      insights,
      recommendations,
      checkin: newCheckin,
    });
    
    setShowCompletionModal(true);
  };

  const resetCheckin = () => {
    setStep(1);
    setSelectedMood(null);
    setSelectedEnergy(null);
    setSelectedSleep(null);
    setSelectedStress(null);
    setGratitude(['', '', '']);
    setReflection('');
    setGoal('');
  };

  const renderProgress = () => {
    const progress = (step / 7) * 100;
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of 7</Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>How are you feeling today?</Text>
      <Text style={styles.stepSubtitle}>Select your mood</Text>
      
      <View style={styles.optionsGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.name}
            style={[
              styles.moodOption,
              selectedMood === mood.name && styles.selectedOption,
              { borderColor: selectedMood === mood.name ? mood.color : '#F0F0F0' }
            ]}
            onPress={() => setSelectedMood(mood.name)}
          >
            <Text style={styles.moodEmojiLarge}>{mood.emoji}</Text>
            <Text style={styles.moodNameLarge}>{mood.name}</Text>
            <Text style={styles.moodDescription}>{mood.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>What's your energy level?</Text>
      <Text style={styles.stepSubtitle}>How energetic do you feel?</Text>
      
      <View style={styles.optionsList}>
        {energyLevels.map((energy) => (
          <TouchableOpacity
            key={energy.name}
            style={[
              styles.optionItem,
              selectedEnergy === energy.name && styles.selectedOption
            ]}
            onPress={() => setSelectedEnergy(energy.name)}
          >
            <Text style={styles.optionEmoji}>{energy.emoji}</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionName}>{energy.name}</Text>
              <Text style={styles.optionDescription}>{energy.description}</Text>
            </View>
            {selectedEnergy === energy.name && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>How did you sleep?</Text>
      <Text style={styles.stepSubtitle}>Rate your sleep quality</Text>
      
      <View style={styles.optionsList}>
        {sleepQuality.map((sleep) => (
          <TouchableOpacity
            key={sleep.name}
            style={[
              styles.optionItem,
              selectedSleep === sleep.name && styles.selectedOption
            ]}
            onPress={() => setSelectedSleep(sleep.name)}
          >
            <Text style={styles.optionEmoji}>{sleep.emoji}</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionName}>{sleep.name}</Text>
              <Text style={styles.optionDescription}>{sleep.description}</Text>
            </View>
            {selectedSleep === sleep.name && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep4 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>What's your stress level?</Text>
      <Text style={styles.stepSubtitle}>How stressed do you feel?</Text>
      
      <View style={styles.optionsList}>
        {stressLevels.map((stress) => (
          <TouchableOpacity
            key={stress.name}
            style={[
              styles.optionItem,
              selectedStress === stress.name && styles.selectedOption
            ]}
            onPress={() => setSelectedStress(stress.name)}
          >
            <Text style={styles.optionEmoji}>{stress.emoji}</Text>
            <View style={styles.optionContent}>
              <Text style={styles.optionName}>{stress.name}</Text>
              <Text style={styles.optionDescription}>{stress.description}</Text>
            </View>
            {selectedStress === stress.name && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep5 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>What are you grateful for?</Text>
      <Text style={styles.stepSubtitle}>List 3 things that brought you joy</Text>
      
      <View style={styles.gratitudeContainer}>
        {gratitude.map((item, index) => (
          <View key={index} style={styles.gratitudeItem}>
            <Text style={styles.gratitudeNumber}>{index + 1}</Text>
            <TextInput
              style={styles.gratitudeInput}
              placeholder={`I'm grateful for...`}
              placeholderTextColor="#999"
              value={item}
              onChangeText={(text) => {
                const newGratitude = [...gratitude];
                newGratitude[index] = text;
                setGratitude(newGratitude);
              }}
            />
          </View>
        ))}
      </View>
    </Animated.View>
  );

  const renderStep6 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>Reflect on your day</Text>
      <Text style={styles.stepSubtitle}>What went well? What could improve?</Text>
      
      <TextInput
        style={styles.reflectionInput}
        placeholder="Write your reflections here..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={6}
        value={reflection}
        onChangeText={setReflection}
      />
    </Animated.View>
  );

  const renderStep7 = () => (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Text style={styles.stepTitle}>Set an intention</Text>
      <Text style={styles.stepSubtitle}>What's one thing you want to focus on?</Text>
      
      <TextInput
        style={styles.goalInput}
        placeholder="E.g., Practice mindfulness, Stay positive, Be kind to myself..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={3}
        value={goal}
        onChangeText={setGoal}
      />
      
      <View style={styles.summaryPreview}>
        <Text style={styles.summaryTitle}>Your Check-in Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Mood:</Text>
          <Text style={styles.summaryValue}>{selectedMood}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Energy:</Text>
          <Text style={styles.summaryValue}>{selectedEnergy}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Sleep:</Text>
          <Text style={styles.summaryValue}>{selectedSleep}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Stress:</Text>
          <Text style={styles.summaryValue}>{selectedStress}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const CompletionModal = () => (
    <Modal
      visible={showCompletionModal}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowCompletionModal(false)}
    >
      <SafeAreaView style={styles.completionContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.completionContent}>
            {/* Celebration Header */}
            <View style={styles.celebrationHeader}>
              <Text style={styles.celebrationEmoji}>🎉</Text>
              <Text style={styles.celebrationTitle}>Check-in Complete!</Text>
              <Text style={styles.celebrationText}>
                Thank you for taking time for yourself
              </Text>
            </View>

            {/* Wellness Score */}
            <View style={styles.wellnessCard}>
              <Text style={styles.wellnessTitle}>Your Wellness Score</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreNumber}>{completionData?.wellnessScore}</Text>
                <Text style={styles.scoreTotal}>/100</Text>
              </View>
              <View style={styles.scoreBar}>
                <View 
                  style={[
                    styles.scoreFill, 
                    { width: `${completionData?.wellnessScore}%` }
                  ]} 
                />
              </View>
              <Text style={styles.scoreMessage}>
                {completionData?.wellnessScore >= 80 
                  ? "🌟 Excellent! You're thriving today!"
                  : completionData?.wellnessScore >= 60
                  ? "👍 Good job! Keep nurturing yourself."
                  : completionData?.wellnessScore >= 40
                  ? "💪 You're doing okay. Small steps matter!"
                  : "💙 It's okay to not be okay. Reach out if you need support."}
              </Text>
            </View>

            {/* Insights Section */}
            <View style={styles.insightsCard}>
              <Text style={styles.cardTitle}>📊 Insights</Text>
              {completionData?.insights.map((insight, index) => (
                <View key={index} style={styles.insightItem}>
                  <Text style={styles.insightBullet}>•</Text>
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </View>

            {/* Recommendations Section */}
            <View style={styles.recommendationsCard}>
              <Text style={styles.cardTitle}>{completionData?.recommendations.title}</Text>
              <View style={styles.suggestionsList}>
                {completionData?.recommendations.suggestions.map((suggestion, index) => (
                  <View key={index} style={styles.suggestionItem}>
                    <Text style={styles.suggestionBullet}>✨</Text>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Gratitude Summary */}
            <View style={styles.gratitudeSummary}>
              <Text style={styles.cardTitle}>🙏 Today's Gratitude</Text>
              {completionData?.checkin.gratitude.map((item, index) => (
                <Text key={index} style={styles.gratitudeSummaryItem}>
                  {index + 1}. {item}
                </Text>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.completionButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setShowCompletionModal(false);
                  resetCheckin();
                  navigation.goBack();
                }}
              >
                <Text style={styles.secondaryButtonText}>Home</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setShowCompletionModal(false);
                  resetCheckin();
                  navigation.navigate(completionData?.recommendations.actionRoute);
                }}
              >
                <Text style={styles.primaryButtonText}>
                  {completionData?.recommendations.action} →
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.historyLink}
              onPress={() => {
                setShowCompletionModal(false);
                setShowHistory(true);
              }}
            >
              <Text style={styles.historyLinkText}>View Check-in History</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const HistoryModal = () => (
    <Modal
      visible={showHistory}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowHistory(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Check-in History</Text>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.historyScroll}>
          {checkins.map((checkin) => (
            <View key={checkin.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{checkin.date}</Text>
                <Text style={styles.historyMood}>
                  {checkin.mood?.emoji} {checkin.mood?.name}
                </Text>
              </View>
              
              <View style={styles.historyStats}>
                <View style={styles.historyStat}>
                  <Text style={styles.historyStatEmoji}>⚡</Text>
                  <Text style={styles.historyStatText}>{checkin.energy?.name}</Text>
                </View>
                <View style={styles.historyStat}>
                  <Text style={styles.historyStatEmoji}>😴</Text>
                  <Text style={styles.historyStatText}>{checkin.sleep?.name}</Text>
                </View>
                <View style={styles.historyStat}>
                  <Text style={styles.historyStatEmoji}>😰</Text>
                  <Text style={styles.historyStatText}>{checkin.stress?.name}</Text>
                </View>
              </View>
              
              <View style={styles.historyGratitude}>
                <Text style={styles.historySectionTitle}>Grateful for:</Text>
                {checkin.gratitude.map((item, idx) => (
                  <Text key={idx} style={styles.historyGratitudeItem}>• {item}</Text>
                ))}
              </View>
              
              {checkin.reflection && (
                <Text style={styles.historyReflection}>{checkin.reflection}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Text style={styles.headerIcon}>🧠</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Daily Check-in</Text>
                <Text style={styles.headerSubtitle}>Take a moment for yourself</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.historyButton}
              onPress={() => setShowHistory(true)}
            >
              <Text style={styles.historyButtonText}>📊 History</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        {renderProgress()}

        {/* Step Content */}
        <View style={styles.contentContainer}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
          {step === 6 && renderStep6()}
          {step === 7 && renderStep7()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}> Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextButton, step === 1 && !selectedMood && styles.disabledButton]}
            onPress={handleNext}
            disabled={step === 1 && !selectedMood}
          >
            <Text style={styles.nextButtonText}>
              {step === 7 ? 'Complete ✓' : 'Next '}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerPadding} />
      </ScrollView>

      <HistoryModal />
      <CompletionModal />
      <FloatingFooter active="CheckIn" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9DB',
  },
  header: {
    backgroundColor: '#FFF3B0',
    paddingTop: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  headerIcon: {
    fontSize: 25,
    marginTop: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 25,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 2,
  },
  historyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 25,
  },
  historyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    minHeight: 500,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodOption: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#FFF9E8',
    transform: [{ scale: 1.02 }],
  },
  moodEmojiLarge: {
    fontSize: 48,
    marginBottom: 12,
  },
  moodNameLarge: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  optionEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#777',
  },
  checkmark: {
    fontSize: 20,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  gratitudeContainer: {
    gap: 16,
  },
  gratitudeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gratitudeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B6B',
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  gratitudeInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#333',
  },
  reflectionInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 150,
  },
  goalInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 20,
  },
  summaryPreview: {
    backgroundColor: '#FFF9E8',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#777',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B6B',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF9DB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF3B0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  historyScroll: {
    padding: 20,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyDate: {
    fontSize: 14,
    color: '#777',
    fontWeight: '500',
  },
  historyMood: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
  },
  historyStat: {
    alignItems: 'center',
  },
  historyStatEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  historyStatText: {
    fontSize: 12,
    color: '#666',
  },
  historyGratitude: {
    marginBottom: 12,
  },
  historySectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#777',
    marginBottom: 6,
  },
  historyGratitudeItem: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    paddingLeft: 8,
  },
  historyReflection: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  completionContainer: {
    flex: 1,
    backgroundColor: '#FFF9DB',
  },
  completionContent: {
    padding: 20,
  },
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  celebrationEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  celebrationTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  celebrationText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  wellnessCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  wellnessTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  scoreTotal: {
    fontSize: 18,
    color: '#999',
    marginLeft: 4,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  scoreMessage: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  insightBullet: {
    fontSize: 14,
    color: '#FF6B6B',
    marginRight: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: '#FFF9E8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  suggestionsList: {
    gap: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  suggestionBullet: {
    fontSize: 16,
    marginRight: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  gratitudeSummary: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  gratitudeSummaryItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    paddingLeft: 8,
  },
  completionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  historyLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyLinkText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  footerPadding: {
    height: 100,
  },
});

export default DailyCheckinScreen;