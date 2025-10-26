import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { BottomNav } from "@/components/BottomNav";
import Index from "./pages/Index";
import Appointments from "./pages/Appointments";
import YourMedicines from "./pages/YourMedicines";
import Dietary from "./pages/Dietary";
import YourNetwork from "./pages/YourNetwork";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Caregivers from "./pages/Caregivers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="min-h-screen w-full pb-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/your-medicines" element={<YourMedicines />} />
                    <Route path="/dietary" element={<Dietary />} />
                    <Route path="/your-network" element={<YourNetwork />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/caregivers" element={<Caregivers />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <BottomNav />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
