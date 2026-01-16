import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ensure this path is correct
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  // 1. Check if user is already logged in
  const session = await getServerSession(authOptions);

  if (session) {
    // 2. Redirect to dashboard (or the page they tried to visit)
    const destination = searchParams?.callbackUrl || "/dashboard";
    redirect(destination);
  }

  // 3. Render the Client Form
  return <LoginForm />;
}