import { Upload, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UploadReports = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Upload Reports</h1>
        <p className="text-muted-foreground">Upload your medical test reports and documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Upload Medical Reports
          </CardTitle>
          <CardDescription>
            Upload lab results, imaging reports, or any medical documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Input id="report-type" placeholder="e.g., Blood Test, X-Ray, MRI" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="report-date">Report Date</Label>
            <Input id="report-date" type="date" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <Input id="file-upload" type="file" className="hidden" />
              <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                Choose File
              </Button>
            </div>
          </div>
          
          <Button className="w-full" size="lg">
            <Upload className="h-4 w-4 mr-2" />
            Upload Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadReports;
