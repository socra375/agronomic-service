import { describe, expect, it } from "vitest";
import { chatSchema, leadSchema } from "@/lib/lead-schema";

const base = { name: "Ana Pérez", phone: "809 555 1234", service: "Mantenimiento" };

describe("formulario", () => {
  it("exige correo", () => {
    expect(leadSchema.safeParse({ ...base, email: "" }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, email: "ana@example.com" }).success).toBe(true);
  });
});

describe("chat de consultas", () => {
  it("acepta sin correo pero exige la consulta", () => {
    expect(chatSchema.safeParse({ ...base, message: "Mi césped se está secando" }).success).toBe(true);
    expect(chatSchema.safeParse({ ...base, email: "", message: "Mi césped se está secando" }).success).toBe(true);
    expect(chatSchema.safeParse({ ...base, message: "" }).success).toBe(false);
  });

  it("valida el correo si se escribe", () => {
    expect(chatSchema.safeParse({ ...base, email: "no-es-correo", message: "Consulta larga" }).success).toBe(false);
  });
});
