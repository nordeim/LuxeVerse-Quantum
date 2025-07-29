import { redirect } from 'next/navigation'
import { getServerAuthSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Icons } from '@/components/ui/icons'
import { formatDate } from '@/lib/utils'
import { AddPaymentMethodDialog } from '@/components/features/add-payment-method-dialog'
import { DeletePaymentMethodDialog } from '@/components/features/delete-payment-method-dialog'

async function getPaymentMethods(userId: string) {
  return await prisma.paymentMethod.findMany({
    where: { userId },
    include: {
      billingAddress: true,
    },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' },
    ],
  })
}

const cardBrandIcons = {
  visa: Icons.visa,
  mastercard: Icons.mastercard,
  amex: Icons.amex,
  discover: Icons.discover,
  diners: Icons.diners,
  jcb: Icons.jcb,
  unionpay: Icons.unionpay,
} as const

export default async function PaymentMethodsPage() {
  const session = await getServerAuthSession()
  
  if (!session) {
    redirect('/login?callbackUrl=/account/payment-methods')
  }

  const paymentMethods = await getPaymentMethods(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage your saved payment methods
          </p>
        </div>
        <AddPaymentMethodDialog />
      </div>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icons.creditCard className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No payment methods saved</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Add a payment method for faster checkout
            </p>
            <AddPaymentMethodDialog>
              <Button className="mt-6">
                <Icons.plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </AddPaymentMethodDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {paymentMethods.map((method) => {
            const BrandIcon = method.cardBrand
              ? cardBrandIcons[method.cardBrand.toLowerCase() as keyof typeof cardBrandIcons]
              : Icons.creditCard

            return (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                        <BrandIcon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          {method.cardBrand} •••• {method.cardLast4}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {method.isDefault && (
                            <Badge variant="default">Default</Badge>
                          )}
                          <Badge variant="secondary">
                            {method.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DeletePaymentMethodDialog
                      paymentMethodId={method.id}
                      isDefault={method.isDefault}
                      last4={method.cardLast4 || ''}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Expires</p>
                      <p className="font-medium">
                        {method.cardExpMonth?.toString().padStart(2, '0')}/{method.cardExpYear}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Added</p>
                      <p className="font-medium">
                        {formatDate(method.createdAt)}
                      </p>
                    </div>
                  </div>

                  {method.billingAddress && (
                    <div>
                      <p className="text-sm text-muted-foreground">Billing Address</p>
                      <address className="mt-1 text-sm not-italic">
                        <div>
                          {method.billingAddress.firstName} {method.billingAddress.lastName}
                        </div>
                        <div>{method.billingAddress.addressLine1}</div>
                        {method.billingAddress.addressLine2 && (
                          <div>{method.billingAddress.addressLine2}</div>
                        )}
                        <div>
                          {method.billingAddress.city}, {method.billingAddress.stateProvince}{' '}
                          {method.billingAddress.postalCode}
                        </div>
                      </address>
                    </div>
                  )}

                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={async () => {
                        'use server'
                        await prisma.paymentMethod.updateMany({
                          where: { userId: session.user.id },
                          data: { isDefault: false },
                        })
                        await prisma.paymentMethod.update({
                          where: { id: method.id },
                          data: { isDefault: true },
                        })
                      }}
                    >
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Security Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Icons.shield className="h-4 w-4" />
            Your Payment Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your payment information is encrypted and securely stored. We never store your full card
            number and use industry-standard security measures to protect your data.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
