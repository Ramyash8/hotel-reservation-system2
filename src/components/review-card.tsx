
"use client"

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

type Review = {
    id: string;
    author: string;
    country: string;
    avatar: string;
    date: string;
    rating: number;
    text: string;
    tags?: string[];
    images?: string[];
}

interface ReviewCardProps {
    review: Review;
}

const MAX_TEXT_LENGTH = 180;

export function ReviewCard({ review }: ReviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongText = review.text.length > MAX_TEXT_LENGTH;

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const displayText = isLongText && !isExpanded 
        ? `${review.text.substring(0, MAX_TEXT_LENGTH)}...` 
        : review.text;

    return (
        <div className="flex flex-col gap-4 border-b pb-8">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={review.avatar} alt={review.author} />
                    <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h4 className="font-bold">{review.author}</h4>
                    <p className="text-sm text-muted-foreground">{review.country}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground/50'}`} />
                    ))}
                </div>
                <p className="text-sm font-semibold">{review.date}</p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
                {displayText}
                {isLongText && (
                    <Button variant="link" className="p-0 h-auto ml-2" onClick={toggleExpand}>
                        {isExpanded ? 'Read less' : 'Read more'}
                    </Button>
                )}
            </p>
            
            {review.images && review.images.length > 0 && (
                <div className="flex gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <div className="flex gap-2 cursor-pointer">
                                {review.images.slice(0, 3).map((src, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                                        <Image src={src} alt={`Review image ${index + 1}`} layout="fill" objectFit="cover" className="bg-muted hover:opacity-80 transition-opacity" />
                                        {index === 2 && review.images && review.images.length > 3 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                                +{review.images.length - 3}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl h-[80vh] p-0 border-0">
                           <DialogHeader className="sr-only">
                                <DialogTitle>Review Image Gallery</DialogTitle>
                                <DialogDescription>A carousel of images attached to the review by {review.author}.</DialogDescription>
                            </DialogHeader>
                           <Carousel className="w-full h-full">
                                <CarouselContent className="h-full">
                                    {review.images.map((src, index) => (
                                        <CarouselItem key={index} className="h-full flex items-center justify-center p-4">
                                            <div className="relative h-full w-full">
                                                <Image
                                                    src={src}
                                                    alt={`Review gallery image ${index + 1}`}
                                                    layout="fill"
                                                    objectFit="contain"
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                {review.images.length > 1 && (
                                    <>
                                        <CarouselPrevious className="absolute left-4 bg-background/50 hover:bg-background" />
                                        <CarouselNext className="absolute right-4 bg-background/50 hover:bg-background" />
                                    </>
                                )}
                            </Carousel>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
}
