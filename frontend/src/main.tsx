import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import DeviceList from "./DeviceList.tsx";
import DeviceView from "./DeviceView.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Navigate to="/devices" />} />
          <Route path="/devices" element={<App />}>
            <Route index element={<DeviceList />} />
            <Route path=":deviceId" element={<DeviceView />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
