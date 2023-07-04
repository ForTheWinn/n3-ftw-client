import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "./fonts/VCR/VCR_OSD_MONO_1.001 2.ttf";
import "./fonts/Inter/Inter-VariableFont_slnt,wght.ttf";
import "./style.scss";
import App from "./ui";

const root: any = document.getElementById("root");
ReactDOM.createRoot(root).render(<App />);

reportWebVitals();
