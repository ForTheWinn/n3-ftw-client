import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import "./fonts/VCR/VCR_OSD_MONO_1.001 2.ttf";
import "./fonts/Inter/Inter-VariableFont_slnt,wght.ttf";
import "./styles/style.scss";
import App from "./ui";

ReactDOM.render(
    <App />,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
