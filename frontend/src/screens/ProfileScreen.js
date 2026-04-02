import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Switch,
  Image,
  Dimensions,
} from 'react-native';
import FloatingFooter from '../components/FloatingFooter';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({
    name: 'Tanvi Kakade',
    email: 'tanvi.kakade@email.com',
    joinDate: 'January 2024',
    avatar: '👤',
    bio: 'On a journey to better mental health and self-discovery. Taking it one day at a time.',
    preferences: {
      notifications: true,
      dailyReminder: true,
      weeklyReport: true,
      darkMode: false,
      soundEffects: true,
    },
    stats: {
      totalCheckins: 24,
      currentStreak: 7,
      longestStreak: 12,
      journalEntries: 18,
      meditationMinutes: 320,
      gratitudeCount: 72,
    },
    achievements: [
      { id: '1', title: 'First Check-in', icon: '🌟', unlocked: true, date: 'Jan 1, 2024' },
      { id: '2', title: '7 Day Streak', icon: '🔥', unlocked: true, date: 'Jan 15, 2024' },
      { id: '3', title: 'Journal Master', icon: '📓', unlocked: true, date: 'Jan 20, 2024' },
      { id: '4', title: 'Meditation Guru', icon: '🧘', unlocked: false, progress: 60 },
      { id: '5', title: 'Gratitude Champion', icon: '🙏', unlocked: true, date: 'Feb 1, 2024' },
      { id: '6', title: 'Wellness Warrior', icon: '💪', unlocked: false, progress: 30 },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
  });
  const [showAchievements, setShowAchievements] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editForm.name,
      email: editForm.email,
      bio: editForm.bio,
    });
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile has been successfully updated.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('Login') },
      ]
    );
  };

  const togglePreference = (key) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        [key]: !profile.preferences[key],
      },
    });
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { backgroundColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const AchievementBadge = ({ achievement }) => (
    <View style={[styles.achievementBadge, !achievement.unlocked && styles.achievementLocked]}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <Text style={styles.achievementTitle}>{achievement.title}</Text>
      {achievement.unlocked ? (
        <Text style={styles.achievementDate}>{achievement.date}</Text>
      ) : (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${achievement.progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{achievement.progress}%</Text>
        </View>
      )}
    </View>
  );

  const EditProfileModal = () => (
    <Modal
      visible={isEditing}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setIsEditing(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsEditing(false)}>
            <Text style={styles.modalCancel}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSaveProfile}>
            <Text style={styles.modalSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{profile.avatar}</Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editForm.name}
              onChangeText={(text) => setEditForm({ ...editForm, name: text })}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={editForm.email}
              onChangeText={(text) => setEditForm({ ...editForm, email: text })}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editForm.bio}
              onChangeText={(text) => setEditForm({ ...editForm, bio: text })}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const AchievementsModal = () => (
    <Modal
      visible={showAchievements}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowAchievements(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Achievements</Text>
          <TouchableOpacity onPress={() => setShowAchievements(false)}>
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.achievementsStats}>
            <View style={styles.achievementStatItem}>
              <Text style={styles.achievementStatNumber}>
                {profile.achievements.filter(a => a.unlocked).length}
              </Text>
              <Text style={styles.achievementStatLabel}>Unlocked</Text>
            </View>
            <View style={styles.achievementStatItem}>
              <Text style={styles.achievementStatNumber}>
                {profile.achievements.length}
              </Text>
              <Text style={styles.achievementStatLabel}>Total</Text>
            </View>
          </View>

          <View style={styles.achievementsGrid}>
            {profile.achievements.map((achievement) => (
              <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const StatsModal = () => (
    <Modal
      visible={showStats}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowStats(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Activity Stats</Text>
          <TouchableOpacity onPress={() => setShowStats(false)}>
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.statsOverview}>
            <View style={styles.statsOverviewItem}>
              <Text style={styles.statsOverviewValue}>{profile.stats.currentStreak}</Text>
              <Text style={styles.statsOverviewLabel}>Current Streak</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsOverviewItem}>
              <Text style={styles.statsOverviewValue}>{profile.stats.longestStreak}</Text>
              <Text style={styles.statsOverviewLabel}>Longest Streak</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title="Check-ins"
              value={profile.stats.totalCheckins}
              icon="📊"
              color="#FFF9E8"
            />
            <StatCard
              title="Journal"
              value={profile.stats.journalEntries}
              icon="📓"
              color="#FFF3B0"
            />
            <StatCard
              title="Meditation"
              value={`${profile.stats.meditationMinutes} min`}
              icon="🧘"
              color="#FFF9E8"
            />
            <StatCard
              title="Gratitude"
              value={profile.stats.gratitudeCount}
              icon="🙏"
              color="#FFF3B0"
            />
          </View>

          <View style={styles.milestonesSection}>
            <Text style={styles.sectionTitle}>Recent Milestones</Text>
            <View style={styles.milestoneItem}>
              <Text style={styles.milestoneIcon}>🎯</Text>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>7 Day Streak Achieved</Text>
                <Text style={styles.milestoneDate}>January 15, 2024</Text>
              </View>
            </View>
            <View style={styles.milestoneItem}>
              <Text style={styles.milestoneIcon}>📝</Text>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>10 Journal Entries</Text>
                <Text style={styles.milestoneDate}>January 20, 2024</Text>
              </View>
            </View>
            <View style={styles.milestoneItem}>
              <Text style={styles.milestoneIcon}>🧘</Text>
              <View style={styles.milestoneInfo}>
                <Text style={styles.milestoneTitle}>300 Minutes of Meditation</Text>
                <Text style={styles.milestoneDate}>February 1, 2024</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  const SettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowSettings(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity onPress={() => setShowSettings(false)}>
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Notifications</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive daily reminders and updates</Text>
              </View>
              <Switch
                value={profile.preferences.notifications}
                onValueChange={() => togglePreference('notifications')}
                trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Daily Check-in Reminder</Text>
                <Text style={styles.settingDescription}>Get reminded to check in daily</Text>
              </View>
              <Switch
                value={profile.preferences.dailyReminder}
                onValueChange={() => togglePreference('dailyReminder')}
                trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              />
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Weekly Report</Text>
                <Text style={styles.settingDescription}>Receive weekly summary of your progress</Text>
              </View>
              <Switch
                value={profile.preferences.weeklyReport}
                onValueChange={() => togglePreference('weeklyReport')}
                trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Appearance</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Toggle dark/light theme</Text>
              </View>
              <Switch
                value={profile.preferences.darkMode}
                onValueChange={() => togglePreference('darkMode')}
                trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Audio</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <Text style={styles.settingDescription}>Enable sound for actions and completions</Text>
              </View>
              <Switch
                value={profile.preferences.soundEffects}
                onValueChange={() => togglePreference('soundEffects')}
                trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              />
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Account</Text>
            <TouchableOpacity style={styles.dangerButton}>
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.versionInfo}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
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
                <Text style={styles.headerIcon}>👤</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Profile</Text>
                <Text style={styles.headerSubtitle}>Your personal space</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.avatar}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton} onPress={() => setIsEditing(true)}>
              <Text style={styles.editAvatarIcon}>✎</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>
          <Text style={styles.profileBio}>{profile.bio}</Text>
          <Text style={styles.joinDate}>Joined {profile.joinDate}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <TouchableOpacity style={styles.quickStat} onPress={() => setShowStats(true)}>
            <Text style={styles.quickStatValue}>{profile.stats.totalCheckins}</Text>
            <Text style={styles.quickStatLabel}>Check-ins</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickStat} onPress={() => setShowStats(true)}>
            <Text style={styles.quickStatValue}>{profile.stats.currentStreak}</Text>
            <Text style={styles.quickStatLabel}>Day Streak</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickStat} onPress={() => setShowAchievements(true)}>
            <Text style={styles.quickStatValue}>{profile.achievements.filter(a => a.unlocked).length}</Text>
            <Text style={styles.quickStatLabel}>Achievements</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowStats(true)}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={styles.menuTitle}>Activity Stats</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowAchievements(true)}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🏆</Text>
              <Text style={styles.menuTitle}>Achievements</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={styles.menuTitle}>Settings</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Journal')}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📓</Text>
              <Text style={styles.menuTitle}>My Journal</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CheckIn')}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🧠</Text>
              <Text style={styles.menuTitle}>Daily Check-in</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy & Support */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeader}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuTitle}>Help Center</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📧</Text>
              <Text style={styles.menuTitle}>Contact Us</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={styles.menuTitle}>Privacy Policy</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📜</Text>
              <Text style={styles.menuTitle}>Terms of Service</Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerPadding} />
      </ScrollView>

      <EditProfileModal />
      <AchievementsModal />
      <StatsModal />
      <SettingsModal />
      <FloatingFooter active="Profile" navigation={navigation} />
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
  },
  headerIcon: {
    fontSize: 28,
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF3B0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  joinDate: {
    fontSize: 12,
    color: '#999',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  menuSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    fontSize: 22,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 18,
    color: '#999',
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
  modalCancel: {
    fontSize: 16,
    color: '#999',
  },
  modalSave: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 56,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  statsOverviewItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsOverviewValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  statsOverviewLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  statsDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#777',
  },
  milestonesSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  milestoneIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  milestoneDate: {
    fontSize: 11,
    color: '#999',
  },
  achievementsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  achievementStatItem: {
    alignItems: 'center',
  },
  achievementStatNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  achievementStatLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementBadge: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementLocked: {
    opacity: 0.6,
    backgroundColor: '#F5F5F5',
  },
  achievementIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    color: '#999',
  },
  progressContainer: {
    width: '100%',
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  progressText: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
    marginTop: 4,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#777',
  },
  dangerButton: {
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  dangerButtonText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#F0F0F0',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  },
  logoutSection: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FFE5E5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  footerPadding: {
    height: 100,
  },
});

export default ProfileScreen;