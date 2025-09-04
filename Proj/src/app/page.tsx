import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bus, User, Wrench } from "lucide-react";
import Link from "next/link";

const roles = [
  {
    name: "Student",
    href: "/student",
    icon: <User className="h-12 w-12" />,
    description: "Book shuttles, track locations, and manage your rides.",
  },
  {
    name: "Driver",
    href: "/driver",
    icon: <Bus className="h-12 w-12" />,
    description: "Manage your shuttle, track your route, and view service details.",
  },
  {
    name: "Administrator",
    href: "/admin",
    icon: <Wrench className="h-12 w-12" />,
    description: "Oversee operations, view analytics, and manage the shuttle system.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-background">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-4 mb-4">
            <Bus className="h-12 w-12 text-primary" />
            <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary">
                VIT Shuttle Connect
            </h1>
        </div>
        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your seamless campus transportation solution. Log in to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {roles.map((role) => (
          <Link href={role.href} key={role.name} className="group">
            <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary">
              <CardHeader className="flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                  {role.icon}
                </div>
                <CardTitle className="font-headline text-2xl">{role.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">{role.description}</p>
                <div className="flex items-center justify-center text-primary font-semibold">
                  <span>Continue as {role.name}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
       <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>VIT Smart Shuttle System &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}
