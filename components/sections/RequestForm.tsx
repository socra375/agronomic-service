"use client";

import { CheckCircle2, Loader2, Send } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { leadSchema, type LeadFieldErrors, type LeadInput } from "@/lib/lead-schema";
import { Button } from "../ui/Button";

type Status = "idle" | "sending" | "sent" | "error";

interface Props {
  serviceOptions: string[];
  defaultService?: string;
  defaultMessage?: string;
  source?: string;
  /** "light" para fondos claros (por defecto), "card" para la ficha de propiedad. */
  compact?: boolean;
}

export function RequestForm({ serviceOptions, defaultService = "", defaultMessage = "", source, compact = false }: Props) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [formError, setFormError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const payload: LeadInput = {
      name: data.name ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      service: data.service ?? "",
      message: data.message ?? "",
      website: data.website ?? "",
      source,
    };

    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      const next: LeadFieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof LeadInput;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setFormError("");
      form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string; fieldErrors?: LeadFieldErrors };
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setFormError(json.error ?? "Algo salió mal. Inténtalo de nuevo.");
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("sent");
    } catch {
      setFormError("No hay conexión. Revisa tu internet e inténtalo de nuevo.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-center rounded-[1.5rem] bg-papel px-6 py-14 text-center ring-1 ring-arena-borde">
        <CheckCircle2 className="h-12 w-12 text-salvia" strokeWidth={1.4} aria-hidden />
        <h3 className="mt-5 text-3xl">¡Gracias! Recibimos tu solicitud</h3>
        <p className="mt-3 max-w-sm text-gris">Te contactaremos muy pronto por teléfono o correo.</p>
        <Button variant="outline" className="mt-8" onClick={() => setStatus("idle")}>
          Enviar otra solicitud
        </Button>
      </div>
    );
  }

  const field = (name: keyof LeadInput) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-error` : undefined,
  });
  const ErrorText = ({ name }: { name: keyof LeadInput }) =>
    errors[name] ? (
      <p id={`${uid}-${name}-error`} className="mt-1.5 text-sm font-semibold text-[#a63d2f]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form noValidate onSubmit={onSubmit} className={`relative rounded-[1.5rem] bg-papel ring-1 ring-arena-borde ${compact ? "p-6" : "p-6 sm:p-10"}`}>
      <div className={`grid gap-5 ${compact ? "" : "sm:grid-cols-2"}`}>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor={`${uid}-name`} className="label">
            Nombre completo
          </label>
          <input {...field("name")} type="text" autoComplete="name" className="field" placeholder="Tu nombre" required />
          <ErrorText name="name" />
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className="label">
            Teléfono
          </label>
          <input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" className="field" placeholder="809 000 0000" required />
          <ErrorText name="phone" />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className="label">
            Correo electrónico
          </label>
          <input {...field("email")} type="email" autoComplete="email" className="field" placeholder="tu@correo.com" required />
          <ErrorText name="email" />
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor={`${uid}-service`} className="label">
            Servicio de interés
          </label>
          <select {...field("service")} className="field" defaultValue={defaultService} required>
            <option value="" disabled>
              Elige una opción
            </option>
            {serviceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ErrorText name="service" />
        </div>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label htmlFor={`${uid}-message`} className="label">
            Mensaje <span className="font-normal text-gris">(opcional)</span>
          </label>
          <textarea
            {...field("message")}
            rows={compact ? 3 : 4}
            className="field resize-y"
            defaultValue={defaultMessage}
            placeholder="Cuéntanos sobre tu espacio o la propiedad que buscas"
          />
          <ErrorText name="message" />
        </div>

        {/* Honeypot: oculto para personas y lectores de pantalla */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${uid}-website`}>No llenar este campo</label>
          <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {formError && (
        <p role="alert" className="mt-5 rounded-lg bg-[#a63d2f]/10 px-4 py-3 text-sm font-semibold text-[#8a2f23]">
          {formError}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-gris">Usamos tus datos solo para responder a tu solicitud.</p>
        <Button type="submit" size="lg" variant="forest" disabled={status === "sending"} className={compact ? "w-full" : "w-full sm:w-auto"}>
          {status === "sending" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
          {status === "sending" ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </div>
    </form>
  );
}
