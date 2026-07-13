import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

// Fonts (bundled, offline-friendly)
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/600.css";
import "@fontsource/public-sans/700.css";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { queryClient } from "./lib/queryClient";
import "./index.css";

const container = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Statically prerendered pages (public job routes) arrive with markup in the
// root — hydrate those; everything else client-renders as a normal SPA.
if (container.hasChildNodes()) {
  ReactDOM.hydrateRoot(container, app);
} else {
  ReactDOM.createRoot(container).render(app);
}
