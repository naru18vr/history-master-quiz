import React from 'react';
import { QuizHistoryEntry } from '../types';

interface HistoryScreenProps {
  history: QuizHistoryEntry[];
  onBack: () => void;
}

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
);

const groupHistory = (history: QuizHistoryEntry[]) => {
    const groups: { [key: string]: QuizHistoryEntry[] } = {
        '今日': [],
        '昨日': [],
        '一昨日': [],
        '7日以内': [],
        '1ヶ月以内': [],
        '1ヶ月以上前': [],
    };

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const dayBeforeYesterdayStart = yesterdayStart - 24 * 60 * 60 * 1000;
    const sevenDaysAgoStart = todayStart - 6 * 24 * 60 * 60 * 1000;
    const oneMonthAgoStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).getTime();
    
    // Sort history newest first
    const sortedHistory = [...history].sort((a, b) => b.date - a.date);

    sortedHistory.forEach(entry => {
        if (entry.date >= todayStart) {
            groups['今日'].push(entry);
        } else if (entry.date >= yesterdayStart) {
            groups['昨日'].push(entry);
        } else if (entry.date >= dayBeforeYesterdayStart) {
            groups['一昨日'].push(entry);
        } else if (entry.date >= sevenDaysAgoStart) {
            groups['7日以内'].push(entry);
        } else if (entry.date >= oneMonthAgoStart) {
            groups['1ヶ月以内'].push(entry);
        } else {
            groups['1ヶ月以上前'].push(entry);
        }
    });

    return groups;
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ history, onBack }) => {
    const groupedHistory = groupHistory(history);

    const totalTimeToday = groupedHistory['今日'].reduce((sum, entry) => sum + entry.stats.timeTaken, 0);

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <button onClick={onBack} className="flex items-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm">
                    <BackIcon />
                    時代選択へ
                </button>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">学習履歴</h1>
            </div>

            <div className="h-[60vh] overflow-y-auto pr-4 space-y-6">
                {Object.entries(groupedHistory).map(([groupName, entries]) => {
                    if (entries.length === 0) return null;

                    return (
                        <div key={groupName}>
                            <div className="flex justify-between items-baseline border-b-2 border-blue-500 dark:border-blue-400 pb-2 mb-3">
                                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-300">{groupName}</h2>
                                {groupName === '今日' && (
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        今日の合計学習時間: {Math.floor(totalTimeToday / 60)}分{totalTimeToday % 60}秒
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {entries.map(entry => {
                                    const accuracy = entry.stats.totalAnswers > 0
                                        ? ((entry.stats.correctAnswers / entry.stats.totalAnswers) * 100).toFixed(0)
                                        : 0;
                                    return (
                                        <div key={entry.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow-sm">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-lg text-gray-800 dark:text-gray-100">{entry.era}</span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(entry.date).toLocaleString('ja-JP', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                                                <span>所要時間: <span className="font-semibold">{entry.stats.timeTaken}秒</span></span>
                                                <span>正答率: <span className="font-semibold">{accuracy}%</span></span>
                                                <span>ミス: <span className="font-semibold">{entry.stats.mistakes}回</span></span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
                 {history.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">まだ学習履歴がありません。</p>
                        <p className="text-gray-500 dark:text-gray-400">クイズを完了して、記録を残しましょう！</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryScreen;
