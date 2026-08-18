/**
 * Aether Theme - Core Vanilla JavaScript Framework
 * 100% Original Shopify 2.0 Client-side Architecture
 */

class AetherTheme {
  constructor() {
    this.init();
  }

  init() {
    this.initScrollReveal();
    this.initHeaderLogic();
    this.initDrawerCart();
    this.initQuickView();
    this.initStickyAddToCart();
    this.initProductSwatches();
    this.initPredictiveSearch();
    this.initCookieConsent();
  }

  /**
   * Scroll Reveal Observer using IntersectionObserver
   * Respects global animations toggle on <body>
   */
  initScrollReveal() {
    if (document.body.classList.contains('animations-disabled')) return;

    const revealElements = document.querySelectorAll('.animate-scroll');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  /**
   * Header Navigation & Off-Canvas Menu Logic
   */
  initHeaderLogic() {
    const hamburgerBtn = document.querySelector('[data-aether-hamburger]');
    const offCanvasMenu = document.querySelector('[data-aether-offcanvas]');
    const overlay = document.querySelector('[data-aether-overlay]');
    const closeBtns = document.querySelectorAll('[data-aether-close-drawer]');

    if (hamburgerBtn && offCanvasMenu && overlay) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        offCanvasMenu.classList.add('is-active');
        overlay.classList.add('is-active');
        document.body.classList.add('overflow-hidden');
      });

      const closeMenu = () => {
        offCanvasMenu.classList.remove('is-active');
        const cartDrawer = document.querySelector('[data-aether-cart-drawer]');
        const quickViewModal = document.querySelector('[data-quick-view-modal]');
        if (cartDrawer) cartDrawer.classList.remove('is-active');
        if (quickViewModal) quickViewModal.classList.remove('is-active');
        overlay.classList.remove('is-active');
        document.body.classList.remove('overflow-hidden');
      };

      overlay.addEventListener('click', closeMenu);
      closeBtns.forEach(btn => btn.addEventListener('click', closeMenu));
    }
  }

  /**
   * AJAX Cart Drawer & Dynamic Updating
   */
  initDrawerCart() {
    const cartDrawer = document.querySelector('[data-aether-cart-drawer]');
    const cartTrigger = document.querySelector('[data-aether-cart-trigger]');
    const overlay = document.querySelector('[data-aether-overlay]');

    // Bind click event on header cart icon to trigger cart drawer
    if (cartTrigger && cartDrawer && overlay) {
      cartTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        cartDrawer.classList.add('is-active');
        overlay.classList.add('is-active');
        document.body.classList.add('overflow-hidden');
      });
    }

    // Intercept native Add-to-cart forms
    document.addEventListener('submit', async (e) => {
      const form = e.target;
      if (form && form.action && form.action.includes('/cart/add')) {
        e.preventDefault();

        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
          const formData = new FormData(form);
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          });

          if (!response.ok) throw new Error('Network response was not ok');

          const item = await response.json();
          await this.refreshCart();

          // Open cart drawer
          if (cartDrawer && overlay) {
            cartDrawer.classList.add('is-active');
            overlay.classList.add('is-active');
            document.body.classList.add('overflow-hidden');
          }
        } catch (error) {
          console.error('Error adding product to cart:', error);
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      }
    });
  }

  async refreshCart() {
    try {
      const response = await fetch('/cart?section_id=cart-drawer');
      const html = await response.text();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      const newDrawerContent = tempDiv.querySelector('[data-aether-cart-drawer-content]');
      const currentDrawerContent = document.querySelector('[data-aether-cart-drawer-content]');

      if (newDrawerContent && currentDrawerContent) {
        currentDrawerContent.innerHTML = newDrawerContent.innerHTML;
      }

      // Update cart count bubbles
      const cartResponse = await fetch('/cart.js');
      const cartData = await cartResponse.json();
      const countElements = document.querySelectorAll('[data-cart-count]');
      countElements.forEach(el => {
        el.textContent = cartData.item_count;
        el.classList.toggle('hidden', cartData.item_count === 0);
      });
    } catch (err) {
      console.error('Failed to refresh cart drawer:', err);
    }
  }

  /**
   * Quick View Modal Dynamic Trigger
   */
  initQuickView() {
    document.addEventListener('click', async (e) => {
      const trigger = e.target.closest('[data-quick-view-trigger]');
      if (!trigger) return;

      e.preventDefault();
      const handle = trigger.dataset.productHandle;
      if (!handle) return;

      const modal = document.querySelector('[data-quick-view-modal]');
      const modalBody = document.querySelector('[data-quick-view-body]');
      const overlay = document.querySelector('[data-aether-overlay]');

      if (!modal || !modalBody) return;

      modalBody.innerHTML = '<div class="flex justify-center p-8"><div class="spinner"></div></div>';
      modal.classList.add('is-active');
      if (overlay) overlay.classList.add('is-active');

      try {
        const response = await fetch(`/products/${handle}?view=quickview`);
        const html = await response.text();
        modalBody.innerHTML = html;
        this.initProductSwatches(); // Re-bind swatches inside modal
      } catch (err) {
        modalBody.innerHTML = '<p class="p-4 text-center">Failed to load product details.</p>';
      }
    });
  }

  /**
   * Sticky Add To Cart Observer
   */
  initStickyAddToCart() {
    const stickyBar = document.querySelector('[data-sticky-atc]');
    const mainForm = document.querySelector('form[action*="/cart/add"]');

    if (!stickyBar || !mainForm) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Show sticky bar when main ATC form is scrolled out of view
        stickyBar.classList.toggle('is-visible', !entry.isIntersecting);
      });
    }, { threshold: 0.1 });

    observer.observe(mainForm);
  }

  /**
   * Product Swatches Selection
   */
  initProductSwatches() {
    document.querySelectorAll('[data-swatch-group]').forEach(group => {
      const swatches = group.querySelectorAll('[data-swatch-value]');
      swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
          swatches.forEach(s => s.classList.remove('is-selected'));
          swatch.classList.add('is-selected');

          const optionIndex = swatch.dataset.optionIndex;
          const value = swatch.dataset.swatchValue;
          const nativeSelect = swatch.closest('form')?.querySelector(`[data-single-option-select="${optionIndex}"]`);

          if (nativeSelect) {
            nativeSelect.value = value;
            nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      });
    });
  }

  /**
   * Predictive Search Dropdown
   */
  initPredictiveSearch() {
    const searchInputs = document.querySelectorAll('[data-predictive-search-input]');
    searchInputs.forEach(input => {
      let timeout = null;
      input.addEventListener('input', (e) => {
        clearTimeout(timeout);
        const query = e.target.value.trim();
        const container = input.closest('form')?.querySelector('[data-predictive-search-results]');

        if (!query || query.length < 2) {
          if (container) container.innerHTML = '';
          return;
        }

        timeout = setTimeout(async () => {
          try {
            const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=5`);
            const data = await response.json();
            const products = data.resources.results.products;

            if (container) {
              if (products && products.length > 0) {
                container.innerHTML = products.map(p => `
                  <a href="${p.url}" class="flex items-center gap-4 p-2 hover:bg-surface rounded">
                    <img src="${p.image}" alt="${p.title}" class="w-12 h-12 object-cover rounded" />
                    <div>
                      <div class="font-medium text-sm">${p.title}</div>
                      <div class="text-xs text-muted">${p.price}</div>
                    </div>
                  </a>
                `).join('');
              } else {
                container.innerHTML = '<div class="p-3 text-sm text-muted">No products found</div>';
              }
            }
          } catch (err) {
            console.error('Predictive search error:', err);
          }
        }, 300);
      });
    });
  }

  /**
   * Cookie Consent GDPR Management
   */
  initCookieConsent() {
    const banner = document.querySelector('[data-cookie-consent]');
    const acceptBtn = document.querySelector('[data-accept-cookies]');

    if (!banner || !acceptBtn) return;

    if (!localStorage.getItem('aether_cookie_consent')) {
      banner.classList.add('is-visible');
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('aether_cookie_consent', 'accepted');
      banner.classList.remove('is-visible');
    });
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.aetherTheme = new AetherTheme();
});
