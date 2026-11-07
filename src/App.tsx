import { useState } from 'react'
import { AppHeader } from './components/AppHeader'
import { getRole } from './data/experience'
import { LearningFlow } from './features/learning/LearningFlow'
import { ResultsScreen } from './features/results/ResultsScreen'
import { WelcomeScreen } from './features/welcome/WelcomeScreen'
import type { ExperienceMode, RoleId, View } from './types'
import { clearRoleProgress, loadView, saveView } from './utils/storage'

export default function App() {
  const [view, setViewState] = useState<View>(loadView)
  /** Bumped to remount the learning flow after its progress is reset. */
  const [flowVersion, setFlowVersion] = useState(0)

  const setView = (next: View) => {
    setViewState(next)
    saveView(next)
  }

  const goHome = () => setView({ name: 'welcome' })
  const openRole = (roleId: RoleId, mode: ExperienceMode) => setView({ name: 'learning', roleId, mode })
  const openResults = (roleId?: RoleId) => setView(roleId ? { name: 'results', roleId } : { name: 'results' })

  return (
    <div className="min-h-dvh">
      <AppHeader
        onHome={goHome}
        onResults={() => openResults(view.name === 'learning' ? view.roleId : undefined)}
        resultsActive={view.name === 'results'}
      />
      <main>
        {view.name === 'welcome' && <WelcomeScreen onSelectRole={(role, mode) => openRole(role.id, mode)} />}
        {view.name === 'learning' && (
          <LearningFlow
            key={`${view.roleId}:${view.mode}:${flowVersion}`}
            role={getRole(view.roleId)}
            mode={view.mode}
            onChangeRole={goHome}
            onViewResults={() => openResults(view.roleId)}
            onResetLearning={() => {
              clearRoleProgress(view.roleId, view.mode)
              setFlowVersion((v) => v + 1)
            }}
          />
        )}
        {view.name === 'results' && (
          <ResultsScreen
            key={view.roleId ?? 'all'}
            initialRoleId={view.roleId}
            onStartRole={(roleId) => openRole(roleId, 'full')}
            onDataCleared={() => {
              setFlowVersion((v) => v + 1)
              goHome()
            }}
          />
        )}
      </main>
    </div>
  )
}
