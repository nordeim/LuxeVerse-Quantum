import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { AddAddressDialog } from '@/components/features/add-address-dialog'
import { EditAddressDialog } from '@/components/features/edit-address-dialog'
import { DeleteAddressDialog } from '@/components/features/delete-address-dialog'

async function getAddresses(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

export default async function AddressesPage() {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect('/login?callbackUrl=/account/addresses')
  }

  const addresses = await getAddresses(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses
          </p>
        </div>
        <AddAddressDialog />
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icons.mapPin className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No addresses saved</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Add an address to speed up checkout
            </p>
            <AddAddressDialog>
              <Button className="mt-6">
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </AddAddressDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base">
                      {address.firstName} {address.lastName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="capitalize">
                        {address.type}
                      </Badge>
                      {address.isDefault && (
                        <Badge variant="default">Default</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditAddressDialog address={address} />
                    <DeleteAddressDialog
                      addressId={address.id}
                      isDefault={address.isDefault}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <address className="text-sm not-italic text-muted-foreground">
                  {address.company && <div>{address.company}</div>}
                  <div>{address.addressLine1}</div>
                  {address.addressLine2 && <div>{address.addressLine2}</div>}
                  <div>
                    {address.city}, {address.stateProvince} {address.postalCode}
                  </div>
                  <div>{address.countryCode}</div>
                  {address.phone && (
                    <div className="mt-2">
                      <Icons.phone className="mr-1 inline h-3 w-3" />
                      {address.phone}
                    </div>
                  )}
                </address>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={async () => {
                      'use server'
                      await prisma.address.updateMany({
                        where: { userId: session.user.id },
                        data: { isDefault: false },
                      })
                      await prisma.address.update({
                        where: { id: address.id },
                        data: { isDefault: true },
                      })
                    }}
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
