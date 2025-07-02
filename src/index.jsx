import './style.css'; // Estilos globais unificados (inclua tudo aqui!)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@react95/icons/icons.css";

// Renderiza seu App React normalmente
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);