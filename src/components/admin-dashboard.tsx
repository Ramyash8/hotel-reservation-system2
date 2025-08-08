
"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  getPendingHotels,
  getPendingRooms,
  updateHotelStatus,
  updateRoomStatus,
} from "@/lib/data";
import type { Hotel, Room } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2, Building, BedDouble, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export function AdminDashboard() {
  const [pendingHotels, setPendingHotels] = useState<Hotel[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    const [hotels, rooms] = await Promise.all([
      getPendingHotels(),
      getPendingRooms(),
    ]);
    setPendingHotels(hotels);
    setPendingRooms(rooms);
    setLoading(false);
  };


  useEffect(() => {
    loadData();
  }, []);

  const handleHotelAction = (hotelId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      await updateHotelStatus(hotelId, action === 'approve' ? 'approved' : 'rejected');
      await loadData(); // Refresh data
      toast({
        title: `Hotel ${action}d`,
        description: `The hotel has been successfully ${action}d.`,
      });
    });
  };

  const handleRoomAction = (roomId: string, action: 'approve' | 'reject') => {
     startTransition(async () => {
      await updateRoomStatus(roomId, action === 'approve' ? 'approved' : 'rejected');
      await loadData(); // Refresh data
      toast({
        title: `Room ${action}d`,
        description: `The room has been successfully ${action}d.`,
      });
    });
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <Tabs defaultValue="hotels">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="hotels">
          <Building className="mr-2 h-4 w-4" />
          Pending Hotels <Badge className="ml-2">{pendingHotels.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="rooms">
          <BedDouble className="mr-2 h-4 w-4" />
          Pending Rooms <Badge className="ml-2">{pendingRooms.length}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="hotels">
        <Card>
           <CardHeader>
                <CardTitle>Hotel Approval Queue</CardTitle>
                <CardDescription>Review and approve or reject new hotel submissions.</CardDescription>
            </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Hotel</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingHotels.length > 0 ? pendingHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Image src={hotel.coverImage} alt={hotel.name} width={100} height={60} className="rounded-md object-cover" />
                            <div>
                                <p className="font-bold">{hotel.name}</p>
                                <p className="text-xs text-muted-foreground">{hotel.description}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>{hotel.ownerName}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{hotel.ownerEmail}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="outline" className="text-green-500 hover:text-green-500 hover:bg-green-500/10 border-green-500/50" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'approve')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500 hover:text-red-500 hover:bg-red-500/10 border-red-500/50" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'reject')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No pending hotels.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="rooms">
        <Card>
            <CardHeader>
                <CardTitle>Room Approval Queue</CardTitle>
                <CardDescription>Review and approve or reject new room submissions.</CardDescription>
            </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[350px]">Room</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {pendingRooms.length > 0 ? pendingRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">
                       <div className="flex items-center gap-3">
                            <Image src={room.images[0]} alt={room.title} width={100} height={60} className="rounded-md object-cover" />
                            <div>
                                <p className="font-bold">{room.title}</p>
                                <p className="text-xs text-muted-foreground">{room.description}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>{room.hotelName}</TableCell>
                    <TableCell>${room.price}</TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button size="icon" variant="outline" className="text-green-500 hover:text-green-500 hover:bg-green-500/10 border-green-500/50" disabled={isPending} onClick={() => handleRoomAction(room.id, 'approve')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500 hover:text-red-500 hover:bg-red-500/10 border-red-500/50" disabled={isPending} onClick={() => handleRoomAction(room.id, 'reject')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                     <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No pending rooms.
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
