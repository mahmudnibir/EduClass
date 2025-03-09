'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { 
  PlusIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  title: string;
  subject: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  createdBy: string;
  createdAt: string;
  attempts: number;
  averageScore: number;
  isCompleted: boolean;
  lastScore?: number;
}

export default function QuizzesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeTaken: number;
  } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      // Simulated API call
      setTimeout(() => {
        setQuizzes([
          {
            id: 1,
            title: 'Calculus Basics',
            subject: 'Mathematics',
            description: 'Test your knowledge of basic calculus concepts',
            questions: [
              {
                id: 1,
                text: 'What is the derivative of x²?',
                options: ['x', '2x', '2x²', 'x/2'],
                correctAnswer: 1,
              },
              {
                id: 2,
                text: 'What is the integral of 2x?',
                options: ['x²', 'x²+C', 'x', '2x²+C'],
                correctAnswer: 1,
              },
            ],
            timeLimit: 300,
            createdBy: 'John Doe',
            createdAt: '2024-03-20',
            attempts: 45,
            averageScore: 85,
            isCompleted: true,
            lastScore: 90,
          },
          {
            id: 2,
            title: 'Physics Fundamentals',
            subject: 'Physics',
            description: 'Basic physics concepts and formulas',
            questions: [
              {
                id: 1,
                text: 'What is the formula for force?',
                options: ['F=ma', 'E=mc²', 'v=d/t', 'P=mv'],
                correctAnswer: 0,
              },
            ],
            timeLimit: 600,
            createdBy: 'Jane Smith',
            createdAt: '2024-03-19',
            attempts: 32,
            averageScore: 78,
            isCompleted: false,
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [session]);

  const submitQuiz = useCallback(() => {
    if (!selectedQuiz) return;

    const correctAnswers = answers.reduce((acc, answer, index) => {
      return acc + (answer === selectedQuiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const score = Math.round((correctAnswers / selectedQuiz.questions.length) * 100);
    const timeTaken = selectedQuiz.timeLimit - timeLeft;

    setQuizResults({
      score,
      correctAnswers,
      totalQuestions: selectedQuiz.questions.length,
      timeTaken,
    });

    setQuizzes(prevQuizzes => 
      prevQuizzes.map(quiz =>
        quiz.id === selectedQuiz.id
          ? {
              ...quiz,
              isCompleted: true,
              lastScore: score,
              attempts: quiz.attempts + 1,
              averageScore: Math.round(((quiz.averageScore * quiz.attempts) + score) / (quiz.attempts + 1)),
            }
          : quiz
      )
    );
  }, [selectedQuiz, answers, timeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQuizModal && selectedQuiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showQuizModal, selectedQuiz, timeLeft, submitQuiz]);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setTimeLeft(quiz.timeLimit);
    setQuizResults(null);
    setShowQuizModal(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Test your knowledge and track your progress</p>
        </div>
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <AcademicCapIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">{quiz.title}</h3>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  {quiz.subject}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{quiz.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Time limit: {formatTime(quiz.timeLimit)}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ChartBarIcon className="h-4 w-4 mr-1" />
                  Average score: {quiz.averageScore}%
                </div>
                {quiz.isCompleted && quiz.lastScore !== undefined && (
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Your last score: {quiz.lastScore}%
                  </div>
                )}
              </div>
              <button
                onClick={() => startQuiz(quiz)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                {quiz.isCompleted ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Modal */}
      {showQuizModal && selectedQuiz && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              {quizResults ? (
                // Quiz Results
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Results</h3>
                    <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                      {quizResults.score}%
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      {quizResults.correctAnswers} out of {quizResults.totalQuestions} correct
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Time taken: {formatTime(quizResults.timeTaken)}
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      onClick={() => setShowQuizModal(false)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // Quiz Questions
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                    </h3>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Time left: {formatTime(timeLeft)}
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-900 dark:text-white text-lg mb-4">
                      {selectedQuiz.questions[currentQuestion].text}
                    </p>
                    <div className="space-y-2">
                      {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            const newAnswers = [...answers];
                            newAnswers[currentQuestion] = index;
                            setAnswers(newAnswers);
                          }}
                          className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                            answers[currentQuestion] === index
                              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 ring-2 ring-indigo-500'
                              : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 flex justify-between">
                    <button
                      onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                      disabled={currentQuestion === 0}
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    {currentQuestion < selectedQuiz.questions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQuestion((prev) => prev + 1)}
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors duration-200"
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        onClick={submitQuiz}
                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm transition-colors duration-200"
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 