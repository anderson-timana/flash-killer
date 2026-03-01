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

    // 3. Turnstile Verification
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

    // 4. Check for SEND_EMAIL binding and Destination Var
    if (!env.SEND_EMAIL) {
      throw new Error("SEND_EMAIL binding is missing. Ensure you are running with 'wrangler pages dev'.");
    }
    
    const destinationEmail = env.DESTINATION_EMAIL;
    if (!destinationEmail) {
      throw new Error("DESTINATION_EMAIL environment variable is missing.");
    }

    // 5. Construct Email Payload
    const htmlBody = `
      <h2>Nuevo Mensaje de Contacto</h2>
      <p><strong>Nombre:</strong> ${data.nombre}</p>
      <p><strong>Empresa:</strong> ${data.empresa}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Teléfono:</strong> ${data.telefono}</p>
      <p><strong>Ciudad:</strong> ${data.ciudad}</p>
      <p><strong>Producto de Interés:</strong> ${data.producto}</p>
      <p><strong>Mensaje:</strong><br>${(data.mensaje || "Sin mensaje").replace(/\n/g, '<br>')}</p>
      <hr><p><small>Enviado desde capturadoresflashkiller.com</small></p>
    `.trim();

    const emailPayload = {
      from: { email: "ventas@capturadoresflashkiller.com", name: "Flash Killer Website" },
      to: [{ email: destinationEmail, name: "Flash Killer" }],
      reply_to: { email: data.email, name: data.nombre },
      subject: `Cotización: ${data.empresa} | ${data.nombre}`,
      content: [
        {
          type: "text/html",
          value: htmlBody
        }
      ]
    };

    // 6. Send Email via Cloudflare native Email Send Binding
    try {
      await env.SEND_EMAIL.send_email(emailPayload);
    } catch (sendError) {
      // Local Development Workaround
      if (sendError.message.includes("does not implement the method \"send_email\"")) {
        console.warn("--- LOCAL SIMULATION ---");
        console.warn("Email Send Binding called, but local runtime doesn't support the method.");
        console.log("To:", destinationEmail);
        console.log("Subject:", emailPayload.subject);
        console.log("Payload:", JSON.stringify(emailPayload, null, 2));
        console.warn("------------------------");
      } else {
        throw sendError;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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
