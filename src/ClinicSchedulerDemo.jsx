import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Clock3,
  DollarSign,
  FileBarChart2,
  LogOut,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

function getTodayString() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function addDays(dateStr, days) {
  const date = new Date(dateStr + 'T12:00:00')
  date.setDate(date.getDate() + days)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDisplayDate(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getShortDateLabel(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' }).format(date)
}

function getWeekdayLabel(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return new Intl.DateTimeFormat('ru-RU', { weekday: 'short' }).format(date)
}

function getDateRange(selectedDate, rangeType) {
  if (rangeType === 'day') return [selectedDate]
  if (rangeType === 'week') return Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i))
  if (rangeType === 'month') return Array.from({ length: 30 }, (_, i) => addDays(selectedDate, i))
  return [selectedDate]
}

const USERS = [
  { username: 'doctor1', password: 'doctor1', role: 'doctor', name: 'Др. Айдана Сейтова' },
  { username: 'owner1', password: 'owner1', role: 'owner', name: 'Ержан Т.' },
  { username: 'accountant1', password: 'accountant1', role: 'accountant', name: 'Мадина Е.' },
]

const DOCTORS = [
  { id: 'doc-1', name: 'Др. Айдана Сейтова', specialty: 'Терапевт' },
  { id: 'doc-2', name: 'Др. Нұрлан Қасымов', specialty: 'Кардиолог' },
  { id: 'doc-3', name: 'Др. Әсем Төлеуова', specialty: 'Невролог' },
  { id: 'doc-4', name: 'Др. Руслан Жанатов', specialty: 'Педиатр' },
  { id: 'doc-5', name: 'Др. Маржан Иманбек', specialty: 'ЛОР' },
]

const SERVICES = {
  consultation: { label: 'Консультация', price: 12000 },
  ecg: { label: 'ЭКГ', price: 8000 },
  followup: { label: 'Қайта қабылдау', price: 9000 },
  injection: { label: 'Процедура', price: 7000 },
  ultrasound: { label: 'УЗИ', price: 15000 },
  checkup: { label: 'Чек-ап', price: 18000 },
}

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const hour = 9 + i
  return `${String(hour).padStart(2, '0')}:00`
})

const APPOINTMENTS = [
  { id: 1, doctorId: 'doc-1', date: addDays(getTodayString(), 0), time: '09:00', duration: 1, client: 'Алина О.', service: 'consultation', status: 'confirmed' },
  { id: 2, doctorId: 'doc-1', date: addDays(getTodayString(), 0), time: '11:00', duration: 2, client: 'Руслан Б.', service: 'checkup', status: 'in_progress' },
  { id: 3, doctorId: 'doc-2', date: addDays(getTodayString(), 0), time: '10:00', duration: 1, client: 'Дана К.', service: 'ecg', status: 'confirmed' },
  { id: 4, doctorId: 'doc-2', date: addDays(getTodayString(), 1), time: '14:00', duration: 1, client: 'Мирас Т.', service: 'followup', status: 'confirmed' },
  { id: 5, doctorId: 'doc-3', date: addDays(getTodayString(), 2), time: '09:00', duration: 1, client: 'Сабина Ж.', service: 'consultation', status: 'confirmed' },
  { id: 6, doctorId: 'doc-3', date: addDays(getTodayString(), 3), time: '15:00', duration: 2, client: 'Арман Е.', service: 'ultrasound', status: 'in_progress' },
  { id: 7, doctorId: 'doc-4', date: addDays(getTodayString(), 4), time: '12:00', duration: 1, client: 'Томирис П.', service: 'injection', status: 'confirmed' },
  { id: 8, doctorId: 'doc-4', date: addDays(getTodayString(), 5), time: '17:00', duration: 1, client: 'Әлихан Д.', service: 'consultation', status: 'confirmed' },
  { id: 9, doctorId: 'doc-5', date: addDays(getTodayString(), 6), time: '13:00', duration: 1, client: 'Жансая М.', service: 'followup', status: 'confirmed' },
  { id: 10, doctorId: 'doc-5', date: addDays(getTodayString(), 7), time: '18:00', duration: 1, client: 'Нұрислам Қ.', service: 'consultation', status: 'pending' },
  { id: 11, doctorId: 'doc-1', date: addDays(getTodayString(), 8), time: '10:00', duration: 1, client: 'Айбек С.', service: 'followup', status: 'confirmed' },
  { id: 12, doctorId: 'doc-2', date: addDays(getTodayString(), 10), time: '16:00', duration: 1, client: 'Ляззат Н.', service: 'consultation', status: 'confirmed' },
  { id: 13, doctorId: 'doc-3', date: addDays(getTodayString(), 12), time: '11:00', duration: 1, client: 'Ернар К.', service: 'ecg', status: 'pending' },
  { id: 14, doctorId: 'doc-4', date: addDays(getTodayString(), 15), time: '09:00', duration: 1, client: 'Малика Р.', service: 'checkup', status: 'confirmed' },
  { id: 15, doctorId: 'doc-5', date: addDays(getTodayString(), 20), time: '14:00', duration: 2, client: 'Гүлназ А.', service: 'ultrasound', status: 'confirmed' },
  { id: 16, doctorId: 'doc-1', date: addDays(getTodayString(), 25), time: '19:00', duration: 1, client: 'Самат Ж.', service: 'consultation', status: 'pending' },
]

const STATUS_STYLES = {
  confirmed: 'bg-white/80 border-slate-300',
  in_progress: 'bg-slate-900 text-white border-slate-900',
  pending: 'bg-amber-50 border-amber-300',
}

function formatMoney(value) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₸'
}

function getDoctorIdByUser(currentUser) {
  if (currentUser?.role !== 'doctor') return null
  const matchedDoctor = DOCTORS.find((doctor) => doctor.name === currentUser.name)
  return matchedDoctor?.id ?? DOCTORS[0]?.id ?? null
}

function buildRevenueReport(doctorIds = null, dateRange = null) {
  const visibleDoctors = doctorIds ? DOCTORS.filter((doctor) => doctorIds.includes(doctor.id)) : DOCTORS

  return visibleDoctors.map((doctor) => {
    const doctorAppointments = APPOINTMENTS.filter((a) => a.doctorId === doctor.id && (!dateRange || dateRange.includes(a.date)))
    const total = doctorAppointments.reduce((sum, item) => sum + SERVICES[item.service].price, 0)

    const servicesBreakdown = doctorAppointments.reduce((acc, item) => {
      const service = SERVICES[item.service]
      if (!acc[service.label]) acc[service.label] = { count: 0, amount: 0 }
      acc[service.label].count += 1
      acc[service.label].amount += service.price
      return acc
    }, {})

    return { ...doctor, appointments: doctorAppointments.length, total, servicesBreakdown }
  })
}

function findAppointment(doctorId, time, date) {
  return APPOINTMENTS.find((a) => a.doctorId === doctorId && a.time === time && a.date === date)
}

function getAppointmentContinuation(doctorId, time, date) {
  const hourIndex = HOURS.indexOf(time)
  return APPOINTMENTS.some((a) => {
    if (a.doctorId !== doctorId || a.date !== date) return false
    const startIndex = HOURS.indexOf(a.time)
    if (startIndex === -1) return false
    return hourIndex > startIndex && hourIndex < startIndex + a.duration
  })
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('owner1')
  const [password, setPassword] = useState('owner1')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const user = USERS.find((u) => u.username === username && u.password === password)
    if (!user) {
      setError('Қате логин немесе пароль')
      return
    }
    setError('')
    onLogin(user)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Badge className="rounded-full bg-white/10 px-4 py-1 text-white hover:bg-white/10">Clinic Demo Dashboard</Badge>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight lg:text-6xl">
              Клиникаға арналған <span className="text-slate-300">ыңғайлы scheduling dashboard</span>
            </h1>
            <p className="max-w-2xl text-base text-slate-300 lg:text-lg">
              Demo үшін fake авторизация, кестелік шахматка және период бойынша көрініс: бүгін, 1 апта, 1 ай.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
              <CardContent className="p-5">
                <CalendarDays className="mb-3 h-6 w-6" />
                <p className="text-sm text-slate-300">Авто дата</p>
                <p className="mt-1 text-xl font-semibold">Бүгін ашылады</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
              <CardContent className="p-5">
                <Users className="mb-3 h-6 w-6" />
                <p className="text-sm text-slate-300">Мамандар</p>
                <p className="mt-1 text-xl font-semibold">{DOCTORS.length} врач</p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
              <CardContent className="p-5">
                <FileBarChart2 className="mb-3 h-6 w-6" />
                <p className="text-sm text-slate-300">Отчет</p>
                <p className="mt-1 text-xl font-semibold">Revenue breakdown</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-[28px] border-white/10 bg-white text-slate-900 shadow-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <ShieldCheck className="h-4 w-4" />
                Demo login
              </div>
              <CardTitle className="text-2xl">Жүйеге кіру</CardTitle>
              <CardDescription>Төмендегі логиндердің бірін қолданыңыз</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div>
                  <b>doctor1</b> / doctor1
                </div>
                <div>
                  <b>owner1</b> / owner1
                </div>
                <div>
                  <b>accountant1</b> / accountant1
                </div>
              </div>
              <form className="space-y-4" onSubmit={submit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Логин</label>
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="h-11 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Пароль</label>
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    type="password"
                    className="h-11 rounded-2xl"
                  />
                </div>
                {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
                <Button type="submit" className="h-11 w-full rounded-2xl text-base">
                  Кіру
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function Header({ selectedDate, setSelectedDate, currentUser, onLogout }) {
  const roleLabel = {
    owner: 'Толық доступ',
    doctor: 'Өз кестесі + отчет',
    accountant: 'Тек отчет',
  }

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Stethoscope className="h-4 w-4" />
          ClinicFlow Demo
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Басты бет / Прием шахматкасы</h1>
        <p className="mt-1 text-sm text-slate-500">Барлық рольдер үшін кестелік көрініс сақталды. Период: бүгін, 1 апта, 1 ай.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <CalendarDays className="h-4 w-4 text-slate-500" />
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-sm outline-none" />
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{currentUser.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-semibold text-slate-900">{currentUser.name}</div>
            <div className="text-xs uppercase tracking-wide text-slate-500">{currentUser.role}</div>
            <div className="text-[11px] text-slate-400">{roleLabel[currentUser.role]}</div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={onLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function StatsRow({ report }) {
  const totalRevenue = report.reduce((sum, item) => sum + item.total, 0)
  const totalAppointments = report.reduce((sum, item) => sum + item.appointments, 0)
  const topDoctor = [...report].sort((a, b) => b.total - a.total)[0]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Жалпы выручка</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{formatMoney(totalRevenue)}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Қабылдаулар саны</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{totalAppointments}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Топ врач</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{topDoctor?.name}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <Stethoscope className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-3xl border-slate-200 bg-white shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Уақыт диапазоны</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">09:00 - 20:00</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3">
              <Clock3 className="h-5 w-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ScheduleBoard({ search, doctors, dateRange, rangeType }) {
  const filteredDoctors = doctors.filter(
    (doctor) => doctor.name.toLowerCase().includes(search.toLowerCase()) || doctor.specialty.toLowerCase().includes(search.toLowerCase()),
  )

  const rowGroups = dateRange.flatMap((date) => HOURS.map((hour) => ({ date, hour })))

  return (
    <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Қабылдау кестесі</CardTitle>
        <CardDescription>Уақыт вертикаль бағытта, врачтар горизонталь бағытта. Таңдалған периодқа қарай кесте төменге қарай ұзарады.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto rounded-2xl border border-slate-300">
          <table className="min-w-[1220px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-30 min-w-[120px] border border-slate-300 bg-slate-100 px-4 py-3 text-left font-semibold text-slate-900">Күн</th>
                <th className="sticky left-[120px] top-0 z-30 min-w-[100px] border border-slate-300 bg-slate-100 px-4 py-3 text-left font-semibold text-slate-900">
                  Уақыт
                </th>
                {filteredDoctors.map((doctor) => (
                  <th key={doctor.id} className="min-w-[220px] border border-slate-300 bg-slate-100 px-4 py-3 text-left font-semibold text-slate-900">
                    <div className="flex items-start gap-3">
                      <Avatar className="mt-0.5 h-10 w-10">
                        <AvatarFallback>{doctor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-slate-900">{doctor.name}</div>
                        <div className="mt-1 text-xs text-slate-500">{doctor.specialty}</div>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowGroups.map(({ date, hour }) => {
                const isFirstHourOfDate = hour === HOURS[0]
                return (
                  <tr key={`${date}-${hour}`} className="align-top">
                    <td className="sticky left-0 z-20 border border-slate-300 bg-white px-4 py-4 font-medium text-slate-900">
                      {isFirstHourOfDate ? (
                        <div>
                          <div>{getShortDateLabel(date)}</div>
                          {rangeType !== 'day' ? <div className="mt-1 text-xs uppercase text-slate-500">{getWeekdayLabel(date)}</div> : null}
                        </div>
                      ) : null}
                    </td>
                    <td className="sticky left-[120px] z-20 border border-slate-300 bg-white px-4 py-4 font-semibold text-slate-900">{hour}</td>
                    {filteredDoctors.map((doctor) => {
                      const appointment = findAppointment(doctor.id, hour, date)
                      const isContinuation = getAppointmentContinuation(doctor.id, hour, date)
                      if (isContinuation) {
                        return <td key={`${date}-${hour}-${doctor.id}`} className="h-[88px] min-w-[220px] border border-slate-300 bg-slate-50" />
                      }
                      return (
                        <td key={`${date}-${hour}-${doctor.id}`} className="h-[88px] min-w-[220px] border border-slate-300 p-2 align-top">
                          {appointment ? (
                            <div className={`h-full rounded-xl border p-3 shadow-sm ${STATUS_STYLES[appointment.status]}`}>
                              <div className="text-sm font-semibold">{appointment.client}</div>
                              <div className="mt-1 text-xs opacity-80">{SERVICES[appointment.service].label}</div>
                              <div className="mt-2 flex items-center justify-between gap-2">
                                <Badge variant="secondary" className="rounded-full text-[10px]">
                                  {formatMoney(SERVICES[appointment.service].price)}
                                </Badge>
                                {appointment.duration > 1 ? <span className="text-[10px] opacity-70">{appointment.duration} сағ</span> : null}
                              </div>
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-[10px] text-slate-300">Бос</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportTable({ report }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Врачтар бойынша табыс</CardTitle>
          <CardDescription>Қай врач қанша ақша алуы керек екенін mock data негізінде көрсетеді</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-2xl border border-slate-300">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-slate-300 bg-slate-100 px-4 py-3 text-left">Врач</th>
                  <th className="border border-slate-300 bg-slate-100 px-4 py-3 text-left">Специализация</th>
                  <th className="border border-slate-300 bg-slate-100 px-4 py-3 text-center">Қабылдау саны</th>
                  <th className="border border-slate-300 bg-slate-100 px-4 py-3 text-right">Сома</th>
                </tr>
              </thead>
              <tbody>
                {report.map((item) => (
                  <tr key={item.id}>
                    <td className="border border-slate-300 px-4 py-3 font-medium text-slate-900">{item.name}</td>
                    <td className="border border-slate-300 px-4 py-3 text-slate-600">{item.specialty}</td>
                    <td className="border border-slate-300 px-4 py-3 text-center">{item.appointments}</td>
                    <td className="border border-slate-300 px-4 py-3 text-right font-semibold text-slate-900">{formatMoney(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Көрсетілген услугалар</CardTitle>
          <CardDescription>Әр врачтың қандай қызметтер көрсеткені және сомасы</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {report.map((doctor) => (
            <div key={doctor.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-900">{doctor.name}</div>
                  <div className="text-xs text-slate-500">{doctor.specialty}</div>
                </div>
                <Badge className="rounded-full">{formatMoney(doctor.total)}</Badge>
              </div>
              <div className="space-y-2">
                {Object.entries(doctor.servicesBreakdown).map(([serviceName, data]) => (
                  <div key={serviceName} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                    <div>
                      <div className="font-medium text-slate-800">{serviceName}</div>
                      <div className="text-xs text-slate-500">{data.count} рет</div>
                    </div>
                    <div className="font-semibold text-slate-900">{formatMoney(data.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function Dashboard({ currentUser, onLogout }) {
  const [selectedDate, setSelectedDate] = useState(getTodayString())
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [rangeType, setRangeType] = useState('day')

  const doctorId = getDoctorIdByUser(currentUser)
  const dateRange = useMemo(() => getDateRange(selectedDate, rangeType), [selectedDate, rangeType])
  const visibleDoctors = useMemo(() => {
    if (currentUser.role === 'doctor' && doctorId) return DOCTORS.filter((doctor) => doctor.id === doctorId)
    return DOCTORS
  }, [currentUser, doctorId])

  const baseReport = useMemo(() => {
    if (currentUser.role === 'doctor' && doctorId) return buildRevenueReport([doctorId], dateRange)
    return buildRevenueReport(null, dateRange)
  }, [currentUser, doctorId, dateRange])

  const visibleReport = useMemo(() => {
    if (serviceFilter === 'all') return baseReport
    return baseReport
      .map((doctor) => {
        const appointments = APPOINTMENTS.filter(
          (a) => a.doctorId === doctor.id && a.service === serviceFilter && dateRange.includes(a.date),
        )
        const total = appointments.reduce((sum, item) => sum + SERVICES[item.service].price, 0)
        const servicesBreakdown = appointments.reduce((acc, item) => {
          const service = SERVICES[item.service]
          if (!acc[service.label]) acc[service.label] = { count: 0, amount: 0 }
          acc[service.label].count += 1
          acc[service.label].amount += service.price
          return acc
        }, {})
        return { ...doctor, appointments: appointments.length, total, servicesBreakdown }
      })
      .filter((doctor) => doctor.appointments > 0)
  }, [baseReport, serviceFilter, dateRange])

  const effectiveReport = visibleReport.length ? visibleReport : baseReport
  const canViewSchedule = currentUser.role === 'owner' || currentUser.role === 'doctor'
  const canViewReport = true
  const defaultTab = currentUser.role === 'accountant' ? 'report' : 'schedule'

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(148,163,184,0.15),_transparent_30%),linear-gradient(180deg,_#f8fafc,_#eef2ff)] p-4 md:p-6">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <Header selectedDate={selectedDate} setSelectedDate={setSelectedDate} currentUser={currentUser} onLogout={onLogout} />
        <StatsRow report={effectiveReport} />

        <Tabs defaultValue={defaultTab} className="space-y-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <TabsList className="grid h-auto w-full max-w-md grid-cols-2 rounded-2xl bg-white p-1 shadow-sm">
              {canViewSchedule ? (
                <TabsTrigger value="schedule" className="rounded-xl py-2">
                  Шахматка
                </TabsTrigger>
              ) : (
                <div className="rounded-xl py-2 text-center text-sm text-slate-300">Шахматка</div>
              )}
              {canViewReport ? (
                <TabsTrigger value="report" className="rounded-xl py-2">
                  Отчет
                </TabsTrigger>
              ) : (
                <div className="rounded-xl py-2 text-center text-sm text-slate-300">Отчет</div>
              )}
            </TabsList>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {canViewSchedule ? (
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={currentUser.role === 'doctor' ? 'Өз кестеңізді іздеу' : 'Врачты немесе специализацияны іздеу'}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              ) : null}

              {canViewSchedule ? (
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                  <Button variant={rangeType === 'day' ? 'default' : 'ghost'} className="rounded-xl" onClick={() => setRangeType('day')}>
                    Бүгін
                  </Button>
                  <Button variant={rangeType === 'week' ? 'default' : 'ghost'} className="rounded-xl" onClick={() => setRangeType('week')}>
                    1 апта
                  </Button>
                  <Button variant={rangeType === 'month' ? 'default' : 'ghost'} className="rounded-xl" onClick={() => setRangeType('month')}>
                    1 ай
                  </Button>
                </div>
              ) : null}

              {canViewReport ? (
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-[240px] rounded-2xl border-slate-200 bg-white shadow-sm">
                    <SelectValue placeholder="Услуга бойынша фильтр" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Барлық услугалар</SelectItem>
                    {Object.entries(SERVICES).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          </div>

          {canViewSchedule ? (
            <TabsContent value="schedule" className="space-y-6">
              <Card className="rounded-[28px] border-slate-200 bg-slate-900 text-white shadow-sm">
                <CardContent className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-slate-300">Таңдалған күн</div>
                    <div className="mt-1 text-2xl font-bold capitalize">{getDisplayDate(selectedDate)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">09:00 - 20:00</Badge>
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">Кесте border visible</Badge>
                    <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">
                      {rangeType === 'day' ? 'Бүгінгі күн' : rangeType === 'week' ? '1 апталық көрініс' : '1 айлық көрініс'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <ScheduleBoard search={search} doctors={visibleDoctors} dateRange={dateRange} rangeType={rangeType} />
            </TabsContent>
          ) : null}

          {canViewReport ? (
            <TabsContent value="report">
              <ReportTable report={effectiveReport} />
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </div>
  )
}

export default function ClinicSchedulerDemo() {
  const [currentUser, setCurrentUser] = useState(null)
  if (!currentUser) return <LoginScreen onLogin={setCurrentUser} />
  return <Dashboard currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
}
