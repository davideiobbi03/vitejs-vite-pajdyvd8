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

const STORAGE_KEY = 'fittrack_pro_data_v1';

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
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      foods: INITIAL_FOODS,
      meals: INITIAL_MEALS,
      weeklyPlan: INITIAL_WEEKLY_PLAN,
      weights: INITIAL_WEIGHTS,
      workouts: INITIAL_WORKOUTS,
      targets: INITIAL_TARGETS,
    };
  });

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
        isRemoteUpdate.current = true;
        setData(row.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(row.data));
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

  const startTimer = (seconds) => {
    setTimerFinishedAlert(false);
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
    setCompletedSets((prev) => ({ ...prev, [key]: nextState }));
    if (nextState && autoStartTimer) {
      startTimer(exercise.rest || 90);
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
        if (parsed.foods && parsed.workouts) setData(parsed);
      } catch (err) {
        alert('File JSON non valido.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (!window.confirm('Vuoi ripristinare i dati dimostrativi iniziali?')) return;
    setData({
      foods: INITIAL_FOODS,
      meals: INITIAL_MEALS,
      weeklyPlan: INITIAL_WEEKLY_PLAN,
      weights: INITIAL_WEIGHTS,
      workouts: INITIAL_WORKOUTS,
      targets: INITIAL_TARGETS,
    });
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

  const renderWeightChart = (height = 140) => {
    if (sortedWeights.length < 2) {
      return (
        <div className="h-32 flex items-center justify-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-xl">
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

    return (
      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#1e293b" strokeDasharray="4 4" />
          <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke="#1e293b" strokeDasharray="4 4" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#1e293b" />
          <polygon points={areaPoints} fill="url(#weightGrad)" />
          <polyline fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={polylinePoints} />
          {points.map((p) => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="4.5" fill="#090d16" stroke="#10b981" strokeWidth="2.5" />
              <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">
                {p.weight}
              </text>
              <text x={p.x} y={height - 4} textAnchor="middle" fill="#64748b" fontSize="10">
                {p.date.slice(5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 pb-28">
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none">
                FitTrack <span className="text-emerald-400">Pro</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Dieta Settimanale • Peso • Manubri &amp; Corpo Libero
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
              }`}
            >
              {syncStatus === 'synced' && <Cloud className="w-3.5 h-3.5" />}
              {syncStatus === 'syncing' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              {syncStatus === 'error' && <CloudOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline font-medium">
                {syncStatus === 'synced' ? 'Cloud Sync' : syncStatus === 'syncing' ? 'Sync...' : 'Offline'}
              </span>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Esporta</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Importa</span>
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            <button
              onClick={handleResetDemo}
              className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 border border-slate-800 hover:border-rose-800/60 text-slate-400 hover:text-rose-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        <nav className="max-w-5xl mx-auto px-4 pb-2.5 flex gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-sky-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'nutrition'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Alimentazione &amp; Peso</span>
          </button>

          <button
            onClick={() => setActiveTab('workout')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'workout'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-indigo-400" />
            <span>Allenamento (3x)</span>
          </button>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Riepilogo Giornaliero
                </h2>
                <p className="text-xs text-slate-400">Visualizza macro e stato workout per il giorno selezionato</p>
              </div>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                {DAYS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedDay === d ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Utensils className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">Alimentazione — {FULL_DAYS[selectedDay]}</h3>
                      <p className="text-xs text-slate-400">Bilancio energetico e macronutrienti</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    Apri Piano <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Calorie Pianificate</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-white">{dayMacros.kcal}</span>
                      <span className="text-xs text-slate-400"> / {data.targets.kcal} kcal</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.round((dayMacros.kcal / (data.targets.kcal || 1)) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Proteine', val: dayMacros.p, target: data.targets.p, color: 'bg-sky-400' },
                    { label: 'Carboidrati', val: dayMacros.c, target: data.targets.c, color: 'bg-amber-400' },
                    { label: 'Grassi', val: dayMacros.g, target: data.targets.g, color: 'bg-rose-400' },
                  ].map((m) => {
                    const pct = Math.min(100, Math.round((m.val / (m.target || 1)) * 100));
                    return (
                      <div key={m.label} className="bg-slate-950/70 border border-slate-800/70 rounded-xl p-3">
                        <div className="text-xs text-slate-400 mb-1">{m.label}</div>
                        <div className="font-bold text-base text-slate-100">
                          {m.val}g <span className="text-xs font-normal text-slate-500">/ {m.target}g</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${m.color} rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <Scale className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100">Peso Corporeo</h3>
                      <p className="text-xs text-slate-400">Check-in settimanale</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('nutrition');
                      setNutritionSubTab('weight');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    Dettagli <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {latestWeight ? (
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-3xl font-bold text-white">{latestWeight.weight} kg</span>
                    {weightDeltaTotal !== null && (
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          Number(weightDeltaTotal) <= 0 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {Number(weightDeltaTotal) > 0 ? `+${weightDeltaTotal}` : weightDeltaTotal} kg tot
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 mb-3">Nessuna pesata registrata</p>
                )}

                {renderWeightChart(135)}
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30">
                    <Dumbbell className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-100">Schede Allenamento (3x Settimana • Manubri + Corpo Libero)</h3>
                    <p className="text-xs text-slate-400">Scegli la sessione di oggi per avviare il tracker serie e il timer di recupero</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {data.workouts.map((wo) => (
                  <div
                    key={wo.id}
                    className="bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                          {wo.dayLabel}
                        </span>
                        <span className="text-xs text-slate-500">{wo.exercises.length} esercizi</span>
                      </div>
                      <h4 className="font-semibold text-slate-100 text-base">{wo.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{wo.focus}</p>
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
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-2 rounded-2xl">
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
                          ? 'bg-emerald-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setTempTargets(data.targets);
                  setEditingTargets(true);
                }}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                Target Macro
              </button>
            </div>

            {editingTargets && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-emerald-300">Imposta Obiettivi Giornalieri</h3>
                  <button onClick={() => setEditingTargets(false)} className="text-slate-400 hover:text-white">
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
                      <label className="block text-xs text-slate-400 mb-1">{field.label}</label>
                      <input
                        type="number"
                        value={tempTargets[field.key]}
                        onChange={(e) => setTempTargets({ ...tempTargets, [field.key]: Number(e.target.value) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
                  >
                    Salva Obiettivi
                  </button>
                </div>
              </div>
            )}

            {nutritionSubTab === 'planner' && (
              <div className="space-y-5">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
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
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{d}</span>
                            <span className="text-[10px] opacity-75 mt-0.5">{m.kcal}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-xs text-slate-400 pl-2">Copia su:</span>
                      <select
                        value={copyTargetDay}
                        onChange={(e) => setCopyTargetDay(e.target.value)}
                        className="bg-slate-900 text-xs text-white rounded-lg px-2 py-1.5 border border-slate-700 focus:outline-none"
                      >
                        {DAYS.filter((d) => d !== selectedDay).map((d) => (
                          <option key={d} value={d}>
                            {FULL_DAYS[d]}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleCopyDayPlan}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copia
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Calorie Totali</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {dayMacros.kcal} <span className="text-xs text-slate-500 font-normal">/ {data.targets.kcal}</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Proteine</div>
                      <div className="text-lg font-bold text-sky-400">
                        {dayMacros.p}g <span className="text-xs text-slate-500 font-normal">/ {data.targets.p}g</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Carboidrati</div>
                      <div className="text-lg font-bold text-amber-400">
                        {dayMacros.c}g <span className="text-xs text-slate-500 font-normal">/ {data.targets.c}g</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800/80">
                      <div className="text-xs text-slate-400">Grassi</div>
                      <div className="text-lg font-bold text-rose-400">
                        {dayMacros.g}g <span className="text-xs text-slate-500 font-normal">/ {data.targets.g}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEAL_SLOTS.map((slot) => {
                    const assignedMealIds = data.weeklyPlan[selectedDay]?.[slot] || [];
                    return (
                      <div
                        key={slot}
                        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-slate-100">{slot}</h4>
                            <span className="text-xs text-slate-500">
                              {assignedMealIds.length} {assignedMealIds.length === 1 ? 'pasto' : 'pasti'}
                            </span>
                          </div>

                          {assignedMealIds.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-slate-800 rounded-xl">
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
                                    className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-2"
                                  >
                                    <div>
                                      <div className="font-medium text-sm text-slate-100">{meal.name}</div>
                                      <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap gap-2">
                                        <span className="text-emerald-400 font-semibold">{Math.round(macros.kcal)} kcal</span>
                                        <span>• P: {Math.round(macros.p)}g</span>
                                        <span>• C: {Math.round(macros.c)}g</span>
                                        <span>• G: {Math.round(macros.g)}g</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => removeMealFromSlot(selectedDay, slot, idx)}
                                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex gap-2">
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                assignMealToSlot(selectedDay, slot, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
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
              </div>
            )}

            {nutritionSubTab === 'composer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="font-semibold text-base text-emerald-300">Componi un Nuovo Pasto Ricorrente</h3>
                  <form onSubmit={handleSaveComposedMeal} className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nome del Pasto</label>
                      <input
                        type="text"
                        required
                        placeholder="Es. Colazione Yogurt Greco & Muesli"
                        value={mealName}
                        onChange={(e) => setMealName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Aggiungi Ingredienti dal Database Alimenti
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={selectedFoodToAdd || (data.foods[0]?.id ?? '')}
                          onChange={(e) => setSelectedFoodToAdd(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
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
                            className="w-20 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white text-center"
                          />
                          <button
                            type="button"
                            onClick={handleAddIngredientToComposer}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Aggiungi
                          </button>
                        </div>
                      </div>
                    </div>

                    {mealItems.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-400">Ingredienti nel pasto:</div>
                        {mealItems.map((it, idx) => {
                          const food = getFoodById(it.foodId);
                          if (!food) return null;
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-xs"
                            >
                              <span>
                                <strong className="text-emerald-400">{it.qty}x</strong> {food.name}
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400">
                                  {Math.round(food.kcal * it.qty)} kcal • {Math.round(food.p * it.qty)}g P
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setMealItems((prev) => prev.filter((_, i) => i !== idx))}
                                  className="text-slate-500 hover:text-rose-400"
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
                              <span className="font-semibold text-emerald-300">Totale Pasto:</span>
                              <div className="flex gap-3 font-bold">
                                <span className="text-white">{Math.round(previewMacros.kcal)} kcal</span>
                                <span className="text-sky-400">P: {Math.round(previewMacros.p)}g</span>
                                <span className="text-amber-400">C: {Math.round(previewMacros.c)}g</span>
                                <span className="text-rose-400">G: {Math.round(previewMacros.g)}g</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!mealName.trim() || mealItems.length === 0}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm transition"
                    >
                      Salva Pasto nel Ricettario
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h3 className="font-semibold text-base text-slate-100">Pasti Già Pronti ({data.meals.length})</h3>
                  <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                    {data.meals.map((meal) => {
                      const m = getMealMacros(meal);
                      return (
                        <div key={meal.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-sm text-white">{meal.name}</h4>
                            <button
                              onClick={() =>
                                setData((prev) => ({
                                  ...prev,
                                  meals: prev.meals.filter((x) => x.id !== meal.id),
                                }))
                              }
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-xs text-slate-400 space-y-0.5">
                            {meal.items.map((it, i) => {
                              const f = getFoodById(it.foodId);
                              return f ? (
                                <div key={i}>
                                  • {it.qty}x {f.name}
                                </div>
                              ) : null;
                            })}
                          </div>
                          <div className="pt-2 border-t border-slate-800/80 flex gap-3 text-xs font-semibold">
                            <span className="text-emerald-400">{Math.round(m.kcal)} kcal</span>
                            <span className="text-sky-400">{Math.round(m.p)}g P</span>
                            <span className="text-amber-400">{Math.round(m.c)}g C</span>
                            <span className="text-rose-400">{Math.round(m.g)}g G</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {nutritionSubTab === 'foods' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 h-fit">
                  <h3 className="font-semibold text-base text-emerald-300 mb-3">Aggiungi Alimento al Database</h3>
                  <form onSubmit={handleAddFood} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nome Alimento &amp; Porzione</label>
                      <input
                        type="text"
                        required
                        placeholder="Es. Fiocchi di Latte (200g)"
                        value={newFood.name}
                        onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Calorie (kcal)</label>
                        <input
                          type="number"
                          required
                          placeholder="190"
                          value={newFood.kcal}
                          onChange={(e) => setNewFood({ ...newFood, kcal: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Proteine (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="24"
                          value={newFood.p}
                          onChange={(e) => setNewFood({ ...newFood, p: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Carboidrati (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="6"
                          value={newFood.c}
                          onChange={(e) => setNewFood({ ...newFood, c: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Grassi (g)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="8"
                          value={newFood.g}
                          onChange={(e) => setNewFood({ ...newFood, g: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
                    >
                      Salva Alimento
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                  <h3 className="font-semibold text-base text-slate-100 mb-3">Alimenti Salvati ({data.foods.length})</h3>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {data.foods.map((food) => (
                      <div
                        key={food.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-medium text-sm text-slate-100">{food.name}</div>
                          <div className="text-xs text-slate-400 flex gap-3 mt-0.5">
                            <span className="text-emerald-400 font-semibold">{food.kcal} kcal</span>
                            <span>P: {food.p}g</span>
                            <span>C: {food.c}g</span>
                            <span>G: {food.g}g</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteFood(food.id)} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {nutritionSubTab === 'weight' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit">
                  <h3 className="font-semibold text-base text-emerald-300 flex items-center gap-2">
                    <Scale className="w-4 h-4" /> Registra Pesata Settimanale
                  </h3>
                  <form onSubmit={handleAddWeight} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Peso (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          placeholder="77.0"
                          value={newWeight}
                          onChange={(e) => setNewWeight(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Data</label>
                        <input
                          type="date"
                          required
                          value={newWeightDate}
                          onChange={(e) => setNewWeightDate(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Note (opzionale)</label>
                      <input
                        type="text"
                        placeholder="Es. Pesata mattutina a digiuno"
                        value={newWeightNote}
                        onChange={(e) => setNewWeightNote(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
                    >
                      Aggiungi Pesata
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-base text-slate-100">Andamento nel Tempo</h3>
                      <p className="text-xs text-slate-400">Monitoraggio progressivo del peso</p>
                    </div>
                    <div className="flex gap-2">
                      {weightDeltaLast !== null && (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                          Ultima:{' '}
                          <strong className="text-emerald-400">
                            {Number(weightDeltaLast) > 0 ? `+${weightDeltaLast}` : weightDeltaLast} kg
                          </strong>
                        </span>
                      )}
                      {weightDeltaTotal !== null && (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                          Totale:{' '}
                          <strong className="text-sky-400">
                            {Number(weightDeltaTotal) > 0 ? `+${weightDeltaTotal}` : weightDeltaTotal} kg
                          </strong>
                        </span>
                      )}
                    </div>
                  </div>

                  {renderWeightChart(175)}

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Storico Registrazioni</h4>
                    {[...sortedWeights].reverse().map((w) => (
                      <div
                        key={w.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-bold text-white text-sm">{w.weight} kg</span>
                            <span className="text-xs text-slate-500">{w.date}</span>
                          </div>
                          {w.note && <p className="text-xs text-slate-400 mt-0.5">{w.note}</p>}
                        </div>
                        <button onClick={() => handleDeleteWeight(w.id)} className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {data.workouts.map((wo) => (
                    <button
                      key={wo.id}
                      onClick={() => setActiveWorkoutId(wo.id)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                        activeWorkoutId === wo.id
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {wo.dayLabel}: {wo.title.split('(')[0].trim()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWorkoutMode(workoutMode === 'live' ? 'edit' : 'live')}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                      workoutMode === 'edit'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {workoutMode === 'edit' ? 'Torna a Workout Live' : 'Modifica Scheda'}
                  </button>
                </div>
              </div>

              {currentWorkout && (
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {currentWorkout.dayLabel} — {currentWorkout.title}
                    </h2>
                    <p className="text-xs text-slate-400">{currentWorkout.focus}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Serie Completate</div>
                      <div className="text-sm font-bold text-indigo-400">
                        {completedSetsInWorkout} / {totalSetsInWorkout}
                      </div>
                    </div>
                    {completedSetsInWorkout > 0 && (
                      <button
                        onClick={() => setCompletedSets({})}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400"
                      >
                        Azzera Spunte
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {currentWorkout && (
              <div className="space-y-3.5">
                {currentWorkout.exercises.map((ex, exIdx) => (
                  <div
                    key={ex.id}
                    className="bg-slate-900/85 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                            #{exIdx + 1}
                          </span>
                          <h3 className="font-semibold text-base text-white">{ex.name}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                          <span>
                            <strong className="text-slate-200">{ex.sets}</strong> serie ×{' '}
                            <strong className="text-slate-200">{ex.reps}</strong> rip
                          </span>
                          <span className="flex items-center gap-1 text-indigo-300">
                            <Clock className="w-3.5 h-3.5" /> Recupero: {ex.rest}s
                          </span>
                        </div>
                        {ex.notes && <p className="text-xs text-slate-500 italic mt-1">Nota: {ex.notes}</p>}
                      </div>

                      <div className="flex items-center gap-2">
                        {ex.weight > 0 || workoutMode === 'edit' ? (
                          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                            <button
                              onClick={() => updateExerciseWeight(currentWorkout.id, ex.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white font-bold"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-200 min-w-[52px] text-center">
                              {ex.weight === 0 ? 'BW' : `${ex.weight} kg`}
                            </span>
                            <button
                              onClick={() => updateExerciseWeight(currentWorkout.id, ex.id, +1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white font-bold"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400">
                            Corpo Libero
                          </span>
                        )}

                        {workoutMode === 'edit' && (
                          <button
                            onClick={() => handleDeleteExercise(ex.id)}
                            className="p-2 rounded-xl bg-rose-950/40 text-rose-400 hover:bg-rose-900/60"
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
                                  ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/20'
                                  : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300'
                              }`}
                            >
                              {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-500" />}
                              Serie {setIdx + 1}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => startTimer(ex.rest || 90)}
                          className="py-3 px-3 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5" /> {ex.rest}s
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {workoutMode === 'edit' && (
                  <form
                    onSubmit={handleAddExercise}
                    className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 space-y-3"
                  >
                    <h4 className="font-semibold text-sm text-indigo-300">+ Aggiungi Esercizio a {currentWorkout.dayLabel}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Nome esercizio (es. Croci con Manubri)"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                      />
                      <input
                        type="text"
                        placeholder="Note tecniche (opzionale)"
                        value={newExercise.notes}
                        onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Serie</label>
                        <input
                          type="number"
                          min="1"
                          value={newExercise.sets}
                          onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Ripetizioni</label>
                        <input
                          type="text"
                          value={newExercise.reps}
                          onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Carico kg (0 = BW)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={newExercise.weight}
                          onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Recupero (sec)</label>
                        <input
                          type="number"
                          step="15"
                          min="15"
                          value={newExercise.rest}
                          onChange={(e) => setNewExercise({ ...newExercise, rest: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                        />
                      </div>
                    </div>
                    <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
                      Aggiungi Esercizio
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 inset-x-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`px-3.5 py-1.5 rounded-xl font-mono text-xl font-bold border transition ${
                timerFinishedAlert
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                  : timerRunning
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50'
                  : 'bg-slate-950 text-slate-200 border-slate-800'
              }`}
            >
              {formatSeconds(timerSeconds)}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setTimerFinishedAlert(false);
                  if (timerSeconds === 0) setTimerSeconds(timerInitial);
                  setTimerRunning(!timerRunning);
                }}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerFinishedAlert(false);
                  setTimerSeconds(timerInitial);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[60, 90, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => startTimer(sec)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
              >
                {sec}s
              </button>
            ))}
            <button
              onClick={() => adjustTimer(-15)}
              className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400"
            >
              -15s
            </button>
            <button
              onClick={() => adjustTimer(15)}
              className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400"
            >
              +15s
            </button>

            <label className="hidden md:flex items-center gap-1.5 ml-2 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoStartTimer}
                onChange={(e) => setAutoStartTimer(e.target.checked)}
                className="rounded accent-indigo-500"
              />
              Auto-avvio su serie
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
