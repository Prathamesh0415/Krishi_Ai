import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function getUserFromRequest() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return null;
    }

    return {
        userId: session.user.id
    };
}