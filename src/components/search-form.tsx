
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export function SearchForm() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [guests, setGuests] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (destination) {
            params.set('destination', destination);
        }
        if (checkIn) {
            params.set('from', checkIn);
        }
        if (checkOut) {
            params.set('to', checkOut);
        }
        if (guests) {
            params.set('guests', guests);
        }
        router.push(`/search?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="flex items-center border rounded-full shadow-md h-16 p-2 bg-background">
                <input
                    type="text"
                    placeholder="Search destinations"
                    className="flex-grow px-4 text-sm outline-none bg-transparent"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                />
                <div className="flex items-center">
                   <div className="border-l h-8 mx-2"></div>
                   <input
                        type="text"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.type = 'text'}
                        placeholder="Check in"
                        className="w-28 px-2 text-sm outline-none bg-transparent text-center"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                    />
                    <div className="border-l h-8 mx-2"></div>
                     <input
                        type="text"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.type = 'text'}
                        placeholder="Check out"
                        className="w-28 px-2 text-sm outline-none bg-transparent text-center"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                    />
                    <div className="border-l h-8 mx-2"></div>
                    <input
                        type="text"
                        placeholder="Add guests"
                        className="w-28 px-2 text-sm outline-none bg-transparent"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    />
                </div>
                <Button type="submit" size="icon" className="rounded-full bg-primary h-12 w-12 shrink-0">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </div>
        </form>
    );
}
