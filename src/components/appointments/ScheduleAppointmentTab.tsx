import { Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ScheduleAppointmentTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Appointment Details
        </CardTitle>
        <CardDescription>Fill in the details to schedule your appointment</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="doctor">Select Doctor</Label>
          <Input id="doctor" placeholder="Choose your doctor" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Preferred Date</Label>
          <Input id="date" type="date" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Preferred Time</Label>
          <Input id="time" type="time" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Visit</Label>
          <Input id="reason" placeholder="Brief description" />
        </div>
        
        <Button className="w-full" size="lg">
          Schedule Appointment
        </Button>
      </CardContent>
    </Card>
  );
}
