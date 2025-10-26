import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  notes: string | null;
  doctors: {
    first_name: string;
    last_name: string;
    doctor_type: string;
    photo_url: string | null;
  };
}

export default function UpcomingAppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          doctors (
            first_name,
            last_name,
            doctor_type,
            photo_url
          )
        `)
        .gte("appointment_date", new Date().toISOString())
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("appointments").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment cancelled successfully!",
      });
      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground">No upcoming appointments</p>
            <p className="text-sm text-muted-foreground">Schedule an appointment with your doctors</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {appointment.doctors.photo_url ? (
                      <img
                        src={appointment.doctors.photo_url}
                        alt={`${appointment.doctors.first_name} ${appointment.doctors.last_name}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-xl">
                        Dr. {appointment.doctors.first_name} {appointment.doctors.last_name}
                      </CardTitle>
                      <CardDescription>{appointment.doctors.doctor_type}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(appointment.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {format(new Date(appointment.appointment_date), "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {format(new Date(appointment.appointment_date), "h:mm a")}
                  </span>
                </div>
                {appointment.notes && (
                  <div className="mt-4 p-3 bg-secondary/20 rounded-md">
                    <p className="text-sm text-muted-foreground">
                      <strong>Notes:</strong> {appointment.notes}
                    </p>
                  </div>
                )}
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'scheduled' ? 'bg-primary/10 text-primary' :
                    appointment.status === 'completed' ? 'bg-green-500/10 text-green-700' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
