import { Button } from "@/components/ui/button";
import { ArrowRight, Globe, Users } from "lucide-react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-background flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-black text-foreground leading-tight">
                Remote Teams
                <span className="text-primary block">Made Easier</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Seamlessly coordinate across time zones with your remote team.
                Track schedules, plan meetings, and stay synchronized.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6"
                onClick={onGetStarted}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">
                  Remote Teams
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">180+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-2xl">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Team Dashboard</h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Time Zones */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">9:00 AM</div>
                    <div className="text-sm text-muted-foreground">
                      New York
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">2:00 PM</div>
                    <div className="text-sm text-muted-foreground">London</div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <Globe className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">11:30 PM</div>
                    <div className="text-sm text-muted-foreground">Mumbai</div>
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Team Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">Sarah Chen</div>
                          <div className="text-sm text-muted-foreground">
                            Available
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-secondary-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">Alex Kumar</div>
                          <div className="text-sm text-muted-foreground">
                            In Meeting
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
