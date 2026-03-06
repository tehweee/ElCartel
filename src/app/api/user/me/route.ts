import { NextRequest, NextResponse } from "next/server";
import { supabaseAdminClient } from "../../../../lib/supabaseClient";

export async function GET(request: NextRequest) {
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

  const email = authData.user.email!;

  const { data: user, error: userError } = await supabaseAdminClient
    .from("User")
    .select("username")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (userError || !user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ email, username: user.username }, { status: 200 });
}
