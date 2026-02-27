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

    // 3. Forward to Web3Forms using URLSearchParams (mimics standard form submission)
    const formParams = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) {
      formParams.append(key, value);
    }

    const requestOrigin = request.headers.get("Origin") || new URL(request.url).origin;
    const requestReferer = request.headers.get("Referer") || request.url;

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Origin": requestOrigin,
        "Referer": requestReferer
      },
      body: formParams.toString(),
    });

    // Check if response is valid JSON before parsing
    const responseText = await response.text();
    const isHtml = responseText.trim().toLowerCase().startsWith("<!doctype html") || 
                   responseText.trim().toLowerCase().startsWith("<html");

    let result;
    try {
      if (isHtml) throw new Error("Received HTML instead of JSON");
      result = JSON.parse(responseText);
    } catch (e) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: isHtml ? "Web3Forms returned a challenge page (WAF block)" : "Web3Forms returned an invalid response", 
          status: response.status,
          error: responseText.substring(0, 200) // Provide more context for debugging
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
