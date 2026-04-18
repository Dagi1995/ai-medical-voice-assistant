import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/home/:path*",
    "/history/:path*",
    "/dashboard/:path*",
    "/admin/:path*"
  ],
};
