import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./App.css"
import { SidebarProvider } from "./context/SidebarContext"
import { ThemeProvider } from "./components/ThemeProvider"
import { Provider } from "react-redux";
import { store } from "./app/store";
import { Toaster } from "react-hot-toast";


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <SidebarProvider>
          <App />
          <Toaster position="top-right" />
        </SidebarProvider>
      </ThemeProvider>
    </BrowserRouter>

    </Provider>

  </React.StrictMode>
)
