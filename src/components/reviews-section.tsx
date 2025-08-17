
"use client"

import React, { useState } from 'react';
import { ReviewSummary } from './review-summary';
import { ReviewCard } from './review-card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search } from 'lucide-react';

const mockReviews = [
  {
    id: '1',
    author: 'Emily',
    country: 'USA',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    date: 'March 2024',
    rating: 5,
    text: 'This was an absolutely amazing stay. The views were breathtaking and the service was top-notch. Highly recommend for a peaceful and luxurious getaway. The infinity pool is a must-see!',
    tags: ['Great service', 'Clean rooms'],
    images: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png']
  },
  {
    id: '2',
    author: 'John',
    country: 'Canada',
    avatar: 'https://i.pravatar.cc/150?u=john',
    date: 'February 2024',
    rating: 4,
    text: 'Very good hotel. The location is perfect for exploring the city. The room was clean and comfortable. Breakfast could have had more options, but overall a great experience.',
    tags: ['Good location']
  },
  {
    id: '3',
    author: 'Maria',
    country: 'Spain',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    date: 'January 2024',
    rating: 5,
    text: '¡Fantástico! El personal fue increíblemente amable y servicial. La habitación tenía una vista espectacular y todo estaba impecable. Volveremos sin duda.',
    tags: ['Great service'],
    images: ['https://placehold.co/600x400.png']
  },
  {
    id: '4',
    author: 'Kenji',
    country: 'Japan',
    avatar: 'https://i.pravatar.cc/150?u=kenji',
    date: 'December 2023',
    rating: 4,
    text: 'A very pleasant stay. The architecture of the hotel is beautiful. The staff helped us with all our requests. The gym was a bit small.',
    tags: []
  },
    {
    id: '5',
    author: 'Chloe',
    country: 'France',
    avatar: 'https://i.pravatar.cc/150?u=chloe',
    date: 'November 2023',
    rating: 5,
    text: 'Un séjour parfait. L\'hôtel est magnifique et le service est irréprochable. La vue depuis la chambre était incroyable. Je recommande vivement cet endroit.',
    tags: ['Great service'],
  },
  {
    id: '6',
    author: 'David',
    country: 'UK',
    avatar: 'https://i.pravatar.cc/150?u=david',
    date: 'October 2023',
    rating: 3,
    text: "It was an okay stay. The location was convenient, but the room was smaller than expected and a bit noisy. The staff were friendly, but service was slow at the restaurant.",
    tags: ["Good location"],
  },
];

const ratingDistribution = [
  { star: 5, count: 123 },
  { star: 4, count: 45 },
  { star: 3, count: 12 },
  { star: 2, count: 5 },
  { star: 1, count: 2 },
];


export function ReviewsSection() {
    const [visibleReviews, setVisibleReviews] = useState(4);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReviews = mockReviews.filter(review => 
        review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const loadMoreReviews = () => {
        setVisibleReviews(prev => prev + 4);
    }
    
    return (
        <div>
            <ReviewSummary reviews={mockReviews} distribution={ratingDistribution} />
            
            <div className="my-8">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search reviews" 
                        className="pl-10 max-w-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {filteredReviews.slice(0, visibleReviews).map(review => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
            
            {visibleReviews < filteredReviews.length && (
                 <div className="mt-8">
                    <Button variant="outline" onClick={loadMoreReviews}>
                        Show all {filteredReviews.length} reviews
                    </Button>
                </div>
            )}
        </div>
    )
}
