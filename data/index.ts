import type { QuizData } from '../types';
import { PALEOLITHIC_QUIZ_DATA } from './paleolithic/paleolithicQuizData';
import { YAYOI_QUIZ_DATA } from './yayoi/yayoiQuizData';
import { JOMON_QUIZ_DATA } from './jomon/jomonQuizData';
import { KOFUN_QUIZ_DATA } from './kofun/kofunQuizData';
import { ASUKA_QUIZ_DATA } from './asuka/asukaQuizData';
import { NARA_QUIZ_DATA } from './nara/naraQuizData';
import { HEIAN_QUIZ_DATA } from './heian/heianQuizData';
import { KAMAKURA_QUIZ_DATA } from './kamakura/kamakuraQuizData';
import { MUROMACHI_QUIZ_DATA } from './muromachi/muromachiQuizData';
import { AZUCHI_MOMOYAMA_QUIZ_DATA } from './azuchi-momoyama/azuchiMomoyamaQuizData';
import { EDO_EARLY_QUIZ_DATA } from './edo/edoEarlyQuizData';
import { EDO_MID_QUIZ_DATA } from './edo/edoMidQuizData';
import { EDO_LATE_QUIZ_DATA } from './edo/edoLateQuizData';
import { EDO_BAKUMATSU_QUIZ_DATA } from './edo/edoBakumatsuQuizData';
import { MEIJI_EARLY_QUIZ_DATA } from './meiji/meijiEarlyQuizData';
import { MEIJI_MID_QUIZ_DATA } from './meiji/meijiMidQuizData';
import { MEIJI_LATE_QUIZ_DATA } from './meiji/meijiLateQuizData';
import { TAISHO_QUIZ_DATA } from './taisho/taishoQuizData';
import { SHOWA_EARLY_QUIZ_DATA } from './showa/showaEarlyQuizData';
import { SHOWA_MID_QUIZ_DATA } from './showa/showaMidQuizData';
import { SHOWA_LATE_QUIZ_DATA } from './showa/showaLateQuizData';
import { HEISEI_EARLY_QUIZ_DATA } from './heisei/heiseiEarlyQuizData';
import { HEISEI_MID_QUIZ_DATA } from './heisei/heiseiMidQuizData';
import { HEISEI_LATE_QUIZ_DATA } from './heisei/heiseiLateQuizData';

export const quizDataMap: { [key: string]: QuizData[] } = {
  "旧石器時代 (~B.C.1万年)": PALEOLITHIC_QUIZ_DATA,
  "縄文時代 (B.C.1万年~B.C.4C)": JOMON_QUIZ_DATA,
  "弥生時代 (B.C.4C~A.D.3C後半)": YAYOI_QUIZ_DATA,
  "古墳時代 (3C後半~7C末)": KOFUN_QUIZ_DATA,
  "飛鳥時代 (592~710年)": ASUKA_QUIZ_DATA,
  "奈良時代 (710~794年)": NARA_QUIZ_DATA,
  "平安時代 (794~1185年)": HEIAN_QUIZ_DATA,
  "鎌倉時代 (1185~1333年)": KAMAKURA_QUIZ_DATA,
  "室町時代 (1336~1573年)": MUROMACHI_QUIZ_DATA,
  "安土桃山時代 (1573~1603年)": AZUCHI_MOMOYAMA_QUIZ_DATA,
  "江戸時代（初期: 1603~1651年）": EDO_EARLY_QUIZ_DATA,
  "江戸時代（中期: 1651~1786年）": EDO_MID_QUIZ_DATA,
  "江戸時代（後期: 1787~1853年）": EDO_LATE_QUIZ_DATA,
  "江戸時代（幕末: 1853~1867年）": EDO_BAKUMATSU_QUIZ_DATA,
  "明治時代（前期: 1868~1890年）": MEIJI_EARLY_QUIZ_DATA,
  "明治時代（中期: 1890~1905年）": MEIJI_MID_QUIZ_DATA,
  "明治時代（後期: 1905~1912年）": MEIJI_LATE_QUIZ_DATA,
  "大正時代 (1912~1926年)": TAISHO_QUIZ_DATA,
  "昭和時代（前期: 1926~1945年）": SHOWA_EARLY_QUIZ_DATA,
  "昭和時代（中期: 1945~1955年）": SHOWA_MID_QUIZ_DATA,
  "昭和時代（後期: 1955~1989年）": SHOWA_LATE_QUIZ_DATA,
  "平成時代（前期: 1989~2001年）": HEISEI_EARLY_QUIZ_DATA,
  "平成時代（中期: 2001~2012年）": HEISEI_MID_QUIZ_DATA,
  "平成時代（後期: 2012~2019年）": HEISEI_LATE_QUIZ_DATA,
};

// 開発中だけ、各時代の問題数を一覧表示（型エラー回避版）
if ((import.meta as any)?.env?.DEV) {
  const table = Object.entries(quizDataMap).map(([era, arr]) => ({
    era,
    count: Array.isArray(arr) ? arr.length : 0,
  }));
  // ブラウザの F12 → Console に表で出る
  console.table(table);
}
