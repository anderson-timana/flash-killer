export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

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
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

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
