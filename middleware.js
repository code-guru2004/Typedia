import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export default withAuth(
  async function middleware(req) {
    // Optional: custom logic here
  },
  {
    publicPaths: ["/", "/blog", "/blog/:slug*", "/blog/*"]
  }
);

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|.*\\.(?:css|js|jpg|jpeg|png|svg|woff|woff2|ttf|eot)).*)',
  ],
};
