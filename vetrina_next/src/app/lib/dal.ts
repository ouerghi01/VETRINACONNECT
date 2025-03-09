import 'server-only'
 
import { cache } from 'react'
import { getSession } from './sessions'
 
export const verifySession = cache(async () => {
  const session =await  getSession()
 
  if (!session?.id) {
    return null
  }
 
  return { isAuth: true, userId: session.id ,email:session.email,role:session.role}
})