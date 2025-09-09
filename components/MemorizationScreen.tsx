import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { QuizTerm } from '../types';
import { MEMORIZATION_TIME_SECONDS } from '../constants';

interface MemorizationScreenProps {
  quizSet: QuizTerm[];
  onStart: () => void;
  onBack: () => void;
  era: string;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
);


const MemorizationScreen: React.FC<MemorizationScreenProps> = ({ quizSet, onStart, onBack, era }) => {
  const [timeLeft, setTimeLeft] = useState(MEMORIZATION_TIME_SECONDS);
  const startFiredRef = useRef(false);

  const triggerStart = useCallback(() => {
    if (startFiredRef.current) return;
    startFiredRef.current = true;
    onStart();
  }, [onStart]);

  useEffect(() => {
    if (timeLeft <= 0) {
      triggerStart();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, triggerStart]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm">
            <BackIcon />
            時代選択へ
        </button>
        <div className={`text-4xl font-bold p-3 rounded-lg ${timeLeft <= 0 ? 'text-green-500' : 'text-blue-600 dark:text-blue-400'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">覚えるタイム！</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{era}の重要用語</p>
      </div>


      <div className="h-80 overflow-y-auto pr-4 mb-6 space-y-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        {quizSet.map((term) => (
          <div key={term.id} className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="font-bold text-lg text-blue-800 dark:text-blue-300">{term.term}</p>
            <p className="text-gray-600 dark:text-gray-300">{term.explanation}</p>
          </div>
        ))}
      </div>
      
      <button
        onClick={triggerStart}
        className="w-full py-4 text-xl font-bold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all transform hover:scale-105"
      >
        スタート！
      </button>
    </div>
  );
};

export default MemorizationScreen;