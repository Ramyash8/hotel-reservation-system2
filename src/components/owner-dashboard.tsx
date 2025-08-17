
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddHotelForm } from "./add-hotel-form";
import { getHotelsByOwner, getRoomsByOwner, getBookingsByOwner } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import type { Hotel, Room, Booking } from "@/lib/types";
import { Loader2, User, Calendar, PlusCircle, Briefcase, ExternalLink } from "lucide-react";
import { HotelCard } from "./hotel-card";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";


export function OwnerDashboard() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingHotel, setIsAddingHotel] = useState(false);

  const fetchData = async () => {
    if(!user?.id) return;
    setLoading(true);
    const [ownerHotels, ownerRooms, ownerBookings] = await Promise.all([
      getHotelsByOwner(user.id),
      getRoomsByOwner(user.id),
      getBookingsByOwner(user.id)
    ]);
    setHotels(ownerHotels);
    setRooms(ownerRooms);
    setBookings(ownerBookings);
    setLoading(false);
  };
  
  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      
      // Initial fetch
      fetchData();

      // Listen for real-time booking updates
      const bookingsQuery = query(collection(db, 'bookings'), where('hotelOwnerId', '==', user.id));
      const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
        const updatedBookings = snapshot.docs.map(doc => doc.data() as Booking);
        setBookings(updatedBookings);
      });

      // You could add listeners for hotels and rooms too if needed
      // For now, we only make bookings real-time for the owner.

      return () => {
        unsubscribeBookings();
      };
    }
  }, [user?.id]);


  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  if (isAddingHotel) {
    return <AddHotelForm onFinished={() => {
      setIsAddingHotel(false);
      fetchData(); // Refresh data after adding a hotel
    }} />;
  }

  return (
    <Tabs defaultValue="dashboard">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <Briefcase className="h-10 w-10 text-primary" />
            <div>
                <h1 className="text-4xl font-headline font-bold">Owner Dashboard</h1>
                <p className="text-muted-foreground">Manage your hotels and bookings.</p>
            </div>
        </div>
         <Button onClick={() => setIsAddingHotel(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Hotel
          </Button>
      </div>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="hotels">My Hotels <Badge className="ml-2">{hotels.length}</Badge></TabsTrigger>
        <TabsTrigger value="bookings">Bookings <Badge className="ml-2">{bookings.length}</Badge></TabsTrigger>
      </TabsList>
      
      <TabsContent value="dashboard">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>Total Hotels</CardTitle>
                    <CardDescription>The total number of properties you've submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{hotels.length}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Rooms</CardTitle>
                    <CardDescription>The total number of rooms across all your hotels.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{rooms.length}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Active Bookings</CardTitle>
                    <CardDescription>Current and upcoming guest stays.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold">{bookings.length}</p>
                </CardContent>
            </Card>
        </div>
      </TabsContent>

      <TabsContent value="hotels" className="space-y-6">
        <div>
            <h2 className="text-2xl font-headline font-bold mb-4">Your Hotels</h2>
            {hotels.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map(hotel => {
                        const isApproved = hotel.status === 'approved';
                        const HotelContent = (
                            <div className="relative">
                                <HotelCard hotel={hotel} />
                                {isApproved && (
                                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ExternalLink className="h-5 w-5" />
                                    </div>
                                )}
                            </div>
                        );
                        if (isApproved) {
                            return (
                                <Link href={`/owner/hotel/${hotel.id}`} key={hotel.id} className="group">
                                    {HotelContent}
                                </Link>
                            )
                        }
                        return (
                            <div key={hotel.id} className="cursor-not-allowed">
                                {HotelContent}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                        You haven't added any hotels yet.
                    </CardContent>
                </Card>
            )}
        </div>
      </TabsContent>

      <TabsContent value="bookings">
        <Card>
            <CardHeader>
                <CardTitle>Guest Bookings</CardTitle>
                <CardDescription>A list of all reservations at your properties.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Guest</TableHead>
                            <TableHead>Hotel &amp; Room</TableHead>
                            <TableHead>Dates</TableHead>
                            <TableHead className="text-right">Total Paid</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.length > 0 ? bookings.map(booking => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{booking.userName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="font-medium">{booking.hotelName}</p>
                                    <p className="text-sm text-muted-foreground">{booking.roomTitle}</p>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {format(new Date(booking.fromDate as Date), "LLL d")} - {format(new Date(booking.toDate as Date), "LLL d, yyyy")}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-medium">${booking.totalPrice}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    You have no bookings yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
