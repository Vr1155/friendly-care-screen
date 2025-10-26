import { MapPin, Building2, Stethoscope, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import mapPlaceholder from "@/assets/network-map-placeholder.jpg";

const providers = [
  {
    id: 1,
    type: "pharmacy",
    name: "Buffalo Care Pharmacy",
    distance: "0.8 miles",
    status: "covered",
  },
  {
    id: 2,
    type: "doctor",
    name: "Dr. Sarah Lee, Primary Care",
    distance: "1.2 miles",
    status: "covered",
  },
  {
    id: 3,
    type: "pharmacy",
    name: "HealthPlus Pharmacy",
    distance: "1.5 miles",
    status: "covered",
  },
];

const YourNetwork = () => {
  return (
    <>
      <PageHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Coverage</h1>
          <p className="text-xl text-muted-foreground">
            Find nearby pharmacies and doctors covered by your insurance
          </p>
        </div>

        {/* Map Placeholder */}
        <Card className="overflow-hidden">
          <div className="relative w-full h-[400px]">
            <img
              src={mapPlaceholder}
              alt="Map showing nearby healthcare providers"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>

        {/* Nearby Providers Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Nearby Providers</h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {provider.type === "pharmacy" ? (
                        <Building2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Stethoscope className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-lg leading-tight">
                        {provider.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-base text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.distance}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {provider.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default YourNetwork;
