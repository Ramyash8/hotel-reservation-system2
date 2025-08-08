import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getHotelById, getRoomsByHotelId } from '@/lib/data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoomCard } from '@/components/room-card';
import { MapPin, Star } from 'lucide-react';

type HotelPageProps = {
  params: {
    id: string;
  };
};

export default async function HotelPage({ params }: HotelPageProps) {
  const hotel = await getHotelById(params.id);
  
  if (!hotel || hotel.status !== 'approved') {
    notFound();
  }

  const rooms = await getRoomsByHotelId(params.id);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="relative h-[50vh]">
          <Image
            src={hotel.coverImage}
            alt={`Cover image for ${hotel.name}`}
            layout="fill"
            objectFit="cover"
            className="bg-primary"
            data-ai-hint={(hotel as any)['data-ai-hint'] || 'hotel interior'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
        </section>
        
        <div className="container mx-auto px-4 -mt-20 relative z-10 pb-24">
            <Card className="p-6 md:p-8 shadow-2xl">
                <div className="md:flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold">{hotel.name}</h1>
                        <p className="mt-2 text-lg text-muted-foreground flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            {hotel.location}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2 shrink-0">
                         <Star className="w-6 h-6 text-accent fill-accent" />
                         <span className="text-xl font-bold">4.8</span>
                         <span className="text-md text-muted-foreground">(245 reviews)</span>
                    </div>
                </div>
                <div className="mt-6 border-t pt-6">
                    <h2 className="text-2xl font-headline font-semibold">About this hotel</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                        {hotel.description}
                    </p>
                </div>
            </Card>

            <div className="mt-16">
                 <h2 className="text-3xl font-headline font-bold">Available Rooms</h2>
                 <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {rooms.map(room => (
                        <RoomCard key={room.id} room={room} hotel={hotel} />
                    ))}
                 </div>
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
