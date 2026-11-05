import { NextResponse } from "next/server";
import { chatSchema, leadSchema } from "@/lib/lead-schema";
import { siteConfig } from "@/lib/site-config";

/**
 * POST /api/solicitudes
 * Fase 1: valida y avisa por correo con Resend, si hay API key.
 * Fase 2: además guardará la solicitud en la tabla `leads` de Supabase.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: se responde OK para no darle pistas al bot, pero no se procesa.
  if (body && typeof body === "object" && "website" in body && (body as { website?: unknown }).website) {
    return NextResponse.json({ ok: true });
  }

  const isChat = Boolean(body && typeof body === "object" && (body as { channel?: unknown }).channel === "chat");
  const parsed = (isChat ? chatSchema : leadSchema).safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json({ ok: false, error: "Revisa los campos marcados.", fieldErrors }, { status: 400 });
  }

  const { website: _honeypot, ...lead } = parsed.data;
  void _honeypot;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[solicitudes] Nueva ${isChat ? "consulta por chat" : "solicitud"} (sin RESEND_API_KEY, no se envió correo):`, lead);
    return NextResponse.json({ ok: true });
  }

  const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
  const rows: [string, string][] = [
    ["Nombre", lead.name],
    ["Teléfono", lead.phone],
    ["Canal", isChat ? "Chat de consultas" : "Formulario"],
    ["Correo", lead.email || "—"],
    ["Servicio", lead.service],
    ["Mensaje", lead.message || "—"],
    ["Origen", lead.source || "Sitio web"],
  ];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.LEADS_NOTIFY_FROM ?? "Agronómic Services <onboarding@resend.dev>",
        to: (process.env.LEADS_NOTIFY_TO ?? siteConfig.contact.email).split(",").map((s) => s.trim()),
        ...(lead.email ? { reply_to: lead.email } : {}),
        subject: `${isChat ? "Nueva consulta por chat" : "Nueva solicitud"}: ${lead.service} · ${lead.name}`,
        html: `<h2 style="font-family:Georgia,serif;color:#1F3A2B">Nueva solicitud desde el sitio web</h2>
<table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;color:#3F5448">
${rows.map(([k, v]) => `<tr><td style="font-weight:bold;border-bottom:1px solid #ECE6D4">${k}</td><td style="border-bottom:1px solid #ECE6D4">${escape(v).replace(/\n/g, "<br>")}</td></tr>`).join("")}
</table>`,
      }),
    });
    if (!res.ok) {
      console.error("[solicitudes] Resend respondió", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "No pudimos enviar tu solicitud. Inténtalo de nuevo o llámanos." }, { status: 502 });
    }
  } catch (err) {
    console.error("[solicitudes] Error al enviar el correo", err);
    return NextResponse.json({ ok: false, error: "No pudimos enviar tu solicitud. Inténtalo de nuevo o llámanos." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
