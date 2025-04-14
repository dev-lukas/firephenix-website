<template>
  <div class="saison-wiki">
    <h2>Unsere Saison</h2>
    <p>
      Informationen zu unserer aktuellen Saison, Events und speziellen Aktivitäten.
    </p>

    <h3>Aktuelle Saison: Winter 2023/2024</h3>

    <div class="season-info">
      <div class="season-card">
        <h4>Saisonale Events</h4>
        <ul>
          <li>Winterfest (24. Dezember - 26. Dezember)</li>
          <li>Silvesterparty (31. Dezember)</li>
          <li>Winterturnier (15. Januar - 22. Januar)</li>
        </ul>
      </div>

      <div class="season-card">
        <h4>Saisonale Belohnungen</h4>
        <ul>
          <li>Winter-Skin-Paket</li>
          <li>Spezielle Schneemann-Emotes</li>
          <li>Limitierte Winter-Titel</li>
        </ul>
      </div>
    </div>

    <h3>Kommende Saison-Updates</h3>
    <p>
      Wir planen folgende Updates für die laufende Saison:
    </p>
    <ul>
      <li>Neues Schneelandschaft-Map (Mitte Januar)</li>
      <li>Erweiterte Winterausstattung (Anfang Februar)</li>
      <li>Saisonaler Boss-Event (Ende Februar)</li>
    </ul>

    <h3>Saisonale Achievements</h3>
    <div class="achievements-section">
      <div class="achievement">
        <font-awesome-icon icon="fa-solid fa-snowflake" class="achievement-icon" />
        <div>
          <h4>Frostbringer</h4>
          <p>Gewinne 10 Matches auf der Winterkarte</p>
        </div>
      </div>
      
      <div class="achievement">
        <font-awesome-icon icon="fa-solid fa-gift" class="achievement-icon" />
        <div>
          <h4>Festtagsfreund</h4>
          <p>Nimm an allen Winterfest-Events teil</p>
        </div>
      </div>
      
      <div class="achievement">
        <font-awesome-icon icon="fa-solid fa-calendar" class="achievement-icon" />
        <div>
          <h4>Wintersportler</h4>
          <p>Erreiche einen Platz unter den Top 3 im Winterturnier</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component specific logic if needed
</script>

<style scoped>
.season-info {
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
}

.season-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  flex: 1;
  min-width: 250px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.season-card h4 {
  margin-bottom: 1rem;
  color: #f98500;
}

ul {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

.achievements-section {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievement {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
}

.achievement-icon {
  color: #f98500;
  font-size: 1.5rem;
}

.achievement h4 {
  margin-bottom: 0.25rem;
  color: var(--clr-text-primary);
}

@media (max-width: 768px) {
  .season-info {
    flex-direction: column;
  }
}
</style>