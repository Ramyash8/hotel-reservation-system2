
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';

export function SearchForm() {
    const router = useRouter();
    const [destination, setDestination] = useState('');
    const [guests, setGuests] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

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
        <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center border rounded-full shadow-lg h-auto md:h-16 p-2 bg-background">
                
                <div className="w-full md:w-auto flex-grow flex items-center p-2 rounded-full hover:bg-secondary/50 transition-colors">
                     <div className="pl-4 pr-2 w-full">
                        <label htmlFor="destination" className="block text-xs font-bold">Where</label>
                        <input
                            id="destination"
                            type="text"
                            placeholder="Search destinations"
                            className="w-full text-sm outline-none bg-transparent"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                        />
                     </div>
                </div>

                <div className="w-full md:w-auto flex items-center">
                   <div className="border-l h-8 mx-2 hidden md:block"></div>
                   
                   <Popover>
                        <PopoverTrigger asChild>
                           <button type="button" className="w-full md:w-auto flex-grow flex items-center p-2 rounded-full hover:bg-secondary/50 transition-colors text-left">
                                <div className="px-2">
                                    <p className="text-xs font-bold">Check in</p>
                                    <p className="text-sm text-muted-foreground">{dateRange?.from ? format(dateRange.from, "LLL dd") : "Add dates"}</p>
                                </div>
                           </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="border-l h-8 mx-2 hidden md:block"></div>
                    
                     <Popover>
                        <PopoverTrigger asChild>
                           <button type="button" className="w-full md:w-auto flex-grow flex items-center p-2 rounded-full hover:bg-secondary/50 transition-colors text-left">
                               <div className="px-2">
                                    <p className="text-xs font-bold">Check out</p>
                                    <p className="text-sm text-muted-foreground">{dateRange?.to ? format(dateRange.to, "LLL dd") : "Add dates"}</p>
                                </div>
                           </button>
                        </PopoverTrigger>
                         <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="border-l h-8 mx-2 hidden md:block"></div>

                    <div className="w-full md:w-auto flex items-center p-2 rounded-full hover:bg-secondary/50 transition-colors">
                        <div className="flex-grow px-2">
                             <label htmlFor="guests" className="block text-xs font-bold">Who</label>
                            <input
                                id="guests"
                                type="text"
                                placeholder="Add guests"
                                className="w-full text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="icon" className="rounded-full bg-primary h-12 w-12 shrink-0">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </div>
                </div>
                
            </div>
        </form>
    );
}
