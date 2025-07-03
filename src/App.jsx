import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index"
import ScoreView from "./pages/ScoreView"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Index />} />
        <Route path="score_view" element={<ScoreView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
