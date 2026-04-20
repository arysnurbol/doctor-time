import React from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  ClipboardList,
  FileHeart,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Ruler,
  ShieldCheck,
  Stethoscope,
  User,
  UserPlus,
  Weight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useI18n } from '../i18n.jsx'
import { calculateAge } from '../data/mockPatients.js'

const STATUS_BADGE_STYLES = {
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  observation: 'bg-amber-100 text-amber-800 border-amber-200',
  chronic: 'bg-violet-100 text-violet-800 border-violet-200',
}

function getInitials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatDate(dateStr, locale) {
  if (!dateStr) return '—'
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'long', year: 'numeric' }).format(date)
}

function InfoRow({ Icon, label, value, accent = false }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className={`rounded-xl p-2 ${accent ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
        {Icon ? <Icon className="h-4 w-4" /> : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="mt-0.5 break-words text-sm font-semibold text-slate-900">{value || '—'}</div>
      </div>
    </div>
  )
}

export default function PatientCardPage({ patient, doctor, onOpenTreatmentPlan, hasTreatmentPlan, doctors, services }) {
  const { t, dateLocale } = useI18n()

  if (!patient) {
    return (
      <Card className="rounded-[28px] border-slate-200 bg-white">
        <CardContent className="p-10 text-center text-slate-500">{t('patients.emptyState')}</CardContent>
      </Card>
    )
  }

  const age = calculateAge(patient.birthDate)
  const bmi = patient.height && patient.weight ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1) : null
  const bmiLabel = bmi
    ? bmi < 18.5
      ? t('patients.bmi.under')
      : bmi < 25
      ? t('patients.bmi.normal')
      : bmi < 30
      ? t('patients.bmi.over')
      : t('patients.bmi.obese')
    : null
  const genderIconKey = patient.genderKey === 'male' ? 'male' : 'female'
  const statusClass = STATUS_BADGE_STYLES[patient.statusKey] || STATUS_BADGE_STYLES.active

  const sortedVisits = [...(patient.visits || [])].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <Card className="rounded-[28px] border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-lg">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 border-2 border-white/20 bg-white/10 text-xl">
              <AvatarFallback className="bg-white/10 text-white">{getInitials(patient.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/15 px-3 py-1">#{patient.cardNumber}</span>
                <Badge className={`rounded-full border ${statusClass}`}>{t(`patients.status.${patient.statusKey}`)}</Badge>
              </div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">{patient.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> {t(`patients.gender.${genderIconKey}`)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" /> {formatDate(patient.birthDate, dateLocale)} · {t('patients.ageYears', { count: age })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4" /> {doctor?.name || '—'}
                </span>
              </div>
            </div>
          </div>

          {hasTreatmentPlan ? (
            <Button onClick={onOpenTreatmentPlan} className="h-12 gap-2 rounded-2xl bg-white px-5 text-sm text-slate-900 hover:bg-slate-100">
              <FileHeart className="h-4 w-4" />
              {t('patients.openTreatmentPlan')}
            </Button>
          ) : (
            <Badge className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/10">{t('patients.noTreatmentPlan')}</Badge>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-slate-700" /> {t('patients.sectionContact')}
            </CardTitle>
            <CardDescription>{t('patients.sectionContactDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <InfoRow Icon={Phone} label={t('patients.fields.phone')} value={patient.phone} />
            <InfoRow Icon={Mail} label={t('patients.fields.email')} value={patient.email} />
            <InfoRow Icon={MapPin} label={t('patients.fields.address')} value={patient.address} />
            <InfoRow Icon={ShieldCheck} label={t('patients.fields.insurance')} value={patient.insurance} />
            <InfoRow Icon={CalendarDays} label={t('patients.fields.registered')} value={formatDate(patient.registeredDate, dateLocale)} />
            <InfoRow Icon={CalendarDays} label={t('patients.fields.nextVisit')} value={formatDate(patient.nextVisitDate, dateLocale)} accent />
            <div className="sm:col-span-2">
              <InfoRow
                Icon={UserPlus}
                label={t('patients.fields.emergencyContact')}
                value={
                  patient.emergencyContactName
                    ? `${patient.emergencyContactName} · ${t(`patients.relation.${patient.emergencyRelationKey}`)} · ${patient.emergencyContactPhone}`
                    : '—'
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <HeartPulse className="h-5 w-5 text-rose-500" /> {t('patients.sectionMedical')}
            </CardTitle>
            <CardDescription>{t('patients.sectionMedicalDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoRow Icon={Activity} label={t('patients.fields.bloodType')} value={patient.bloodType} />
              <InfoRow Icon={Ruler} label={t('patients.fields.height')} value={patient.height ? `${patient.height} ${t('patients.units.cm')}` : '—'} />
              <InfoRow Icon={Weight} label={t('patients.fields.weight')} value={patient.weight ? `${patient.weight} ${t('patients.units.kg')}` : '—'} />
            </div>

            {bmi ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500">{t('patients.fields.bmi')}</div>
                    <div className="mt-1 text-2xl font-bold text-slate-900">{bmi}</div>
                  </div>
                  <Badge variant="secondary" className="rounded-full">{bmiLabel}</Badge>
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                <AlertTriangle className="h-4 w-4" /> {t('patients.fields.allergies')}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.allergies && patient.allergies.length ? (
                  patient.allergies.map((item) => (
                    <Badge key={item} className="rounded-full border border-amber-300 bg-white text-amber-900 hover:bg-white">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-amber-900/70">{t('patients.none')}</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-violet-900">
                <HeartPulse className="h-4 w-4" /> {t('patients.fields.chronic')}
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patient.chronicConditions && patient.chronicConditions.length ? (
                  patient.chronicConditions.map((item) => (
                    <Badge key={item} className="rounded-full border border-violet-300 bg-white text-violet-900 hover:bg-white">
                      {item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-violet-900/70">{t('patients.none')}</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5 text-slate-700" /> {t('patients.sectionVisits')}
          </CardTitle>
          <CardDescription>{t('patients.sectionVisitsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedVisits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
              {t('patients.noVisits')}
            </div>
          ) : (
            <ol className="relative space-y-4 border-l border-slate-200 pl-6">
              {sortedVisits.map((visit, idx) => {
                const visitDoctor = doctors.find((d) => d.id === visit.doctorId)
                return (
                  <li key={`${visit.date}-${idx}`} className="relative">
                    <span className="absolute -left-[29px] top-2 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-slate-900 shadow" />
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold text-slate-900">{formatDate(visit.date, dateLocale)}</div>
                        <Badge variant="secondary" className="rounded-full">
                          {services?.[visit.serviceKey] ? t(`services.${visit.serviceKey}`) : visit.serviceKey}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-slate-600">{visitDoctor?.name || '—'}</div>
                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                          <div className="text-xs uppercase tracking-wide text-slate-500">{t('patients.fields.reason')}</div>
                          <div className="text-slate-800">{visit.reason}</div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                          <div className="text-xs uppercase tracking-wide text-slate-500">{t('patients.fields.diagnosis')}</div>
                          <div className="text-slate-800">{visit.diagnosis}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </CardContent>
      </Card>

      {patient.notes ? (
        <Card className="rounded-[28px] border-slate-200 bg-slate-900 text-white shadow-sm">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400">{t('patients.fields.notes')}</div>
            <div className="mt-2 text-sm leading-relaxed text-slate-100">{patient.notes}</div>
          </CardContent>
        </Card>
      ) : null}
    </motion.div>
  )
}
