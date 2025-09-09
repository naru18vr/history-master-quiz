import React from 'react';
import type { AllErasMastery } from '../types';

interface EraSelectionScreenProps {
  eras: string[];
  availableEras: string[];
  onSelectEra: (era: string) => void;
  masteryData: AllErasMastery;
  onShowHistory: () => void;
  eraQuestionCounts: { [era: string]: number };
}

const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);

const EraSelectionScreen: React.FC<EraSelectionScreenProps> = ({ eras, onSelectEra, availableEras, masteryData, onShowHistory, eraQuestionCounts }) => {
  return (
    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white">歴史マスタークイズ</h1>
      <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">時代を選んで、重要用語をマスターしよう！</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {eras.map((era) => {
          const isAvailable = availableEras.includes(era);
          const mastery = masteryData[era];
          const masteredCount = mastery?.masteredIds?.length || 0;
          const totalCount = eraQuestionCounts[era] || 0;
          const percentage = totalCount > 0 ? Math.floor((masteredCount / totalCount) * 100) : 0;
          const isMastered = percentage >= 100;

          return (
            <button
              key={era}
              onClick={() => onSelectEra(era)}
              disabled={!isAvailable}
              className={`p-4 rounded-lg font-semibold text-white transition-transform transform relative overflow-hidden shadow-lg ${
                !isAvailable
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : isMastered
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 hover:scale-105'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              }`}
            >
              <div className="relative z-10 flex flex-col justify-center items-center h-full">
                <div className="flex items-center justify-center">
                  {isMastered && <div className="mr-2"><StarIcon /></div>}
                  <p className="text-sm sm:text-base">{era}</p>
                </div>
                {isAvailable && (
                    <div className={`text-xs font-normal ${isMastered ? 'text-amber-100' : 'text-blue-100 dark:text-blue-200'} mt-1 flex justify-center space-x-2`}>
                        <span>全{totalCount}問</span>
                        <span aria-hidden="true">/</span>
                        <span>{isMastered ? 'マスター！' : `理解度: ${percentage}%`}</span>
                    </div>
                )}
              </div>
              {isAvailable && !isMastered && (
                 <div 
                    className="absolute bottom-0 left-0 h-1 bg-green-400/50"
                    style={{ width: `${percentage}%` }}
                 ></div>
              )}
            </button>
          );
      })}
      </div>

      <div className="mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
          <button
            onClick={onShowHistory}
            className="w-full max-w-sm mx-auto py-3 px-6 text-lg font-bold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition-transform transform hover:scale-105"
          >
            学習履歴を見る
          </button>
      </div>
    </div>
  );
};

export default EraSelectionScreen;
