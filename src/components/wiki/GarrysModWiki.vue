<template>
  <div class="garrys-mod-wiki">
    <h2>Garrys Mod - TTT</h2>
    <p>
      Willkommen bei unserer Garrys Mod Wiki zu unserem TTT Server. Hier findest du alle wichtigen Informationen zu unserem Server, Anleitungen und hilfreiche Tipps.
    </p>

    <h3>Über unseren TTT Server</h3>
    <div class="server-features">
      <div class="feature">
        <div class="feature-header">
          <font-awesome-icon icon="fa-solid fa-server" class="feature-icon" />
          <h4>TTT 2</h4>
        </div>
        <p>Unser Server basiert auf dem aktuellen TTT2. Dieses wird immernoch weiter entwickelt und enthält viele QoL Verbesserungen zum Vorgänger.</p>
      </div>

      <div class="feature">
        <div class="feature-header">
          <font-awesome-icon icon="fa-solid fa-users" class="feature-icon" />
          <h4>Skin Shop</h4>
        </div>
        <p>Unser TTT Server besitzt einen Skinshop mit ausgewählten Skins mit fairen Hitboxen. Das beste ist: Du kannst dir jeden Skin erspielen!</p>
      </div>

      <div class="feature">
        <div class="feature-header">
          <font-awesome-icon icon="fa-solid fa-puzzle-piece" class="feature-icon" />
          <h4>Angepasste Addons</h4>
        </div>
        <p>Wir verwenden speziell angepasste Addons, um das Spielerlebnis zu verbessern und einzigartige Features anzubieten.</p>
      </div>

      <div class="feature">
        <div class="feature-header">
          <font-awesome-icon icon="fa-solid fa-map" class="feature-icon" />
          <h4>Ausgesuchte Karten</h4>
        </div>
        <p>Entdecke unsere ausgewählten Karten mit toller Grafik und noch besserem Spielspaß.</p>
      </div>
    </div>

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
        <p>Das wilde Töten aller anderer Spieler ohne Grund ist verboten. Versuche Hinweise zu finden, wer der Traitor sein könnte!</p>
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

    <h3>Installation der Counter-Strike Texturen</h3>
    <div class="installation-guide">
      <div class="step">
        <div class="step-header">
          <font-awesome-icon icon="fa-solid fa-1" class="step-icon" />
          <h4>Grundlegende SteamCMD Installation</h4>
        </div>
        <p>
          Zunächst benötigen wir ein Programm namens SteamCMD. SteamCMD ist eine Version des Steam-Clients, die speziell für die Installation von dedizierten Servern in einer Befehlszeilenschnittstelle entwickelt wurde. In diesem Fall können wir es für Texturen verwenden, die in unserem Spiel genutzt werden. Es ist über den folgenden Link von der Valve Developer Community verfügbar:
        </p>
        <div class="download-link">
          <a href="https://developer.valvesoftware.com/wiki/SteamCMD" target="_blank" rel="noopener noreferrer">
            <font-awesome-icon icon="fa-solid fa-download" /> steamcmd.zip herunterladen
          </a>
        </div>
        <p>
          Entpacke die Datei in einem separaten Ordner und öffne sie.
          Das SteamCMD wird sich aktualisieren. Warte, bis die Aktualisierung abgeschlossen ist.
        </p>
      </div>

      <div class="step">
        <div class="step-header">
          <font-awesome-icon icon="fa-solid fa-2" class="step-icon" />
          <h4>Herunterladen der Counter-Strike Texturen auf deinen Computer</h4>
        </div>
        <p>
          Wir werden 3 Befehle verwenden, um die Dateien herunterzuladen:
        </p>
        <div class="command-block">
          <code>login anonymous</code>
        </div>
        <p>
          Der zweite Befehl lautet:
        </p>
        <div class="command-block">
          <code>force_install_dir ./Css/</code>
        </div>
        <p>
          Dieser Befehl wird keine Bestätigung geben, dass er ausgeführt wurde.
        </p>
        <p>
          Der dritte Befehl lautet:
        </p>
        <div class="command-block">
          <code>app_update 232330</code>
        </div>
        <p>
          Hinweis: Gib die Befehle ohne Anführungszeichen ein.
        </p>
        <p>
          Nach Abschluss des dritten Befehls beginnt der Download der CSS-Dateien (ca. 2 GB).
          Warte bis zum Abschluss.
        </p>
      </div>

      <div class="step">
        <div class="step-header">
          <font-awesome-icon icon="fa-solid fa-3" class="step-icon" />
          <h4>Verschieben der Dateien</h4>
        </div>
        <p>
          Der Ordner, in den wir einige Dateien einfügen werden:
        </p>
        <div class="command-block">
          <code>steam\steamapps\common\garrysmod\</code>
        </div>
        <p>
          Gehe zum Ordner "css", der sich im extrahierten SteamCMD-Ordner befindet (das sind die heruntergeladenen Dateien), und suche nach einem "csstrike"-Ordner.
        </p>
        <p>
          Kopiere den "csstrike"-Ordner und füge ihn in den Garrys Mod-Ordner ein, den wir zuvor erwähnt haben. Das sollte schlußendlich so aussehen:
        </p>
        <div class="command-block">
          <code>steam\steamapps\common\garrysmod\csstrike</code>
        </div>
      </div>

      <div class="step">
        <div class="step-header">
          <font-awesome-icon icon="fa-solid fa-4" class="step-icon" />
          <h4>Mounten der Dateien</h4>
        </div>
        <p>
          Zum Schluss müssen wir die Dateien mounten.
        </p>
        <p>
          Gehe zum Verzeichnis deiner Steam-Installation und finde die folgende cfg-Datei:
        </p>
        <div class="command-block">
          <code>steam\steamapps\common\GarrysMod\garrysmod\cfg\mount.cfg</code>
        </div>
        <p>
          Bearbeite die cfg-Datei und füge "cstrike" hinzu:
        </p>
        <div class="code-block">
<pre>
"mountcfg"
{
    "cstrike"	"{Dein Steam Bibliothek Pfad}\steamapps\common\GarrysMod\cstrike"
//	"tf"		"C:\mytf2server\tf"
}
</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component specific logic if needed
</script>

<style scoped>
.garrys-mod-wiki {
  color: var(--clr-text-primary);
  margin: 0 auto;
}

h2 {
  color: #FFA500;
  margin-bottom: 2rem;
}

h3 {
  color: var(--clr-text-primary);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

h3, h4 {
  color: var(--clr-text-primary);
}

.server-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1.5rem 0;
}

.feature {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.feature-icon {
  color: #f98500;
  font-size: 1.25rem;
}

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
  transition: transform 0.2s ease;
}

.rule:hover {
  transform: translateY(-2px);
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
}

.installation-guide {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 1.5rem 0;
}

.step {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.step-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  background-color: #f98500;
  color: #1a1a1a;
  border-radius: 50%;
  font-size: 0.9rem;
  font-weight: bold;
}

.step h4 {
  margin: 0;
  font-size: 1.25rem;
}

.download-link {
  margin: 1rem 0;
}

.download-link a {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f98500;
  color: #1a1a1a;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.download-link a:hover {
  background-color: #e67a00;
}

.command-block {
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid #f98500;
  padding: 0.8rem 1.2rem;
  margin: 1rem 0;
  border-radius: 4px;
  overflow-x: auto;
}

.code-block {
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid #f98500;
  padding: 0.8rem 1.2rem;
  margin: 1rem 0;
  border-radius: 4px;
  overflow-x: auto;
}

pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', monospace;
  white-space: pre-wrap;
}

.commands-table-container {
  overflow-x: auto;
  margin: 1.5rem 0;
}

.commands-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  overflow: hidden;
}

.commands-table th,
.commands-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.commands-table th {
  background: rgba(0, 0, 0, 0.2);
  color: #f98500;
  font-weight: 600;
}

.commands-table tr:last-child td {
  border-bottom: none;
}

.commands-table tr:hover td {
  background-color: rgba(255, 255, 255, 0.05);
}

code {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .server-features {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}
</style>