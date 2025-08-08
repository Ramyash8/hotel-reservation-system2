import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddHotelForm } from "./add-hotel-form";

export function OwnerDashboard() {
  return (
    <Tabs defaultValue="hotels">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="hotels">My Hotels <Badge className="ml-2">2</Badge></TabsTrigger>
            <TabsTrigger value="rooms">My Rooms <Badge className="ml-2">3</Badge></TabsTrigger>
            <TabsTrigger value="bookings">Bookings <Badge className="ml-2">1</Badge></TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
            <Card>
                <CardContent className="p-6">
                    <p>Dashboard summary will be here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="hotels">
             <Card>
                <CardContent className="p-6">
                    <AddHotelForm />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="rooms">
             <Card>
                <CardContent className="p-6">
                    <p>Room management interface will be here.</p>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="bookings">
             <Card>
                <CardContent className="p-6">
                    <p>Booking list will be here.</p>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  );
}