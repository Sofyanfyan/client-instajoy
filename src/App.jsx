import AppRoutes from "./routes/AppRoutes";
import React from "react";
import { BrowserRouter } from "react-router-dom";
function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
