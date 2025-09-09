import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { QuizTerm } from '../types';
import { REQUIRED_CORRECT_ANSWERS } from '../constants';
import { shuffleArray } from '../utils/array';

interface QuizScreenProps {
  initialQuizSet: QuizTerm[];
  onComplete: (stats: { totalAnswers: number; correctAnswers: number; timeTaken: number }, masteredTerms: QuizTerm[]) => void;
  era: string;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ initialQuizSet, onComplete, era }) => {
  const [activeQuestions, setActiveQuestions] = useState<QuizTerm[]>(() => shuffleArray([...initialQuizSet]));
  
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctSessionAnswers, setCorrectSessionAnswers] = useState(0);
  const [startTime] = useState(Date.now());

  const [feedback, setFeedback] = useState<{ type: 'correct' | 'incorrect'; explanation: string } | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [animationClass, setAnimationClass] = useState('');
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  const timerRef = useRef<number | null>(null);
  const isMounted = useRef(true); // To track component mount status

  const currentQuestion = useMemo(() => activeQuestions[0], [activeQuestions]);
  const totalRequiredCorrect = useMemo(() => initialQuizSet.length * REQUIRED_CORRECT_ANSWERS, [initialQuizSet]);

  useEffect(() => {
    if (currentQuestion) {
      setShuffledChoices(shuffleArray(currentQuestion.choices));
    }
  }, [currentQuestion]);

  // Cleanup timer and update mount status on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);


  const handleAnswer = useCallback((choice: string) => {
    if (isAnswered || !currentQuestion) return;

    setIsAnswered(true);
    setTotalAnswers(prev => prev + 1);
    
    const isCorrect = choice === currentQuestion.answer;
    
    let nextQuestionsState: QuizTerm[] = [];

    if (isCorrect) {
        setCorrectSessionAnswers(prev => prev + 1);
        setAnimationClass('flash-correct');
        setFeedback({ type: 'correct', explanation: currentQuestion.explanation });

        const newCorrectCount = currentQuestion.correctCount + 1;
        const isMastered = newCorrectCount >= REQUIRED_CORRECT_ANSWERS;

        if (isMastered) {
            // Remove the mastered question from the active list
            nextQuestionsState = activeQuestions.slice(1);
        } else {
            // Update count and move to back of the shuffled queue
            const updatedQuestion = { ...currentQuestion, correctCount: newCorrectCount };
            const restOfQuestions = activeQuestions.slice(1);
            nextQuestionsState = shuffleArray([...restOfQuestions, updatedQuestion]);
        }
    } else {
        setAnimationClass('flash-incorrect');
        setFeedback({ type: 'incorrect', explanation: `正解は「${currentQuestion.answer}」でした。` });
        
        // Reset count and move to back of the shuffled queue
        const updatedQuestion = { ...currentQuestion, correctCount: 0 };
        const restOfQuestions = activeQuestions.slice(1);
        nextQuestionsState = shuffleArray([...restOfQuestions, updatedQuestion]);
    }

    // Schedule the state transition
    timerRef.current = window.setTimeout(() => {
        // Only proceed if the component is mounted.
        if (!isMounted.current) {
            return;
        }

        if (nextQuestionsState.length === 0) {
            const timeTaken = Math.round((Date.now() - startTime) / 1000);
            const finalTotalAnswers = totalAnswers + 1;
            const finalCorrectAnswers = correctSessionAnswers + (isCorrect ? 1 : 0);
            onComplete({ totalAnswers: finalTotalAnswers, correctAnswers: finalCorrectAnswers, timeTaken }, initialQuizSet);
        } else {
            setActiveQuestions(nextQuestionsState);
            // Reset for the next question
            setFeedback(null);
            setIsAnswered(false);
            setAnimationClass('');
        }
    }, 2500);

  }, [isAnswered, currentQuestion, activeQuestions, onComplete, initialQuizSet, startTime, totalAnswers, correctSessionAnswers]);
  
  if (!currentQuestion) {
    // This state is briefly reached when all questions are mastered, before ResultsScreen is rendered.
    return <div className="text-center p-8">クイズ完了！ 結果画面へ...</div>;
  }
  
  const progressPercentage = totalRequiredCorrect > 0 ? (correctSessionAnswers / totalRequiredCorrect) * 100 : 0;

  return (
    <div className={`p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full mx-auto transition-colors duration-500 ${animationClass}`}>
       <div className="flex justify-end items-center mb-4">
          <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{era} - クイズ</span>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold text-blue-600 dark:text-blue-400">進捗</h2>
        </div>
        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-5 overflow-hidden border-2 border-gray-400 dark:border-gray-500 shadow-inner">
            <div
                className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
      </div>
      
      <div className="text-center mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
         <p className="text-sm text-gray-500 dark:text-gray-400">問題 {totalAnswers + 1}</p>
         <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{currentQuestion.question}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {shuffledChoices.map((choice) => {
          const isCorrectChoice = choice === currentQuestion.answer;
          let buttonClass = 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800';
          if (isAnswered) {
            if (isCorrectChoice) {
                buttonClass = 'bg-green-500 transform scale-105';
            } else {
                buttonClass = 'bg-gray-400 dark:bg-gray-600 opacity-70';
            }
          }
          
          return (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-lg text-white font-semibold transition-all duration-300 disabled:cursor-not-allowed ${buttonClass}`}
            >
              {choice}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={`mt-6 p-4 rounded-lg text-center text-white ${feedback.type === 'correct' ? 'bg-green-600' : 'bg-red-600'}`}>
          <div className="font-bold text-2xl mb-2">
            {feedback.type === 'correct' ? '正解！' : '不正解...'}
          </div>
          <p className="text-md">{feedback.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
