import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// === PAGE === //
import UIDashboard from "./pages/UIDashboard";
import UIUser from "./pages/UIUser";
import UIKeywords from "./pages/UIKeywords";

import Login from "./pages/UILogin";

// === COMPONENT === //
import AuthLayout from "./component/layout/AuthLayout";
import NotFound from "./component/404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route path="/*" element={<NotFound />} />
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<UIDashboard />} />
          <Route path="/keywords" element={<UIKeywords />} />
          <Route path="/users" element={<UIUser />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
