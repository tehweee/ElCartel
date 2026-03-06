import { NextRequest, NextResponse } from "next/server";
import { hash, verify } from "@node-rs/argon2";
import { supabaseAdminClient } from "../../../../lib/supabaseClient";

export async function PATCH(request: NextRequest) {
  if (!supabaseAdminClient) {
    return NextResponse.json(
      { error: "Server not fully configured." },
      { status: 503 },
    );
  }

  const accessToken = request.cookies.get("sb-access-token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: authData, error: authError } =
    await supabaseAdminClient.auth.getUser(accessToken);

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const authUserId = authData.user.id;
  const email = authData.user.email!;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { username, currentPassword, newPassword } = body as {
    username?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  if (!username && !newPassword) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // ── Update username ────────────────────────────────────────────────────────
  if (username !== undefined) {
    const trimmed = username.trim();
    if (!trimmed) {
      return NextResponse.json(
        { error: "Username cannot be empty" },
        { status: 400 },
      );
    }

    // Check uniqueness (excluding current user)
    const { data: existing } = await supabaseAdminClient
      .from("User")
      .select("email")
      .eq("username", trimmed)
      .neq("email", email)
      .limit(1)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }

    const { error: updateErr } = await supabaseAdminClient
      .from("User")
      .update({ username: trimmed })
      .eq("email", email);

    if (updateErr) {
      return NextResponse.json(
        { error: "Failed to update username" },
        { status: 500 },
      );
    }
  }

  // ── Update password ────────────────────────────────────────────────────────
  if (newPassword !== undefined) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Current password is required to set a new password" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Fetch the stored hash
    const { data: userRow, error: fetchErr } = await supabaseAdminClient
      .from("User")
      .select("password")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (fetchErr || !userRow) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    let valid = false;
    try {
      valid = await verify(userRow.password, currentPassword);
    } catch {
      return NextResponse.json(
        { error: "Password verification failed" },
        { status: 500 },
      );
    }

    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 },
      );
    }

    // Hash the new password
    const hashedPassword = await hash(newPassword, {
      algorithm: 2, // argon2id
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Update in our User table
    const { error: pwUpdateErr } = await supabaseAdminClient
      .from("User")
      .update({ password: hashedPassword })
      .eq("email", email);

    if (pwUpdateErr) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 },
      );
    }

    // Also update in Supabase Auth so signInWithPassword continues to work
    const { error: authUpdateErr } =
      await supabaseAdminClient.auth.admin.updateUserById(authUserId, {
        password: newPassword,
      });

    if (authUpdateErr) {
      return NextResponse.json(
        { error: "Failed to sync auth password" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
