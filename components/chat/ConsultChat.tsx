"use client";

import { Loader2, RotateCcw, Send } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { chatSchema, type ChatInput } from "@/lib/lead-schema";
import { siteConfig } from "@/lib/site-config";
import type { Service } from "@/lib/types";

/**
 * Apartado de chat para los servicios de consulta (Mantenimiento, Supervisión y
 * Asesoría Técnica).
 *
 * Fase 1: interfaz de chat; la consulta se envía a /api/solicitudes con channel "chat"
 *         y llega por correo al equipo.
 * Fase 3: el mismo componente cambiará el envío a Supabase Realtime para responder en vivo.
 */

type Message = { from: "empresa" | "cliente"; text: string };
type Step = "elegir" | "escribir" | "enviando" | "enviado";

const greeting: Message = {
  from: "empresa",
  text: "Hola, somos el equipo técnico. ¿Sobre qué servicio quieres consultarnos?",
};

export function ConsultChat({ services }: { services: Service[] }) {
  const uid = useId();
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [step, setStep] = useState<Step>("elegir");
  const [service, setService] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof ChatInput, string>>>({});
  const [sendError, setSendError] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Mantener visible el último mensaje (solo dentro del panel, sin mover la página).
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, step]);

  function chooseService(title: string) {
    setService(title);
    setMessages((m) => [
      ...m,
      { from: "cliente", text: title },
      {
        from: "empresa",
        text: "Perfecto. Cuéntanos tu consulta y déjanos tu nombre y teléfono para responderte.",
      },
    ]);
    setStep("escribir");
    setTimeout(() => messageRef.current?.focus(), 50);
  }

  function restart() {
    setMessages([greeting]);
    setService("");
    setErrors({});
    setSendError("");
    setStep("elegir");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const payload: ChatInput & { channel: "chat" } = {
      channel: "chat",
      service,
      name: data.name ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      message: data.message ?? "",
      website: data.website ?? "",
      source: `Chat de consultas: ${service}`,
    };

    const parsed = chatSchema.safeParse(payload);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) next[issue.path[0] as keyof ChatInput] ??= issue.message;
      setErrors(next);
      return;
    }

    setErrors({});
    setSendError("");
    setStep("enviando");
    setMessages((m) => [...m, { from: "cliente", text: parsed.data.message }]);

    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error);
      setMessages((m) => [
        ...m,
        {
          from: "empresa",
          text: `Gracias, ${parsed.data.name.split(" ")[0]}. Recibimos tu consulta sobre ${service.toLowerCase()} y te escribiremos al ${parsed.data.phone} en horario laboral.`,
        },
      ]);
      setStep("enviado");
    } catch (err) {
      setMessages((m) => m.slice(0, -1));
      setSendError(err instanceof Error && err.message ? err.message : "No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.");
      setStep("escribir");
    }
  }

  const fieldProps = (name: keyof ChatInput) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });
  const ErrorText = ({ name }: { name: keyof ChatInput }) =>
    errors[name] ? (
      <p id={`${uid}-${name}-error`} className="mt-1 text-xs font-semibold text-[#a63d2f]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <div className="flex h-full min-h-[34rem] flex-col overflow-hidden rounded-[1.5rem] bg-marfil text-tinta shadow-[0_40px_80px_-40px_rgb(0_0_0_/_0.6)]">
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-3 border-b border-arena-borde bg-papel px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-bosque text-dorado-claro">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M12 20V10" />
              <path d="M12 14c-4 0-6.5-3-6.5-7 4 0 6.5 3 6.5 7Z" />
              <path d="M12 12c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" />
            </svg>
          </span>
          <div>
            <p className="font-serif text-xl font-semibold leading-tight text-bosque">Equipo técnico</p>
            <p className="text-xs text-gris">Respondemos en horario laboral</p>
          </div>
        </div>
        {step !== "elegir" && (
          <button
            type="button"
            onClick={restart}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gris transition hover:bg-arena hover:text-bosque"
            aria-label="Empezar una nueva consulta"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Conversación */}
      <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-6" aria-live="polite" aria-label="Conversación">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "cliente" ? "justify-end" : "justify-start"}`}>
            <p
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed ${
                m.from === "cliente"
                  ? "rounded-br-md bg-bosque text-marfil"
                  : "rounded-bl-md bg-white text-tinta ring-1 ring-arena-borde"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}

        {step === "elegir" && (
          <div className="flex flex-wrap gap-2 pt-2" role="group" aria-label="Elige un servicio">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => chooseService(s.title)}
                className="min-h-10 rounded-full border border-bosque/30 bg-white px-4 text-sm font-bold text-bosque transition hover:border-bosque hover:bg-bosque hover:text-marfil"
              >
                {s.title}
              </button>
            ))}
          </div>
        )}

        {step === "enviando" && (
          <p className="flex items-center gap-2 text-sm text-gris">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Enviando…
          </p>
        )}

        {step === "enviado" && (
          <div className="pt-2">
            <button type="button" onClick={restart} className="text-sm font-bold text-dorado-oscuro underline-offset-4 hover:underline">
              Hacer otra consulta
            </button>
          </div>
        )}
      </div>

      {/* Redacción */}
      {(step === "escribir" || step === "enviando") && (
        <form noValidate onSubmit={onSubmit} className="relative border-t border-arena-borde bg-papel p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label htmlFor={`${uid}-name`} className="sr-only">
                Nombre
              </label>
              <input {...fieldProps("name")} autoComplete="name" placeholder="Tu nombre" className="field !min-h-11 !py-2 text-[0.9375rem]" />
              <ErrorText name="name" />
            </div>
            <div>
              <label htmlFor={`${uid}-phone`} className="sr-only">
                Teléfono
              </label>
              <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" placeholder="Teléfono" className="field !min-h-11 !py-2 text-[0.9375rem]" />
              <ErrorText name="phone" />
            </div>
          </div>
          <div className="mt-2">
            <label htmlFor={`${uid}-email`} className="sr-only">
              Correo (opcional)
            </label>
            <input {...fieldProps("email")} type="email" autoComplete="email" placeholder="Correo (opcional)" className="field !min-h-11 !py-2 text-[0.9375rem]" />
            <ErrorText name="email" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <div className="flex-1">
              <label htmlFor={`${uid}-message`} className="sr-only">
                Tu consulta
              </label>
              <textarea
                {...fieldProps("message")}
                ref={messageRef}
                rows={2}
                placeholder={`Escribe tu consulta sobre ${service.toLowerCase()}…`}
                className="field resize-none !py-2.5 text-[0.9375rem]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <ErrorText name="message" />
            </div>
            <button
              type="submit"
              disabled={step === "enviando"}
              className="mb-px flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-dorado text-noche transition hover:bg-dorado-claro disabled:opacity-60"
              aria-label="Enviar consulta"
            >
              {step === "enviando" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </div>
          {sendError && (
            <p role="alert" className="mt-2 text-sm font-semibold text-[#8a2f23]">
              {sendError}
            </p>
          )}
          {/* Honeypot */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>
        </form>
      )}

      {step === "elegir" && (
        <p className="border-t border-arena-borde bg-papel px-5 py-3 text-xs text-gris">
          ¿Prefieres llamar?{" "}
          <a href={siteConfig.contact.phoneHref} className="font-bold text-bosque hover:underline">
            {siteConfig.contact.phone}
          </a>
        </p>
      )}
    </div>
  );
}
