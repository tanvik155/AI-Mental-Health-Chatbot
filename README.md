# 🧠 AI Mental Health Chatbot

An intelligent AI-powered mental health companion designed to provide emotional support, guided conversations, and personalized responses using advanced NLP and retrieval-based techniques.

---

## 🚀 Overview

The **AI Mental Health Chatbot** is built to simulate empathetic conversations and assist users with mental wellness. It leverages **semantic search, RAG (Retrieval-Augmented Generation), and machine learning models** to deliver context-aware and meaningful responses.

---

## ✨ Features

* 💬 Real-time conversational AI chatbot
* 🧠 Context-aware responses using RAG
* 🔍 Semantic search with FAISS
* 📊 Trained on mental health datasets
* 📱 Mobile app interface (React Native)
* ⚡ FastAPI backend for high performance
* 🔐 Scalable and modular architecture

---

## 🏗️ Tech Stack

### Frontend

* React Native
* JavaScript

### Backend

* FastAPI
* Python

### AI/ML

* Sentence Transformers
* FAISS (Facebook AI Similarity Search)
* Custom trained models

---

## 📂 Project Structure

```
AI-Mental-Health-Chatbot/
│
├── backend/
│   ├── main.py
│   ├── rag_model.py
│   ├── train.py
│   ├── requirements.txt
│   └── model/
│
├── frontend/
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```


### 📱 Frontend Setup

```bash
cd frontend
npm install
npx react-native run-android
```



## 🧪 How It Works

1. User inputs a query
2. Query is converted into embeddings
3. FAISS retrieves similar past data
4. RAG model generates a contextual response
5. Response is returned via API


## 📈 Future Improvements

* Emotion detection using voice/text
* Multilingual support
* Integration with wearable health data
* Therapist recommendation system


## 🤝 Contributors

* Tanvi Kakade
* Mansi Jadhav
* Shravani Girhe
* Rutuja Kondawar


## 📜 License

This project is for educational and research purposes.



## 💡 Inspiration

With the increasing need for accessible mental health support, this project aims to bridge the gap using AI-driven solutions.



## ⚠️ Disclaimer

This chatbot is not a replacement for professional mental health care. It is intended for support purposes only.


