import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Calendar, Users, Clock, Zap, Shield } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Global Time Zones",
      description:
        "Track time across 400+ cities worldwide with automatic daylight saving adjustments.",
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Find the perfect meeting time that works for everyone on your distributed team.",
    },
    {
      icon: Users,
      title: "Team Availability",
      description:
        "See who's online, in meetings, or sleeping at a glance with real-time status updates.",
    },
    {
      icon: Clock,
      title: "Meeting Planner",
      description:
        "Schedule meetings with timezone-aware notifications and calendar integrations.",
    },
    {
      icon: Zap,
      title: "Instant Sync",
      description:
        "Real-time updates ensure everyone stays in sync across different time zones.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description:
        "Bank-level security with SSO, 2FA, and compliance with SOC 2 and GDPR.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-black text-foreground">
            Everything You Need for
            <span className="text-primary block">Remote Collaboration</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to keep your distributed team
            synchronized and productive across any timezone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:bg-card/80 transition-colors"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
