import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import appRoutes from "./routes/appRoutes";
import "./App.css";
import Login from "./pages/Users/Login";

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