import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  LayoutDashboard,
  Utensils,
  Dumbbell,
  Scale,
  Plus,
  Trash2,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RefreshCw,
  ChevronRight,
  Edit3,
  Save,
  X,
  Flame,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  Award,
  Sparkles,
  Info,
  SlidersHorizontal
} from 'lucide-react';

// ============================================================================
// DATI INIZIALI DI ESEMPIO (Pre-caricati al primo avvio)
// ============================================================================

const DAYS_OF_WEEK = [
  { id: 'lun', label: 'Lunedì', short: 'Lun' },
  { id: 'mar', label: 'Martedì', short: 'Mar' },
  { id: 'mer', label: 'Mercoledì', short: 'Mer' },
  { id: 'gio', label: 'Giovedì', short: 'Gio' },
  { id: 'ven', label: 'Venerdì', short: 'Ven' },
  { id: 'sab', label: 'Sabato', short: 'Sab' },
  { id: 'dom', label: 'Domenica', short: 'Dom' },
];

const MEAL_SLOTS = [
  { id: 'colazione', label: 'Colazione', icon: '🌅' },
  { id: 'pranzo', label: 'Pranzo', icon: '☀️' },
  { id: 'spuntini', label: 'Spuntini', icon: '⚡' },
  { id: 'cena', label: 'Cena', icon: '🌙' },
];

const INITIAL_FOODS = [
  { id: 'f1', name: 'Fiocchi d\'Avena', portion: '80g', kcal: 304, protein: 10.4, carbs: 54.4, fat: 5.6 },
  { id: 'f2', name: 'Yogurt Greco 0%', portion: '200g', kcal: 118, protein: 20.6, carbs: 8.0, fat: 0.4 },
  { id: 'f3', name: 'Banana Media', portion: '120g', kcal: 107, protein: 1.3, carbs: 27.0, fat: 0.4 },
  { id: 'f4', name: 'Mandorle Sgusciate', portion: '20g', kcal: 116, protein: 4.2, carbs: 4.3, fat: 10.0 },
  { id: 'f5', name: 'Petto di Pollo alla Piastra', portion: '200g', kcal: 220, protein: 46.0, carbs: 0.0, fat: 2.4 },
  { id: 'f6', name: 'Riso Basmati (peso crudo)', portion: '100g', kcal: 356, protein: 8.0, carbs: 78.0, fat: 0.8 },
  { id: 'f7', name: 'Olio Extravergine d\'Oliva', portion: '10g (1 cucchiaio)', kcal: 90, protein: 0.0, carbs: 0.0, fat: 10.0 },
  { id: 'f8', name: 'Uova Intere Medie (3 uova)', portion: '180g', kcal: 258, protein: 22.5, carbs: 1.3, fat: 17.8 },
  { id: 'f9', name: 'Pane Integrale Tostato', portion: '80g', kcal: 198, protein: 7.2, carbs: 38.4, fat: 1.2 },
  { id: 'f10', name: 'Salmone Fresco al Forno', portion: '180g', kcal: 374, protein: 36.0, carbs: 0.0, fat: 24.0 },
  { id: 'f11', name: 'Patate Dolci al Forno', portion: '250g', kcal: 215, protein: 4.0, carbs: 50.0, fat: 0.3 },
  { id: 'f12', name: 'Proteine Whey Isolate', portion: '30g (1 scoop)', kcal: 114, protein: 25.5, carbs: 1.2, fat: 0.6 },
  { id: 'f13', name: 'Verdure Miste Grigliate', portion: '200g', kcal: 65, protein: 2.5, carbs: 12.0, fat: 0.5 },
];

const INITIAL_MEALS = [
  {
    id: 'm1',
    name: 'Colazione Energetica Avena & Greco',
    items: [
      { foodId: 'f1', multiplier: 1 },
      { foodId: 'f2', multiplier: 1 },
      { foodId: 'f3', multiplier: 1 },
      { foodId: 'f4', multiplier: 0.75 },
    ],
  },
  {
    id: 'm2',
    name: 'Pranzo Classico Riso, Pollo & Olio',
    items: [
      { foodId: 'f6', multiplier: 1.1 },
      { foodId: 'f5', multiplier: 1 },
      { foodId: 'f7', multiplier: 1 },
      { foodId: 'f13', multiplier: 1 },
    ],
  },
  {
    id: 'm3',
    name: 'Cena Salmone & Patate Dolci',
    items: [
      { foodId: 'f10', multiplier: 1 },
      { foodId: 'f11', multiplier: 1 },
      { foodId: 'f13', multiplier: 1 },
    ],
  },
  {
    id: 'm4',
    name: 'Spuntino Post-Workout Shake & Banana',
    items: [
      { foodId: 'f12', multiplier: 1 },
      { foodId: 'f3', multiplier: 1 },
    ],
  },
  {
    id: 'm5',
    name: 'Colazione/Cena Salata Uova & Pane',
    items: [
      { foodId: 'f8', multiplier: 1 },
      { foodId: 'f9', multiplier: 1 },
    ],
  },
];

const INITIAL_WEEKLY_PLAN = {
  lun: {
    colazione: [{ type: 'meal', refId: 'm1' }],
    pranzo: [{ type: 'meal', refId: 'm2' }],
    spuntini: [{ type: 'meal', refId: 'm4' }],
    cena: [{ type: 'meal', refId: 'm3' }],
  },
  mar: {
    colazione: [{ type: 'meal', refId: 'm1' }],
    pranzo: [{ type: 'meal', refId: 'm2' }],
    spuntini: [{ type: 'food', refId: 'f2' }, { type: 'food', refId: 'f4' }],
    cena: [{ type: 'meal', refId: 'm5' }, { type: 'food', refId: 'f13' }],
  },
  mer: {
    colazione: [{ type: 'meal', refId: 'm1' }],
    pranzo: [{ type: 'meal', refId: 'm2' }],
    spuntini: [{ type: 'meal', refId: 'm4' }],
    cena: [{ type: 'meal', refId: 'm3' }],
  },
  gio: {
    colazione: [{ type: 'meal', refId: 'm5' }],
    pranzo: [{ type: 'meal', refId: 'm2' }],
    spuntini: [{ type: 'food', refId: 'f3' }, { type: 'food', refId: 'f12' }],
    cena: [{ type: 'meal', refId: 'm3' }],
  },
  ven: {
    colazione: [{ type: 'meal', refId: 'm1' }],
    pranzo: [{ type: 'meal', refId: 'm2' }],
    spuntini: [{ type: 'meal', refId: 'm4' }],
    cena: [{ type: 'meal', refId: 'm5' }],
  },
  sab: {
    colazione: [{ type: 'meal', refId: 'm1' }],
    pranzo: [{ type: 'meal', refId: 'm3' }],
    spuntini: [{ type: 'food', refId: 'f4' }],
    cena: [],
  },
  dom: {
    colazione: [{ type: 'meal', refId: 'm5' }],
    pranzo: [{ type: 'meal', refId: 'm2' }],
    spuntini: [],
    cena: [{ type: 'meal', refId: 'm3' }],
  },
};

const INITIAL_WORKOUT_ROUTINES = [
  {
    id: 'w_a',
    title: 'Giorno A: Upper Push (Spinta)',
    subtitle: 'Petto, Spalle Anteriori/Laterali, Tricipiti',
    tag: 'Manubri + Corpo Libero',
    exercises: [
      {
        id: 'ex_a1',
        name: 'Panca Piana con Manubri (o Floor Press)',
        sets: 4,
        reps: '8-10',
        weight: 22,
        rest: 90,
        notes: 'Scapole addotte, discesa controllata di 2 sec, spinta esplosiva.',
      },
      {
        id: 'ex_a2',
        name: 'Spinte sopra la Testa (Military Press Manubri)',
        sets: 3,
        reps: '8-12',
        weight: 14,
        rest: 90,
        notes: 'Core contratto, gomiti leggermente in avanti rispetto al busto.',
      },
      {
        id: 'ex_a3',
        name: 'Piegamenti sulle Braccia (Push-up) + Croci Manubri',
        sets: 3,
        reps: '12-15',
        weight: 10,
        rest: 75,
        notes: 'Esegui prima le croci con manubri, poi piegamenti a cedimento tecnico.',
      },
      {
        id: 'ex_a4',
        name: 'Alzate Laterali con Manubri',
        sets: 4,
        reps: '12-15',
        weight: 8,
        rest: 60,
        notes: 'Guida con i gomiti, evita slanci con la schiena.',
      },
      {
        id: 'ex_a5',
        name: 'French Press con Manubri (su panca o terra)',
        sets: 3,
        reps: '10-12',
        weight: 10,
        rest: 60,
        notes: 'Gomiti stretti e fermi, estensione completa dei tricipiti.',
      },
    ],
  },
  {
    id: 'w_b',
    title: 'Giorno B: Lower & Core',
    subtitle: 'Quadricipiti, Femorali, Glutei, Polpacci e Addome',
    tag: 'Manubri + Corpo Libero',
    exercises: [
      {
        id: 'ex_b1',
        name: 'Goblet Squat con Manubrio',
        sets: 4,
        reps: '10-12',
        weight: 26,
        rest: 120,
        notes: 'Manubrio stretto al petto, scendi sotto il parallelo mantenendo il busto fiero.',
      },
      {
        id: 'ex_b2',
        name: 'Affondi Bulgari con Manubri',
        sets: 3,
        reps: '8-10 / lato',
        weight: 14,
        rest: 90,
        notes: 'Piede posteriore su rialzo/panca. Focus sulla spinta del tallone anteriore.',
      },
      {
        id: 'ex_b3',
        name: 'Stacco Rumeno (RDL) con Manubri',
        sets: 4,
        reps: '10-12',
        weight: 22,
        rest: 90,
        notes: 'Ginocchia semi-flesse, porta il bacino indietro sentendo allungare i femorali.',
      },
      {
        id: 'ex_b4',
        name: 'Calf Raise su Rialzo con Manubrio',
        sets: 3,
        reps: '15-20',
        weight: 18,
        rest: 45,
        notes: '1 secondo di pausa in massimo allungamento in basso e 1 sec di picco in alto.',
      },
      {
        id: 'ex_b5',
        name: 'Plank Addominale + Crunch a Terra',
        sets: 3,
        reps: '45s + 15 rep',
        weight: 0,
        rest: 60,
        notes: 'Corpo libero: mantieni retroversione del bacino durante il plank.',
      },
    ],
  },
  {
    id: 'w_c',
    title: 'Giorno C: Upper Pull & Braccia',
    subtitle: 'Dorsali, Deltoidi Posteriori, Bicipiti e Richiamo Braccia',
    tag: 'Manubri + Corpo Libero',
    exercises: [
      {
        id: 'ex_c1',
        name: 'Rematore con Manubrio Singolo (One-Arm Row)',
        sets: 4,
        reps: '8-10 / lato',
        weight: 24,
        rest: 90,
        notes: 'Tira il manubrio verso l\'anca, non verso la spalla, per attivare il gran dorsale.',
      },
      {
        id: 'ex_c2',
        name: 'Rematore a Busto Flesso con Due Manubri',
        sets: 3,
        reps: '10-12',
        weight: 16,
        rest: 90,
        notes: 'Schiena neutra parallela al pavimento, contrai le scapole in cima.',
      },
      {
        id: 'ex_c3',
        name: 'Pullover con Manubrio',
        sets: 3,
        reps: '12',
        weight: 20,
        rest: 75,
        notes: 'Braccia quasi tese, allunga bene il gran dorsale e il dentato.',
      },
      {
        id: 'ex_c4',
        name: 'Alzate Posteriori Busto Flesso (Rear Delt Fly)',
        sets: 3,
        reps: '15',
        weight: 7,
        rest: 60,
        notes: 'Movimento fluido e controllato per i deltoidi posteriori.',
      },
      {
        id: 'ex_c5',
        name: 'Curl Bicipiti Alternato + Hammer Curl',
        sets: 4,
        reps: '10 + 8',
        weight: 12,
        rest: 60,
        notes: 'Supinazione completa nella prima parte, presa neutra (martello) a seguire.',
      },
    ],
  },
];

const INITIAL_WEIGHT_LOGS = [
  { id: 'wl1', date: '2026-10-18', weight: 78.4, note: 'Inizio blocco massa pulita' },
  { id: 'wl2', date: '2026-10-25', weight: 78.1, note: 'Buona ritenzione, energie alte' },
  { id: 'wl3', date: '2026-11-01', weight: 77.7, note: 'Aumentati carichi su spinte e squat' },
  { id: 'wl4', date: '2026-11-08', weight: 77.5, note: 'Settimana molto regolare con la dieta' },
  { id: 'wl5', date: '2026-11-15', weight: 77.2, note: 'Check domenicale a digiuno' },
];

const INITIAL_TARGETS = {
  kcal: 2550,
  protein: 175,
  carbs: 295,
  fat: 72,
};

const STORAGE_KEY = 'fittrack_pro_data_v1';

// ============================================================================
// UTILITY DI CALCOLO E WEB AUDIO API (BEEP TIMER)
// ============================================================================

function playBeepSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playTone = (startTime, freq, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playTone(now, 880, 0.16);
    playTone(now + 0.22, 880, 0.16);
    playTone(now + 0.44, 1174.66, 0.35);
  } catch (e) {
    // Ignora errori se il browser blocca l'audio automatico
  }
}

function getTodayDayId() {
  const jsDay = new Date().getDay(); // 0 = Dom, 1 = Lun ...
  const map = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
  return map[jsDay] || 'lun';
}

// ============================================================================
// COMPONENTE GRAFICO SVG DEL PESO (Interattivo & Responsive)
// ============================================================================

function WeightChart({ logs, compact = false }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [logs]);

  if (sortedLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-sm border border-dashed border-slate-800 rounded-xl">
        <Scale className="w-8 h-8 mb-2 text-slate-600" />
        <p>Nessuna pesata registrata. Aggiungi il primo peso!</p>
      </div>
    );
  }

  const width = 600;
  const height = compact ? 150 : 220;
  const padX = 36;
  const padY = 26;

  const weights = sortedLogs.map((l) => Number(l.weight));
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const rangeW = maxW - minW === 0 ? 1 : maxW - minW;
  const paddedMin = minW - rangeW * 0.2;
  const paddedMax = maxW + rangeW * 0.2;
  const totalRange = paddedMax - paddedMin;

  const points = sortedLogs.map((log, i) => {
    const x =
      sortedLogs.length === 1
        ? width / 2
        : padX + (i / (sortedLogs.length - 1)) * (width - padX * 2);
    const y =
      height - padY - ((Number(log.weight) - paddedMin) / totalRange) * (height - padY * 2);
    return { x, y, ...log };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints =
    points.length > 1
      ? `${points[0].x},${height - padY} ${polylinePoints} ${points[points.length - 1].x},${
          height - padY
        }`
      : '';

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Linee guida orizzontali */}
        {[0, 0.5, 1].map((step, idx) => {
          const yPos = padY + step * (height - padY * 2);
          const val = (paddedMax - step * totalRange).toFixed(1);
          return (
            <g key={idx}>
              <line
                x1={padX}
                y1={yPos}
                x2={width - padX}
                y2={yPos}
                stroke="#1e293b"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padX - 8}
                y={yPos + 4}
                textAnchor="end"
                className="fill-slate-500 text-[11px] font-mono"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area sfumata sotto la curva */}
        {points.length > 1 && <polygon points={areaPoints} fill="url(#weightAreaGrad)" />}

        {/* Linea principale */}
        {points.length > 1 && (
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />
        )}

        {/* Punti interattivi */}
        {points.map((p, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <g
              key={p.id}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setHoveredIdx(idx === hoveredIdx ? null : idx)}
            >
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6.5 : 4.5}
                fill="#020617"
                stroke="#10b981"
                strokeWidth={isHovered ? 3 : 2.5}
              />
              {!compact && (
                <text
                  x={p.x}
                  y={height - 6}
                  textAnchor="middle"
                  className="fill-slate-400 text-[10px] font-mono"
                >
                  {p.date.slice(5).replace('-', '/')}
                </text>
              )}
              {(isHovered || (points.length <= 7 && !compact)) && (
                <g transform={`translate(${p.x}, ${p.y - 14})`}>
                  <rect
                    x="-24"
                    y="-15"
                    width="48"
                    height="18"
                    rx="5"
                    fill={isHovered ? '#10b981' : '#0f172a'}
                    stroke="#10b981"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="-3"
                    textAnchor="middle"
                    className={`text-[11px] font-bold font-mono ${
                      isHovered ? 'fill-slate-950' : 'fill-emerald-300'
                    }`}
                  >
                    {Number(p.weight).toFixed(1)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredIdx !== null && points[hoveredIdx] && (
        <div className="mt-2 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">
            Data: <strong className="text-white">{points[hoveredIdx].date}</strong>
            {points[hoveredIdx].note && (
              <span className="text-slate-400 ml-2">— "{points[hoveredIdx].note}"</span>
            )}
          </span>
          <span className="text-emerald-400 font-bold font-mono">
            {Number(points[hoveredIdx].weight).toFixed(1)} kg
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// APPLICAZIONE PRINCIPALE
// ============================================================================

export default function App() {
  // Caricamento stato iniziale da localStorage
  const loadInitialState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Errore lettura localStorage:', e);
    }
    return null;
  };

  const saved = useMemo(() => loadInitialState(), []);

  // Navigazione principale
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'nutrition' | 'workout'
  const [selectedDay, setSelectedDay] = useState(getTodayDayId());

  // Dati persistenti
  const [targets, setTargets] = useState(saved?.targets || INITIAL_TARGETS);
  const [foods, setFoods] = useState(saved?.foods || INITIAL_FOODS);
  const [meals, setMeals] = useState(saved?.meals || INITIAL_MEALS);
  const [weeklyPlan, setWeeklyPlan] = useState(saved?.weeklyPlan || INITIAL_WEEKLY_PLAN);
  const [weightLogs, setWeightLogs] = useState(saved?.weightLogs || INITIAL_WEIGHT_LOGS);
  const [routines, setRoutines] = useState(saved?.routines || INITIAL_WORKOUT_ROUTINES);
  const [workoutHistory, setWorkoutHistory] = useState(saved?.workoutHistory || []);

  // Notifica toast non invasiva
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Salvataggio automatico su localStorage
  useEffect(() => {
    try {
      const payload = {
        targets,
        foods,
        meals,
        weeklyPlan,
        weightLogs,
        routines,
        workoutHistory,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Errore salvataggio localStorage:', e);
    }
  }, [targets, foods, meals, weeklyPlan, weightLogs, routines, workoutHistory]);

  // ==========================================================================
  // HELPER CALCOLO MACRO ALIMENTI E PASTI
  // ==========================================================================

  const getFoodById = (id) => foods.find((f) => f.id === id);

  const getMealMacros = (meal) => {
    if (!meal || !meal.items) return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    return meal.items.reduce(
      (acc, item) => {
        const f = getFoodById(item.foodId);
        if (!f) return acc;
        const mult = Number(item.multiplier) || 1;
        return {
          kcal: acc.kcal + f.kcal * mult,
          protein: acc.protein + f.protein * mult,
          carbs: acc.carbs + f.carbs * mult,
          fat: acc.fat + f.fat * mult,
        };
      },
      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const getEntryMacros = (entry) => {
    if (entry.type === 'food') {
      const f = getFoodById(entry.refId);
      if (!f) return { name: 'Alimento rimosso', kcal: 0, protein: 0, carbs: 0, fat: 0 };
      const mult = entry.multiplier || 1;
      return {
        name: mult !== 1 ? `${f.name} (x${mult})` : f.name,
        portion: f.portion,
        kcal: f.kcal * mult,
        protein: f.protein * mult,
        carbs: f.carbs * mult,
        fat: f.fat * mult,
      };
    } else {
      const m = meals.find((meal) => meal.id === entry.refId);
      if (!m) return { name: 'Pasto rimosso', kcal: 0, protein: 0, carbs: 0, fat: 0 };
      const totals = getMealMacros(m);
      return {
        name: m.name,
        portion: `${m.items.length} ingredienti`,
        ...totals,
      };
    }
  };

  const getDayTotals = (dayId) => {
    const dayObj = weeklyPlan[dayId] || { colazione: [], pranzo: [], spuntini: [], cena: [] };
    let totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    MEAL_SLOTS.forEach((slot) => {
      (dayObj[slot.id] || []).forEach((entry) => {
        const m = getEntryMacros(entry);
        totals.kcal += m.kcal;
        totals.protein += m.protein;
        totals.carbs += m.carbs;
        totals.fat += m.fat;
      });
    });
    return totals;
  };

  const selectedDayTotals = useMemo(
    () => getDayTotals(selectedDay),
    [selectedDay, weeklyPlan, foods, meals]
  );

  // ==========================================================================
  // STATO SEZIONE ALIMENTAZIONE & PESO
  // ==========================================================================

  const [nutritionSubTab, setNutritionSubTab] = useState('planner'); // 'planner' | 'database' | 'weight' | 'targets'
  const [assignModalSlot, setAssignModalSlot] = useState(null); // slotId per modale assegnazione rapida
  const [assignSearch, setAssignSearch] = useState('');
  const [copyTargetDay, setCopyTargetDay] = useState('');

  // Form nuovo alimento
  const [newFood, setNewFood] = useState({
    name: '',
    portion: '100g',
    kcal: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Form composizione pasto
  const [newMealName, setNewMealName] = useState('');
  const [newMealItems, setNewMealItems] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState(INITIAL_FOODS[0]?.id || '');
  const [selectedIngredientMult, setSelectedIngredientMult] = useState('1');

  // Form pesata
  const [newWeightDate, setNewWeightDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newWeightVal, setNewWeightVal] = useState('');
  const [newWeightNote, setNewWeightNote] = useState('');

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name.trim()) return;
    const item = {
      id: 'f_' + Date.now(),
      name: newFood.name.trim(),
      portion: newFood.portion.trim() || '1 porzione',
      kcal: Number(newFood.kcal) || 0,
      protein: Number(newFood.protein) || 0,
      carbs: Number(newFood.carbs) || 0,
      fat: Number(newFood.fat) || 0,
    };
    setFoods((prev) => [item, ...prev]);
    setNewFood({ name: '', portion: '100g', kcal: '', protein: '', carbs: '', fat: '' });
    showToast(`Alimento "${item.name}" aggiunto al database!`);
  };

  const handleAddIngredientToDraftMeal = () => {
    if (!selectedIngredientId) return;
    const mult = parseFloat(selectedIngredientMult) || 1;
    setNewMealItems((prev) => [...prev, { foodId: selectedIngredientId, multiplier: mult }]);
  };

  const handleSaveComposedMeal = (e) => {
    e.preventDefault();
    if (!newMealName.trim() || newMealItems.length === 0) return;
    const meal = {
      id: 'm_' + Date.now(),
      name: newMealName.trim(),
      items: newMealItems,
    };
    setMeals((prev) => [meal, ...prev]);
    setNewMealName('');
    setNewMealItems([]);
    showToast(`Pasto composto "${meal.name}" salvato!`);
  };

  const handleAssignToSlot = (slotId, type, refId) => {
    setWeeklyPlan((prev) => {
      const dayPlan = prev[selectedDay] || { colazione: [], pranzo: [], spuntini: [], cena: [] };
      const slotItems = dayPlan[slotId] || [];
      return {
        ...prev,
        [selectedDay]: {
          ...dayPlan,
          [slotId]: [...slotItems, { type, refId, multiplier: 1 }],
        },
      };
    });
    setAssignModalSlot(null);
    setAssignSearch('');
    showToast('Elemento aggiunto al piano giornaliero');
  };

  const handleRemoveFromSlot = (slotId, index) => {
    setWeeklyPlan((prev) => {
      const dayPlan = prev[selectedDay];
      const updated = [...(dayPlan[slotId] || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        [selectedDay]: {
          ...dayPlan,
          [slotId]: updated,
        },
      };
    });
  };

  const handleCopyDayPlan = () => {
    if (!copyTargetDay || copyTargetDay === selectedDay) return;
    setWeeklyPlan((prev) => ({
      ...prev,
      [copyTargetDay]: JSON.parse(JSON.stringify(prev[selectedDay])),
    }));
    const targetLabel = DAYS_OF_WEEK.find((d) => d.id === copyTargetDay)?.label;
    showToast(`Piano copiato su ${targetLabel}!`);
    setCopyTargetDay('');
  };

  const handleAddWeightLog = (e) => {
    e.preventDefault();
    const w = parseFloat(newWeightVal);
    if (!w || w <= 20 || w > 350) return;
    const entry = {
      id: 'wl_' + Date.now(),
      date: newWeightDate,
      weight: w,
      note: newWeightNote.trim(),
    };
    setWeightLogs((prev) => [...prev, entry]);
    setNewWeightVal('');
    setNewWeightNote('');
    showToast(`Pesata di ${w.toFixed(1)} kg registrata!`);
  };

  // ==========================================================================
  // STATO SEZIONE ALLENAMENTO & TIMER DI RECUPERO
  // ==========================================================================

  const [selectedRoutineId, setSelectedRoutineId] = useState(INITIAL_WORKOUT_ROUTINES[0].id);
  const [workoutMode, setWorkoutMode] = useState('live'); // 'live' | 'edit' | 'history'

  // Stato delle serie completate nella sessione corrente: { [exerciseId]: [bool, bool, ...] }
  const [completedSets, setCompletedSets] = useState({});
  // Pesi live modificabili al volo: { [exerciseId]: number }
  const [liveWeights, setLiveWeights] = useState({});

  // Stato modifica scheda
  const [newExForm, setNewExForm] = useState({
    name: '',
    sets: 3,
    reps: '10-12',
    weight: 10,
    rest: 90,
    notes: '',
  });

  // Stato Timer di Recupero
  const [timerSeconds, setTimerSeconds] = useState(90);
  const [timerInitial, setTimerInitial] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinishedFlash, setTimerFinishedFlash] = useState(false);
  const [autoStartTimer, setAutoStartTimer] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            setTimerFinishedFlash(true);
            if (soundEnabled) playBeepSound();
            setTimeout(() => setTimerFinishedFlash(false), 3500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning, soundEnabled]);

  const startTimerWithDuration = (sec) => {
    setTimerFinishedFlash(false);
    setTimerInitial(sec);
    setTimerSeconds(sec);
    setTimerRunning(true);
  };

  const adjustTimer = (delta) => {
    setTimerFinishedFlash(false);
    setTimerSeconds((prev) => Math.max(0, prev + delta));
  };

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentRoutine = useMemo(
    () => routines.find((r) => r.id === selectedRoutineId) || routines[0],
    [routines, selectedRoutineId]
  );

  const toggleSetComplete = (exercise, setIndex) => {
    const prevArr =
      completedSets[exercise.id] || Array.from({ length: exercise.sets }, () => false);
    const nextArr = [...prevArr];
    const becomingCompleted = !nextArr[setIndex];
    nextArr[setIndex] = becomingCompleted;

    setCompletedSets((prev) => ({
      ...prev,
      [exercise.id]: nextArr,
    }));

    // Auto-avvio timer recupero se spuntiamo la serie
    if (becomingCompleted && autoStartTimer && exercise.rest > 0) {
      startTimerWithDuration(exercise.rest);
    }
  };

  const updateExerciseLiveWeight = (exerciseId, delta) => {
    const ex = currentRoutine.exercises.find((e) => e.id === exerciseId);
    const currentW = liveWeights[exerciseId] !== undefined ? liveWeights[exerciseId] : ex.weight;
    const nextW = Math.max(0, Number((currentW + delta).toFixed(1)));

    setLiveWeights((prev) => ({ ...prev, [exerciseId]: nextW }));

    // Aggiorna anche il peso base nella scheda così resta salvato per la prossima volta
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoutine.id) return r;
        return {
          ...r,
          exercises: r.exercises.map((item) =>
            item.id === exerciseId ? { ...item, weight: nextW } : item
          ),
        };
      })
    );
  };

  const sessionStats = useMemo(() => {
    if (!currentRoutine) return { total: 0, done: 0, pct: 0 };
    let total = 0;
    let done = 0;
    currentRoutine.exercises.forEach((ex) => {
      total += ex.sets;
      const arr = completedSets[ex.id] || [];
      done += arr.filter(Boolean).length;
    });
    return {
      total,
      done,
      pct: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  }, [currentRoutine, completedSets]);

  const handleFinishWorkout = () => {
    const log = {
      id: 'wh_' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      routineTitle: currentRoutine.title,
      setsCompleted: sessionStats.done,
      setsTotal: sessionStats.total,
    };
    setWorkoutHistory((prev) => [log, ...prev]);
    setCompletedSets({});
    setTimerRunning(false);
    showToast(`Allenamento "${currentRoutine.title}" completato e salvato!`);
  };

  const handleAddExerciseToRoutine = (e) => {
    e.preventDefault();
    if (!newExForm.name.trim()) return;
    const newEx = {
      id: 'ex_' + Date.now(),
      name: newExForm.name.trim(),
      sets: Math.max(1, Number(newExForm.sets) || 3),
      reps: newExForm.reps.trim() || '10',
      weight: Math.max(0, Number(newExForm.weight) || 0),
      rest: Math.max(15, Number(newExForm.rest) || 60),
      notes: newExForm.notes.trim(),
    };
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === currentRoutine.id ? { ...r, exercises: [...r.exercises, newEx] } : r
      )
    );
    setNewExForm({ name: '', sets: 3, reps: '10-12', weight: 10, rest: 90, notes: '' });
    showToast('Esercizio aggiunto alla scheda!');
  };

  const handleDeleteExercise = (exId) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === currentRoutine.id
          ? { ...r, exercises: r.exercises.filter((ex) => ex.id !== exId) }
          : r
      )
    );
    showToast('Esercizio rimosso dalla scheda', 'info');
  };

  const handleUpdateExerciseField = (exId, field, value) => {
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== currentRoutine.id) return r;
        return {
          ...r,
          exercises: r.exercises.map((ex) => (ex.id === exId ? { ...ex, [field]: value } : ex)),
        };
      })
    );
  };

  // ==========================================================================
  // BACKUP JSON (EXPORT / IMPORT / RESET)
  // ==========================================================================

  const fileInputRef = useRef(null);

  const handleExportJSON = () => {
    const data = {
      targets,
      foods,
      meals,
      weeklyPlan,
      weightLogs,
      routines,
      workoutHistory,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup JSON esportato!');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.targets) setTargets(parsed.targets);
        if (parsed.foods) setFoods(parsed.foods);
        if (parsed.meals) setMeals(parsed.meals);
        if (parsed.weeklyPlan) setWeeklyPlan(parsed.weeklyPlan);
        if (parsed.weightLogs) setWeightLogs(parsed.weightLogs);
        if (parsed.routines) setRoutines(parsed.routines);
        if (parsed.workoutHistory) setWorkoutHistory(parsed.workoutHistory);
        showToast('Dati importati con successo!');
      } catch (err) {
        showToast('File JSON non valido.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDemoData = () => {
    setTargets(INITIAL_TARGETS);
    setFoods(INITIAL_FOODS);
    setMeals(INITIAL_MEALS);
    setWeeklyPlan(INITIAL_WEEKLY_PLAN);
    setWeightLogs(INITIAL_WEIGHT_LOGS);
    setRoutines(INITIAL_WORKOUT_ROUTINES);
    setWorkoutHistory([]);
    setCompletedSets({});
    showToast('Dati di esempio ripristinati!');
  };

  // ==========================================================================
  // CALCOLI STATISTICHE PESO
  // ==========================================================================

  const weightStats = useMemo(() => {
    const sorted = [...weightLogs].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length === 0) return { current: null, deltaPrev: 0, deltaStart: 0 };
    const current = Number(sorted[sorted.length - 1].weight);
    const first = Number(sorted[0].weight);
    const prev = sorted.length > 1 ? Number(sorted[sorted.length - 2].weight) : current;
    return {
      current,
      date: sorted[sorted.length - 1].date,
      deltaPrev: Number((current - prev).toFixed(1)),
      deltaStart: Number((current - first).toFixed(1)),
    };
  }, [weightLogs]);

  // ==========================================================================
  // RENDER UI
  // ==========================================================================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* TOAST NOTIFICA */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-700 text-rose-200'
                : 'bg-slate-900/95 border-emerald-500/60 text-emerald-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* HEADER SUPERIORE */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight leading-none">
                FitTrack <span className="text-emerald-400">Pro</span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Dieta Settimanale • Peso • Manubri & Corpo Libero
              </p>
            </div>
          </div>

          {/* Pulsanti Backup / Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleExportJSON}
              title="Esporta backup JSON"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Esporta</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Importa backup JSON"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Importa</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <button
              onClick={handleResetDemoData}
              title="Ripristina dati iniziali di esempio"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Demo</span>
            </button>
          </div>
        </div>

        {/* NAVIGAZIONE PRINCIPALE */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 sm:gap-2 pb-2 pt-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-sky-400" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('nutrition')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'nutrition'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Utensils className="w-4 h-4 text-emerald-400" />
            <span>Alimentazione & Peso</span>
          </button>

          <button
            onClick={() => setActiveTab('workout')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
              activeTab === 'workout'
                ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Dumbbell className="w-4 h-4 text-indigo-400" />
            <span>Allenamento (3x)</span>
          </button>
        </div>
      </header>

      {/* CONTENUTO PRINCIPALE */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-36">
        {/* ================================================================== */}
        {/* TAB 1: DASHBOARD RIEPILOGATIVA                                     */}
        {/* ================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Selettore giorno rapido in dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Riepilogo Giornaliero
                </h2>
                <p className="text-xs text-slate-400">
                  Visualizza macro e stato workout per il giorno selezionato
                </p>
              </div>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                {DAYS_OF_WEEK.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDay(d.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedDay === d.id
                        ? 'bg-emerald-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d.short}
                  </button>
                ))}
              </div>
            </div>

            {/* Griglia KPI principali */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card Calorie & Macronutrienti */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Utensils className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-base">
                        Alimentazione — {DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.label}
                      </h3>
                      <p className="text-xs text-slate-400">Bilancio energetico e macronutrienti</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('nutrition')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    Apri Piano <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Barra Calorie Principale */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 mb-4">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                        Calorie Pianificate
                      </span>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                        {Math.round(selectedDayTotals.kcal)}{' '}
                        <span className="text-sm font-normal text-slate-400">
                          / {targets.kcal} kcal
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        selectedDayTotals.kcal > targets.kcal
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-emerald-500/15 text-emerald-300'
                      }`}
                    >
                      {Math.round((selectedDayTotals.kcal / Math.max(1, targets.kcal)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedDayTotals.kcal / Math.max(1, targets.kcal)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* 3 Barre Macro */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Proteine',
                      val: selectedDayTotals.protein,
                      target: targets.protein,
                      color: 'bg-sky-400',
                      textColor: 'text-sky-400',
                    },
                    {
                      label: 'Carboidrati',
                      val: selectedDayTotals.carbs,
                      target: targets.carbs,
                      color: 'bg-amber-400',
                      textColor: 'text-amber-400',
                    },
                    {
                      label: 'Grassi',
                      val: selectedDayTotals.fat,
                      target: targets.fat,
                      color: 'bg-rose-400',
                      textColor: 'text-rose-400',
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3"
                    >
                      <div className="text-xs text-slate-400 mb-1">{m.label}</div>
                      <div className="font-mono font-bold text-sm sm:text-base text-white">
                        {Math.round(m.val)}g{' '}
                        <span className="text-xs text-slate-500 font-normal">/ {m.target}g</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full ${m.color} transition-all duration-300`}
                          style={{
                            width: `${Math.min(100, (m.val / Math.max(1, m.target)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Andamento Peso */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <Scale className="w-5 h-5" />
                      </span>
                      <h3 className="font-bold text-base">Peso Corporeo</h3>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('nutrition');
                        setNutritionSubTab('weight');
                      }}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Dettagli <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {weightStats.current !== null ? (
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-3xl font-extrabold font-mono text-white">
                        {weightStats.current.toFixed(1)}{' '}
                        <span className="text-sm font-normal text-slate-400">kg</span>
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          weightStats.deltaStart < 0
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : weightStats.deltaStart > 0
                            ? 'bg-sky-500/15 text-sky-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {weightStats.deltaStart > 0 ? '+' : ''}
                        {weightStats.deltaStart} kg tot
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 mb-3">Nessun peso registrato</p>
                  )}
                </div>

                <WeightChart logs={weightLogs} compact={true} />
              </div>
            </div>

            {/* Sezione Rapida Schede Allenamento (3x Settimana) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                    <Dumbbell className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Schede Allenamento (3x Settimana • Manubri + Corpo Libero)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Scegli la sessione di oggi per avviare il tracker serie e il timer di recupero
                    </p>
                  </div>
                </div>
                {workoutHistory.length > 0 && (
                  <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full self-start sm:self-auto">
                    {workoutHistory.length} sessioni completate
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {routines.map((routine) => (
                  <div
                    key={routine.id}
                    className="bg-slate-950/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-4 flex flex-col justify-between transition"
                  >
                    <div>
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 mb-2">
                        {routine.exercises.length} Esercizi
                      </span>
                      <h4 className="font-bold text-white text-sm mb-1">{routine.title}</h4>
                      <p className="text-xs text-slate-400 mb-3">{routine.subtitle}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedRoutineId(routine.id);
                        setWorkoutMode('live');
                        setActiveTab('workout');
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Inizia Workout
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: ALIMENTAZIONE & PESO                                        */}
        {/* ================================================================== */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            {/* Sotto-navigazione Alimentazione */}
            <div className="flex flex-wrap gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
              {[
                { id: 'planner', label: 'Piano Settimanale', icon: Calendar },
                { id: 'database', label: 'Crea Pasti & Alimenti', icon: Plus },
                { id: 'weight', label: 'Tracker Peso', icon: Scale },
                { id: 'targets', label: 'Obiettivi Macro', icon: SlidersHorizontal },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setNutritionSubTab(tab.id)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
                      nutritionSubTab === tab.id
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* -------------------------------------------------------------- */}
            {/* SOTTO-TAB 2A: PIANO SETTIMANALE                                */}
            {/* -------------------------------------------------------------- */}
            {nutritionSubTab === 'planner' && (
              <div className="space-y-5">
                {/* Barra giorni della settimana */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {DAYS_OF_WEEK.map((d) => {
                    const totals = getDayTotals(d.id);
                    const isSelected = selectedDay === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDay(d.id)}
                        className={`p-2 sm:p-3 rounded-xl border text-center transition flex flex-col items-center ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs sm:text-sm font-bold">{d.short}</span>
                        <span
                          className={`text-[10px] sm:text-xs font-mono mt-1 ${
                            isSelected ? 'text-emerald-300' : 'text-slate-500'
                          }`}
                        >
                          {Math.round(totals.kcal)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Riepilogo Macro del Giorno Selezionato + Copia Giorno */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Menu di {DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.label}
                      </h2>
                      <p className="text-xs text-slate-400">
                        Assegna pasti composti o singoli alimenti agli slot della giornata
                      </p>
                    </div>

                    {/* Strumento Copia Giorno */}
                    <div className="flex items-center gap-2">
                      <select
                        value={copyTargetDay}
                        onChange={(e) => setCopyTargetDay(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="">Copia questo giorno su...</option>
                        {DAYS_OF_WEEK.filter((d) => d.id !== selectedDay).map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleCopyDayPlan}
                        disabled={!copyTargetDay}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-emerald-300 flex items-center gap-1.5 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copia
                      </button>
                    </div>
                  </div>

                  {/* Barre riassuntive giornaliero */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">Calorie Totali</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-emerald-400">
                        {Math.round(selectedDayTotals.kcal)}{' '}
                        <span className="text-xs text-slate-500">/ {targets.kcal}</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">Proteine</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-sky-400">
                        {Math.round(selectedDayTotals.protein)}g{' '}
                        <span className="text-xs text-slate-500">/ {targets.protein}g</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">Carboidrati</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-amber-400">
                        {Math.round(selectedDayTotals.carbs)}g{' '}
                        <span className="text-xs text-slate-500">/ {targets.carbs}g</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">Grassi</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-rose-400">
                        {Math.round(selectedDayTotals.fat)}g{' '}
                        <span className="text-xs text-slate-500">/ {targets.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slot Pasti del Giorno */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEAL_SLOTS.map((slot) => {
                    const items = weeklyPlan[selectedDay]?.[slot.id] || [];
                    const slotTotals = items.reduce(
                      (acc, entry) => {
                        const m = getEntryMacros(entry);
                        return {
                          kcal: acc.kcal + m.kcal,
                          protein: acc.protein + m.protein,
                          carbs: acc.carbs + m.carbs,
                          fat: acc.fat + m.fat,
                        };
                      },
                      { kcal: 0, protein: 0, carbs: 0, fat: 0 }
                    );

                    return (
                      <div
                        key={slot.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{slot.icon}</span>
                              <h3 className="font-bold text-white text-sm sm:text-base">
                                {slot.label}
                              </h3>
                            </div>
                            <span className="text-xs font-mono text-emerald-400 font-semibold">
                              {Math.round(slotTotals.kcal)} kcal
                            </span>
                          </div>

                          {items.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-4 text-center border border-dashed border-slate-800 rounded-xl mb-3">
                              Nessun pasto assegnato
                            </p>
                          ) : (
                            <div className="space-y-2 mb-3">
                              {items.map((entry, idx) => {
                                const info = getEntryMacros(entry);
                                return (
                                  <div
                                    key={idx}
                                    className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-2.5 flex items-center justify-between gap-2"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span
                                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                            entry.type === 'meal'
                                              ? 'bg-emerald-500/15 text-emerald-300'
                                              : 'bg-slate-800 text-slate-300'
                                          }`}
                                        >
                                          {entry.type === 'meal' ? 'Pasto' : 'Alimento'}
                                        </span>
                                        <p className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                                          {info.name}
                                        </p>
                                      </div>
                                      <p className="text-[11px] font-mono text-slate-400 mt-1">
                                        {Math.round(info.kcal)} kcal • P:{Math.round(info.protein)}g
                                        • C:{Math.round(info.carbs)}g • G:{Math.round(info.fat)}g
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleRemoveFromSlot(slot.id, idx)}
                                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition shrink-0"
                                      title="Rimuovi"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => setAssignModalSlot(slot.id)}
                          className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-4 h-4" />
                          Aggiungi a {slot.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* SOTTO-TAB 2B: DATABASE ALIMENTI & COMPOSIZIONE PASTI           */}
            {/* -------------------------------------------------------------- */}
            {nutritionSubTab === 'database' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colonna 1: Componi un Pasto da più Alimenti */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">
                      Componi Nuovo Pasto Ricorrente
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Combina più alimenti dal database (es. Colazione o Pranzo completo) con calcolo
                    automatico dei macronutrienti.
                  </p>

                  <form onSubmit={handleSaveComposedMeal} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nome del Pasto
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Es. Pranzo Pasta, Tonno e Zucchine"
                        value={newMealName}
                        onChange={(e) => setNewMealName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Aggiungi Ingrediente al Pasto
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select
                          value={selectedIngredientId}
                          onChange={(e) => setSelectedIngredientId(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                        >
                          {foods.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name} ({f.portion} - {f.kcal} kcal)
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.25"
                            min="0.25"
                            value={selectedIngredientMult}
                            onChange={(e) => setSelectedIngredientMult(e.target.value)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white text-center font-mono"
                            title="Moltiplicatore porzione (es. 1 = 1 porzione, 1.5 = 1.5 porzioni)"
                          />
                          <button
                            type="button"
                            onClick={handleAddIngredientToDraftMeal}
                            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Aggiungi
                          </button>
                        </div>
                      </div>

                      {/* Lista ingredienti bozza */}
                      {newMealItems.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-slate-800">
                          {newMealItems.map((it, idx) => {
                            const f = getFoodById(it.foodId);
                            if (!f) return null;
                            return (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs bg-slate-900 px-2.5 py-1.5 rounded-lg"
                              >
                                <span className="text-slate-200">
                                  <strong>{it.multiplier}x</strong> {f.name} ({f.portion})
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-slate-400">
                                    {Math.round(f.kcal * it.multiplier)} kcal
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setNewMealItems((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                    className="text-rose-400 hover:text-rose-300"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          {/* Totale bozza */}
                          {(() => {
                            const draftTotals = getMealMacros({ items: newMealItems });
                            return (
                              <div className="pt-2 flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                                <span>Totale Pasto:</span>
                                <span>
                                  {Math.round(draftTotals.kcal)} kcal | P:
                                  {Math.round(draftTotals.protein)}g | C:
                                  {Math.round(draftTotals.carbs)}g | G:{Math.round(draftTotals.fat)}g
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!newMealName.trim() || newMealItems.length === 0}
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm transition"
                    >
                      Salva Pasto Composto
                    </button>
                  </form>

                  {/* Elenco Pasti Composti Salvati */}
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Pasti Salvati ({meals.length})
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {meals.map((meal) => {
                        const mTotals = getMealMacros(meal);
                        return (
                          <div
                            key={meal.id}
                            className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-2"
                          >
                            <div>
                              <p className="text-xs sm:text-sm font-bold text-white">{meal.name}</p>
                              <p className="text-[11px] font-mono text-emerald-400 mt-0.5">
                                {Math.round(mTotals.kcal)} kcal • P:{Math.round(mTotals.protein)}g •
                                C:{Math.round(mTotals.carbs)}g • G:{Math.round(mTotals.fat)}g
                              </p>
                            </div>
                            <button
                              onClick={() => setMeals((prev) => prev.filter((m) => m.id !== meal.id))}
                              className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                              title="Elimina pasto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Colonna 2: Aggiungi Singolo Alimento + Database Alimenti */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">
                      Aggiungi Singolo Alimento al Database
                    </h3>
                  </div>

                  <form onSubmit={handleAddFood} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-400 mb-1">Nome Alimento</label>
                        <input
                          type="text"
                          required
                          placeholder="Es. Merluzzo al vapore"
                          value={newFood.name}
                          onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Porzione</label>
                        <input
                          type="text"
                          placeholder="100g"
                          value={newFood.portion}
                          onChange={(e) => setNewFood({ ...newFood, portion: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Kcal</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          placeholder="0"
                          value={newFood.kcal}
                          onChange={(e) => setNewFood({ ...newFood, kcal: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-sky-400 mb-1">Prot (g)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          placeholder="0"
                          value={newFood.protein}
                          onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-amber-400 mb-1">Carb (g)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          placeholder="0"
                          value={newFood.carbs}
                          onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-rose-400 mb-1">Grassi (g)</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="any"
                          placeholder="0"
                          value={newFood.fat}
                          onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/30 font-bold text-sm transition"
                    >
                      + Aggiungi Alimento
                    </button>
                  </form>

                  {/* Lista Alimenti nel Database */}
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Database Alimenti ({foods.length})
                    </h4>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {foods.map((food) => (
                        <div
                          key={food.id}
                          className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-white">
                              {food.name}{' '}
                              <span className="text-xs font-normal text-slate-400">
                                ({food.portion})
                              </span>
                            </p>
                            <p className="text-[11px] font-mono text-slate-400">
                              {food.kcal} kcal • P:{food.protein}g • C:{food.carbs}g • G:{food.fat}g
                            </p>
                          </div>
                          <button
                            onClick={() => setFoods((prev) => prev.filter((f) => f.id !== food.id))}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                            title="Elimina alimento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* SOTTO-TAB 2C: TRACKER PESO CORPOREO                            */}
            {/* -------------------------------------------------------------- */}
            {nutritionSubTab === 'weight' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Nuova Pesata */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-base text-white">Registra Peso Settimanale</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    Consiglio: pesati sempre lo stesso giorno della settimana al mattino a digiuno.
                  </p>

                  <form onSubmit={handleAddWeightLog} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Data</label>
                      <input
                        type="date"
                        required
                        value={newWeightDate}
                        onChange={(e) => setNewWeightDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="30"
                        max="300"
                        required
                        placeholder="Es. 77.2"
                        value={newWeightVal}
                        onChange={(e) => setNewWeightVal(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-base font-mono font-bold text-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Note (opzionale)</label>
                      <input
                        type="text"
                        placeholder="Es. Check domenicale, buona condizione"
                        value={newWeightNote}
                        onChange={(e) => setNewWeightNote(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition"
                    >
                      Salva Pesata
                    </button>
                  </form>
                </div>

                {/* Grafico + Storico Pesate */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-base text-white">Andamento nel Tempo</h3>
                      <p className="text-xs text-slate-400">
                        Passa il mouse o tocca i punti per vedere i dettagli
                      </p>
                    </div>
                    {weightStats.current !== null && (
                      <div className="flex gap-2">
                        <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                          <span className="text-slate-400">Ultima: </span>
                          <strong className="text-white font-mono">
                            {weightStats.current.toFixed(1)} kg
                          </strong>
                        </div>
                        <div className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                          <span className="text-slate-400">Totale: </span>
                          <strong
                            className={`font-mono ${
                              weightStats.deltaStart <= 0 ? 'text-emerald-400' : 'text-sky-400'
                            }`}
                          >
                            {weightStats.deltaStart > 0 ? '+' : ''}
                            {weightStats.deltaStart} kg
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  <WeightChart logs={weightLogs} />

                  {/* Storico Tabellare */}
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Storico Registrazioni ({weightLogs.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {[...weightLogs]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((log) => (
                          <div
                            key={log.id}
                            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="text-xs font-mono text-slate-400 shrink-0">
                                {log.date}
                              </span>
                              <span className="text-sm font-bold font-mono text-emerald-400 shrink-0">
                                {Number(log.weight).toFixed(1)} kg
                              </span>
                              {log.note && (
                                <span className="text-xs text-slate-400 truncate">— {log.note}</span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setWeightLogs((prev) => prev.filter((item) => item.id !== log.id))
                              }
                              className="p-1 text-slate-500 hover:text-rose-400 transition shrink-0"
                              title="Elimina pesata"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* SOTTO-TAB 2D: OBIETTIVI GIORNALIERI                            */}
            {/* -------------------------------------------------------------- */}
            {nutritionSubTab === 'targets' && (
              <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-white">Target Nutrizionali Giornalieri</h3>
                <p className="text-xs text-slate-400">
                  Imposta i tuoi obiettivi di calorie e macronutrienti per confrontarli con il
                  piano settimanale.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Calorie (kcal)</label>
                    <input
                      type="number"
                      value={targets.kcal}
                      onChange={(e) => setTargets({ ...targets, kcal: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-sky-400 mb-1">Proteine (g)</label>
                    <input
                      type="number"
                      value={targets.protein}
                      onChange={(e) => setTargets({ ...targets, protein: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-amber-400 mb-1">Carboidrati (g)</label>
                    <input
                      type="number"
                      value={targets.carbs}
                      onChange={(e) => setTargets({ ...targets, carbs: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-rose-400 mb-1">Grassi (g)</label>
                    <input
                      type="number"
                      value={targets.fat}
                      onChange={(e) => setTargets({ ...targets, fat: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-base font-mono font-bold text-white"
                    />
                  </div>
                </div>
                <div className="pt-2 text-xs text-slate-400 font-mono">
                  Calorie calcolate dai macro:{' '}
                  <strong className="text-slate-200">
                    {targets.protein * 4 + targets.carbs * 4 + targets.fat * 9} kcal
                  </strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: ALLENAMENTO (3x SETTIMANA MANUBRI + CORPO LIBERO + TIMER)   */}
        {/* ================================================================== */}
        {activeTab === 'workout' && (
          <div className="space-y-6">
            {/* Selettore Scheda (Giorno A / B / C) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {routines.map((r) => {
                const isSelected = r.id === currentRoutine.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRoutineId(r.id)}
                    className={`p-4 rounded-2xl border text-left transition ${
                      isSelected
                        ? 'bg-indigo-500/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                        {r.tag}
                      </span>
                      {isSelected && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                      )}
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-white">{r.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{r.subtitle}</p>
                  </button>
                );
              })}
            </div>

            {/* Barra Modalità: Allenamento Live vs Modifica Scheda vs Storico */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
              <div className="flex gap-1.5 flex-1 sm:flex-none">
                <button
                  onClick={() => setWorkoutMode('live')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    workoutMode === 'live'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Allenamento Live</span>
                </button>
                <button
                  onClick={() => setWorkoutMode('edit')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    workoutMode === 'edit'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modifica Scheda</span>
                </button>
                <button
                  onClick={() => setWorkoutMode('history')}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition ${
                    workoutMode === 'history'
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Storico ({workoutHistory.length})</span>
                </button>
              </div>

              {/* Toggle Auto-Timer al completamento serie */}
              {workoutMode === 'live' && (
                <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer select-none text-xs">
                  <input
                    type="checkbox"
                    checked={autoStartTimer}
                    onChange={(e) => setAutoStartTimer(e.target.checked)}
                    className="accent-indigo-500 w-4 h-4 rounded"
                  />
                  <span className="text-slate-300 font-medium">
                    Auto-avvia timer recupero al check serie
                  </span>
                </label>
              )}
            </div>

            {/* -------------------------------------------------------------- */}
            {/* VISTA 3A: MODALITÀ ALLENAMENTO LIVE (Ottimizzata una mano)     */}
            {/* -------------------------------------------------------------- */}
            {workoutMode === 'live' && (
              <div className="space-y-4">
                {/* Barra avanzamento sessione */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300">
                      Avanzamento Sessione: {sessionStats.done} / {sessionStats.total} serie
                    </span>
                    <span className="font-mono font-bold text-indigo-400">{sessionStats.pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-300"
                      style={{ width: `${sessionStats.pct}%` }}
                    />
                  </div>
                </div>

                {/* Card Esercizi Live */}
                <div className="space-y-4">
                  {currentRoutine.exercises.map((ex, idx) => {
                    const setsState =
                      completedSets[ex.id] || Array.from({ length: ex.sets }, () => false);
                    const currentWeight =
                      liveWeights[ex.id] !== undefined ? liveWeights[ex.id] : ex.weight;
                    const allDone = setsState.length > 0 && setsState.every(Boolean);

                    return (
                      <div
                        key={ex.id}
                        className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 transition ${
                          allDone
                            ? 'border-emerald-500/40 bg-emerald-950/10'
                            : 'border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <h4 className="font-bold text-base sm:text-lg text-white">
                                {ex.name}
                              </h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
                              <span className="font-semibold text-slate-200">
                                {ex.sets} serie × {ex.reps} rip
                              </span>
                              <span className="flex items-center gap-1 text-indigo-300">
                                <Clock className="w-3.5 h-3.5" /> Recupero: {ex.rest}s
                              </span>
                            </div>
                            {ex.notes && (
                              <p className="text-xs text-slate-400 mt-1.5 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800/80">
                                💡 {ex.notes}
                              </p>
                            )}
                          </div>

                          {/* Controllo Rapido Carico Manubri (kg) */}
                          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-2 rounded-xl self-start">
                            <span className="text-[11px] text-slate-400 pl-1">Carico:</span>
                            <button
                              onClick={() => updateExerciseLiveWeight(ex.id, -1)}
                              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center active:scale-95"
                              title="-1 kg"
                            >
                              -
                            </button>
                            <span className="min-w-[54px] text-center font-mono font-bold text-sm text-indigo-300">
                              {currentWeight === 0 ? 'BW' : `${currentWeight} kg`}
                            </span>
                            <button
                              onClick={() => updateExerciseLiveWeight(ex.id, 1)}
                              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center active:scale-95"
                              title="+1 kg"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Pulsanti Grandi per Spuntare le Serie (Touch-Friendly) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {Array.from({ length: ex.sets }).map((_, setIdx) => {
                            const isDone = !!setsState[setIdx];
                            return (
                              <button
                                key={setIdx}
                                onClick={() => toggleSetComplete(ex, setIdx)}
                                className={`py-3.5 px-4 rounded-xl border font-bold text-sm flex items-center justify-between transition active:scale-[0.98] ${
                                  isDone
                                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                                    : 'bg-slate-950 hover:bg-slate-800/80 text-slate-200 border-slate-700'
                                }`}
                              >
                                <span>Serie {setIdx + 1}</span>
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5 text-slate-950" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-600" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pulsante Termina Workout */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleFinishWorkout}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition"
                  >
                    <Check className="w-5 h-5" />
                    Termina e Salva Allenamento
                  </button>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* VISTA 3B: MODIFICA SCHEDA                                      */}
            {/* -------------------------------------------------------------- */}
            {workoutMode === 'edit' && (
              <div className="space-y-6">
                {/* Elenco esercizi modificabili */}
                <div className="space-y-3">
                  {currentRoutine.exercises.map((ex, idx) => (
                    <div
                      key={ex.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-indigo-400">
                          Esercizio #{idx + 1}
                        </span>
                        <button
                          onClick={() => handleDeleteExercise(ex.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Elimina esercizio"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-5">
                          <label className="block text-[11px] text-slate-400 mb-1">Nome</label>
                          <input
                            type="text"
                            value={ex.name}
                            onChange={(e) =>
                              handleUpdateExerciseField(ex.id, 'name', e.target.value)
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Serie</label>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={ex.sets}
                            onChange={(e) =>
                              handleUpdateExerciseField(
                                ex.id,
                                'sets',
                                Math.max(1, Number(e.target.value))
                              )
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-slate-400 mb-1">Ripetizioni</label>
                          <input
                            type="text"
                            value={ex.reps}
                            onChange={(e) =>
                              handleUpdateExerciseField(ex.id, 'reps', e.target.value)
                            }
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                          />
                        </div>
                        <div className="sm:col-span-3 grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Kg</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={ex.weight}
                              onChange={(e) =>
                                handleUpdateExerciseField(ex.id, 'weight', Number(e.target.value))
                              }
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-400 mb-1">Rec (s)</label>
                            <input
                              type="number"
                              min="10"
                              step="5"
                              value={ex.rest}
                              onChange={(e) =>
                                handleUpdateExerciseField(ex.id, 'rest', Number(e.target.value))
                              }
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Aggiungi Nuovo Esercizio */}
                <form
                  onSubmit={handleAddExerciseToRoutine}
                  className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-4"
                >
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <Plus className="w-5 h-5 text-indigo-400" />
                    Aggiungi Esercizio a {currentRoutine.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                      <label className="block text-xs text-slate-400 mb-1">Nome Esercizio</label>
                      <input
                        type="text"
                        required
                        placeholder="Es. Croci su panca inclinati"
                        value={newExForm.name}
                        onChange={(e) => setNewExForm({ ...newExForm, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Serie</label>
                      <input
                        type="number"
                        min="1"
                        value={newExForm.sets}
                        onChange={(e) => setNewExForm({ ...newExForm, sets: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Ripetizioni</label>
                      <input
                        type="text"
                        placeholder="10-12"
                        value={newExForm.reps}
                        onChange={(e) => setNewExForm({ ...newExForm, reps: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-3 grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Kg (0=BW)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          value={newExForm.weight}
                          onChange={(e) => setNewExForm({ ...newExForm, weight: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Rec (sec)</label>
                        <input
                          type="number"
                          min="10"
                          step="5"
                          value={newExForm.rest}
                          onChange={(e) => setNewExForm({ ...newExForm, rest: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Note Tecniche (opzionale)
                    </label>
                    <input
                      type="text"
                      placeholder="Es. Controlla la fase eccentrica per 3 secondi"
                      value={newExForm.notes}
                      onChange={(e) => setNewExForm({ ...newExForm, notes: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition"
                  >
                    + Inserisci in Scheda
                  </button>
                </form>
              </div>
            )}

            {/* -------------------------------------------------------------- */}
            {/* VISTA 3C: STORICO ALLENAMENTI                                  */}
            {/* -------------------------------------------------------------- */}
            {workoutMode === 'history' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h3 className="font-bold text-base text-white mb-4">
                  Sessioni Completate ({workoutHistory.length})
                </h3>
                {workoutHistory.length === 0 ? (
                  <p className="text-sm text-slate-400 py-8 text-center">
                    Non hai ancora registrato sessioni completate. Spunta le serie in "Allenamento
                    Live" e premi "Termina e Salva"!
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {workoutHistory.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-sm text-white">{item.routineTitle}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Data: {item.date} • Serie completate: {item.setsCompleted}/
                            {item.setsTotal}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold">
                          Completato
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* TIMER DI RECUPERO STICKY/FLOATING (Sempre comodo in allenamento)     */}
      {/* ==================================================================== */}
      {activeTab === 'workout' && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none">
          <div
            className={`max-w-3xl mx-auto pointer-events-auto rounded-2xl border backdrop-blur-xl shadow-2xl p-3 sm:px-5 sm:py-3.5 transition-all duration-300 ${
              timerFinishedFlash
                ? 'bg-emerald-950/95 border-emerald-400 ring-4 ring-emerald-500/30'
                : 'bg-slate-900/95 border-indigo-500/40'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Display Countdown */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    timerFinishedFlash
                      ? 'bg-emerald-500 text-slate-950 animate-bounce'
                      : timerRunning
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-indigo-300'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {timerFinishedFlash ? 'Recupero Terminato!' : 'Timer Recupero'}
                  </div>
                  <div
                    className={`text-2xl sm:text-3xl font-extrabold font-mono leading-none ${
                      timerFinishedFlash ? 'text-emerald-300' : 'text-white'
                    }`}
                  >
                    {formatTime(timerSeconds)}
                  </div>
                </div>
              </div>

              {/* Pulsanti Preset Rapidi */}
              <div className="flex items-center gap-1.5 order-3 sm:order-2 w-full sm:w-auto justify-between sm:justify-center">
                {[60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => startTimerWithDuration(sec)}
                    className={`flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${
                      timerInitial === sec && timerRunning
                        ? 'bg-indigo-600 border-indigo-400 text-white'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
                <button
                  onClick={() => adjustTimer(-15)}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300"
                >
                  -15s
                </button>
                <button
                  onClick={() => adjustTimer(15)}
                  className="px-2 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300"
                >
                  +15s
                </button>
              </div>

              {/* Controlli Play/Pausa, Reset e Audio */}
              <div className="flex items-center gap-2 order-2 sm:order-3">
                <button
                  onClick={() => {
                    setTimerFinishedFlash(false);
                    setTimerRunning(!timerRunning);
                  }}
                  className={`p-2.5 rounded-xl font-bold text-white transition ${
                    timerRunning
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                  title={timerRunning ? 'Pausa' : 'Avvia'}
                >
                  {timerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setTimerFinishedFlash(false);
                    setTimerSeconds(timerInitial);
                  }}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Resetta timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2.5 rounded-xl border transition ${
                    soundEnabled
                      ? 'bg-slate-950 border-slate-700 text-emerald-400'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                  title={soundEnabled ? 'Audio attivo' : 'Audio disattivato'}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE ASSEGNAZIONE PASTO / ALIMENTO ALLO SLOT GIORNALIERO           */}
      {/* ==================================================================== */}
      {assignModalSlot && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">
                Aggiungi a {MEAL_SLOTS.find((s) => s.id === assignModalSlot)?.label} (
                {DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.label})
              </h3>
              <button
                onClick={() => {
                  setAssignModalSlot(null);
                  setAssignSearch('');
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Cerca pasto composto o alimento..."
              value={assignSearch}
              onChange={(e) => setAssignSearch(e.target.value)}
              autoFocus
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />

            <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
              {/* Pasti Composti */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Pasti Composti
                </h4>
                <div className="space-y-1.5">
                  {meals
                    .filter((m) => m.name.toLowerCase().includes(assignSearch.toLowerCase()))
                    .map((meal) => {
                      const totals = getMealMacros(meal);
                      return (
                        <button
                          key={meal.id}
                          onClick={() => handleAssignToSlot(assignModalSlot, 'meal', meal.id)}
                          className="w-full text-left bg-slate-950 hover:bg-emerald-500/15 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3 transition flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-white">{meal.name}</p>
                            <p className="text-[11px] font-mono text-slate-400">
                              {Math.round(totals.kcal)} kcal • P:{Math.round(totals.protein)}g • C:
                              {Math.round(totals.carbs)}g • G:{Math.round(totals.fat)}g
                            </p>
                          </div>
                          <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Singoli Alimenti */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Singoli Alimenti
                </h4>
                <div className="space-y-1.5">
                  {foods
                    .filter((f) => f.name.toLowerCase().includes(assignSearch.toLowerCase()))
                    .map((food) => (
                      <button
                        key={food.id}
                        onClick={() => handleAssignToSlot(assignModalSlot, 'food', food.id)}
                        className="w-full text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl p-2.5 transition flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-200">
                            {food.name}{' '}
                            <span className="text-xs text-slate-500">({food.portion})</span>
                          </p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {food.kcal} kcal • P:{food.protein}g • C:{food.carbs}g • G:{food.fat}g
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}