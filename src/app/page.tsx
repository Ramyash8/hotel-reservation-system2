import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HotelCard } from '@/components/hotel-card';
import { getApprovedHotels } from '@/lib/data';
import { Search, Calendar, Users, Star, MapPin, Building2, BedDouble } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

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
              Find Your Next Stay
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
              Unforgettable hotels at unbeatable prices. Your dream vacation is just a click away.
            </p>
            <Card className="mt-8 max-w-4xl mx-auto p-4 md:p-6 bg-background/80 backdrop-blur-sm border-none shadow-2xl">
              <form className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4 items-center">
                <div className="relative md:col-span-4 lg:col-span-3">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Where are you going?" className="pl-10" />
                </div>
                <div className="md:col-span-4 lg:col-span-4">
                  <DateRangePicker />
                </div>
                <div className="relative md:col-span-2 lg:col-span-2">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="number" placeholder="Guests" className="pl-10" />
                </div>
                <Button className="w-full md:col-span-2 lg:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            </Card>
          </div>
        </section>

        <section id="how-it-works" className="py-24 sm:py-32">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-center font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Booking your perfect hotel is as easy as 1, 2, 3.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <Search className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">1. Search</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Find the perfect hotel by searching for your destination and travel dates.</p>
                </CardContent>
              </Card>
              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <BedDouble className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">2. Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Select your desired room and securely complete your booking in minutes.</p>
                </CardContent>
              </Card>
              <Card className="transform hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center">
                    <Star className="h-8 w-8" />
                  </div>
                  <CardTitle className="font-headline mt-4">3. Enjoy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Pack your bags and get ready for an unforgettable stay at your chosen hotel.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="featured" className="py-24 sm:py-32 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-headline text-center font-bold tracking-tight">Featured Hotels</h2>
            <p className="mt-4 text-lg text-muted-foreground text-center max-w-2xl mx-auto">
              Handpicked hotels that promise an exceptional experience.
            </p>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHotels.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                    <HotelCard hotel={hotel} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
