import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import UpcomingAppointmentsTab from "@/components/appointments/UpcomingAppointmentsTab";
import ScheduleAppointmentTab from "@/components/appointments/ScheduleAppointmentTab";
import PastAppointmentsTab from "@/components/appointments/PastAppointmentsTab";

export default function Appointments() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    // Check if we received a doctor selection from navigation
    if (location.state?.selectedDoctor && location.state?.openScheduleTab) {
      setSelectedDoctorId(location.state.selectedDoctor.id);
      setActiveTab("schedule");
    }
  }, [location.state]);

  const handleScheduleForDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setActiveTab("schedule");
  };

  return (
    <>
      <PageHeader />
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Appointments
          </h1>
          <p className="text-muted-foreground mt-2">Manage all your doctor appointments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="schedule">Schedule New</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <UpcomingAppointmentsTab onScheduleForDoctor={handleScheduleForDoctor} />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleAppointmentTab preSelectedDoctorId={selectedDoctorId} />
          </TabsContent>

          <TabsContent value="past">
            <PastAppointmentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
