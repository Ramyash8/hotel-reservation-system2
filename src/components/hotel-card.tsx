import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Hotel } from '@/lib/types';
import { MapPin, Star } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-56 w-full">
        <Image
          src={hotel.coverImage}
          alt={`Exterior of ${hotel.name}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint={(hotel as any)['data-ai-hint'] || 'hotel exterior'}
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{hotel.name}</CardTitle>
        <CardDescription className="flex items-center pt-1">
          <MapPin className="h-4 w-4 mr-1.5" />
          {hotel.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{hotel.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
         <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="font-bold">4.8</span>
            <span className="text-sm text-muted-foreground">(245 reviews)</span>
        </div>
        <Badge variant={hotel.status === 'approved' ? 'default' : 'secondary'} className={hotel.status === 'approved' ? 'bg-green-600/20 text-green-600 border-green-600/20' : ''}>
          {hotel.status}
        </Badge>
      </CardFooter>
    </Card>
  );
}
