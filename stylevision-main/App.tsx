import React, { useMemo, useState } from 'react';

type Season = 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'ANY';
type Occasion = 'CASUAL' | 'BUSINESS' | 'EVENT' | 'SPORT';
type StyleGoal = 'CONFIDENT' | 'ROMANTIC' | 'MINIMAL' | 'BOLD';

interface EngineInput {
  name: string;
  city: string;
  season: Season;
  occasion: Occasion;
  styleGoal: StyleGoal;
  palette: string[];
  budget: 'LOW' | 'MID' | 'HIGH';
  notes: string;
  image?: string;
}

interface EngineResult {
  title: string;
  description: string;
  keyPieces: string[];
  palette: string[];
  shoppingTips: string[];
}

const paletteBySeason: Record<Season, string[]> = {
  SPRING: ['Лайм', 'Молочный', 'Мята', 'Тёплый беж'],
  SUMMER: ['Небесный', 'Пудровый', 'Серебро', 'Деним'],
  AUTUMN: ['Терракота', 'Шоколад', 'Оливковый', 'Карамель'],
  WINTER: ['Чернильный', 'Белый', 'Фуксия', 'Графит'],
  ANY: ['Нейтральный', 'Акцентный', 'Глубокий', 'Светлый'],
};

const goalTone: Record<StyleGoal, string> = {
  CONFIDENT: 'собранный и уверенный образ',
  ROMANTIC: 'мягкая женственность и лёгкие фактуры',
  MINIMAL: 'чистые линии и точные пропорции',
  BOLD: 'смелые акценты и выразительные силуэты',
};

const occasionFocus: Record<Occasion, string> = {
  CASUAL: 'комфортные образы на каждый день',
  BUSINESS: 'структурные комплекты с деловой эстетикой',
  EVENT: 'вечерние акценты и выразительные детали',
  SPORT: 'динамичные силуэты и технологичные ткани',
};

const budgetTip: Record<EngineInput['budget'], string> = {
  LOW: 'Сфокусируйтесь на базовых изделиях и аксессуарах-трансформерах.',
  MID: 'Сбалансируйте базу и акценты, инвестируйте в верхнюю одежду.',
  HIGH: 'Добавьте премиальные ткани и уникальные детали в капсулу.',
};

const buildRecommendations = (input: EngineInput): EngineResult[] => {
  const basePalette = paletteBySeason[input.season];
  const mixPalette = [...basePalette, ...input.palette].filter(Boolean).slice(0, 5);
  const corePieces = {
    CASUAL: ['Свободный жакет', 'Джинсы прямого кроя', 'Кроссовки-лоферы'],
    BUSINESS: ['Костюмный жилет', 'Юбка-миди', 'Структурные туфли'],
    EVENT: ['Платье-комбинация', 'Акцентные серьги', 'Минималистичные каблуки'],
    SPORT: ['Топ-бра', 'Леггинсы', 'Ветровка с поясом'],
  };

  const accentPieces = {
    CONFIDENT: ['Графичный ремень', 'Очки с плотной оправой'],
    ROMANTIC: ['Шёлковый платок', 'Пастельный кардиган'],
    MINIMAL: ['Лаконичный тренч', 'Монохромный клатч'],
    BOLD: ['Яркий жакет', 'Контрастные ботильоны'],
  };

  return [
    {
      title: `Капсула для ${input.name || 'вашего'} дня`,
      description: `Мы собрали ${occasionFocus[input.occasion]} с фокусом на ${goalTone[input.styleGoal]}.`,
      keyPieces: [...corePieces[input.occasion], ...accentPieces[input.styleGoal]],
      palette: mixPalette,
      shoppingTips: [
        `Город: ${input.city || 'подберите климатические слои'}.`,
        budgetTip[input.budget],
        'Добавьте 1 эффектный аксессуар, чтобы оживить капсулу.',
      ],
    },
    {
      title: 'Силуэты и фактуры',
      description: 'Комбинируйте матовые ткани с мягким блеском, чтобы подчеркнуть глубину цвета.',
      keyPieces: ['Фактурный трикотаж', 'Матовый сатин', 'Гладкая кожа'],
      palette: mixPalette.slice().reverse(),
      shoppingTips: [
        'Сохраняйте 2 нейтральных оттенка и 1 яркий акцент.',
        'Контраст фактур визуально стройнит и делает образ дороже.',
      ],
    },
  ];
};

const App: React.FC = () => {
  const [form, setForm] = useState<EngineInput>({
    name: '',
    city: '',
    season: 'ANY',
    occasion: 'CASUAL',
    styleGoal: 'CONFIDENT',
    palette: [],
    budget: 'MID',
    notes: '',
    image: undefined,
  });
  const [submitted, setSubmitted] = useState(false);

  const recommendations = useMemo(() => buildRecommendations(form), [form]);

  const updateField = <K extends keyof EngineInput>(key: K, value: EngineInput[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const togglePalette = (value: string) => {
    setForm(prev => ({
      ...prev,
      palette: prev.palette.includes(value)
        ? prev.palette.filter(item => item !== value)
        : [...prev.palette, value],
    }));
  };

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField('image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 font-sans">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -top-40 right-0 h-[420px] w-[520px] bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_60%)]"></div>
          <div className="absolute bottom-0 left-0 h-[360px] w-[520px] bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.2),_transparent_60%)]"></div>
        </div>

        <header className="relative z-10 border-b border-neutral-800 backdrop-blur bg-black/70">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-neutral-700 flex items-center justify-center bg-neutral-900">
                <span className="font-serif text-xl text-amber-500">S</span>
              </div>
              <div className="text-white font-serif tracking-widest">
                STYLE<span className="font-sans font-light text-neutral-500 text-xs ml-1">VISION</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-xs text-neutral-500">
              <span className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60">Персональный ИИ стилист</span>
              <span className="px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60">Новый двигатель рекомендаций</span>
            </div>
          </div>
        </header>

        <main className="relative z-10 max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12">
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-amber-300">
              AI Stylist Studio
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                Новый стиль — как персональный бренд, только быстрее.
              </h1>
              <p className="text-neutral-400 text-sm md:text-lg">
                Мы построили отдельный сайт с собственным движком рекомендаций. Он подбирает образы, палитры и ключевые вещи по вашим целям — прямо здесь.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Собственный движок', text: 'Рекомендации на основе ваших данных, без внешних API.' },
                { title: 'Живой стиль', text: 'Капсулы, палитры и ключевые вещи под задачу.' },
                { title: 'Быстрое обновление', text: 'Обновляйте ввод и получайте новый результат мгновенно.' },
              ].map(card => (
                <div key={card.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
                  <h3 className="text-white text-sm font-semibold mb-2">{card.title}</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400"></span>Локальный расчёт образов</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-400"></span>Персонализация под сезон</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span>Капсулы в одном клике</span>
            </div>
          </section>

          <section className="rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-amber-400">Ваш профиль</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <input
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Имя"
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600"
                  />
                  <input
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="Город"
                    className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-amber-400">Сценарий</label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {([
                    { value: 'CASUAL', label: 'Повседневный' },
                    { value: 'BUSINESS', label: 'Деловой' },
                    { value: 'EVENT', label: 'Вечер' },
                    { value: 'SPORT', label: 'Спорт' },
                  ] as const).map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('occasion', option.value)}
                      className={`px-3 py-2 rounded-xl text-xs border transition ${
                        form.occasion === option.value
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs uppercase tracking-widest text-amber-400">Сезон</label>
                  <select
                    value={form.season}
                    onChange={(e) => updateField('season', e.target.value as Season)}
                    className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                  >
                    <option value="ANY">Любой</option>
                    <option value="SPRING">Весна</option>
                    <option value="SUMMER">Лето</option>
                    <option value="AUTUMN">Осень</option>
                    <option value="WINTER">Зима</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-amber-400">Цель</label>
                  <select
                    value={form.styleGoal}
                    onChange={(e) => updateField('styleGoal', e.target.value as StyleGoal)}
                    className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                  >
                    <option value="CONFIDENT">Уверенность</option>
                    <option value="ROMANTIC">Романтика</option>
                    <option value="MINIMAL">Минимализм</option>
                    <option value="BOLD">Смелость</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-amber-400">Бюджет</label>
                  <select
                    value={form.budget}
                    onChange={(e) => updateField('budget', e.target.value as EngineInput['budget'])}
                    className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-white"
                  >
                    <option value="LOW">Базовый</option>
                    <option value="MID">Средний</option>
                    <option value="HIGH">Премиум</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-amber-400">Палитра</label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Монохром', 'Нюд', 'Тёплый', 'Холодный', 'Яркий акцент'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => togglePalette(color)}
                      className={`px-3 py-2 rounded-full text-xs border transition ${
                        form.palette.includes(color)
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-neutral-800 text-neutral-500 hover:border-neutral-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-amber-400">Фото (опционально)</label>
                <div className="mt-3 border border-neutral-800 rounded-2xl p-4 bg-neutral-900/40">
                  <input type="file" accept="image/*" onChange={handleImage} />
                  {form.image && (
                    <img src={form.image} alt="Preview" className="mt-3 rounded-xl w-full h-40 object-cover" />
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-amber-400">Пожелания</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Например: подчеркнуть талию, добавить слои, больше элегантности."
                  className="mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 min-h-[80px]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold py-3.5 rounded-xl hover:brightness-110 transition-all uppercase tracking-wider text-xs"
              >
                Сгенерировать стиль
              </button>
            </form>
          </section>
        </main>
      </div>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-serif text-white">Ваши рекомендации</h2>
              <p className="text-xs text-neutral-500 mt-1">
                {submitted ? 'Движок обновил рекомендации по вашим параметрам.' : 'Заполните форму, чтобы получить персональные подсказки.'}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-amber-400">STYLE ENGINE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map(card => (
              <div key={card.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
                <div>
                  <h3 className="text-white font-semibold">{card.title}</h3>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">{card.description}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-amber-400 mb-2">Ключевые вещи</p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300">
                    {card.keyPieces.map(item => (
                      <span key={item} className="px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900/70">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-amber-400 mb-2">Палитра</p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300">
                    {card.palette.map(color => (
                      <span key={color} className="px-3 py-1 rounded-full border border-neutral-700 bg-neutral-900/70">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase text-amber-400 mb-2">Советы</p>
                  <ul className="space-y-2 text-[11px] text-neutral-400 list-disc list-inside">
                    {card.shoppingTips.map(tip => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-neutral-500">
            {[
              'Двигатель учёл сезон, бюджет и настроение.',
              'Добавьте палитру, чтобы усилить акценты.',
              'Пересоберите ввод и сравните капсулы.',
            ].map(note => (
              <div key={note} className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
                {note}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;
