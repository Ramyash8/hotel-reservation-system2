"use client"

import React, { useState, useTransition } from "react"
import Image from "next/image"
import type { Room, Hotel } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Users, BedDouble, Wallet, Loader2 } from "lucide-react"
import { DateRangePicker } from "./ui/date-range-picker"
import { useToast } from "@/hooks/use-toast"
import { suggestAlternativeAccommodations, SuggestAlternativeAccommodationsOutput } from "@/ai/flows/suggest-alternative-accommodations"
import { SuggestionModal } from "./suggestion-modal"

interface RoomCardProps {
  room: Room
  hotel: Hotel
}

export function RoomCard({ room, hotel }: RoomCardProps) {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [suggestions, setSuggestions] = useState<SuggestAlternativeAccommodationsOutput | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBookingAttempt = () => {
    startTransition(() => {
      // Simulate booking failure
      toast({
        variant: "destructive",
        title: "Booking Unavailable",
        description: `The '${room.title}' is not available for the selected dates. Let's find you an alternative.`,
      })

      // Trigger AI suggestion flow
      suggestAlternativeAccommodations({
        location: hotel.location,
        priceRange: `around $${room.price}/night`,
        amenities: "Similar capacity and quality",
        unavailableAccommodation: `${room.title} at ${hotel.name}`,
      }).then(result => {
        setSuggestions(result)
        setIsModalOpen(true)
      }).catch(error => {
        console.error("AI suggestion failed:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch alternative suggestions at this time.",
        })
      })
    })
  }

  return (
    <>
      <Card className="flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/3">
          <Carousel className="relative w-full h-full">
            <CarouselContent>
              {room.images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={src}
                      alt={`${room.title} view ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={(room as any)['data-ai-hint'] || 'hotel room'}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {room.images.length > 1 && (
              <>
                <CarouselPrevious className="absolute left-2" />
                <CarouselNext className="absolute right-2" />
              </>
            )}
          </Carousel>
        </div>
        <div className="w-full md:w-2/3 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">{room.title}</CardTitle>
            <CardDescription>{room.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center gap-2"><BedDouble className="w-4 h-4" /> 1 King Bed</span>
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {room.capacity} Guests</span>
              <span className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Free cancellation</span>
            </div>
            <div>
              <DateRangePicker />
            </div>
          </CardContent>
          <CardFooter className="bg-secondary/50 p-4 flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold">${room.price}</span>
              <span className="text-sm text-muted-foreground">/night</span>
            </div>
            <Button onClick={handleBookingAttempt} disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Book Now
            </Button>
          </CardFooter>
        </div>
      </Card>
      {suggestions && (
        <SuggestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          suggestions={suggestions}
        />
      )}
    </>
  )
}
