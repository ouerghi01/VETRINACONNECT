import { deleteSession } from "@/app/lib/sessions";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
   

    
    await deleteSession()
    return NextResponse.redirect(new URL('/login', request.url));
    

    
}
