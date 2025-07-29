import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getServerAuthSession } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icons } from '@/components/ui/icons'

const accountNavItems = [
  {
    title: 'Dashboard',
    href: '/account',
    icon: Icons.layoutDashboard,
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: Icons.package,
  },
  {
    title: 'Wishlist',
    href: '/account/wishlist',
    icon: Icons.heart,
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
    icon: Icons.mapPin,
  },
  {
    title: 'Payment Methods',
    href: '/account/payment-methods',
    icon: Icons.creditCard,
  },
  {
    title: 'Style Profile',
    href: '/account/style-profile',
    icon: Icons.sparkles,
  },
  {
    title: 'Reviews',
    href: '/account/reviews',
    icon: Icons.star,
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: Icons.settings,
  },
]

interface AccountLayoutProps {
  children: React.ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/login?callbackUrl=/account')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-6 pr-6 lg:py-8">
            <div className="mb-6 px-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={session.user.avatarUrl || undefined} alt={session.user.name || 'User'} />
                  <AvatarFallback>
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{session.user.name}</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                  <div className="flex items-center space-x-1">
                    <Icons.gem className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium capitalize">{session.user.membershipTier} Member</span>
                  </div>
                </div>
              </div>
            </div>
            <nav className="grid items-start gap-2">
              {accountNavItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              ))}
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                asChild
              >
                <Link href="/api/auth/signout">
                  <Icons.logOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </nav>
          </ScrollArea>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid">
          <div className="mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
