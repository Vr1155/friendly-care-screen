import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, User, Phone, MapPin, Trash2, Calendar } from "lucide-react";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  doctor_type: string;
  address: string;
  contact: string;
  photo_url: string | null;
}

export default function YourDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    doctorType: "",
    address: "",
    contact: "",
    photo: null as File | null,
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, photo: e.target.files[0] });
    }
  };

  const uploadPhoto = async (file: File, userId: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Math.random()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("doctor-photos")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("doctor-photos")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      let photoUrl = null;
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo, user.id);
      }

      const { error } = await supabase.from("doctors").insert({
        user_id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        doctor_type: formData.doctorType,
        address: formData.address,
        contact: formData.contact,
        photo_url: photoUrl,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Doctor added successfully!",
      });

      setDialogOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        doctorType: "",
        address: "",
        contact: "",
        photo: null,
      });
      fetchDoctors();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("doctors").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Doctor deleted successfully!",
      });
      fetchDoctors();
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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Doctors</h1>
          <p className="text-muted-foreground mt-2">Manage your healthcare providers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {doctor.photo_url ? (
                    <img
                      src={doctor.photo_url}
                      alt={`${doctor.first_name} ${doctor.last_name}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      Dr. {doctor.first_name} {doctor.last_name}
                    </CardTitle>
                    <CardDescription>{doctor.doctor_type}</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doctor.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{doctor.contact}</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>{doctor.address}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate('/schedule')} 
                className="w-full"
                variant="default"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>
            </CardFooter>
          </Card>
        ))}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-center min-h-[200px]">
              <div className="text-center p-6">
                <Plus className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-lg font-medium text-foreground">Add Doctor</p>
                <p className="text-sm text-muted-foreground">Add a new healthcare provider</p>
              </div>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
              <DialogDescription>Fill in the details of your healthcare provider</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctorType">Type of Doctor</Label>
                <Input
                  id="doctorType"
                  placeholder="e.g., Cardiologist, Dentist"
                  value={formData.doctorType}
                  onChange={(e) => setFormData({ ...formData, doctorType: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Input
                  id="contact"
                  placeholder="Phone number or email"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Clinic or hospital address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="photo">Photo (Optional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? "Adding..." : "Add Doctor"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
