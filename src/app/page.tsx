
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HotelCard } from '@/components/hotel-card';
import { getApprovedHotels, getRoomsByHotelId } from '@/lib/data';
import { SearchForm } from '@/components/search-form';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  const allHotels = await getApprovedHotels();

  // Fetch prices for all hotels
  const hotelsWithPricesPromises = allHotels.map(async hotel => {
    const rooms = await getRoomsByHotelId(hotel.id);
    const cheapestRoom = rooms.reduce((min, room) => (room.price < min ? room.price : min), Infinity);
    return { ...hotel, price: rooms.length > 0 ? cheapestRoom : null };
  });

  const hotelsWithPrices = await Promise.all(hotelsWithPricesPromises);

  // Create different categories for demonstration, in a real app this would come from the database
  const popularInTurkey = hotelsWithPrices.filter(h => h.location.toLowerCase().includes('turkey')).slice(0, 6);
  const inGreece = hotelsWithPrices.filter(h => h.location.toLowerCase().includes('greece')).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <SearchForm />
          </div>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Popular homes in Turkey</h2>
              <Button variant="ghost" size="sm">Show all &gt;</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {popularInTurkey.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">Available in Greece this weekend</h2>
               <Button variant="ghost" size="sm">Show all &gt;</Button>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {inGreece.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>
          
           <section className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight">All Stays</h2>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {hotelsWithPrices.map((hotel) => (
                <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                  <HotelCard hotel={hotel} price={hotel.price ?? undefined} variant="compact" />
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
