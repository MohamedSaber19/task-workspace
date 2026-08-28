import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";
import { queryClient } from "./lib/react-query";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    return;
  }
  const { worker } = await import("./api/browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="task-workspace-theme">
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
});
