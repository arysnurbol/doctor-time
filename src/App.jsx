import ClinicSchedulerDemo from './ClinicSchedulerDemo.jsx'
import { LanguageProvider } from './i18n.jsx'

export default function App() {
  return (
    <LanguageProvider>
      <ClinicSchedulerDemo />
    </LanguageProvider>
  )
}
