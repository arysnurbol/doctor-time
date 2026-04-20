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
      tabPatients: 'Пациент карточкасы',
      tabTreatmentPlan: 'Емдеу жоспары',
      tabReport: 'Есеп',
      rangeDay: 'Бүгін',
      rangeWeek: '1 апта',
      rangeMonth: '1 ай',
      searchDoctor: 'Дәрігерді немесе мамандықты іздеу',
      searchOwn: 'Өз кестеңізді іздеу',
      filterPlaceholder: 'Қызмет бойынша фильтр',
      filterAll: 'Барлық қызметтер',
      selectPatient: 'Пациентті таңдаңыз',
    },
    patients: {
      emptyState: 'Пациент таңдалмаған',
      openTreatmentPlan: 'Емдеу жоспарын қарау',
      noTreatmentPlan: 'Емдеу жоспары жасалмаған',
      ageYears: '{count} жас',
      noVisits: 'Қабылдау тарихы әзірге жоқ',
      none: 'Жоқ',
      sectionContact: 'Байланыс мәліметтері',
      sectionContactDesc: 'Жеке деректер, мекенжай және төтенше жағдай',
      sectionMedical: 'Медициналық мәліметтер',
      sectionMedicalDesc: 'Физикалық параметрлер, аллергиялар және созылмалы аурулар',
      sectionVisits: 'Қабылдау тарихы',
      sectionVisitsDesc: 'Соңғы қабылдаулар мен диагноздар',
      status: {
        active: 'Белсенді',
        observation: 'Бақылауда',
        chronic: 'Созылмалы есепте',
      },
      gender: {
        male: 'Ер',
        female: 'Әйел',
      },
      relation: {
        husband: 'Жолдасы',
        wife: 'Жұбайы',
        mother: 'Анасы',
        father: 'Әкесі',
        sister: 'Қарындасы',
        brother: 'Ағасы',
        son: 'Ұлы',
        daughter: 'Қызы',
      },
      fields: {
        phone: 'Телефон',
        email: 'E-mail',
        address: 'Мекенжай',
        insurance: 'Сақтандыру',
        registered: 'Тіркелген күн',
        nextVisit: 'Келесі қабылдау',
        emergencyContact: 'Төтенше жағдайдағы байланыс',
        bloodType: 'Қан тобы',
        height: 'Бойы',
        weight: 'Салмағы',
        bmi: 'Дене массасының индексі (BMI)',
        allergies: 'Аллергиялар',
        chronic: 'Созылмалы аурулар',
        reason: 'Шағым',
        diagnosis: 'Диагноз',
        notes: 'Дәрігер ескертпесі',
      },
      units: {
        cm: 'см',
        kg: 'кг',
      },
      bmi: {
        under: 'Төмен салмақ',
        normal: 'Қалыпты',
        over: 'Артық салмақ',
        obese: 'Семіздік',
      },
    },
    treatmentPlan: {
      emptyState: 'Осы пациент үшін емдеу жоспары әлі жасалмаған',
      patientLabel: 'Пациент',
      backToPatient: 'Пациент карточкасына қайту',
      progress: 'Жоспар прогресі',
      proceduresCompleted: '{completed} / {total} процедура орындалды',
      notes: 'Дәрігер түсіндірмесі',
      sectionGoal: 'Емдеудің мақсаты',
      sectionCost: 'Шығын',
      sectionCostDesc: 'Қызметтер мен дәрі-дәрмекке жұмсалатын қаражат',
      sectionMedications: 'Тағайындалған дәрі-дәрмек',
      sectionMedicationsDesc: 'Препарат, дозасы, қабылдау режимі',
      sectionProcedures: 'Процедуралар мен қабылдаулар',
      sectionProceduresDesc: 'Жоспарланған және аяқталған әрекеттер',
      sectionLabs: 'Зертханалық нәтижелер',
      sectionLabsDesc: 'Негізгі көрсеткіштер және нормалар',
      sectionRecommendations: 'Ұсыныстар',
      status: {
        active: 'Белсенді',
        completed: 'Аяқталған',
        paused: 'Тоқтатылған',
      },
      priority: {
        low: 'Төмен басымдық',
        medium: 'Орташа басымдық',
        high: 'Жоғары басымдық',
      },
      cost: {
        services: 'Қызметтер',
        medications: 'Дәрі-дәрмек',
        total: 'Жалпы сома',
      },
      med: {
        name: 'Атауы',
        form: 'Түрі',
        dosage: 'Доза',
        frequency: 'Жиілігі',
        timing: 'Қабылдау уақыты',
        duration: 'Ұзақтығы',
        status: 'Күйі',
        statusValue: {
          in_progress: 'Қабылдауда',
          scheduled: 'Жоспарланған',
          completed: 'Аяқталған',
        },
      },
      procedure: {
        status: {
          completed: 'Аяқталды',
          scheduled: 'Жоспарда',
          in_progress: 'Орындалуда',
          cancelled: 'Болдырылмаған',
        },
      },
      lab: {
        reference: 'Норма',
        status: {
          normal: 'Қалыпты',
          high: 'Жоғары',
          low: 'Төмен',
        },
      },
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
      tabPatients: '患者档案',
      tabTreatmentPlan: '治疗计划',
      tabReport: '报表',
      rangeDay: '今天',
      rangeWeek: '1 周',
      rangeMonth: '1 个月',
      searchDoctor: '搜索医生或专业',
      searchOwn: '搜索您的排班',
      filterPlaceholder: '按服务筛选',
      filterAll: '所有服务',
      selectPatient: '请选择患者',
    },
    patients: {
      emptyState: '未选择患者',
      openTreatmentPlan: '查看治疗计划',
      noTreatmentPlan: '尚未制定治疗计划',
      ageYears: '{count} 岁',
      noVisits: '暂无就诊记录',
      none: '无',
      sectionContact: '联系信息',
      sectionContactDesc: '个人资料、地址及紧急联系人',
      sectionMedical: '医疗信息',
      sectionMedicalDesc: '身体参数、过敏史及慢性病',
      sectionVisits: '就诊历史',
      sectionVisitsDesc: '最近的就诊记录与诊断',
      status: {
        active: '活跃',
        observation: '观察中',
        chronic: '慢性登记',
      },
      gender: {
        male: '男',
        female: '女',
      },
      relation: {
        husband: '丈夫',
        wife: '妻子',
        mother: '母亲',
        father: '父亲',
        sister: '姐妹',
        brother: '兄弟',
        son: '儿子',
        daughter: '女儿',
      },
      fields: {
        phone: '电话',
        email: '邮箱',
        address: '地址',
        insurance: '医疗保险',
        registered: '建档日期',
        nextVisit: '下次就诊',
        emergencyContact: '紧急联系人',
        bloodType: '血型',
        height: '身高',
        weight: '体重',
        bmi: '体质指数 (BMI)',
        allergies: '过敏史',
        chronic: '慢性病',
        reason: '主诉',
        diagnosis: '诊断',
        notes: '医生备注',
      },
      units: {
        cm: '厘米',
        kg: '公斤',
      },
      bmi: {
        under: '体重过轻',
        normal: '正常',
        over: '超重',
        obese: '肥胖',
      },
    },
    treatmentPlan: {
      emptyState: '该患者尚无治疗计划',
      patientLabel: '患者',
      backToPatient: '返回患者档案',
      progress: '计划进度',
      proceduresCompleted: '已完成 {completed} / {total} 项',
      notes: '医生说明',
      sectionGoal: '治疗目标',
      sectionCost: '费用',
      sectionCostDesc: '服务与药品的预估费用',
      sectionMedications: '处方药物',
      sectionMedicationsDesc: '药品、剂量与服用方式',
      sectionProcedures: '处置与复诊',
      sectionProceduresDesc: '已安排及已完成的操作',
      sectionLabs: '化验结果',
      sectionLabsDesc: '主要指标与参考范围',
      sectionRecommendations: '建议',
      status: {
        active: '进行中',
        completed: '已完成',
        paused: '已暂停',
      },
      priority: {
        low: '低优先级',
        medium: '中优先级',
        high: '高优先级',
      },
      cost: {
        services: '服务费',
        medications: '药品费',
        total: '总计',
      },
      med: {
        name: '名称',
        form: '剂型',
        dosage: '剂量',
        frequency: '频次',
        timing: '服用时间',
        duration: '疗程',
        status: '状态',
        statusValue: {
          in_progress: '服用中',
          scheduled: '待服用',
          completed: '已完成',
        },
      },
      procedure: {
        status: {
          completed: '已完成',
          scheduled: '已安排',
          in_progress: '进行中',
          cancelled: '已取消',
        },
      },
      lab: {
        reference: '参考范围',
        status: {
          normal: '正常',
          high: '偏高',
          low: '偏低',
        },
      },
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
