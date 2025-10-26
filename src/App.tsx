import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserProfile } from "@/components/UserProfile";
import Index from "./pages/Index";
import YourDoctors from "./pages/YourDoctors";
import UpcomingAppointments from "./pages/UpcomingAppointments";
import Schedule from "./pages/Schedule";
import CheckIn from "./pages/CheckIn";
import UploadReports from "./pages/UploadReports";
import UploadPrescriptions from "./pages/UploadPrescriptions";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

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
                <SidebarProvider>
                  <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col w-full">
                      <header className="h-14 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-10">
                        <div className="flex items-center">
                          <SidebarTrigger />
                          <h2 className="ml-4 text-lg font-semibold text-foreground">MedGuard Buffalo</h2>
                        </div>
                        <UserProfile />
                      </header>
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/your-doctors" element={<YourDoctors />} />
                          <Route path="/upcoming-appointments" element={<UpcomingAppointments />} />
                          <Route path="/schedule" element={<Schedule />} />
                          <Route path="/check-in" element={<CheckIn />} />
                          <Route path="/upload-reports" element={<UploadReports />} />
                          <Route path="/upload-prescriptions" element={<UploadPrescriptions />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
