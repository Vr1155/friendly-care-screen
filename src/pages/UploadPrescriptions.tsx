import { Pill, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const UploadPrescriptions = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Upload Prescriptions</h1>
        <p className="text-muted-foreground">Upload your medical prescriptions and medication records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Upload Prescription
          </CardTitle>
          <CardDescription>
            Upload prescriptions from your doctor or medical records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor-name">Doctor's Name</Label>
            <Input id="doctor-name" placeholder="Enter doctor's name" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prescription-date">Prescription Date</Label>
            <Input id="prescription-date" type="date" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medication">Medication Details</Label>
            <Textarea 
              id="medication" 
              placeholder="Enter medication names, dosage, and instructions"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prescription-file">Upload Prescription Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your prescription file here, or click to browse
              </p>
              <Input id="prescription-file" type="file" className="hidden" accept="image/*,.pdf" />
              <Button variant="outline" onClick={() => document.getElementById('prescription-file')?.click()}>
                Choose File
              </Button>
            </div>
          </div>
          
          <Button className="w-full" size="lg">
            <Upload className="h-4 w-4 mr-2" />
            Upload Prescription
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadPrescriptions;
