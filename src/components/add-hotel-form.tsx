
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
import { useToast } from "@/hooks/use-toast";
import { createHotel } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const addHotelFormSchema = z.object({
  name: z.string().min(2, {
    message: "Hotel name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

type AddHotelFormValues = z.infer<typeof addHotelFormSchema>;

const defaultValues: Partial<AddHotelFormValues> = {
  name: "",
  location: "",
  description: "",
};

export function AddHotelForm() {
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<AddHotelFormValues>({
    resolver: zodResolver(addHotelFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: AddHotelFormValues) => {
    if (!user) {
       toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to create a hotel.",
        });
        return;
    }
    try {
        await createHotel({ 
            ...data, 
            ownerId: user.id,
            ownerName: user.name,
            ownerEmail: user.email,
        });
        toast({
            title: "Hotel Submitted",
            description: "Your new hotel has been submitted for approval.",
        });
        form.reset();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Hotel</CardTitle>
        <CardDescription>Fill out the form below to submit your hotel for admin approval.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. The Grand Budapest" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Zubrowka" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about your hotel"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Approval
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
