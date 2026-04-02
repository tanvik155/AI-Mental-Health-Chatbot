import pickle
from rag_model import AdvancedMentalHealthBot

def main():
    print("="*60)
    print("🚀 Training Advanced Mental Health Chatbot")
    print("="*60)
    
    # Load advanced dataset
    print("\n📚 Loading advanced dataset...")
    with open("model/advanced_rag_data.pkl", "rb") as f:
        texts, labels, responses, subcategories, severity = pickle.load(f)
    
    print(f"✅ Loaded {len(texts)} training examples")
    print(f"📊 Labels: {set(labels)}")
    print(f"📈 Severity distribution:")
    from collections import Counter
    severity_counts = Counter(severity)
    for sev, count in severity_counts.items():
        print(f"   - {sev}: {count}")
    
    # Initialize advanced model
    print("\n🔧 Initializing advanced model...")
    bot = AdvancedMentalHealthBot()
    
    # Build index
    print("\n🏗️ Building advanced index...")
    bot.build_index(texts, labels, responses, subcategories, severity)
    
    # Save model
    print("\n💾 Saving model...")
    bot.save()
    
    # Test the model
    print("\n" + "="*60)
    print("🧪 Testing Advanced Model:")
    print("="*60)
    
    test_messages = [
        "I'm really anxious about my job interview tomorrow",
        "I feel so hopeless and empty",
        "I'm completely overwhelmed with work",
        "I don't want to live anymore",
        "I'm doing okay today, just checking in",
        "My moods are swinging so fast I can't keep up",
        "I keep having flashbacks of something bad that happened",
        "I lost my mom and I can't stop crying"
    ]
    
    for msg in test_messages:
        print(f"\n👤 User: {msg}")
        response = bot.get_response(msg)
        print(f"😊 Emotion: {response['emotion']}")
        print(f"📊 Subcategory: {response['subcategory']}")
        print(f"⚠️ Severity: {response['severity']}")
        print(f"🎯 Confidence: {response['confidence']:.2%}")
        print(f"🤖 Bot: {response['reply']}")
        print("-"*50)
    
    print("\n✅ Advanced training complete!")
    print("\n💡 Features added:")
    print("   • Semantic understanding with Sentence Transformers")
    print("   • Severity detection (mild/moderate/severe)")
    print("   • Subcategory classification")
    print("   • Conversation memory")
    print("   • Crisis detection")
    print("   • Weighted emotion scoring")

if __name__ == "__main__":
    main()