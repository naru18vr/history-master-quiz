
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { AppState, QuizTerm, QuizStats, QuizData, AllErasMastery, QuizHistoryEntry } from './types';
import { ERAS, QUIZ_SET_SIZE } from './constants';
import EraSelectionScreen from './components/EraSelectionScreen';
import MemorizationScreen from './components/MemorizationScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryScreen from './components/HistoryScreen';
import Header from './components/Header'; // Import Header component
import { quizDataMap } from './data';
import { shuffleArray } from './utils/array';
import * as masteryService from './services/masteryService';
import * as historyService from './services/historyService';

const availableEras = Object.keys(quizDataMap).filter(era => quizDataMap[era] && quizDataMap[era].length > 0);

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.ERA_SELECTION);
  const [currentQuizSet, setCurrentQuizSet] = useState<QuizTerm[]>([]);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [masteryData, setMasteryData] = useState<AllErasMastery>({});
  const [history, setHistory] = useState<QuizHistoryEntry[]>([]);

  const eraQuestionCounts = useMemo(() => {
    return ERAS.reduce((acc, era) => {
        acc[era] = quizDataMap[era]?.length || 0;
        return acc;
    }, {} as { [era: string]: number });
  }, []);

  useEffect(() => {
    // Load mastery and history data from localStorage on initial app load
    setMasteryData(masteryService.loadMasteryData());
    setHistory(historyService.loadHistory());
  }, []);

  const handleEraSelect = useCallback((era: string) => {
    const data = quizDataMap[era];
    if (!data || data.length === 0) {
      alert('現在プレイ可能なクイズがありません。問題データを追加してください。');
      return;
    }

    // Get mastery data for the selected era
    const eraMastery = masteryData[era];
    const masteredIds = eraMastery ? new Set(eraMastery.masteredIds) : new Set();
    
    const questionPool: QuizData[] = data;

    const unmasteredQuestions = shuffleArray(questionPool.filter(q => !masteredIds.has(q.id)));
    const masteredQuestions = shuffleArray(questionPool.filter(q => masteredIds.has(q.id)));

    let selectedQuestions = [
        ...unmasteredQuestions,
        ...masteredQuestions
    ];

    if(selectedQuestions.length > QUIZ_SET_SIZE) {
        selectedQuestions = selectedQuestions.slice(0, QUIZ_SET_SIZE);
    }


    if (selectedQuestions.length === 0) {
      alert('この時代にはまだ問題がありません。');
      return;
    }
    
    const quizSet = selectedQuestions.map((item) => ({
      ...item,
      correctCount: 0,
      isMastered: false,
    }));
    
    setCurrentQuizSet(quizSet);
    setSelectedEra(era);
    setAppState(AppState.MEMORIZATION);

  }, [masteryData]);

  const handleStartQuiz = useCallback(() => {
    setAppState(AppState.QUIZ);
  }, []);

  const handleBackToEraSelection = useCallback(() => {
    setAppState(AppState.ERA_SELECTION);
    setSelectedEra(null);
    setCurrentQuizSet([]);
  }, []);

  const handleQuizComplete = useCallback((stats: { totalAnswers: number; correctAnswers: number; timeTaken: number }, masteredTerms: QuizTerm[]) => {
    const finalStats: QuizStats = {
      ...stats,
      mistakes: stats.totalAnswers - stats.correctAnswers,
      completionDate: new Date().toLocaleDateString('ja-JP'),
    };
    setQuizStats(finalStats);

    if (selectedEra) {
        const newMastery = masteryService.updateMasteryForEra(
            selectedEra,
            masteredTerms.map(term => term.id),
            quizDataMap[selectedEra].length
        );
        setMasteryData(newMastery);

        const historyEntry: QuizHistoryEntry = {
            id: Date.now().toString(),
            era: selectedEra,
            stats: finalStats,
            date: Date.now(),
        };
        const updatedHistory = historyService.addHistoryEntry(historyEntry);
        setHistory(updatedHistory);
    }

    setAppState(AppState.RESULTS);
  }, [selectedEra]);
  
  const handleShowHistory = useCallback(() => {
    setAppState(AppState.HISTORY);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case AppState.ERA_SELECTION:
        return (
          <EraSelectionScreen
            eras={ERAS}
            availableEras={availableEras}
            onSelectEra={handleEraSelect}
            masteryData={masteryData}
            onShowHistory={handleShowHistory}
            eraQuestionCounts={eraQuestionCounts}
          />
        );
      case AppState.MEMORIZATION:
        return (
            <MemorizationScreen
                quizSet={currentQuizSet}
                onStart={handleStartQuiz}
                onBack={handleBackToEraSelection}
                era={selectedEra!}
            />
        );
      case AppState.QUIZ:
        return (
            <QuizScreen
                initialQuizSet={currentQuizSet}
                onComplete={handleQuizComplete}
                era={selectedEra!}
            />
        );
      case AppState.RESULTS:
        return (
            <ResultsScreen
                stats={quizStats!}
                onRestart={handleBackToEraSelection}
                era={selectedEra!}
            />
        );
      case AppState.HISTORY:
        return (
            <HistoryScreen
                history={history}
                onBack={handleBackToEraSelection}
            />
        );
      default:
        return <EraSelectionScreen eras={ERAS} availableEras={availableEras} onSelectEra={handleEraSelect} masteryData={masteryData} onShowHistory={handleShowHistory} eraQuestionCounts={eraQuestionCounts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans p-4 flex flex-col items-center">
        <main className="w-full max-w-2xl mx-auto flex-grow flex flex-col">
            {appState !== AppState.ERA_SELECTION && (
                <Header onGoHome={handleBackToEraSelection} />
            )}
            <div className="flex-grow flex items-center justify-center">
               {renderContent()}
            </div>
        </main>
    </div>
  );
}
