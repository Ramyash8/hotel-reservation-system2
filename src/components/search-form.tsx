
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MapPin, Users, Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export function SearchForm() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [guests, setGuests] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (destination) {
            params.set('destination', destination);
        }
        if (dateRange?.from) {
            params.set('from', format(dateRange.from, 'yyyy-MM-dd'));
        }
        if (dateRange?.to) {
            params.set('to', format(dateRange.to, 'yyyy-MM-dd'));
        }
        if (guests) {
            params.set('guests', guests);
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <Card className="mt-8 max-w-4xl mx-auto p-4 md:p-6 bg-background/80 backdrop-blur-sm border-none shadow-2xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4 items-center">
                <div className="relative md:col-span-4 lg:col-span-3">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Destination"
                        className="pl-10"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                    />
                </div>
                <div className="md:col-span-4 lg:col-span-4">
                    <DateRangePicker onSelect={setDateRange} initialDateRange={dateRange}/>
                </div>
                <div className="relative md:col-span-2 lg:col-span-2">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="number"
                        placeholder="Guests"
                        className="pl-10"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full md:col-span-2 lg:col-span-1 bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </form>
        </Card>
    );
}
