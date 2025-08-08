import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HotelCard } from '@/components/hotel-card';
import { getApprovedHotels } from '@/lib/data';
import { Search, Book, PartyPopper, ShieldCheck, LifeBuoy, CreditCard } from 'lucide-react';
import { SearchForm } from '@/components/search-form';

export default async function HomePage() {
  const featuredHotels = await getApprovedHotels();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-primary-foreground">
          <div className="absolute inset-0 bg-primary/40 z-10" />
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Luxury hotel lobby"
            layout="fill"
            objectFit="cover"
            className="bg-primary"
            data-ai-hint="hotel exterior luxury"
          />
          <div className="relative z-20 text-center p-4">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight drop-shadow-lg">
              Find Your Perfect Stay
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Discover the best hotels and resorts for your next adventure.
            </p>
            <SearchForm />
          </div>
        </section>

        <section id="how-it-works" className="py-24 sm:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-center font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Find and book your perfect stay in just a few simple steps.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <Search className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-headline font-bold">Search</h3>
                <p className="mt-2 text-muted-foreground">
                    Enter your destination, travel dates, and number of guests to find the perfect hotel.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <Book className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-headline font-bold">Book</h3>
                <p className="mt-2 text-muted-foreground">
                    Securely book your room and receive an instant confirmation for a hassle-free experience.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <PartyPopper className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-headline font-bold">Enjoy</h3>
                <p className="mt-2 text-muted-foreground">
                   Relax and enjoy your stay, knowing everything is taken care of.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="featured" className="py-24 sm:py-32 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-center font-bold tracking-tight">Featured Stays</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Handpicked hotels that promise an exceptional experience.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredHotels.slice(0, 4).map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                    <HotelCard hotel={hotel} />
                </Link>
              ))}
            </div>
             <div className="mt-16 text-center">
                <Button asChild size="lg">
                    <Link href="/search">View All Hotels</Link>
                </Button>
            </div>
          </div>
        </section>

        <section id="why-choose-us" className="py-24 sm:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-center font-bold tracking-tight">Why Choose Us?</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-2xl mx-auto">
                We provide the best services for our customers.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-headline font-bold">Best Price Guarantee</h3>
                <p className="mt-2 text-muted-foreground">
                    We offer the most competitive prices in the market to ensure you get the best value.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <LifeBuoy className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-headline font-bold">24/7 Support</h3>
                <p className="mt-2 text-muted-foreground">
                    Our dedicated support team is available around the clock to assist you with any queries.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <CreditCard className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-2xl font-headline font-bold">Secure Payments</h3>
                <p className="mt-2 text-muted-foreground">
                    We use a secure payment system to protect your personal and financial information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
