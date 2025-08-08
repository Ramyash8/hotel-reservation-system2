
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getHotelById, getRoomsByHotelId } from '@/lib/data';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RoomCard } from '@/components/room-card';
import { MapPin, Star, Share2, Heart } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';

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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
            {/* Header section */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold tracking-tight">{hotel.name}</h1>
                <div className="flex justify-between items-center mt-2 text-sm">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-primary" /> 4.8 (245 reviews)</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {hotel.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share</Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2"><Heart className="w-4 h-4" /> Save</Button>
                    </div>
                </div>
            </div>

            {/* Image Gallery */}
             <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl">
                <Image
                    src={hotel.coverImage}
                    alt={`Cover image for ${hotel.name}`}
                    layout="fill"
                    objectFit="cover"
                    className="bg-muted"
                    data-ai-hint={(hotel as any)['data-ai-hint'] || 'hotel interior'}
                />
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-12">
                <div className="lg:col-span-7">
                    <div className="pb-8 border-b">
                        <h2 className="text-2xl font-semibold">About this hotel</h2>
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                            {hotel.description}
                        </p>
                    </div>
                    
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold">Available Rooms</h2>
                        <div className="mt-6 grid grid-cols-1 gap-8">
                            {rooms.map(room => (
                                <RoomCard key={room.id} room={room} hotel={hotel} />
                            ))}
                        </div>
                         {rooms.length === 0 && (
                            <Card>
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    There are no available rooms for this hotel at the moment.
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>

                <aside className="lg:col-span-5 lg:sticky top-24 h-fit">
                    <Card className="p-6 shadow-xl rounded-2xl">
                        <p className="text-2xl font-bold">
                            $250 <span className="text-base font-normal text-muted-foreground">/ night</span>
                        </p>
                        <div className="mt-4">
                            <DateRangePicker />
                        </div>
                        <Button className="w-full mt-4 h-12 text-lg" size="lg">Reserve</Button>
                        <p className="text-center text-xs text-muted-foreground mt-2">You won't be charged yet</p>
                    </Card>
                </aside>
            </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
