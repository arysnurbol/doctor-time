import React from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  Clock3,
  FlaskConical,
  Pill,
  Stethoscope,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '../i18n.jsx'

const STATUS_BADGE = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-slate-200 text-slate-800 border-slate-300',
  paused: 'bg-amber-100 text-amber-800 border-amber-200',
}

const PRIORITY_BADGE = {
  low: 'bg-sky-100 text-sky-800 border-sky-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  high: 'bg-rose-100 text-rose-800 border-rose-200',
}

const PROCEDURE_STATUS_STYLE = {
  completed: { cls: 'bg-emerald-50 text-emerald-800 border-emerald-200', Icon: CheckCircle2 },
  scheduled: { cls: 'bg-sky-50 text-sky-800 border-sky-200', Icon: CalendarDays },
  in_progress: { cls: 'bg-amber-50 text-amber-800 border-amber-200', Icon: CircleDashed },
  cancelled: { cls: 'bg-slate-100 text-slate-600 border-slate-300', Icon: AlertCircle },
}

const MED_STATUS_STYLE = {
  in_progress: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  scheduled: 'bg-sky-100 text-sky-800 border-sky-200',
  completed: 'bg-slate-200 text-slate-700 border-slate-300',
}

const LAB_STATUS_STYLE = {
  normal: { cls: 'bg-emerald-100 text-emerald-800 border-emerald-200', Icon: BadgeCheck },
  high: { cls: 'bg-rose-100 text-rose-800 border-rose-200', Icon: TrendingUp },
  low: { cls: 'bg-amber-100 text-amber-800 border-amber-200', Icon: TrendingDown },
}

function formatDate(dateStr, locale) {
  if (!dateStr) return '—'
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

function formatMoney(value, locale) {
  return new Intl.NumberFormat(locale).format(value) + ' ₸'
}

export default function TreatmentPlanPage({ plan, patient, doctor, onBackToPatient }) {
  const { t, dateLocale } = useI18n()

  if (!plan || !patient) {
    return (
      <Card className="rounded-[28px] border-slate-200 bg-white">
        <CardContent className="p-10 text-center text-slate-500">{t('treatmentPlan.emptyState')}</CardContent>
      </Card>
    )
  }

  const statusCls = STATUS_BADGE[plan.statusKey] || STATUS_BADGE.active
  const priorityCls = PRIORITY_BADGE[plan.priorityKey] || PRIORITY_BADGE.medium

  const completedProcedures = plan.procedures.filter((p) => p.statusKey === 'completed').length
  const totalProcedures = plan.procedures.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card className="rounded-[28px] border-slate-200 bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white shadow-lg">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1">#{plan.id.toUpperCase()}</span>
              <Badge className={`rounded-full border ${statusCls}`}>{t(`treatmentPlan.status.${plan.statusKey}`)}</Badge>
              <Badge className={`rounded-full border ${priorityCls}`}>{t(`treatmentPlan.priority.${plan.priorityKey}`)}</Badge>
            </div>
            <div className="mt-3 text-sm text-indigo-100">
              {t('treatmentPlan.patientLabel')} · <span className="font-semibold text-white">{patient.name}</span>
            </div>
            <h2 className="mt-2 max-w-3xl text-3xl font-bold leading-tight">{plan.diagnosis}</h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-indigo-100">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4" /> {doctor?.name || '—'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" /> {formatDate(plan.startDate, dateLocale)} — {formatDate(plan.endDate, dateLocale)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row lg:flex-col">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="text-xs uppercase tracking-wide text-indigo-200">{t('treatmentPlan.progress')}</div>
              <div className="mt-1 text-3xl font-bold">{plan.progressPercent}%</div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/20">
                <div className="h-2 rounded-full bg-white transition-all" style={{ width: `${plan.progressPercent}%` }} />
              </div>
              <div className="mt-2 text-xs text-indigo-100">
                {t('treatmentPlan.proceduresCompleted', { completed: completedProcedures, total: totalProcedures })}
              </div>
            </div>
            {onBackToPatient ? (
              <Button variant="secondary" onClick={onBackToPatient} className="h-11 rounded-2xl bg-white text-slate-900 hover:bg-slate-100">
                {t('treatmentPlan.backToPatient')}
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5 text-indigo-600" /> {t('treatmentPlan.sectionGoal')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-700">{plan.goal}</p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5 text-emerald-600" /> {t('treatmentPlan.sectionCost')}
            </CardTitle>
            <CardDescription>{t('treatmentPlan.sectionCostDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="text-slate-600">{t('treatmentPlan.cost.services')}</span>
              <span className="font-semibold text-slate-900">{formatMoney(plan.cost.services, dateLocale)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <span className="text-slate-600">{t('treatmentPlan.cost.medications')}</span>
              <span className="font-semibold text-slate-900">{formatMoney(plan.cost.medications, dateLocale)}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm">
              <span className="font-semibold text-emerald-900">{t('treatmentPlan.cost.total')}</span>
              <span className="text-lg font-bold text-emerald-900">{formatMoney(plan.cost.total, dateLocale)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Pill className="h-5 w-5 text-rose-500" /> {t('treatmentPlan.sectionMedications')}
          </CardTitle>
          <CardDescription>{t('treatmentPlan.sectionMedicationsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-2xl border border-slate-200">
            <table className="min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">{t('treatmentPlan.med.name')}</th>
                  <th className="px-4 py-3">{t('treatmentPlan.med.form')}</th>
                  <th className="px-4 py-3">{t('treatmentPlan.med.dosage')}</th>
                  <th className="px-4 py-3">{t('treatmentPlan.med.frequency')}</th>
                  <th className="px-4 py-3">{t('treatmentPlan.med.timing')}</th>
                  <th className="px-4 py-3">{t('treatmentPlan.med.duration')}</th>
                  <th className="px-4 py-3">{t('treatmentPlan.med.status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {plan.medications.map((med, idx) => (
                  <tr key={`${med.name}-${idx}`} className="align-top">
                    <td className="px-4 py-3 font-semibold text-slate-900">{med.name}</td>
                    <td className="px-4 py-3 text-slate-700">{med.form}</td>
                    <td className="px-4 py-3 text-slate-700">{med.dosage}</td>
                    <td className="px-4 py-3 text-slate-700">{med.frequency}</td>
                    <td className="px-4 py-3 text-slate-700">{med.timing}</td>
                    <td className="px-4 py-3 text-slate-700">{med.duration}</td>
                    <td className="px-4 py-3">
                      <Badge className={`rounded-full border ${MED_STATUS_STYLE[med.statusKey] || ''}`}>
                        {t(`treatmentPlan.med.statusValue.${med.statusKey}`)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardCheck className="h-5 w-5 text-indigo-600" /> {t('treatmentPlan.sectionProcedures')}
            </CardTitle>
            <CardDescription>{t('treatmentPlan.sectionProceduresDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l border-slate-200 pl-6">
              {plan.procedures.map((proc, idx) => {
                const style = PROCEDURE_STATUS_STYLE[proc.statusKey] || PROCEDURE_STATUS_STYLE.scheduled
                const Icon = style.Icon
                return (
                  <li key={`${proc.date}-${idx}`} className="relative">
                    <span className="absolute -left-[29px] top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-indigo-600 shadow" />
                    <div className={`rounded-2xl border px-4 py-3 ${style.cls}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <Icon className="h-4 w-4" />
                          {proc.name}
                        </div>
                        <div className="inline-flex items-center gap-1 text-xs">
                          <Clock3 className="h-3.5 w-3.5" /> {formatDate(proc.date, dateLocale)}
                        </div>
                      </div>
                      {proc.note ? <div className="mt-1 text-xs opacity-80">{proc.note}</div> : null}
                      <div className="mt-2">
                        <Badge variant="outline" className="rounded-full border-current bg-white/60 text-xs">
                          {t(`treatmentPlan.procedure.status.${proc.statusKey}`)}
                        </Badge>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FlaskConical className="h-5 w-5 text-amber-600" /> {t('treatmentPlan.sectionLabs')}
              </CardTitle>
              <CardDescription>{t('treatmentPlan.sectionLabsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {plan.labResults.map((lab, idx) => {
                  const style = LAB_STATUS_STYLE[lab.statusKey] || LAB_STATUS_STYLE.normal
                  const Icon = style.Icon
                  return (
                    <div key={`${lab.name}-${idx}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{lab.name}</div>
                        <div className="text-xs text-slate-500">
                          {t('treatmentPlan.lab.reference')}: {lab.referenceRange}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm font-semibold text-slate-900">{lab.value}</div>
                        <Badge className={`rounded-full border ${style.cls}`}>
                          <Icon className="mr-1 h-3.5 w-3.5" />
                          {t(`treatmentPlan.lab.status.${lab.statusKey}`)}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-emerald-600" /> {t('treatmentPlan.sectionRecommendations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-700">
                {plan.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <span className="text-slate-800">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {plan.notes ? (
        <Card className="rounded-[28px] border-slate-200 bg-slate-900 text-white shadow-sm">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400">{t('treatmentPlan.notes')}</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-100">{plan.notes}</div>
          </CardContent>
        </Card>
      ) : null}
    </motion.div>
  )
}
