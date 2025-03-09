import { redirect } from "next/navigation";
import { getSession } from "./lib/sessions";

export   default async  function Home() {
  const session= await getSession() || null;
  if (session) {
    if (session.role === 'admin') {
      redirect(`/admin/${session.id}`);
    }else{
      redirect(`/clients/${session.id}`);
  }
  }
  return (
    <div >
    </div>
  );
}
//https://dev.to/cibrax/cookie-based-authentication-for-nextjs-13-apps-4bad
//https://nextjs.org/learn/dashboard-app/adding-authentication
//https://nextjs.org/docs/pages/building-your-application/authentication
//https://authjs.dev/getting-started/installation?framework=
//https://nextjs.org/docs/app/building-your-application/routing/middleware
//https://nextjs.org/docs/app/getting-started/installation
//https://github.com/ouerghi01/RandTalkX-/tree/main_new_features/random_chat_front/src
//https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/using-prisma-migrate-typescript-postgresql
