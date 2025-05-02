// views/Impressum.vue
<template>
  <base-legal-page title="Impressum" last-updated="01.03.2024">
    <h2>Angaben gemäß § 5 TMG</h2>
    <p>
      Lukas Benjamin Roth<br />
      Am Buddeplatz 4<br />
      13507 Berlin
    </p>

    <h2>Kontakt</h2>
    <p>
      Telefon: +49 176 34630252<br />
      E-Mail: admin@firephenix.de
    </p>
  </base-legal-page>
</template>

<script setup lang="ts">
import BaseLegalPage from '../components/base/BaseLegalPage.vue';
</script>

<style scoped>
.impressum-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 80px 20px 40px;
  color: var(--clr-text-primary);
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: var(--clr-text-primary);
}

.impressum-content {
  max-width: 800px;
  margin: 0 auto;
  background: var(--clr-surface);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid var(--clr-border);
}

.impressum-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--clr-border);
}

.impressum-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.impressum-section h2 {
  color: var(--clr-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.impressum-section p {
  color: var(--clr-text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .impressum-content {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .impressum-section h2 {
    font-size: 1.3rem;
  }
}
</style>
