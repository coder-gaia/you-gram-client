import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

//redux
import { Provider } from "react-redux";
import { store } from "./store.js";

if (process.env.NODE_ENV === "production") disableReactDevTools();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
