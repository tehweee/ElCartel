import { NextRequest, NextResponse } from "next/server";
import { verify } from "@node-rs/argon2";
import {
  supabaseAnonClient,
  supabaseAdminClient,
} from "../../../../lib/supabaseClient";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { identifier, password } = body as {
    identifier?: string;
    password?: string;
  };

  if (!identifier || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  if (!supabaseAdminClient) {
    return NextResponse.json(
      {
        error:
          "Server is not fully configured. Ask the admin to set SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 },
    );
  }

  // Determine whether the identifier is an email address or a username
  const isEmail = identifier.includes("@");

  // Server-side privileged lookup — we need the service role here because
  // the anon role only has INSERT on the User table (your RLS policy).
  const { data: user, error: lookupError } = await supabaseAdminClient
    .from("User")
    .select("email, password")
    .eq(isEmail ? "email" : "username", identifier)
    .limit(1)
    .maybeSingle();

  const invalidMsg = "Invalid credentials";
  if (lookupError || !user) {
    return NextResponse.json({ error: invalidMsg }, { status: 401 });
  }

  // Verify the submitted password against our Argon2id hash
  let passwordValid = false;
  try {
    passwordValid = await verify(user.password, password);
  } catch {
    return NextResponse.json({ error: invalidMsg }, { status: 401 });
  }

  if (!passwordValid) {
    return NextResponse.json({ error: invalidMsg }, { status: 401 });
  }

  // Sign in via Supabase Auth (anon client) to get a session token
  const { data: signInData, error: signInError } =
    await supabaseAnonClient.auth.signInWithPassword({
      email: user.email,
      password,
    });

  if (signInError || !signInData.session) {
    return NextResponse.json(
      { error: signInError?.message ?? invalidMsg },
      { status: 401 },
    );
  }

  const { access_token, refresh_token, expires_in } = signInData.session;
  const isProduction = process.env.NODE_ENV === "production";

  const response = NextResponse.json({ success: true }, { status: 200 });

  response.cookies.set("sb-access-token", access_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: expires_in,
    path: "/",
  });

  response.cookies.set("sb-refresh-token", refresh_token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}
