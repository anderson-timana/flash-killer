/**
 * Centralized Email Utilities
 * Handles copy-to-clipboard for obfuscated emails compatible with Cloudflare Scraper Shield.
 */

export function setupEmailCopy() {
    const buttons = document.querySelectorAll('.copy-email-btn');
    const toast = document.getElementById('copy-toast');

    buttons.forEach(btn => {
        // Prevent double-initialization
        if (btn.dataset.copyInited) return;
        btn.dataset.copyInited = 'true';

        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Logic: Find the nearest protected link. 
            // This works for both Footer and ContactForm structures.
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

// Initialize on first load
setupEmailCopy();

// Re-initialize on Astro page transitions (SPA mode)
document.addEventListener('astro:page-load', setupEmailCopy);
