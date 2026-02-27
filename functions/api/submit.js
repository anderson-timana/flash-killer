export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    
    // Check Content-Type to ensure we can parse it
    const contentType = request.headers.get("content-type") || "";
    let data = {};
    
    if (contentType.includes("form-data")) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Unsupported Content-Type" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Secret Access Key from Environment
    const accessKey = env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      return new Response(
        JSON.stringify({ success: false, message: "Server configuration error: Missing API Key" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Prepare payload for Web3Forms
    const payload = {
      ...data,
      access_key: accessKey,
    };

    // 3. Forward to Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "FlashKiller-Worker/1.0"
      },
      body: JSON.stringify(payload),
    });

    // Check if response is valid JSON before parsing
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Web3Forms returned an invalid response", 
          status: response.status,
          error: responseText.substring(0, 100) // Limit size
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Return response to client
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
