<template>
  <div class="garrys-mod-wiki">
    <h2>Garrys Mod</h2>
    <p>
      Alles was du über unseren Garrys Mod Server wissen musst. Hier findest du Anleitungen, Serverregeln und hilfreiche Tipps.
    </p>

    <h3>Serverregeln</h3>
    <div class="rules-section">
      <div class="rule">
        <div class="rule-header">
          <font-awesome-icon icon="fa-solid fa-check-circle" class="rule-icon" />
          <h4>Allgemeines Verhalten</h4>
        </div>
        <p>Sei respektvoll zu allen Spielern. Beleidigungen, Diskriminierung und Belästigung werden nicht toleriert.</p>
      </div>

      <div class="rule">
        <div class="rule-header">
          <font-awesome-icon icon="fa-solid fa-check-circle" class="rule-icon" />
          <h4>RDM (Random Death Match)</h4>
        </div>
        <p>Das Töten anderer Spieler ohne Grund ist verboten. Beachte die Roleplay-Regeln.</p>
      </div>

      <div class="rule">
        <div class="rule-header">
          <font-awesome-icon icon="fa-solid fa-check-circle" class="rule-icon" />
          <h4>Prop Blocking/Killing</h4>
        </div>
        <p>Das Blockieren von Wegen oder das Töten mit Props ist nicht erlaubt.</p>
      </div>

      <div class="rule">
        <div class="rule-header">
          <font-awesome-icon icon="fa-solid fa-check-circle" class="rule-icon" />
          <h4>Metagaming</h4>
        </div>
        <p>Informationen außerhalb des Spiels (Discord, etc.) dürfen nicht im Spiel verwendet werden.</p>
      </div>

      <div class="rule">
        <div class="rule-header">
          <font-awesome-icon icon="fa-solid fa-check-circle" class="rule-icon" />
          <h4>Cheating/Exploiting</h4>
        </div>
        <p>Die Verwendung von Cheats oder das Ausnutzen von Bugs führt zu einem permanenten Bann.</p>
      </div>
    </div>

    <h3>Addon-Liste</h3>
    <p>Folgende Addons solltest du für eine optimale Spielerfahrung installieren:</p>
    
    <div class="addon-list">
      <div class="addon">
        <font-awesome-icon icon="fa-solid fa-puzzle-piece" class="addon-icon" />
        <div>
          <h4>DarkRP</h4>
          <p>Hauptmod für unseren Roleplay-Server</p>
        </div>
      </div>

      <div class="addon">
        <font-awesome-icon icon="fa-solid fa-puzzle-piece" class="addon-icon" />
        <div>
          <h4>ULX Admin Mod</h4>
          <p>Administrationstools für Moderatoren</p>
        </div>
      </div>

      <div class="addon">
        <font-awesome-icon icon="fa-solid fa-puzzle-piece" class="addon-icon" />
        <div>
          <h4>FirePhenix Custom Content</h4>
          <p>Unsere eigenen Mods und Inhalte</p>
        </div>
      </div>

      <div class="addon">
        <font-awesome-icon icon="fa-solid fa-puzzle-piece" class="addon-icon" />
        <div>
          <h4>M9K Weapons Pack</h4>
          <p>Erweiterte Waffenauswahl</p>
        </div>
      </div>
    </div>

    <h3>Server-Befehle</h3>
    <div class="commands-table-container">
      <table class="commands-table">
        <thead>
          <tr>
            <th>Befehl</th>
            <th>Beschreibung</th>
            <th>Benötigtes Level</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>/job</code></td>
            <td>Job wechseln</td>
            <td>Level 1</td>
          </tr>
          <tr>
            <td><code>/advert</code></td>
            <td>Werbung schalten</td>
            <td>Level 1</td>
          </tr>
          <tr>
            <td><code>/drop</code></td>
            <td>Waffe fallenlassen</td>
            <td>Level 1</td>
          </tr>
          <tr>
            <td><code>/give</code></td>
            <td>Geld geben</td>
            <td>Level 2</td>
          </tr>
          <tr>
            <td><code>/votekick</code></td>
            <td>Abstimmung zum Kicken</td>
            <td>Level 3</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// Component specific logic if needed
</script>

<style scoped>
.rules-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.rule {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.rule-icon {
  color: #f98500;
  font-size: 1.25rem;
}

.rule h4 {
  margin: 0;
  color: var(--clr-text-primary);
}

.addon-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.addon {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
}

.addon-icon {
  color: #f98500;
  font-size: 1.5rem;
}

.addon h4 {
  margin-bottom: 0.25rem;
  color: var(--clr-text-primary);
}

.commands-table-container {
  overflow-x: auto;
  margin: 1.5rem 0;
}

.commands-table {
  width: 100%;
  border-collapse: collapse;
}

.commands-table th,
.commands-table td {
  padding: 0.8rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.commands-table tr:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>