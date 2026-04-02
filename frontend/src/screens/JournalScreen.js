import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import FloatingFooter from '../components/FloatingFooter';

const JournalScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([
    {
      id: '1',
      title: 'Finding Peace in Chaos',
      content: 'Today was hectic but I managed to take 10 minutes for myself. Practiced deep breathing and felt instantly calmer. Sometimes we forget that we need to pause and recharge.',
      mood: 'Calm',
      moodEmoji: '🌤️',
      date: '2024-01-15',
      tags: ['mindfulness', 'self-care'],
      isFavorite: true,
    },
    {
      id: '2',
      title: 'Gratitude Moments',
      content: 'Grateful for the supportive friends who checked in on me today. Had a lovely conversation that lifted my spirits. Small moments matter.',
      mood: 'Happy',
      moodEmoji: '😊',
      date: '2024-01-14',
      tags: ['gratitude', 'friends'],
      isFavorite: false,
    },
    {
      id: '3',
      title: 'Overcoming Challenges',
      content: 'Faced a difficult situation at work but handled it better than expected. Proud of how I managed my emotions and communicated clearly.',
      mood: 'Proud',
      moodEmoji: '💪',
      date: '2024-01-13',
      tags: ['growth', 'work'],
      isFavorite: true,
    },
  ]);

  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '',
    moodEmoji: '',
    tags: [],
  });
  const [selectedMood, setSelectedMood] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, favorites, recent
  const [expandedEntry, setExpandedEntry] = useState(null);

  const moods = [
    { name: 'Happy', emoji: '😊', color: '#FFD93D' },
    { name: 'Calm', emoji: '🌤️', color: '#A8E6CF' },
    { name: 'Thoughtful', emoji: '🤔', color: '#FFB347' },
    { name: 'Grateful', emoji: '🙏', color: '#FF8B94' },
    { name: 'Proud', emoji: '💪', color: '#6C5CE7' },
    { name: 'Peaceful', emoji: '🕊️', color: '#74B9FF' },
    { name: 'Hopeful', emoji: '🌟', color: '#FDCB6E' },
    { name: 'Loved', emoji: '💖', color: '#FF6B6B' },
  ];

  const getFilteredEntries = () => {
    let filtered = entries;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedFilter === 'favorites') {
      filtered = filtered.filter(entry => entry.isFavorite);
    } else if (selectedFilter === 'recent') {
      filtered = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return filtered;
  };

  const addNewEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim() || !selectedMood) {
      Alert.alert('Incomplete', 'Please add title, content, and select a mood');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: selectedMood.name,
      moodEmoji: selectedMood.emoji,
      date: new Date().toISOString().split('T')[0],
      tags: newEntry.tags,
      isFavorite: false,
    };

    setEntries([entry, ...entries]);
    resetNewEntry();
    setIsAddingEntry(false);
    Alert.alert('Success', 'Your journal entry has been saved!');
  };

  const resetNewEntry = () => {
    setNewEntry({
      title: '',
      content: '',
      mood: '',
      moodEmoji: '',
      tags: [],
    });
    setSelectedMood(null);
    setCurrentTag('');
  };

  const addTag = () => {
    if (currentTag.trim() && !newEntry.tags.includes(currentTag.trim().toLowerCase())) {
      setNewEntry({
        ...newEntry,
        tags: [...newEntry.tags, currentTag.trim().toLowerCase()],
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const toggleFavorite = (entryId) => {
    setEntries(entries.map(entry =>
      entry.id === entryId
        ? { ...entry, isFavorite: !entry.isFavorite }
        : entry
    ));
  };

  const deleteEntry = (entryId) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEntries(entries.filter(entry => entry.id !== entryId));
            setExpandedEntry(null);
          },
        },
      ]
    );
  };

  const EntryCard = ({ entry }) => {
    const isExpanded = expandedEntry === entry.id;
    
    return (
      <TouchableOpacity
        style={styles.entryCard}
        onPress={() => setExpandedEntry(isExpanded ? null : entry.id)}
        activeOpacity={0.7}
      >
        <View style={styles.entryHeader}>
          <View style={styles.entryHeaderLeft}>
            <Text style={styles.entryMoodEmoji}>{entry.moodEmoji}</Text>
            <View>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
          </View>
          <View style={styles.entryActions}>
            <TouchableOpacity onPress={() => toggleFavorite(entry.id)}>
              <Text style={styles.favoriteButton}>
                {entry.isFavorite ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteEntry(entry.id)}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text
          style={styles.entryContent}
          numberOfLines={isExpanded ? undefined : 2}
        >
          {entry.content}
        </Text>
        
        {!isExpanded && entry.content.length > 100 && (
          <Text style={styles.readMore}>Tap to read more...</Text>
        )}
        
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const AddEntryModal = () => (
    <Modal
      visible={isAddingEntry}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setIsAddingEntry(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContent}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsAddingEntry(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Entry</Text>
            <TouchableOpacity onPress={addNewEntry}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            <TextInput
              style={styles.titleInput}
              placeholder="Entry Title"
              placeholderTextColor="#999"
              value={newEntry.title}
              onChangeText={(text) => setNewEntry({ ...newEntry, title: text })}
            />

            <Text style={styles.sectionLabel}>How are you feeling?</Text>
            <View style={styles.moodSelector}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.name}
                  style={[
                    styles.moodOption,
                    selectedMood?.name === mood.name && styles.moodOptionSelected,
                    { backgroundColor: selectedMood?.name === mood.name ? mood.color : '#F5F5F5' }
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodName}>{mood.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Your thoughts</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Write your thoughts here..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={8}
              value={newEntry.content}
              onChangeText={(text) => setNewEntry({ ...newEntry, content: text })}
            />

            <Text style={styles.sectionLabel}>Tags (optional)</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add tags..."
                placeholderTextColor="#999"
                value={currentTag}
                onChangeText={setCurrentTag}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <Text style={styles.addTagButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {newEntry.tags.length > 0 && (
              <View style={styles.newTagsContainer}>
                {newEntry.tags.map(tag => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.newTag}
                    onPress={() => removeTag(tag)}
                  >
                    <Text style={styles.newTagText}>#{tag} ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  const InspirationPrompt = () => (
    <Text style={styles.inspirationText}>
      "Write down three things you're grateful for today..."
    </Text>
  );

  const StatsSummary = () => {
    const totalEntries = entries.length;
    const favoriteEntries = entries.filter(e => e.isFavorite).length;
    const recentWeek = entries.filter(e => {
      const entryDate = new Date(e.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    }).length;

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalEntries}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{favoriteEntries}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{recentWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Journal 📓</Text>
            <Text style={styles.headerSubtitle}>Your safe space for thoughts</Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setIsAddingEntry(true)}
          >
            <Text style={styles.addButtonText}>+ New Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Summary */}
        <StatsSummary />

        {/* Inspiration Prompt */}
        <InspirationPrompt />

        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search entries..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('all')}
            >
              <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'favorites' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('favorites')}
            >
              <Text style={[styles.filterText, selectedFilter === 'favorites' && styles.filterTextActive]}>
                ⭐ Favorites
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, selectedFilter === 'recent' && styles.filterButtonActive]}
              onPress={() => setSelectedFilter('recent')}
            >
              <Text style={[styles.filterText, selectedFilter === 'recent' && styles.filterTextActive]}>
                Recent
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Entries List */}
        <View style={styles.entriesContainer}>
          {getFilteredEntries().length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📝</Text>
              <Text style={styles.emptyStateTitle}>No entries yet</Text>
              <Text style={styles.emptyStateText}>
                Start writing your thoughts and feelings. Your journal is a safe space for self-expression.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => setIsAddingEntry(true)}
              >
                <Text style={styles.emptyStateButtonText}>Write your first entry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            getFilteredEntries().map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))
          )}
        </View>

        <View style={styles.footerPadding} />
      </ScrollView>

      <AddEntryModal />
      <FloatingFooter active="Journal" navigation={navigation} />
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
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#333',
    marginTop: 30,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 30,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 18,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  inspirationText: {
    fontSize: 18,
    color: '#da3aa7',
    // fontStyle: 'italic',
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  entriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  entryMoodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 11,
    color: '#999',
  },
  entryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  favoriteButton: {
    fontSize: 22,
  },
  deleteButton: {
    fontSize: 20,
    opacity: 0.6,
  },
  entryContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  tag: {
    backgroundColor: '#FFF3B0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#FF6B6B',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 18,
    marginTop: 20,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF9DB',
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFF3B0',
  },
  modalCancel: {
    fontSize: 16,
    color: '#999',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSave: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  modalScroll: {
    flex: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  moodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  moodOptionSelected: {
    backgroundColor: '#FFD93D',
  },
  moodEmoji: {
    fontSize: 18,
  },
  moodName: {
    fontSize: 13,
    color: '#333',
  },
  contentInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 150,
    marginBottom: 20,
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  addTagButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addTagButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  newTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  newTag: {
    backgroundColor: '#FFF3B0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  newTagText: {
    fontSize: 12,
    color: '#FF6B6B',
  },
  footerPadding: {
    height: 100,
  },
});

export default JournalScreen;