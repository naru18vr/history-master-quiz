
import React from 'react';
import type { QuizStats } from '../types';

const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
);

const TrophyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

interface StatCardProps {
    label: string;
    value: string | number;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, colorClass }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-600">
        <span className="text-gray-600 dark:text-gray-300">{label}</span>
        <span className={`font-bold text-lg ${colorClass}`}>{value}</span>
    </div>
);

interface ResultsScreenProps {
  stats: QuizStats;
  onRestart: () => void;
  era: string;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ stats, onRestart, era }) => {
    const accuracy = stats.totalAnswers > 0 ? ((stats.correctAnswers / stats.totalAnswers) * 100).toFixed(1) : 0;
  
    return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-4">
            <TrophyIcon />
            <h1 className="text-3xl font-extrabold mt-2 text-gray-900 dark:text-white">クイズ完了！</h1>
            <p className="text-md text-gray-500 dark:text-gray-400 mt-1">お疲れ様でした！</p>
        </div>

      <div className="text-left bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-2">
        <StatCard label="完了日" value={stats.completionDate} colorClass="text-gray-800 dark:text-gray-100" />
        <StatCard label="挑戦した時代" value={era} colorClass="text-gray-800 dark:text-gray-100" />
        <StatCard label="所要時間" value={`${stats.timeTaken}秒`} colorClass="text-purple-600 dark:text-purple-400" />
        <StatCard label="正答率" value={`${accuracy}%`} colorClass="text-green-600 dark:text-green-400" />
        <StatCard label="間違えた回数" value={`${stats.mistakes}回`} colorClass="text-red-600 dark:text-red-400" />
      </div>
      
      <div className="mt-6 p-3 bg-blue-100 dark:bg-blue-900/50 border border-blue-300 dark:border-blue-700 rounded-lg flex items-center justify-center">
        <ShareIcon />
        <p className="ml-2 font-semibold text-blue-800 dark:text-blue-200 text-sm">学習の成果をシェアしよう！</p>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 w-full py-3 text-lg font-bold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105"
      >
        時代選択にもどる
      </button>
    </div>
  );
};

export default ResultsScreen;
