"use client"
import Link from "next/link"
import { Building2, User, LogOut, LogIn, UserPlus, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="mr-auto flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="font-bold font-headline text-2xl text-primary">Lodgify</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-2 rounded-full border shadow-sm px-4 py-2 text-sm font-medium">
            <Link href="/" className="px-3 py-1 rounded-full hover:bg-secondary">Stays</Link>
            <Link href="#" className="px-3 py-1 rounded-full hover:bg-secondary">Experiences</Link>
            <Link href="#" className="px-3 py-1 rounded-full hover:bg-secondary">About</Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" className="hidden md:inline-flex">Become a host</Button>
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                <Globe className="h-5 w-5"/>
            </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-full h-10">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3, overflow: 'visible'}}><g fill="none"><path d="M2 16h28M2 24h28M2 8h28"></path></g></svg>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                 {user.role === 'owner' && <DropdownMenuItem onClick={() => router.push('/owner')}>Owner Dashboard</DropdownMenuItem>}
                 {user.role === 'admin' && <DropdownMenuItem onClick={() => router.push('/admin')}>Admin Dashboard</DropdownMenuItem>}
                <DropdownMenuItem>Bookings</DropdownMenuItem>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 rounded-full h-10">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3, overflow: 'visible'}}><g fill="none"><path d="M2 16h28M2 24h28M2 8h28"></path></g></svg>
                  <Avatar className="h-8 w-8 bg-muted">
                    <User className="h-5 w-5 text-muted-foreground m-auto"/>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => router.push('/login')}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/signup')}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
