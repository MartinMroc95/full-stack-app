import React, { useEffect, useState } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'
import { useSubscription } from 'src/context/SubscriptionContext'
import SubscriptionInfo from 'components/Subscription/SubscriptionInfo'
import { Button } from 'components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card'
import { Separator } from 'components/ui/separator'
import Invoices from './components/Invoices'

const Account = () => {
  const router = useRouter()

  const { user } = useUser()
  const { subscription, refreshSubscription } = useSubscription()

  const [isInvoicesVisible, setIsInvoicesVisible] = useState(false)

  // Handle success param from Stripe redirect
  useEffect(() => {
    if (router.query.success === 'true') {
      void refreshSubscription()
      void router.push('/account')
    }
  }, [router.query.success, refreshSubscription, router])

  return (
    <div className=" overflow-auto px-4 py-8 w-full h-full">
      <div className="space-y-8 h-full">
        <div>
          <h1 className="text-3xl font-bold mb-2">Account</h1>
          <p className="text-muted-foreground">Manage your account and subscription</p>
        </div>
        <Separator />
        <div className="flex gap-8 w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>Name:</strong> {user?.name || 'Not provided'}
                </p>
                {user?.picture && (
                  <div className="mt-4">
                    <img
                      src={user.picture}
                      alt="Profile"
                      className="w-[60px] h-[60px] rounded-full"
                    />
                  </div>
                )}
                <Button variant="outline" size="sm" asChild>
                  <a href="/api/auth/logout">Log Out</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionInfo />
              {subscription && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Billing</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setIsInvoicesVisible((prevState) => !prevState)
                    }}
                  >
                    {isInvoicesVisible ? 'Hide Invoices' : 'View Invoices'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {isInvoicesVisible && (
          <section className="w-full">
            <Invoices />
          </section>
        )}
      </div>
    </div>
  )
}

export default Account
