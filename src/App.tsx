
import './App.css'
import MindMap from './components/MindMap';


const App = () => {
  const printMap = () => window.print();

  return (
    <>
      <button onClick={printMap} style={{ position: 'fixed', top: 10, right: 10 }}>
        Print
      </button>
      <MindMap />
    </>
  );
};

export default App
