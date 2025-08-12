
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserBookings } from "@/components/user-bookings";
import { BookMarked } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12 md:py-24 bg-secondary">
        <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
                <BookMarked className="h-10 w-10 text-primary" />
                <div>
                    <h1 className="text-4xl font-headline font-bold">My Bookings</h1>
                    <p className="text-muted-foreground">View your past and upcoming reservations.</p>
                </div>
            </div>
            <UserBookings />
        </div>
      </main>
      <Footer />
    </div>
  );
}
