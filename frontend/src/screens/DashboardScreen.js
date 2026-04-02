import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Svg, Circle, Rect, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import FloatingFooter from '../components/FloatingFooter';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Stable mood data with consistent patterns
  const moodData = {
    week: [82, 78, 75, 80, 85, 88, 86],
    month: [78, 76, 74, 72, 75, 78, 80, 82, 85, 84, 82, 80, 78, 79, 81, 83, 85, 86, 84, 82, 80, 78, 76, 75, 77, 79, 81, 83],
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weeks: ['W1', 'W2', 'W3', 'W4'],
  };

  const moodStats = {
    average: 82,
    streak: 7,
    bestMood: 'Happy 😊',
    weeklyTrend: '+8%',
  };

  // Happy thoughts collection
  const happyThoughts = [
    "✨ You're doing amazing! Every small step counts.",
    "🌼 Your presence makes the world brighter.",
    "💪 You've overcome 100% of your bad days so far!",
    "🌟 Today is a fresh start filled with possibilities.",
    "🌸 Be proud of how hard you're trying.",
    "💖 You deserve peace and happiness today.",
  ];

  const [currentThought] = useState(happyThoughts[Math.floor(Math.random() * happyThoughts.length)]);

  const recentActivities = [
    { id: 1, type: 'Journal', time: '2 hours ago', mood: 'Calm' },
    { id: 2, type: 'Breathing', time: 'Yesterday', mood: 'Relaxed' },
    { id: 3, type: 'AI Chat', time: '2 days ago', mood: 'Thoughtful' },
  ];

  const mindfulnessMinutes = 45;
  const weeklyGoal = 120;

  const Card = ({ title, subtitle, emoji, onPress, highlighted = false }) => (
    <TouchableOpacity 
      style={[styles.card, highlighted && styles.highlightedCard]} 
      onPress={onPress}
    >
      <Text style={[styles.cardEmoji, highlighted && styles.highlightedEmoji]}>{emoji}</Text>
      <Text style={[styles.cardTitle, highlighted && styles.highlightedTitle]}>{title}</Text>
      <Text style={[styles.cardSubtitle, highlighted && styles.highlightedSubtitle]}>{subtitle}</Text>
      {highlighted && (
        <View style={styles.highlightBadge}>
          <Text style={styles.highlightBadgeText}>✨ Try Now</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const StableLineChart = ({ data, labels, height = 180 }) => {
    const maxValue = 100;
    const minValue = 0;
    const chartWidth = width - 60;
    const stepX = chartWidth / (data.length - 1);
    
    const points = data.map((value, index) => ({
      x: 30 + index * stepX,
      y: height - (value / maxValue) * (height - 40) - 20,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // Create area path for gradient fill
    const areaPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + 
      ` L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`;

    return (
      <View style={styles.chartContainer}>
        <Svg height={height + 40} width={width - 40}>
          <Defs>
            <LinearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.05" />
            </LinearGradient>
          </Defs>
          
          {/* Background grid with stable reference lines */}
          {[0, 25, 50, 75, 100].map((value, i) => {
            const y = height - (value / maxValue) * (height - 40) - 20;
            return (
              <G key={i}>
                <Line
                  x1="30"
                  y1={y}
                  x2={width - 30}
                  y2={y}
                  stroke="#E8E8E8"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                />
                <SvgText
                  x="20"
                  y={y + 4}
                  fontSize="10"
                  fill="#999"
                  textAnchor="start"
                >
                  {value}%
                </SvgText>
              </G>
            );
          })}
          
          {/* Gradient area fill */}
          <Path d={areaPath} fill="url(#gradient)" />
          
          {/* Main line */}
          <Path
            d={linePath}
            stroke="#FF6B6B"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Data points with stable indicators */}
          {points.map((point, index) => (
            <G key={index}>
              <Circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="white"
                stroke="#FF6B6B"
                strokeWidth="2.5"
              />
              <Circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#FF6B6B"
              />
              <SvgText
                x={point.x}
                y={point.y - 12}
                fontSize="11"
                fill="#FF6B6B"
                textAnchor="middle"
                fontWeight="bold"
              >
                {data[index]}%
              </SvgText>
            </G>
          ))}
          
          {/* X-axis labels */}
          {labels.map((label, index) => (
            <SvgText
              key={index}
              x={30 + index * stepX}
              y={height + 5}
              fontSize="12"
              fill="#666"
              textAnchor="middle"
            >
              {label}
            </SvgText>
          ))}
        </Svg>
        
        <View style={styles.chartLegend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Mood Score</Text>
          <View style={[styles.legendDot, { backgroundColor: '#E8E8E8' }]} />
          <Text style={styles.legendText}>Target: 75%+</Text>
        </View>
      </View>
    );
  };

  // Fix for Path component
  const Path = ({ d, ...props }) => (
    <Svg>
      <Line d={d} {...props} />
    </Svg>
  );

  const ProgressRing = ({ value, total, size = 100 }) => {
    const radius = size / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(value / total, 1);
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <View style={styles.progressRingContainer}>
        <Svg width={size + 20} height={size + 20}>
          <Circle
            cx={size / 2 + 10}
            cy={size / 2 + 10}
            r={radius}
            stroke="#F0F0F0"
            strokeWidth="8"
            fill="none"
          />
          <Circle
            cx={size / 2 + 10}
            cy={size / 2 + 10}
            r={radius}
            stroke="#4CAF50"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2 + 10}, ${size / 2 + 10})`}
          />
          <SvgText
            x={size / 2 + 10}
            y={size / 2 + 15}
            fontSize="28"
            fontWeight="bold"
            fill="#4CAF50"
            textAnchor="middle"
          >
            {value}
          </SvgText>
          <SvgText
            x={size / 2 + 10}
            y={size / 2 + 40}
            fontSize="12"
            fill="#666"
            textAnchor="middle"
          >
            mins
          </SvgText>
        </Svg>
        <Text style={styles.progressLabel}>This Week</Text>
        <Text style={styles.progressGoal}>Goal: {total} mins</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.username}>Hi, Soulmate!</Text>
            <View style={styles.streakContainer}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>{moodStats.streak} day streak</Text>
            </View>
          </View>
          
          {/* Happy Thought */}
          <View style={styles.happyThoughtContainer}>
            <Text style={styles.happyThoughtText}>{currentThought}</Text>
          </View>
        </View>

        {/* Mood Tracking Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Mood Tracker</Text>
            <View style={styles.periodSelector}>
              {['week', 'month'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodText,
                      selectedPeriod === period && styles.periodTextActive,
                    ]}
                  >
                    {period === 'week' ? 'This Week' : 'This Month'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.statsCards}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{moodStats.average}%</Text>
              <Text style={styles.statLabel}>Average Mood</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>{moodStats.weeklyTrend}</Text>
              <Text style={styles.statLabel}>vs Last Week</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{moodStats.bestMood}</Text>
              <Text style={styles.statLabel}>Best Mood</Text>
            </View>
          </View>

          <StableLineChart
            data={selectedPeriod === 'week' ? moodData.week : moodData.month.slice(0, 28)}
            labels={selectedPeriod === 'week' ? moodData.days : moodData.weeks}
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>✨ Your Space</Text>
        <View style={styles.cardsContainer}>
          <Card
            title="Chat with AI"
            subtitle="Your personal companion"
            emoji="💬"
            highlighted={true}
            onPress={() => navigation.navigate('Chat')}
          />
          <Card
            title="Journal"
            subtitle="Write your thoughts"
            emoji="📓"
            onPress={() => navigation.navigate('Journal')}
          />
          <Card
            title="Daily Check-in"
            subtitle="Track today's mood"
            emoji="🧠"
            onPress={() => navigation.navigate('DailyCheckin')}
          />
          <Card
            title="Relax"
            subtitle="Breathing exercises"
            emoji="🌿"
            onPress={() => navigation.navigate('Relax')}
          />
        </View>

        {/* Mindfulness Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧘 Mindfulness Journey</Text>
          <View style={styles.mindfulnessContainer}>
            <ProgressRing value={mindfulnessMinutes} total={weeklyGoal} />
            <View style={styles.mindfulnessStats}>
              <View style={styles.mindfulnessStat}>
                <Text style={styles.mindfulnessStatValue}>3</Text>
                <Text style={styles.mindfulnessStatLabel}>Sessions</Text>
              </View>
              <View style={styles.mindfulnessStat}>
                <Text style={styles.mindfulnessStatValue}>15</Text>
                <Text style={styles.mindfulnessStatLabel}>Avg mins</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Activities</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>
                  {activity.type === 'Journal' ? '📓' : activity.type === 'Breathing' ? '🌿' : '💬'}
                </Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityType}>{activity.type}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
              <Text style={styles.activityMood}>{activity.mood}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footerPadding} />
      </ScrollView>

      <FloatingFooter active="Dashboard" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9DB',
  },
  header: {
    backgroundColor: '#efd95e',
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  greeting: {
    fontSize: 18,
    color: '#555',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
  },
  moodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  moodText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    marginTop: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  streakEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  streakText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  happyThoughtContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  happyThoughtIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  happyThoughtText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    flex: 1,
    fontStyle: 'italic',
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 15,
    marginLeft: 20,
    color: '#333',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 3,
  },
  periodButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 18,
  },
  periodButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  periodText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  periodTextActive: {
    color: '#fff',
  },
  statsCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 11,
    color: '#777',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    marginHorizontal: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#888',
    marginHorizontal: 6,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 18,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  highlightedCard: {
    backgroundColor: '#f07777',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  highlightedEmoji: {
    fontSize: 34,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  highlightedTitle: {
    color: '#fff',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  highlightedSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  highlightBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD93D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highlightBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  mindfulnessContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  progressRingContainer: {
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '500',
  },
  progressGoal: {
    fontSize: 10,
    color: '#999',
  },
  mindfulnessStats: {
    flexDirection: 'column',
  },
  mindfulnessStat: {
    alignItems: 'center',
    marginVertical: 10,
  },
  mindfulnessStatValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4CAF50',
  },
  mindfulnessStatLabel: {
    fontSize: 12,
    color: '#777',
  },
  activityItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 22,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  activityMood: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  footerPadding: {
    height: 100,
  },
});

// Helper component for SVG Path
const Path = ({ d, ...props }) => {
  const SvgComponent = Svg;
  return (
    <SvgComponent>
      <Line d={d} {...props} />
    </SvgComponent>
  );
};

export default DashboardScreen;