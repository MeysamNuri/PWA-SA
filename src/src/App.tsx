import { useMemo, useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/core/constant/queryClient";
import { getTheme } from "./theme";
import "@/core/globalStyels.scss";
import { ToastContainer } from "react-toastify";
import { AppRouter } from "./router";
import { BrowserRouter, useLocation, useNavigate } from "react-router";
import React from "react";
import { ThemeProvider } from "@/core/context/ThemeContext.tsx";
import "intro.js/introjs.css";
declare global {
  interface Window {
    _paq: Array<[string, ...unknown[]]>;
  }
}

const useMatomoPageTracking = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (window._paq) {
      window._paq.push(['setCustomUrl', location.pathname + location.search]);
      window._paq.push(['setDocumentTitle', document.title]);
      window._paq.push(['trackPageView']);
    }
  }, [location]);
};

export const MatomoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    if (document.getElementById('matomo-script')) return;

    const script = document.createElement('script');
    script.id = 'matomo-script';
    script.innerHTML = `
      var _paq = window._paq = window._paq || [];
      _paq.push(["trackPageView"]);
      _paq.push(["enableLinkTracking"]);
      (function () {
        var u = "//https://monitoring.holoo.ai/";
        _paq.push(["setTrackerUrl", u + "matomo.php"]);
        _paq.push(["setSiteId", "1"]);
        var d = document,
          g = d.createElement("script"),
          s = d.getElementsByTagName("script")[0];
        g.async = true;
        g.src = u + "matomo.js";
        s.parentNode.insertBefore(g, s);
      })();
    `;
    document.head.appendChild(script);
  }, []);

  return <>{children}</>;
};


const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (location.pathname !== "/home") {
        event.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location, navigate]);

  useMatomoPageTracking();

  return <AppRouter />;
};

const App = () => {

  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    return (savedTheme as "light" | "dark") || "light";
  });


  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setMode(event.detail.mode);
    };

    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme && savedTheme !== mode) {
      setMode(savedTheme as "light" | "dark");
    }
  }, [mode]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme) {
      setMode(savedTheme as "light" | "dark");
      document.documentElement.setAttribute('data-mui-color-scheme', savedTheme);
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`/sw.js`)
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  
  return (
    <MatomoProvider>
      <ToastContainer position="top-left" autoClose={5000} rtl={true} toastStyle={mode === "dark" ? { backgroundColor: "black", color: "white" } : {}} />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <MuiThemeProvider theme={theme}>
                <AppContent />
            </MuiThemeProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>

    </MatomoProvider>
  );
};

export default App;