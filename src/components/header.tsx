"use client"
import Link from "next/link"
import { Building2, User, LogOut, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth.tsx"
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
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">Lodgify Lite</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          {user?.role === 'owner' && <Link href="/owner" className="transition-colors hover:text-primary">Owner Dashboard</Link>}
          {user?.role === 'admin' && <Link href="/admin" className="transition-colors hover:text-primary">Admin Dashboard</Link>}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                    <User className="mr-2" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Bookings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="flex items-center gap-2">
                 <Button asChild variant="ghost">
                    <Link href="/login">
                        <LogIn />
                        Login
                    </Link>
                 </Button>
                 <Button asChild>
                    <Link href="/signup">
                        <UserPlus />
                        Sign Up
                    </Link>
                 </Button>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}
