import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseClient";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      {
        connected: false,
        error: "Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in .env.local",
      },
      { status: 500 },
    );
  }

  const results: Record<string, unknown> = {};

  // 1. Auth health check — pass apikey header (required by this project)
  try {
    const healthResp = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    results.authHealth = {
      status: healthResp.status,
      ok: healthResp.ok,
      body: await healthResp.text(),
    };
  } catch (err) {
    results.authHealth = { error: String(err) };
  }

  // 2. SDK-level connectivity — getSession() is a lightweight call that
  //    confirms the JS client can reach Supabase Auth with the provided key
  try {
    const { data, error } = await supabase.auth.getSession();
    results.sdkAuth = {
      ok: !error,
      session: data.session ? "active" : "none",
      error: error?.message ?? null,
    };
  } catch (err) {
    results.sdkAuth = { ok: false, error: String(err) };
  }

  // 3. REST health endpoint (PostgREST)
  try {
    const restResp = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    results.restHealth = {
      status: restResp.status,
      ok: restResp.ok,
    };
  } catch (err) {
    results.restHealth = { error: String(err) };
  }

  // Primary indicator: SDK auth round-trip succeeded
  const allOk = (results.sdkAuth as { ok?: boolean })?.ok === true;

  return NextResponse.json({
    connected: allOk,
    thumbsUp: allOk
      ? "👍 Supabase is connected and healthy!"
      : "❌ Check details below",
    details: results,
  });
}
