import { FileText, Download } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sampleReports = [
  { id: 1, name: "Blood Test Results", date: "2024-01-15", type: "Lab Report" },
  { id: 2, name: "X-Ray Chest", date: "2024-01-10", type: "Imaging" },
  { id: 3, name: "Annual Checkup", date: "2024-01-05", type: "General" },
];

const CheckIn = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Check-in Reports</h1>
        <p className="text-muted-foreground">View and download your medical reports</p>
      </div>

      <div className="space-y-4">
        {sampleReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <CardDescription>
                      {report.type} • {report.date}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CheckIn;
