
"use client"

import Image from 'next/image';
import { Button } from './ui/button';
import { ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGridProps {
    images: string[];
}

export function ImageGrid({ images }: ImageGridProps) {
    if (!images || images.length === 0) {
        return (
            <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
                <p>No images available</p>
            </div>
        )
    }

    return (
        <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full">
                {/* Main Image */}
                <div className="col-span-2 row-span-2">
                    <div className="relative w-full h-full">
                        <Image
                            src={images[0]}
                            alt="Main hotel view"
                            layout="fill"
                            objectFit="cover"
                            className="bg-muted"
                        />
                    </div>
                </div>

                {/* Other Images */}
                {images.slice(1, 5).map((src, index) => (
                    <div key={index} className={cn("relative w-full h-full", index > 1 ? 'hidden md:block' : '')}>
                         <Image
                            src={src}
                            alt={`Hotel view ${index + 2}`}
                            layout="fill"
                            objectFit="cover"
                            className="bg-muted"
                        />
                    </div>
                ))}
            </div>
            <Button variant="secondary" className="absolute bottom-4 right-4">
                <ThumbsUp className="mr-2 h-4 w-4"/>
                Show all photos
            </Button>
        </div>
    );
}
