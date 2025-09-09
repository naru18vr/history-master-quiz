
import type { AllErasMastery } from '../types';

const MASTERY_STORAGE_KEY = 'rekishiMasteryData';

/**
 * Loads the mastery data from localStorage.
 * @returns The stored mastery data or an empty object.
 */
export const loadMasteryData = (): AllErasMastery => {
  try {
    const storedData = localStorage.getItem(MASTERY_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : {};
  } catch (error) {
    console.error('Failed to load mastery data:', error);
    return {};
  }
};

/**
 * Saves the mastery data to localStorage.
 * @param data The mastery data to save.
 */
const saveMasteryData = (data: AllErasMastery): void => {
  try {
    localStorage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save mastery data:', error);
  }
};

/**
 * Updates the mastery data for a specific era with newly mastered term IDs.
 * @param eraName The name of the era to update.
 * @param newlyMasteredIds An array of term IDs that were just mastered.
 * @param totalTermsInEra The total number of terms available for this era.
 * @returns The updated mastery data for all eras.
 */
export const updateMasteryForEra = (
  eraName: string,
  newlyMasteredIds: string[],
  totalTermsInEra: number
): AllErasMastery => {
  const allData = loadMasteryData();
  
  const eraData = allData[eraName] || { masteredIds: [], totalTerms: totalTermsInEra };
  
  // Add new unique IDs to the list of mastered IDs
  const updatedIds = [...new Set([...eraData.masteredIds, ...newlyMasteredIds])];
  
  const updatedEraData = {
    masteredIds: updatedIds,
    totalTerms: totalTermsInEra,
  };
  
  const newData = {
    ...allData,
    [eraName]: updatedEraData,
  };

  saveMasteryData(newData);
  return newData;
};
