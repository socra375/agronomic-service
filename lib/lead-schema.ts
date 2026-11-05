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

export type LeadInput = z.input<typeof leadSchema>;
export type LeadFieldErrors = Partial<Record<keyof LeadInput, string>>;

export const extraServiceOptions = ["Compra de propiedad", "Alquiler de propiedad", "Vender mi propiedad", "Otro"];
