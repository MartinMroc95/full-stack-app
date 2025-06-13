import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  return (
    <div className="flex h-screen gap-2.5">
      <div className="z-10 flex flex-col  items-center max-w-[120px] min-w-[120px] h-full px-2.5 py-7.5 rounded-r-3xl bg-amber-100">
        <div className="flex flex-col gap-2 pt-4 align-items-center w-full">
          <Link className={router.pathname === '/' ? 'text-amber-500' : ''} href="/">
            Home
          </Link>
          <Link className={router.pathname === '/account' ? 'text-amber-500' : ''} href="/account">
            Account
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
