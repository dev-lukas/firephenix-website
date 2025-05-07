<template>
  <div class="rules-wiki">
    <h2>Server Regeln</h2>
    <section class="rules-section">
      <h3><font-awesome-icon :icon="['fas', 'fa-users']" class="icon" />Allgemeine Regeln</h3>
      <ul>
        <li>Respektiere alle Mitglieder. Beleidigungen, Diskriminierung oder Mobbing sind strengstens untersagt.</li>
        <li>Spam, Flooding und Werbung (auch für andere Server) sind verboten.</li>
        <li>Benutze angemessene Nicknamen und Profilbilder.</li>
        <li>Das Teilen oder Übertragen von illegalen, anstößigen oder urheberrechtlich geschützten Inhalten/Dateien ist verboten.</li>
        <li>Keine Fremdwerbung oder Affiliate-Links</li>
        <li>Keine Viren, Schadsoftware oder schädliche Links verbreiten.</li>
        <li>Private Daten dürfen nicht ohne Zustimmung weitergegeben werden.</li>
        <li>Das Team behält sich vor, geteilte Inhalte zu prüfen und ggf. zu entfernen.</li>
        <li>Soundboards sind erlaubt, solange sie andere nicht stören.</li>
        <li>Das Ausnutzen von Sicherheitslücken und Bugs innerhalb des Discord/TeamSpeaks/Website sind nicht erlaubt.</li>
        <li>Extremes AFK-Farmen für das Rangsystem sind untersagt, wenn du planst mehrere Stunden nicht am PC zu sein, verlasse bitte die Sprachkanäle.</li>
      </ul>
    </section>
    <section class="rules-section">
      <h3><font-awesome-icon :icon="['fas', 'fa-person-rifle']" class="icon" /> Garry's Mod TTT Regeln</h3>
      <ul>
        <li>Random-Killing (RDM) ist verboten. Töte nur mit Verdacht oder Beweis!</li>
        <li>Meta-Gaming, Ghosting und Cheating sind strengstens untersagt.</li>
        <li>Das Ausnutzen von Bugs oder Glitches ist verboten.</li>
        <li>Kein gezieltes Trollen oder Sabotieren des Spielspaßes anderer.</li>
      </ul>
    </section>
    <div class="rules-footer">
      <font-awesome-icon :icon="['fas', 'fa-triangle-exclamation']" class="icon warning" />
      <span>Bei Verstößen gegen die Regeln behält sich das Team Sanktionen bis hin zum permanenten Ausschluss vor.</span>
    </div>
  </div>
</template>

<script setup>
// Keine weiteren Logiken notwendig
</script>

<style scoped>
.rules-wiki {
  color: var(--clr-text-secondary);
}
.rules-wiki h2 {
  color: #FFA500;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.rules-section {
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  padding: 1.2rem 1.5rem;
  margin-bottom: 1.5rem;
  border-left: 4px solid #f98500;
}
.rules-section h3 {
  color: #f98500;
  font-size: 1.2rem;
  margin-bottom: 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.rules-section ul {
  list-style: disc inside;
  margin: 0;
  padding-left: 1rem;
}
.rules-section li {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  line-height: 1.5;
}
.icon {
  color: #f98500;
}
.rules-footer {
  margin-top: 2rem;
  background: rgba(255, 200, 0, 0.07);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #f98500;
  font-weight: 500;
  font-size: 1rem;
}
.icon.warning {
  color: #ffb300;
  font-size: 1.3rem;
}
@media (max-width: 768px) {
  .rules-section {
    padding: 1rem 0.7rem;
  }
  .rules-wiki h2 {
    font-size: 1.3rem;
  }
}
</style>
