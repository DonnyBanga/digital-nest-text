import { cookies } from 'next/headers'
import {prisma} from './prisma'


const SESSION_COOKIE_NAME = 'session'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function createSession(userId: string) {
  const cookieStore = await cookies()
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  
  cookieStore.set(SESSION_COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  
  if (!sessionCookie) {
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: { id: parseInt(sessionCookie.value) },
    select: {
      id: true,
      email: true,
    },
  })
  
  return user
}

export async function deleteSession() {
  const cookieStore = await cookies()
  console.log(cookieStore)
  cookieStore.delete(SESSION_COOKIE_NAME)
}
