import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import RequirementGathering from './components/RequirementGathering'
import KnowledgeTransfer from './components/KnowledgeTransfer'
import Login from './components/Login'
import CollabComponent from './components/CollabComponent'

function App() {

  return (
    <>
      {/* <Login></Login> */}
      <RequirementGathering />
      <KnowledgeTransfer />
      <CollabComponent />
    </>
  )
}

export default App
