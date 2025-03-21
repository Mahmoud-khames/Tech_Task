import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import AuthWrapperProvider from "./context/AuthWrapper.tsx";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthWrapperProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />

        <Router>
          <App />
        </Router>
      </QueryClientProvider>
    </AuthWrapperProvider>
  </StrictMode>
);
