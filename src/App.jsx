import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Utensils,
  Dumbbell,
  Scale,
  Plus,
  Trash2,
  Copy,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Flame,
  Clock,
  Download,
  Upload,
  Settings,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Edit3,
  X,
  Calendar,
  Cloud,
  CloudOff,
  RefreshCw,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Eraser,
  SkipForward,
  Check,
  Droplets,
  Droplet,
  Sparkles,
  Zap,
  Maximize2,
  Minimize2,
  Calculator,
  PieChart,
  Search,
  LayoutDashboard,
} from 'lucide-react';

const SUPABASE_URL = 'https://qwxfjrunqhssoonapfcl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_skGnR2B-ijOkbn0YVLXv2Q_INgXLDaF';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const CLOUD_RECORD_ID = 'davide_main_profile';

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const FULL_DAYS = {
  Lun: 'Lunedì',
  Mar: 'Martedì',
  Mer: 'Mercoledì',
  Gio: 'Giovedì',
  Ven: 'Venerdì',
  Sab: 'Sabato',
  Dom: 'Domenica',
};

const MEAL_SLOTS = ['Colazione', 'Pranzo', 'Cena', 'Spuntini'];

const WATER_PRESETS = [
  { label: 'Bicchiere', amount: 200 },
  { label: 'Bicchiere Grande', amount: 300 },
  { label: 'Borraccia', amount: 500 },
  { label: 'Bottiglia 1L', amount: 1000 },
];

const DRINK_TYPES = [
  { id: 'water', label: 'Acqua Naturale / Frizzante', factor: 1 },
  { id: 'electrolytes', label: 'Acqua + Elettroliti / Sali', factor: 1 },
  { id: 'tea', label: 'Tè / Tisana non zuccherata', factor: 1 },
  { id: 'coffee', label: 'Caffè / Espresso', factor: 0.8 },
];

const EMPTY_WEEKLY_PLAN = {
  Lun: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
  Mar: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
  Mer: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
  Gio: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
  Ven: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
  Sab: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
  Dom: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
};

const INITIAL_FOODS = [
  { id: 'f1', name: 'Yogurt Greco 0% (250g)', baseGrams: 250, kcal: 145, p: 25, c: 9, sugars: 9, g: 0 },
  { id: 'f2', name: 'Muesli Croccante / Avena (60g)', baseGrams: 60, kcal: 230, p: 6, c: 39, sugars: 8, g: 5 },
  { id: 'f3', name: 'Mandorle & Noci (20g)', baseGrams: 20, kcal: 125, p: 4, c: 2, sugars: 1, g: 11 },
  { id: 'f4', name: 'Cioccolato Fondente 90% (15g)', baseGrams: 15, kcal: 88, p: 1.5, c: 2, sugars: 1.1, g: 8 },
  { id: 'f5', name: 'Pasta di Semola (120g)', baseGrams: 120, kcal: 425, p: 15, c: 86, sugars: 3.5, g: 1.8 },
  { id: 'f6', name: 'Petto di Pollo / Tenders (200g)', baseGrams: 200, kcal: 220, p: 46, c: 0, sugars: 0, g: 3 },
  { id: 'f7', name: 'Olio Extravergine d’Oliva (15g)', baseGrams: 15, kcal: 135, p: 0, c: 0, sugars: 0, g: 15 },
  { id: 'f8', name: 'Riso Basmati (100g)', baseGrams: 100, kcal: 350, p: 8, c: 78, sugars: 0.2, g: 0.8 },
  { id: 'f9', name: 'Uova Intere Medie (3 uova)', kcal: 215, p: 19, c: 1.5, sugars: 1.5, g: 15 },
  { id: 'f10', name: 'Lenticchie Lessate (150g)', baseGrams: 150, kcal: 140, p: 10, c: 22, sugars: 1.8, g: 0.6 },
  { id: 'f11', name: 'Banana Media (120g)', baseGrams: 120, kcal: 105, p: 1.3, c: 27, sugars: 14.5, g: 0.4 },
];

const INITIAL_MEALS = [
  {
    id: 'm1',
    name: 'Colazione Proteica & Croccante',
    items: [
      { foodId: 'f1', qty: 1 },
      { foodId: 'f2', qty: 1 },
      { foodId: 'f3', qty: 1 },
      { foodId: 'f4', qty: 1 },
    ],
  },
  {
    id: 'm2',
    name: 'Pranzo Pasta, Pollo & EVO',
    items: [
      { foodId: 'f5', qty: 1 },
      { foodId: 'f6', qty: 1 },
      { foodId: 'f7', qty: 1 },
    ],
  },
  {
    id: 'm3',
    name: 'Cena Riso, Uova & Lenticchie',
    items: [
      { foodId: 'f8', qty: 0.8 },
      { foodId: 'f9', qty: 1 },
      { foodId: 'f10', qty: 1 },
    ],
  },
  {
    id: 'm4',
    name: 'Spuntino Pre-Workout',
    items: [
      { foodId: 'f11', qty: 1 },
      { foodId: 'f1', qty: 0.6 },
    ],
  },
];

const INITIAL_WEEKLY_PLAN = {
  Lun: { Colazione: ['m1'], Pranzo: ['m2'], Cena: ['m3'], Spuntini: ['m4'] },
  Mar: { Colazione: ['m1'], Pranzo: ['m2'], Cena: ['m3'], Spuntini: [] },
  Mer: { Colazione: ['m1'], Pranzo: ['m2'], Cena: ['m3'], Spuntini: ['m4'] },
  Gio: { Colazione: ['m1'], Pranzo: ['m2'], Cena: ['m3'], Spuntini: [] },
  Ven: { Colazione: ['m1'], Pranzo: ['m2'], Cena: ['m3'], Spuntini: ['m4'] },
  Sab: { Colazione: ['m1'], Pranzo: ['m2'], Cena: [], Spuntini: [] },
  Dom: { Colazione: ['m1'], Pranzo: ['m2'], Cena: ['m3'], Spuntini: [] },
};

const INITIAL_WEIGHTS = [
  { id: 'w1', date: '2026-10-18', weight: 78.4, note: 'Inizio blocco massa pulita' },
  { id: 'w2', date: '2026-10-25', weight: 78.0, note: 'Buona energia negli allenamenti' },
  { id: 'w3', date: '2026-11-01', weight: 77.6, note: 'Check domenicale a digiuno' },
  { id: 'w4', date: '2026-11-08', weight: 77.2, note: 'Addome più definito, carichi in salita' },
];

const INITIAL_WATER_SETTINGS = {
  autoCalculate: true,
  mlPerKg: 35,
  workoutBonusMl: 600,
  manualTargetMl: 2500,
  workoutDates: {},
};

const INITIAL_BODY_PROFILE = {
  heightCm: 178,
  age: 23,
  sex: 'M',
  activityFactor: 1.55,
  goal: 'lean_bulk',
  autoSyncWeight: true,
};

const INITIAL_WORKOUTS = [
  {
    id: 'wo-a',
    dayLabel: 'Giorno A',
    title: 'Upper Push (Spinta)',
    focus: 'Petto, Spalle Anteriori/Laterali, Tricipiti',
    exercises: [
      { id: 'e1', name: 'Spinte su Panca Piana/Pavimento con Manubri', sets: 4, reps: '8-10', weight: 22, rest: 120, restAfterExercise: 150, notes: 'Controlla la discesa per 2 secondi, gomiti a 45°' },
      { id: 'e2', name: 'Military Press in Piedi con Manubri', sets: 3, reps: '8-10', weight: 14, rest: 90, restAfterExercise: 120, notes: 'Core contratto, non inarcare la zona lombare' },
      { id: 'e3', name: 'Piegamenti sulle Braccia (Push-Up)', sets: 3, reps: 'Max (12-15)', weight: 0, rest: 90, restAfterExercise: 120, notes: 'Corpo libero - petto a 2 cm da terra' },
      { id: 'e4', name: 'Alzate Laterali con Manubri', sets: 4, reps: '12-15', weight: 8, rest: 60, restAfterExercise: 90, notes: 'Guida con i gomiti, pausa di 1s in alto' },
      { id: 'e5', name: 'French Press Manubri (Estensioni Tricipiti)', sets: 3, reps: '10-12', weight: 10, rest: 60, restAfterExercise: 90, notes: 'Gomiti stretti e fermi' },
    ],
  },
  {
    id: 'wo-b',
    dayLabel: 'Giorno B',
    title: 'Lower & Core',
    focus: 'Quadricipiti, Femorali, Glutei, Polpacci e Addome',
    exercises: [
      { id: 'e6', name: 'Goblet Squat con Manubrio', sets: 4, reps: '10-12', weight: 24, rest: 120, restAfterExercise: 180, notes: 'Accosciata profonda, schiena neutra' },
      { id: 'e7', name: 'Stacchi Rumeni (RDL) con Manubri', sets: 4, reps: '10', weight: 22, rest: 120, restAfterExercise: 150, notes: 'Spingi il bacino indietro, senti allungare i femorali' },
      { id: 'e8', name: 'Affondi Bulgari (Bulgarian Split Squat)', sets: 3, reps: '8-10 / lato', weight: 14, rest: 90, restAfterExercise: 120, notes: 'Busto leggermente inclinato in avanti' },
      { id: 'e9', name: 'Calf Raise su Rialzo (Polpacci)', sets: 4, reps: '15-20', weight: 16, rest: 60, restAfterExercise: 90, notes: 'Massimo allungamento in basso' },
      { id: 'e10', name: 'Plank Addominale + Hollow Hold', sets: 3, reps: '45-60 sec', weight: 0, rest: 60, restAfterExercise: 90, notes: 'Corpo libero - retroversione del bacino' },
    ],
  },
  {
    id: 'wo-c',
    dayLabel: 'Giorno C',
    title: 'Upper Pull & Braccia',
    focus: 'Dorsali, Deltoidi Posteriori, Bicipiti e Richiamo Braccia',
    exercises: [
      { id: 'e11', name: 'Rematore con Manubri a Busto Flesso', sets: 4, reps: '8-10', weight: 20, rest: 120, restAfterExercise: 150, notes: 'Porta i manubri verso le tasche, scapole addotte' },
      { id: 'e12', name: 'Rematore Singolo con Appoggio (One-Arm Row)', sets: 3, reps: '10-12 / lato', weight: 24, rest: 90, restAfterExercise: 120, notes: 'Zero slancio, massimo allungamento in basso' },
      { id: 'e13', name: 'Alzate Posteriori a 90° (Rear Delt Fly)', sets: 4, reps: '12-15', weight: 7, rest: 60, restAfterExercise: 90, notes: 'Controllo totale del movimento' },
      { id: 'e14', name: 'Curl Alternato con Manubri in Piedi', sets: 3, reps: '10-12', weight: 12, rest: 75, restAfterExercise: 90, notes: 'Supinazione completa del polso in salita' },
      { id: 'e15', name: 'Hammer Curl (Presa a Martello)', sets: 3, reps: '12', weight: 12, rest: 60, restAfterExercise: 90, notes: 'Ottimo per brachiale e avambracci' },
    ],
  },
];

const INITIAL_TARGETS = {
  kcal: 2750,
  p: 155,
  c: 365,
  g: 74,
};

const INITIAL_LAYOUT = {
  nutrition: ['todayDashboard', 'subNav', 'mainContent'],
  planner: ['summaryCard', 'mealSlotsGrid'],
  composer: ['composerForm', 'savedMealsList'],
  foods: ['addFoodForm', 'foodsList'],
  water: ['waterOverview', 'waterHistory'],
  weight: ['addWeightForm', 'weightChartCard'],
  workout: ['workoutHeader', 'exercisesList'],
};

const STORAGE_KEY = 'fittrack_pro_data_v1';

function normalizeSlotEntry(entry) {
  if (!entry) return null;
  if (typeof entry === 'string') {
    return { type: 'meal', id: entry, qty: 1 };
  }
  if (typeof entry === 'object' && entry.id) {
    return {
      type: entry.type === 'food' ? 'food' : 'meal',
      id: entry.id,
      qty: typeof entry.qty === 'number' && entry.qty > 0 ? entry.qty : 1,
    };
  }
  return null;
}

function getSetRestSeconds(exercise, setIndex) {
  const defaultRest = Math.max(0, Number(exercise?.rest) || 90);
  if (Array.isArray(exercise?.setRests) && typeof exercise.setRests[setIndex] === 'number') {
    return Math.max(0, exercise.setRests[setIndex]);
  }
  return defaultRest;
}

function getExerciseTransitionRest(exercise, fallbackGlobalRest = 180) {
  if (typeof exercise?.restAfterExercise === 'number' && !isNaN(exercise.restAfterExercise)) {
    return Math.max(0, exercise.restAfterExercise);
  }
  return Math.max(0, Number(fallbackGlobalRest) || 180);
}

function hasCustomPerSetRests(exercise) {
  if (!exercise || exercise.sets <= 1 || !Array.isArray(exercise.setRests)) return false;
  const transitions = exercise.sets - 1;
  const relevant = exercise.setRests.slice(0, transitions);
  if (relevant.length === 0) return false;
  return relevant.some((val) => val !== exercise.rest);
}

function calculateSmartNutritionTargets(weightKg, profile = INITIAL_BODY_PROFILE) {
  const w = Math.max(35, Number(weightKg) || 75);
  const h = Math.max(120, Number(profile.heightCm) || 178);
  const age = Math.max(15, Number(profile.age) || 23);
  const sex = profile.sex === 'F' ? 'F' : 'M';
  const activity = Number(profile.activityFactor) || 1.55;

  const bmr =
    sex === 'M'
      ? 10 * w + 6.25 * h - 5 * age + 5
      : 10 * w + 6.25 * h - 5 * age - 161;

  const tdee = bmr * activity;

  let surplus = 200;
  if (profile.goal === 'recomp') surplus = 0;
  if (profile.goal === 'bulk') surplus = 350;

  const targetKcal = Math.round((tdee + surplus) / 10) * 10;
  const p = Math.round(w * 2.0);
  const g = Math.round(w * 0.95);
  const remainingKcal = Math.max(200, targetKcal - p * 4 - g * 9);
  const c = Math.round(remainingKcal / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    kcal: targetKcal,
    p,
    c,
    g,
  };
}

function getLocalIsoDate(dateObj = new Date()) {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayIso() {
  return getLocalIsoDate(new Date());
}

function getTodayDayKey(dateObj = new Date()) {
  const jsDay = dateObj.getDay();
  return jsDay === 0 ? 'Dom' : DAYS[jsDay - 1];
}

function getWeekDaysFromDate(baseIsoDate) {
  const [y, m, dNum] = baseIsoDate.split('-').map(Number);
  const refDate = new Date(y, m - 1, dNum);
  const jsDay = refDate.getDay();
  const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = new Date(y, m - 1, dNum + diffToMonday);

  return Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + idx);
    const iso = getLocalIsoDate(d);
    return {
      iso,
      dayShort: DAYS[idx],
      dayNum: iso.slice(8, 10),
      monthShort: d.toLocaleDateString('it-IT', { month: 'short' }),
    };
  });
}

function extractBaseGrams(food) {
  if (!food) return null;
  if (typeof food.baseGrams === 'number' && food.baseGrams > 0) return food.baseGrams;
  const match = String(food.name || '').match(/\((\d+(?:[.,]\d+)?)\s*(?:g|gr|ml)\)/i);
  if (match) {
    const val = parseFloat(match[1].replace(',', '.'));
    return !isNaN(val) && val > 0 ? val : null;
  }
  return null;
}

function normalizeWorkouts(rawWorkouts, defaultBetweenRest = 180) {
  const source = Array.isArray(rawWorkouts) && rawWorkouts.length > 0 ? rawWorkouts : INITIAL_WORKOUTS;
  return source.map((wo) => ({
    ...wo,
    exercises: Array.isArray(wo.exercises)
      ? wo.exercises.map((ex) => {
          const setsCount = Math.max(1, Number(ex.sets) || 3);
          const baseRest = Math.max(0, Number(ex.rest) || 90);
          const transitions = Math.max(0, setsCount - 1);
          const rawSetRests = Array.isArray(ex.setRests) ? ex.setRests : [];
          const normalizedSetRests = Array.from({ length: transitions }, (_, idx) =>
            typeof rawSetRests[idx] === 'number' && !isNaN(rawSetRests[idx])
              ? Math.max(0, rawSetRests[idx])
              : baseRest
          );
          return {
            ...ex,
            sets: setsCount,
            rest: baseRest,
            setRests: normalizedSetRests,
            restAfterExercise:
              typeof ex.restAfterExercise === 'number' && !isNaN(ex.restAfterExercise)
                ? Math.max(0, ex.restAfterExercise)
                : defaultBetweenRest,
          };
        })
      : [],
  }));
}

function normalizeData(raw) {
  const safe = raw && typeof raw === 'object' ? raw : {};
  const layout = safe.layout && typeof safe.layout === 'object' ? safe.layout : {};
  const ws = safe.waterSettings && typeof safe.waterSettings === 'object' ? safe.waterSettings : {};
  const bp = safe.bodyProfile && typeof safe.bodyProfile === 'object' ? safe.bodyProfile : {};
  const globalBetweenRest = typeof safe.betweenExerciseRest === 'number' ? safe.betweenExerciseRest : 180;

  let nutritionLayout = Array.isArray(layout.nutrition) ? [...layout.nutrition] : [...INITIAL_LAYOUT.nutrition];
  if (!nutritionLayout.includes('todayDashboard')) {
    nutritionLayout = ['todayDashboard', ...nutritionLayout];
  }

  return {
    foods: Array.isArray(safe.foods) ? safe.foods : INITIAL_FOODS,
    meals: Array.isArray(safe.meals) ? safe.meals : INITIAL_MEALS,
    weeklyPlan: safe.weeklyPlan && typeof safe.weeklyPlan === 'object' ? safe.weeklyPlan : INITIAL_WEEKLY_PLAN,
    weights: Array.isArray(safe.weights) ? safe.weights : INITIAL_WEIGHTS,
    waterLogs: Array.isArray(safe.waterLogs) ? safe.waterLogs : [],
    waterSettings: {
      autoCalculate: typeof ws.autoCalculate === 'boolean' ? ws.autoCalculate : INITIAL_WATER_SETTINGS.autoCalculate,
      mlPerKg: typeof ws.mlPerKg === 'number' ? ws.mlPerKg : INITIAL_WATER_SETTINGS.mlPerKg,
      workoutBonusMl: typeof ws.workoutBonusMl === 'number' ? ws.workoutBonusMl : INITIAL_WATER_SETTINGS.workoutBonusMl,
      manualTargetMl: typeof ws.manualTargetMl === 'number' ? ws.manualTargetMl : INITIAL_WATER_SETTINGS.manualTargetMl,
      workoutDates: ws.workoutDates && typeof ws.workoutDates === 'object' ? ws.workoutDates : {},
    },
    bodyProfile: {
      heightCm: typeof bp.heightCm === 'number' ? bp.heightCm : INITIAL_BODY_PROFILE.heightCm,
      age: typeof bp.age === 'number' ? bp.age : INITIAL_BODY_PROFILE.age,
      sex: bp.sex === 'F' ? 'F' : 'M',
      activityFactor: typeof bp.activityFactor === 'number' ? bp.activityFactor : INITIAL_BODY_PROFILE.activityFactor,
      goal: ['lean_bulk', 'recomp', 'bulk'].includes(bp.goal) ? bp.goal : INITIAL_BODY_PROFILE.goal,
      autoSyncWeight: typeof bp.autoSyncWeight === 'boolean' ? bp.autoSyncWeight : INITIAL_BODY_PROFILE.autoSyncWeight,
    },
    workouts: normalizeWorkouts(safe.workouts, globalBetweenRest),
    targets: safe.targets && typeof safe.targets === 'object' ? { ...INITIAL_TARGETS, ...safe.targets } : INITIAL_TARGETS,
    theme: safe.theme === 'light' ? 'light' : 'dark',
    betweenExerciseRest: globalBetweenRest,
    layout: {
      nutrition: nutritionLayout,
      planner: Array.isArray(layout.planner) ? layout.planner : INITIAL_LAYOUT.planner,
      composer: Array.isArray(layout.composer) ? layout.composer : INITIAL_LAYOUT.composer,
      foods: Array.isArray(layout.foods) ? layout.foods : INITIAL_LAYOUT.foods,
      water: Array.isArray(layout.water) ? layout.water : INITIAL_LAYOUT.water,
      weight: Array.isArray(layout.weight) ? layout.weight : INITIAL_LAYOUT.weight,
      workout: Array.isArray(layout.workout) ? layout.workout : INITIAL_LAYOUT.workout,
    },
  };
}

function playTimerBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.14);
      gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.14 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.14);
      osc.stop(ctx.currentTime + idx * 0.14 + 0.36);
    });
  } catch (e) {}
}

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return normalizeData(JSON.parse(saved));
    } catch (e) {}
    return normalizeData(null);
  });

  const isLight = data.theme === 'light';
  const [reorderMode, setReorderMode] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const docEl = document.documentElement;
      const isCurrentlyFs = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      if (!isCurrentlyFs) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (e) {}
  };

  const toggleTheme = () => {
    setData((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const moveSection = (groupKey, sectionId, direction) => {
    setData((prev) => {
      const currentList = [...(prev.layout?.[groupKey] || INITIAL_LAYOUT[groupKey])];
      const idx = currentList.indexOf(sectionId);
      if (idx === -1) return prev;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= currentList.length) return prev;
      const [moved] = currentList.splice(idx, 1);
      currentList.splice(targetIdx, 0, moved);
      return {
        ...prev,
        layout: {
          ...prev.layout,
          [groupKey]: currentList,
        },
      };
    });
  };

  const resetLayoutOrder = () => {
    setData((prev) => ({
      ...prev,
      layout: INITIAL_LAYOUT,
    }));
  };

  const [syncStatus, setSyncStatus] = useState('syncing');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const isRemoteUpdate = useRef(false);
  const hasLoadedInitialCloud = useRef(false);
  const saveTimeoutRef = useRef(null);

  const pullFromCloud = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const { data: row, error } = await supabase
        .from('fittrack_sync')
        .select('data, updated_at')
        .eq('id', CLOUD_RECORD_ID)
        .maybeSingle();

      if (error) throw error;

      if (row && row.data) {
        const normalized = normalizeData(row.data);
        isRemoteUpdate.current = true;
        setData(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        setLastSyncedAt(new Date(row.updated_at || Date.now()));
      } else {
        const nowIso = new Date().toISOString();
        const { error: upsertErr } = await supabase
          .from('fittrack_sync')
          .upsert({ id: CLOUD_RECORD_ID, data, updated_at: nowIso });
        if (upsertErr) throw upsertErr;
        setLastSyncedAt(new Date());
      }
      hasLoadedInitialCloud.current = true;
      setSyncStatus('synced');
    } catch (err) {
      hasLoadedInitialCloud.current = true;
      setSyncStatus('error');
    }
  }, []);

  useEffect(() => {
    pullFromCloud();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') pullFromCloud();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [pullFromCloud]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {}

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    if (!hasLoadedInitialCloud.current) return;

    setSyncStatus('syncing');
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const nowIso = new Date().toISOString();
        const { error } = await supabase
          .from('fittrack_sync')
          .upsert({ id: CLOUD_RECORD_ID, data, updated_at: nowIso });
        if (error) throw error;
        setLastSyncedAt(new Date());
        setSyncStatus('synced');
      } catch (err) {
        setSyncStatus('error');
      }
    }, 700);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [data]);

  const [activeTab, setActiveTab] = useState('nutrition');
  // Sotto-schede unificate: 'planner' | 'pantry' | 'water' | 'weight'
  const [nutritionSubTab, setNutritionSubTab] = useState('planner');
  // Vista attiva dentro la sezione unificata "Pasti & Alimenti": 'composer' | 'foods'
  const [pantryView, setPantryView] = useState('composer');
  // Barra di ricerca istantanea per Pasti & Alimenti
  const [pantrySearchQuery, setPantrySearchQuery] = useState('');

  const [todayIso, setTodayIso] = useState(() => getTodayIso());
  const todayIsoRef = useRef(todayIso);

  const [selectedDay, setSelectedDay] = useState(() => getTodayDayKey());
  const [selectedWaterDate, setSelectedWaterDate] = useState(() => getTodayIso());
  const [newWeightDate, setNewWeightDate] = useState(() => getTodayIso());

  const syncRolloverDate = useCallback(() => {
    const now = new Date();
    const currentIso = getLocalIsoDate(now);
    const prevIso = todayIsoRef.current;

    if (currentIso !== prevIso) {
      const prevDayKey = getTodayDayKey(new Date(`${prevIso}T12:00:00`));
      const nextDayKey = getTodayDayKey(now);

      todayIsoRef.current = currentIso;
      setTodayIso(currentIso);

      setSelectedDay((curr) => (curr === prevDayKey ? nextDayKey : curr));
      setSelectedWaterDate((curr) => (curr === prevIso ? currentIso : curr));
      setNewWeightDate((curr) => (curr === prevIso ? currentIso : curr));
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(syncRolloverDate, 15000);

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1,
      0
    );
    const msToMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());
    const midnightTimeout = setTimeout(syncRolloverDate, msToMidnight);

    const handleResume = () => {
      if (document.visibilityState === 'visible') {
        syncRolloverDate();
      }
    };
    window.addEventListener('focus', syncRolloverDate);
    document.addEventListener('visibilitychange', handleResume);

    return () => {
      clearInterval(intervalId);
      clearTimeout(midnightTimeout);
      window.removeEventListener('focus', syncRolloverDate);
      document.removeEventListener('visibilitychange', handleResume);
    };
  }, [todayIso, syncRolloverDate]);

  const [customWaterAmount, setCustomWaterAmount] = useState('');
  const [selectedDrinkType, setSelectedDrinkType] = useState('water');
  const [editingWaterConfig, setEditingWaterConfig] = useState(false);

  const [activeWorkoutId, setActiveWorkoutId] = useState('wo-a');
  const [workoutMode, setWorkoutMode] = useState('live');
  const [completedSets, setCompletedSets] = useState({});
  const [autoStartTimer, setAutoStartTimer] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [isEditingWorkoutTitle, setIsEditingWorkoutTitle] = useState(false);
  const [tempWorkoutDayLabel, setTempWorkoutDayLabel] = useState('');
  const [tempWorkoutTitle, setTempWorkoutTitle] = useState('');
  const [tempWorkoutFocus, setTempWorkoutFocus] = useState('');

  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerInitial, setTimerInitial] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinishedAlert, setTimerFinishedAlert] = useState(false);
  const [timerType, setTimerType] = useState('set');
  const [timerLabel, setTimerLabel] = useState('');

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          setTimerFinishedAlert(true);
          if (soundEnabled) playTimerBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, soundEnabled]);

  const startTimer = (seconds, type = 'set', label = '') => {
    setTimerFinishedAlert(false);
    setTimerType(type);
    setTimerLabel(label);
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const adjustTimer = (delta) => {
    setTimerFinishedAlert(false);
    setTimerSeconds((prev) => Math.max(0, prev + delta));
    setTimerInitial((prev) => Math.max(15, prev + delta));
  };

  const getFoodById = (id) => data.foods.find((f) => f.id === id);

  const getMealMacros = (meal) => {
    if (!meal) return { kcal: 0, p: 0, c: 0, sugars: 0, g: 0 };
    return meal.items.reduce(
      (acc, item) => {
        const food = getFoodById(item.foodId);
        if (!food) return acc;
        return {
          kcal: acc.kcal + food.kcal * item.qty,
          p: acc.p + food.p * item.qty,
          c: acc.c + food.c * item.qty,
          sugars: acc.sugars + (Number(food.sugars) || 0) * item.qty,
          g: acc.g + food.g * item.qty,
        };
      },
      { kcal: 0, p: 0, c: 0, sugars: 0, g: 0 }
    );
  };

  const getSlotItemMacros = (rawEntry) => {
    const entry = normalizeSlotEntry(rawEntry);
    if (!entry) return { kcal: 0, p: 0, c: 0, sugars: 0, g: 0 };

    if (entry.type === 'food') {
      const food = getFoodById(entry.id);
      if (!food) return { kcal: 0, p: 0, c: 0, sugars: 0, g: 0 };
      const q = entry.qty || 1;
      return {
        kcal: food.kcal * q,
        p: food.p * q,
        c: food.c * q,
        sugars: (Number(food.sugars) || 0) * q,
        g: food.g * q,
      };
    }

    const meal = data.meals.find((m) => m.id === entry.id);
    const mMacros = getMealMacros(meal);
    const q = entry.qty || 1;
    return {
      kcal: mMacros.kcal * q,
      p: mMacros.p * q,
      c: mMacros.c * q,
      sugars: mMacros.sugars * q,
      g: mMacros.g * q,
    };
  };

  const getDayMacros = (dayKey) => {
    const plan = data.weeklyPlan[dayKey] || {};
    let totals = { kcal: 0, p: 0, c: 0, sugars: 0, g: 0 };
    MEAL_SLOTS.forEach((slot) => {
      const entries = plan[slot] || [];
      entries.forEach((rawEntry) => {
        const itemMacros = getSlotItemMacros(rawEntry);
        totals.kcal += itemMacros.kcal;
        totals.p += itemMacros.p;
        totals.c += itemMacros.c;
        totals.sugars += itemMacros.sugars;
        totals.g += itemMacros.g;
      });
    });
    return {
      kcal: Math.round(totals.kcal),
      p: Math.round(totals.p),
      c: Math.round(totals.c),
      sugars: Math.round(totals.sugars),
      g: Math.round(totals.g),
    };
  };

  // --- STATI ALIMENTI SINGOLI (CREAZIONE & MODIFICA) ---
  const [newFood, setNewFood] = useState({ name: '', baseGrams: '100', kcal: '', p: '', c: '', sugars: '', g: '' });
  const [editingFoodId, setEditingFoodId] = useState(null);

  // --- STATI PASTI ASSEMBLATI (CREAZIONE & MODIFICA) ---
  const [editingMealId, setEditingMealId] = useState(null);
  const [mealName, setMealName] = useState('');
  const [mealItems, setMealItems] = useState([]);
  const [selectedFoodToAdd, setSelectedFoodToAdd] = useState('');
  const [qtyInputMode, setQtyInputMode] = useState('portion');
  const [selectedFoodQty, setSelectedFoodQty] = useState('1');
  const [selectedFoodGrams, setSelectedFoodGrams] = useState('100');

  const [newWeight, setNewWeight] = useState('');
  const [newWeightNote, setNewWeightNote] = useState('');

  const [editingTargets, setEditingTargets] = useState(false);
  const [tempTargets, setTempTargets] = useState(data.targets);
  const [tempBodyProfile, setTempBodyProfile] = useState(data.bodyProfile || INITIAL_BODY_PROFILE);
  const [calcWeightInput, setCalcWeightInput] = useState('77.2');

  const [copyTargetDay, setCopyTargetDay] = useState('Mar');
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '3',
    reps: '10-12',
    weight: '12',
    rest: '90',
    restAfterExercise: '150',
    notes: '',
  });

  const fileInputRef = useRef(null);

  const handleSelectFoodInComposer = (newFoodId) => {
    setSelectedFoodToAdd(newFoodId);
    const f = getFoodById(newFoodId);
    const bg = extractBaseGrams(f);
    if (bg) {
      setSelectedFoodGrams(String(bg));
    } else {
      setQtyInputMode('portion');
      setSelectedFoodQty('1');
    }
  };

  const startEditFood = (food) => {
    const cleanName = String(food.name || '').replace(/\s*\(\d+(?:[.,]\d+)?\s*(?:g|gr|ml)\)\s*$/i, '').trim();
    const bg = extractBaseGrams(food);
    setEditingFoodId(food.id);
    setNewFood({
      name: cleanName || food.name,
      baseGrams: bg ? String(bg) : '',
      kcal: String(food.kcal ?? ''),
      p: String(food.p ?? ''),
      c: String(food.c ?? ''),
      sugars: String(food.sugars ?? ''),
      g: String(food.g ?? ''),
    });
    setNutritionSubTab('pantry');
    setPantryView('foods');
  };

  const cancelEditFood = () => {
    setEditingFoodId(null);
    setNewFood({ name: '', baseGrams: '100', kcal: '', p: '', c: '', sugars: '', g: '' });
  };

  const handleSaveFood = (e) => {
    e.preventDefault();
    if (!newFood.name.trim()) return;
    const rawName = newFood.name.trim();
    const parsedBaseG = parseFloat(String(newFood.baseGrams).replace(',', '.'));
    const hasGramsInName = /\(\d+(?:[.,]\d+)?\s*(?:g|gr|ml)\)/i.test(rawName);
    const formattedName =
      !hasGramsInName && !isNaN(parsedBaseG) && parsedBaseG > 0
        ? `${rawName} (${parsedBaseG}g)`
        : rawName;

    const foodPayload = {
      name: formattedName,
      baseGrams: !isNaN(parsedBaseG) && parsedBaseG > 0 ? parsedBaseG : undefined,
      kcal: Number(String(newFood.kcal).replace(',', '.')) || 0,
      p: Number(String(newFood.p).replace(',', '.')) || 0,
      c: Number(String(newFood.c).replace(',', '.')) || 0,
      sugars: Number(String(newFood.sugars).replace(',', '.')) || 0,
      g: Number(String(newFood.g).replace(',', '.')) || 0,
    };

    if (editingFoodId) {
      setData((prev) => ({
        ...prev,
        foods: prev.foods.map((f) => (f.id === editingFoodId ? { ...f, ...foodPayload } : f)),
      }));
      setEditingFoodId(null);
    } else {
      const created = {
        id: 'f-' + Date.now(),
        ...foodPayload,
      };
      setData((prev) => ({ ...prev, foods: [created, ...prev.foods] }));
    }

    setNewFood({ name: '', baseGrams: '100', kcal: '', p: '', c: '', sugars: '', g: '' });
  };

  const handleDeleteFood = (id) => {
    if (editingFoodId === id) cancelEditFood();
    setData((prev) => ({
      ...prev,
      foods: prev.foods.filter((f) => f.id !== id),
    }));
  };

  const handleAddIngredientToComposer = () => {
    const fId = selectedFoodToAdd || (data.foods[0] && data.foods[0].id);
    if (!fId) return;
    const food = getFoodById(fId);
    const baseG = extractBaseGrams(food);

    let finalQty = 1;
    if (qtyInputMode === 'grams' && baseG) {
      const gVal = parseFloat(String(selectedFoodGrams).replace(',', '.'));
      if (isNaN(gVal) || gVal <= 0) return;
      finalQty = Number((gVal / baseG).toFixed(4));
    } else {
      const pVal = parseFloat(String(selectedFoodQty).replace(',', '.'));
      if (isNaN(pVal) || pVal <= 0) return;
      finalQty = Number(pVal.toFixed(4));
    }

    setMealItems((prev) => [...prev, { foodId: fId, qty: finalQty }]);
    setSelectedFoodQty('1');
    if (baseG) setSelectedFoodGrams(String(baseG));
  };

  const handleUpdateMealItemQty = (index, nextQty) => {
    const parsed = parseFloat(String(nextQty).replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return;
    setMealItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, qty: Number(parsed.toFixed(4)) } : item))
    );
  };

  const handleUpdateMealItemGrams = (index, nextGramsRaw, baseGrams) => {
    if (!baseGrams || baseGrams <= 0) return;
    const parsedGrams = parseFloat(String(nextGramsRaw).replace(',', '.'));
    if (isNaN(parsedGrams) || parsedGrams <= 0) return;
    const nextQty = Number((parsedGrams / baseGrams).toFixed(4));
    setMealItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, qty: nextQty } : item))
    );
  };

  const startEditComposedMeal = (meal) => {
    setEditingMealId(meal.id);
    setMealName(meal.name);
    setMealItems(meal.items.map((it) => ({ foodId: it.foodId, qty: it.qty })));
    setNutritionSubTab('pantry');
    setPantryView('composer');
  };

  const cancelEditComposedMeal = () => {
    setEditingMealId(null);
    setMealName('');
    setMealItems([]);
  };

  const handleSaveComposedMeal = (e) => {
    e.preventDefault();
    if (!mealName.trim() || mealItems.length === 0) return;

    if (editingMealId) {
      setData((prev) => ({
        ...prev,
        meals: prev.meals.map((m) =>
          m.id === editingMealId ? { ...m, name: mealName.trim(), items: mealItems } : m
        ),
      }));
      setEditingMealId(null);
      setMealName('');
      setMealItems([]);
    } else {
      const createdMeal = {
        id: 'm-' + Date.now(),
        name: mealName.trim(),
        items: mealItems,
      };
      setData((prev) => ({ ...prev, meals: [createdMeal, ...prev.meals] }));
      setMealName('');
      setMealItems([]);
      setNutritionSubTab('planner');
    }
  };

  const assignEntryToSlot = (day, slot, encodedValue) => {
    if (!encodedValue) return;
    const sepIdx = encodedValue.indexOf(':');
    let entryObj;
    if (sepIdx !== -1) {
      const type = encodedValue.slice(0, sepIdx) === 'food' ? 'food' : 'meal';
      const id = encodedValue.slice(sepIdx + 1);
      entryObj = { type, id, qty: 1 };
    } else {
      entryObj = { type: 'meal', id: encodedValue, qty: 1 };
    }

    setData((prev) => {
      const currentSlot = prev.weeklyPlan[day]?.[slot] || [];
      return {
        ...prev,
        weeklyPlan: {
          ...prev.weeklyPlan,
          [day]: {
            ...prev.weeklyPlan[day],
            [slot]: [...currentSlot, entryObj],
          },
        },
      };
    });
  };

  const updateSlotEntryQty = (day, slot, indexToUpdate, nextQtyRaw) => {
    const parsed = parseFloat(String(nextQtyRaw).replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return;
    const cleanQty = Number(parsed.toFixed(4));

    setData((prev) => {
      const currentSlot = prev.weeklyPlan[day]?.[slot] || [];
      const updatedSlot = currentSlot.map((rawEntry, idx) => {
        if (idx !== indexToUpdate) return rawEntry;
        const norm = normalizeSlotEntry(rawEntry);
        if (!norm) return rawEntry;
        return { ...norm, qty: cleanQty };
      });
      return {
        ...prev,
        weeklyPlan: {
          ...prev.weeklyPlan,
          [day]: {
            ...prev.weeklyPlan[day],
            [slot]: updatedSlot,
          },
        },
      };
    });
  };

  const updateSlotEntryGrams = (day, slot, indexToUpdate, nextGramsRaw, baseGrams) => {
    if (!baseGrams || baseGrams <= 0) return;
    const parsedGrams = parseFloat(String(nextGramsRaw).replace(',', '.'));
    if (isNaN(parsedGrams) || parsedGrams <= 0) return;
    const cleanQty = Number((parsedGrams / baseGrams).toFixed(4));
    updateSlotEntryQty(day, slot, indexToUpdate, cleanQty);
  };

  const removeMealFromSlot = (day, slot, indexToRemove) => {
    setData((prev) => {
      const currentSlot = prev.weeklyPlan[day]?.[slot] || [];
      return {
        ...prev,
        weeklyPlan: {
          ...prev.weeklyPlan,
          [day]: {
            ...prev.weeklyPlan[day],
            [slot]: currentSlot.filter((_, idx) => idx !== indexToRemove),
          },
        },
      };
    });
  };

  const handleCopyDayPlan = () => {
    if (copyTargetDay === selectedDay) return;
    setData((prev) => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [copyTargetDay]: JSON.parse(JSON.stringify(prev.weeklyPlan[selectedDay])),
      },
    }));
  };

  const handleAddWeight = (e) => {
    e.preventDefault();
    const val = parseFloat(newWeight.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;
    const fixedWeight = Number(val.toFixed(1));
    const entry = {
      id: 'w-' + Date.now(),
      date: newWeightDate,
      weight: fixedWeight,
      note: newWeightNote.trim(),
    };
    setData((prev) => {
      const nextWeights = [...prev.weights, entry].sort((a, b) => a.date.localeCompare(b.date));
      const newestWeight = nextWeights[nextWeights.length - 1]?.weight ?? fixedWeight;
      let nextTargets = prev.targets;
      if (prev.bodyProfile?.autoSyncWeight) {
        const calc = calculateSmartNutritionTargets(newestWeight, prev.bodyProfile);
        nextTargets = { kcal: calc.kcal, p: calc.p, c: calc.c, g: calc.g };
      }
      return {
        ...prev,
        weights: nextWeights,
        targets: nextTargets,
      };
    });
    setNewWeight('');
    setNewWeightNote('');
  };

  const handleDeleteWeight = (id) => {
    setData((prev) => ({
      ...prev,
      weights: prev.weights.filter((w) => w.id !== id),
    }));
  };

  const handleAddWater = (rawMl, containerLabel = 'Aggiunta rapida', targetDateOverride = null) => {
    const ml = Math.round(Number(rawMl));
    if (isNaN(ml) || ml <= 0) return;
    const drinkObj = DRINK_TYPES.find((d) => d.id === selectedDrinkType) || DRINK_TYPES[0];
    const effectiveMl = Math.round(ml * drinkObj.factor);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logDate = targetDateOverride || selectedWaterDate;

    const entry = {
      id: 'wat-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      date: logDate,
      time: nowTime,
      rawAmount: ml,
      amount: effectiveMl,
      drinkLabel: drinkObj.label,
      containerLabel,
    };

    setData((prev) => ({
      ...prev,
      waterLogs: [entry, ...(prev.waterLogs || [])],
    }));
  };

  const handleDeleteWaterLog = (id) => {
    setData((prev) => ({
      ...prev,
      waterLogs: (prev.waterLogs || []).filter((item) => item.id !== id),
    }));
  };

  const toggleWorkoutDayForWater = (dateStr) => {
    setData((prev) => {
      const currentMap = prev.waterSettings?.workoutDates || {};
      const nextVal = !currentMap[dateStr];
      return {
        ...prev,
        waterSettings: {
          ...prev.waterSettings,
          workoutDates: {
            ...currentMap,
            [dateStr]: nextVal,
          },
        },
      };
    });
  };

  const updateWaterSettings = (patch) => {
    setData((prev) => ({
      ...prev,
      waterSettings: {
        ...prev.waterSettings,
        ...patch,
      },
    }));
  };

  const shiftSelectedWaterWeek = (deltaWeeks) => {
    const [y, m, dNum] = selectedWaterDate.split('-').map(Number);
    const shifted = new Date(y, m - 1, dNum + deltaWeeks * 7);
    setSelectedWaterDate(getLocalIsoDate(shifted));
  };

  const toggleSetCompleted = (exercise, setIndex) => {
    const key = `${exercise.id}-${setIndex}`;
    const nextState = !completedSets[key];
    const nextCompleted = { ...completedSets, [key]: nextState };
    setCompletedSets(nextCompleted);

    if (nextState) {
      const currentToday = getTodayIso();
      setData((prev) => {
        if (prev.waterSettings?.workoutDates?.[currentToday]) return prev;
        return {
          ...prev,
          waterSettings: {
            ...prev.waterSettings,
            workoutDates: {
              ...(prev.waterSettings?.workoutDates || {}),
              [currentToday]: true,
            },
          },
        };
      });
    }

    if (nextState && autoStartTimer) {
      let allDone = true;
      for (let i = 0; i < exercise.sets; i++) {
        if (!nextCompleted[`${exercise.id}-${i}`]) {
          allDone = false;
          break;
        }
      }
      if (allDone) {
        const exRest = getExerciseTransitionRest(exercise, data.betweenExerciseRest || 180);
        startTimer(exRest, 'exercise', 'Verso es. succ.');
      } else {
        const transitionIdx = Math.min(setIndex, Math.max(0, exercise.sets - 2));
        const specificRest = getSetRestSeconds(exercise, transitionIdx);
        startTimer(specificRest, 'set', `S${transitionIdx + 1}→S${transitionIdx + 2}`);
      }
    }
  };

  const updateWorkoutMetadata = (workoutId, patch) => {
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) =>
        wo.id === workoutId ? { ...wo, ...patch } : wo
      ),
    }));
  };

  const startInlineTitleEdit = () => {
    if (!currentWorkout) return;
    setTempWorkoutDayLabel(currentWorkout.dayLabel);
    setTempWorkoutTitle(currentWorkout.title);
    setTempWorkoutFocus(currentWorkout.focus);
    setIsEditingWorkoutTitle(true);
  };

  const saveInlineTitleEdit = (e) => {
    if (e) e.preventDefault();
    if (!currentWorkout) return;
    updateWorkoutMetadata(currentWorkout.id, {
      dayLabel: tempWorkoutDayLabel.trim() || currentWorkout.dayLabel,
      title: tempWorkoutTitle.trim() || currentWorkout.title,
      focus: tempWorkoutFocus.trim(),
    });
    setIsEditingWorkoutTitle(false);
  };

  const updateExerciseWeight = (workoutId, exerciseId, delta) => {
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) => {
        if (wo.id !== workoutId) return wo;
        return {
          ...wo,
          exercises: wo.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, weight: Math.max(0, Number((ex.weight + delta).toFixed(1))) } : ex
          ),
        };
      }),
    }));
  };

  const updateExerciseSetsCount = (workoutId, exerciseId, newSetsRaw) => {
    const newSets = Math.max(1, Math.min(12, parseInt(newSetsRaw, 10) || 1));
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) => {
        if (wo.id !== workoutId) return wo;
        return {
          ...wo,
          exercises: wo.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            const transitions = Math.max(0, newSets - 1);
            const currentRests = Array.isArray(ex.setRests) ? ex.setRests : [];
            const nextSetRests = Array.from({ length: transitions }, (_, idx) =>
              typeof currentRests[idx] === 'number' ? currentRests[idx] : ex.rest || 90
            );
            return {
              ...ex,
              sets: newSets,
              setRests: nextSetRests,
            };
          }),
        };
      }),
    }));
  };

  const updateExerciseBaseRest = (workoutId, exerciseId, newRestRaw) => {
    const newRest = Math.max(0, parseInt(newRestRaw, 10) || 0);
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) => {
        if (wo.id !== workoutId) return wo;
        return {
          ...wo,
          exercises: wo.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            const transitions = Math.max(0, ex.sets - 1);
            const nextSetRests = Array.from({ length: transitions }, () => newRest);
            return {
              ...ex,
              rest: newRest,
              setRests: nextSetRests,
            };
          }),
        };
      }),
    }));
  };

  const updateExerciseSpecificSetRest = (workoutId, exerciseId, transitionIdx, secondsRaw) => {
    const seconds = Math.max(0, parseInt(secondsRaw, 10) || 0);
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) => {
        if (wo.id !== workoutId) return wo;
        return {
          ...wo,
          exercises: wo.exercises.map((ex) => {
            if (ex.id !== exerciseId) return ex;
            const transitions = Math.max(0, ex.sets - 1);
            const nextSetRests = Array.from({ length: transitions }, (_, idx) => {
              if (idx === transitionIdx) return seconds;
              return getSetRestSeconds(ex, idx);
            });
            return {
              ...ex,
              setRests: nextSetRests,
            };
          }),
        };
      }),
    }));
  };

  const updateExerciseAfterRest = (workoutId, exerciseId, secondsRaw) => {
    const seconds = Math.max(0, parseInt(secondsRaw, 10) || 0);
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) => {
        if (wo.id !== workoutId) return wo;
        return {
          ...wo,
          exercises: wo.exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, restAfterExercise: seconds } : ex
          ),
        };
      }),
    }));
  };

  const applyGlobalBetweenRestToAll = (secondsRaw) => {
    const seconds = Math.max(0, parseInt(secondsRaw, 10) || 180);
    setData((prev) => ({
      ...prev,
      betweenExerciseRest: seconds,
      workouts: prev.workouts.map((wo) =>
        wo.id === activeWorkoutId
          ? {
              ...wo,
              exercises: wo.exercises.map((ex) => ({ ...ex, restAfterExercise: seconds })),
            }
          : wo
      ),
    }));
  };

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!newExercise.name.trim()) return;
    const setsCount = Math.max(1, parseInt(newExercise.sets, 10) || 3);
    const baseRest = Math.max(0, parseInt(newExercise.rest, 10) || 90);
    const afterExRest = Math.max(0, parseInt(newExercise.restAfterExercise, 10) || 150);

    const created = {
      id: 'ex-' + Date.now(),
      name: newExercise.name.trim(),
      sets: setsCount,
      reps: newExercise.reps.trim() || '10',
      weight: Math.max(0, parseFloat(String(newExercise.weight).replace(',', '.')) || 0),
      rest: baseRest,
      setRests: Array.from({ length: Math.max(0, setsCount - 1) }, () => baseRest),
      restAfterExercise: afterExRest,
      notes: newExercise.notes.trim(),
    };
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) =>
        wo.id === activeWorkoutId ? { ...wo, exercises: [...wo.exercises, created] } : wo
      ),
    }));
    setNewExercise({
      name: '',
      sets: '3',
      reps: '10-12',
      weight: '12',
      rest: '90',
      restAfterExercise: '150',
      notes: '',
    });
  };

  const handleDeleteExercise = (exerciseId) => {
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) =>
        wo.id === activeWorkoutId
          ? { ...wo, exercises: wo.exercises.filter((ex) => ex.id !== exerciseId) }
          : wo
      ),
    }));
  };

  const handleResetNutritionSubPage = () => {
    if (nutritionSubTab === 'planner') {
      if (!window.confirm('Vuoi azzerare a 0 tutti i pasti pianificati dell’intera settimana?')) return;
      setData((prev) => ({
        ...prev,
        weeklyPlan: JSON.parse(JSON.stringify(EMPTY_WEEKLY_PLAN)),
      }));
    } else if (nutritionSubTab === 'pantry') {
      if (pantryView === 'composer') {
        if (!window.confirm('Vuoi eliminare tutti i pasti composti salvati (portandoli a 0)?')) return;
        setData((prev) => ({
          ...prev,
          meals: [],
          weeklyPlan: JSON.parse(JSON.stringify(EMPTY_WEEKLY_PLAN)),
        }));
        cancelEditComposedMeal();
      } else {
        if (!window.confirm('Vuoi azzerare a 0 tutto il database alimenti?')) return;
        setData((prev) => ({
          ...prev,
          foods: [],
        }));
        cancelEditFood();
      }
    } else if (nutritionSubTab === 'water') {
      if (!window.confirm(`Vuoi azzerare a 0 tutte le bevute registrate per il ${selectedWaterDate}?`)) return;
      setData((prev) => ({
        ...prev,
        waterLogs: (prev.waterLogs || []).filter((w) => w.date !== selectedWaterDate),
      }));
    } else if (nutritionSubTab === 'weight') {
      if (!window.confirm('Vuoi cancellare tutte le pesate registrate e portare lo storico a 0?')) return;
      setData((prev) => ({
        ...prev,
        weights: [],
      }));
      setNewWeight('');
      setNewWeightNote('');
    }
  };

  const handleResetWorkoutPage = () => {
    if (!currentWorkout) return;
    if (!window.confirm(`Vuoi azzerare a 0 spunte, carichi (kg) e timer per "${currentWorkout.dayLabel}"?`)) return;
    setCompletedSets({});
    setTimerRunning(false);
    setTimerFinishedAlert(false);
    setTimerSeconds(0);
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) =>
        wo.id === activeWorkoutId
          ? {
              ...wo,
              exercises: wo.exercises.map((ex) => ({ ...ex, weight: 0 })),
            }
          : wo
      ),
    }));
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittrack-backup-${getTodayIso()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setData(normalizeData(parsed));
      } catch (err) {
        alert('File JSON non valido.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (!window.confirm('Vuoi ripristinare i dati dimostrativi iniziali?')) return;
    setData((prev) =>
      normalizeData({
        foods: INITIAL_FOODS,
        meals: INITIAL_MEALS,
        weeklyPlan: INITIAL_WEEKLY_PLAN,
        weights: INITIAL_WEIGHTS,
        waterLogs: [],
        waterSettings: INITIAL_WATER_SETTINGS,
        bodyProfile: INITIAL_BODY_PROFILE,
        workouts: INITIAL_WORKOUTS,
        targets: INITIAL_TARGETS,
        theme: prev.theme,
        layout: INITIAL_LAYOUT,
        betweenExerciseRest: 180,
      })
    );
    setCompletedSets({});
    cancelEditFood();
    cancelEditComposedMeal();
  };

  const dayMacros = getDayMacros(selectedDay);
  const currentWorkout = data.workouts.find((w) => w.id === activeWorkoutId) || data.workouts[0];

  const sortedWeights = [...data.weights].sort((a, b) => a.date.localeCompare(b.date));
  const latestWeight = sortedWeights[sortedWeights.length - 1];
  const prevWeight = sortedWeights[sortedWeights.length - 2];
  const firstWeight = sortedWeights[0];
  const weightDeltaLast =
    latestWeight && prevWeight ? (latestWeight.weight - prevWeight.weight).toFixed(1) : null;
  const weightDeltaTotal =
    latestWeight && firstWeight ? (latestWeight.weight - firstWeight.weight).toFixed(1) : null;

  const liveCalcPreview = calculateSmartNutritionTargets(
    parseFloat(String(calcWeightInput).replace(',', '.')) || (latestWeight ? latestWeight.weight : 75),
    tempBodyProfile
  );

  const getWaterTargetForDate = (dateStr) => {
    const ws = data.waterSettings || INITIAL_WATER_SETTINGS;
    if (!ws.autoCalculate) {
      return ws.manualTargetMl || 2500;
    }
    const baseKg = latestWeight ? latestWeight.weight : 75;
    const baseMl = Math.round((baseKg * (ws.mlPerKg || 35)) / 50) * 50;
    const isWoDay = !!ws.workoutDates?.[dateStr];
    return baseMl + (isWoDay ? ws.workoutBonusMl || 600 : 0);
  };

  const getWaterTotalForDate = (dateStr) => {
    return (data.waterLogs || [])
      .filter((entry) => entry.date === dateStr)
      .reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
  };

  // --- DATI REALI PER DASHBOARD "OGGI" ---
  const realTodayDayKey = getTodayDayKey(new Date(`${todayIso}T12:00:00`));
  const todayRealMacros = getDayMacros(realTodayDayKey);
  const todayKcalDiff = data.targets.kcal - todayRealMacros.kcal;
  const todayKcalPct = Math.min(100, Math.round((todayRealMacros.kcal / (data.targets.kcal || 1)) * 100));

  const todayRealWaterTotal = getWaterTotalForDate(todayIso);
  const todayRealWaterTarget = getWaterTargetForDate(todayIso);
  const todayRealWaterPct = Math.min(100, Math.round((todayRealWaterTotal / (todayRealWaterTarget || 1)) * 100));

  const selectedDateWaterLogs = (data.waterLogs || []).filter((entry) => entry.date === selectedWaterDate);
  const selectedDateWaterTotal = selectedDateWaterLogs.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const selectedDateWaterTarget = getWaterTargetForDate(selectedWaterDate);
  const selectedDateIsWorkout = !!data.waterSettings?.workoutDates?.[selectedWaterDate];
  const waterPercent = Math.min(100, Math.round((selectedDateWaterTotal / (selectedDateWaterTarget || 1)) * 100));
  const waterRemainingMl = Math.max(0, selectedDateWaterTarget - selectedDateWaterTotal);

  const getSmartHydrationAdvice = () => {
    if (selectedDateWaterTotal >= selectedDateWaterTarget) {
      return {
        tone: 'success',
        text: 'Obiettivo idratazione raggiunto! Ottimo supporto per recupero muscolare, digestione e concentrazione.',
      };
    }
    if (selectedWaterDate !== todayIso) {
      return {
        tone: 'neutral',
        text: `Giornata selezionata (${selectedWaterDate}): mancavano ${waterRemainingMl} ml per completare l'obiettivo di ${selectedDateWaterTarget} ml.`,
      };
    }
    const nowHour = new Date().getHours();
    if (nowHour >= 21) {
      return {
        tone: 'warn',
        text: `Mancano ${waterRemainingMl} ml. È sera tardi: bevi a piccoli sorsi per non interrompere il sonno.`,
      };
    }
    const expectedRatio = Math.min(1, Math.max(0, (nowHour - 8) / 13));
    const expectedMl = Math.round(selectedDateWaterTarget * expectedRatio);
    const hoursLeft = Math.max(1, 21 - nowHour);
    const mlPerHour = Math.round(waterRemainingMl / hoursLeft);

    if (selectedDateWaterTotal + 250 < expectedMl) {
      return {
        tone: 'warn',
        text: `Sei un po' indietro rispetto all'orario (~${expectedMl} ml attesi). Bevi circa ${mlPerHour} ml/ora entro le 21:00 per recuperare.`,
      };
    }
    return {
      tone: 'good',
      text: `Ottimo ritmo! Ti bastano circa ${mlPerHour} ml ogni ora fino alle 21:00 per raggiungere i ${selectedDateWaterTarget} ml.`,
    };
  };

  const currentWeekWaterDays = getWeekDaysFromDate(selectedWaterDate).map((d) => {
    const total = getWaterTotalForDate(d.iso);
    const target = getWaterTargetForDate(d.iso);
    return {
      ...d,
      total,
      target,
      pct: Math.min(100, Math.round((total / (target || 1)) * 100)),
    };
  });

  const isViewingCurrentWeek = currentWeekWaterDays.some((d) => d.iso === todayIso);
  const weekRangeLabel = `${currentWeekWaterDays[0].dayNum} ${currentWeekWaterDays[0].monthShort} – ${currentWeekWaterDays[6].dayNum} ${currentWeekWaterDays[6].monthShort}`;

  const totalSetsInWorkout = currentWorkout
    ? currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0)
    : 0;
  const completedSetsInWorkout = currentWorkout
    ? currentWorkout.exercises.reduce((sum, ex) => {
        let count = 0;
        for (let i = 0; i < ex.sets; i++) {
          if (completedSets[`${ex.id}-${i}`]) count++;
        }
        return sum + count;
      }, 0)
    : 0;

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- FILTRI DI RICERCA IN "PASTI & ALIMENTI" ---
  const normalizedSearch = pantrySearchQuery.trim().toLowerCase();

  const filteredMeals = normalizedSearch
    ? data.meals.filter((meal) => {
        if (meal.name.toLowerCase().includes(normalizedSearch)) return true;
        return meal.items.some((it) => {
          const f = getFoodById(it.foodId);
          return f && f.name.toLowerCase().includes(normalizedSearch);
        });
      })
    : data.meals;

  const filteredFoods = normalizedSearch
    ? data.foods.filter((food) => food.name.toLowerCase().includes(normalizedSearch))
    : data.foods;

  const cCard = isLight
    ? 'bg-white border-slate-200 shadow-sm'
    : 'bg-slate-900/95 border-slate-800 shadow-xl shadow-black/30';

  const cInner = isLight
    ? 'bg-slate-50 border-slate-200'
    : 'bg-slate-800/75 border-slate-700/75';

  const cInput = isLight
    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-base sm:text-sm'
    : 'bg-slate-950 border-slate-700 text-white placeholder:text-slate-400 text-base sm:text-sm';

  const cOption = isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-white';

  const cTextPrimary = isLight ? 'text-slate-900' : 'text-white';
  const cTextSecondary = isLight ? 'text-slate-600' : 'text-slate-300';

  const cEmerald = isLight ? 'text-emerald-600' : 'text-emerald-400';
  const cIndigo = isLight ? 'text-indigo-600' : 'text-indigo-400';
  const cAmber = isLight ? 'text-amber-600' : 'text-amber-400';
  const cSky = isLight ? 'text-sky-600' : 'text-sky-400';
  const cRose = isLight ? 'text-rose-600' : 'text-rose-400';

  const renderMacrosPieChart = () => {
    const pKcal = dayMacros.p * 4;
    const cKcal = dayMacros.c * 4;
    const gKcal = dayMacros.g * 9;
    const totalMacroKcal = pKcal + cKcal + gKcal;

    const hasData = totalMacroKcal > 0;
    const pPct = hasData ? Math.round((pKcal / totalMacroKcal) * 100) : 0;
    const gPct = hasData ? Math.round((gKcal / totalMacroKcal) * 100) : 0;
    const cPct = hasData ? Math.max(0, 100 - pPct - gPct) : 0;

    const radius = 38;
    const circumference = 2 * Math.PI * radius;

    const pLen = hasData ? (pKcal / totalMacroKcal) * circumference : 0;
    const cLen = hasData ? (cKcal / totalMacroKcal) * circumference : 0;
    const gLen = hasData ? (gKcal / totalMacroKcal) * circumference : 0;

    const pOffset = 0;
    const cOffset = -pLen;
    const gOffset = -(pLen + cLen);

    const trackStroke = isLight ? '#e2e8f0' : '#1e293b';

    return (
      <div className={`${cInner} rounded-xl p-3 border flex items-center gap-3.5`}>
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 overflow-visible">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={trackStroke}
              strokeWidth="12"
            />
            {hasData && (
              <>
                {pLen > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="12"
                    strokeDasharray={`${pLen} ${circumference}`}
                    strokeDashoffset={pOffset}
                    className="transition-all duration-300"
                  />
                )}
                {cLen > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="12"
                    strokeDasharray={`${cLen} ${circumference}`}
                    strokeDashoffset={cOffset}
                    className="transition-all duration-300"
                  />
                )}
                {gLen > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="12"
                    strokeDasharray={`${gLen} ${circumference}`}
                    strokeDashoffset={gOffset}
                    className="transition-all duration-300"
                  />
                )}
              </>
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className={`text-xs font-extrabold leading-none ${cTextPrimary}`}>
              {dayMacros.kcal}
            </span>
            <span className={`text-[9px] font-semibold uppercase tracking-wider mt-0.5 ${cTextSecondary}`}>
              kcal
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className={`text-[11px] font-semibold flex items-center gap-1 ${cTextSecondary}`}>
            <PieChart className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Ripartizione Macro</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                <span className={cTextSecondary}>Proteine</span>
              </span>
              <span className={`font-bold ${cSky} shrink-0`}>{pPct}%</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span className={cTextSecondary}>Carbo</span>
              </span>
              <span className={`font-bold ${cAmber} shrink-0`}>{cPct}%</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                <span className={cTextSecondary}>Grassi</span>
              </span>
              <span className={`font-bold ${cRose} shrink-0`}>{gPct}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReorderWrapper = (groupKey, sectionId, label, children, extraClass = '') => {
    const list = data.layout?.[groupKey] || INITIAL_LAYOUT[groupKey];
    const index = list.indexOf(sectionId);
    const isFirst = index <= 0;
    const isLast = index === list.length - 1;

    return (
      <div
        key={sectionId}
        className={`relative transition-all ${extraClass} ${
          reorderMode
            ? isLight
              ? 'ring-2 ring-amber-400/80 rounded-2xl p-1.5 bg-amber-50/60 backdrop-blur-sm'
              : 'ring-2 ring-amber-400/60 rounded-2xl p-1.5 bg-amber-500/15 backdrop-blur-sm'
            : ''
        }`}
      >
        {reorderMode && (
          <div
            className={`mb-2 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-semibold border ${
              isLight
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-900 border-amber-400/50 text-amber-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5" />
              {label}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={isFirst}
                onClick={() => moveSection(groupKey, sectionId, -1)}
                title="Sposta su / prima"
                className={`p-1.5 rounded-lg border transition disabled:opacity-30 ${
                  isLight
                    ? 'bg-white border-amber-300 hover:bg-amber-200 text-amber-900'
                    : 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-white'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={() => moveSection(groupKey, sectionId, 1)}
                title="Sposta giù / dopo"
                className={`p-1.5 rounded-lg border transition disabled:opacity-30 ${
                  isLight
                    ? 'bg-white border-amber-300 hover:bg-amber-200 text-amber-900'
                    : 'bg-slate-800 border-slate-600 hover:bg-slate-700 text-white'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
        {children}
      </div>
    );
  };

  const renderWeightChart = (height = 140) => {
    if (sortedWeights.length < 2) {
      return (
        <div
          className={`h-32 flex items-center justify-center text-center px-4 text-xs sm:text-sm border border-dashed rounded-xl ${
            isLight ? 'text-slate-500 border-slate-300' : 'text-slate-300 border-slate-700'
          }`}
        >
          Inserisci almeno 2 pesate per visualizzare il grafico dell&apos;andamento.
        </div>
      );
    }
    const vals = sortedWeights.map((w) => w.weight);
    const minVal = Math.min(...vals) - 0.5;
    const maxVal = Math.max(...vals) + 0.5;
    const range = maxVal - minVal || 1;

    const width = 500;
    const padX = 28;
    const padY = 22;
    const usableW = width - padX * 2;
    const usableH = height - padY * 2;

    const points = sortedWeights.map((w, idx) => {
      const x = padX + (idx / (sortedWeights.length - 1)) * usableW;
      const y = padY + usableH - ((w.weight - minVal) / range) * usableH;
      return { x, y, ...w };
    });

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
    const areaPoints = `${points[0].x},${height - padY} ${polylinePoints} ${
      points[points.length - 1].x
    },${height - padY}`;

    const gridColor = isLight ? '#cbd5e1' : '#334155';
    const dotFill = isLight ? '#ffffff' : '#0f172a';
    const labelColor = isLight ? '#0f172a' : '#ffffff';
    const dateColor = isLight ? '#475569' : '#cbd5e1';

    return (
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke={gridColor} strokeDasharray="4 4" />
          <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke={gridColor} strokeDasharray="4 4" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke={gridColor} />
          <polygon points={areaPoints} fill="url(#weightGrad)" />
          <polyline fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={polylinePoints} />
          {points.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="4.5" fill={dotFill} stroke="#34d399" strokeWidth="2.5" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill={labelColor} fontSize="11" fontWeight="700">
                {p.weight}
              </text>
              <text x={p.x} y={height - 4} textAnchor="middle" fill={dateColor} fontSize="10" fontWeight="500">
                {p.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // --- BLOCCHI PER ALIMENTAZIONE ---
  const kcalPct = Math.min(100, Math.round((dayMacros.kcal / (data.targets.kcal || 1)) * 100));

  const plannerSections = {
    summaryCard: renderReorderWrapper(
      'planner',
      'summaryCard',
      'Riepilogo Giorno & Grafico Macro',
      <div className={`${cCard} border rounded-2xl p-3.5 sm:p-4 space-y-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {DAYS.map((d) => {
              const m = getDayMacros(d);
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`py-2 px-1 sm:px-3.5 rounded-xl text-xs font-semibold flex flex-col items-center border transition ${
                    selectedDay === d
                      ? `bg-emerald-500/20 border-emerald-400 ${cEmerald}`
                      : `${cInner} ${cTextSecondary}`
                  }`}
                >
                  <span>{d}</span>
                  <span className="text-[10px] mt-0.5 font-medium">{m.kcal}</span>
                </button>
              );
            })}
          </div>

          <div className={`flex items-center justify-between sm:justify-start gap-2 ${cInner} p-2 rounded-xl border`}>
            <span className={`text-xs ${cTextSecondary} pl-1`}>Copia su:</span>
            <select
              value={copyTargetDay}
              onChange={(e) => setCopyTargetDay(e.target.value)}
              className={`${cInput} text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none`}
            >
              {DAYS.filter((d) => d !== selectedDay).map((d) => (
                <option key={d} value={d} className={cOption}>
                  {FULL_DAYS[d]}
                </option>
              ))}
            </select>
            <button
              onClick={handleCopyDayPlan}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 ${cEmerald} text-xs font-semibold transition`}
            >
              <Copy className="w-3.5 h-3.5" /> Copia
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-3 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/80'}`}>
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className={`${cInner} rounded-xl p-3 border flex flex-col justify-between`}>
              <div>
                <div className={`text-[11px] sm:text-xs ${cTextSecondary}`}>Calorie Totali</div>
                <div className={`text-base sm:text-lg font-bold ${cEmerald} mt-0.5`}>
                  {dayMacros.kcal}{' '}
                  <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.kcal}</span>
                </div>
              </div>
              <div className="mt-2 space-y-1">
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${kcalPct}%` }}
                  />
                </div>
                <div className={`text-[10px] ${cTextSecondary} flex justify-between`}>
                  <span>{kcalPct}% target</span>
                  {data.bodyProfile?.heightCm && (
                    <span>{data.bodyProfile.heightCm}cm</span>
                  )}
                </div>
              </div>
            </div>

            <div className={`${cInner} rounded-xl p-3 border flex flex-col justify-between`}>
              <div>
                <div className={`text-[11px] sm:text-xs ${cTextSecondary}`}>Proteine</div>
                <div className={`text-base sm:text-lg font-bold ${cSky} mt-0.5`}>
                  {dayMacros.p}g <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.p}g</span>
                </div>
              </div>
              <div className="mt-2">
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                  <div
                    className="h-full bg-sky-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((dayMacros.p / (data.targets.p || 1)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className={`${cInner} rounded-xl p-3 border flex flex-col justify-between`}>
              <div>
                <div className={`text-[11px] sm:text-xs ${cTextSecondary}`}>Carboidrati</div>
                <div className={`text-base sm:text-lg font-bold ${cAmber} mt-0.5`}>
                  {dayMacros.c}g <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.c}g</span>
                </div>
                <div className={`text-[10px] sm:text-[11px] ${cTextSecondary} mt-0.5`}>
                  zuccheri: <span className="font-semibold">{dayMacros.sugars}g</span>
                </div>
              </div>
              <div className="mt-2">
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((dayMacros.c / (data.targets.c || 1)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            <div className={`${cInner} rounded-xl p-3 border flex flex-col justify-between`}>
              <div>
                <div className={`text-[11px] sm:text-xs ${cTextSecondary}`}>Grassi</div>
                <div className={`text-base sm:text-lg font-bold ${cRose} mt-0.5`}>
                  {dayMacros.g}g <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.g}g</span>
                </div>
              </div>
              <div className="mt-2">
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                  <div
                    className="h-full bg-rose-400 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.round((dayMacros.g / (data.targets.g || 1)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            {renderMacrosPieChart()}
          </div>
        </div>
      </div>
    ),

    mealSlotsGrid: renderReorderWrapper(
      'planner',
      'mealSlotsGrid',
      'Slot Pasti Giornalieri',
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {MEAL_SLOTS.map((slot) => {
          const assignedEntries = data.weeklyPlan[selectedDay]?.[slot] || [];
          return (
            <div
              key={slot}
              className={`${cCard} border rounded-2xl p-4 flex flex-col justify-between space-y-3`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold text-sm sm:text-base ${cTextPrimary}`}>{slot}</h4>
                  <span className={`text-xs ${cTextSecondary}`}>
                    {assignedEntries.length} {assignedEntries.length === 1 ? 'voce' : 'voci'}
                  </span>
                </div>

                {assignedEntries.length === 0 ? (
                  <p className={`text-xs ${cTextSecondary} italic py-3 text-center border border-dashed ${isLight ? 'border-slate-300' : 'border-slate-700'} rounded-xl`}>
                    Nessun pasto o cibo assegnato a {slot.toLowerCase()}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assignedEntries.map((rawEntry, idx) => {
                      const entry = normalizeSlotEntry(rawEntry);
                      if (!entry) return null;

                      if (entry.type === 'food') {
                        const food = getFoodById(entry.id);
                        if (!food) return null;
                        const q = entry.qty || 1;
                        const baseGrams = extractBaseGrams(food);
                        const currentGrams = baseGrams ? Math.round(q * baseGrams) : null;
                        const macros = {
                          kcal: food.kcal * q,
                          p: food.p * q,
                          c: food.c * q,
                          sugars: (Number(food.sugars) || 0) * q,
                          g: food.g * q,
                        };

                        return (
                          <div
                            key={`food-${entry.id}-${idx}`}
                            className={`${cInner} border rounded-xl p-3 space-y-2`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-500/20 ${cSky}`}>
                                    Singolo
                                  </span>
                                  <span className={`font-medium text-sm ${cTextPrimary} leading-snug`}>
                                    {food.name}
                                  </span>
                                </div>
                                <div className={`text-[11px] ${cTextSecondary} mt-1 flex flex-wrap gap-2`}>
                                  <span className={`${cEmerald} font-semibold`}>{Math.round(macros.kcal)} kcal</span>
                                  <span>• P: {Math.round(macros.p)}g</span>
                                  <span>
                                    • C: {Math.round(macros.c)}g
                                    {macros.sugars > 0 ? ` (zucch. ${Math.round(macros.sugars)}g)` : ''}
                                  </span>
                                  <span>• G: {Math.round(macros.g)}g</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeMealFromSlot(selectedDay, slot, idx)}
                                className={`p-1.5 ${cTextSecondary} hover:text-rose-400 rounded-lg transition shrink-0`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/70'} flex flex-wrap items-center justify-between gap-2 text-xs`}>
                              {baseGrams ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    step="1"
                                    min="1"
                                    value={currentGrams}
                                    onChange={(e) =>
                                      updateSlotEntryGrams(selectedDay, slot, idx, e.target.value, baseGrams)
                                    }
                                    aria-label="Grammi"
                                    className={`w-16 ${cInput} border rounded-md px-1.5 py-0.5 text-center font-bold text-xs focus:outline-none focus:border-sky-400`}
                                  />
                                  <span className={`text-[11px] font-semibold ${cSky}`}>g</span>
                                </div>
                              ) : (
                                <span className={`text-[11px] ${cTextSecondary}`}>Dose:</span>
                              )}

                              <div className="flex items-center gap-1 ml-auto">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateSlotEntryQty(selectedDay, slot, idx, Math.max(0.1, Number((q - 0.25).toFixed(3))))
                                  }
                                  className={`w-6 h-6 rounded-md border font-bold flex items-center justify-center ${cCard} ${cTextPrimary}`}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  step="any"
                                  min="0.01"
                                  value={Number(q.toFixed(2))}
                                  onChange={(e) => updateSlotEntryQty(selectedDay, slot, idx, e.target.value)}
                                  aria-label="Porzioni"
                                  className={`w-12 ${cInput} border rounded-md px-1 py-0.5 text-center font-bold text-xs focus:outline-none focus:border-emerald-400`}
                                />
                                <span className={`text-[10px] font-semibold ${cTextSecondary}`}>x</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateSlotEntryQty(selectedDay, slot, idx, Number((q + 0.25).toFixed(3)))
                                  }
                                  className={`w-6 h-6 rounded-md border font-bold flex items-center justify-center ${cCard} ${cTextPrimary}`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      const meal = data.meals.find((m) => m.id === entry.id);
                      if (!meal) return null;
                      const macros = getMealMacros(meal);
                      return (
                        <div
                          key={`meal-${entry.id}-${idx}`}
                          className={`${cInner} border rounded-xl p-3 flex items-start justify-between gap-2`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 ${cEmerald}`}>
                                Pasto
                              </span>
                              <span className={`font-medium text-sm ${cTextPrimary} leading-snug`}>
                                {meal.name}
                              </span>
                            </div>
                            <div className={`text-[11px] ${cTextSecondary} mt-1 flex flex-wrap gap-2`}>
                              <span className={`${cEmerald} font-semibold`}>{Math.round(macros.kcal)} kcal</span>
                              <span>• P: {Math.round(macros.p)}g</span>
                              <span>
                                • C: {Math.round(macros.c)}g
                                {macros.sugars > 0 ? ` (zucch. ${Math.round(macros.sugars)}g)` : ''}
                              </span>
                              <span>• G: {Math.round(macros.g)}g</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => startEditComposedMeal(meal)}
                              title="Modifica questo pasto assemblato"
                              className={`p-1.5 ${cTextSecondary} hover:text-emerald-400 rounded-lg transition`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => removeMealFromSlot(selectedDay, slot, idx)}
                              className={`p-1.5 ${cTextSecondary} hover:text-rose-400 rounded-lg transition`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/80'} flex gap-2`}>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      assignEntryToSlot(selectedDay, slot, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className={`flex-1 ${cInput} border rounded-xl px-3 py-2.5 sm:py-2 text-xs focus:outline-none focus:border-emerald-400`}
                >
                  <option value="" disabled className={cOption}>
                    + Aggiungi pasto o cibo singolo...
                  </option>
                  {data.meals.length > 0 && (
                    <optgroup label="── Pasti Assemblati ──" className={cOption}>
                      {data.meals.map((m) => {
                        const mm = getMealMacros(m);
                        return (
                          <option key={`meal:${m.id}`} value={`meal:${m.id}`} className={cOption}>
                            {m.name} ({Math.round(mm.kcal)} kcal • {Math.round(mm.p)}g P)
                          </option>
                        );
                      })}
                    </optgroup>
                  )}
                  {data.foods.length > 0 && (
                    <optgroup label="── Cibi Singoli ──" className={cOption}>
                      {data.foods.map((f) => (
                        <option key={`food:${f.id}`} value={`food:${f.id}`} className={cOption}>
                          {f.name} ({Math.round(f.kcal)} kcal • {Math.round(f.p)}g P)
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    ),
  };

  const activeComposerFoodId = selectedFoodToAdd || (data.foods[0]?.id ?? '');
  const activeComposerFood = getFoodById(activeComposerFoodId);
  const activeComposerBaseGrams = extractBaseGrams(activeComposerFood);
  const effectiveQtyMode = qtyInputMode === 'grams' && activeComposerBaseGrams ? 'grams' : 'portion';
  const computedPreviewMultiplier = activeComposerFood
    ? effectiveQtyMode === 'grams' && activeComposerBaseGrams
      ? (parseFloat(String(selectedFoodGrams).replace(',', '.')) || 0) / activeComposerBaseGrams
      : parseFloat(String(selectedFoodQty).replace(',', '.')) || 0
    : 0;

  const composerSections = {
    composerForm: renderReorderWrapper(
      'composer',
      'composerForm',
      editingMealId ? 'Modifica Pasto Assemblato' : 'Crea Nuovo Pasto',
      <div className={`${cCard} border ${editingMealId ? 'border-amber-400/60' : ''} rounded-2xl p-4 sm:p-5 space-y-4`}>
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-semibold text-base ${editingMealId ? cAmber : cEmerald} flex items-center gap-2`}>
            {editingMealId ? (
              <>
                <Edit3 className="w-4 h-4" /> Modifica Pasto Assemblato
              </>
            ) : (
              'Componi un Nuovo Pasto Ricorrente'
            )}
          </h3>
          {editingMealId && (
            <button
              type="button"
              onClick={cancelEditComposedMeal}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 ${cInner} ${cTextSecondary} hover:text-rose-400`}
            >
              <X className="w-3.5 h-3.5" /> Annulla modifica
            </button>
          )}
        </div>

        <form onSubmit={handleSaveComposedMeal} className="space-y-4">
          <div>
            <label className={`block text-xs ${cTextSecondary} mb-1`}>Nome del Pasto</label>
            <input
              type="text"
              required
              placeholder="Es. Colazione Yogurt Greco & Muesli"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className={`w-full ${cInput} border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-400`}
            />
          </div>

          <div className={`${cInner} border rounded-xl p-3.5 space-y-3`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className={`block text-xs font-medium ${cTextPrimary}`}>
                1. Scegli Alimento &amp; 2. Imposta Quantità
              </label>

              <div className={`inline-flex rounded-lg p-0.5 border ${isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-slate-950 border-slate-700'}`}>
                <button
                  type="button"
                  onClick={() => setQtyInputMode('portion')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    effectiveQtyMode === 'portion'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : cTextSecondary
                  }`}
                >
                  Porzioni (x)
                </button>
                <button
                  type="button"
                  disabled={!activeComposerBaseGrams}
                  onClick={() => {
                    if (activeComposerBaseGrams) {
                      setQtyInputMode('grams');
                      setSelectedFoodGrams(String(activeComposerBaseGrams));
                    }
                  }}
                  title={
                    activeComposerBaseGrams
                      ? 'Inserisci il peso esatto in grammi'
                      : 'Disponibile per alimenti con grammatura nel nome (es. 100g)'
                  }
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition disabled:opacity-35 ${
                    effectiveQtyMode === 'grams'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : cTextSecondary
                  }`}
                >
                  Grammi (g)
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <select
                value={activeComposerFoodId}
                onChange={(e) => handleSelectFoodInComposer(e.target.value)}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2 focus:outline-none focus:border-emerald-400`}
              >
                {data.foods.map((f) => (
                  <option key={f.id} value={f.id} className={cOption}>
                    {f.name} ({f.kcal} kcal | {f.p}P {f.c}C{Number(f.sugars) > 0 ? ` [${f.sugars}Z]` : ''} {f.g}G)
                  </option>
                ))}
              </select>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {effectiveQtyMode === 'grams' && activeComposerBaseGrams ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFoodGrams((prev) =>
                          String(Math.max(5, (parseFloat(String(prev).replace(',', '.')) || activeComposerBaseGrams) - 10))
                        )
                      }
                      className={`w-10 h-10 sm:h-9 rounded-xl border font-bold ${cCard} ${cTextPrimary} active:scale-95`}
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="any"
                        min="0.1"
                        value={selectedFoodGrams}
                        onChange={(e) => setSelectedFoodGrams(e.target.value)}
                        className={`w-full ${cInput} border rounded-xl pl-3 pr-7 py-2 text-center font-bold focus:outline-none focus:border-emerald-400`}
                      />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${cTextSecondary}`}>
                        g
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFoodGrams((prev) =>
                          String((parseFloat(String(prev).replace(',', '.')) || activeComposerBaseGrams) + 10)
                        )
                      }
                      className={`w-10 h-10 sm:h-9 rounded-xl border font-bold ${cCard} ${cTextPrimary} active:scale-95`}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFoodQty((prev) =>
                          String(Math.max(0.25, Number(((parseFloat(String(prev).replace(',', '.')) || 1) - 0.25).toFixed(2))))
                        )
                      }
                      className={`w-10 h-10 sm:h-9 rounded-xl border font-bold ${cCard} ${cTextPrimary} active:scale-95`}
                    >
                      -
                    </button>
                    <div className="relative flex-1">
                      <input
                        type="number"
                        step="any"
                        min="0.01"
                        value={selectedFoodQty}
                        onChange={(e) => setSelectedFoodQty(e.target.value)}
                        className={`w-full ${cInput} border rounded-xl pl-3 pr-7 py-2 text-center font-bold focus:outline-none focus:border-emerald-400`}
                      />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold ${cTextSecondary}`}>
                        x
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedFoodQty((prev) =>
                          String(Number(((parseFloat(String(prev).replace(',', '.')) || 1) + 0.25).toFixed(2)))
                        )
                      }
                      className={`w-10 h-10 sm:h-9 rounded-xl border font-bold ${cCard} ${cTextPrimary} active:scale-95`}
                    >
                      +
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleAddIngredientToComposer}
                  disabled={!activeComposerFood || computedPreviewMultiplier <= 0}
                  className={`px-4 py-2.5 sm:py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 ${cEmerald} text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0`}
                >
                  <Plus className="w-4 h-4" /> Aggiungi al Pasto
                </button>
              </div>

              {activeComposerFood && computedPreviewMultiplier > 0 && (
                <div className={`text-[11px] ${cTextSecondary} flex flex-wrap items-center justify-between gap-2 pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/70'}`}>
                  <span>
                    Dose selezionata:{' '}
                    <strong className={cTextPrimary}>
                      {Number(computedPreviewMultiplier.toFixed(2))}x
                      {activeComposerBaseGrams
                        ? ` (~${Math.round(computedPreviewMultiplier * activeComposerBaseGrams)}g)`
                        : ''}
                    </strong>
                  </span>
                  <span className="font-semibold">
                    <span className={cEmerald}>{Math.round(activeComposerFood.kcal * computedPreviewMultiplier)} kcal</span>
                    {' • '}
                    <span className={cSky}>{Math.round(activeComposerFood.p * computedPreviewMultiplier)}g P</span>
                    {' • '}
                    <span className={cAmber}>
                      {Math.round(activeComposerFood.c * computedPreviewMultiplier)}g C
                      {Number(activeComposerFood.sugars) > 0
                        ? ` (${Math.round((Number(activeComposerFood.sugars) || 0) * computedPreviewMultiplier)}g zucch.)`
                        : ''}
                    </span>
                    {' • '}
                    <span className={cRose}>{Math.round(activeComposerFood.g * computedPreviewMultiplier)}g G</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {mealItems.length > 0 && (
            <div className="space-y-2">
              <div className={`text-xs font-semibold ${cTextSecondary}`}>
                Ingredienti nel pasto (modifica grammi o moltiplicatore):
              </div>
              {mealItems.map((it, idx) => {
                const food = getFoodById(it.foodId);
                if (!food) return null;
                const itemBaseG = extractBaseGrams(food);
                const currentItemGrams = itemBaseG ? Math.round(it.qty * itemBaseG) : null;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${cInner} px-3 py-2.5 rounded-xl border text-xs`}
                  >
                    <div className="min-w-0">
                      <div className={`font-medium truncate ${cTextPrimary}`}>{food.name}</div>
                      <div className={`text-[11px] ${cTextSecondary} mt-0.5`}>
                        {Math.round(food.kcal * it.qty)} kcal • P: {Math.round(food.p * it.qty)}g • C:{' '}
                        {Math.round(food.c * it.qty)}g
                        {Number(food.sugars) > 0 ? ` (zucch. ${Math.round((Number(food.sugars) || 0) * it.qty)}g)` : ''} • G:{' '}
                        {Math.round(food.g * it.qty)}g
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                      {itemBaseG && (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="1"
                            min="1"
                            value={currentItemGrams}
                            onChange={(e) => handleUpdateMealItemGrams(idx, e.target.value, itemBaseG)}
                            aria-label="Grammi ingrediente"
                            className={`w-16 ${cInput} border rounded-lg px-1.5 py-1 text-center font-bold text-xs focus:outline-none focus:border-sky-400`}
                          />
                          <span className={`text-[11px] font-semibold ${cSky}`}>g</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateMealItemQty(idx, Math.max(0.05, it.qty - 0.25))}
                          className={`w-7 h-7 rounded-lg border font-bold ${cCard} ${cTextPrimary}`}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          value={Number(it.qty.toFixed(2))}
                          onChange={(e) => handleUpdateMealItemQty(idx, e.target.value)}
                          aria-label="Porzioni ingrediente"
                          className={`w-14 ${cInput} border rounded-lg px-1.5 py-1 text-center font-bold text-xs`}
                        />
                        <span className={`text-[11px] font-semibold ${cEmerald}`}>x</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateMealItemQty(idx, it.qty + 0.25)}
                          className={`w-7 h-7 rounded-lg border font-bold ${cCard} ${cTextPrimary}`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setMealItems((prev) => prev.filter((_, i) => i !== idx))}
                        className={`p-1.5 ${cTextSecondary} hover:text-rose-400`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {(() => {
                const previewMacros = getMealMacros({ items: mealItems });
                return (
                  <div className="bg-emerald-500/15 border border-emerald-400/40 rounded-xl p-3 flex flex-wrap justify-between items-center text-xs gap-2">
                    <span className={`font-semibold ${cEmerald}`}>Totale Pasto:</span>
                    <div className="flex flex-wrap gap-3 font-bold">
                      <span className={cTextPrimary}>{Math.round(previewMacros.kcal)} kcal</span>
                      <span className={cSky}>P: {Math.round(previewMacros.p)}g</span>
                      <span className={cAmber}>
                        C: {Math.round(previewMacros.c)}g
                        {previewMacros.sugars > 0 ? ` (zucch. ${Math.round(previewMacros.sugars)}g)` : ''}
                      </span>
                      <span className={cRose}>G: {Math.round(previewMacros.g)}g</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            {editingMealId && (
              <button
                type="button"
                onClick={cancelEditComposedMeal}
                className={`py-3 sm:py-2.5 px-4 rounded-xl border font-semibold text-sm transition ${cInner} ${cTextSecondary}`}
              >
                Annulla
              </button>
            )}
            <button
              type="submit"
              disabled={!mealName.trim() || mealItems.length === 0}
              className={`flex-1 py-3 sm:py-2.5 rounded-xl ${
                editingMealId
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white'
              } disabled:opacity-40 font-bold text-sm transition`}
            >
              {editingMealId ? 'Aggiorna Pasto Assemblato' : 'Salva Pasto nel Ricettario'}
            </button>
          </div>
        </form>
      </div>
    ),

    savedMealsList: renderReorderWrapper(
      'composer',
      'savedMealsList',
      'Pasti Già Pronti',
      <div className={`${cCard} border rounded-2xl p-4 sm:p-5 space-y-3`}>
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-semibold text-base ${cTextPrimary}`}>
            Pasti Già Pronti ({filteredMeals.length}
            {normalizedSearch ? ` su ${data.meals.length}` : ''})
          </h3>
          {normalizedSearch && (
            <span className={`text-xs font-medium ${cEmerald}`}>
              Filtro: &ldquo;{pantrySearchQuery}&rdquo;
            </span>
          )}
        </div>
        {data.meals.length === 0 ? (
          <p className={`text-xs ${cTextSecondary} italic py-6 text-center`}>Nessun pasto composto salvato.</p>
        ) : filteredMeals.length === 0 ? (
          <p className={`text-xs ${cTextSecondary} italic py-6 text-center`}>
            Nessun pasto corrisponde alla ricerca &ldquo;{pantrySearchQuery}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[540px] overflow-y-auto pr-1">
            {filteredMeals.map((meal) => {
              const m = getMealMacros(meal);
              const isBeingEdited = editingMealId === meal.id;
              return (
                <div
                  key={meal.id}
                  className={`${cInner} border ${
                    isBeingEdited ? 'border-amber-400 ring-1 ring-amber-400/50' : ''
                  } rounded-xl p-3.5 space-y-2 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-sm ${cTextPrimary}`}>{meal.name}</h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditComposedMeal(meal)}
                          title="Modifica ingredienti, grammature e nome del pasto"
                          className={`p-1.5 rounded-lg border transition ${cCard} ${cTextSecondary} hover:text-amber-400 hover:border-amber-400/50`}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (editingMealId === meal.id) cancelEditComposedMeal();
                            setData((prev) => ({
                              ...prev,
                              meals: prev.meals.filter((x) => x.id !== meal.id),
                            }));
                          }}
                          title="Elimina pasto"
                          className={`p-1.5 ${cTextSecondary} hover:text-rose-400`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className={`text-xs ${cTextSecondary} space-y-0.5 mt-1.5`}>
                      {meal.items.map((it, i) => {
                        const f = getFoodById(it.foodId);
                        if (!f) return null;
                        const bg = extractBaseGrams(f);
                        return (
                          <div key={i}>
                            • {Number(it.qty.toFixed(2))}x {f.name}
                            {bg ? ` (${Math.round(it.qty * bg)}g)` : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/80'} flex flex-wrap gap-2.5 text-xs font-semibold`}>
                    <span className={cEmerald}>{Math.round(m.kcal)} kcal</span>
                    <span className={cSky}>{Math.round(m.p)}g P</span>
                    <span className={cAmber}>
                      {Math.round(m.c)}g C{m.sugars > 0 ? ` (${Math.round(m.sugars)}g zucch.)` : ''}
                    </span>
                    <span className={cRose}>{Math.round(m.g)}g G</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ),
  };

  const foodsSections = {
    addFoodForm: renderReorderWrapper(
      'foods',
      'addFoodForm',
      editingFoodId ? 'Modifica Alimento' : 'Aggiungi Alimento',
      <div className={`${cCard} border ${editingFoodId ? 'border-amber-400/60' : ''} rounded-2xl p-4 sm:p-5 h-fit`}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className={`font-semibold text-base ${editingFoodId ? cAmber : cEmerald} flex items-center gap-2`}>
            {editingFoodId ? (
              <>
                <Edit3 className="w-4 h-4" /> Modifica Alimento Singolo
              </>
            ) : (
              'Aggiungi Alimento al Database'
            )}
          </h3>
          {editingFoodId && (
            <button
              type="button"
              onClick={cancelEditFood}
              className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 ${cInner} ${cTextSecondary} hover:text-rose-400`}
            >
              <X className="w-3.5 h-3.5" /> Annulla
            </button>
          )}
        </div>
        <p className={`text-xs ${cTextSecondary} mb-3`}>
          Inserisci o modifica i valori nutrizionali e la grammatura di riferimento (es. 100g): potrai poi regolare i grammi esatti sia nei pasti che negli slot giornalieri.
        </p>
        <form onSubmit={handleSaveFood} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3">
            <div className="sm:col-span-8">
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Nome Alimento</label>
              <input
                type="text"
                required
                placeholder="Es. Fiocchi di Latte"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2 focus:outline-none focus:border-emerald-400`}
              />
            </div>
            <div className="sm:col-span-4">
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Grammatura rif. (g)</label>
              <input
                type="number"
                min="0.1"
                step="any"
                placeholder="100"
                value={newFood.baseGrams}
                onChange={(e) => setNewFood({ ...newFood, baseGrams: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2 focus:outline-none focus:border-emerald-400`}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 items-start">
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Calorie (kcal)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="190"
                value={newFood.kcal}
                onChange={(e) => setNewFood({ ...newFood, kcal: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
              />
            </div>
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Proteine (g)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="24"
                value={newFood.p}
                onChange={(e) => setNewFood({ ...newFood, p: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
              />
            </div>
            <div className="space-y-2">
              <div>
                <label className={`block text-xs ${cTextSecondary} mb-1`}>Carboidrati (g)</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="6"
                  value={newFood.c}
                  onChange={(e) => setNewFood({ ...newFood, c: e.target.value })}
                  className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                />
              </div>
              <div className={`pl-2.5 border-l-2 ${isLight ? 'border-amber-400/70' : 'border-amber-400/50'}`}>
                <label className={`block text-[11px] ${cTextSecondary} mb-1`}>di cui zuccheri (g)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="2.5"
                  value={newFood.sugars}
                  onChange={(e) => setNewFood({ ...newFood, sugars: e.target.value })}
                  className={`w-full ${cInput} border rounded-xl px-3 py-2 sm:py-1.5 text-xs focus:outline-none focus:border-amber-400`}
                />
              </div>
            </div>
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Grassi (g)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="8"
                value={newFood.g}
                onChange={(e) => setNewFood({ ...newFood, g: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {editingFoodId && (
              <button
                type="button"
                onClick={cancelEditFood}
                className={`py-3 sm:py-2.5 px-4 rounded-xl border font-semibold text-sm transition ${cInner} ${cTextSecondary}`}
              >
                Annulla
              </button>
            )}
            <button
              type="submit"
              className={`flex-1 py-3 sm:py-2.5 rounded-xl ${
                editingFoodId
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-white'
              } font-bold text-sm transition`}
            >
              {editingFoodId ? 'Aggiorna Alimento' : 'Salva Alimento'}
            </button>
          </div>
        </form>
      </div>
    ),

    foodsList: renderReorderWrapper(
      'foods',
      'foodsList',
      'Alimenti Salvati',
      <div className={`${cCard} border rounded-2xl p-4 sm:p-5`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className={`font-semibold text-base ${cTextPrimary}`}>
            Alimenti Salvati ({filteredFoods.length}
            {normalizedSearch ? ` su ${data.foods.length}` : ''})
          </h3>
          {normalizedSearch && (
            <span className={`text-xs font-medium ${cEmerald}`}>
              Filtro: &ldquo;{pantrySearchQuery}&rdquo;
            </span>
          )}
        </div>
        {data.foods.length === 0 ? (
          <p className={`text-xs ${cTextSecondary} italic py-6 text-center`}>Nessun alimento salvato nel database.</p>
        ) : filteredFoods.length === 0 ? (
          <p className={`text-xs ${cTextSecondary} italic py-6 text-center`}>
            Nessun alimento corrisponde alla ricerca &ldquo;{pantrySearchQuery}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredFoods.map((food) => {
              const isBeingEdited = editingFoodId === food.id;
              return (
                <div
                  key={food.id}
                  className={`${cInner} border ${
                    isBeingEdited ? 'border-amber-400 ring-1 ring-amber-400/50' : ''
                  } rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2`}
                >
                  <div className="min-w-0">
                    <div className={`font-medium text-sm truncate ${cTextPrimary}`}>{food.name}</div>
                    <div className={`text-xs ${cTextSecondary} flex flex-wrap gap-2 mt-0.5`}>
                      <span className={`${cEmerald} font-semibold`}>{food.kcal} kcal</span>
                      <span>P: {food.p}g</span>
                      <span>
                        C: {food.c}g
                        {Number(food.sugars) > 0 ? ` (zucch. ${food.sugars}g)` : ''}
                      </span>
                      <span>G: {food.g}g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditFood(food)}
                      title="Modifica alimento e grammatura di riferimento"
                      className={`p-1.5 rounded-lg border transition ${cCard} ${cTextSecondary} hover:text-amber-400 hover:border-amber-400/50`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectFoodInComposer(food.id);
                        setNutritionSubTab('pantry');
                        setPantryView('composer');
                      }}
                      title="Scegli quantità e aggiungi a un pasto"
                      className={`px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 ${cEmerald} text-xs font-semibold transition`}
                    >
                      + Usa
                    </button>
                    <button onClick={() => handleDeleteFood(food.id)} className={`p-1.5 ${cTextSecondary} hover:text-rose-400 rounded-lg`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    ),
  };

  // --- BLOCCHI PER TRACKER IDRATAZIONE INTELLIGENTE ---
  const smartAdvice = getSmartHydrationAdvice();

  const waterSections = {
    waterOverview: renderReorderWrapper(
      'water',
      'waterOverview',
      'Tracker Idratazione & Aggiunta Rapida',
      <div className={`${cCard} border rounded-2xl p-4 sm:p-5 space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-sky-500/20 border border-sky-400/35 shrink-0">
              <Droplets className={`w-5 h-5 ${cSky}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-base ${cTextPrimary} flex items-center gap-2`}>
                Idratazione Intelligente
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 ${cSky}`}>
                  {waterPercent}%
                </span>
              </h3>
              <p className={`text-xs ${cTextSecondary}`}>
                {data.waterSettings?.autoCalculate
                  ? `Calcolato su ${latestWeight ? latestWeight.weight : 75} kg (${data.waterSettings.mlPerKg} ml/kg)`
                  : 'Obiettivo manuale personalizzato'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              value={selectedWaterDate}
              onChange={(e) => setSelectedWaterDate(e.target.value || getTodayIso())}
              className={`${cInput} border rounded-xl px-3 py-2 text-xs font-semibold`}
            />

            <button
              type="button"
              onClick={() => toggleWorkoutDayForWater(selectedWaterDate)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                selectedDateIsWorkout
                  ? `bg-amber-500/20 border-amber-400/60 ${cAmber}`
                  : `${cInner} ${cTextSecondary}`
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Workout (+{data.waterSettings?.workoutBonusMl || 600}ml)</span>
            </button>

            <button
              type="button"
              onClick={() => setEditingWaterConfig((v) => !v)}
              title="Configura calcolo intelligente"
              className={`p-2 rounded-xl border transition ${
                editingWaterConfig
                  ? `bg-sky-500/20 border-sky-400/50 ${cSky}`
                  : `${cInner} ${cTextSecondary}`
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {editingWaterConfig && (
          <div className={`${cInner} border border-sky-400/40 rounded-xl p-3.5 space-y-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold ${cSky} flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5" /> Parametri Calcolo Fabbisogno Idrico
              </span>
              <button onClick={() => setEditingWaterConfig(false)} className={`p-1 ${cTextSecondary} hover:text-rose-400`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateWaterSettings({ autoCalculate: true })}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  data.waterSettings?.autoCalculate
                    ? 'bg-sky-500 border-sky-400 text-white'
                    : `${cCard} ${cTextSecondary}`
                }`}
              >
                Auto (Peso + Workout)
              </button>
              <button
                type="button"
                onClick={() => updateWaterSettings({ autoCalculate: false })}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  !data.waterSettings?.autoCalculate
                    ? 'bg-sky-500 border-sky-400 text-white'
                    : `${cCard} ${cTextSecondary}`
                }`}
              >
                Obiettivo Fisso (ml)
              </button>
            </div>

            {data.waterSettings?.autoCalculate ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Rapporto Base (ml / kg)</label>
                  <input
                    type="number"
                    min="20"
                    max="60"
                    value={data.waterSettings?.mlPerKg || 35}
                    onChange={(e) => updateWaterSettings({ mlPerKg: Math.max(20, Number(e.target.value) || 35) })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Bonus Allenamento (ml)</label>
                  <input
                    type="number"
                    step="50"
                    min="0"
                    max="2000"
                    value={data.waterSettings?.workoutBonusMl ?? 600}
                    onChange={(e) => updateWaterSettings({ workoutBonusMl: Math.max(0, Number(e.target.value) || 0) })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2`}
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Target Giornaliero Fisso (ml)</label>
                <input
                  type="number"
                  step="100"
                  min="500"
                  max="8000"
                  value={data.waterSettings?.manualTargetMl || 2500}
                  onChange={(e) => updateWaterSettings({ manualTargetMl: Math.max(500, Number(e.target.value) || 2500) })}
                  className={`w-full ${cInput} border rounded-xl px-3 py-2`}
                />
              </div>
            )}
          </div>
        )}

        <div className={`${cInner} border rounded-2xl p-4 space-y-3`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className={`text-2xl sm:text-3xl font-bold ${cTextPrimary}`}>{selectedDateWaterTotal}</span>
              <span className={`text-sm font-medium ${cTextSecondary}`}> / {selectedDateWaterTarget} ml</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className={cTextSecondary}>
                ~<strong className={cTextPrimary}>{Math.round(selectedDateWaterTotal / 200)}</strong> bicchieri
              </span>
              {waterRemainingMl > 0 ? (
                <span className={`font-semibold ${cSky}`}>Mancano {waterRemainingMl} ml</span>
              ) : (
                <span className={`font-semibold ${cEmerald}`}>Target completato!</span>
              )}
            </div>
          </div>

          <div className={`w-full h-3.5 ${isLight ? 'bg-slate-200' : 'bg-slate-950'} rounded-full overflow-hidden`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                selectedDateWaterTotal >= selectedDateWaterTarget
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-sky-500 to-cyan-400'
              }`}
              style={{ width: `${waterPercent}%` }}
            />
          </div>

          <div
            className={`rounded-xl px-3 py-2.5 text-xs flex items-start gap-2 border ${
              smartAdvice.tone === 'success'
                ? `bg-emerald-500/15 border-emerald-400/40 ${cEmerald}`
                : smartAdvice.tone === 'warn'
                ? `bg-amber-500/15 border-amber-400/40 ${cAmber}`
                : `bg-sky-500/15 border-sky-400/40 ${cSky}`
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="font-medium leading-relaxed">{smartAdvice.text}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className={`text-xs font-semibold ${cTextSecondary}`}>Aggiungi rapidamente:</span>
            <select
              value={selectedDrinkType}
              onChange={(e) => setSelectedDrinkType(e.target.value)}
              className={`${cInput} border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-sky-400`}
            >
              {DRINK_TYPES.map((d) => (
                <option key={d.id} value={d.id} className={cOption}>
                  {d.label} {d.factor < 1 ? `(idratazione ${Math.round(d.factor * 100)}%)` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {WATER_PRESETS.map((preset) => (
              <button
                key={preset.amount}
                type="button"
                onClick={() => handleAddWater(preset.amount, preset.label)}
                className={`${cInner} hover:border-sky-400 active:scale-95 border rounded-xl p-3 flex flex-col items-center justify-center gap-1 transition`}
              >
                <div className="flex items-center gap-1 text-sky-400 font-bold text-sm sm:text-base">
                  <Droplet className="w-4 h-4 fill-current" />
                  <span>+{preset.amount} ml</span>
                </div>
                <span className={`text-[11px] font-medium ${cTextSecondary}`}>{preset.label}</span>
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!customWaterAmount) return;
              handleAddWater(customWaterAmount, 'Quantità manuale');
              setCustomWaterAmount('');
            }}
            className="flex gap-2"
          >
            <input
              type="number"
              min="10"
              max="3000"
              step="10"
              placeholder="Quantità personalizzata in ml (es. 350)"
              value={customWaterAmount}
              onChange={(e) => setCustomWaterAmount(e.target.value)}
              className={`flex-1 ${cInput} border rounded-xl px-3.5 py-2.5 sm:py-2 focus:outline-none focus:border-sky-400`}
            />
            <button
              type="submit"
              disabled={!customWaterAmount}
              className="px-4 py-2.5 sm:py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shrink-0"
            >
              <Plus className="w-4 h-4" /> Aggiungi
            </button>
          </form>
        </div>
      </div>
    ),

    waterHistory: renderReorderWrapper(
      'water',
      'waterHistory',
      'Andamento Settimanale & Registro Giornaliero',
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cCard} border rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={`font-semibold text-base ${cTextPrimary}`}>Settimana Idratazione</h3>
              <p className={`text-xs ${cTextSecondary} mt-0.5`}>
                {weekRangeLabel} • Tocca un giorno per gestirlo
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {!isViewingCurrentWeek && (
                <button
                  type="button"
                  onClick={() => setSelectedWaterDate(todayIso)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/20 ${cSky} hover:bg-sky-500/30 transition mr-0.5`}
                >
                  Oggi
                </button>
              )}
              <button
                type="button"
                onClick={() => shiftSelectedWaterWeek(-1)}
                title="Settimana precedente"
                className={`p-1.5 rounded-lg border transition ${cInner} ${cTextPrimary} hover:border-sky-400`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => shiftSelectedWaterWeek(1)}
                title="Settimana successiva"
                className={`p-1.5 rounded-lg border transition ${cInner} ${cTextPrimary} hover:border-sky-400`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 items-stretch min-h-[168px] pt-1">
            {currentWeekWaterDays.map((day) => {
              const isSelected = day.iso === selectedWaterDate;
              const isToday = day.iso === todayIso;
              const isGoalMet = day.total >= day.target && day.total > 0;
              return (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => setSelectedWaterDate(day.iso)}
                  className={`flex flex-col items-center justify-between gap-1.5 py-2 px-1 rounded-xl border transition ${
                    isSelected
                      ? isLight
                        ? 'bg-sky-50 border-sky-400 ring-1 ring-sky-400/50'
                        : 'bg-sky-500/15 border-sky-400 ring-1 ring-sky-400/40'
                      : 'border-transparent hover:border-slate-400/30'
                  }`}
                >
                  <span className={`text-[10px] sm:text-[11px] font-bold leading-none ${isGoalMet ? cEmerald : cTextSecondary}`}>
                    {day.total > 0 ? `${(day.total / 1000).toFixed(1)}L` : '0'}
                  </span>

                  <div className={`w-full flex-1 min-h-[84px] ${isLight ? 'bg-slate-200/85' : 'bg-slate-950'} rounded-lg flex items-end overflow-hidden p-0.5`}>
                    <div
                      className={`w-full rounded-md transition-all duration-300 ${
                        isGoalMet
                          ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-t from-sky-500 to-cyan-400'
                      }`}
                      style={{ height: `${Math.max(day.total > 0 ? 12 : 0, day.pct)}%` }}
                    />
                  </div>

                  <div className="text-center leading-tight">
                    <div className={`text-[11px] font-bold ${isSelected || isToday ? cSky : cTextPrimary}`}>
                      {day.dayShort}
                    </div>
                    <div className={`text-[10px] ${isToday ? `font-bold ${cSky}` : cTextSecondary}`}>
                      {day.dayNum}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`${cCard} border rounded-2xl p-4 sm:p-5 space-y-3`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`font-semibold text-base ${cTextPrimary}`}>Registro del {selectedWaterDate}</h3>
              <p className={`text-xs ${cTextSecondary}`}>{selectedDateWaterLogs.length} assunzioni registrate</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-sky-500/20 ${cSky}`}>
              {selectedDateWaterTotal} ml
            </span>
          </div>

          {selectedDateWaterLogs.length === 0 ? (
            <p className={`text-xs ${cTextSecondary} italic py-8 text-center border border-dashed ${isLight ? 'border-slate-300' : 'border-slate-700'} rounded-xl`}>
              Nessuna bevuta registrata in questa data. Usa i pulsanti rapidi qui sopra!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {selectedDateWaterLogs.map((log) => (
                <div
                  key={log.id}
                  className={`${cInner} border rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${cSky}`}>+{log.amount} ml</span>
                      <span className={`text-xs font-medium ${cTextPrimary}`}>{log.containerLabel}</span>
                      <span className={`text-[11px] ${cTextSecondary}`}>• {log.time}</span>
                    </div>
                    {log.drinkLabel && log.drinkLabel !== 'Acqua Naturale / Frizzante' && (
                      <div className={`text-[11px] ${cTextSecondary} mt-0.5`}>
                        {log.drinkLabel} {log.rawAmount !== log.amount ? `(${log.rawAmount} ml lordi)` : ''}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteWaterLog(log.id)}
                    className={`p-2 ${cTextSecondary} hover:text-rose-400 rounded-lg transition`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
  };

  const weightSections = {
    addWeightForm: renderReorderWrapper(
      'weight',
      'addWeightForm',
      'Registra Pesata',
      <div className={`${cCard} border rounded-2xl p-4 sm:p-5 space-y-4 h-fit`}>
        <h3 className={`font-semibold text-base ${cEmerald} flex items-center gap-2`}>
          <Scale className="w-4 h-4" /> Registra Pesata Settimanale
        </h3>
        <form onSubmit={handleAddWeight} className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Peso (kg)</label>
              <input
                type="number"
                step="any"
                required
                placeholder="77.0"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2 focus:outline-none focus:border-emerald-400`}
              />
            </div>
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Data</label>
              <input
                type="date"
                required
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
              />
            </div>
          </div>
          <div>
            <label className={`block text-xs ${cTextSecondary} mb-1`}>Note (opzionale)</label>
            <input
              type="text"
              placeholder="Es. Pesata mattutina a digiuno"
              value={newWeightNote}
              onChange={(e) => setNewWeightNote(e.target.value)}
              className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition"
          >
            Aggiungi Pesata
          </button>
        </form>
      </div>
    ),

    weightChartCard: renderReorderWrapper(
      'weight',
      'weightChartCard',
      'Grafico & Storico Peso',
      <div className={`${cCard} border rounded-2xl p-4 sm:p-5 space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className={`font-semibold text-base ${cTextPrimary}`}>Andamento nel Tempo</h3>
            <p className={`text-xs ${cTextSecondary}`}>Monitoraggio progressivo del peso</p>
          </div>
          <div className="flex gap-2">
            {weightDeltaLast !== null && (
              <span className={`text-xs px-2.5 py-1 rounded-lg ${cInner} border ${cTextSecondary}`}>
                Ultima:{' '}
                <strong className={cEmerald}>
                  {Number(weightDeltaLast) > 0 ? `+${weightDeltaLast}` : weightDeltaLast} kg
                </strong>
              </span>
            )}
            {weightDeltaTotal !== null && (
              <span className={`text-xs px-2.5 py-1 rounded-lg ${cInner} border ${cTextSecondary}`}>
                Totale:{' '}
                <strong className={cSky}>
                  {Number(weightDeltaTotal) > 0 ? `+${weightDeltaTotal}` : weightDeltaTotal} kg
                </strong>
              </span>
            )}
          </div>
        </div>

        {renderWeightChart(175)}

        <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/80'}`}>
          <h4 className={`text-xs font-semibold uppercase tracking-wider ${cTextSecondary}`}>Storico Registrazioni</h4>
          {sortedWeights.length === 0 ? (
            <p className={`text-xs ${cTextSecondary} italic py-3 text-center`}>Nessuna pesata registrata.</p>
          ) : (
            [...sortedWeights].reverse().map((w) => (
              <div
                key={w.id}
                className={`${cInner} border rounded-xl px-3.5 py-2.5 flex items-center justify-between`}
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`font-bold text-sm ${cTextPrimary}`}>{w.weight} kg</span>
                    <span className={`text-xs ${cTextSecondary}`}>{w.date}</span>
                  </div>
                  {w.note && <p className={`text-xs ${cTextSecondary} mt-0.5`}>{w.note}</p>}
                </div>
                <button onClick={() => handleDeleteWeight(w.id)} className={`p-2 ${cTextSecondary} hover:text-rose-400 rounded-lg`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    ),
  };

  // --- BLOCCHI PER ALLENAMENTO ---
  const workoutSections = {
    workoutHeader: renderReorderWrapper(
      'workout',
      'workoutHeader',
      'Intestazione Scheda & Avanzamento',
      <div className={`${cCard} border rounded-2xl p-3.5 sm:p-4 space-y-3.5 sm:space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {data.workouts.map((wo) => (
              <button
                key={wo.id}
                onClick={() => {
                  setActiveWorkoutId(wo.id);
                  setIsEditingWorkoutTitle(false);
                }}
                className={`px-3.5 py-2.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border ${
                  activeWorkoutId === wo.id
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/25'
                    : `${cInner} ${cTextSecondary}`
                }`}
              >
                {wo.dayLabel}: {wo.title.split('(')[0].trim()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsEditingWorkoutTitle(false);
                setWorkoutMode(workoutMode === 'live' ? 'edit' : 'live');
              }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-semibold border transition ${
                workoutMode === 'edit'
                  ? `bg-amber-500/20 border-amber-400/60 ${cAmber}`
                  : `${cInner} ${cTextPrimary}`
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {workoutMode === 'edit' ? 'Workout Live' : 'Modifica Scheda & Pause'}
            </button>

            <button
              onClick={handleResetWorkoutPage}
              title="Azzera a 0 spunte, carichi (kg) e timer di questa scheda"
              className={`flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 ${cRose} transition whitespace-nowrap`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Azzera a 0</span>
            </button>
          </div>
        </div>

        {currentWorkout && (
          <div className={`pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/80'} space-y-3`}>
            {workoutMode === 'edit' ? (
              <div className={`${cInner} border border-indigo-400/40 rounded-xl p-3.5 space-y-3`}>
                <div className={`text-xs font-semibold ${cIndigo} flex items-center gap-1.5`}>
                  <Edit3 className="w-3.5 h-3.5" />
                  Modifica Nome e Dettagli della Scheda
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-3">
                    <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Etichetta Giorno</label>
                    <input
                      type="text"
                      value={currentWorkout.dayLabel}
                      onChange={(e) => updateWorkoutMetadata(currentWorkout.id, { dayLabel: e.target.value })}
                      placeholder="Es. Giorno A"
                      className={`w-full ${cInput} border rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-indigo-400`}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Nome Scheda</label>
                    <input
                      type="text"
                      value={currentWorkout.title}
                      onChange={(e) => updateWorkoutMetadata(currentWorkout.id, { title: e.target.value })}
                      placeholder="Es. Upper Push"
                      className={`w-full ${cInput} border rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-indigo-400`}
                    />
                  </div>
                  <div className="sm:col-span-5">
                    <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Focus Muscolare / Note</label>
                    <input
                      type="text"
                      value={currentWorkout.focus}
                      onChange={(e) => updateWorkoutMetadata(currentWorkout.id, { focus: e.target.value })}
                      placeholder="Es. Petto, Spalle, Tricipiti"
                      className={`w-full ${cInput} border rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-400`}
                    />
                  </div>
                </div>
                <div className={`text-[11px] ${cTextSecondary} pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/70'}`}>
                  Suggerimento: qui sotto su ogni esercizio puoi personalizzare sia il tempo tra le singole serie (es. <strong>S1→S2: 120s</strong>, <strong>S2→S3: 90s</strong>) sia la pausa specifica verso l&apos;esercizio successivo.
                </div>
              </div>
            ) : isEditingWorkoutTitle ? (
              <form
                onSubmit={saveInlineTitleEdit}
                className={`${cInner} border border-indigo-400/50 rounded-xl p-3 space-y-2.5`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <input
                    type="text"
                    value={tempWorkoutDayLabel}
                    onChange={(e) => setTempWorkoutDayLabel(e.target.value)}
                    placeholder="Giorno A"
                    className={`sm:col-span-3 ${cInput} border rounded-lg px-2.5 py-2 font-semibold focus:outline-none focus:border-indigo-400`}
                  />
                  <input
                    type="text"
                    autoFocus
                    value={tempWorkoutTitle}
                    onChange={(e) => setTempWorkoutTitle(e.target.value)}
                    placeholder="Nome della scheda"
                    className={`sm:col-span-4 ${cInput} border rounded-lg px-2.5 py-2 font-semibold focus:outline-none focus:border-indigo-400`}
                  />
                  <input
                    type="text"
                    value={tempWorkoutFocus}
                    onChange={(e) => setTempWorkoutFocus(e.target.value)}
                    placeholder="Focus muscolare (opzionale)"
                    className={`sm:col-span-5 ${cInput} border rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-400`}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingWorkoutTitle(false)}
                    className={`px-3.5 py-2 rounded-lg text-xs border ${cInner} ${cTextSecondary}`}
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Salva Nome
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      onClick={startInlineTitleEdit}
                      title="Clicca per rinominare la scheda"
                      className={`text-base sm:text-lg font-bold ${cTextPrimary} cursor-pointer hover:text-indigo-400 transition`}
                    >
                      {currentWorkout.dayLabel} — {currentWorkout.title}
                    </h2>
                    <button
                      type="button"
                      onClick={startInlineTitleEdit}
                      title="Rinomina scheda"
                      className={`p-1.5 rounded-lg border transition shrink-0 ${cInner} ${cTextSecondary} hover:text-indigo-400 hover:border-indigo-400/50`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className={`text-xs ${cTextSecondary}`}>{currentWorkout.focus}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 sm:gap-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${cInner} border text-xs`}>
                    <SkipForward className={`w-3.5 h-3.5 ${cAmber} shrink-0`} />
                    <span className={cTextSecondary}>Imposta tutti es.:</span>
                    <select
                      value={data.betweenExerciseRest || 180}
                      onChange={(e) => applyGlobalBetweenRestToAll(e.target.value)}
                      className={`bg-transparent font-bold ${cAmber} focus:outline-none cursor-pointer`}
                    >
                      <option value={90} className={cOption}>90s</option>
                      <option value={120} className={cOption}>120s (2m)</option>
                      <option value={150} className={cOption}>150s (2m30)</option>
                      <option value={180} className={cOption}>180s (3m)</option>
                      <option value={240} className={cOption}>240s (4m)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={`text-[11px] ${cTextSecondary}`}>Completate</div>
                      <div className={`text-xs sm:text-sm font-bold ${cIndigo}`}>
                        {completedSetsInWorkout} / {totalSetsInWorkout}
                      </div>
                    </div>
                    {completedSetsInWorkout > 0 && (
                      <button
                        onClick={() => setCompletedSets({})}
                        className={`text-xs px-2.5 py-1.5 rounded-lg ${cInner} border ${cTextSecondary}`}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    ),

    exercisesList: renderReorderWrapper(
      'workout',
      'exercisesList',
      'Elenco Esercizi',
      currentWorkout ? (
        <div className="space-y-3 sm:space-y-3.5">
          {currentWorkout.exercises.map((ex, exIdx) => {
            const nextExercise = currentWorkout.exercises[exIdx + 1];
            const transitionRest = getExerciseTransitionRest(ex, data.betweenExerciseRest || 180);
            const customSetRestsActive = hasCustomPerSetRests(ex);

            return (
              <div
                key={ex.id}
                className={`${cCard} border rounded-2xl p-4 sm:p-5 space-y-3.5`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-bold ${cIndigo} bg-indigo-500/20 px-2 py-0.5 rounded-md mt-0.5 shrink-0`}>
                        #{exIdx + 1}
                      </span>
                      <h3 className={`font-semibold text-sm sm:text-base ${cTextPrimary} leading-snug`}>{ex.name}</h3>
                    </div>

                    <div className={`flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs ${cTextSecondary} mt-1.5`}>
                      <span>
                        <strong className={cTextPrimary}>{ex.sets}</strong> serie ×{' '}
                        <strong className={cTextPrimary}>{ex.reps}</strong> rip
                      </span>

                      <span className={`flex items-center gap-1 font-medium ${cIndigo}`}>
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {customSetRestsActive ? (
                          <span>
                            Serie:{' '}
                            {Array.from({ length: ex.sets - 1 })
                              .map((_, i) => `S${i + 1}→S${i + 2}: ${getSetRestSeconds(ex, i)}s`)
                              .join(' • ')}
                          </span>
                        ) : (
                          <span>Tra serie: {ex.rest}s</span>
                        )}
                      </span>

                      <span className={`flex items-center gap-1 font-medium ${cAmber}`}>
                        <SkipForward className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {nextExercise
                            ? `Dopo es. → #${exIdx + 2}: ${transitionRest}s`
                            : `Fine scheda / defatic.: ${transitionRest}s`}
                        </span>
                      </span>
                    </div>

                    {ex.notes && <p className={`text-xs ${cTextSecondary} italic mt-1`}>Nota: {ex.notes}</p>}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 shrink-0">
                    {ex.weight > 0 || workoutMode === 'edit' ? (
                      <div className={`flex items-center ${cInner} border rounded-xl p-1`}>
                        <button
                          onClick={() => updateExerciseWeight(currentWorkout.id, ex.id, -1)}
                          className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg active:bg-slate-500/20 ${cTextPrimary} font-bold text-base`}
                        >
                          -
                        </button>
                        <span className={`px-2.5 text-xs sm:text-sm font-bold ${cTextPrimary} min-w-[58px] text-center`}>
                          {ex.weight === 0 ? 'BW' : `${ex.weight} kg`}
                        </span>
                        <button
                          onClick={() => updateExerciseWeight(currentWorkout.id, ex.id, +1)}
                          className={`w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg active:bg-slate-500/20 ${cTextPrimary} font-bold text-base`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className={`text-xs font-semibold px-3 py-2 rounded-xl ${cInner} border ${cTextSecondary}`}>
                        Corpo Libero
                      </span>
                    )}

                    {workoutMode === 'edit' && (
                      <button
                        onClick={() => handleDeleteExercise(ex.id)}
                        className={`p-2.5 rounded-xl bg-rose-500/15 ${cRose} hover:bg-rose-500/25`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {workoutMode === 'edit' && (
                  <div className={`${cInner} border border-indigo-400/35 rounded-xl p-3.5 space-y-3`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Numero Serie</label>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={ex.sets}
                          onChange={(e) => updateExerciseSetsCount(currentWorkout.id, ex.id, e.target.value)}
                          className={`w-full ${cInput} border rounded-xl px-3 py-1.5 font-semibold`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] ${cIndigo} font-semibold mb-1`}>
                          Pausa Base Serie (sec)
                        </label>
                        <input
                          type="number"
                          step="5"
                          min="0"
                          value={ex.rest}
                          onChange={(e) => updateExerciseBaseRest(currentWorkout.id, ex.id, e.target.value)}
                          className={`w-full ${cInput} border rounded-xl px-3 py-1.5 font-semibold`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[11px] ${cAmber} font-semibold mb-1`}>
                          {nextExercise
                            ? `Pausa verso #${exIdx + 2} (sec)`
                            : 'Pausa Fine Esercizio (sec)'}
                        </label>
                        <input
                          type="number"
                          step="5"
                          min="0"
                          value={transitionRest}
                          onChange={(e) => updateExerciseAfterRest(currentWorkout.id, ex.id, e.target.value)}
                          className={`w-full ${cInput} border rounded-xl px-3 py-1.5 font-semibold`}
                        />
                      </div>
                    </div>

                    {ex.sets > 1 && (
                      <div className={`pt-2.5 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/70'} space-y-2`}>
                        <div className={`text-[11px] font-semibold ${cTextSecondary} flex items-center gap-1.5`}>
                          <Clock className={`w-3.5 h-3.5 ${cIndigo}`} />
                          <span>Recupero specifico tra singole serie (in secondi):</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Array.from({ length: ex.sets - 1 }).map((_, tIdx) => (
                            <div
                              key={tIdx}
                              className={`flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border ${cCard}`}
                            >
                              <span className={`text-xs font-bold ${cIndigo} whitespace-nowrap`}>
                                S{tIdx + 1} → S{tIdx + 2}
                              </span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  step="5"
                                  min="0"
                                  value={getSetRestSeconds(ex, tIdx)}
                                  onChange={(e) =>
                                    updateExerciseSpecificSetRest(currentWorkout.id, ex.id, tIdx, e.target.value)
                                  }
                                  className={`w-16 ${cInput} border rounded-md px-1.5 py-1 text-center font-bold text-xs`}
                                />
                                <span className={`text-[10px] ${cTextSecondary}`}>s</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {workoutMode === 'live' && (
                  <div className="space-y-2 pt-1">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      {Array.from({ length: ex.sets }).map((_, setIdx) => {
                        const isDone = !!completedSets[`${ex.id}-${setIdx}`];
                        const hasNextSet = setIdx < ex.sets - 1;
                        const nextRestLabel = hasNextSet
                          ? `${getSetRestSeconds(ex, setIdx)}s`
                          : `${transitionRest}s es.`;

                        return (
                          <button
                            key={setIdx}
                            onClick={() => toggleSetCompleted(ex, setIdx)}
                            className={`sm:flex-1 sm:min-w-[96px] py-3 sm:py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex flex-col items-center justify-center gap-0.5 border transition active:scale-95 ${
                              isDone
                                ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-500/25'
                                : `${cInner} ${cTextPrimary} hover:border-slate-500`
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 shrink-0 text-slate-400" />
                              )}
                              <span>Serie {setIdx + 1}</span>
                            </div>
                            <span
                              className={`text-[10px] font-medium ${
                                isDone ? 'text-emerald-100' : cTextSecondary
                              }`}
                            >
                              → {nextRestLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ex.sets > 1 && customSetRestsActive ? (
                        Array.from({ length: ex.sets - 1 }).map((_, tIdx) => {
                          const secVal = getSetRestSeconds(ex, tIdx);
                          return (
                            <button
                              key={tIdx}
                              onClick={() => startTimer(secVal, 'set', `S${tIdx + 1}→S${tIdx + 2}`)}
                              title={`Avvia recupero tra Serie ${tIdx + 1} e Serie ${tIdx + 2}`}
                              className={`flex-1 min-w-[115px] py-2.5 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 ${cIndigo} text-xs font-semibold flex items-center justify-center gap-1.5`}
                            >
                              <Clock className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                S{tIdx + 1}→S{tIdx + 2} ({secVal}s)
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <button
                          onClick={() => startTimer(ex.rest || 90, 'set', 'Tra Serie')}
                          title="Avvia pausa tra una serie e l'altra"
                          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 ${cIndigo} text-xs font-semibold flex items-center justify-center gap-1.5`}
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>Pausa Serie ({ex.rest}s)</span>
                        </button>
                      )}

                      <button
                        onClick={() =>
                          startTimer(
                            transitionRest,
                            'exercise',
                            nextExercise ? `Verso #${exIdx + 2}` : 'Fine Scheda'
                          )
                        }
                        title="Avvia pausa di transizione verso l'esercizio successivo"
                        className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 ${cAmber} text-xs font-semibold flex items-center justify-center gap-1.5`}
                      >
                        <SkipForward className="w-3.5 h-3.5 shrink-0" />
                        <span>
                          {nextExercise
                            ? `Verso #${exIdx + 2} (${transitionRest}s)`
                            : `Fine Scheda (${transitionRest}s)`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {workoutMode === 'edit' && (
            <form
              onSubmit={handleAddExercise}
              className={`${cCard} border border-indigo-400/50 rounded-2xl p-4 sm:p-5 space-y-3`}
            >
              <h4 className={`font-semibold text-sm ${cIndigo}`}>+ Aggiungi Esercizio a {currentWorkout.dayLabel}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nome esercizio (es. Croci con Manubri)"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className={`${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                />
                <input
                  type="text"
                  placeholder="Note tecniche (opzionale)"
                  value={newExercise.notes}
                  onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                  className={`${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Serie</label>
                  <input
                    type="number"
                    min="1"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Ripetizioni</label>
                  <input
                    type="text"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Carico kg (0 = BW)</label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] ${cIndigo} mb-1`}>Pausa Serie (sec)</label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={newExercise.rest}
                    onChange={(e) => setNewExercise({ ...newExercise, rest: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className={`block text-[11px] ${cAmber} mb-1`}>Pausa Es. Succ. (sec)</label>
                  <input
                    type="number"
                    step="5"
                    min="0"
                    value={newExercise.restAfterExercise}
                    onChange={(e) => setNewExercise({ ...newExercise, restAfterExercise: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2`}
                  />
                </div>
              </div>
              <button type="submit" className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold">
                Aggiungi Esercizio
              </button>
            </form>
          )}
        </div>
      ) : null
    ),
  };

  return (
    <div
      style={{
        colorScheme: isLight ? 'light' : 'dark',
      }}
      className={`min-h-[100dvh] w-full overflow-x-hidden font-sans selection:bg-emerald-500/30 pb-44 sm:pb-32 transition-colors duration-200 ${
        isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-white'
      }`}
    >
      {/* HEADER FULL-WIDTH */}
      <header
        className={`sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors pt-[env(safe-area-inset-top)] ${
          isLight
            ? 'bg-white/92 border-slate-200'
            : 'bg-slate-950/92 border-slate-800'
        }`}
      >
        <div className="w-full px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/15 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="truncate">
              <h1 className={`font-bold text-base sm:text-lg tracking-tight leading-none ${cTextPrimary}`}>
                FitTrack <span className={cEmerald}>Pro</span>
              </h1>
              <p className={`hidden sm:block text-[11px] ${cTextSecondary} mt-0.5 truncate`}>
                Dieta Settimanale • Idratazione • Peso • Manubri &amp; Corpo Libero
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Esci da schermo intero' : 'Schermo intero'}
              className={`flex items-center justify-center gap-1.5 text-xs p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition ${
                isFullscreen
                  ? `bg-sky-500/20 border-sky-400/50 ${cSky} font-semibold`
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{isFullscreen ? 'Riduci' : 'Schermo intero'}</span>
            </button>

            <button
              onClick={toggleTheme}
              title={isLight ? 'Passa a modalità scura' : 'Passa a modalità chiara'}
              className={`flex items-center justify-center gap-1.5 text-xs p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              {isLight ? (
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="hidden lg:inline font-medium">{isLight ? 'Scura' : 'Chiara'}</span>
            </button>

            <button
              onClick={() => setReorderMode((v) => !v)}
              title="Sposta e riordina le sezioni"
              className={`flex items-center justify-center gap-1.5 text-xs p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition ${
                reorderMode
                  ? 'bg-amber-400 border-amber-300 text-slate-950 font-semibold shadow-sm'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{reorderMode ? 'Fine' : 'Ordina'}</span>
            </button>

            <button
              onClick={pullFromCloud}
              title={
                syncStatus === 'synced'
                  ? `Sincronizzato con Supabase${
                      lastSyncedAt ? ' alle ' + lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                    }`
                  : syncStatus === 'syncing'
                  ? 'Sincronizzazione in corso...'
                  : 'Errore di connessione cloud'
              }
              className={`flex items-center justify-center gap-1.5 text-xs p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition ${
                syncStatus === 'synced'
                  ? `bg-emerald-500/15 border-emerald-400/40 ${cEmerald} hover:bg-emerald-500/25`
                  : syncStatus === 'syncing'
                  ? `bg-amber-500/15 border-amber-400/40 ${cAmber}`
                  : `bg-rose-500/15 border-rose-400/40 ${cRose} hover:bg-rose-500/25`
              }`}
            >
              {syncStatus === 'synced' && <Cloud className="w-3.5 h-3.5" />}
              {syncStatus === 'syncing' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {syncStatus === 'error' && <CloudOff className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline font-medium">
                {syncStatus === 'synced' ? 'Cloud Sync' : syncStatus === 'syncing' ? 'Sync...' : 'Offline'}
              </span>
            </button>

            <button
              onClick={handleExportJSON}
              title="Esporta Backup JSON"
              className={`hidden sm:flex items-center justify-center text-xs p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Download className={`w-3.5 h-3.5 ${cEmerald}`} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Importa Backup JSON"
              className={`hidden sm:flex items-center justify-center text-xs p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <Upload className={`w-3.5 h-3.5 ${cIndigo}`} />
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            <button
              onClick={handleResetDemo}
              title="Ripristina dati demo"
              className={`flex items-center justify-center text-xs p-2 sm:px-2.5 sm:py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-rose-50 border-slate-300 hover:border-rose-300 text-slate-600 hover:text-rose-600'
                  : 'bg-slate-900 hover:bg-rose-950/60 border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BARRA NAVIGAZIONE DUE SEZIONI PRINCIPALI */}
        <nav className="w-full px-3 sm:px-6 lg:px-8 pb-2.5 grid grid-cols-2 sm:flex gap-2">
          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'nutrition'
                ? `bg-emerald-500/20 ${cEmerald} border border-emerald-400/50 shadow-sm`
                : isLight
                ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Utensils className={`w-4 h-4 ${cEmerald} shrink-0`} />
            <span>Dieta &amp; Peso</span>
          </button>

          <button
            onClick={() => setActiveTab('workout')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
              activeTab === 'workout'
                ? `bg-indigo-500/20 ${cIndigo} border border-indigo-400/50 shadow-sm`
                : isLight
                ? 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-transparent'
                : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent'
            }`}
          >
            <Dumbbell className={`w-4 h-4 ${cIndigo} shrink-0`} />
            <span>Workout (3x)</span>
          </button>
        </nav>
      </header>

      {/* BANNER INFORMATIVO MODALITÀ RIORDINO */}
      {reorderMode && (
        <div className="w-full px-3 sm:px-6 lg:px-8 pt-4">
          <div
            className={`rounded-2xl px-4 py-3 border flex flex-wrap items-center justify-between gap-2 text-xs ${
              isLight
                ? 'bg-amber-50/95 border-amber-300 text-amber-900'
                : 'bg-amber-500/20 backdrop-blur-md border-amber-400/50 text-amber-200'
            }`}
          >
            <span>
              <strong>Modalità Riordino:</strong> usa le frecce <strong>Su / Giù</strong> su ogni sezione.
            </span>
            <div className="flex items-center gap-2">
              <button onClick={resetLayoutOrder} className="underline font-semibold hover:opacity-80">
                Reset ordine
              </button>
              <button
                onClick={() => setReorderMode(false)}
                className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold"
              >
                Fatto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT FULL-WIDTH */}
      <main className="w-full px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-5 sm:space-y-6">
        {activeTab === 'nutrition' && (
          <div className="space-y-4 sm:space-y-5">
            {data.layout.nutrition.map((secId) => {
              if (secId === 'todayDashboard') {
                return renderReorderWrapper(
                  'nutrition',
                  'todayDashboard',
                  'Dashboard Riepilogativa Oggi',
                  <div className={`${cCard} border rounded-2xl p-3.5 sm:p-4 space-y-3`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/35">
                          <LayoutDashboard className={`w-4 h-4 ${cEmerald}`} />
                        </div>
                        <div>
                          <h2 className={`font-bold text-sm sm:text-base ${cTextPrimary} leading-tight`}>
                            Panoramica di Oggi — {FULL_DAYS[realTodayDayKey]}
                          </h2>
                          <p className={`text-[11px] ${cTextSecondary}`}>
                            {todayIso} • Tocca un riquadro per aprire i dettagli
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddWater(250, 'Rabbocco rapido Oggi', todayIso)}
                          title="Registra subito +250 ml d'acqua per oggi"
                          className={`px-2.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 ${cSky} text-xs font-bold flex items-center gap-1 transition active:scale-95`}
                        >
                          <Droplet className="w-3.5 h-3.5 fill-current" />
                          <span>+250ml</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab('workout')}
                          className={`px-2.5 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/40 ${cIndigo} text-xs font-bold flex items-center gap-1 transition`}
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                          <span>Vai al Workout</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
                      {/* 1. MACRO DI OGGI */}
                      <div
                        onClick={() => {
                          setSelectedDay(realTodayDayKey);
                          setNutritionSubTab('planner');
                        }}
                        className={`${cInner} hover:border-emerald-400/60 border rounded-xl p-3 cursor-pointer transition flex flex-col justify-between space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${cTextSecondary} flex items-center gap-1.5`}>
                            <Flame className={`w-3.5 h-3.5 ${cEmerald}`} />
                            Calorie Oggi ({realTodayDayKey})
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              todayKcalDiff >= 0
                                ? `bg-emerald-500/20 ${cEmerald}`
                                : `bg-amber-500/20 ${cAmber}`
                            }`}
                          >
                            {todayKcalDiff >= 0 ? `-${todayKcalDiff} kcal` : `+${Math.abs(todayKcalDiff)} kcal`}
                          </span>
                        </div>

                        <div>
                          <div className={`text-base sm:text-lg font-extrabold ${cTextPrimary}`}>
                            {todayRealMacros.kcal}{' '}
                            <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.kcal} kcal</span>
                          </div>
                          <div className={`text-[11px] ${cTextSecondary} mt-0.5 flex gap-2 font-medium`}>
                            <span className={cSky}>{todayRealMacros.p}P</span>
                            <span>•</span>
                            <span className={cAmber}>{todayRealMacros.c}C</span>
                            <span>•</span>
                            <span className={cRose}>{todayRealMacros.g}G</span>
                          </div>
                        </div>

                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${todayKcalPct}%` }}
                          />
                        </div>
                      </div>

                      {/* 2. IDRATAZIONE DI OGGI */}
                      <div
                        onClick={() => {
                          setSelectedWaterDate(todayIso);
                          setNutritionSubTab('water');
                        }}
                        className={`${cInner} hover:border-sky-400/60 border rounded-xl p-3 cursor-pointer transition flex flex-col justify-between space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${cTextSecondary} flex items-center gap-1.5`}>
                            <Droplets className={`w-3.5 h-3.5 ${cSky}`} />
                            Idratazione Oggi
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 ${cSky}`}>
                            {todayRealWaterPct}%
                          </span>
                        </div>

                        <div>
                          <div className={`text-base sm:text-lg font-extrabold ${cTextPrimary}`}>
                            {todayRealWaterTotal}{' '}
                            <span className={`text-xs font-normal ${cTextSecondary}`}>/ {todayRealWaterTarget} ml</span>
                          </div>
                          <div className={`text-[11px] ${cTextSecondary} mt-0.5`}>
                            {todayRealWaterTotal >= todayRealWaterTarget
                              ? 'Obiettivo giornaliero raggiunto!'
                              : `Mancano ${todayRealWaterTarget - todayRealWaterTotal} ml al target`}
                          </div>
                        </div>

                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                          <div
                            className="h-full bg-sky-400 rounded-full transition-all duration-300"
                            style={{ width: `${todayRealWaterPct}%` }}
                          />
                        </div>
                      </div>

                      {/* 3. PESO ATTUALE */}
                      <div
                        onClick={() => setNutritionSubTab('weight')}
                        className={`${cInner} hover:border-emerald-400/60 border rounded-xl p-3 cursor-pointer transition flex flex-col justify-between space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${cTextSecondary} flex items-center gap-1.5`}>
                            <Scale className={`w-3.5 h-3.5 ${cEmerald}`} />
                            Peso Corporeo
                          </span>
                          {weightDeltaLast !== null && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 ${cEmerald}`}>
                              {Number(weightDeltaLast) > 0 ? `+${weightDeltaLast}` : weightDeltaLast} kg
                            </span>
                          )}
                        </div>

                        <div>
                          <div className={`text-base sm:text-lg font-extrabold ${cTextPrimary}`}>
                            {latestWeight ? `${latestWeight.weight} kg` : '—'}
                          </div>
                          <div className={`text-[11px] ${cTextSecondary} mt-0.5 truncate`}>
                            {latestWeight
                              ? `Ultima pesata: ${latestWeight.date}`
                              : 'Nessuna pesata registrata'}
                          </div>
                        </div>

                        <div className={`text-[10px] font-semibold ${cEmerald} flex items-center gap-1`}>
                          <span>Apri grafico &amp; registra peso</span>
                          <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>

                      {/* 4. STATO WORKOUT */}
                      <div
                        onClick={() => setActiveTab('workout')}
                        className={`${cInner} hover:border-indigo-400/60 border rounded-xl p-3 cursor-pointer transition flex flex-col justify-between space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-semibold ${cTextSecondary} flex items-center gap-1.5`}>
                            <Dumbbell className={`w-3.5 h-3.5 ${cIndigo}`} />
                            Scheda Attiva
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 ${cIndigo}`}>
                            {completedSetsInWorkout}/{totalSetsInWorkout} serie
                          </span>
                        </div>

                        <div>
                          <div className={`text-sm sm:text-base font-extrabold ${cTextPrimary} truncate`}>
                            {currentWorkout ? `${currentWorkout.dayLabel}: ${currentWorkout.title}` : 'Workout'}
                          </div>
                          <div className={`text-[11px] ${cTextSecondary} mt-0.5 truncate`}>
                            {currentWorkout?.focus || 'Pronto per iniziare'}
                          </div>
                        </div>

                        <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-200' : 'bg-slate-950'}`}>
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                totalSetsInWorkout > 0
                                  ? Math.min(100, Math.round((completedSetsInWorkout / totalSetsInWorkout) * 100))
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (secId === 'subNav') {
                return renderReorderWrapper(
                  'nutrition',
                  'subNav',
                  'Barra Sotto-Sezioni Alimentazione',
                  <div className="space-y-3">
                    <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 ${cCard} border p-2 rounded-2xl`}>
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
                        {[
                          {
                            id: 'planner',
                            label: 'Piano',
                            fullLabel: 'Piano Settimanale',
                            icon: Calendar,
                            activeBg: 'bg-emerald-500',
                          },
                          {
                            id: 'pantry',
                            label: `Pasti & Alimenti (${data.meals.length + data.foods.length})`,
                            fullLabel: `Pasti & Alimenti (${data.meals.length}P • ${data.foods.length}A)`,
                            icon: Utensils,
                            activeBg: 'bg-emerald-500',
                          },
                          {
                            id: 'water',
                            label: 'Acqua',
                            fullLabel: 'Idratazione',
                            icon: Droplets,
                            activeBg: 'bg-sky-500',
                          },
                          {
                            id: 'weight',
                            label: 'Peso',
                            fullLabel: 'Tracker Peso',
                            icon: Scale,
                            activeBg: 'bg-emerald-500',
                          },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          const isTabActive = nutritionSubTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setNutritionSubTab(tab.id)}
                              className={`flex items-center justify-center sm:justify-start gap-1.5 px-2.5 sm:px-3 py-2.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                                isTabActive
                                  ? `${tab.activeBg} text-white font-semibold shadow-sm`
                                  : isLight
                                  ? 'text-slate-600 hover:bg-slate-100'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                              }`}
                            >
                              <Icon className="w-4 h-4 shrink-0" />
                              <span className="sm:hidden truncate">{tab.label}</span>
                              <span className="hidden sm:inline">{tab.fullLabel}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTempTargets(data.targets);
                            setTempBodyProfile(data.bodyProfile || INITIAL_BODY_PROFILE);
                            setCalcWeightInput(String(latestWeight ? latestWeight.weight : 77.2));
                            setEditingTargets((v) => !v);
                          }}
                          className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 sm:py-2 rounded-xl ${cInner} border ${cTextPrimary} transition`}
                        >
                          <Calculator className={`w-3.5 h-3.5 ${cEmerald}`} />
                          Target &amp; Calcolo Kcal
                        </button>

                        <button
                          onClick={handleResetNutritionSubPage}
                          title="Azzera a 0 tutti i dati di questa sezione"
                          className={`flex items-center justify-center gap-1.5 text-xs px-3 py-2.5 sm:py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 ${cRose} font-semibold transition whitespace-nowrap`}
                        >
                          <Eraser className="w-3.5 h-3.5" />
                          <span>Azzera a 0</span>
                        </button>
                      </div>
                    </div>

                    {editingTargets && (
                      <div className={`${cCard} border border-emerald-400/50 rounded-2xl p-4 sm:p-5 space-y-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calculator className={`w-4 h-4 ${cEmerald}`} />
                            <h3 className={`font-semibold text-sm ${cEmerald}`}>
                              Calcolo Fabbisogno (Peso + Altezza) &amp; Target Macro
                            </h3>
                          </div>
                          <button onClick={() => setEditingTargets(false)} className={`p-1 ${cTextSecondary} hover:text-rose-400`}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className={`${cInner} border rounded-xl p-3.5 space-y-3`}>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className={`text-xs font-semibold ${cTextPrimary}`}>
                              Parametri Corporei &amp; Obiettivo (Salute + Massa Pulita)
                            </span>
                            <label className={`flex items-center gap-1.5 text-[11px] ${cTextSecondary} cursor-pointer`}>
                              <input
                                type="checkbox"
                                checked={!!tempBodyProfile.autoSyncWeight}
                                onChange={(e) =>
                                  setTempBodyProfile({ ...tempBodyProfile, autoSyncWeight: e.target.checked })
                                }
                                className="rounded accent-emerald-500"
                              />
                              Aggiorna kcal in automatico alle nuove pesate
                            </label>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                            <div>
                              <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Peso (kg)</label>
                              <input
                                type="number"
                                step="any"
                                min="35"
                                max="250"
                                value={calcWeightInput}
                                onChange={(e) => setCalcWeightInput(e.target.value)}
                                className={`w-full ${cInput} border rounded-xl px-3 py-2`}
                              />
                            </div>
                            <div>
                              <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Altezza (cm)</label>
                              <input
                                type="number"
                                min="120"
                                max="230"
                                value={tempBodyProfile.heightCm}
                                onChange={(e) =>
                                  setTempBodyProfile({
                                    ...tempBodyProfile,
                                    heightCm: Number(e.target.value) || 178,
                                  })
                                }
                                className={`w-full ${cInput} border rounded-xl px-3 py-2`}
                              />
                            </div>
                            <div>
                              <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Età</label>
                              <input
                                type="number"
                                min="15"
                                max="99"
                                value={tempBodyProfile.age}
                                onChange={(e) =>
                                  setTempBodyProfile({
                                    ...tempBodyProfile,
                                    age: Number(e.target.value) || 23,
                                  })
                                }
                                className={`w-full ${cInput} border rounded-xl px-3 py-2`}
                              />
                            </div>
                            <div>
                              <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Sesso</label>
                              <select
                                value={tempBodyProfile.sex}
                                onChange={(e) => setTempBodyProfile({ ...tempBodyProfile, sex: e.target.value })}
                                className={`w-full ${cInput} border rounded-xl px-3 py-2`}
                              >
                                <option value="M" className={cOption}>Uomo</option>
                                <option value="F" className={cOption}>Donna</option>
                              </select>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Attività</label>
                              <select
                                value={tempBodyProfile.activityFactor}
                                onChange={(e) =>
                                  setTempBodyProfile({
                                    ...tempBodyProfile,
                                    activityFactor: parseFloat(e.target.value),
                                  })
                                }
                                className={`w-full ${cInput} border rounded-xl px-2.5 py-2 text-xs`}
                              >
                                <option value={1.375} className={cOption}>Leggera (1-2x/sett)</option>
                                <option value={1.55} className={cOption}>Moderata (3x/sett)</option>
                                <option value={1.725} className={cOption}>Intensa (4-5x/sett)</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                            <div className="flex-1">
                              <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Obiettivo Fisico</label>
                              <select
                                value={tempBodyProfile.goal}
                                onChange={(e) => setTempBodyProfile({ ...tempBodyProfile, goal: e.target.value })}
                                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-xs font-semibold`}
                              >
                                <option value="lean_bulk" className={cOption}>
                                  Salute + Leggera Massa Pulita (+200 kcal • 2g/kg Pro)
                                </option>
                                <option value="recomp" className={cOption}>
                                  Salute &amp; Ricomposizione Corporea (Normocalorica • 2g/kg Pro)
                                </option>
                                <option value="bulk" className={cOption}>
                                  Aumento Massa Muscolare (+350 kcal • 2g/kg Pro)
                                </option>
                              </select>
                            </div>

                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setTempTargets({
                                    kcal: liveCalcPreview.kcal,
                                    p: liveCalcPreview.p,
                                    c: liveCalcPreview.c,
                                    g: liveCalcPreview.g,
                                  });
                                }}
                                className={`w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/50 ${cEmerald} text-xs font-bold flex items-center justify-center gap-1.5 transition`}
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Applica Stima ({liveCalcPreview.kcal} kcal)
                              </button>
                            </div>
                          </div>

                          <div className={`text-[11px] ${cTextSecondary} flex flex-wrap gap-3 pt-1 border-t ${isLight ? 'border-slate-200' : 'border-slate-700/70'}`}>
                            <span>Metabolismo Basale (BMR): <strong className={cTextPrimary}>{liveCalcPreview.bmr} kcal</strong></span>
                            <span>• TDEE Mantenimento: <strong className={cTextPrimary}>{liveCalcPreview.tdee} kcal</strong></span>
                            <span>
                              • Target Suggerito: <strong className={cEmerald}>{liveCalcPreview.kcal} kcal</strong> ({liveCalcPreview.p}P / {liveCalcPreview.c}C / {liveCalcPreview.g}G)
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                          {[
                            { key: 'kcal', label: 'Calorie Target (kcal)' },
                            { key: 'p', label: 'Proteine (g)' },
                            { key: 'c', label: 'Carboidrati (g)' },
                            { key: 'g', label: 'Grassi (g)' },
                          ].map((field) => (
                            <div key={field.key}>
                              <label className={`block text-xs ${cTextSecondary} mb-1`}>{field.label}</label>
                              <input
                                type="number"
                                value={tempTargets[field.key]}
                                onChange={(e) => setTempTargets({ ...tempTargets, [field.key]: Number(e.target.value) })}
                                className={`w-full ${cInput} border rounded-xl px-3 py-2.5 sm:py-2 focus:outline-none focus:border-emerald-400`}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                targets: tempTargets,
                                bodyProfile: tempBodyProfile,
                              }));
                              setEditingTargets(false);
                            }}
                            className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold"
                          >
                            Salva Profilo &amp; Obiettivi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (secId === 'mainContent') {
                return renderReorderWrapper(
                  'nutrition',
                  'mainContent',
                  'Contenuto Principale Alimentazione',
                  <div>
                    {nutritionSubTab === 'planner' && (
                      <div className="space-y-4 sm:space-y-5">
                        {data.layout.planner.map((pId) => plannerSections[pId] || null)}
                      </div>
                    )}

                    {/* SEZIONE UNIFICATA: PASTI & ALIMENTI CON SELETTORE E BARRA DI RICERCA */}
                    {nutritionSubTab === 'pantry' && (
                      <div className="space-y-4 sm:space-y-5">
                        <div className={`${cCard} border rounded-2xl p-3.5 sm:p-4 space-y-3`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/35 shrink-0">
                                <Utensils className={`w-4 h-4 ${cEmerald}`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold text-sm sm:text-base ${cTextPrimary}`}>
                                  Gestione Pasti &amp; Database Alimenti
                                </h3>
                                <p className={`text-xs ${cTextSecondary}`}>
                                  Componi ricette, modifica singoli ingredienti e filtra rapidamente
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <select
                                value={pantryView}
                                onChange={(e) => setPantryView(e.target.value)}
                                aria-label="Seleziona modalità Pasti o Alimenti"
                                className={`${cInput} border rounded-xl px-3.5 py-2.5 sm:py-2 font-semibold text-xs sm:text-sm focus:outline-none focus:border-emerald-400 cursor-pointer`}
                              >
                                <option value="composer" className={cOption}>
                                  🍽️ Componi Pasti &amp; Ricettario ({data.meals.length})
                                </option>
                                <option value="foods" className={cOption}>
                                  🥗 Database Alimenti Singoli ({data.foods.length})
                                </option>
                              </select>

                              <div className={`grid grid-cols-2 p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'}`}>
                                <button
                                  type="button"
                                  onClick={() => setPantryView('composer')}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    pantryView === 'composer'
                                      ? 'bg-emerald-500 text-white shadow-sm'
                                      : cTextSecondary
                                  }`}
                                >
                                  Pasti ({data.meals.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPantryView('foods')}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    pantryView === 'foods'
                                      ? 'bg-emerald-500 text-white shadow-sm'
                                      : cTextSecondary
                                  }`}
                                >
                                  Alimenti ({data.foods.length})
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* BARRA DI RICERCA ISTANTANEA */}
                          <div className="relative">
                            <Search className={`w-4 h-4 ${cTextSecondary} absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none`} />
                            <input
                              type="text"
                              value={pantrySearchQuery}
                              onChange={(e) => setPantrySearchQuery(e.target.value)}
                              placeholder={
                                pantryView === 'composer'
                                  ? 'Cerca un pasto per nome o per ingrediente (es. Pollo, Yogurt, Colazione)...'
                                  : 'Cerca un alimento nel database (es. Riso, Uova, Banana)...'
                              }
                              className={`w-full ${cInput} border rounded-xl pl-10 pr-9 py-2.5 sm:py-2 focus:outline-none focus:border-emerald-400`}
                            />
                            {pantrySearchQuery && (
                              <button
                                type="button"
                                onClick={() => setPantrySearchQuery('')}
                                title="Cancella ricerca"
                                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg ${cTextSecondary} hover:text-rose-400`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {pantryView === 'composer' ? (
                          <div className="space-y-4 sm:space-y-5">
                            {data.layout.composer.map((cId) => composerSections[cId] || null)}
                          </div>
                        ) : (
                          <div className="space-y-4 sm:space-y-5">
                            {data.layout.foods.map((fId) => foodsSections[fId] || null)}
                          </div>
                        )}
                      </div>
                    )}

                    {nutritionSubTab === 'water' && (
                      <div className="space-y-4 sm:space-y-5">
                        {data.layout.water.map((watId) => waterSections[watId] || null)}
                      </div>
                    )}

                    {nutritionSubTab === 'weight' && (
                      <div className="space-y-4 sm:space-y-5">
                        {data.layout.weight.map((wId) => weightSections[wId] || null)}
                      </div>
                    )}
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-4 sm:space-y-5">
            {data.layout.workout.map((wId) => workoutSections[wId] || null)}
          </div>
        )}
      </main>

      {/* BARRA FLOATING TIMER FULL-WIDTH */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 w-full backdrop-blur-lg border-t shadow-2xl transition-colors pb-[env(safe-area-inset-bottom)] ${
          isLight
            ? 'bg-white/95 border-slate-200'
            : 'bg-slate-900/95 border-slate-700'
        }`}
      >
        <div className="w-full px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center justify-between md:justify-start gap-2.5">
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-xl font-mono text-lg sm:text-xl font-bold border transition leading-tight ${
                  timerFinishedAlert
                    ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                    : timerRunning
                    ? timerType === 'exercise'
                      ? `bg-amber-500/20 ${cAmber} border-amber-400/60`
                      : `bg-indigo-500/25 ${cIndigo} border-indigo-400/60`
                    : `${cInner} ${cTextPrimary}`
                }`}
              >
                {formatSeconds(timerSeconds)}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  timerType === 'exercise'
                    ? `bg-amber-500/20 ${cAmber}`
                    : `bg-indigo-500/20 ${cIndigo}`
                }`}
              >
                {timerLabel || (timerType === 'exercise' ? 'Cambio Es.' : 'Tra Serie')}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setTimerFinishedAlert(false);
                  if (timerSeconds === 0) setTimerSeconds(timerInitial);
                  setTimerRunning(!timerRunning);
                }}
                className={`p-2.5 rounded-xl text-white transition ${
                  timerType === 'exercise'
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-indigo-600 hover:bg-indigo-500'
                }`}
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerFinishedAlert(false);
                  setTimerSeconds(timerInitial);
                }}
                className={`p-2.5 rounded-xl transition ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => adjustTimer(-15)}
                className={`px-2 py-2 rounded-xl ${cInner} border text-xs font-semibold ${cTextPrimary}`}
              >
                -15s
              </button>
              <button
                onClick={() => adjustTimer(15)}
                className={`px-2 py-2 rounded-xl ${cInner} border text-xs font-semibold ${cTextPrimary}`}
              >
                +15s
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl transition ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {soundEnabled ? <Volume2 className={`w-4 h-4 ${cEmerald}`} /> : <VolumeX className={`w-4 h-4 ${cTextSecondary}`} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-1.5 overflow-x-auto">
            <div className="flex items-center gap-1">
              <span className={`text-[10px] uppercase font-bold ${cTextSecondary} mr-0.5`}>
                Serie:
              </span>
              {[60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => startTimer(sec, 'set', 'Tra Serie')}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    timerType === 'set' && timerInitial === sec
                      ? `bg-indigo-500/25 border-indigo-400/60 ${cIndigo}`
                      : `${cInner} ${cTextPrimary}`
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className={`h-5 w-px mx-0.5 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

            <div className="flex items-center gap-1">
              <span className={`text-[10px] uppercase font-bold ${cAmber} mr-0.5`}>
                Es.:
              </span>
              {[120, 150, 180].map((sec) => (
                <button
                  key={sec}
                  onClick={() => startTimer(sec, 'exercise', 'Cambio Es.')}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    timerType === 'exercise' && timerInitial === sec
                      ? `bg-amber-500/25 border-amber-400/60 ${cAmber}`
                      : `${cInner} ${cAmber}`
                  }`}
                >
                  {sec === 150 ? '2m30' : `${sec / 60}m`}
                </button>
              ))}
            </div>

            <label className={`hidden lg:flex items-center gap-1.5 ml-1.5 text-xs ${cTextSecondary} cursor-pointer select-none`}>
              <input
                type="checkbox"
                checked={autoStartTimer}
                onChange={(e) => setAutoStartTimer(e.target.checked)}
                className="rounded accent-indigo-400"
              />
              Auto-avvio
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
