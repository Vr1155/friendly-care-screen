import { Heart } from "lucide-react";
import { Notifications } from "@/components/Notifications";
import { UserProfile } from "@/components/UserProfile";

interface PageHeaderProps {
  currentDate?: string;
}

export function PageHeader({ currentDate }: PageHeaderProps) {
  const getDate = () => {
    if (currentDate) return currentDate;
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options).toLowerCase();
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold text-foreground">MedGuard</span>
      </div>
      <p className="text-base text-muted-foreground hidden md:block">{getDate()}</p>
      <div className="flex items-center gap-3">
        <Notifications />
        <UserProfile />
      </div>
    </header>
  );
}
