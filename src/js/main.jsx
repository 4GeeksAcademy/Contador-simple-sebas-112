import React from "react";
import ReactDOM from "react-dom/client";
import SecondsCounter from "../component/SecondsCounter.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SecondsCounter />
  </React.StrictMode>
);
