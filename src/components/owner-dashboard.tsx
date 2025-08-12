
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddHotelForm } from "./add-hotel-form";
import { AddRoomForm } from "./add-room-form"; 
import { getHotelsByOwner, getRoomsByOwner, getBookingsByOwner } from "@/lib/data";
import { useAuth } from "@/hooks/use-auth";
import type { Hotel, Room, Booking } from "@/lib/types";
import { Loader2, User, Calendar } from "lucide-react";
import { HotelCard } from "./hotel-card";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";


export function OwnerDashboard() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
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
      fetchData();
    }
  }, [user?.id]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  const approvedHotels = hotels.filter(h => h.status === 'approved');

  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="hotels">My Hotels <Badge className="ml-2">{hotels.length}</Badge></TabsTrigger>
        <TabsTrigger value="rooms">My Rooms <Badge className="ml-2">{rooms.length}</Badge></TabsTrigger>
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
        <AddHotelForm />
        <div>
            <h2 className="text-2xl font-headline font-bold mb-4">Your Hotels</h2>
            {hotels.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map(hotel => (
                        <Link href={hotel.status === 'approved' ? `/hotel/${hotel.id}` : '#'} key={hotel.id} className={hotel.status !== 'approved' ? 'pointer-events-none' : ''}>
                            <HotelCard hotel={hotel} />
                        </Link>
                    ))}
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

      <TabsContent value="rooms" className="space-y-6">
        <AddRoomForm ownerHotels={approvedHotels} />
         <div>
            <h2 className="text-2xl font-headline font-bold mb-4">Your Rooms</h2>
             <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Room Title</TableHead>
                                <TableHead>Hotel</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.length > 0 ? rooms.map(room => (
                                <TableRow key={room.id}>
                                    <TableCell className="font-medium">{room.title}</TableCell>
                                    <TableCell>{hotels.find(h => h.id === room.hotelId)?.name || 'N/A'}</TableCell>
                                    <TableCell>${room.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={room.status === 'approved' ? 'default' : 'secondary'} className={room.status === 'approved' ? 'bg-green-600/20 text-green-600 border-green-600/20' : ''}>
                                            {room.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        You haven't added any rooms yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
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
                            <TableHead>Hotel & Room</TableHead>
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
