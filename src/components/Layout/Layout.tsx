import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import Link from 'next/link'
import { Button } from 'components/ui/button'

interface Props {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  const { user } = useUser()

  return (
    <div className="flex h-screen gap-2.5">
      <div className="z-10 flex flex-col justify-center items-center max-w-[120px] min-w-[120px] h-full px-2.5 py-7.5 rounded-r-3xl bg-amber-100">
        <div className="flex flex-col items-center space-y-1 mb-4">
          <p className="text-sm font-medium">User:</p>
          <p className="text-sm">{user?.email}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/api/auth/logout">Logout</Link>
        </Button>
      </div>
      {children}
    </div>
  )
}
