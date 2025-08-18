
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getBookingsByUser, cancelBooking } from '@/lib/data';
import type { Booking } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, BedDouble, Calendar, MapPin, Ban } from 'lucide-react';
import Image from 'next/image';
import { format, startOfDay, isPast } from 'date-fns';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';


export function UserBookings() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCancelling, startTransition] = useTransition();
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

    const fetchBookings = () => {
        if (user) {
            setLoading(true);
            getBookingsByUser(user.id)
                .then(b => {
                    const sortedBookings = b.sort((a,b) => {
                        const dateA = a.fromDate instanceof Timestamp ? a.fromDate.toDate() : new Date(a.fromDate);
                        const dateB = b.fromDate instanceof Timestamp ? b.fromDate.toDate() : new Date(b.fromDate);
                        return dateB.getTime() - dateA.getTime();
                    });
                    setBookings(sortedBookings);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const handleCancelBooking = async () => {
        if (!bookingToCancel) return;

        startTransition(async () => {
            try {
                await cancelBooking(bookingToCancel.id);
                toast({
                    title: "Booking Cancelled",
                    description: "Your reservation has been successfully cancelled.",
                });
                fetchBookings(); // Refresh the list
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Cancellation Failed",
                    description: (error as Error).message || "There was a problem cancelling your booking.",
                });
            } finally {
                setBookingToCancel(null);
            }
        });
    };

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
                    You have no bookings yet. Time to <Link href="/" className="text-primary underline">plan a trip</Link>!
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="space-y-8">
                {bookings.map((booking) => {
                    const fromDate = booking.fromDate instanceof Timestamp ? booking.fromDate.toDate() : new Date(booking.fromDate);
                    const toDate = booking.toDate instanceof Timestamp ? booking.toDate.toDate() : new Date(booking.toDate);
                    const isCancelled = booking.status === 'cancelled';
                    
                    const isDateInPast = isPast(startOfDay(fromDate));

                    const canCancel = !isDateInPast && !isCancelled;

                    return (
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
                                    {isCancelled && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Badge variant="destructive" className="text-lg p-2">CANCELLED</Badge></div>}
                                </div>
                                <div className="md:col-span-8 flex flex-col">
                                    <div className="p-6">
                                        <Badge variant={isCancelled ? 'destructive' : booking.status === 'confirmed' ? 'default' : 'secondary'} className="mb-2 capitalize">{booking.status}</Badge>
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
                                                    <p>{format(fromDate, 'eee, LLL dd, yyyy')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-primary" />
                                                <div>
                                                    <p className="font-semibold">Check-out</p>
                                                    <p>{format(toDate, 'eee, LLL dd, yyyy')}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <CardFooter className="mt-auto bg-secondary/30 p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Price</p>
                                            <p className="text-2xl font-bold">${booking.totalPrice}</p>
                                        </div>
                                        {canCancel ? (
                                            <Button variant="destructive" onClick={() => setBookingToCancel(booking)} disabled={isCancelling}>
                                                {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Ban className="mr-2 h-4 w-4" />}
                                                Cancel Booking
                                            </Button>
                                        ) : (
                                             <p className="text-xs text-muted-foreground">Booking ID: {booking.id}</p>
                                        )}
                                    </CardFooter>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>
            
            <AlertDialog open={!!bookingToCancel} onOpenChange={() => setBookingToCancel(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently cancel your booking
                        for <span className="font-semibold">{bookingToCancel?.hotelName}</span>. Please review the hotel's cancellation policy.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                        {isCancelling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Yes, cancel booking
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
