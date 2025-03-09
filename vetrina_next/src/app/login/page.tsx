import { Suspense } from "react";
import LoginPage from "./LoginForm";

export  default async  function Page() {
    return (
        <>
        <Suspense>
        <LoginPage />
        </Suspense>
           
        </>
    )

}