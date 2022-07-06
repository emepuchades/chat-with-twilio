import './App.css';
import { createContext, useState } from 'react';
import Header from './components/Header'
import AnonymousForm from './components/AnonymousForm'

export const AppContext = createContext()

function App() {
  const [user, setUser] = useState({})

  return (
    <div className="App">
      <h1>Chat secretpo</h1>
      <AppContext.Provider value={{ user, setUser }}>
        <Header />
        <AnonymousForm />
      </AppContext.Provider>
    </div>
  );
}

export default App;
