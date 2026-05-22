import { z } from "zod";

// 🔐 Reglas oficiales para Zod v4 (Flujo de Login)
export const LoginSchema = z.object({
  body: z.object({
    // 🚀 EXPLICACIÓN: Primero validamos que sea un string obligatorio con un mínimo de 1 carácter.
    // Luego, mediante .pipe(), pasamos el resultado a la función dedicada de nivel superior z.email()
    email: z
      .string()
      .min(1, "El correo electrónico es obligatorio")
      .pipe(z.email("El formato del correo electrónico no es válido")),
      
    password: z
      .string()
      .min(1, "La contraseña es obligatoria"),
  }),
});

// 📝 Reglas oficiales para Zod v4 (Flujo de Registro)
export const RegisterSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "El correo electrónico es obligatorio")
      .pipe(z.email("El formato del correo electrónico no es válido")),
      
    password: z
      .string()
      .min(6, "La contraseña de registro debe tener al menos 6 caracteres")
      .max(50, "La contraseña es demasiado larga"),
  }),
});
