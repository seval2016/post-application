import Header from './components/Header';
import Home from './components/Home';

function App() {
  return (
    <div className="h-screen overflow-hidden">
      <Header />
      <div className="content pt-[72px] h-[calc(100vh-72px)]">
        <Home />
      </div>
    </div>
  )
}

export default App
