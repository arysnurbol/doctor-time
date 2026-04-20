import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'clinicflow.lang'
const DEFAULT_LANG = 'kz'

export const SUPPORTED_LANGS = [
  { code: 'kz', label: 'Қазақша', short: 'KZ', flag: '🇰🇿' },
  { code: 'zh', label: '中文', short: '中', flag: '🇨🇳' },
]

export const DATE_LOCALES = {
  kz: 'kk-KZ',
  zh: 'zh-CN',
}

const TRANSLATIONS = {
  kz: {
    common: {
      brand: 'ClinicFlow Demo',
      login: 'Кіру',
      logout: 'Шығу',
      language: 'Тіл',
    },
    login: {
      badge: 'Clinic Demo Dashboard',
      heroLead: 'Клиникаға арналған',
      heroAccent: 'ыңғайлы scheduling dashboard',
      heroSubtitle: 'Demo үшін fake авторизация, кестелік шахматка және период бойынша көрініс: бүгін, 1 апта, 1 ай.',
      cardAutoDateTitle: 'Авто дата',
      cardAutoDateValue: 'Бүгін ашылады',
      cardDoctorsTitle: 'Мамандар',
      cardDoctorsValue: '{count} дәрігер',
      cardReportTitle: 'Есеп',
      cardReportValue: 'Табыс бойынша бөліктеу',
      cardTitle: 'Жүйеге кіру',
      cardDescription: 'Төмендегі логиндердің бірін қолданыңыз',
      demoLogin: 'Demo login',
      usernameLabel: 'Логин',
      passwordLabel: 'Пароль',
      submit: 'Кіру',
      error: 'Қате логин немесе пароль',
    },
    header: {
      breadcrumb: 'Басты бет / Қабылдау шахматкасы',
      subtitle: 'Барлық рөлдер үшін кестелік көрініс сақталды. Период: бүгін, 1 апта, 1 ай.',
    },
    role: {
      owner: 'Толық доступ',
      doctor: 'Өз кестесі + есеп',
      accountant: 'Тек есеп',
    },
    stats: {
      revenue: 'Жалпы табыс',
      appointments: 'Қабылдаулар саны',
      topDoctor: 'Үздік дәрігер',
      timeRange: 'Уақыт диапазоны',
    },
    schedule: {
      title: 'Қабылдау кестесі',
      description: 'Уақыт вертикаль бағытта, дәрігерлер горизонталь бағытта. Таңдалған периодқа қарай кесте төменге қарай ұзарады.',
      colDay: 'Күн',
      colTime: 'Уақыт',
      empty: 'Бос',
      durationHours: '{count} сағ',
      selectedDay: 'Таңдалған күн',
      borderBadge: 'Кесте шекарасы көрінеді',
      viewDay: 'Бүгінгі күн',
      viewWeek: '1 апталық көрініс',
      viewMonth: '1 айлық көрініс',
    },
    report: {
      revenueTitle: 'Дәрігерлер бойынша табыс',
      revenueDescription: 'Қай дәрігер қанша ақша алуы керек екенін mock data негізінде көрсетеді',
      colDoctor: 'Дәрігер',
      colSpecialty: 'Мамандығы',
      colCount: 'Қабылдау саны',
      colAmount: 'Сома',
      servicesTitle: 'Көрсетілген қызметтер',
      servicesDescription: 'Әр дәрігердің қандай қызметтер көрсеткені және сомасы',
      timesCount: '{count} рет',
    },
    controls: {
      tabSchedule: 'Шахматка',
      tabReport: 'Есеп',
      rangeDay: 'Бүгін',
      rangeWeek: '1 апта',
      rangeMonth: '1 ай',
      searchDoctor: 'Дәрігерді немесе мамандықты іздеу',
      searchOwn: 'Өз кестеңізді іздеу',
      filterPlaceholder: 'Қызмет бойынша фильтр',
      filterAll: 'Барлық қызметтер',
    },
    services: {
      consultation: 'Консультация',
      ecg: 'ЭКГ',
      followup: 'Қайта қабылдау',
      injection: 'Процедура',
      ultrasound: 'УДЗ',
      checkup: 'Чек-ап',
    },
    specialties: {
      therapist: 'Терапевт',
      cardiologist: 'Кардиолог',
      neurologist: 'Невролог',
      pediatrician: 'Педиатр',
      ent: 'ЛОР',
    },
  },
  zh: {
    common: {
      brand: 'ClinicFlow 演示',
      login: '登录',
      logout: '退出',
      language: '语言',
    },
    login: {
      badge: '诊所演示仪表板',
      heroLead: '为诊所打造的',
      heroAccent: '便捷排班仪表板',
      heroSubtitle: '演示版提供模拟登录、排班棋盘以及按时间段查看：今天、1 周、1 个月。',
      cardAutoDateTitle: '自动日期',
      cardAutoDateValue: '今日开启',
      cardDoctorsTitle: '医生团队',
      cardDoctorsValue: '{count} 位医生',
      cardReportTitle: '报表',
      cardReportValue: '收入明细',
      cardTitle: '登录系统',
      cardDescription: '请使用下方任一账号登录',
      demoLogin: '演示登录',
      usernameLabel: '用户名',
      passwordLabel: '密码',
      submit: '登录',
      error: '用户名或密码错误',
    },
    header: {
      breadcrumb: '首页 / 预约棋盘',
      subtitle: '所有角色均可查看排班视图。时间段：今天、1 周、1 个月。',
    },
    role: {
      owner: '完全访问',
      doctor: '个人排班 + 报表',
      accountant: '仅报表',
    },
    stats: {
      revenue: '总收入',
      appointments: '预约数量',
      topDoctor: '顶尖医生',
      timeRange: '时间范围',
    },
    schedule: {
      title: '预约排班表',
      description: '时间为纵向，医生为横向。所选时间段越长，表格就越向下延伸。',
      colDay: '日期',
      colTime: '时间',
      empty: '空闲',
      durationHours: '{count} 小时',
      selectedDay: '所选日期',
      borderBadge: '显示表格边框',
      viewDay: '今日',
      viewWeek: '1 周视图',
      viewMonth: '1 月视图',
    },
    report: {
      revenueTitle: '医生收入',
      revenueDescription: '基于模拟数据显示每位医生应得金额',
      colDoctor: '医生',
      colSpecialty: '专业',
      colCount: '预约数量',
      colAmount: '金额',
      servicesTitle: '已提供服务',
      servicesDescription: '每位医生所提供的服务及金额',
      timesCount: '{count} 次',
    },
    controls: {
      tabSchedule: '排班表',
      tabReport: '报表',
      rangeDay: '今天',
      rangeWeek: '1 周',
      rangeMonth: '1 个月',
      searchDoctor: '搜索医生或专业',
      searchOwn: '搜索您的排班',
      filterPlaceholder: '按服务筛选',
      filterAll: '所有服务',
    },
    services: {
      consultation: '咨询',
      ecg: '心电图',
      followup: '复诊',
      injection: '处置',
      ultrasound: '超声检查',
      checkup: '全面体检',
    },
    specialties: {
      therapist: '全科医生',
      cardiologist: '心脏科医生',
      neurologist: '神经科医生',
      pediatrician: '儿科医生',
      ent: '耳鼻喉科医生',
    },
  },
}

const LanguageContext = createContext(null)

function readStoredLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'kz' || stored === 'zh') return stored
  } catch {
    // ignore storage errors (private mode, etc.)
  }
  return DEFAULT_LANG
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  const setLang = useCallback((next) => {
    if (next !== 'kz' && next !== 'zh') return
    setLangState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback(
    (key, vars) => {
      const dict = TRANSLATIONS[lang] || TRANSLATIONS[DEFAULT_LANG]
      const fallback = TRANSLATIONS[DEFAULT_LANG]
      const lookup = (source) => {
        let value = source
        for (const part of key.split('.')) {
          value = value?.[part]
        }
        return value
      }
      let value = lookup(dict)
      if (typeof value !== 'string') value = lookup(fallback)
      if (typeof value !== 'string') return key
      if (vars) {
        return value.replace(/\{(\w+)\}/g, (_, name) => (name in vars ? String(vars[name]) : `{${name}}`))
      }
      return value
    },
    [lang],
  )

  const value = useMemo(() => ({ lang, setLang, t, dateLocale: DATE_LOCALES[lang] }), [lang, setLang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}

export function LanguageSwitcher({ className = '', variant = 'light' }) {
  const { lang, setLang } = useI18n()
  const base =
    variant === 'dark'
      ? 'border-white/15 bg-white/10 text-white'
      : 'border-slate-200 bg-white text-slate-700'
  const activeCls =
    variant === 'dark' ? 'bg-white text-slate-900 shadow' : 'bg-slate-900 text-white shadow'
  const inactiveCls = variant === 'dark' ? 'text-white/80 hover:text-white' : 'text-slate-500 hover:text-slate-900'

  return (
    <div className={`inline-flex items-center gap-1 rounded-2xl border p-1 shadow-sm ${base} ${className}`}>
      {SUPPORTED_LANGS.map((option) => {
        const isActive = option.code === lang
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              isActive ? activeCls : inactiveCls
            }`}
            aria-pressed={isActive}
          >
            <span aria-hidden="true">{option.flag}</span>
            <span>{option.short}</span>
          </button>
        )
      })}
    </div>
  )
}
