import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there is no session and the user is trying to access a protected route
  if (!session && !req.nextUrl.pathname.startsWith("/auth")) {
    const redirectUrl = new URL("/auth/signin", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If there is a session and the user is trying to access auth routes
  if (session && req.nextUrl.pathname.startsWith("/auth")) {
    const redirectUrl = new URL("/", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
