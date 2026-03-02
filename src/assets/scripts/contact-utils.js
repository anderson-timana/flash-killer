/**
 * Centralized Contact Utilities
 * Handles obfuscated Email and WhatsApp links to protect against scrapers.
 */

// --- Email Logic ---
export function setupEmailCopy() {
    const buttons = document.querySelectorAll('.copy-email-btn');
    const toast = document.getElementById('copy-toast');

    buttons.forEach(btn => {
        if (btn.dataset.copyInited) return;
        btn.dataset.copyInited = 'true';

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const container = btn.closest('.flex') || btn.parentElement;
            const emailLink = container?.querySelector('a[href^="mailto:"]');
            const email = emailLink?.textContent?.trim();
            
            if (!email) return;

            try {
                await navigator.clipboard.writeText(email);
                if (toast) {
                    toast.classList.add('opacity-100');
                    setTimeout(() => toast.classList.remove('opacity-100'), 2000);
                }
            } catch (err) {
                console.error('Failed to copy email:', err);
            }
        });
    });
}

// --- WhatsApp Obfuscation ---
export function setupWhatsAppLinks() {
    const waLinks = document.querySelectorAll('a[data-wa-encoded]');
    
    waLinks.forEach(link => {
        if (link.dataset.waInited) return;
        link.dataset.waInited = 'true';

        const encoded = link.dataset.waEncoded;
        if (!encoded) return;

        try {
            const phone = atob(encoded);
            let message = link.dataset.waMessage || "Buenos días Flash Killer. Quisiera solicitar información.";
            
            // Logic for FAB (if it has the dynamic ID)
            if (link.id === 'whatsapp-fab') {
                const path = window.location.pathname;
                if (path.includes('/productos/')) {
                    const productName = document.querySelector('[aria-current="page"]')?.textContent?.trim() || 
                                        document.querySelector('h2')?.textContent?.trim();
                    if (productName) {
                        message = `Buenos días. Quisiera cotizar el equipo: ${productName}.`;
                    }
                } else if (path.includes('/servicios')) {
                    message = "Buenos días. Quisiera consultar sobre sus servicios de higiene industrial.";
                }
            }

            link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            
            // Show FAB if it was hidden
            if (link.id === 'whatsapp-fab') {
                setTimeout(() => {
                    link.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
                    link.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
                }, 1000);
            }
        } catch (e) {
            console.error('Failed to decode WhatsApp number:', e);
        }
    });
}

// Initialize all utilities
export function initContactUtils() {
    setupEmailCopy();
    setupWhatsAppLinks();
}

initContactUtils();
document.addEventListener('astro:page-load', initContactUtils);
