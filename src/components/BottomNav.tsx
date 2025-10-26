import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, Pill, Utensils, MapPin } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-[var(--shadow-soft)] z-50">
      <div className="flex justify-around items-end h-16 max-w-2xl mx-auto relative">
        <button 
          onClick={() => navigate("/appointments")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
            isActive("/appointments") ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-xs">Appointments</span>
        </button>
        <button 
          onClick={() => navigate("/your-medicines")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
            isActive("/your-medicines") ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Pill className="w-5 h-5" />
          <span className="text-xs">Meds</span>
        </button>
        <button 
          onClick={() => navigate("/")}
          className="flex flex-col items-center justify-center gap-1 -mt-6 transition-transform hover:scale-105"
        >
          <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center shadow-lg mb-1">
            <Home className="w-8 h-8 text-white" />
          </div>
          <span className="text-xs text-foreground font-medium">Home</span>
        </button>
        <button 
          onClick={() => navigate("/dietary")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
            isActive("/dietary") ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-xs">Dietary</span>
        </button>
        <button 
          onClick={() => navigate("/your-network")}
          className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
            isActive("/your-network") ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-xs">Coverage</span>
        </button>
      </div>
    </nav>
  );
}
