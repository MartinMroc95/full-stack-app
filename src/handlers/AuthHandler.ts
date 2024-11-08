import { useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/router'

interface Props {
  children: React.ReactNode
}

export const AuthHandler: React.FC<Props> = ({ children }) => {
  const router = useRouter()
  const { user, error, isLoading } = useUser()

  useEffect(() => {
    if ((!isLoading && !user) || error) {
      void router.push('/api/auth/login')
    }
  }, [user, isLoading, error, router])

  if (isLoading) {
    return null
  }

  return children
}
