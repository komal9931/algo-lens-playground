import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import FeatureViewer from './pages/FeatureViewer.tsx';
import AlgorithmViewer from './pages/AlgorithmViewer';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/race-mode" element={<FeatureViewer />} />
      <Route path="/algorithm-viewer" element={<AlgorithmViewer />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;