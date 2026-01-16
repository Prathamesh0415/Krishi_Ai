import { withAuth } from "next-auth/middleware";

export default withAuth({
  // Optional: Custom logic if you want to redirect to specific pages
  pages: {
    signIn: "/login", // Redirects unauthenticated users here
  },
});

export const config = {
  // This matcher acts as a "Gatekeeper".
  // Only the paths listed here will be protected.
  // We use the ':path*' wildcard to include all sub-pages (e.g., /posts/123)
  matcher: [
    "/analysis/:path*",
    "/chat-history/:path*",
    "/dashboard/:path*",
    "/disease-predictor/:path*",
    "/krishi-mitr/:path*",
    "/my-posts/:path*",
    "/posts/:path*",
  ],
};