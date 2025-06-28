import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import appRoutes from "./routes/appRoutes";
import React from "react";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {appRoutes.map(({ path, element }, idx) => (
          <Route key={idx} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;