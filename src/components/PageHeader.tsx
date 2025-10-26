import { Notifications } from "@/components/Notifications";
import { UserProfile } from "@/components/UserProfile";
import medguardLogo from "@/assets/medguard-logo.jpg";

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
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <img src={medguardLogo} alt="MedGuard" className="w-10 h-10 rounded-lg object-cover" />
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
