import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   

    
    console.log('Deleting session');
        // Remove session cookie by setting an expired date
    (await cookies()).delete('auth_session')
    return NextResponse.redirect(new URL('/login', request.url));
    

    
}
