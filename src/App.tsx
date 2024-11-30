import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Custom from "./pages/Custom";
import Predefined from "./pages/Predefined";
import Header from "./components/Header";
import Login from "./pages/Login";
import MyWalks from "./pages/MyWalks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/predefined" element={<Predefined />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-walks" element={<MyWalks />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;