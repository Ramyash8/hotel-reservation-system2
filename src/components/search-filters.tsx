
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Wifi, ParkingSquare, UtensilsCrossed, Dumbbell, Waves, Sparkles } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

const facilityOptions = [
    { id: "wifi", label: "Free WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: ParkingSquare },
    { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "pool", label: "Swimming Pool", icon: Waves },
    { id: "spa", label: "Spa", icon: Sparkles },
]

interface SearchFiltersProps {
    searchParams: {
        destination?: string;
        facilities?: string;
    }
}

export function SearchFilters({ searchParams }: SearchFiltersProps) {
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const [destination, setDestination] = useState(searchParams.destination || '');
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>(searchParams.facilities?.split(',') || []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams(currentSearchParams.toString());
        if (destination) {
            params.set('destination', destination);
        } else {
            params.delete('destination');
        }

        if (selectedFacilities.length > 0) {
            params.set('facilities', selectedFacilities.join(','));
        } else {
            params.delete('facilities');
        }

        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                    id="destination"
                    type="text"
                    placeholder="e.g., Turkey"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
            </div>
            
            <div>
                <Label>Facilities</Label>
                <ToggleGroup
                    type="multiple"
                    variant="outline"
                    className="grid grid-cols-2 gap-2 mt-2"
                    value={selectedFacilities}
                    onValueChange={(value) => setSelectedFacilities(value)}
                >
                    {facilityOptions.map(facility => (
                        <ToggleGroupItem 
                            key={facility.id} 
                            value={facility.id} 
                            className="h-10 justify-start px-3"
                            aria-label={`Toggle ${facility.label}`}
                        >
                            <facility.icon className="mr-2 h-4 w-4" />
                            <span className="text-xs">{facility.label}</span>
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>

            <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
            </Button>
        </form>
    );
}
