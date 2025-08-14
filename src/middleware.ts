import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
// import { NextRequest } from "next/server";

// export async function middleware(request: NextRequest) {
//   const response = handleI18nRouting(request);

//   // A `response` can now be passed here
//   return await updateSession(request, response);
// }

export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(vi|en|es|fr|de|zh|hi|ar|pt|ru|ja)/:path*",
    "/((?!_next|_vercel|.*\\..*).*)",
  ],
};
