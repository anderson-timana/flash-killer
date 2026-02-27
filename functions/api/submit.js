import { WorkerMailer } from 'worker-mailer';

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    // 1. Parse incoming data
    const contentType = request.headers.get("content-type") || "";
    let data = {};
    
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    }

    // --- SERVER-SIDE VALIDATION ---
    const errors = {};
    const nombrePattern = /^[a-zA-ZÀ-ÿ0-9 .]+$/;
    const empresaPattern = /^[a-zA-ZÀ-ÿ0-9 .,\\&\\-]+$/;
    const telefonoPattern = /^[\d\+\-\s]{9,11}$/;
    const emailPattern = /.+@.+\..+/;
    const ciudadPattern = /^[a-zA-ZÀ-ÿ .]+$/;

    if (!data.nombre || data.nombre.length < 3 || !nombrePattern.test(data.nombre)) errors.nombre = "Nombre inválido.";
    if (!data.empresa || data.empresa.length < 3 || !empresaPattern.test(data.empresa)) errors.empresa = "Empresa inválida.";
    if (!data.email || !emailPattern.test(data.email)) errors.email = "Email inválido.";
    if (!data.telefono || !telefonoPattern.test(data.telefono)) errors.telefono = "Teléfono inválido.";
    if (!data.ciudad || data.ciudad.length < 3 || !ciudadPattern.test(data.ciudad)) errors.ciudad = "Ciudad inválida.";
    if (!data.producto) errors.producto = "Producto no seleccionado.";
    if (data.botcheck) errors.botcheck = "Bot detected.";

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ success: false, message: "Datos inválidos.", errors }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. SMTP Configuration
    const smtpHost = env.SMTP_HOST;
    const smtpPort = parseInt(env.SMTP_PORT || "465");
    const smtpUser = env.SMTP_USER;
    const smtpPass = env.SMTP_PASS;

    // Check if variables are missing
    if (!smtpHost || !smtpUser || !smtpPass) {
      return new Response(JSON.stringify({
        success: false,
        message: "Missing SMTP configuration in Cloudflare Dashboard.",
        env_check: { host: !!smtpHost, port: !!env.SMTP_PORT, user: !!smtpUser, pass: !!smtpPass }
      }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    // 3. Connect to SMTP
    const mailer = await WorkerMailer.connect({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, 
      credentials: {
        username: smtpUser,
        password: smtpPass,
        method: 'LOGIN' // Explicitly force LOGIN method for cPanel compatibility
      },
    });

    // 4. Construct Email Body
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
    `;

    // 5. Send Email
    await mailer.send({
      from: { name: "Flash Killer Web", email: smtpUser },
      to: { name: "Ventas Flash Killer", email: "ventas@capturadoresflashkiller.com" },
      replyTo: { name: data.nombre, email: data.email },
      subject: `Cotización: ${data.empresa} | ${data.nombre}`,
      html: htmlBody,
    });

    return new Response(JSON.stringify({ success: true, message: "Mensaje enviado exitosamente." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Error al enviar el mensaje.", 
        error: error.message,
        // Safely reveal status of env vars to debug why auth failed
        env_check: { host: !!env.SMTP_HOST, port: !!env.SMTP_PORT, user: !!env.SMTP_USER, pass: !!env.SMTP_PASS }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
