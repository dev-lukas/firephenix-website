// views/Datenschutz.vue
<template>
  <div class="privacy-page">
    <h1 class="page-title">Datenschutzerklärung</h1>

    <div class="privacy-content">
      <section class="privacy-section">
        <h2>1. Verantwortlicher</h2>
        <p>
          [Ihr Name/Firmenname]<br>
          [Straße, Hausnummer]<br>
          [PLZ, Stadt]<br>
          E-Mail: [E-Mail-Adresse]<br>
          Tel.: [Telefonnummer]
        </p>
      </section>

      <section class="privacy-section">
        <h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
        <p>Bei der Nutzung unserer Website werden folgende personenbezogene Daten verarbeitet:</p>
        <ul>
          <li>IP-Adresse</li>
          <li>Datum und Uhrzeit der Anfrage</li>
          <li>Browsertyp und Browserversion</li>
          <li>Betriebssystem</li>
          <li>Referrer URL (die zuvor besuchte Seite)</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>3. Rechtsgrundlage</h2>
        <p>Die Verarbeitung Ihrer personenbezogenen Daten erfolgt gemäß Art. 6 Abs. 1 lit. f DSGVO auf Basis unseres berechtigten Interesses an der Verbesserung der Stabilität und Funktionalität unserer Website.</p>
      </section>

      <section class="privacy-section">
        <h2>4. Ihre Rechte</h2>
        <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
        <ul>
          <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
          <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
          <li>Recht auf Löschung (Art. 17 DSGVO)</li>
          <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
        </ul>
      </section>

      <section class="privacy-section">
        <h2>5. Speicherdauer</h2>
        <p>Ihre Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorschreiben.</p>
      </section>

      <section class="privacy-section">
        <h2>6. Beschwerderecht</h2>
        <p>Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.privacy-page {
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

.privacy-content {
  max-width: 800px;
  margin: 0 auto;
  background: var(--clr-surface);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid var(--clr-border);
}

.privacy-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--clr-border);
}

.privacy-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.privacy-section h2 {
  color: var(--clr-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.privacy-section p {
  color: var(--clr-text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.privacy-section ul {
  list-style: none;
  padding-left: 1rem;
}

.privacy-section li {
  color: var(--clr-text-secondary);
  margin-bottom: 0.5rem;
  position: relative;
  padding-left: 1.5rem;
}

.privacy-section li:before {
  content: "•";
  color: var(--clr-primary);
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .privacy-content {
    padding: 1.5rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .privacy-section h2 {
    font-size: 1.3rem;
  }
}
</style>
