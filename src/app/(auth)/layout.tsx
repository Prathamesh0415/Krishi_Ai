import Header1 from "@/components/mvpblocks/header-1";

import type { ReactNode } from "react";

export default function AuthLayout({children}: {children: ReactNode}) {
    return (<>
        <div>
            <Header1 />
        </div>
        <main className="">
            {children}
        </main>
        </>
    )
}