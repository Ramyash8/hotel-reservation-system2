
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { HotelCard } from '@/components/hotel-card';
import { SearchForm } from '@/components/search-form';
import { getApprovedHotels, searchHotels } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { SearchIcon } from 'lucide-react';

type SearchPageProps = {
    searchParams: {
        destination?: string;
        from?: string;
        to?: string;
        guests?: string;
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const hotels = await searchHotels({
        destination: searchParams.destination,
    });

    const hasSearchParams = Object.keys(searchParams).length > 0;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-headline font-bold mb-4">Search Hotels</h1>
                    <p className="text-muted-foreground mb-8">
                        {hasSearchParams ? `Showing results for your search.` : 'Find the perfect hotel for your next trip.'}
                    </p>
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <aside className="lg:col-span-3 mb-8 lg:mb-0">
                           <Card className="p-4 sticky top-24">
                             <h3 className="text-lg font-semibold mb-4">Refine Search</h3>
                             <SearchForm />
                           </Card>
                        </aside>
                        <div className="lg:col-span-9">
                            {hotels.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {hotels.map((hotel) => (
                                        <Link href={`/hotel/${hotel.id}`} key={hotel.id}>
                                            <HotelCard hotel={hotel} />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                                        <h2 className="text-2xl font-bold mb-2">No hotels found</h2>
                                        <p className="text-muted-foreground">Try adjusting your search criteria.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

