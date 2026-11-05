import { z } from "zod";

/** Validación compartida entre el formulario (cliente) y la API (servidor). */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre.").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Escribe un teléfono válido.")
    .max(25)
    .regex(/^[0-9+()\-.\s]+$/, "Usa solo números y los signos + ( ) -"),
  email: z.string().trim().email("Escribe un correo válido.").max(150),
  service: z.string().trim().min(1, "Elige un servicio.").max(100),
  message: z.string().trim().max(2000).optional().default(""),
  source: z.string().trim().max(200).optional(),
  /** Honeypot: los humanos no lo ven; si llega con texto, es un bot. */
  website: z.string().max(0).optional(),
});

/**
 * Apartado de chat (servicios de consulta): pide menos datos que el formulario.
 * Basta con nombre, teléfono y mensaje; el correo es opcional.
 * En la fase 3 este canal pasará a Supabase Realtime.
 */
export const chatSchema = leadSchema.extend({
  email: z.union([z.literal(""), z.string().trim().email("Escribe un correo válido.").max(150)]).optional().default(""),
  message: z.string().trim().min(5, "Escribe tu consulta.").max(2000),
});

export type LeadInput = z.input<typeof leadSchema>;
export type ChatInput = z.input<typeof chatSchema>;
export type LeadFieldErrors = Partial<Record<keyof LeadInput, string>>;

export const extraServiceOptions = ["Compra de propiedad", "Alquiler de propiedad", "Vender mi propiedad", "Otro"];

export type LeadChannel = "formulario" | "chat";
