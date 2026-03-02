export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 1. Defense in Depth: Origin Validation
    const origin = request.headers.get("Origin");
    const allowedOrigins = [
        "https://capturadoresflashkiller.com",
        "https://flash-killer-website.pages.dev"
    ];
    
    // Allow localhost for development, otherwise restrict to production domains
    if (origin && !origin.includes("localhost") && !origin.includes("127.0.0.1")) {
        if (!allowedOrigins.includes(origin)) {
            return new Response(JSON.stringify({ success: false, error: "Origen no permitido." }), { status: 403 });
        }
    }

    // 2. Parse incoming data
    const contentType = request.headers.get("content-type") || "";
    let data = {};
    
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // 3. Strict Server-side validation
    const errors = {};
    const nombrePattern = /^[a-zA-ZÀ-ÿ0-9 .]{3,100}$/;
    const empresaPattern = /^[a-zA-ZÀ-ÿ0-9 .,\\&\\-]{3,100}$/;
    const telefonoPattern = /^[\d\+\-\s]{9,15}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const ciudadPattern = /^[a-zA-ZÀ-ÿ .]{3,100}$/;

    if (!data.nombre || !nombrePattern.test(data.nombre)) errors.nombre = "Nombre inválido (3-100 caracteres).";
    if (!data.empresa || !empresaPattern.test(data.empresa)) errors.empresa = "Empresa inválida (3-100 caracteres).";
    if (!data.email || !emailPattern.test(data.email) || data.email.length > 100) errors.email = "Email inválido.";
    if (!data.telefono || !telefonoPattern.test(data.telefono)) errors.telefono = "Teléfono inválido.";
    if (!data.ciudad || !ciudadPattern.test(data.ciudad)) errors.ciudad = "Ciudad inválida.";
    if (!data.producto) errors.producto = "Producto no seleccionado.";
    if (data.mensaje && data.mensaje.length > 2000) errors.mensaje = "Mensaje demasiado largo (máx 2000 caracteres).";
    if (data.botcheck) errors.botcheck = "Bot detected.";

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ success: false, error: "Datos inválidos.", details: errors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. Turnstile Verification
    const turnstileToken = data['cf-turnstile-response'];
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    
    // We only skip Turnstile if we are in local simulation (Wrangler) 
    // AND the secret is missing, to avoid blocking local dev.
    if (turnstileSecret && turnstileToken) {
        const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${encodeURIComponent(turnstileSecret)}&response=${encodeURIComponent(turnstileToken)}`
        });
        const verifyData = await verifyResponse.json();
        if (!verifyData.success) {
            return new Response(JSON.stringify({ success: false, error: "Verificación de seguridad fallida. Intente de nuevo." }), { status: 403 });
        }
    } else if (!turnstileToken) {
        return new Response(JSON.stringify({ success: false, error: "Token de seguridad faltante." }), { status: 400 });
    }

    // 5. Environment Validation for Resend
    const resendApiKey = env.RESEND_API_KEY;
    const destinationEmail = env.DESTINATION_EMAIL;
    
    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY");
      throw new Error("El servicio de correo no está configurado (API Key faltante).");
    }
    
    if (!destinationEmail) {
      console.error("Missing DESTINATION_EMAIL");
      throw new Error("El servicio de correo no está configurado (Destinatario faltante).");
    }

    // 6. Construct Email Content
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #d97706; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Nuevo Mensaje de Contacto</h2>
        <p><strong>Nombre:</strong> ${data.nombre}</p>
        <p><strong>Empresa:</strong> ${data.empresa}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Ciudad:</strong> ${data.ciudad}</p>
        <p><strong>Producto de Interés:</strong> ${data.producto}</p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #d97706; margin-top: 20px;">
          <p><strong>Mensaje:</strong></p>
          <p>${(data.mensaje || "Sin mensaje").replace(/\n/g, '<br>')}</p>
        </div>
        <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666; text-align: center;">Enviado desde capturadoresflashkiller.com</p>
      </div>
    `.trim();

    // 7. Send Email via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Flash Killer Website <ventas@capturadoresflashkiller.com>',
        to: destinationEmail,
        reply_to: `${data.nombre} <${data.email}>`,
        subject: `Cotización: ${data.empresa} | ${data.nombre}`,
        html: htmlBody
      })
    });

    const resendResult = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API Error:", resendResult);
      throw new Error(resendResult.message || "Error al enviar el correo a través de Resend.");
    }

    return new Response(JSON.stringify({ success: true, id: resendResult.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Email Worker Error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Error al procesar la solicitud."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
