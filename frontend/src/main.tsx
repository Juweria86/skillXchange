// main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./App.css";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Provider } from "react-redux";
import { store, persistor } from "./app/store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
// Create a client
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="theme">
            <SidebarProvider>
              <App />
              <Toaster position="top-right" />
            </SidebarProvider>
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>

    </QueryClientProvider>
    
  </React.StrictMode>
);
