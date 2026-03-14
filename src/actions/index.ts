import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { productsLite, servicesLite } from '../data/options.js';

const cyrillicPattern = /[\u0400-\u04FF]/;

const cyrillicRefinement = (val: string, ctx: z.RefinementCtx) => {
  if (cyrillicPattern.test(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "No se permiten caracteres cirílicos.",
    });
  }
};

const noLinksPattern = /(https?:\/\/|www\.|ftp:\/\/)/i;
const noLinksRefinement = (val: string, ctx: z.RefinementCtx) => {
    if (noLinksPattern.test(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "No se permiten enlaces (URLs).",
      });
    }
};

export const server = {
  contact: defineAction({
    accept: 'form',
    input: z.object({
      nombre: z.string().min(3).max(100).regex(/^[a-zA-ZÀ-ÿ0-9 .]+$/).superRefine(cyrillicRefinement).superRefine(noLinksRefinement),
      empresa: z.string().min(3).max(100).regex(/^[a-zA-ZÀ-ÿ0-9 .,\&\\-]+$/).superRefine(cyrillicRefinement).superRefine(noLinksRefinement),
      rucDni: z.string().regex(/^[0-9]{9,11}$/),
      email: z.string().email().max(100).superRefine(cyrillicRefinement),
      telefono: z.string().regex(/^[0-9]{9,11}$/),
      ciudad: z.string().min(3).max(100).regex(/^[a-zA-ZÀ-ÿ .]+$/).superRefine(cyrillicRefinement).superRefine(noLinksRefinement),
      producto: z.string().min(1),
      mensaje: z.string().min(10).max(1200).superRefine(cyrillicRefinement).superRefine(noLinksRefinement).optional().or(z.literal('')),
      'cf-turnstile-response': z.string().min(1),
      botcheck: z.string().max(0).optional(), // Honeypot
    }),
    handler: async (input, context) => {
      const { env } = (context.locals as any).runtime || {};

      if (!env) {
          console.error("Cloudflare runtime environment not found.");
          throw new ActionError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Error de configuración del servidor.',
          });
      }

      // 1. Botcheck (Honeypot)
      if (input.botcheck) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Bot detected.',
        });
      }

      // 2. Turnstile Verification
      const turnstileSecret = env.TURNSTILE_SECRET_KEY;
      if (turnstileSecret) {
        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(input['cf-turnstile-response'])}`
        });
        const verifyData: any = await verifyResponse.json();
        if (!verifyData.success) {
            throw new ActionError({
                code: 'BAD_REQUEST',
                message: 'Verificación de seguridad fallida. Intente de nuevo.',
            });
        }
      }

      // 3. Resolve Product Name
      const allOptions = [...productsLite, ...servicesLite];
      const selectedOption = allOptions.find(opt => opt.id === input.producto);
      const productDisplayName = selectedOption ? selectedOption.name : (input.producto === 'otros' ? 'Asesoría / Otro' : input.producto);

      // 4. Send Email via Resend
      const resendApiKey = env.RESEND_API_KEY;
      const destinationEmail = env.DESTINATION_EMAIL;

      if (!resendApiKey || !destinationEmail) {
        console.error("Missing RESEND_API_KEY or DESTINATION_EMAIL");
        throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'El servicio de correo no está configurado correctamente.',
        });
      }

      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Nuevo Mensaje de Contacto (Action)</h2>
          <p><strong>Nombre:</strong> ${input.nombre}</p>
          <p><strong>Empresa:</strong> ${input.empresa}</p>
          <p><strong>RUC o DNI:</strong> ${input.rucDni}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Teléfono:</strong> ${input.telefono}</p>
          <p><strong>Ciudad:</strong> ${input.ciudad}</p>
          <p><strong>Producto de Interés:</strong> ${productDisplayName}</p>
          <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d97706; margin-top: 20px;">
            <p><strong>Mensaje:</strong></p>
            <p>${(input.mensaje || "Sin mensaje").replace(/\n/g, '<br>')}</p>
          </div>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666; text-align: center;">Enviado desde capturadoresflashkiller.com</p>
        </div>
      `.trim();

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Flash Killer Website <ventas@capturadoresflashkiller.com>',
          to: destinationEmail,
          reply_to: `${input.nombre} <${input.email}>`,
          subject: `Cotización: ${input.empresa} | ${input.nombre}`,
          html: htmlBody
        })
      });

      const resendResult: any = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error("Resend API Error:", resendResult);
        throw new ActionError({
            code: 'INTERNAL_SERVER_ERROR',
            message: resendResult.message || "Error al enviar el correo a través de Resend.",
        });
      }

      return {
        success: true,
        id: resendResult.id
      };
    }
  })
};