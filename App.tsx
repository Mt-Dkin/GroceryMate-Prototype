import React, { useState } from 'react';
import logoSrc from './imports/logo.png';
import {
  Home, BarChart2, Scan, Clock, Bell, ChevronRight, CheckCircle2,
  ChefHat, TrendingDown, TrendingUp, Plus, Minus, X,
  Calendar, Star, ArrowLeft,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type TabId = 'home' | 'compare' | 'scan' | 'history' | 'recipes';
type StoreName = 'Aldi' | 'Coles' | 'Woolworths';
type CompareView = 'summary' | 'items' | 'split';
type ScanState = 'idle' | 'scanning' | 'result';
type HistoryFilter = 'all' | 'drops' | 'rises';

// ── Data ─────────────────────────────────────────────────────────────────────

const STORES: StoreName[] = ['Aldi', 'Coles', 'Woolworths'];

const STORE_DOT: Record<StoreName, string> = {
  Aldi: 'bg-blue-500',
  Coles: 'bg-red-500',
  Woolworths: 'bg-green-600',
};

const STORE_TAG: Record<StoreName, string> = {
  Aldi: 'bg-blue-50 text-blue-700',
  Coles: 'bg-red-50 text-red-700',
  Woolworths: 'bg-green-50 text-green-700',
};

interface GroceryItem {
  id: number; name: string; emoji: string; unit: string;
  prices: Record<StoreName, number>;
}

const ALL_ITEMS: GroceryItem[] = [
  { id: 1,  name: 'Milk',          emoji: '🥛', unit: '2L Full Cream',   prices: { Aldi: 2.49, Coles: 2.99, Woolworths: 3.00 } },
  { id: 2,  name: 'Eggs',          emoji: '🥚', unit: '12pk Free Range',  prices: { Aldi: 4.50, Coles: 5.50, Woolworths: 6.00 } },
  { id: 3,  name: 'Bread',         emoji: '🍞', unit: '700g White',       prices: { Aldi: 2.49, Coles: 2.80, Woolworths: 3.00 } },
  { id: 4,  name: 'Butter',        emoji: '🧈', unit: '250g Block',       prices: { Aldi: 3.49, Coles: 3.80, Woolworths: 4.00 } },
  { id: 5,  name: 'Chicken Breast',emoji: '🍗', unit: '1kg',              prices: { Aldi: 7.49, Coles: 8.00, Woolworths: 8.50 } },
  { id: 6,  name: 'Pasta',         emoji: '🍝', unit: '500g Penne',       prices: { Aldi: 1.49, Coles: 1.90, Woolworths: 2.00 } },
  { id: 7,  name: 'Tomato Sauce',  emoji: '🍅', unit: '700ml Passata',    prices: { Aldi: 2.29, Coles: 2.90, Woolworths: 3.10 } },
  { id: 8,  name: 'Cheese',        emoji: '🧀', unit: '500g Cheddar',     prices: { Aldi: 6.49, Coles: 7.00, Woolworths: 7.50 } },
  { id: 9,  name: 'Rice',          emoji: '🍚', unit: '2kg Jasmine',      prices: { Aldi: 4.49, Coles: 5.00, Woolworths: 5.50 } },
  { id: 10, name: 'Olive Oil',     emoji: '🫒', unit: '1L Extra Virgin',  prices: { Aldi: 8.49, Coles: 8.95, Woolworths: 9.20 } },
  { id: 11, name: 'Bananas',       emoji: '🍌', unit: '1kg',              prices: { Aldi: 2.29, Coles: 2.50, Woolworths: 2.90 } },
  { id: 12, name: 'Greek Yoghurt', emoji: '🥣', unit: '500g',             prices: { Aldi: 3.99, Coles: 4.50, Woolworths: 4.80 } },
];

interface Recipe {
  id: number; name: string; emoji: string; servings: number;
  time: string; costPerServe: number; totalCost: number;
  tags: string[]; ingredients: { itemId: number; qty: string }[];
}

const RECIPES: Recipe[] = [
  {
    id: 1, name: 'Spaghetti Bolognese', emoji: '🍝',
    servings: 4, time: '35 min', costPerServe: 4.44, totalCost: 17.76,
    tags: ['Budget Pick', 'Family'],
    ingredients: [
      { itemId: 6, qty: '500g' }, { itemId: 7, qty: '700ml' },
      { itemId: 5, qty: '500g' }, { itemId: 8, qty: '100g' },
    ],
  },
  {
    id: 2, name: 'Chicken Fried Rice', emoji: '🍳',
    servings: 3, time: '25 min', costPerServe: 5.49, totalCost: 16.47,
    tags: ["This week's deal", 'Quick'],
    ingredients: [
      { itemId: 9, qty: '2 cups' }, { itemId: 5, qty: '500g' },
      { itemId: 2, qty: '3 eggs' },
    ],
  },
  {
    id: 3, name: 'Cheesy Toast', emoji: '🫕',
    servings: 2, time: '10 min', costPerServe: 1.85, totalCost: 3.70,
    tags: ['Budget Pick', 'Quick', 'Vegetarian'],
    ingredients: [
      { itemId: 3, qty: '4 slices' }, { itemId: 8, qty: '80g' },
    ],
  },
  {
    id: 4, name: 'Banana Yoghurt Bowl', emoji: '🍌',
    servings: 2, time: '5 min', costPerServe: 1.64, totalCost: 3.28,
    tags: ['Breakfast', 'Healthy'],
    ingredients: [
      { itemId: 11, qty: '2 bananas' }, { itemId: 12, qty: '250g' },
    ],
  },
  {
    id: 5, name: 'Pasta Aglio e Olio', emoji: '🧄',
    servings: 2, time: '20 min', costPerServe: 4.98, totalCost: 9.96,
    tags: ['Vegetarian', 'Quick'],
    ingredients: [
      { itemId: 6, qty: '500g' }, { itemId: 10, qty: '50ml' },
    ],
  },
];

const NOTIFS_DATA = [
  { id: 1, icon: '📉', title: 'Chicken breast dropped!', body: 'Aldi now $7.49 — was $8.50', time: '2m ago', read: false },
  { id: 2, icon: '🏷️', title: 'Eggs on special at Coles', body: '$3.50 for 12pk · ends Sunday', time: '1h ago', read: false },
  { id: 3, icon: '✅', title: 'Smart list updated', body: 'Prices refreshed for 12 items', time: '3h ago', read: true },
  { id: 4, icon: '📦', title: 'Olive oil back in stock', body: 'Available at Aldi · $8.49', time: '5h ago', read: true },
];

const PRICE_CHANGES = [
  { id: 1, emoji: '🥛', item: 'Milk 2L',           store: 'Aldi',        current: 2.49, prev: 3.00, pct: -17 },
  { id: 2, emoji: '🥚', item: 'Eggs 12pk',          store: 'Coles',       current: 3.50, prev: 5.50, pct: -36 },
  { id: 3, emoji: '🧈', item: 'Butter 250g',        store: 'Aldi',        current: 3.49, prev: 3.20, pct:  +9 },
  { id: 4, emoji: '🍗', item: 'Chicken Breast 1kg', store: 'Aldi',        current: 7.49, prev: 8.50, pct: -12 },
  { id: 5, emoji: '🥣', item: 'Greek Yoghurt 500g', store: 'Woolworths',  current: 4.80, prev: 4.50, pct:  +7 },
];

const PAST_SHOPS = [
  { date: 'Thu 7 Sep',  total: 81.40, saved: 18.40, items: 12, stores: ['Aldi', 'Coles'] },
  { date: 'Mon 4 Sep',  total: 48.00, saved: 12.20, items: 8,  stores: ['Aldi'] },
  { date: 'Thu 31 Aug', total: 95.30, saved: 22.10, items: 15, stores: ['Aldi', 'Coles', 'Woolworths'] },
  { date: 'Mon 28 Aug', total: 62.50, saved:  9.80, items: 10, stores: ['Coles'] },
];

const SCAN_PRODUCTS = [
  {
    name: 'Olive Oil 1L', emoji: '🫒', barcode: '9300675038741',
    prices: [
      { store: 'Aldi',        price: 8.49, dist: '1.2 km', best: true },
      { store: 'Coles',       price: 8.95, dist: '0.8 km', best: false },
      { store: 'Woolworths',  price: 9.20, dist: '1.0 km', best: false },
    ],
  },
  {
    name: 'Greek Yoghurt 500g', emoji: '🥣', barcode: '9310055003916',
    prices: [
      { store: 'Aldi',        price: 3.99, dist: '1.2 km', best: true },
      { store: 'Coles',       price: 4.50, dist: '0.8 km', best: false },
      { store: 'Woolworths',  price: 4.80, dist: '1.0 km', best: false },
    ],
  },
  {
    name: 'Milk 2L Full Cream', emoji: '🥛', barcode: '9300633700091',
    prices: [
      { store: 'Aldi',        price: 2.49, dist: '1.2 km', best: true },
      { store: 'Coles',       price: 2.99, dist: '0.8 km', best: false },
      { store: 'Woolworths',  price: 3.00, dist: '1.0 km', best: false },
    ],
  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) { return `$${n.toFixed(2)}`; }

function cheapestStore(item: GroceryItem): StoreName {
  return STORES.reduce((a, b) => item.prices[a] <= item.prices[b] ? a : b);
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function GroceryMateApp() {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabId>('home');

  // Notifications overlay
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS_DATA);
  const unreadCount = notifs.filter(n => !n.read).length;

  // Basket
  const [basket, setBasket] = useState<Set<number>>(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));

  // Favourites
  const [favourites, setFavourites] = useState<Set<number>>(new Set([1, 2]));

  // Compare
  const [compareView, setCompareView] = useState<CompareView>('summary');

  // Scan
  const [scanState, setScanState] = useState<ScanState>('result');
  const [scanIdx, setScanIdx] = useState(0);
  const [scanAdded, setScanAdded] = useState(false);

  // History
  const [alertedItems, setAlertedItems] = useState<Set<number>>(new Set([1, 2, 5]));
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all');

  // Recipes / Meal plan
  const [mealPlan, setMealPlan] = useState<Record<string, number | null>>({
    Mon: 1, Tue: 2, Wed: null, Thu: 3, Fri: null, Sat: 4, Sun: null,
  });
  const [assignDay, setAssignDay] = useState<string | null>(null);
  const [recipeDetail, setRecipeDetail] = useState<number | null>(null);
  const [addedRecipes, setAddedRecipes] = useState<Set<number>>(new Set());

  // Budget
  const [budgetSpent, setBudgetSpent] = useState(142);
  const BUDGET = 200;

  // ── Computed ──────────────────────────────────────────────────────────────

  const basketItems = ALL_ITEMS.filter(i => basket.has(i.id));

  const storeTotals = STORES.reduce((acc, s) => {
    acc[s] = basketItems.reduce((sum, item) => sum + item.prices[s], 0);
    return acc;
  }, {} as Record<StoreName, number>);

  const cheapest = STORES.reduce((a, b) => storeTotals[a] < storeTotals[b] ? a : b);
  const splitTotal = basketItems.reduce((sum, item) => sum + Math.min(...STORES.map(s => item.prices[s])), 0);

  const splitByStore = STORES.reduce((acc, s) => {
    acc[s] = basketItems.filter(item => cheapestStore(item) === s);
    return acc;
  }, {} as Record<StoreName, GroceryItem[]>);

  const plannedMealCost = Object.values(mealPlan).reduce((sum, rid) => {
    if (!rid) return sum;
    return sum + (RECIPES.find(r => r.id === rid)?.totalCost ?? 0);
  }, 0);

  const plannedCount = Object.values(mealPlan).filter(Boolean).length;

  // ── Handlers ─────────────────────────────────────────────────────────────

  function toggleBasket(id: number) {
    setBasket(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleFavourite(id: number) {
    setFavourites(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleAlert(id: number) {
    setAlertedItems(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }
  function startScan() {
    setScanState('scanning');
    setScanAdded(false);
    setScanIdx(prev => (prev + 1) % SCAN_PRODUCTS.length);
    setTimeout(() => setScanState('result'), 2000);
  }
  function addRecipeToBasket(recipeId: number) {
    const recipe = RECIPES.find(r => r.id === recipeId)!;
    recipe.ingredients.forEach(ing => {
      setBasket(prev => new Set([...prev, ing.itemId]));
    });
    setAddedRecipes(prev => new Set([...prev, recipeId]));
  }
  function addAllPlannedToBasket() {
    Object.values(mealPlan).forEach(rid => { if (rid) addRecipeToBasket(rid); });
  }
  function assignMeal(day: string, recipeId: number) {
    setMealPlan(prev => ({ ...prev, [day]: recipeId }));
    setAssignDay(null);
  }
  function clearMeal(day: string) {
    setMealPlan(prev => ({ ...prev, [day]: null }));
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-[430px] bg-[#F8FAFC] flex flex-col min-h-screen relative overflow-hidden">

        {/* ── Header ── */}
        <header
          className="bg-[#10B981] px-4 pb-3 flex justify-between items-center shadow-md shrink-0"
          style={{ paddingTop: 'max(59px, env(safe-area-inset-top))' }}
        >
          <div className="bg-white rounded-2xl px-3 py-1 shadow-sm">
            <img src={logoSrc} alt="GroceryMate" className="h-9 w-auto object-contain" />
          </div>
          <button
            onClick={() => setShowNotifs(true)}
            className="bg-emerald-600/50 p-2.5 rounded-full text-white relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        {/* ── Scrollable content ── */}
        <main className="flex-1 overflow-y-auto pb-20">

          {/* ────────────────── HOME ────────────────── */}
          {activeTab === 'home' && (
            <div className="p-4 space-y-4">
              {/* Savings Banner */}
              <div className="bg-[#10B981] text-white p-5 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute right-4 top-4 bg-emerald-600 p-2 rounded-xl">
                  <CheckCircle2 size={22} />
                </div>
                <p className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">Last Shop · Thu 7 Sep</p>
                <h2 className="text-4xl font-extrabold mt-1">$18.40</h2>
                <p className="text-xs text-emerald-100 mt-0.5">saved vs. buying at highest prices</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <span className="bg-emerald-700/60 text-xs px-2.5 py-1 rounded-lg">★ 6 items compared</span>
                  <span className="bg-emerald-700/60 text-xs px-2.5 py-1 rounded-lg">3 stores checked</span>
                </div>
              </div>

              {/* Weekly Budget */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                <div className="flex justify-between text-sm font-semibold text-slate-700">
                  <span>Weekly budget</span>
                  <span className="text-indigo-600">{fmt(budgetSpent)} / {fmt(BUDGET)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (budgetSpent / BUDGET) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">{fmt(BUDGET - budgetSpent)} remaining · resets Monday</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setBudgetSpent(p => Math.max(0, p - 10))}
                      className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-600"
                    >
                      <Minus size={13} />
                    </button>
                    <button
                      onClick={() => setBudgetSpent(p => Math.min(BUDGET, p + 10))}
                      className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Favourites */}
              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-bold text-slate-800">Favourites</h3>
                  <button onClick={() => setActiveTab('compare')} className="text-xs text-[#10B981] font-semibold">
                    See all →
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 px-1 -mt-1">Cheapest today · Updated 8:14 am</p>

                {ALL_ITEMS.filter(i => favourites.has(i.id)).map(item => {
                  const cs = cheapestStore(item);
                  const maxP = Math.max(...STORES.map(s => item.prices[s]));
                  const saved = +(maxP - item.prices[cs]).toFixed(2);
                  return (
                    <div key={item.id} className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-xl">{item.emoji}</div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                          <p className="text-xs text-slate-400">{item.unit}</p>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${STORE_TAG[cs]}`}>
                            {cs} · Save {fmt(saved)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-extrabold text-[#10B981]">{fmt(item.prices[cs])}</span>
                        <p className="text-[10px] text-slate-400">{item.unit}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Add-to-favourites suggestions */}
                {ALL_ITEMS.filter(i => !favourites.has(i.id)).slice(0, 2).map(item => {
                  const cs = cheapestStore(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleFavourite(item.id)}
                      className="w-full bg-white p-3.5 rounded-2xl shadow-sm border border-dashed border-slate-200 flex items-center justify-between active:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-xl opacity-60">{item.emoji}</div>
                        <div className="text-left">
                          <p className="font-medium text-sm text-slate-600">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.unit} · {fmt(item.prices[cs])} at {cs}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[#10B981]">
                        <Star size={14} />
                        <span className="text-xs font-semibold">Track</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Meal Planner quick-link */}
              <button
                onClick={() => setActiveTab('recipes')}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                    <ChefHat size={22} className="text-amber-500" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-slate-800">Meal Planner</h4>
                    <p className="text-xs text-slate-400">{plannedCount} meals planned · est. {fmt(plannedMealCost)}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            </div>
          )}

          {/* ────────────────── COMPARE ────────────────── */}
          {activeTab === 'compare' && (
            <div className="p-4 space-y-4">
              {/* Sub-nav */}
              <div className="flex gap-2">
                {(['summary', 'items', 'split'] as CompareView[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setCompareView(v)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-colors ${
                      compareView === v ? 'bg-[#10B981] text-white' : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {v === 'summary' ? 'Summary' : v === 'items' ? 'Basket' : 'Split List'}
                  </button>
                ))}
              </div>

              {/* SUMMARY */}
              {compareView === 'summary' && (
                <div className="space-y-3">
                  <div className="px-1">
                    <h2 className="font-bold text-xl text-slate-800">Basket Comparison</h2>
                    <p className="text-xs text-slate-400">{basket.size} items · best possible {fmt(splitTotal)}</p>
                  </div>

                  {/* Cheapest store */}
                  <div className="bg-white p-4 rounded-2xl shadow-md border-2 border-[#10B981] space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${STORE_DOT[cheapest]}`} />
                        <h3 className="font-extrabold text-slate-800 text-lg">{cheapest}</h3>
                        <span className="bg-emerald-100 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded">Cheapest</span>
                      </div>
                      <span className="text-xl font-extrabold text-slate-900">{fmt(storeTotals[cheapest])}</span>
                    </div>
                    <p className="text-xs text-slate-500">Best single-store price · Full basket</p>
                    <div className="flex gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600 flex-wrap">
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        {basketItems.filter(i => cheapestStore(i) === cheapest).length} items cheapest here
                      </span>
                      <span className="bg-slate-100 px-2 py-1 rounded">All {basket.size} in stock</span>
                    </div>
                  </div>

                  {/* Other stores */}
                  {STORES.filter(s => s !== cheapest).sort((a, b) => storeTotals[a] - storeTotals[b]).map(s => (
                    <div key={s} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${STORE_DOT[s]}`} />
                          <h3 className="font-bold text-slate-800">{s}</h3>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">+{fmt(storeTotals[s] - storeTotals[cheapest])} vs {cheapest}</p>
                      </div>
                      <span className="text-lg font-bold text-slate-800">{fmt(storeTotals[s])}</span>
                    </div>
                  ))}

                  {/* Smart Split */}
                  <div className="bg-[#2563EB] text-white p-5 rounded-2xl shadow-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-blue-700 text-xs px-2 py-0.5 rounded font-medium">★ Best multi-store split</span>
                        <h3 className="text-2xl font-extrabold mt-2">{fmt(splitTotal)} <span className="text-xs font-normal text-blue-200">total</span></h3>
                      </div>
                      <div className="bg-blue-700/80 px-3 py-1.5 rounded-xl text-right shrink-0">
                        <p className="text-[10px] text-blue-300">SAVES</p>
                        <p className="text-sm font-bold">{fmt(storeTotals[cheapest] - splitTotal)} more</p>
                      </div>
                    </div>
                    <p className="text-xs text-blue-200">
                      {STORES.filter(s => splitByStore[s].length > 0).map(s => `${s} (${splitByStore[s].length} items)`).join(' + ')}
                    </p>
                    <div className="flex gap-1.5 flex-wrap text-xs">
                      {basketItems.slice(0, 3).map(i => (
                        <span key={i.id} className="bg-blue-700/50 px-2 py-0.5 rounded">{i.emoji} {i.name}</span>
                      ))}
                      {basket.size > 3 && <span className="bg-blue-700/50 px-2 py-0.5 rounded">+{basket.size - 3} more</span>}
                    </div>
                    <button
                      onClick={() => setCompareView('split')}
                      className="w-full bg-white text-[#2563EB] font-bold py-2.5 rounded-xl text-sm shadow"
                    >
                      View split shopping list →
                    </button>
                  </div>
                </div>
              )}

              {/* BASKET ITEMS */}
              {compareView === 'items' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <div>
                      <h2 className="font-bold text-lg text-slate-800">Basket Items</h2>
                      <p className="text-xs text-slate-400">{basket.size} of {ALL_ITEMS.length} selected</p>
                    </div>
                  </div>
                  {ALL_ITEMS.map(item => {
                    const inBasket = basket.has(item.id);
                    const cs = cheapestStore(item);
                    return (
                      <div
                        key={item.id}
                        className={`bg-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between border transition-opacity ${
                          inBasket ? 'border-slate-100' : 'border-dashed border-slate-200 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl shrink-0">{item.emoji}</div>
                          <div>
                            <p className="font-semibold text-sm text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.unit}</p>
                            {inBasket && (
                              <div className="flex gap-2 mt-0.5">
                                {STORES.map(s => (
                                  <span key={s} className={`text-[10px] font-medium ${s === cs ? 'text-[#10B981]' : 'text-slate-400'}`}>
                                    {s.slice(0, 2)} {fmt(item.prices[s])}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleBasket(item.id)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            inBasket ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-[#10B981]'
                          }`}
                        >
                          {inBasket ? <Minus size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SPLIT LIST */}
              {compareView === 'split' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <button onClick={() => setCompareView('summary')} className="text-slate-400">
                      <ArrowLeft size={18} />
                    </button>
                    <div>
                      <h2 className="font-bold text-lg text-slate-800">Split Shopping List</h2>
                      <p className="text-xs text-slate-400">Total: {fmt(splitTotal)} · saves {fmt(storeTotals[cheapest] - splitTotal)} vs {cheapest} only</p>
                    </div>
                  </div>
                  {STORES.filter(s => splitByStore[s].length > 0).map(store => (
                    <div key={store} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className={`px-4 py-3 flex items-center justify-between ${
                        store === 'Aldi' ? 'bg-blue-50' : store === 'Coles' ? 'bg-red-50' : 'bg-green-50'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${STORE_DOT[store]}`} />
                          <h3 className="font-bold text-slate-800">{store}</h3>
                          <span className="text-xs text-slate-500">{splitByStore[store].length} items</span>
                        </div>
                        <span className="font-bold text-slate-800">
                          {fmt(splitByStore[store].reduce((s, i) => s + i.prices[store], 0))}
                        </span>
                      </div>
                      {splitByStore[store].map((item, idx) => (
                        <div
                          key={item.id}
                          className={`px-4 py-3 flex items-center justify-between ${idx > 0 ? 'border-t border-slate-50' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{item.emoji}</span>
                            <div>
                              <p className="text-sm font-medium text-slate-700">{item.name}</p>
                              <p className="text-xs text-slate-400">{item.unit}</p>
                            </div>
                          </div>
                          <span className="font-bold text-[#10B981] text-sm">{fmt(item.prices[store])}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ────────────────── SCAN ────────────────── */}
          {activeTab === 'scan' && (
            <div className="bg-[#0F172A] min-h-full text-white flex flex-col p-4 space-y-4">
              <div>
                <h2 className="font-bold text-xl">Scan a Product</h2>
                <p className="text-xs text-slate-400">
                  {scanState === 'idle' ? 'Point at a barcode or tap to demo' :
                   scanState === 'scanning' ? 'Detecting barcode...' :
                   `Barcode: ${SCAN_PRODUCTS[scanIdx].barcode}`}
                </p>
              </div>

              {/* Viewfinder */}
              <div
                className="relative h-52 border-2 border-dashed border-emerald-500/60 rounded-3xl flex flex-col items-center justify-center bg-slate-900/50 cursor-pointer"
                onClick={scanState === 'idle' ? startScan : undefined}
              >
                {scanState === 'scanning' && (
                  <div className="absolute inset-4 border border-emerald-400/20 rounded-2xl overflow-hidden flex items-center justify-center">
                    <div className="w-full h-0.5 bg-emerald-400/70 animate-bounce" />
                  </div>
                )}
                {scanState === 'idle' && (
                  <>
                    <Scan size={40} className="text-emerald-500/40 mb-2" />
                    <p className="text-xs text-slate-400">Tap to scan</p>
                  </>
                )}
                {scanState === 'scanning' && (
                  <p className="text-emerald-400 text-sm font-semibold animate-pulse z-10">Scanning...</p>
                )}
                {scanState === 'result' && (
                  <div className="flex flex-col items-center">
                    <span className="text-5xl mb-2">{SCAN_PRODUCTS[scanIdx].emoji}</span>
                    <span className="text-emerald-400 text-xs font-bold">✓ Product matched</span>
                  </div>
                )}
              </div>

              {/* Result card */}
              {scanState === 'result' && (() => {
                const prod = SCAN_PRODUCTS[scanIdx];
                return (
                  <div className="bg-slate-800 p-4 rounded-2xl space-y-3 border border-slate-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-200">{prod.name}</h3>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold">Matched</span>
                    </div>
                    <div className="space-y-2">
                      {prod.prices.map(p => (
                        <div
                          key={p.store}
                          className={`flex justify-between items-center p-2.5 rounded-xl border ${
                            p.best ? 'bg-emerald-900/30 border-emerald-700/40' : 'bg-slate-900/60 border-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{p.store}</span>
                            <span className="text-xs text-slate-400">{p.dist}</span>
                            {p.best && <span className="text-[9px] text-emerald-400 font-bold bg-emerald-900/40 px-1.5 py-0.5 rounded">BEST</span>}
                          </div>
                          <span className={`font-extrabold text-base ${p.best ? 'text-[#10B981]' : 'text-slate-200'}`}>
                            {fmt(p.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setScanAdded(true)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
                          scanAdded ? 'bg-emerald-800 text-emerald-300' : 'bg-[#10B981] text-white'
                        }`}
                      >
                        {scanAdded ? '✓ Added to basket' : 'Add to basket'}
                      </button>
                      <button
                        onClick={startScan}
                        className="flex-1 bg-slate-700 text-white py-3 rounded-xl text-sm font-bold"
                      >
                        Scan next
                      </button>
                    </div>
                  </div>
                );
              })()}

              {scanState === 'idle' && (
                <button
                  onClick={startScan}
                  className="w-full bg-[#10B981] text-white py-4 rounded-2xl font-bold text-sm"
                >
                  Start Scanning
                </button>
              )}
            </div>
          )}

          {/* ────────────────── HISTORY ────────────────── */}
          {activeTab === 'history' && (
            <div className="p-4 space-y-4">
              <div className="px-1">
                <h2 className="font-bold text-xl text-slate-800">Price History</h2>
                <p className="text-xs text-slate-400">Alerts · trends · past shops</p>
              </div>

              {/* Price Alerts */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-800">Price Alerts</h3>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{alertedItems.size} tracking</span>
                </div>
                {ALL_ITEMS.slice(0, 7).map((item, idx) => {
                  const on = alertedItems.has(item.id);
                  return (
                    <div key={item.id} className={`px-4 py-3 flex items-center justify-between ${idx > 0 ? 'border-t border-slate-50' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.unit}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAlert(item.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-[#10B981]' : 'bg-slate-200'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Recent Changes */}
              <div>
                <div className="flex items-center gap-2 px-1 mb-3">
                  <h3 className="font-bold text-sm text-slate-800 flex-1">Recent Changes</h3>
                  {(['all', 'drops', 'rises'] as HistoryFilter[]).map(f => (
                    <button
                      key={f}
                      onClick={() => setHistoryFilter(f)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg capitalize ${
                        historyFilter === f ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {PRICE_CHANGES
                    .filter(c => historyFilter === 'all' || (historyFilter === 'drops' ? c.pct < 0 : c.pct > 0))
                    .map(c => (
                      <div key={c.id} className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                            c.pct < 0 ? 'bg-emerald-50' : 'bg-red-50'
                          }`}>
                            {c.emoji}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-800">{c.item}</p>
                            <p className="text-xs text-slate-400">{c.store} · was {fmt(c.prev)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm text-slate-900">{fmt(c.current)}</p>
                          <div className={`flex items-center gap-0.5 justify-end text-xs font-bold ${
                            c.pct < 0 ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                            {c.pct < 0 ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                            {c.pct > 0 ? '+' : ''}{c.pct}%
                          </div>
                        </div>
                      </div>
                    ))}
                  {PRICE_CHANGES.filter(c =>
                    historyFilter === 'all' || (historyFilter === 'drops' ? c.pct < 0 : c.pct > 0)
                  ).length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-6">No price {historyFilter} recently</p>
                  )}
                </div>
              </div>

              {/* Past Shops */}
              <div>
                <h3 className="font-bold text-sm text-slate-800 px-1 mb-3">Shopping History</h3>
                <div className="space-y-2">
                  {PAST_SHOPS.map((shop, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-slate-800">{shop.date}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{shop.stores.join(' + ')} · {shop.items} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-extrabold text-slate-900">{fmt(shop.total)}</p>
                          <p className="text-xs text-emerald-600 font-semibold">saved {fmt(shop.saved)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────── RECIPES ────────────────── */}
          {activeTab === 'recipes' && (
            <div className="p-4 space-y-4">
              {/* Recipe Detail */}
              {recipeDetail !== null ? (() => {
                const recipe = RECIPES.find(r => r.id === recipeDetail)!;
                const added = addedRecipes.has(recipe.id);
                return (
                  <div className="space-y-4">
                    <button
                      onClick={() => setRecipeDetail(null)}
                      className="flex items-center gap-1 text-[#10B981] font-semibold text-sm"
                    >
                      <ArrowLeft size={16} /> Back to recipes
                    </button>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 flex flex-col items-center">
                        <span className="text-7xl">{recipe.emoji}</span>
                        <h2 className="font-extrabold text-xl text-slate-800 mt-3 text-center">{recipe.name}</h2>
                        <div className="flex gap-4 mt-2 text-xs text-slate-500">
                          <span>⏱ {recipe.time}</span>
                          <span>👥 {recipe.servings} servings</span>
                          <span className="text-[#10B981] font-bold">{fmt(recipe.costPerServe)}/serve</span>
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap justify-center">
                          {recipe.tags.map(t => (
                            <span key={t} className="bg-amber-200 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">{t}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-sm text-slate-700">Ingredients</h3>
                          <span className="text-xs font-semibold text-slate-500">Est. total: {fmt(recipe.totalCost)}</span>
                        </div>
                        {recipe.ingredients.map(ing => {
                          const item = ALL_ITEMS.find(i => i.id === ing.itemId)!;
                          const cs = cheapestStore(item);
                          return (
                            <div key={ing.itemId} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{item.emoji}</span>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{item.name}</p>
                                  <p className="text-xs text-slate-400">{ing.qty} · best at {cs}</p>
                                </div>
                              </div>
                              <span className="font-bold text-[#10B981] text-sm">{fmt(item.prices[cs])}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => addRecipeToBasket(recipe.id)}
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-colors ${
                        added
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-[#10B981] text-white shadow-lg shadow-emerald-100'
                      }`}
                    >
                      {added ? '✓ Ingredients in your basket' : 'Add all ingredients to basket'}
                    </button>
                  </div>
                );
              })() : (
                /* Recipes Main View */
                <div className="space-y-4">
                  <div className="px-1">
                    <h2 className="font-bold text-xl text-slate-800">Meal Planner</h2>
                    <p className="text-xs text-slate-400">Plan meals · track costs · shop smarter</p>
                  </div>

                  {/* Weekly Grid */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-800">This Week</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar size={12} />
                        <span>Sep 4–10</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-px bg-slate-100">
                      {DAYS.map(day => {
                        const rid = mealPlan[day];
                        const recipe = rid ? RECIPES.find(r => r.id === rid) : null;
                        return (
                          <div key={day} className="bg-white flex flex-col">
                            <div className="py-1.5 text-center text-[10px] font-bold text-slate-400 border-b border-slate-100">
                              {day}
                            </div>
                            <button
                              onClick={() => recipe ? clearMeal(day) : setAssignDay(day)}
                              className="flex-1 p-1.5 flex flex-col items-center justify-center min-h-[68px] active:bg-slate-50"
                            >
                              {recipe ? (
                                <>
                                  <span className="text-2xl">{recipe.emoji}</span>
                                  <p className="text-[8px] text-slate-500 font-medium mt-0.5 text-center leading-tight px-0.5 line-clamp-2">
                                    {recipe.name}
                                  </p>
                                </>
                              ) : (
                                <Plus size={16} className="text-slate-300" />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{plannedCount} of 7 meals planned</p>
                        <p className="text-xs text-slate-400">Est. {fmt(plannedMealCost)} this week</p>
                      </div>
                      <button
                        onClick={addAllPlannedToBasket}
                        className="bg-[#10B981] text-white text-xs font-bold px-3 py-2 rounded-xl"
                      >
                        Add all to basket
                      </button>
                    </div>
                  </div>

                  {/* Budget-smart callout */}
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="font-bold text-sm text-amber-900">Budget tip this week</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Chicken Breast is on sale at Aldi ($7.49). Chicken Fried Rice saves ~$3 vs buying at Woolworths.
                      </p>
                    </div>
                  </div>

                  {/* Recipe Library */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 px-1 mb-3">Recipe Library</h3>
                    <div className="space-y-3">
                      {RECIPES.map(recipe => {
                        const added = addedRecipes.has(recipe.id);
                        return (
                          <div key={recipe.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <button
                              className="w-full p-4 flex items-center gap-3 text-left active:bg-slate-50"
                              onClick={() => setRecipeDetail(recipe.id)}
                            >
                              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                                {recipe.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-800">{recipe.name}</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {recipe.tags.map(t => (
                                    <span key={t} className="text-[9px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
                                      {t}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex gap-3 mt-1 text-xs text-slate-400">
                                  <span>⏱ {recipe.time}</span>
                                  <span>👥 {recipe.servings}</span>
                                  <span className="text-[#10B981] font-semibold">{fmt(recipe.costPerServe)}/serve</span>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-slate-300 shrink-0" />
                            </button>
                            <div className="px-4 pb-3 flex gap-2 border-t border-slate-50">
                              <button
                                onClick={() => {
                                  const emptyDay = DAYS.find(d => !mealPlan[d]);
                                  if (emptyDay) setMealPlan(p => ({ ...p, [emptyDay]: recipe.id }));
                                }}
                                className="flex-1 bg-slate-50 text-slate-600 text-xs font-semibold py-2.5 rounded-xl border border-slate-100"
                              >
                                + Add to plan
                              </button>
                              <button
                                onClick={() => addRecipeToBasket(recipe.id)}
                                className={`flex-1 text-xs font-semibold py-2.5 rounded-xl transition-colors ${
                                  added ? 'bg-emerald-50 text-emerald-600' : 'bg-[#10B981] text-white'
                                }`}
                              >
                                {added ? '✓ In basket' : 'Add to basket'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>

        {/* ── Bottom Nav ── */}
        <nav
          className="sticky bottom-0 bg-white border-t border-slate-100 pt-2 px-1 flex justify-around items-center z-20 shrink-0"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {([
            { id: 'home',     label: 'Home',     Icon: Home },
            { id: 'compare',  label: 'Compare',  Icon: BarChart2 },
            { id: 'scan',     label: 'Scan',     Icon: Scan },
            { id: 'history',  label: 'History',  Icon: Clock },
            { id: 'recipes',  label: 'Recipes',  Icon: ChefHat },
          ] as { id: TabId; label: string; Icon: React.ElementType }[]).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setRecipeDetail(null); setCompareView('summary'); }}
              className={`flex flex-col items-center py-1 px-2 space-y-0.5 rounded-xl transition-colors min-w-0 ${
                activeTab === id ? 'text-[#10B981]' : 'text-slate-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* ── Notifications overlay ── */}
        {showNotifs && (
          <div className="absolute inset-0 z-30 flex flex-col">
            <div className="flex-1 bg-black/50" onClick={() => setShowNotifs(false)} />
            <div className="bg-white rounded-t-3xl shadow-2xl flex flex-col" style={{ maxHeight: '65%' }}>
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-bold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && <p className="text-xs text-slate-400">{unreadCount} unread</p>}
                </div>
                <div className="flex items-center gap-3">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-[#10B981] font-semibold">Mark all read</button>
                  )}
                  <button onClick={() => setShowNotifs(false)}>
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto p-3 space-y-2 flex-1">
                {notifs.map(n => (
                  <button
                    key={n.id}
                    onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${
                      n.read ? 'bg-slate-50' : 'bg-emerald-50 border border-emerald-100'
                    }`}
                  >
                    <span className="text-xl mt-0.5 shrink-0">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-slate-800">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{n.body}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Assign meal modal ── */}
        {assignDay && (
          <div className="absolute inset-0 z-30 flex flex-col justify-end">
            <div className="flex-1 bg-black/50" onClick={() => setAssignDay(null)} />
            <div className="bg-white rounded-t-3xl flex flex-col" style={{ maxHeight: '60%' }}>
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-slate-800">Choose meal for {assignDay}</h3>
                <button onClick={() => setAssignDay(null)}><X size={18} className="text-slate-400" /></button>
              </div>
              <div className="overflow-y-auto p-3 space-y-2 flex-1">
                {RECIPES.map(recipe => (
                  <button
                    key={recipe.id}
                    onClick={() => assignMeal(assignDay, recipe.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 active:bg-slate-100 text-left"
                  >
                    <span className="text-2xl">{recipe.emoji}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-800">{recipe.name}</p>
                      <p className="text-xs text-slate-400">{recipe.time} · {recipe.servings} serves · {fmt(recipe.costPerServe)}/serve</p>
                    </div>
                    <Plus size={16} className="text-[#10B981]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
