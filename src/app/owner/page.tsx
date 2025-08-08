import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OwnerDashboard } from "@/components/owner-dashboard";
import { Briefcase } from "lucide-react";

export default function OwnerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
                <Briefcase className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-4xl font-headline font-bold">Owner Dashboard</h1>
                    <p className="text-muted-foreground">Manage your hotels and bookings.</p>
                </div>
            </div>
            <OwnerDashboard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
