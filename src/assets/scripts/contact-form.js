function initContactForm() {
  const form = document.getElementById('contact-form');
  
  // 0. Performance: Prevent double-initialization on the same page session
  if (!form || form.dataset.initialized) return;
  form.dataset.initialized = "true";

  let scriptLoaded = false;

  // 1. Smart Script Loader: Ensures the script is only ever added once
  const loadScript = () => {
    if (scriptLoaded || document.querySelector('script[src*="turnstile"]')) return;
    scriptLoaded = true;
    const script = document.createElement('script');
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

  // A. Viewport Trigger: 300px margin is a good balance between perf and UX
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loadScript();
      observer.disconnect();
    }
  }, { rootMargin: '300px' });
  observer.observe(form);

  // B. Intent Trigger: Start loading if user hovers over a contact link
  const contactLinks = document.querySelectorAll('a[href*="#contacto"], a[href*="/contactanos"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', loadScript, { once: true });
    link.addEventListener('mouseenter', loadScript, { once: true });
  });

  // C. Instant Validation Feedback on Blur
  const inputsWithValidation = form.querySelectorAll('[required], [pattern], [minlength]');
  inputsWithValidation.forEach(input => {
    input.addEventListener('blur', () => {
      input.classList.add('interacted');
    });
  });

  // 2. Product Preselection Logic
  const urlParams = new URLSearchParams(window.location.search);
  const productParam = urlParams.get('product');
  const select = document.getElementById('producto');

  if (select && productParam) {
    const option = Array.from(select.options).find(opt => opt.value === productParam);
    if (option) {
      select.value = productParam;
    }
  }

  // 4. Security & Anti-Spam Logic
  const pageLoadTime = Date.now();
  const resultDiv = document.getElementById('result');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Mark as submitted to trigger visual validation
    form.classList.add('submitted');

    // A. Turnstile Validation
    const turnstileResponse = form.querySelector('[name="cf-turnstile-response"]');
    if (turnstileResponse && !turnstileResponse.value) {
      alert("Por favor, complete la verificación de seguridad.");
      return;
    }

    // B. Time Trap: If submitted in < 3 seconds, it's likely a bot.
    if (Date.now() - pageLoadTime < 3000) {
      console.warn("Submission rejected: Too fast.");
      return;
    }

    // C. Link Trap
    const textInputs = form.querySelectorAll('input[type="text"], input[type="tel"]');
    const linkPattern = /(https?:\/\/|www\.|ftp:\/\/)/i;
    
    for (const input of Array.from(textInputs)) {
        if (linkPattern.test(input.value)) {
            alert('Por seguridad, no se permiten enlaces (URLs) en los campos de contacto.');
            input.focus();
            return;
        }
    }

    // D. Script Trap
    const mensajeField = document.getElementById('mensaje');
    if (mensajeField && mensajeField.value) {
        const cyrillicPattern = /[\u0400-\u04FF]/;
        if (cyrillicPattern.test(mensajeField.value)) {
            alert('Por seguridad, solo se permiten caracteres latinos (español/inglés).');
            mensajeField.focus();
            return;
        }
    }

    // E. Dynamic Subject Line
    const subjectInput = document.getElementById('email_subject');
    const nombreInput = document.getElementById('nombre');
    const empresaInput = document.getElementById('empresa');
    
    if (subjectInput && nombreInput && empresaInput) {
        subjectInput.value = `Cotización: ${empresaInput.value} | ${nombreInput.value}`;
    }

    // 4. AJAX Submission
    const formData = new FormData(form);
    const originalBtnText = submitBtn.innerHTML;
    
    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="animate-pulse">Enviando...</span>';
      
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const json = await response.json();

      if (response.status === 200) {
        // Success: Use the redirect URL provided in the form
        const redirectUrl = form.querySelector('input[name="redirect"]')?.value || '/gracias/';
        window.location.href = redirectUrl;
      } else {
        // Error handling
        console.error(json);
        if (resultDiv) {
          resultDiv.classList.remove('hidden');
          const errorMessage = json.error || json.message || 'Ocurrió un error al enviar el formulario.';
          resultDiv.innerHTML = `<p class="text-red-400 bg-red-400/10 p-4 border border-red-400/20">Error: ${errorMessage}</p>`;
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        
        // Reset Turnstile on error if it exists
        if (window.turnstile) {
            window.turnstile.reset();
        }
      }
    } catch (error) {
      console.error(error);
      if (resultDiv) {
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `<p class="text-red-400 bg-red-400/10 p-4 border border-red-400/20">Error de conexión. Por favor, intente nuevamente.</p>`;
      }
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// Single initialization logic for both standard loads and view transitions
initContactForm();
document.addEventListener('astro:page-load', initContactForm);
