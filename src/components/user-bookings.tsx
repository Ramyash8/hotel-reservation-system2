
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getBookingsByUser } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, BedDouble, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from './ui/badge';

export function UserBookings() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            setLoading(true);
            getBookingsByUser(user.id)
                .then(setBookings)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                    Please log in to see your bookings.
                </CardContent>
            </Card>
        );
    }

    if (bookings.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                    You have no bookings yet.
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden shadow-lg transition-all hover:shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-12">
                        <div className="md:col-span-4 relative h-64 md:h-auto">
                             <Image
                                src={booking.coverImage || 'https://placehold.co/600x400.png'}
                                alt={`Image of ${booking.hotelName}`}
                                layout="fill"
                                objectFit="cover"
                                className="bg-muted"
                            />
                        </div>
                        <div className="md:col-span-8 p-6 flex flex-col justify-between">
                            <div>
                                <Badge className="mb-2">{booking.status}</Badge>
                                <h2 className="text-2xl font-headline font-bold">{booking.hotelName}</h2>
                                <p className="text-lg font-semibold text-primary">{booking.roomTitle}</p>
                                <div className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                                    <MapPin className="h-4 w-4" /> {booking.hotelLocation}
                                </div>

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-semibold">Check-in</p>
                                            <p>{format(new Date(booking.fromDate as Date), 'eee, LLL dd, yyyy')}</p>
                                        </div>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="font-semibold">Check-out</p>
                                            <p>{format(new Date(booking.toDate as Date), 'eee, LLL dd, yyyy')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t flex justify-between items-end">
                                <div>
                                     <p className="text-sm text-muted-foreground">Total Price</p>
                                     <p className="text-2xl font-bold">${booking.totalPrice}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">Booking ID: {booking.id}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

