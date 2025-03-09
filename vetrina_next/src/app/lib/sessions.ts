
import {cookies} from "next/headers";
import { User } from "./definitions.";
import { sealData, unsealData } from "iron-session";

const sessionPassword = process.env.AUTH_SECRET as string;
if(!sessionPassword) throw new Error("SESSION_PASSWORD is not set");


export async function getSession() : Promise<User | null> {
    const encryptedSession =  (await cookies()).get('auth_session')?.value;

    const session = encryptedSession
        ? await unsealData(encryptedSession, {
            password: sessionPassword,
        }) as string
        : null;
    return session ? JSON.parse(session) as User : null;
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

