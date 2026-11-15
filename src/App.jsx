import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  LayoutDashboard,
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
  Palette,
  Image as ImageIcon,
  Eraser,
  SkipForward,
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

const PRESET_BACKGROUNDS = [
  {
    id: 'aurora-emerald',
    name: 'Aurora Smeraldo',
    css: 'radial-gradient(circle at 15% 15%, rgba(16, 185, 129, 0.25), transparent 45%), radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.22), transparent 50%), linear-gradient(135deg, #020617 0%, #0f172a 100%)',
    preview: 'linear-gradient(135deg, #064e3b, #0f172a, #312e81)',
  },
  {
    id: 'deep-abyss',
    name: 'Notte Profonda',
    css: 'radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.18), transparent 55%), linear-gradient(180deg, #030712 0%, #090d16 100%)',
    preview: 'linear-gradient(180deg, #0c4a6e, #030712)',
  },
  {
    id: 'sunset-power',
    name: 'Tramonto Energia',
    css: 'radial-gradient(circle at 80% 10%, rgba(244, 63, 94, 0.22), transparent 45%), radial-gradient(circle at 15% 85%, rgba(245, 158, 11, 0.18), transparent 50%), linear-gradient(135deg, #090d16 0%, #1e1b2e 100%)',
    preview: 'linear-gradient(135deg, #881337, #1e1b2e, #78350f)',
  },
  {
    id: 'steel-cobalt',
    name: 'Acciaio & Cobalto',
    css: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    preview: 'linear-gradient(135deg, #0f172a, #334155)',
  },
  {
    id: 'sand-light',
    name: 'Sabbia & Luce',
    css: 'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.12), transparent 50%), linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    preview: 'linear-gradient(135deg, #f8fafc, #cbd5e1)',
  },
  {
    id: 'nordic-mist',
    name: 'Nebbia Nordica',
    css: 'radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.14), transparent 50%), linear-gradient(135deg, #eef2ff 0%, #f1f5f9 100%)',
    preview: 'linear-gradient(135deg, #e0e7ff, #f1f5f9)',
  },
];

const INITIAL_BACKGROUND = {
  type: 'default',
  presetId: 'aurora-emerald',
  color: '#0b132b',
  imageUrl: '',
  overlayOpacity: 0.55,
};

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
  { id: 'f1', name: 'Yogurt Greco 0% (250g)', kcal: 145, p: 25, c: 9, g: 0 },
  { id: 'f2', name: 'Muesli Croccante / Avena (60g)', kcal: 230, p: 6, c: 39, g: 5 },
  { id: 'f3', name: 'Mandorle & Noci (20g)', kcal: 125, p: 4, c: 2, g: 11 },
  { id: 'f4', name: 'Cioccolato Fondente 90% (15g)', kcal: 88, p: 1.5, c: 2, g: 8 },
  { id: 'f5', name: 'Pasta di Semola (120g)', kcal: 425, p: 15, c: 86, g: 1.8 },
  { id: 'f6', name: 'Petto di Pollo / Tenders (200g)', kcal: 220, p: 46, c: 0, g: 3 },
  { id: 'f7', name: 'Olio Extravergine d’Oliva (15g)', kcal: 135, p: 0, c: 0, g: 15 },
  { id: 'f8', name: 'Riso Basmati (100g)', kcal: 350, p: 8, c: 78, g: 0.8 },
  { id: 'f9', name: 'Uova Intere Medie (3 uova)', kcal: 215, p: 19, c: 1.5, g: 15 },
  { id: 'f10', name: 'Lenticchie Lessate (150g)', kcal: 140, p: 10, c: 22, g: 0.6 },
  { id: 'f11', name: 'Banana Media (120g)', kcal: 105, p: 1.3, c: 27, g: 0.4 },
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

const INITIAL_WORKOUTS = [
  {
    id: 'wo-a',
    dayLabel: 'Giorno A',
    title: 'Upper Push (Spinta)',
    focus: 'Petto, Spalle Anteriori/Laterali, Tricipiti',
    exercises: [
      { id: 'e1', name: 'Spinte su Panca Piana/Pavimento con Manubri', sets: 4, reps: '8-10', weight: 22, rest: 120, notes: 'Controlla la discesa per 2 secondi, gomiti a 45°' },
      { id: 'e2', name: 'Military Press in Piedi con Manubri', sets: 3, reps: '8-10', weight: 14, rest: 90, notes: 'Core contratto, non inarcare la zona lombare' },
      { id: 'e3', name: 'Piegamenti sulle Braccia (Push-Up)', sets: 3, reps: 'Max (12-15)', weight: 0, rest: 90, notes: 'Corpo libero - petto a 2 cm da terra' },
      { id: 'e4', name: 'Alzate Laterali con Manubri', sets: 4, reps: '12-15', weight: 8, rest: 60, notes: 'Guida con i gomiti, pausa di 1s in alto' },
      { id: 'e5', name: 'French Press Manubri (Estensioni Tricipiti)', sets: 3, reps: '10-12', weight: 10, rest: 60, notes: 'Gomiti stretti e fermi' },
    ],
  },
  {
    id: 'wo-b',
    dayLabel: 'Giorno B',
    title: 'Lower & Core',
    focus: 'Quadricipiti, Femorali, Glutei, Polpacci e Addome',
    exercises: [
      { id: 'e6', name: 'Goblet Squat con Manubrio', sets: 4, reps: '10-12', weight: 24, rest: 120, notes: 'Accosciata profonda, schiena neutra' },
      { id: 'e7', name: 'Stacchi Rumeni (RDL) con Manubri', sets: 4, reps: '10', weight: 22, rest: 120, notes: 'Spingi il bacino indietro, senti allungare i femorali' },
      { id: 'e8', name: 'Affondi Bulgari (Bulgarian Split Squat)', sets: 3, reps: '8-10 / lato', weight: 14, rest: 90, notes: 'Busto leggermente inclinato in avanti' },
      { id: 'e9', name: 'Calf Raise su Rialzo (Polpacci)', sets: 4, reps: '15-20', weight: 16, rest: 60, notes: 'Massimo allungamento in basso' },
      { id: 'e10', name: 'Plank Addominale + Hollow Hold', sets: 3, reps: '45-60 sec', weight: 0, rest: 60, notes: 'Corpo libero - retroversione del bacino' },
    ],
  },
  {
    id: 'wo-c',
    dayLabel: 'Giorno C',
    title: 'Upper Pull & Braccia',
    focus: 'Dorsali, Deltoidi Posteriori, Bicipiti e Richiamo Braccia',
    exercises: [
      { id: 'e11', name: 'Rematore con Manubri a Busto Flesso', sets: 4, reps: '8-10', weight: 20, rest: 120, notes: 'Porta i manubri verso le tasche, scapole addotte' },
      { id: 'e12', name: 'Rematore Singolo con Appoggio (One-Arm Row)', sets: 3, reps: '10-12 / lato', weight: 24, rest: 90, notes: 'Zero slancio, massimo allungamento in basso' },
      { id: 'e13', name: 'Alzate Posteriori a 90° (Rear Delt Fly)', sets: 4, reps: '12-15', weight: 7, rest: 60, notes: 'Controllo totale del movimento' },
      { id: 'e14', name: 'Curl Alternato con Manubri in Piedi', sets: 3, reps: '10-12', weight: 12, rest: 75, notes: 'Supinazione completa del polso in salita' },
      { id: 'e15', name: 'Hammer Curl (Presa a Martello)', sets: 3, reps: '12', weight: 12, rest: 60, notes: 'Ottimo per brachiale e avambracci' },
    ],
  },
];

const INITIAL_TARGETS = {
  kcal: 2550,
  p: 175,
  c: 295,
  g: 72,
};

const INITIAL_LAYOUT = {
  dashboard: ['daySelector', 'nutritionCard', 'weightCard', 'workoutsCard'],
  nutrition: ['subNav', 'mainContent'],
  planner: ['summaryCard', 'mealSlotsGrid'],
  composer: ['composerForm', 'savedMealsList'],
  foods: ['addFoodForm', 'foodsList'],
  weight: ['addWeightForm', 'weightChartCard'],
  workout: ['workoutHeader', 'exercisesList'],
};

const STORAGE_KEY = 'fittrack_pro_data_v1';

function normalizeData(raw) {
  const safe = raw && typeof raw === 'object' ? raw : {};
  const layout = safe.layout && typeof safe.layout === 'object' ? safe.layout : {};
  const bg = safe.background && typeof safe.background === 'object' ? safe.background : {};
  return {
    foods: Array.isArray(safe.foods) ? safe.foods : INITIAL_FOODS,
    meals: Array.isArray(safe.meals) ? safe.meals : INITIAL_MEALS,
    weeklyPlan: safe.weeklyPlan && typeof safe.weeklyPlan === 'object' ? safe.weeklyPlan : INITIAL_WEEKLY_PLAN,
    weights: Array.isArray(safe.weights) ? safe.weights : INITIAL_WEIGHTS,
    workouts: Array.isArray(safe.workouts) && safe.workouts.length > 0 ? safe.workouts : INITIAL_WORKOUTS,
    targets: safe.targets && typeof safe.targets === 'object' ? { ...INITIAL_TARGETS, ...safe.targets } : INITIAL_TARGETS,
    theme: safe.theme === 'light' ? 'light' : 'dark',
    betweenExerciseRest: typeof safe.betweenExerciseRest === 'number' ? safe.betweenExerciseRest : 180,
    background: {
      type: ['default', 'preset', 'color', 'image'].includes(bg.type) ? bg.type : INITIAL_BACKGROUND.type,
      presetId: typeof bg.presetId === 'string' ? bg.presetId : INITIAL_BACKGROUND.presetId,
      color: typeof bg.color === 'string' ? bg.color : INITIAL_BACKGROUND.color,
      imageUrl: typeof bg.imageUrl === 'string' ? bg.imageUrl : INITIAL_BACKGROUND.imageUrl,
      overlayOpacity: typeof bg.overlayOpacity === 'number' ? bg.overlayOpacity : INITIAL_BACKGROUND.overlayOpacity,
    },
    layout: {
      dashboard: Array.isArray(layout.dashboard) ? layout.dashboard : INITIAL_LAYOUT.dashboard,
      nutrition: Array.isArray(layout.nutrition) ? layout.nutrition : INITIAL_LAYOUT.nutrition,
      planner: Array.isArray(layout.planner) ? layout.planner : INITIAL_LAYOUT.planner,
      composer: Array.isArray(layout.composer) ? layout.composer : INITIAL_LAYOUT.composer,
      foods: Array.isArray(layout.foods) ? layout.foods : INITIAL_LAYOUT.foods,
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
  const [bgModalOpen, setBgModalOpen] = useState(false);
  const [customImageInput, setCustomImageInput] = useState('');
  const bgFileInputRef = useRef(null);

  const toggleTheme = () => {
    setData((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const updateBackground = (patch) => {
    setData((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        ...patch,
      },
    }));
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1440;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
        updateBackground({ type: 'image', imageUrl: compressedDataUrl });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
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

  const [activeTab, setActiveTab] = useState('dashboard');
  const [nutritionSubTab, setNutritionSubTab] = useState('planner');
  const [selectedDay, setSelectedDay] = useState(() => {
    const jsDay = new Date().getDay();
    return jsDay === 0 ? 'Dom' : DAYS[jsDay - 1];
  });

  const [activeWorkoutId, setActiveWorkoutId] = useState('wo-a');
  const [workoutMode, setWorkoutMode] = useState('live');
  const [completedSets, setCompletedSets] = useState({});
  const [autoStartTimer, setAutoStartTimer] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerInitial, setTimerInitial] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinishedAlert, setTimerFinishedAlert] = useState(false);
  const [timerType, setTimerType] = useState('set'); // 'set' | 'exercise'

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

  const startTimer = (seconds, type = 'set') => {
    setTimerFinishedAlert(false);
    setTimerType(type);
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
    if (!meal) return { kcal: 0, p: 0, c: 0, g: 0 };
    return meal.items.reduce(
      (acc, item) => {
        const food = getFoodById(item.foodId);
        if (!food) return acc;
        return {
          kcal: acc.kcal + food.kcal * item.qty,
          p: acc.p + food.p * item.qty,
          c: acc.c + food.c * item.qty,
          g: acc.g + food.g * item.qty,
        };
      },
      { kcal: 0, p: 0, c: 0, g: 0 }
    );
  };

  const getDayMacros = (dayKey) => {
    const plan = data.weeklyPlan[dayKey] || {};
    let totals = { kcal: 0, p: 0, c: 0, g: 0 };
    MEAL_SLOTS.forEach((slot) => {
      const mealIds = plan[slot] || [];
      mealIds.forEach((mId) => {
        const meal = data.meals.find((m) => m.id === mId);
        const mMacros = getMealMacros(meal);
        totals.kcal += mMacros.kcal;
        totals.p += mMacros.p;
        totals.c += mMacros.c;
        totals.g += mMacros.g;
      });
    });
    return {
      kcal: Math.round(totals.kcal),
      p: Math.round(totals.p),
      c: Math.round(totals.c),
      g: Math.round(totals.g),
    };
  };

  const [newFood, setNewFood] = useState({ name: '', kcal: '', p: '', c: '', g: '' });
  const [mealName, setMealName] = useState('');
  const [mealItems, setMealItems] = useState([]);
  const [selectedFoodToAdd, setSelectedFoodToAdd] = useState('');
  const [selectedFoodQty, setSelectedFoodQty] = useState('1');
  const [newWeight, setNewWeight] = useState('');
  const [newWeightDate, setNewWeightDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newWeightNote, setNewWeightNote] = useState('');
  const [editingTargets, setEditingTargets] = useState(false);
  const [tempTargets, setTempTargets] = useState(data.targets);
  const [copyTargetDay, setCopyTargetDay] = useState('Mar');
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '3',
    reps: '10-12',
    weight: '12',
    rest: '90',
    notes: '',
  });

  const fileInputRef = useRef(null);

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name.trim()) return;
    const created = {
      id: 'f-' + Date.now(),
      name: newFood.name.trim(),
      kcal: Number(newFood.kcal) || 0,
      p: Number(newFood.p) || 0,
      c: Number(newFood.c) || 0,
      g: Number(newFood.g) || 0,
    };
    setData((prev) => ({ ...prev, foods: [created, ...prev.foods] }));
    setNewFood({ name: '', kcal: '', p: '', c: '', g: '' });
  };

  const handleDeleteFood = (id) => {
    setData((prev) => ({
      ...prev,
      foods: prev.foods.filter((f) => f.id !== id),
    }));
  };

  const handleAddIngredientToComposer = () => {
    const fId = selectedFoodToAdd || (data.foods[0] && data.foods[0].id);
    if (!fId) return;
    const qty = parseFloat(selectedFoodQty) || 1;
    setMealItems((prev) => [...prev, { foodId: fId, qty }]);
    setSelectedFoodQty('1');
  };

  const handleSaveComposedMeal = (e) => {
    e.preventDefault();
    if (!mealName.trim() || mealItems.length === 0) return;
    const createdMeal = {
      id: 'm-' + Date.now(),
      name: mealName.trim(),
      items: mealItems,
    };
    setData((prev) => ({ ...prev, meals: [createdMeal, ...prev.meals] }));
    setMealName('');
    setMealItems([]);
    setNutritionSubTab('planner');
  };

  const assignMealToSlot = (day, slot, mealId) => {
    if (!mealId) return;
    setData((prev) => {
      const currentSlot = prev.weeklyPlan[day]?.[slot] || [];
      return {
        ...prev,
        weeklyPlan: {
          ...prev.weeklyPlan,
          [day]: {
            ...prev.weeklyPlan[day],
            [slot]: [...currentSlot, mealId],
          },
        },
      };
    });
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
    const entry = {
      id: 'w-' + Date.now(),
      date: newWeightDate,
      weight: Number(val.toFixed(1)),
      note: newWeightNote.trim(),
    };
    setData((prev) => ({
      ...prev,
      weights: [...prev.weights, entry].sort((a, b) => a.date.localeCompare(b.date)),
    }));
    setNewWeight('');
    setNewWeightNote('');
  };

  const handleDeleteWeight = (id) => {
    setData((prev) => ({
      ...prev,
      weights: prev.weights.filter((w) => w.id !== id),
    }));
  };

  const toggleSetCompleted = (exercise, setIndex) => {
    const key = `${exercise.id}-${setIndex}`;
    const nextState = !completedSets[key];
    const nextCompleted = { ...completedSets, [key]: nextState };
    setCompletedSets(nextCompleted);

    if (nextState && autoStartTimer) {
      // Controlla se tutte le serie di questo esercizio sono ora completate
      let allDone = true;
      for (let i = 0; i < exercise.sets; i++) {
        if (!nextCompleted[`${exercise.id}-${i}`]) {
          allDone = false;
          break;
        }
      }
      if (allDone) {
        startTimer(data.betweenExerciseRest || 180, 'exercise');
      } else {
        startTimer(exercise.rest || 90, 'set');
      }
    }
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

  const handleAddExercise = (e) => {
    e.preventDefault();
    if (!newExercise.name.trim()) return;
    const created = {
      id: 'ex-' + Date.now(),
      name: newExercise.name.trim(),
      sets: Math.max(1, parseInt(newExercise.sets, 10) || 3),
      reps: newExercise.reps.trim() || '10',
      weight: Math.max(0, parseFloat(newExercise.weight) || 0),
      rest: Math.max(15, parseInt(newExercise.rest, 10) || 90),
      notes: newExercise.notes.trim(),
    };
    setData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((wo) =>
        wo.id === activeWorkoutId ? { ...wo, exercises: [...wo.exercises, created] } : wo
      ),
    }));
    setNewExercise({ name: '', sets: '3', reps: '10-12', weight: '12', rest: '90', notes: '' });
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

  // --- FUNZIONI DI RESET A ZERO PER OGNI PAGINA ---
  const handleResetDashboardPage = () => {
    if (!window.confirm(`Vuoi azzerare a 0 i pasti di ${FULL_DAYS[selectedDay]} e le spunte delle serie?`)) return;
    setData((prev) => ({
      ...prev,
      weeklyPlan: {
        ...prev.weeklyPlan,
        [selectedDay]: { Colazione: [], Pranzo: [], Cena: [], Spuntini: [] },
      },
    }));
    setCompletedSets({});
    setTimerRunning(false);
    setTimerFinishedAlert(false);
    setTimerSeconds(0);
  };

  const handleResetNutritionSubPage = () => {
    if (nutritionSubTab === 'planner') {
      if (!window.confirm('Vuoi azzerare a 0 tutti i pasti pianificati dell’intera settimana?')) return;
      setData((prev) => ({
        ...prev,
        weeklyPlan: JSON.parse(JSON.stringify(EMPTY_WEEKLY_PLAN)),
      }));
    } else if (nutritionSubTab === 'composer') {
      if (!window.confirm('Vuoi eliminare tutti i pasti composti salvati (portandoli a 0)?')) return;
      setData((prev) => ({
        ...prev,
        meals: [],
        weeklyPlan: JSON.parse(JSON.stringify(EMPTY_WEEKLY_PLAN)),
      }));
      setMealName('');
      setMealItems([]);
    } else if (nutritionSubTab === 'foods') {
      if (!window.confirm('Vuoi azzerare a 0 tutto il database alimenti?')) return;
      setData((prev) => ({
        ...prev,
        foods: [],
      }));
      setNewFood({ name: '', kcal: '', p: '', c: '', g: '' });
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
    a.download = `fittrack-backup-${new Date().toISOString().split('T')[0]}.json`;
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
        workouts: INITIAL_WORKOUTS,
        targets: INITIAL_TARGETS,
        theme: prev.theme,
        background: prev.background,
        layout: INITIAL_LAYOUT,
        betweenExerciseRest: 180,
      })
    );
    setCompletedSets({});
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

  const getWrapperBackgroundStyle = () => {
    const bg = data.background || INITIAL_BACKGROUND;
    if (bg.type === 'preset') {
      const found = PRESET_BACKGROUNDS.find((p) => p.id === bg.presetId) || PRESET_BACKGROUNDS[0];
      return { background: found.css, backgroundAttachment: 'fixed' };
    }
    if (bg.type === 'color') {
      return { backgroundColor: bg.color || '#0b132b' };
    }
    if (bg.type === 'image' && bg.imageUrl) {
      const op = typeof bg.overlayOpacity === 'number' ? bg.overlayOpacity : 0.55;
      const overlayColor = isLight ? `rgba(248, 250, 252, ${op})` : `rgba(2, 6, 23, ${op})`;
      return {
        backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor}), url("${bg.imageUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    return {};
  };

  const hasCustomBg = data.background?.type && data.background.type !== 'default';

  const cCard = isLight
    ? hasCustomBg
      ? 'bg-white/88 backdrop-blur-md border-slate-200/90 shadow-sm'
      : 'bg-white border-slate-200 shadow-sm'
    : hasCustomBg
    ? 'bg-slate-900/82 backdrop-blur-md border-slate-800/90 shadow-lg'
    : 'bg-slate-900/80 border-slate-800';

  const cInner = isLight
    ? hasCustomBg
      ? 'bg-slate-50/85 border-slate-200/90'
      : 'bg-slate-50 border-slate-200/90'
    : hasCustomBg
    ? 'bg-slate-950/75 border-slate-800/90'
    : 'bg-slate-950/90 border-slate-800';

  const cInput = isLight
    ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
    : 'bg-slate-950 border-slate-800 text-white placeholder:text-slate-500';
  const cTextPrimary = isLight ? 'text-slate-900' : 'text-slate-100';
  const cTextSecondary = isLight ? 'text-slate-500' : 'text-slate-400';

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
              : 'ring-2 ring-amber-500/50 rounded-2xl p-1.5 bg-amber-500/10 backdrop-blur-sm'
            : ''
        }`}
      >
        {reorderMode && (
          <div
            className={`mb-2 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-semibold border ${
              isLight
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-slate-900 border-amber-500/40 text-amber-300'
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
                className={`p-1 rounded-lg border transition disabled:opacity-30 ${
                  isLight
                    ? 'bg-white border-amber-300 hover:bg-amber-200 text-amber-900'
                    : 'bg-slate-950 border-slate-700 hover:bg-slate-800 text-white'
                }`}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={isLast}
                onClick={() => moveSection(groupKey, sectionId, 1)}
                title="Sposta giù / dopo"
                className={`p-1 rounded-lg border transition disabled:opacity-30 ${
                  isLight
                    ? 'bg-white border-amber-300 hover:bg-amber-200 text-amber-900'
                    : 'bg-slate-950 border-slate-700 hover:bg-slate-800 text-white'
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
          className={`h-32 flex items-center justify-center text-sm border border-dashed rounded-xl ${
            isLight ? 'text-slate-400 border-slate-300' : 'text-slate-500 border-slate-800'
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

    const gridColor = isLight ? '#cbd5e1' : '#1e293b';
    const dotFill = isLight ? '#ffffff' : '#090d16';
    const labelColor = isLight ? '#0f172a' : '#e2e8f0';
    const dateColor = isLight ? '#64748b' : '#94a3b8';

    return (
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke={gridColor} strokeDasharray="4 4" />
          <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke={gridColor} strokeDasharray="4 4" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke={gridColor} />
          <polygon points={areaPoints} fill="url(#weightGrad)" />
          <polyline fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={polylinePoints} />
          {points.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="4.5" fill={dotFill} stroke="#10b981" strokeWidth="2.5" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill={labelColor} fontSize="11" fontWeight="600">
                {p.weight}
              </text>
              <text x={p.x} y={height - 4} textAnchor="middle" fill={dateColor} fontSize="10">
                {p.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  // --- BLOCCHI RENDERIZZABILI PER DASHBOARD ---
  const dashboardSections = {
    daySelector: renderReorderWrapper(
      'dashboard',
      'daySelector',
      'Selettore Giorno',
      <div className={`${cCard} border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-500" />
            Riepilogo Giornaliero
          </h2>
          <p className={`text-xs ${cTextSecondary}`}>Visualizza macro e stato workout per il giorno selezionato</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex gap-1 ${cInner} p-1 rounded-xl border overflow-x-auto`}>
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedDay === d
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={handleResetDashboardPage}
            title={`Azzera a 0 i pasti di ${FULL_DAYS[selectedDay]} e le serie completate`}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-semibold transition"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Azzera a 0</span>
          </button>
        </div>
      </div>
    ),

    nutritionCard: renderReorderWrapper(
      'dashboard',
      'nutritionCard',
      'Card Alimentazione',
      <div className={`${cCard} border rounded-2xl p-5 flex flex-col justify-between`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Utensils className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className={`font-semibold ${cTextPrimary}`}>Alimentazione — {FULL_DAYS[selectedDay]}</h3>
              <p className={`text-xs ${cTextSecondary}`}>Bilancio energetico e macronutrienti</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('nutrition')}
            className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1 font-medium"
          >
            Apri Piano <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className={`${cInner} border rounded-xl p-4 mb-4`}>
          <div className="flex justify-between items-baseline mb-2">
            <span className={`text-xs uppercase tracking-wider font-semibold ${cTextSecondary}`}>Calorie Pianificate</span>
            <div className="text-right">
              <span className={`text-2xl font-bold ${cTextPrimary}`}>{dayMacros.kcal}</span>
              <span className={`text-xs ${cTextSecondary}`}> / {data.targets.kcal} kcal</span>
            </div>
          </div>
          <div className={`w-full h-3 ${isLight ? 'bg-slate-200' : 'bg-slate-800'} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((dayMacros.kcal / (data.targets.kcal || 1)) * 100))}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Proteine', val: dayMacros.p, target: data.targets.p, color: 'bg-sky-500' },
            { label: 'Carboidrati', val: dayMacros.c, target: data.targets.c, color: 'bg-amber-500' },
            { label: 'Grassi', val: dayMacros.g, target: data.targets.g, color: 'bg-rose-500' },
          ].map((m) => {
            const pct = Math.min(100, Math.round((m.val / (m.target || 1)) * 100));
            return (
              <div key={m.label} className={`${cInner} border rounded-xl p-3`}>
                <div className={`text-xs ${cTextSecondary} mb-1`}>{m.label}</div>
                <div className={`font-bold text-base ${cTextPrimary}`}>
                  {m.val}g <span className={`text-xs font-normal ${cTextSecondary}`}>/ {m.target}g</span>
                </div>
                <div className={`w-full h-1.5 ${isLight ? 'bg-slate-200' : 'bg-slate-800'} rounded-full mt-2 overflow-hidden`}>
                  <div className={`h-full ${m.color} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ),

    weightCard: renderReorderWrapper(
      'dashboard',
      'weightCard',
      'Card Peso Corporeo',
      <div className={`${cCard} border rounded-2xl p-5 flex flex-col justify-between`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Scale className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className={`font-semibold ${cTextPrimary}`}>Peso Corporeo</h3>
              <p className={`text-xs ${cTextSecondary}`}>Check-in settimanale</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('nutrition');
              setNutritionSubTab('weight');
            }}
            className="text-xs text-emerald-500 hover:text-emerald-400 flex items-center gap-1 font-medium"
          >
            Dettagli <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {latestWeight ? (
          <div className="flex items-baseline gap-3 mb-3">
            <span className={`text-3xl font-bold ${cTextPrimary}`}>{latestWeight.weight} kg</span>
            {weightDeltaTotal !== null && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  Number(weightDeltaTotal) <= 0
                    ? 'bg-emerald-500/15 text-emerald-500'
                    : 'bg-amber-500/15 text-amber-500'
                }`}
              >
                {Number(weightDeltaTotal) > 0 ? `+${weightDeltaTotal}` : weightDeltaTotal} kg tot
              </span>
            )}
          </div>
        ) : (
          <p className={`text-sm ${cTextSecondary} mb-3`}>Nessuna pesata registrata</p>
        )}

        {renderWeightChart(135)}
      </div>
    ),

    workoutsCard: renderReorderWrapper(
      'dashboard',
      'workoutsCard',
      'Schede Allenamento',
      <div className={`${cCard} border rounded-2xl p-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
              <Dumbbell className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className={`font-semibold ${cTextPrimary}`}>Schede Allenamento (3x Settimana • Manubri + Corpo Libero)</h3>
              <p className={`text-xs ${cTextSecondary}`}>Scegli la sessione di oggi per avviare il tracker serie e il timer di recupero</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {data.workouts.map((wo) => (
            <div
              key={wo.id}
              className={`${cInner} border hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between transition`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                    {wo.dayLabel}
                  </span>
                  <span className={`text-xs ${cTextSecondary}`}>{wo.exercises.length} esercizi</span>
                </div>
                <h4 className={`font-semibold text-base ${cTextPrimary}`}>{wo.title}</h4>
                <p className={`text-xs ${cTextSecondary} mt-1 line-clamp-2`}>{wo.focus}</p>
              </div>

              <button
                onClick={() => {
                  setActiveWorkoutId(wo.id);
                  setWorkoutMode('live');
                  setActiveTab('workout');
                }}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Inizia Workout
              </button>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  // --- BLOCCHI PER ALIMENTAZIONE ---
  const plannerSections = {
    summaryCard: renderReorderWrapper(
      'planner',
      'summaryCard',
      'Riepilogo Giorno & Copia',
      <div className={`${cCard} border rounded-2xl p-4 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {DAYS.map((d) => {
              const m = getDayMacros(d);
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex flex-col items-center min-w-[58px] border transition ${
                    selectedDay === d
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500'
                      : `${cInner} ${cTextSecondary}`
                  }`}
                >
                  <span>{d}</span>
                  <span className="text-[10px] opacity-75 mt-0.5">{m.kcal}</span>
                </button>
              );
            })}
          </div>

          <div className={`flex items-center gap-2 ${cInner} p-1.5 rounded-xl border`}>
            <span className={`text-xs ${cTextSecondary} pl-2`}>Copia su:</span>
            <select
              value={copyTargetDay}
              onChange={(e) => setCopyTargetDay(e.target.value)}
              className={`${cInput} text-xs rounded-lg px-2 py-1.5 border focus:outline-none`}
            >
              {DAYS.filter((d) => d !== selectedDay).map((d) => (
                <option key={d} value={d}>
                  {FULL_DAYS[d]}
                </option>
              ))}
            </select>
            <button
              onClick={handleCopyDayPlan}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 text-xs font-semibold transition"
            >
              <Copy className="w-3.5 h-3.5" /> Copia
            </button>
          </div>
        </div>

        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'}`}>
          <div className={`${cInner} rounded-xl p-3 border`}>
            <div className={`text-xs ${cTextSecondary}`}>Calorie Totali</div>
            <div className="text-lg font-bold text-emerald-500">
              {dayMacros.kcal} <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.kcal}</span>
            </div>
          </div>
          <div className={`${cInner} rounded-xl p-3 border`}>
            <div className={`text-xs ${cTextSecondary}`}>Proteine</div>
            <div className="text-lg font-bold text-sky-500">
              {dayMacros.p}g <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.p}g</span>
            </div>
          </div>
          <div className={`${cInner} rounded-xl p-3 border`}>
            <div className={`text-xs ${cTextSecondary}`}>Carboidrati</div>
            <div className="text-lg font-bold text-amber-500">
              {dayMacros.c}g <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.c}g</span>
            </div>
          </div>
          <div className={`${cInner} rounded-xl p-3 border`}>
            <div className={`text-xs ${cTextSecondary}`}>Grassi</div>
            <div className="text-lg font-bold text-rose-500">
              {dayMacros.g}g <span className={`text-xs font-normal ${cTextSecondary}`}>/ {data.targets.g}g</span>
            </div>
          </div>
        </div>
      </div>
    ),

    mealSlotsGrid: renderReorderWrapper(
      'planner',
      'mealSlotsGrid',
      'Slot Pasti Giornalieri',
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MEAL_SLOTS.map((slot) => {
          const assignedMealIds = data.weeklyPlan[selectedDay]?.[slot] || [];
          return (
            <div
              key={slot}
              className={`${cCard} border rounded-2xl p-4 flex flex-col justify-between space-y-3`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold ${cTextPrimary}`}>{slot}</h4>
                  <span className={`text-xs ${cTextSecondary}`}>
                    {assignedMealIds.length} {assignedMealIds.length === 1 ? 'pasto' : 'pasti'}
                  </span>
                </div>

                {assignedMealIds.length === 0 ? (
                  <p className={`text-xs ${cTextSecondary} italic py-3 text-center border border-dashed ${isLight ? 'border-slate-300' : 'border-slate-800'} rounded-xl`}>
                    Nessun pasto assegnato a {slot.toLowerCase()}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {assignedMealIds.map((mId, idx) => {
                      const meal = data.meals.find((m) => m.id === mId);
                      if (!meal) return null;
                      const macros = getMealMacros(meal);
                      return (
                        <div
                          key={`${mId}-${idx}`}
                          className={`${cInner} border rounded-xl p-3 flex items-start justify-between gap-2`}
                        >
                          <div>
                            <div className={`font-medium text-sm ${cTextPrimary}`}>{meal.name}</div>
                            <div className={`text-[11px] ${cTextSecondary} mt-1 flex flex-wrap gap-2`}>
                              <span className="text-emerald-500 font-semibold">{Math.round(macros.kcal)} kcal</span>
                              <span>• P: {Math.round(macros.p)}g</span>
                              <span>• C: {Math.round(macros.c)}g</span>
                              <span>• G: {Math.round(macros.g)}g</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeMealFromSlot(selectedDay, slot, idx)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'} flex gap-2`}>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      assignMealToSlot(selectedDay, slot, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className={`flex-1 ${cInput} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500`}
                >
                  <option value="" disabled>
                    + Assegna un pasto composto...
                  </option>
                  {data.meals.map((m) => {
                    const mm = getMealMacros(m);
                    return (
                      <option key={m.id} value={m.id}>
                        {m.name} ({Math.round(mm.kcal)} kcal • {Math.round(mm.p)}g P)
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    ),
  };

  const composerSections = {
    composerForm: renderReorderWrapper(
      'composer',
      'composerForm',
      'Crea Nuovo Pasto',
      <div className={`${cCard} border rounded-2xl p-5 space-y-4`}>
        <h3 className="font-semibold text-base text-emerald-500">Componi un Nuovo Pasto Ricorrente</h3>
        <form onSubmit={handleSaveComposedMeal} className="space-y-4">
          <div>
            <label className={`block text-xs ${cTextSecondary} mb-1`}>Nome del Pasto</label>
            <input
              type="text"
              required
              placeholder="Es. Colazione Yogurt Greco & Muesli"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className={`w-full ${cInput} border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500`}
            />
          </div>

          <div className={`${cInner} border rounded-xl p-3.5 space-y-3`}>
            <label className={`block text-xs font-medium ${cTextPrimary}`}>
              Aggiungi Ingredienti dal Database Alimenti
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedFoodToAdd || (data.foods[0]?.id ?? '')}
                onChange={(e) => setSelectedFoodToAdd(e.target.value)}
                className={`flex-1 ${cInput} border rounded-xl px-3 py-2 text-xs focus:outline-none`}
              >
                {data.foods.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.kcal} kcal | {f.p}P {f.c}C {f.g}G)
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={selectedFoodQty}
                  onChange={(e) => setSelectedFoodQty(e.target.value)}
                  className={`w-20 ${cInput} border rounded-xl px-2.5 py-2 text-xs text-center`}
                />
                <button
                  type="button"
                  onClick={handleAddIngredientToComposer}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Aggiungi
                </button>
              </div>
            </div>
          </div>

          {mealItems.length > 0 && (
            <div className="space-y-2">
              <div className={`text-xs font-semibold ${cTextSecondary}`}>Ingredienti nel pasto:</div>
              {mealItems.map((it, idx) => {
                const food = getFoodById(it.foodId);
                if (!food) return null;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between ${cInner} px-3 py-2 rounded-xl border text-xs`}
                  >
                    <span>
                      <strong className="text-emerald-500">{it.qty}x</strong> {food.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className={cTextSecondary}>
                        {Math.round(food.kcal * it.qty)} kcal • {Math.round(food.p * it.qty)}g P
                      </span>
                      <button
                        type="button"
                        onClick={() => setMealItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500"
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
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex flex-wrap justify-between items-center text-xs">
                    <span className="font-semibold text-emerald-500">Totale Pasto:</span>
                    <div className="flex gap-3 font-bold">
                      <span className={cTextPrimary}>{Math.round(previewMacros.kcal)} kcal</span>
                      <span className="text-sky-500">P: {Math.round(previewMacros.p)}g</span>
                      <span className="text-amber-500">C: {Math.round(previewMacros.c)}g</span>
                      <span className="text-rose-500">G: {Math.round(previewMacros.g)}g</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <button
            type="submit"
            disabled={!mealName.trim() || mealItems.length === 0}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-bold text-sm transition"
          >
            Salva Pasto nel Ricettario
          </button>
        </form>
      </div>
    ),

    savedMealsList: renderReorderWrapper(
      'composer',
      'savedMealsList',
      'Pasti Già Pronti',
      <div className={`${cCard} border rounded-2xl p-5 space-y-3`}>
        <h3 className={`font-semibold text-base ${cTextPrimary}`}>Pasti Già Pronti ({data.meals.length})</h3>
        {data.meals.length === 0 ? (
          <p className={`text-xs ${cTextSecondary} italic py-6 text-center`}>Nessun pasto composto salvato.</p>
        ) : (
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {data.meals.map((meal) => {
              const m = getMealMacros(meal);
              return (
                <div key={meal.id} className={`${cInner} border rounded-xl p-3.5 space-y-2`}>
                  <div className="flex items-start justify-between">
                    <h4 className={`font-semibold text-sm ${cTextPrimary}`}>{meal.name}</h4>
                    <button
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          meals: prev.meals.filter((x) => x.id !== meal.id),
                        }))
                      }
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={`text-xs ${cTextSecondary} space-y-0.5`}>
                    {meal.items.map((it, i) => {
                      const f = getFoodById(it.foodId);
                      return f ? (
                        <div key={i}>
                          • {it.qty}x {f.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className={`pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'} flex gap-3 text-xs font-semibold`}>
                    <span className="text-emerald-500">{Math.round(m.kcal)} kcal</span>
                    <span className="text-sky-500">{Math.round(m.p)}g P</span>
                    <span className="text-amber-500">{Math.round(m.c)}g C</span>
                    <span className="text-rose-500">{Math.round(m.g)}g G</span>
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
      'Aggiungi Alimento',
      <div className={`${cCard} border rounded-2xl p-5 h-fit`}>
        <h3 className="font-semibold text-base text-emerald-500 mb-3">Aggiungi Alimento al Database</h3>
        <form onSubmit={handleAddFood} className="space-y-3">
          <div>
            <label className={`block text-xs ${cTextSecondary} mb-1`}>Nome Alimento &amp; Porzione</label>
            <input
              type="text"
              required
              placeholder="Es. Fiocchi di Latte (200g)"
              value={newFood.name}
              onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Calorie (kcal)</label>
              <input
                type="number"
                required
                placeholder="190"
                value={newFood.kcal}
                onChange={(e) => setNewFood({ ...newFood, kcal: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
              />
            </div>
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Proteine (g)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="24"
                value={newFood.p}
                onChange={(e) => setNewFood({ ...newFood, p: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
              />
            </div>
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Carboidrati (g)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="6"
                value={newFood.c}
                onChange={(e) => setNewFood({ ...newFood, c: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
              />
            </div>
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Grassi (g)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="8"
                value={newFood.g}
                onChange={(e) => setNewFood({ ...newFood, g: e.target.value })}
                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition"
          >
            Salva Alimento
          </button>
        </form>
      </div>
    ),

    foodsList: renderReorderWrapper(
      'foods',
      'foodsList',
      'Alimenti Salvati',
      <div className={`${cCard} border rounded-2xl p-5`}>
        <h3 className={`font-semibold text-base ${cTextPrimary} mb-3`}>Alimenti Salvati ({data.foods.length})</h3>
        {data.foods.length === 0 ? (
          <p className={`text-xs ${cTextSecondary} italic py-6 text-center`}>Nessun alimento salvato nel database.</p>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {data.foods.map((food) => (
              <div
                key={food.id}
                className={`${cInner} border rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2`}
              >
                <div>
                  <div className={`font-medium text-sm ${cTextPrimary}`}>{food.name}</div>
                  <div className={`text-xs ${cTextSecondary} flex gap-3 mt-0.5`}>
                    <span className="text-emerald-500 font-semibold">{food.kcal} kcal</span>
                    <span>P: {food.p}g</span>
                    <span>C: {food.c}g</span>
                    <span>G: {food.g}g</span>
                  </div>
                </div>
                <button onClick={() => handleDeleteFood(food.id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    ),
  };

  const weightSections = {
    addWeightForm: renderReorderWrapper(
      'weight',
      'addWeightForm',
      'Registra Pesata',
      <div className={`${cCard} border rounded-2xl p-5 space-y-4 h-fit`}>
        <h3 className="font-semibold text-base text-emerald-500 flex items-center gap-2">
          <Scale className="w-4 h-4" /> Registra Pesata Settimanale
        </h3>
        <form onSubmit={handleAddWeight} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Peso (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                placeholder="77.0"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500`}
              />
            </div>
            <div>
              <label className={`block text-xs ${cTextSecondary} mb-1`}>Data</label>
              <input
                type="date"
                required
                value={newWeightDate}
                onChange={(e) => setNewWeightDate(e.target.value)}
                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
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
              className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm transition"
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
      <div className={`${cCard} border rounded-2xl p-5 space-y-5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className={`font-semibold text-base ${cTextPrimary}`}>Andamento nel Tempo</h3>
            <p className={`text-xs ${cTextSecondary}`}>Monitoraggio progressivo del peso</p>
          </div>
          <div className="flex gap-2">
            {weightDeltaLast !== null && (
              <span className={`text-xs px-2.5 py-1 rounded-lg ${cInner} border ${cTextSecondary}`}>
                Ultima:{' '}
                <strong className="text-emerald-500">
                  {Number(weightDeltaLast) > 0 ? `+${weightDeltaLast}` : weightDeltaLast} kg
                </strong>
              </span>
            )}
            {weightDeltaTotal !== null && (
              <span className={`text-xs px-2.5 py-1 rounded-lg ${cInner} border ${cTextSecondary}`}>
                Totale:{' '}
                <strong className="text-sky-500">
                  {Number(weightDeltaTotal) > 0 ? `+${weightDeltaTotal}` : weightDeltaTotal} kg
                </strong>
              </span>
            )}
          </div>
        </div>

        {renderWeightChart(175)}

        <div className={`space-y-2 pt-2 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
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
                <button onClick={() => handleDeleteWeight(w.id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg">
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
      <div className={`${cCard} border rounded-2xl p-4 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {data.workouts.map((wo) => (
              <button
                key={wo.id}
                onClick={() => setActiveWorkoutId(wo.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                  activeWorkoutId === wo.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                    : `${cInner} ${cTextSecondary}`
                }`}
              >
                {wo.dayLabel}: {wo.title.split('(')[0].trim()}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setWorkoutMode(workoutMode === 'live' ? 'edit' : 'live')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                workoutMode === 'edit'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                  : `${cInner} ${cTextPrimary}`
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {workoutMode === 'edit' ? 'Torna a Workout Live' : 'Modifica Scheda'}
            </button>

            <button
              onClick={handleResetWorkoutPage}
              title="Azzera a 0 spunte, carichi (kg) e timer di questa scheda"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 transition"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Azzera a 0</span>
            </button>
          </div>
        </div>

        {currentWorkout && (
          <div className={`pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800/80'} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
            <div>
              <h2 className={`text-lg font-bold ${cTextPrimary}`}>
                {currentWorkout.dayLabel} — {currentWorkout.title}
              </h2>
              <p className={`text-xs ${cTextSecondary}`}>{currentWorkout.focus}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Selettore durata pausa tra esercizi */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl ${cInner} border text-xs`}>
                <SkipForward className="w-3.5 h-3.5 text-amber-500" />
                <span className={cTextSecondary}>Pausa cambio es.:</span>
                <select
                  value={data.betweenExerciseRest || 180}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, betweenExerciseRest: Number(e.target.value) }))
                  }
                  className="bg-transparent font-bold text-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value={120}>2m (120s)</option>
                  <option value={150}>2m30 (150s)</option>
                  <option value={180}>3m (180s)</option>
                  <option value={240}>4m (240s)</option>
                </select>
              </div>

              <div className="text-right">
                <div className={`text-xs ${cTextSecondary}`}>Serie Completate</div>
                <div className="text-sm font-bold text-indigo-500">
                  {completedSetsInWorkout} / {totalSetsInWorkout}
                </div>
              </div>
              {completedSetsInWorkout > 0 && (
                <button
                  onClick={() => setCompletedSets({})}
                  className={`text-xs px-2.5 py-1.5 rounded-lg ${cInner} border ${cTextSecondary}`}
                >
                  Azzera Spunte
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    ),

    exercisesList: renderReorderWrapper(
      'workout',
      'exercisesList',
      'Elenco Esercizi',
      currentWorkout ? (
        <div className="space-y-3.5">
          {currentWorkout.exercises.map((ex, exIdx) => (
            <div
              key={ex.id}
              className={`${cCard} border rounded-2xl p-4 sm:p-5 space-y-3.5`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      #{exIdx + 1}
                    </span>
                    <h3 className={`font-semibold text-base ${cTextPrimary}`}>{ex.name}</h3>
                  </div>
                  <div className={`flex flex-wrap items-center gap-3 text-xs ${cTextSecondary} mt-1.5`}>
                    <span>
                      <strong className={cTextPrimary}>{ex.sets}</strong> serie ×{' '}
                      <strong className={cTextPrimary}>{ex.reps}</strong> rip
                    </span>
                    <span className="flex items-center gap-1 text-indigo-500">
                      <Clock className="w-3.5 h-3.5" /> Serie: {ex.rest}s
                    </span>
                    <span className="flex items-center gap-1 text-amber-500">
                      <SkipForward className="w-3.5 h-3.5" /> Cambio es.: {data.betweenExerciseRest || 180}s
                    </span>
                  </div>
                  {ex.notes && <p className={`text-xs ${cTextSecondary} italic mt-1`}>Nota: {ex.notes}</p>}
                </div>

                <div className="flex items-center gap-2">
                  {ex.weight > 0 || workoutMode === 'edit' ? (
                    <div className={`flex items-center ${cInner} border rounded-xl p-1`}>
                      <button
                        onClick={() => updateExerciseWeight(currentWorkout.id, ex.id, -1)}
                        className={`w-7 h-7 flex items-center justify-center ${cTextSecondary} font-bold`}
                      >
                        -
                      </button>
                      <span className={`px-2 text-xs font-bold ${cTextPrimary} min-w-[52px] text-center`}>
                        {ex.weight === 0 ? 'BW' : `${ex.weight} kg`}
                      </span>
                      <button
                        onClick={() => updateExerciseWeight(currentWorkout.id, ex.id, +1)}
                        className={`w-7 h-7 flex items-center justify-center ${cTextSecondary} font-bold`}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl ${cInner} border ${cTextSecondary}`}>
                      Corpo Libero
                    </span>
                  )}

                  {workoutMode === 'edit' && (
                    <button
                      onClick={() => handleDeleteExercise(ex.id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {workoutMode === 'live' && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {Array.from({ length: ex.sets }).map((_, setIdx) => {
                    const isDone = !!completedSets[`${ex.id}-${setIdx}`];
                    return (
                      <button
                        key={setIdx}
                        onClick={() => toggleSetCompleted(ex, setIdx)}
                        className={`flex-1 min-w-[74px] py-3 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border transition active:scale-95 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-500/20'
                            : `${cInner} ${cTextPrimary}`
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-400" />}
                        Serie {setIdx + 1}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => startTimer(ex.rest || 90, 'set')}
                    title="Avvia pausa tra una serie e l'altra"
                    className="py-3 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-500 text-xs font-semibold flex items-center gap-1"
                  >
                    <Clock className="w-3.5 h-3.5" /> {ex.rest}s
                  </button>

                  <button
                    onClick={() => startTimer(data.betweenExerciseRest || 180, 'exercise')}
                    title="Avvia pausa di transizione al prossimo esercizio"
                    className="py-3 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-center gap-1"
                  >
                    <SkipForward className="w-3.5 h-3.5" /> Cambio Es.
                  </button>
                </div>
              )}
            </div>
          ))}

          {workoutMode === 'edit' && (
            <form
              onSubmit={handleAddExercise}
              className={`${cCard} border border-indigo-500/40 rounded-2xl p-5 space-y-3`}
            >
              <h4 className="font-semibold text-sm text-indigo-500">+ Aggiungi Esercizio a {currentWorkout.dayLabel}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nome esercizio (es. Croci con Manubri)"
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className={`${cInput} border rounded-xl px-3 py-2 text-sm`}
                />
                <input
                  type="text"
                  placeholder="Note tecniche (opzionale)"
                  value={newExercise.notes}
                  onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                  className={`${cInput} border rounded-xl px-3 py-2 text-sm`}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Serie</label>
                  <input
                    type="number"
                    min="1"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Ripetizioni</label>
                  <input
                    type="text"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Carico kg (0 = BW)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newExercise.weight}
                    onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] ${cTextSecondary} mb-1`}>Recupero (sec)</label>
                  <input
                    type="number"
                    step="15"
                    min="15"
                    value={newExercise.rest}
                    onChange={(e) => setNewExercise({ ...newExercise, rest: e.target.value })}
                    className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm`}
                  />
                </div>
              </div>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
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
      style={getWrapperBackgroundStyle()}
      className={`min-h-screen font-sans selection:bg-emerald-500/30 pb-32 transition-colors duration-200 ${
        !hasCustomBg ? (isLight ? 'bg-slate-100' : 'bg-slate-950') : ''
      } ${isLight ? 'text-slate-900' : 'text-slate-100'}`}
    >
      {/* HEADER */}
      <header
        className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors ${
          isLight
            ? 'bg-white/88 border-slate-200'
            : 'bg-slate-950/88 border-slate-800/80'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">
                FitTrack <span className="text-emerald-500">Pro</span>
              </h1>
              <p className={`text-[11px] ${cTextSecondary} mt-0.5`}>
                Dieta Settimanale • Peso • Manubri &amp; Corpo Libero
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Personalizza Sfondo */}
            <button
              onClick={() => {
                setCustomImageInput(
                  data.background?.type === 'image' && data.background.imageUrl.startsWith('http')
                    ? data.background.imageUrl
                    : ''
                );
                setBgModalOpen((v) => !v);
              }}
              title="Personalizza sfondo"
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                bgModalOpen || hasCustomBg
                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-500 font-semibold'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sfondo</span>
            </button>

            {/* Switch Tema Chiaro / Scuro */}
            <button
              onClick={toggleTheme}
              title={isLight ? 'Passa a modalità scura' : 'Passa a modalità chiara'}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              {isLight ? (
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="hidden lg:inline font-medium">{isLight ? 'Scura' : 'Chiara'}</span>
            </button>

            {/* Modalità Riordina Sezioni */}
            <button
              onClick={() => setReorderMode((v) => !v)}
              title="Sposta e riordina le sezioni di ogni pagina"
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                reorderMode
                  ? 'bg-amber-500 border-amber-400 text-slate-950 font-semibold shadow-sm'
                  : isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{reorderMode ? 'Fine Ordine' : 'Ordina'}</span>
            </button>

            {/* Cloud Sync */}
            <button
              onClick={pullFromCloud}
              title={
                syncStatus === 'synced'
                  ? `Sincronizzato con Supabase${
                      lastSyncedAt ? ' alle ' + lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                    }`
                  : syncStatus === 'syncing'
                  ? 'Sincronizzazione in corso...'
                  : 'Errore di connessione cloud - clicca per riprovare'
              }
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-500 hover:bg-rose-500/20'
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
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Importa Backup JSON"
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
            >
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            <button
              onClick={handleResetDemo}
              title="Ripristina dati demo"
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition ${
                isLight
                  ? 'bg-slate-100 hover:bg-rose-50 border-slate-300 hover:border-rose-300 text-slate-600 hover:text-rose-600'
                  : 'bg-slate-900 hover:bg-rose-950/50 border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BARRA NAVIGAZIONE */}
        <nav className="max-w-5xl mx-auto px-4 pb-2.5 flex gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'dashboard'
                ? isLight
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : `${cTextSecondary} hover:${cTextPrimary}`
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-sky-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'nutrition'
                ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/40'
                : `${cTextSecondary} hover:${cTextPrimary}`
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-500" />
            <span>Alimentazione &amp; Peso</span>
          </button>

          <button
            onClick={() => setActiveTab('workout')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'workout'
                ? 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/40'
                : `${cTextSecondary} hover:${cTextPrimary}`
            }`}
          >
            <Dumbbell className="w-4 h-4 text-indigo-500" />
            <span>Allenamento (3x)</span>
          </button>
        </nav>
      </header>

      {/* PANNELLO PERSONALIZZAZIONE SFONDO */}
      {bgModalOpen && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div className={`${cCard} border border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                <h3 className={`font-semibold text-sm ${cTextPrimary}`}>Personalizza Sfondo dell&apos;App</h3>
              </div>
              <button onClick={() => setBgModalOpen(false)} className={cTextSecondary}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className={`text-xs font-semibold ${cTextSecondary}`}>Sfondi Sfumati &amp; Predefinito</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                <button
                  type="button"
                  onClick={() => updateBackground({ type: 'default' })}
                  className={`p-2 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                    data.background.type === 'default'
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                      : `${cInner} border`
                  }`}
                >
                  <div
                    className={`w-full h-9 rounded-lg border ${
                      isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
                    }`}
                  />
                  <span className={`text-[11px] font-medium truncate ${cTextPrimary}`}>Default</span>
                </button>

                {PRESET_BACKGROUNDS.map((preset) => {
                  const selected = data.background.type === 'preset' && data.background.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => updateBackground({ type: 'preset', presetId: preset.id })}
                      className={`p-2 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                        selected
                          ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                          : `${cInner} border`
                      }`}
                    >
                      <div
                        className="w-full h-9 rounded-lg border border-white/10"
                        style={{ background: preset.preview }}
                      />
                      <span className={`text-[11px] font-medium truncate ${cTextPrimary}`}>{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="md:col-span-4 space-y-2">
                <div className={`text-xs font-semibold ${cTextSecondary}`}>Colore Tinta Unita</div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={data.background.color || '#0b132b'}
                    onChange={(e) => updateBackground({ type: 'color', color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => updateBackground({ type: 'color' })}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                      data.background.type === 'color'
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : `${cInner} ${cTextPrimary}`
                    }`}
                  >
                    Applica Colore ({data.background.color})
                  </button>
                </div>
              </div>

              <div className="md:col-span-8 space-y-2">
                <div className={`text-xs font-semibold ${cTextSecondary}`}>Foto o Immagine Personalizzata</div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <button
                    type="button"
                    onClick={() => bgFileInputRef.current?.click()}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 whitespace-nowrap transition ${cInner} ${cTextPrimary} hover:border-indigo-500`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                    Carica Foto
                  </button>
                  <input
                    ref={bgFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="hidden"
                  />

                  <input
                    type="url"
                    placeholder="Oppure incolla URL immagine (https://...)"
                    value={customImageInput}
                    onChange={(e) => setCustomImageInput(e.target.value)}
                    className={`flex-1 ${cInput} border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customImageInput.trim()) {
                        updateBackground({ type: 'image', imageUrl: customImageInput.trim() });
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Usa URL
                  </button>
                </div>

                {data.background.type === 'image' && data.background.imageUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <span className={`text-[11px] ${cTextSecondary} whitespace-nowrap`}>
                      Contrasto lettura ({Math.round((data.background.overlayOpacity ?? 0.55) * 100)}%):
                    </span>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.05"
                      value={data.background.overlayOpacity ?? 0.55}
                      onChange={(e) => updateBackground({ overlayOpacity: parseFloat(e.target.value) })}
                      className="flex-1 accent-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BANNER INFORMATIVO MODALITÀ RIORDINO */}
      {reorderMode && (
        <div className="max-w-5xl mx-auto px-4 pt-4">
          <div
            className={`rounded-2xl px-4 py-3 border flex flex-wrap items-center justify-between gap-2 text-xs ${
              isLight
                ? 'bg-amber-50/95 border-amber-300 text-amber-900'
                : 'bg-amber-500/15 backdrop-blur-md border-amber-500/30 text-amber-200'
            }`}
          >
            <span>
              <strong>Modalità Riordino attiva:</strong> usa le frecce <strong>Su / Giù</strong> su ogni riquadro per personalizzare l&apos;ordine delle sezioni.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={resetLayoutOrder}
                className="underline font-semibold hover:opacity-80"
              >
                Ripristina ordine default
              </button>
              <button
                onClick={() => setReorderMode(false)}
                className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold"
              >
                Fatto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {data.layout.dashboard.map((secId) => dashboardSections[secId] || null)}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-5">
            {data.layout.nutrition.map((secId) => {
              if (secId === 'subNav') {
                return renderReorderWrapper(
                  'nutrition',
                  'subNav',
                  'Barra Sotto-Sezioni Alimentazione',
                  <div className="space-y-3">
                    <div className={`flex flex-wrap items-center justify-between gap-3 ${cCard} border p-2 rounded-2xl`}>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'planner', label: 'Piano Settimanale', icon: Calendar },
                          { id: 'composer', label: 'Componi Pasti', icon: Plus },
                          { id: 'foods', label: `Alimenti (${data.foods.length})`, icon: Utensils },
                          { id: 'weight', label: 'Tracker Peso', icon: Scale },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => setNutritionSubTab(tab.id)}
                              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition ${
                                nutritionSubTab === tab.id
                                  ? 'bg-emerald-500 text-white font-semibold'
                                  : `${cTextSecondary}`
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTempTargets(data.targets);
                            setEditingTargets(true);
                          }}
                          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl ${cInner} border ${cTextPrimary} transition`}
                        >
                          <Settings className="w-3.5 h-3.5 text-emerald-500" />
                          Target Macro
                        </button>

                        <button
                          onClick={handleResetNutritionSubPage}
                          title="Azzera a 0 tutti i dati di questa sezione"
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-semibold transition"
                        >
                          <Eraser className="w-3.5 h-3.5" />
                          <span>Azzera a 0</span>
                        </button>
                      </div>
                    </div>

                    {editingTargets && (
                      <div className={`${cCard} border border-emerald-500/40 rounded-2xl p-4 space-y-3`}>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm text-emerald-500">Imposta Obiettivi Giornalieri</h3>
                          <button onClick={() => setEditingTargets(false)} className={cTextSecondary}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { key: 'kcal', label: 'Calorie (kcal)' },
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
                                className={`w-full ${cInput} border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500`}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setData((prev) => ({ ...prev, targets: tempTargets }));
                              setEditingTargets(false);
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold"
                          >
                            Salva Obiettivi
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
                      <div className="space-y-5">
                        {data.layout.planner.map((pId) => plannerSections[pId] || null)}
                      </div>
                    )}

                    {nutritionSubTab === 'composer' && (
                      <div className="space-y-5">
                        {data.layout.composer.map((cId) => composerSections[cId] || null)}
                      </div>
                    )}

                    {nutritionSubTab === 'foods' && (
                      <div className="space-y-5">
                        {data.layout.foods.map((fId) => foodsSections[fId] || null)}
                      </div>
                    )}

                    {nutritionSubTab === 'weight' && (
                      <div className="space-y-5">
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
          <div className="space-y-5">
            {data.layout.workout.map((wId) => workoutSections[wId] || null)}
          </div>
        )}
      </main>

      {/* BARRA FLOATING TIMER (SERIE + CAMBIO ESERCIZIO) */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 backdrop-blur-lg border-t shadow-2xl transition-colors ${
          isLight
            ? 'bg-white/94 border-slate-200'
            : 'bg-slate-900/94 border-slate-800'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex flex-col items-start">
              <div
                className={`px-3 py-1 rounded-xl font-mono text-xl font-bold border transition leading-tight ${
                  timerFinishedAlert
                    ? 'bg-emerald-500 text-white border-emerald-400 animate-pulse'
                    : timerRunning
                    ? timerType === 'exercise'
                      ? 'bg-amber-500/20 text-amber-500 border-amber-500/50'
                      : 'bg-indigo-600/20 text-indigo-500 border-indigo-500/50'
                    : `${cInner} ${cTextPrimary}`
                }`}
              >
                {formatSeconds(timerSeconds)}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 px-1 ${
                  timerType === 'exercise' ? 'text-amber-500' : 'text-indigo-500'
                }`}
              >
                {timerType === 'exercise' ? 'Cambio Esercizio' : 'Tra Serie'}
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
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2.5 rounded-xl transition ${
                  isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {/* Preset Pausa tra Serie */}
            <div className="flex items-center gap-1">
              <span className={`hidden sm:inline text-[10px] uppercase font-bold ${cTextSecondary} mr-0.5`}>
                Serie:
              </span>
              {[60, 90, 120].map((sec) => (
                <button
                  key={sec}
                  onClick={() => startTimer(sec, 'set')}
                  className={`px-2 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    timerType === 'set' && timerInitial === sec
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-500'
                      : `${cInner} ${cTextPrimary}`
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className={`h-5 w-px mx-0.5 ${isLight ? 'bg-slate-300' : 'bg-slate-800'}`} />

            {/* Preset Pausa tra Esercizi */}
            <div className="flex items-center gap-1">
              <span className="hidden sm:inline text-[10px] uppercase font-bold text-amber-500 mr-0.5">
                Es.:
              </span>
              {[150, 180, 240].map((sec) => (
                <button
                  key={sec}
                  onClick={() => startTimer(sec, 'exercise')}
                  className={`px-2 py-1.5 rounded-lg border text-xs font-semibold transition ${
                    timerType === 'exercise' && timerInitial === sec
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-500'
                      : `${cInner} text-amber-500`
                  }`}
                >
                  {sec === 150 ? '2m30' : `${sec / 60}m`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 ml-0.5">
              <button
                onClick={() => adjustTimer(-15)}
                className={`px-2 py-1.5 rounded-lg ${cInner} border text-xs ${cTextSecondary}`}
              >
                -15s
              </button>
              <button
                onClick={() => adjustTimer(15)}
                className={`px-2 py-1.5 rounded-lg ${cInner} border text-xs ${cTextSecondary}`}
              >
                +15s
              </button>
            </div>

            <label className={`hidden lg:flex items-center gap-1.5 ml-1.5 text-xs ${cTextSecondary} cursor-pointer select-none`}>
              <input
                type="checkbox"
                checked={autoStartTimer}
                onChange={(e) => setAutoStartTimer(e.target.checked)}
                className="rounded accent-indigo-500"
              />
              Auto-avvio
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
