import { useState } from "react";
import { Pill } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const medicines = [
  { name: "Atorbin", dosage: "20mg", frequency: "1/day" },
  { name: "Neurocil", dosage: "5mg", frequency: "1/night" },
  { name: "Cardiox", dosage: "50mg", frequency: "2/day" },
  { name: "Flexorin", dosage: "200mg", frequency: "as needed" },
];

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

export default function YourMedicines() {
  const [activeTab, setActiveTab] = useState("medicines");

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3 mb-2">
          <Pill className="h-10 w-10 text-primary" />
          Your Medicines
        </h1>
        <p className="text-xl text-muted-foreground">
          Extracted from your prescriptions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 h-14">
          <TabsTrigger value="medicines" className="text-lg">
            Medicines
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-lg">
            Conflicts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medicines" className="space-y-6">
          <div className="grid gap-6">
            {medicines.map((medicine, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Pill className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">
                        {medicine.name} {medicine.dosage}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {medicine.frequency}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full text-lg py-6 mt-8"
            onClick={() => setActiveTab("alerts")}
          >
            Check Conflicts
          </Button>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-destructive mb-2">
              Conflicts Detected
            </h2>
            <p className="text-lg text-muted-foreground">
              Please review these potential medication interactions
            </p>
          </div>

          <div className="space-y-6">
            {conflicts.map((conflict, index) => (
              <Alert key={index} variant="destructive" className="p-6">
                <AlertTitle className="text-2xl font-semibold mb-3">
                  {conflict.title}
                </AlertTitle>
                <AlertDescription className="text-lg mb-4">
                  {conflict.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>

          <div className="grid gap-4 mt-8">
            <Button size="lg" className="w-full text-lg py-6">
              Contact Doctor
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg py-6"
              onClick={() => setActiveTab("medicines")}
            >
              Mark as Acknowledged
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
