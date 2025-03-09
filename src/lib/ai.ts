interface AIResponse {
  content: string;
  type: 'text' | 'file' | 'quiz' | 'flashcard';
  fileUrl?: string;
  metadata?: {
    quiz?: {
      question: string;
      options: string[];
      correctAnswer: number;
    };
    flashcard?: {
      front: string;
      back: string;
    };
  };
}

const studyTopics = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'Literature',
  'Languages',
];

const studyTips = [
  'Create a study schedule and stick to it',
  'Take regular breaks to maintain focus',
  'Use active recall techniques',
  'Practice with past exams',
  'Join study groups for collaborative learning',
  'Stay hydrated and get enough sleep',
  'Use mind maps for complex topics',
  'Teach others to reinforce your understanding',
  'Use the Pomodoro Technique (25 minutes study, 5 minutes break)',
  'Create flashcards for key concepts',
  'Summarize information in your own words',
  'Use spaced repetition for better retention',
];

const motivationalQuotes = [
  'The only way to do great work is to love what you do.',
  'Success is not final, failure is not fatal: it is the courage to continue that counts.',
  'The future belongs to those who believe in the beauty of their dreams.',
  'Education is the most powerful weapon which you can use to change the world.',
  'The more that you read, the more things you will know. The more that you learn, the more places you\'ll go.',
  'Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.',
  'The beautiful thing about learning is that no one can take it away from you.',
  'Education is not preparation for life; education is life itself.',
];

const quickQuizzes = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
  },
  {
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 1,
  },
];

const flashcards = [
  {
    front: 'What is photosynthesis?',
    back: 'The process by which plants convert light energy into chemical energy that can be used to fuel their activities.',
  },
  {
    front: 'What is the Pythagorean theorem?',
    back: 'In a right triangle, the square of the length of the hypotenuse is equal to the sum of the squares of the other two sides.',
  },
  {
    front: 'What is the capital of Japan?',
    back: 'Tokyo',
  },
];

export async function generateAIResponse(message: string): Promise<AIResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerMessage = message.toLowerCase();

  // Handle specific queries
  if (lowerMessage.includes('study tips')) {
    const randomTips = studyTips
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .join('\n\n');
    return {
      content: `Here are some helpful study tips:\n\n${randomTips}`,
      type: 'text',
    };
  }

  if (lowerMessage.includes('motivation')) {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    return {
      content: `Here's some motivation for you:\n\n"${randomQuote}"`,
      type: 'text',
    };
  }

  if (lowerMessage.includes('topics')) {
    const randomTopics = studyTopics
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
      .join(', ');
    return {
      content: `Here are some interesting study topics you might want to explore: ${randomTopics}`,
      type: 'text',
    };
  }

  if (lowerMessage.includes('quiz')) {
    const randomQuiz = quickQuizzes[Math.floor(Math.random() * quickQuizzes.length)];
    return {
      content: 'Here\'s a quick quiz to test your knowledge:',
      type: 'quiz',
      metadata: {
        quiz: randomQuiz,
      },
    };
  }

  if (lowerMessage.includes('flashcard')) {
    const randomFlashcard = flashcards[Math.floor(Math.random() * flashcards.length)];
    return {
      content: 'Here\'s a flashcard to help you learn:',
      type: 'flashcard',
      metadata: {
        flashcard: randomFlashcard,
      },
    };
  }

  if (lowerMessage.includes('help')) {
    return {
      content: `I can help you with:\n\n- Study tips and techniques\n- Motivational quotes\n- Study topics and subjects\n- Quick quizzes\n- Flashcards\n- General study advice\n\nJust ask me about any of these topics!`,
      type: 'text',
    };
  }

  // Default response
  return {
    content: 'I\'m here to help you with your studies! You can ask me about study tips, motivation, quizzes, flashcards, or specific topics you\'re interested in.',
    type: 'text',
  };
} 