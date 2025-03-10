
import {cookies} from "next/headers";

import { User } from "./definitions.";
import { sealData } from "iron-session";
import { SignJWT, jwtVerify } from "jose";
const sessionPassword = process.env.AUTH_SECRET as string;
const encodedKey= new TextEncoder().encode(sessionPassword);
if(!sessionPassword) throw new Error("SESSION_PASSWORD is not set");


export async  function createSession(user: User | null) : Promise<void> { 
const expireAT= new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 1 week
const session = await encrypt({user: user|| null, expiresAt: expireAT});
(await cookies()).set('auth_session', session, {
    sameSite: 'strict',
    httpOnly: true,
    secure: true,
    expires: expireAT,
});
}
export async function deleteSession() {
    (await cookies()).delete("auth_session");
  }
type SessionPayload = {
    user: User;
    expiresAt: Date;
  } | undefined;
export async function encrypt(payload:SessionPayload) {
    return new SignJWT(payload)
    .setProtectedHeader({alg: 'HS256'})
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}
export async function decrypt(session: string | undefined = "") {
    try {
      const { payload } = await jwtVerify(session, encodedKey, {
        algorithms: ["HS256"],
      });
      return payload;
    } catch (error) {
      console.log("Failed to verify session");
    }
  }

export async function getSession() : Promise<User | null> {
    const cookie =  (await cookies()).get('auth_session')?.value;
    if (!cookie) return null;
    const session = await decrypt(cookie) as SessionPayload;
    return session?.user || null; 
    
}

export async function setSession(user: User | null) : Promise<void> {
    const cookieOptions = {
        sameSite: 'strict' as const,
        httpOnly: true,
    };
    if (user === null) {
        (await cookies()).set('auth_session', '', {
            ...cookieOptions,
            expires: new Date(0), // Set an expired date to remove the cookie
        });
        return 
    }
    const encryptedSession = await sealData(JSON.stringify(user), {
        password: sessionPassword,
    });
    
    (await cookies()).set('auth_session', encryptedSession, {
        sameSite: 'strict',
        httpOnly: true,
        // secure: true, # Uncomment this line when using HTTPS
    });
}

