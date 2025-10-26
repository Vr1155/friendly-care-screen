import { Utensils, Apple, Beef, Milk, Wheat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";

const dietaryRecommendations = [
  {
    id: 1,
    category: "Fruits & Vegetables",
    icon: Apple,
    items: [
      "Leafy greens (spinach, kale)",
      "Berries (blueberries, strawberries)",
      "Citrus fruits (oranges, grapefruits)",
      "Cruciferous vegetables (broccoli, cauliflower)",
    ],
    benefits: "Rich in vitamins, minerals, and antioxidants",
  },
  {
    id: 2,
    category: "Lean Proteins",
    icon: Beef,
    items: [
      "Skinless chicken breast",
      "Fish (salmon, tuna)",
      "Legumes (beans, lentils)",
      "Tofu and tempeh",
    ],
    benefits: "Supports muscle health and provides essential amino acids",
  },
  {
    id: 3,
    category: "Dairy & Alternatives",
    icon: Milk,
    items: [
      "Low-fat milk",
      "Greek yogurt",
      "Almond or soy milk",
      "Low-fat cheese",
    ],
    benefits: "Good source of calcium and protein",
  },
  {
    id: 4,
    category: "Whole Grains",
    icon: Wheat,
    items: [
      "Brown rice",
      "Quinoa",
      "Whole wheat bread",
      "Oatmeal",
    ],
    benefits: "Provides fiber and sustained energy",
  },
];

const foodsToLimit = [
  "Processed meats",
  "Sugary beverages",
  "Deep-fried foods",
  "High-sodium snacks",
  "Refined carbohydrates",
];

const Dietary = () => {
  return (
    <>
      <PageHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Utensils className="h-10 w-10 text-primary" />
            Dietary Recommendations
          </h1>
          <p className="text-xl text-muted-foreground">
            Personalized nutrition guidance based on your health profile
          </p>
        </div>

        {/* Recommended Foods Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Recommended Foods</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {dietaryRecommendations.map((recommendation) => {
              const IconComponent = recommendation.icon;
              return (
                <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <CardTitle className="text-xl">{recommendation.category}</CardTitle>
                        <CardDescription className="text-base">
                          {recommendation.benefits}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recommendation.items.map((item, index) => (
                        <li key={index} className="text-base text-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Foods to Limit Section */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">Foods to Limit</CardTitle>
            <CardDescription className="text-base">
              These items may interfere with your medications or health goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {foodsToLimit.map((food, index) => (
                <Badge 
                  key={index} 
                  variant="destructive"
                  className="text-sm px-4 py-2"
                >
                  {food}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-base text-muted-foreground">
              <strong>Note:</strong> These recommendations are general guidelines. Please consult with your doctor or a registered dietitian for personalized dietary advice based on your specific health conditions and medications.
            </p>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default Dietary;
