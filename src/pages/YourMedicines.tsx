import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pill, Upload, FileText, Image as ImageIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";

const medicines = [
  { name: "Atorbin", dosage: "20mg", frequency: "1/day", tag: "cholesterol control" },
  { name: "Neurocil", dosage: "5mg", frequency: "1/night", tag: "sleep aid" },
  { name: "Cardiox", dosage: "50mg", frequency: "2/day", tag: "heart health" },
  { name: "Flexorin", dosage: "200mg", frequency: "as needed", tag: "pain relief" },
];

const filterTags = ["all", "cholesterol control", "sleep aid", "heart health", "pain relief"];

const conflicts = [
  {
    title: "Atorbin + Cardiox",
    message: "May increase heart-related risks if taken together",
  },
  {
    title: "Neurocil + Flexorin",
    message: "May cause excessive dizziness",
  },
];

const prescriptionFiles = [
  {
    filename: "prescription_oct_2025.pdf",
    type: "pdf",
    uploadDate: "Oct 20, 2025",
    fileUrl: "/prescriptions/prescription_oct_2025.pdf",
  },
  {
    filename: "rx_dr_smith_heart.png",
    type: "image",
    uploadDate: "Oct 20, 2025",
    fileUrl: "/prescriptions/rx_dr_smith_heart.png",
  },
];

export default function YourMedicines() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("medicines");
  const [previewFile, setPreviewFile] = useState<{ filename: string; type: string; fileUrl: string } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredMedicines = selectedFilter === "all" 
    ? medicines 
    : medicines.filter(medicine => medicine.tag === selectedFilter);

  return (
    <>
      <PageHeader />
      <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
            <Pill className="h-8 w-8 text-primary" />
            Medicines
          </h1>
          <p className="text-base text-muted-foreground">
            Extracted from your prescriptions
          </p>
        </div>
        
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                <Upload className="h-5 w-5 mr-2" />
                Upload Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Pill className="h-6 w-6 text-primary" />
                  Upload Prescription
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
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
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
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
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Prescription
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="medicines">
            Medicines
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            Prescriptions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medicines" className="space-y-6">
          {conflicts.length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle className="text-lg font-semibold flex items-center gap-2">
                ⚠️ {conflicts.length} Drug Interaction{conflicts.length > 1 ? 's' : ''} Detected
              </AlertTitle>
              <AlertDescription className="mt-3 space-y-3">
                {conflicts.map((conflict, index) => (
                  <div key={index} className="pb-3 last:pb-0 border-b last:border-b-0 border-destructive/20">
                    <p className="font-medium mb-1">{conflict.title}</p>
                    <p className="text-sm">{conflict.message}</p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 border-destructive/50 hover:bg-destructive/10"
                  onClick={() => {/* Contact doctor action */}}
                >
                  Contact Doctor
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-3 mb-6">
            <Label htmlFor="filter-select" className="font-medium whitespace-nowrap">
              Filter by:
            </Label>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger id="filter-select" className="w-64 bg-background">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {filterTags.map((tag) => (
                  <SelectItem key={tag} value={tag} className="capitalize cursor-pointer">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6">
            {filteredMedicines.map((medicine, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {medicine.name} {medicine.dosage}
                      </CardTitle>
                      <CardDescription className="text-base mb-2">
                        {medicine.frequency}
                      </CardDescription>
                      <Badge className="bg-yellow-500 text-black hover:bg-yellow-600 text-sm capitalize">
                        {medicine.tag}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Prescriptions
            </h2>
            <p className="text-base text-muted-foreground">
              Files uploaded from your doctor visits
            </p>
          </div>

          <div className="grid gap-6">
            {prescriptionFiles.map((file, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setPreviewFile(file)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      {file.type === "pdf" ? (
                        <FileText className="h-6 w-6 text-primary" />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {file.filename}
                      </CardTitle>
                      <CardDescription className="text-base">
                        Uploaded on {file.uploadDate}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {previewFile?.filename}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {previewFile?.type === "image" ? (
                <img 
                  src={previewFile.fileUrl} 
                  alt={previewFile.filename}
                  className="w-full h-auto rounded-lg"
                />
              ) : previewFile?.type === "pdf" ? (
                <iframe
                  src={previewFile.fileUrl}
                  className="w-full h-[600px] rounded-lg"
                  title={previewFile.filename}
                />
              ) : null}
            </div>
          </DialogContent>
        </Dialog>

      </Tabs>
      </div>
    </>
  );
}
