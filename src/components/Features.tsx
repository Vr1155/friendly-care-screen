import { Card } from "@/components/ui/card";
import { Shield, Clock, Heart, Brain } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced machine learning algorithms provide intelligent health insights and personalized recommendations.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Get instant health guidance anytime, anywhere. Your healthcare companion is always ready to help.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your health information is protected with enterprise-grade security and complete confidentiality.",
  },
  {
    icon: Heart,
    title: "Personalized Care",
    description: "Receive tailored health advice based on your unique needs, history, and wellness goals.",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-accent/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose MedGuard Buffalo</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combining cutting-edge AI technology with compassionate care to support your health journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-[var(--gradient-card)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 hover:scale-105 border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
