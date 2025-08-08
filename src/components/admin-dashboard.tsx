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
import { Card, CardContent } from "@/components/ui/card";
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
import { Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdminDashboard() {
  const [pendingHotels, setPendingHotels] = useState<Hotel[]>([]);
  const [pendingRooms, setPendingRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [hotels, rooms] = await Promise.all([
        getPendingHotels(),
        getPendingRooms(),
      ]);
      setPendingHotels(hotels);
      setPendingRooms(rooms);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleHotelAction = (hotelId: string, action: 'approve' | 'reject') => {
    startTransition(async () => {
      await updateHotelStatus(hotelId, action === 'approve' ? 'approved' : 'rejected');
      setPendingHotels((prev) => prev.filter((h) => h.id !== hotelId));
      toast({
        title: `Hotel ${action}d`,
        description: `The hotel has been successfully ${action}d.`,
      });
    });
  };

  const handleRoomAction = (roomId: string, action: 'approve' | 'reject') => {
     startTransition(async () => {
      await updateRoomStatus(roomId, action === 'approve' ? 'approved' : 'rejected');
      setPendingRooms((prev) => prev.filter((r) => r.id !== roomId));
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
          Pending Hotels <Badge className="ml-2">{pendingHotels.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="rooms">
          Pending Rooms <Badge className="ml-2">{pendingRooms.length}</Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="hotels">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hotel</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingHotels.map((hotel) => (
                  <TableRow key={hotel.id}>
                    <TableCell className="font-medium">{hotel.name}</TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>{hotel.ownerId}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="outline" className="text-green-500 hover:text-green-500 hover:bg-green-500/10 border-green-500/50" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'approve')}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="text-red-500 hover:text-red-500 hover:bg-red-500/10 border-red-500/50" disabled={isPending} onClick={() => handleHotelAction(hotel.id, 'reject')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="rooms">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Title</TableHead>
                  <TableHead>Hotel ID</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {pendingRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.title}</TableCell>
                    <TableCell>{room.hotelId}</TableCell>
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
