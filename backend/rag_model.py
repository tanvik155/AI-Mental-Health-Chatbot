import faiss
import pickle
import re
import numpy as np
from sentence_transformers import SentenceTransformer
import warnings
warnings.filterwarnings('ignore')

class AdvancedMentalHealthBot:
    def __init__(self, model_name="sentence-transformers/all-mpnet-base-v2"):
        print(f"🚀 Loading advanced model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.index = None
        self.texts = []
        self.labels = []
        self.responses = []
        self.subcategories = []
        self.severity = []
        self.conversation_history = []
        
    def build_index(self, texts, labels, responses, subcategories, severity):
        """Build FAISS index with advanced features"""
        print("🏗️ Building advanced FAISS index...")
        
        self.texts = texts
        self.labels = labels
        self.responses = responses
        self.subcategories = subcategories
        self.severity = severity
        
        # Generate embeddings with sentence transformers
        print("📊 Generating semantic embeddings...")
        embeddings = self.model.encode(
            texts, 
            convert_to_numpy=True, 
            show_progress_bar=True,
            normalize_embeddings=True  # For cosine similarity
        )
        embeddings = embeddings.astype('float32')
        
        # Create FAISS index
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
        self.index.add(embeddings)
        
        print(f"✅ Index built with {self.index.ntotal} vectors")
        print(f"📐 Embedding dimension: {dimension}")
        print(f"🎯 Model: {self.model.get_sentence_embedding_dimension()}D")
        
        return self.index
    
    def clean_text(self, text):
        """Clean user input"""
        text = text.lower().strip()
        text = re.sub(r"http\S+|www\S+", "", text)
        text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
        return text
    
    def get_emotion_score(self, labels, indices, distances):
        """Advanced weighted emotion scoring"""
        emotion_scores = {}
        severity_scores = {}
        
        for rank, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.labels):
                emotion = self.labels[idx]
                severity = self.severity[idx]
                distance = distances[0][rank]
                
                # Weight: position (higher for top matches) + similarity score
                position_weight = 1 / (rank + 1)
                similarity_weight = distance
                total_weight = (position_weight * 0.6) + (similarity_weight * 0.4)
                
                emotion_scores[emotion] = emotion_scores.get(emotion, 0) + total_weight
                
                # Track severity for the detected emotion
                if emotion not in severity_scores:
                    severity_scores[emotion] = []
                severity_scores[emotion].append((severity, total_weight))
        
        return emotion_scores, severity_scores
    
    def get_dominant_severity(self, severity_scores, emotion):
        """Determine dominant severity for an emotion"""
        if emotion not in severity_scores:
            return "mild"
        
        # Weighted severity score
        severity_weights = {"mild": 1, "moderate": 2, "severe": 3}
        weighted_score = 0
        total_weight = 0
        
        for severity, weight in severity_scores[emotion]:
            weighted_score += severity_weights.get(severity, 1) * weight
            total_weight += weight
        
        if total_weight == 0:
            return "mild"
        
        avg_score = weighted_score / total_weight
        
        if avg_score < 1.5:
            return "mild"
        elif avg_score < 2.5:
            return "moderate"
        else:
            return "severe"
    
    def get_response(self, message, threshold=0.3):
        """Get advanced response with context and severity"""
        
        # Add to conversation history
        self.conversation_history.append({"role": "user", "content": message})
        
        # Keep only last 10 messages
        if len(self.conversation_history) > 10:
            self.conversation_history.pop(0)
        
        # Clean message
        message = self.clean_text(message)
        
        if not message:
            return {
                "emotion": "Normal",
                "subcategory": "general",
                "severity": "mild",
                "reply": "I'm here to listen. How are you feeling today?",
                "confidence": 0.0
            }
        
        try:
            # Generate embedding
            embedding = self.model.encode(
                [message], 
                convert_to_numpy=True,
                normalize_embeddings=True
            ).astype('float32')
            
            # Search index
            k = min(10, len(self.texts))
            distances, indices = self.index.search(embedding, k)
            
            # Get emotion scores
            emotion_scores, severity_scores = self.get_emotion_score(
                self.labels, indices, distances
            )
            
            # Get primary emotion
            if emotion_scores:
                detected_emotion = max(emotion_scores, key=emotion_scores.get)
                confidence = emotion_scores[detected_emotion] / sum(emotion_scores.values())
                
                # Get severity
                severity = self.get_dominant_severity(severity_scores, detected_emotion)
                
                # Get subcategory from best match
                best_idx = indices[0][0]
                subcategory = self.subcategories[best_idx] if best_idx != -1 else "general"
            else:
                detected_emotion = "Normal"
                subcategory = "general"
                severity = "mild"
                confidence = 0.0
            
            # Crisis detection - immediate escalation
            crisis_keywords = ["kill myself", "end my life", "don't want to live", "suicide"]
            if any(keyword in message.lower() for keyword in crisis_keywords):
                detected_emotion = "Suicidal"
                severity = "severe"
            
            # Apply threshold for uncertain cases
            if distances[0][0] < threshold and detected_emotion != "Suicidal":
                detected_emotion = "Normal"
                subcategory = "general"
                severity = "mild"
            
            # Find best response from matching examples
            reply = None
            for idx in indices[0]:
                if idx != -1 and idx < len(self.responses):
                    if self.labels[idx] == detected_emotion:
                        reply = self.responses[idx]
                        break
            
            # Advanced response templates with severity
            severity_responses = {
                "mild": {
                    "Anxiety": "You're experiencing some anxiety. That's normal. Let's try a quick breathing exercise together?",
                    "Depression": "I hear you. Small steps help. Can we do one tiny thing together today?",
                    "Stress": "Stress happens. Let's take a moment to breathe and prioritize.",
                    "Normal": "Good to hear! What's one positive thing in your day?",
                    "Suicidal": "Your safety is priority. Please call 988 now."
                },
                "moderate": {
                    "Anxiety": "This sounds like significant anxiety. The 4-7-8 breathing technique can help. Let's practice?",
                    "Depression": "You're carrying a heavy load. Have you reached out to a therapist? You deserve support.",
                    "Stress": "This level of stress needs attention. When can you take a real break?",
                    "Bipolar": "Mood swings are challenging. Are you tracking this for your doctor?",
                    "PTSD": "Flashbacks are exhausting. Grounding techniques can help anchor you to the present."
                },
                "severe": {
                    "Anxiety": "You're in crisis mode. Please reach out to a crisis line at 988. You don't have to go through this alone.",
                    "Depression": "I'm very concerned. Please contact a crisis counselor at 988 or go to your nearest emergency room.",
                    "Suicidal": "CRISIS ALERT: Please call 988 immediately. Your life matters. Help is available 24/7.",
                    "Bipolar": "Severe mood episodes need immediate medical attention. Please contact your psychiatrist or go to the ER.",
                    "PTSD": "Trauma responses at this level need professional support. Please reach out to a trauma specialist."
                }
            }
            
            # Use advanced response if available
            if severity in severity_responses and detected_emotion in severity_responses[severity]:
                if not reply or confidence < 0.6:  # Override low confidence matches
                    reply = severity_responses[severity][detected_emotion]
            
            # Add context from conversation history
            if len(self.conversation_history) > 1:
                # Check if user is responding to previous advice
                last_bot_msg = next((m for m in reversed(self.conversation_history) 
                                    if m["role"] == "ai"), None)
                if last_bot_msg and "did that help?" in reply.lower():
                    reply = f"Last time we talked about {last_bot_msg['content'][:50]}... {reply}"
            
            # Final fallback
            if not reply:
                reply = "I'm here to listen. Can you tell me more about how you're feeling?"
            
            # Store response in history
            self.conversation_history.append({"role": "ai", "content": reply})
            
            return {
                "emotion": detected_emotion,
                "subcategory": subcategory,
                "severity": severity,
                "reply": reply,
                "confidence": float(confidence),
                "similarity": float(distances[0][0]),
                "top_matches": [
                    {
                        "text": self.texts[idx][:100],
                        "emotion": self.labels[idx],
                        "similarity": float(distances[0][i])
                    }
                    for i, idx in enumerate(indices[0][:3]) if idx != -1
                ]
            }
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return {
                "emotion": "Normal",
                "subcategory": "general",
                "severity": "mild",
                "reply": "I'm here to listen. How are you feeling?",
                "confidence": 0.0
            }
    
    def reset_conversation(self):
        """Reset conversation history"""
        self.conversation_history = []
        print("🔄 Conversation history reset")
    
    def save(self, path="model/advanced_mental_health_bot.pkl"):
        """Save the model"""
        import pickle
        with open(path, "wb") as f:
            pickle.dump({
                'texts': self.texts,
                'labels': self.labels,
                'responses': self.responses,
                'subcategories': self.subcategories,
                'severity': self.severity,
                'index': self.index,
                'model_name': self.model.get_sentence_embedding_dimension()
            }, f)
        print(f"✅ Advanced model saved to {path}")
    
    def load(self, path="model/advanced_mental_health_bot.pkl", data_path="model/advanced_rag_data.pkl"):
        """Load the model"""
        # Load the data and rebuild index (simpler approach)
        with open(data_path, "rb") as f:
            self.texts, self.labels, self.responses, self.subcategories, self.severity = pickle.load(f)
        
        self.build_index(self.texts, self.labels, self.responses, self.subcategories, self.severity)
        print(f"✅ Advanced model loaded with {len(self.texts)} documents")