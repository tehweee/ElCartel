import { NextRequest, NextResponse } from "next/server";
import { hash } from "@node-rs/argon2";
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

  const { email, password, username } = body as {
    email?: string;
    password?: string;
    username?: string;
  };

  if (!email || !password || !username) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  // Pre-flight duplicate check — only possible when the admin client is
  // available (service role key is set), because the anon role cannot SELECT.
  if (supabaseAdminClient) {
    const { data: existing } = await supabaseAdminClient
      .from("User")
      .select("email, username")
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1)
      .maybeSingle();

    if (existing) {
      if (existing.email === email) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 },
        );
      }
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }
  }

  // ── Create the Supabase Auth user ─────────────────────────────────────────
  // Prefer the admin API (requires SUPABASE_SERVICE_ROLE_KEY): it marks the
  // account as confirmed immediately and never sends a confirmation email,
  // which avoids the free-tier email rate limit.
  // Without the service key we fall back to auth.signUp() — in that case you
  // must disable "Confirm email" in the Supabase dashboard
  // (Authentication → Providers → Email) to prevent rate-limit errors.
  let authUserId: string;

  if (supabaseAdminClient) {
    const { data: adminData, error: adminAuthError } =
      await supabaseAdminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // no confirmation email sent
      });

    if (adminAuthError) {
      return NextResponse.json(
        { error: adminAuthError.message },
        { status: 400 },
      );
    }
    authUserId = adminData.user.id;
  } else {
    const { data: signUpData, error: signUpError } =
      await supabaseAnonClient.auth.signUp({ email, password });

    if (signUpError) {
      const msg = signUpError.message.toLowerCase().includes("rate")
        ? "Too many registrations — please wait a moment and try again, or ask the admin to set SUPABASE_SERVICE_ROLE_KEY."
        : signUpError.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (!signUpData.user) {
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 },
      );
    }
    authUserId = signUpData.user.id;
  }

  // ── Hash password and insert into User table ──────────────────────────────
  // We use the anon client here so that your RLS policy
  // (anon role → INSERT allowed) is respected.
  const hashedPassword = await hash(password, {
    algorithm: 2, // argon2id
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const { error: dbError } = await supabaseAnonClient.from("User").insert({
    email,
    username,
    password: hashedPassword,
    uuid: authUserId,
  });

  if (dbError) {
    // Rollback: delete the auth user if we have admin access
    if (supabaseAdminClient) {
      await supabaseAdminClient.auth.admin.deleteUser(authUserId);
    }
    // Surface unique-constraint violations as friendly messages
    const msg = dbError.message.includes("unique")
      ? dbError.message.toLowerCase().includes("email")
        ? "Email already in use"
        : "Username already taken"
      : dbError.message;
    return NextResponse.json({ error: msg }, { status: 409 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
