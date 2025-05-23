<!-- components/base/CookieBanner.vue -->
<template>
  <div v-if="showBanner" class="cookie-banner-overlay">
    <div class="cookie-banner">
      <div class="cookie-banner-content">
        <div class="cookie-icon">
          <i class="fas fa-cookie-bite"></i>
        </div>
        <div class="cookie-text">
          <h3>Cookies & Datenschutz</h3>
          <p>
            Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche 
            Erfahrung auf unserer Website zu bieten und unsere Services zu verbessern. 
            Durch die Nutzung unserer Website stimmen Sie der Verarbeitung Ihrer Daten 
            gemäß unserer Datenschutzerklärung zu.
          </p>
          <router-link to="/dataprivacy" class="privacy-link">
            <i class="fas fa-shield-alt"></i>
            Datenschutzerklärung lesen
          </router-link>
        </div>
      </div>
      <div class="cookie-actions">
        <button 
          class="cookie-btn cookie-btn-decline" 
          @click="declineCookies"
          type="button"
        >
          <i class="fas fa-times"></i>
          Ablehnen
        </button>
        <button 
          class="cookie-btn cookie-btn-accept" 
          @click="acceptCookies"
          type="button"
        >
          <i class="fas fa-check"></i>
          Cookie erlauben
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface CookieConsent {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
  timestamp: number;
}

const emit = defineEmits<{
  consentChanged: [consent: CookieConsent];
}>();

const showBanner = ref(false);

const COOKIE_CONSENT_KEY = 'firephenix-cookie-consent';
const CONSENT_EXPIRY_DAYS = 365;

onMounted(() => {
  checkExistingConsent();
});

const checkExistingConsent = () => {
  const existingConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
  
  if (!existingConsent) {
    showBanner.value = true;
    return;
  }

  try {
    const consent: CookieConsent = JSON.parse(existingConsent);
    const expiryTime = consent.timestamp + (CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    
    if (Date.now() > expiryTime) {
      // Consent expired, show banner again
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      showBanner.value = true;
    } else {
      // Valid consent exists, emit current consent
      emit('consentChanged', consent);
    }
  } catch (error) {
    // Invalid consent data, show banner
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    showBanner.value = true;
  }
};

const acceptCookies = () => {
  const consent: CookieConsent = {
    essential: true,
    analytics: true,
    functional: true,
    timestamp: Date.now()
  };
  
  saveConsent(consent);
  showBanner.value = false;
  emit('consentChanged', consent);
};

const declineCookies = () => {
  const consent: CookieConsent = {
    essential: true, // Essential cookies are always required
    analytics: false,
    functional: false,
    timestamp: Date.now()
  };
  
  saveConsent(consent);
  showBanner.value = false;
  emit('consentChanged', consent);
};

const saveConsent = (consent: CookieConsent) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
};

// Expose method to reset consent (for testing/development)
const resetConsent = () => {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  showBanner.value = true;
};

defineExpose({
  resetConsent
});
</script>

<style scoped>
.cookie-banner-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  animation: slideUp 0.4s ease-out;
}

.cookie-banner {
  background: var(--clr-surface);
  border-top: 1px solid var(--clr-border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  max-width: 100%;
  margin: 0 auto;
  border-radius: 15px 15px 0 0;
  background: rgba(28, 28, 28, 0.95);
}

.cookie-banner-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.cookie-icon {
  font-size: 2rem;
  color: var(--clr-primary);
  margin-top: 0.25rem;
  animation: bounce 2s infinite;
}

.cookie-text {
  flex: 1;
}

.cookie-text h3 {
  color: var(--clr-text-primary);
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.cookie-text p {
  color: var(--clr-text-secondary);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
  font-size: 0.9rem;
}

.privacy-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--clr-primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.privacy-link:hover {
  color: var(--clr-accent);
  border-bottom-color: var(--clr-accent);
  transform: translateX(5px);
}

.cookie-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.cookie-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.cookie-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
}

.cookie-btn:hover::before {
  left: 100%;
}

.cookie-btn-accept {
  background: var(--clr-primary);
  color: white;
}

.cookie-btn-accept:hover {
  background: var(--clr-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 69, 0, 0.3);
}

.cookie-btn-decline {
  background: var(--clr-surface-dark, #2a2a2a);
  color: var(--clr-text-secondary);
  border: 1px solid var(--clr-border);
}

.cookie-btn-decline:hover {
  background: var(--clr-border);
  color: var(--clr-text-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .cookie-banner {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.25rem;
    border-radius: 15px 15px 0 0;
  }

  .cookie-banner-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .cookie-icon {
    font-size: 1.75rem;
    margin-top: 0;
  }

  .cookie-text h3 {
    font-size: 1.1rem;
  }

  .cookie-text p {
    font-size: 0.85rem;
  }

  .cookie-actions {
    flex-direction: column;
    width: 100%;
  }

  .cookie-btn {
    justify-content: center;
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }

  .privacy-link {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .cookie-banner {
    padding: 1rem;
  }

  .cookie-text h3 {
    font-size: 1rem;
  }

  .cookie-text p {
    font-size: 0.8rem;
  }

  .cookie-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
