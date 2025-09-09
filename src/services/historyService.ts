import type { QuizHistoryEntry } from '../types';

const HISTORY_STORAGE_KEY = 'rekishiQuizHistory';

/**
 * Loads the quiz history from localStorage.
 * @returns The stored history array or an empty array.
 */
export const loadHistory = (): QuizHistoryEntry[] => {
  try {
    const storedData = localStorage.getItem(HISTORY_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error('Failed to load history data:', error);
    return [];
  }
};

/**
 * Saves the entire history array to localStorage.
 * @param history The history array to save.
 */
const saveHistory = (history: QuizHistoryEntry[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history data:', error);
  }
};

/**
 * Adds a new entry to the history and saves it.
 * @param newEntry The new history entry to add.
 * @returns The updated history array.
 */
export const addHistoryEntry = (newEntry: QuizHistoryEntry): QuizHistoryEntry[] => {
  const currentHistory = loadHistory();
  const updatedHistory = [newEntry, ...currentHistory]; // Add to the beginning
  saveHistory(updatedHistory);
  return updatedHistory;
};
