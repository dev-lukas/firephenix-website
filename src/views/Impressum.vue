// views/Impressum.vue
<template>
  <base-legal-page title="Impressum" last-updated="01.03.2024">
    <h2>Angaben gemäß § 5 TMG</h2>
    <p>
      FirePhenix UG (haftungsbeschränkt)<br />
      Musterstraße 123<br />
      12345 Musterstadt
    </p>

    <h2>Vertreten durch</h2>
    <p>Max Mustermann, Geschäftsführer</p>

    <h2>Kontakt</h2>
    <p>
      Telefon: +49 (0) 123 456789<br />
      E-Mail: info@firephenix.de
    </p>

    <h2>Registereintrag</h2>
    <p>
      Eintragung im Handelsregister<br />
      Registergericht: Amtsgericht Musterstadt<br />
      Registernummer: HRB 123456
    </p>

    <h2>Umsatzsteuer-ID</h2>
    <p>
      Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
      DE 123456789
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
