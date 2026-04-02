import pandas as pd
import pickle
import os

os.makedirs("model", exist_ok=True)

# Advanced dataset with more categories and better responses
dataset = {
    "texts": [],
    "labels": [],
    "responses": [],
    "subcategories": [],
    "severity": []  # mild, moderate, severe
}

mental_health_data = [
    # ==================== ANXIETY ====================
    # Mild Anxiety
    {"text": "I feel a little nervous about my presentation", "label": "Anxiety", 
     "subcategory": "social", "severity": "mild",
     "response": "Pre-presentation nerves are normal! Practice your opening lines, take three deep breaths before starting, and remember - the audience wants you to succeed."},
    
    {"text": "I'm worried about my exam results", "label": "Anxiety", 
     "subcategory": "academic", "severity": "mild",
     "response": "Waiting for results is stressful. What's done is done. Focus on what you can control right now. Distract yourself with a hobby or exercise."},
    
    # Moderate Anxiety
    {"text": "My heart is racing and I can't calm down", "label": "Anxiety", 
     "subcategory": "panic", "severity": "moderate",
     "response": "Let's do the 4-7-8 breathing technique. Breathe in for 4 seconds, hold for 7, exhale for 8. Repeat 4 times. Feel that? Your body is calming down."},
    
    {"text": "I keep having panic attacks", "label": "Anxiety", 
     "subcategory": "panic", "severity": "moderate",
     "response": "Panic attacks are terrifying but they always pass. Ground yourself: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. You're safe."},
    
    {"text": "I can't stop worrying about everything", "label": "Anxiety", 
     "subcategory": "generalized", "severity": "moderate",
     "response": "Generalized anxiety is exhausting. Let's do a 'worry dump' - write down everything you're worried about. Then identify what you can control vs what you can't."},
    
    # Severe Anxiety
    {"text": "I can't leave my house because of anxiety", "label": "Anxiety", 
     "subcategory": "agoraphobia", "severity": "severe",
     "response": "That sounds incredibly difficult. Start small - just open your front door. Tomorrow, step outside for 1 minute. Gradual exposure works. Consider seeing a therapist who specializes in anxiety."},
    
    # ==================== DEPRESSION ====================
    # Mild Depression
    {"text": "I've been feeling down lately", "label": "Depression", 
     "subcategory": "mild", "severity": "mild",
     "response": "Everyone feels down sometimes. Have you been sleeping and eating well? Sometimes small self-care actions make a big difference."},
    
    {"text": "I've lost interest in my hobbies", "label": "Depression", 
     "subcategory": "anhedonia", "severity": "mild",
     "response": "Loss of interest is common. Try the '5-minute rule' - do something you used to enjoy for just 5 minutes. No pressure to enjoy it, just try."},
    
    # Moderate Depression
    {"text": "I feel empty and hopeless", "label": "Depression", 
     "subcategory": "moderate", "severity": "moderate",
     "response": "I'm sorry you're feeling this way. You're not alone. Can you do one small thing for yourself today? Drink water, eat something, step outside for 2 minutes?"},
    
    {"text": "Nothing makes me happy anymore", "label": "Depression", 
     "subcategory": "anhedonia", "severity": "moderate",
     "response": "Depression steals joy. What used to bring you happiness? Even if it doesn't now, can you try it for 5 minutes? Sometimes the feeling follows the action."},
    
    {"text": "I don't want to get out of bed", "label": "Depression", 
     "subcategory": "lethargy", "severity": "moderate",
     "response": "Getting out of bed is a win. Can we start with just sitting up? Or moving to the couch? One small step is still progress."},
    
    # Severe Depression
    {"text": "I don't see any point in living", "label": "Depression", 
     "subcategory": "suicidal", "severity": "severe",
     "response": "I'm very concerned about you. Your life matters. Please reach out to the Suicide & Crisis Lifeline at 988. They have trained counselors who can help right now."},
    
    {"text": "I feel completely worthless", "label": "Depression", 
     "subcategory": "severe", "severity": "severe",
     "response": "Depression lies to us. You have worth. Can you name one person who would be affected if you weren't here? Please call 988 or a trusted person right now."},
    
    # ==================== STRESS ====================
    {"text": "I'm so stressed with work deadlines", "label": "Stress", 
     "subcategory": "work", "severity": "moderate",
     "response": "Work stress is real. Let's prioritize: What's urgent? What can wait? What can you delegate? Take a 5-minute break right now."},
    
    {"text": "I'm overwhelmed with everything", "label": "Stress", 
     "subcategory": "overwhelm", "severity": "moderate",
     "response": "When everything feels too much, let's break it down. What's ONE thing you can do in the next 5 minutes? Focus only on that."},
    
    {"text": "I feel burned out from school", "label": "Stress", 
     "subcategory": "academic", "severity": "moderate",
     "response": "Academic burnout is real. When did you last take a real break? Not studying, not scrolling - actual rest. Your brain needs recovery time."},
    
    {"text": "I'm stressed about my relationship", "label": "Stress", 
     "subcategory": "relationship", "severity": "moderate",
     "response": "Relationship stress hurts. Can you communicate openly with your partner? Sometimes saying 'I'm struggling' is a good first step."},
    
    # ==================== BIPOLAR ====================
    {"text": "I feel so energetic and unstoppable", "label": "Bipolar", 
     "subcategory": "mania", "severity": "moderate",
     "response": "High energy can feel great, but be careful. Are you sleeping? Not sleeping can trigger mania. Try to maintain a consistent sleep schedule."},
    
    {"text": "My moods keep swinging wildly", "label": "Bipolar", 
     "subcategory": "cycling", "severity": "moderate",
     "response": "Mood swings are exhausting. Have you been tracking your moods? A mood diary can help identify patterns. This is important to share with your doctor."},
    
    {"text": "I'm in a deep depression after feeling so high", "label": "Bipolar", 
     "subcategory": "depressive", "severity": "severe",
     "response": "The crash after mania is brutal. Be gentle with yourself. This is part of the bipolar cycle. Reach out to your psychiatrist if you haven't already."},
    
    # ==================== NORMAL/GENERAL ====================
    {"text": "I'm doing okay today", "label": "Normal", 
     "subcategory": "general", "severity": "mild",
     "response": "I'm glad to hear that! What's one positive thing that happened today? Let's appreciate those moments."},
    
    {"text": "Just checking in", "label": "Normal", 
     "subcategory": "general", "severity": "mild",
     "response": "Thanks for checking in! I'm here. How are you feeling right now? What's on your mind?"},
    
    {"text": "I had a good day", "label": "Normal", 
     "subcategory": "positive", "severity": "mild",
     "response": "That's wonderful! What made it good? Let's celebrate those moments and remember them for harder days."},
    
    {"text": "I'm feeling much better today", "label": "Normal", 
     "subcategory": "improving", "severity": "mild",
     "response": "I'm so glad! What helped you feel better? Keep doing that. You're making progress."},
    
    # ==================== PTSD/TRAUMA ====================
    {"text": "I keep having flashbacks of something bad", "label": "PTSD", 
     "subcategory": "flashbacks", "severity": "severe",
     "response": "Flashbacks are terrifying. Ground yourself: What year is it? Where are you? Look around and name what you see. You're safe now. EMDR therapy can help with trauma."},
    
    {"text": "I can't stop thinking about what happened", "label": "PTSD", 
     "subcategory": "intrusive", "severity": "moderate",
     "response": "Intrusive thoughts are exhausting. Try writing them down to get them out of your head. Trauma-focused therapy can help process these memories."},
    
    # ==================== GRIEF ====================
    {"text": "I lost someone I love and I can't cope", "label": "Grief", 
     "subcategory": "loss", "severity": "severe",
     "response": "Grief is heavy. There's no timeline. Let yourself feel whatever comes up. Can you share a favorite memory of them? Sometimes talking helps."},
    
    {"text": "I'm still grieving after months", "label": "Grief", 
     "subcategory": "prolonged", "severity": "moderate",
     "response": "Grief doesn't have a timeline. Some days will be harder. Grief counseling can help. You don't have to go through this alone."},
]

# Add data
for item in mental_health_data:
    dataset["texts"].append(item["text"])
    dataset["labels"].append(item["label"])
    dataset["responses"].append(item["response"])
    dataset["subcategories"].append(item["subcategory"])
    dataset["severity"].append(item["severity"])

print(f"✅ Advanced dataset created with {len(dataset['texts'])} examples")
print(f"📊 Labels: {set(dataset['labels'])}")
print(f"📈 Severity distribution:")
severity_counts = pd.Series(dataset['severity']).value_counts()
for severity, count in severity_counts.items():
    print(f"   - {severity}: {count}")

# Save dataset
with open("model/advanced_rag_data.pkl", "wb") as f:
    pickle.dump((dataset["texts"], dataset["labels"], dataset["responses"], 
                 dataset["subcategories"], dataset["severity"]), f)

# Save as CSV
df = pd.DataFrame(dataset)
df.to_csv("model/advanced_mental_health_dataset.csv", index=False)

print("\n✅ Advanced dataset saved to model/advanced_rag_data.pkl")
print("✅ CSV saved to model/advanced_mental_health_dataset.csv")

# Display sample
print("\n📝 Sample data:")
for i in range(min(5, len(dataset['texts']))):
    print(f"\n{i+1}. Text: {dataset['texts'][i]}")
    print(f"   Label: {dataset['labels'][i]} ({dataset['subcategories'][i]}, {dataset['severity'][i]})")
    print(f"   Response: {dataset['responses'][i][:100]}...")