// views/Impressum.vue
<template>
  <div class="impressum-page">
    <h1 class="page-title">Impressum</h1>

    <div class="impressum-content">
      <section class="impressum-section">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Lukas Roth<br />
          Am Buddeplatz 4<br />
          13507, Berlin<br />
          Deutschland
        </p>
      </section>

      <section class="impressum-section">
        <h2>Kontakt</h2>
        <p>
          Telefon: 0176/34630252<br />
          E-Mail: admin@firephenix.de<br />
          Website: firephenix.de
        </p>
      </section>

      <section class="impressum-section">
        <h2>Verantwortlich für den Inhalt</h2>
        <p>Lukas Roth</p>
      </section>
    </div>
  </div>
</template>

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
