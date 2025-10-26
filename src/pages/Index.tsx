import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, Pill, AlertCircle, MessageCircle, Calendar, Heart, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";

const Index = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    fetchUserProfile();
    updateDate();
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
    setCurrentDate(now.toLocaleDateString('en-US', options).toLowerCase());
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "good morning";
    if (hour < 18) return "good afternoon";
    return "good evening";
  };

  return (
    <>
      <PageHeader currentDate={currentDate} />
      <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
        {/* Greeting Hero */}
        <div className="text-center py-4">
          <h1 className="text-2xl md:text-3xl font-medium text-foreground">
            {getGreeting()}, {userName}, you're taking great care of yourself today.
          </h1>
        </div>

      {/* Key Health Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Meds today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">3 of 5 taken</p>
                <p className="text-sm text-muted-foreground mt-1">Only two pills left for the day</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Wellness status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">Feeling good</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          size="lg" 
          className="h-20 text-lg flex flex-col gap-2"
          onClick={() => navigate("/your-medicines")}
        >
          <Pill className="w-6 h-6" />
          <span>Take medication</span>
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="h-20 text-lg flex flex-col gap-2"
          onClick={() => navigate("/your-medicines")}
        >
          <AlertCircle className="w-6 h-6" />
          <span>Check side effects</span>
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="h-20 text-lg flex flex-col gap-2"
        >
          <MessageCircle className="w-6 h-6" />
          <span>Ask caregiver</span>
        </Button>
      </div>

      {/* AI Chat Preview Card */}
      <Card className="shadow-[var(--shadow-soft)] bg-accent/50 cursor-pointer hover:bg-accent/70 transition-colors" onClick={() => navigate("/")}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <p className="text-sm text-foreground">You did your morning walk — keep it up. Ask me anything...</p>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Upcoming & Caregiver/Diet */}
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

        {/* Right Column - Caregiver & Diet Cards */}
        <div className="space-y-4">
          {/* Caregiver Reassurance Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Caregiver</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">Primary Caregiver</p>
                </div>
              </div>
              <Badge variant="secondary" className="w-full justify-center py-2">
                <Check className="w-4 h-4 mr-1" />
                No alerts, everything looks good
              </Badge>
              <Button variant="default" className="w-full" size="lg">
                Share this week's progress
              </Button>
            </CardContent>
          </Card>

          {/* Diet/Nutrition Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Diet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-base text-foreground">Add a vegetable to dinner</p>
                <Badge variant="secondary">Good</Badge>
              </div>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg"
                onClick={() => navigate("/upload-prescriptions")}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload prescription
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
};

export default Index;
