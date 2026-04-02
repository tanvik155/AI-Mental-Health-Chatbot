const API_URL = 'http://10.0.2.2:8000/chat';

export const sendMessageToBot = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    return {
      text: data.reply,
      emotion: data.emotion,
      severity: data.severity,
      confidence: data.confidence,
    };
  } catch (error) {
    return {
      text: "I'm having trouble connecting to the server.",
      emotion: "neutral",
    };
  }
};