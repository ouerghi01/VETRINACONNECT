import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from './prisma_client';
import { User } from '@/app/lib/definitions.';
import { createSession, setSession } from '@/app/lib/sessions';
import { redirect } from 'next/dist/server/api-utils';


declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

export async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findFirst({
        where: { email },
        select:{
            id:true,
            name:true,
            email:true,
            password:true,
            role:{
                select:{
                    name:true
                }
            }
        }
    });
    if (!user) return null;
    const mapedUser = {
        id: user.id,
        name: user.name ?? undefined,
        email: user.email,
        role: user.role.name,
        password: user.password
    }
    return mapedUser;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { handlers, signIn, signOut, auth }= NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            await createSession(user);
            
            return user;
          }
        }
 
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        return { ...token, ...user };
    },
    async session({ session, token }) {
        //session.user = token;
        return session;
    },
},
});