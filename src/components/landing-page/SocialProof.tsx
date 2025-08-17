import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function SocialProof() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Engineering Manager",
      company: "TechFlow",
      avatar: "/placeholder-user.jpg",
      content:
        "TZone Tracker transformed how our global team collaborates. No more timezone confusion or missed meetings.",
      rating: 5,
    },
    {
      name: "Marcus Chen",
      role: "Product Lead",
      company: "InnovateCorp",
      avatar: "/placeholder-user.jpg",
      content:
        "The smart scheduling feature alone saved us hours every week. Highly recommend for remote teams.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Operations Director",
      company: "GlobalTech",
      avatar: "/placeholder-user.jpg",
      content:
        "Finally, a tool that makes managing a 24/7 distributed team feel effortless and organized.",
      rating: 5,
    },
  ];

  const companies = [
    { name: "Microsoft", logo: "/placeholder-logo.svg" },
    { name: "Slack", logo: "/placeholder-logo.svg" },
    { name: "Shopify", logo: "/placeholder-logo.svg" },
    { name: "Notion", logo: "/placeholder-logo.svg" },
    { name: "Stripe", logo: "/placeholder-logo.svg" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Logos */}
        <div className="text-center mb-16">
          <p className="text-muted-foreground mb-8">
            Trusted by teams at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {companies.map((company, index) => (
              <img
                key={index}
                src={company.logo || "/placeholder.svg"}
                alt={company.name}
                className="h-8 grayscale hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-black text-foreground">
            What Teams Are Saying
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of remote teams who've streamlined their workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-card-foreground mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="border-2 border-primary/20">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
