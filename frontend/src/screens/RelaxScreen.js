import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  Vibration,
  Alert,
} from 'react-native';
import FloatingFooter from '../components/FloatingFooter';

const { width } = Dimensions.get('window');

const RelaxScreen = ({ navigation }) => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;
  let intervalRef = useRef(null);

  const categories = [
    { id: 'all', name: 'All', icon: '🎯' },
    { id: 'breathing', name: 'Breathing', icon: '🌬️' },
    { id: 'meditation', name: 'Meditation', icon: '🧘' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'exercises', name: 'Exercises', icon: '🤸' },
  ];

  const exercises = [
    {
      id: '1',
      title: 'Box Breathing',
      description: 'Balance your nervous system with 4-second breath cycles',
      duration: 3,
      category: 'breathing',
      icon: '🔲',
      color: '#A8E6CF',
      instructions: [
        'Inhale for 4 seconds',
        'Hold for 4 seconds',
        'Exhale for 4 seconds',
        'Hold for 4 seconds',
        'Repeat for 3 minutes',
      ],
    },
    {
      id: '2',
      title: '4-7-8 Breathing',
      description: 'Calm your mind with relaxing breath pattern',
      duration: 2,
      category: 'breathing',
      icon: '🌊',
      color: '#FFD93D',
      instructions: [
        'Inhale quietly through nose for 4 seconds',
        'Hold breath for 7 seconds',
        'Exhale completely through mouth for 8 seconds',
        'Repeat for 2 minutes',
      ],
    },
    {
      id: '3',
      title: 'Body Scan Meditation',
      description: 'Progressive relaxation from head to toe',
      duration: 5,
      category: 'meditation',
      icon: '🧘',
      color: '#FFB347',
      instructions: [
        'Find a comfortable position',
        'Close your eyes and breathe naturally',
        'Focus attention on your feet',
        'Slowly move awareness up through your body',
        'Notice sensations without judgment',
      ],
    },
    {
      id: '4',
      title: 'Calming Music',
      description: 'Soothing sounds for deep relaxation',
      duration: 10,
      category: 'music',
      icon: '🎵',
      color: '#6C5CE7',
      instructions: [
        'Find a quiet space',
        'Close your eyes',
        'Focus on the music',
        'Let thoughts drift away',
        'Allow yourself to relax completely',
      ],
    },
    {
      id: '5',
      title: 'Progressive Relaxation',
      description: 'Release tension muscle by muscle',
      duration: 8,
      category: 'exercises',
      icon: '💪',
      color: '#74B9FF',
      instructions: [
        'Tense your feet for 5 seconds',
        'Release and notice the relaxation',
        'Move up to legs, then stomach',
        'Continue through chest, arms, and face',
        'Feel the wave of relaxation',
      ],
    },
    {
      id: '6',
      title: 'Loving-Kindness Meditation',
      description: 'Cultivate compassion and peace',
      duration: 5,
      category: 'meditation',
      icon: '💖',
      color: '#FF8B94',
      instructions: [
        'Sit comfortably with eyes closed',
        'Repeat: May I be happy and peaceful',
        'Extend to loved ones',
        'Extend to all beings',
        'Feel warmth in your heart',
      ],
    },
  ];

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && selectedExercise) {
      startTimer();
      startBreathingAnimation();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, selectedExercise]);

  const startTimer = () => {
    const durationSeconds = selectedExercise.duration * 60;
    setTimeLeft(durationSeconds);
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          completeExercise();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startBreathingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: 1.5,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const completeExercise = () => {
    setIsActive(false);
    setShowCompletion(true);
    Vibration.vibrate(500);
    
    // Reset animations
    breathAnim.setValue(1);
    scaleAnim.setValue(1);
    
    setTimeout(() => {
      setShowCompletion(false);
      setSelectedExercise(null);
    }, 3000);
  };

  const startExercise = (exercise) => {
    setSelectedExercise(exercise);
    setIsActive(true);
    setBreathPhase('inhale');
    setBreathCount(0);
  };

  const stopExercise = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setSelectedExercise(null);
    Alert.alert('Session Ended', 'Take care of yourself. You can try again anytime.');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathInstruction = () => {
    const cycleTime = timeLeft % 8;
    if (cycleTime < 4) {
      if (breathPhase !== 'inhale') setBreathPhase('inhale');
      return 'Breathe In... 🌬️';
    } else {
      if (breathPhase !== 'exhale') setBreathPhase('exhale');
      return 'Breathe Out... 💨';
    }
  };

  const ExerciseCard = ({ exercise }) => (
    <TouchableOpacity
      style={[styles.exerciseCard, { borderTopColor: exercise.color }]}
      onPress={() => startExercise(exercise)}
    >
      <View style={styles.exerciseHeader}>
        <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
        </View>
      </View>
      <View style={styles.exerciseFooter}>
        <View style={styles.durationBadge}>
          <Text style={styles.durationIcon}>⏱️</Text>
          <Text style={styles.durationText}>{exercise.duration} min</Text>
        </View>
        <Text style={styles.startButton}>Start →</Text>
      </View>
    </TouchableOpacity>
  );

  const ActiveExerciseModal = () => (
    <Modal
      visible={isActive}
      transparent={true}
      animationType="slide"
      onRequestClose={stopExercise}
    >
      <View style={styles.activeModalContainer}>
        <View style={styles.activeContent}>
          <TouchableOpacity style={styles.closeButton} onPress={stopExercise}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.activeTitle}>{selectedExercise?.title}</Text>
          
          <Animated.View
            style={[
              styles.breathingCircle,
              {
                transform: [{ scale: breathAnim }],
                backgroundColor: selectedExercise?.color,
              },
            ]}
          >
            <Text style={styles.breathingText}>
              {selectedExercise?.category === 'breathing' 
                ? getBreathInstruction()
                : 'Relax... 🧘'}
            </Text>
            <Text style={styles.breathCount}>
              {breathPhase === 'inhale' ? '↑' : '↓'}
            </Text>
          </Animated.View>
          
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>Remaining</Text>
          </View>
          
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            {selectedExercise?.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionBullet}>•</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.stopButton} onPress={stopExercise}>
            <Text style={styles.stopButtonText}>End Session</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const CompletionModal = () => (
    <Modal
      visible={showCompletion}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.completionContainer}>
        <View style={styles.completionContent}>
          <Text style={styles.completionEmoji}>🎉</Text>
          <Text style={styles.completionTitle}>Great Job!</Text>
          <Text style={styles.completionText}>
            You've completed {selectedExercise?.title}
          </Text>
          <Text style={styles.completionSubtext}>
            You took an important step for your wellbeing
          </Text>
          <Animated.View style={styles.checkmark}>
            <Text style={styles.checkmarkText}>✓</Text>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );

  const TipsCard = () => (
    <View style={styles.tipsCard}>
      <Text style={styles.tipsTitle}>✨ Relaxation Tips</Text>
      <View style={styles.tipsList}>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>📍</Text>
          <Text style={styles.tipText}>Find a quiet, comfortable space</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>🕐</Text>
          <Text style={styles.tipText}>Start with shorter sessions</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>🌬️</Text>
          <Text style={styles.tipText}>Focus on your breath</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>💭</Text>
          <Text style={styles.tipText}>Don't judge wandering thoughts</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Text style={styles.headerIcon}>🌿</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Relax & Unwind</Text>
                <Text style={styles.headerSubtitle}>Find your peace</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Exercises Grid */}
        <View style={styles.exercisesContainer}>
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </View>

        {/* Tips Section */}
        <TipsCard />

        {/* Daily Inspiration */}
        <View style={styles.inspirationCard}>
          <Text style={styles.inspirationQuote}>
            "Almost everything will work again if you unplug it for a few minutes, including you."
          </Text>
          <Text style={styles.inspirationAuthor}>- Anne Lamott</Text>
        </View>

        <View style={styles.footerPadding} />
      </ScrollView>

      <ActiveExerciseModal />
      <CompletionModal />
      <FloatingFooter active="Relax" navigation={navigation} />
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
    marginTop: 20,
  },
  headerIcon: {
    fontSize: 28,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryNameActive: {
    color: '#fff',
  },
  exercisesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderTopWidth: 4,
    borderTopColor: '#A8E6CF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  exerciseDescription: {
    fontSize: 13,
    color: '#777',
    lineHeight: 18,
  },
  exerciseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  durationIcon: {
    fontSize: 12,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  startButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  tipsCard: {
    backgroundColor: '#FFF9E8',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  tipsList: {
    gap: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
  },
  inspirationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  inspirationQuote: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 10,
  },
  inspirationAuthor: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  activeModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeContent: {
    backgroundColor: '#FFF9DB',
    borderRadius: 30,
    padding: 24,
    width: width - 40,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  activeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  breathingCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  breathingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  breathCount: {
    fontSize: 32,
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FF6B6B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timerLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  instructionsContainer: {
    backgroundColor: '#FFF9E8',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  instructionBullet: {
    fontSize: 14,
    color: '#FF6B6B',
    marginRight: 10,
  },
  instructionText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  stopButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  completionContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionContent: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    width: width - 60,
  },
  completionEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  completionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionSubtext: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  checkmark: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  footerPadding: {
    height: 100,
  },
});

export default RelaxScreen;