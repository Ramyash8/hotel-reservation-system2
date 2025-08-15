
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createRoom } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Loader2 } from "lucide-react";
import type { Hotel } from "@/lib/types";

const addRoomFormSchema = z.object({
  hotelId: z.string({ required_error: "Please select a hotel." }),
  title: z.string().min(2, {
    message: "Room title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  capacity: z.coerce.number().int().positive({ message: "Capacity must be a positive integer." }),
});

type AddRoomFormValues = z.infer<typeof addRoomFormSchema>;

interface AddRoomFormProps {
    ownerHotels: Hotel[];
    selectedHotelId?: string;
    onRoomAdded?: () => void;
}

export function AddRoomForm({ ownerHotels, selectedHotelId, onRoomAdded }: AddRoomFormProps) {
  const { toast } = useToast();
  const form = useForm<AddRoomFormValues>({
    resolver: zodResolver(addRoomFormSchema),
    defaultValues: {
        hotelId: selectedHotelId || '',
        title: '',
        description: '',
        price: 0,
        capacity: 2
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AddRoomFormValues) => {
    try {
        await createRoom(data);
        toast({
            title: "Room Submitted",
            description: "Your new room has been submitted for approval.",
        });
        form.reset({
            hotelId: selectedHotelId || '',
            title: '',
            description: '',
            price: 0,
            capacity: 2
        });
        if (onRoomAdded) {
            onRoomAdded();
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        });
    }
  };

  const hasApprovedHotels = ownerHotels.some(h => h.status === 'approved');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Room</CardTitle>
        <CardDescription>Fill out the form below to add a new room to one of your approved hotels.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="hotelId"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Hotel</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!selectedHotelId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a hotel to add the room to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ownerHotels.filter(h => h.status === 'approved').map(hotel => (
                        <SelectItem key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </SelectItem>
                      ))}
                       {!hasApprovedHotels && <p className="p-4 text-sm text-muted-foreground">You have no approved hotels.</p>}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Room Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Deluxe Queen Room" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about the room"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per night ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (guests)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting || !hasApprovedHotels}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Room for Approval
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
