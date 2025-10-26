import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "lucide-react";
import UpcomingAppointmentsTab from "@/components/appointments/UpcomingAppointmentsTab";
import ScheduleAppointmentTab from "@/components/appointments/ScheduleAppointmentTab";
import PastAppointmentsTab from "@/components/appointments/PastAppointmentsTab";

export default function Appointments() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          Appointments
        </h1>
        <p className="text-muted-foreground mt-2">Manage all your doctor appointments</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="schedule">Schedule New</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <UpcomingAppointmentsTab />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleAppointmentTab />
        </TabsContent>

        <TabsContent value="past">
          <PastAppointmentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
