
"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createHotel } from "@/lib/data";
import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const addHotelFormSchema = z.object({
  name: z.string().min(2, { message: "Hotel name must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  address: z.string().min(10, { message: "Full address must be at least 10 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type AddHotelFormValues = z.infer<typeof addHotelFormSchema>;

const defaultValues: Partial<AddHotelFormValues> = {
  name: "",
  location: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  website: "",
};

const steps = [
  { id: '1', name: 'Info' },
  { id: '2', name: 'Facilities' },
  { id: '3', name: 'Rooms' },
  { id: '4', name: 'Documents' },
];

export function AddHotelForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const currentStep = 1;

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
        website: data.website || '',
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
    <div>
        <h1 className="text-3xl font-bold">Add a New Hotel</h1>
        <p className="text-muted-foreground">Complete the steps below to list your property.</p>

        <Card className="mt-8">
            <CardContent className="p-6">
                 {/* Steps Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center border-2",
                                    currentStep >= parseInt(step.id) ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-secondary-foreground/20"
                                )}>
                                    {step.id}
                                </div>
                                <p className={cn("mt-2 text-sm", currentStep >= parseInt(step.id) ? 'font-semibold' : 'text-muted-foreground')}>{step.name}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={cn(
                                    "flex-1 h-0.5 mx-4",
                                    currentStep > index + 1 ? 'bg-primary' : 'bg-secondary-foreground/20'
                                )} />
                            )}
                        </React.Fragment>
                        ))}
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Hotel Name *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
                                    <FormLabel>Location (City, State) *</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                         <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Hotel Description *</FormLabel>
                                <FormControl>
                                    <Textarea className="resize-none h-24" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Full Address *</FormLabel>
                                <FormControl>
                                    <Textarea className="resize-none h-24" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Phone Number *</FormLabel>
                                    <FormControl>
                                        <Input type="tel" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email Address *</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={form.formState.isSubmitting} size="lg">
                                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save & Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
