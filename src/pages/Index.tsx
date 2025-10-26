import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, AlertCircle, MessageCircle, Calendar, Pill, UserPlus, MoreVertical, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ChatInterface from "@/components/ChatInterface";
import { useToast } from "@/hooks/use-toast";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  doctor_type: string;
  contact: string;
  address: string;
  photo_url?: string;
}

interface Caregiver {
  id: string;
  first_name: string;
  last_name: string;
  relationship: string;
  contact: string;
  email?: string;
  photo_url?: string;
  is_primary: boolean;
}

const Index = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");
  const [currentDate, setCurrentDate] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [doctorForm, setDoctorForm] = useState({
    first_name: "",
    last_name: "",
    doctor_type: "",
    contact: "",
    address: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    updateDate();
    fetchDoctors();
    fetchCaregivers();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        const firstName = profile.full_name.split(" ")[0];
        setUserName(firstName);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const updateDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(now.toLocaleDateString('en-US', options));
  };

  const fetchDoctors = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchCaregivers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("caregivers")
        .select("*")
        .eq("user_id", user.id)
        .order("is_primary", { ascending: false });

      if (error) throw error;
      setCaregivers(data || []);
    } catch (error: any) {
      console.error("Error fetching caregivers:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("doctors").insert({
        ...doctorForm,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Doctor added successfully",
      });

      setIsAddDoctorOpen(false);
      setDoctorForm({
        first_name: "",
        last_name: "",
        doctor_type: "",
        contact: "",
        address: "",
      });
      fetchDoctors(); // Refresh the doctors list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleScheduleAppointment = (doctor: Doctor) => {
    navigate("/appointments", { 
      state: { 
        selectedDoctor: doctor,
        openScheduleTab: true 
      } 
    });
  };

  const handleCall = (contact: string, doctorName: string) => {
    window.location.href = `tel:${contact}`;
    toast({
      title: "Calling",
      description: `Calling ${doctorName}...`,
    });
  };

  return (
    <>
      <PageHeader currentDate={currentDate} />
      <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
        {/* Greeting Hero */}
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl font-medium text-foreground">
            {getGreeting()}, {userName}, You're taking great care of yourself today.
          </h1>
        </div>

      {/* Wellness Status Card */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Wellness Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-foreground">Feeling good!</p>
                <span className="text-4xl">😊</span>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="h-20 text-lg flex flex-col gap-2"
          onClick={() => navigate("/your-medicines")}
        >
          <AlertCircle className="w-6 h-6" />
          <span>Check Side Effects</span>
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="h-20 text-lg flex flex-col gap-2"
        >
          <Phone className="w-6 h-6" />
          <span>Call Caregiver</span>
        </Button>
      </div>

      {/* Two Column Layout for Upcoming & Caregiver */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Items Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Upcoming</h2>
          <Card className="shadow-[var(--shadow-soft)]">
            <CardContent className="p-4 space-y-3">
              <button 
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                onClick={() => navigate("/your-medicines")}
              >
                <Pill className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-base text-foreground">1:00 pm — take blood pressure pill</span>
              </button>
              <button 
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                onClick={() => navigate("/appointments")}
              >
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-base text-foreground">Monday Oct 27, 11:00 am — Dr Elephant Smith appointment</span>
              </button>
              <button 
                className="w-full text-left p-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                onClick={() => navigate("/your-medicines")}
              >
                <Pill className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-base text-foreground">Saturday — refill cholesterol meds</span>
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Caregiver Card */}
        <div className="space-y-4">
          {/* Caregiver Reassurance Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Caregiver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {caregivers.length > 0 ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={caregivers[0].photo_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {caregivers[0].first_name[0]}{caregivers[0].last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {caregivers[0].first_name} {caregivers[0].last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {caregivers[0].is_primary ? "Primary Caregiver" : caregivers[0].relationship}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    <Check className="w-4 h-4 mr-1" />
                    No alerts, everything looks good
                  </Badge>
                  <Button variant="default" className="w-full" size="lg">
                    Share this week's progress
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No caregivers added yet
                  </p>
                  <Button 
                    variant="default" 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate("/caregivers")}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Caregiver
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Your Doctors Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Your Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => (
            <Card key={doctor.id} className="shadow-[var(--shadow-soft)] relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 z-10"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem onClick={() => handleScheduleAppointment(doctor)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCall(doctor.contact, `Dr. ${doctor.first_name} ${doctor.last_name}`)}>
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={doctor.photo_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {doctor.first_name[0]}{doctor.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">Dr. {doctor.first_name} {doctor.last_name}</p>
                  <p className="text-sm text-muted-foreground">{doctor.doctor_type}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
            <DialogTrigger asChild>
              <Card className="shadow-[var(--shadow-soft)] border-dashed border-2 cursor-pointer hover:bg-accent/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3 h-full">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlus className="w-10 h-10 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Add Doctor</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddDoctor} className="space-y-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={doctorForm.first_name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, first_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={doctorForm.last_name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, last_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="doctor_type">Specialty</Label>
                  <Input
                    id="doctor_type"
                    placeholder="e.g., Cardiologist, Primary Care"
                    value={doctorForm.doctor_type}
                    onChange={(e) => setDoctorForm({ ...doctorForm, doctor_type: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    type="tel"
                    value={doctorForm.contact}
                    onChange={(e) => setDoctorForm({ ...doctorForm, contact: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={doctorForm.address}
                    onChange={(e) => setDoctorForm({ ...doctorForm, address: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Doctor
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Chat Dialog */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <ChatInterface />
        </DialogContent>
      </Dialog>

      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        size="lg"
        className="fixed bottom-24 right-8 h-16 w-16 rounded-full bg-teal-600 hover:bg-teal-700 shadow-xl z-50 animate-fade-in"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </Button>
      </div>
    </>
  );
};

export default Index;
