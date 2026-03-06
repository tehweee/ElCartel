import { NextRequest, NextResponse } from "next/server";

// Routes that require an authenticated session
const PROTECTED_PATHS = ["/profile", "/checkout", "/order"];

/**
 * Decode a JWT payload and return the `exp` claim (seconds since epoch).
 * Does NOT verify the signature — security validation is done by Supabase on
 * actual data-fetching API calls. Here we only need the expiry timestamp.
 */
function getJwtExp(token: string): number | null {
  try {
    // JWT is base64url-encoded; replace url-safe chars before atob
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("sb-access-token")?.value;
  const refreshToken = request.cookies.get("sb-refresh-token")?.value;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  // ── 1. Local JWT check (zero Supabase calls for valid tokens) ──────────────
  if (accessToken) {
    const exp = getJwtExp(accessToken);
    // Add a 60-second grace window so we refresh slightly before actual expiry,
    // which prevents race conditions on rapid multi-request page transitions.
    const stillValid = exp !== null && exp * 1000 > Date.now() + 60_000;
    if (stillValid) {
      return NextResponse.next();
    }
  }

  // ── 2. Access token expired / missing — try a silent refresh ──────────────
  if (refreshToken) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (supabaseUrl && anonKey) {
      try {
        const refreshRes = await fetch(
          `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: anonKey,
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          },
        );

        if (refreshRes.ok) {
          const data = (await refreshRes.json()) as {
            access_token: string;
            refresh_token: string;
            expires_in: number;
          };
          const isProduction = process.env.NODE_ENV === "production";
          const response = NextResponse.next();

          response.cookies.set("sb-access-token", data.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: data.expires_in,
            path: "/",
          });

          response.cookies.set("sb-refresh-token", data.refresh_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });

          return response;
        }
      } catch {
        // Network error during refresh — fall through to redirect
      }
    }
  }

  // ── 3. No valid session — guard protected routes ───────────────────────────
  if (isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     *  - _next/static  (Next.js build chunks)
     *  - _next/image   (image optimisation)
     *  - favicon.ico
     *  - /images/      (public static images)
     *  - /api/         (API routes handle their own auth)
     *
     * This means middleware runs exactly once per real page navigation,
     * not on every JS bundle or asset request — keeping Supabase calls minimal.
     */
    "/((?!_next/static|_next/image|favicon|images|api).*)",
  ],
};
