<template>
  <div class="garrys-mod-wiki">
    <h2>Installation der Counter-Strike Texturen</h2>
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
          Bearbeite die cfg-Datei und füge "csstrike" hinzu:
        </p>
        <div class="code-block">
<pre>
"mountcfg"
{
    "cstrike"	"{Dein Steam Bibliothek Pfad}\steamapps\common\GarrysMod\csstrike"
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
  color: var(--clr-text-secondary);
  margin: 0 auto;
}

h2 {
  color: var(--clr-primary);
  margin-bottom: 2rem;
}

h3 {
  color: var(--clr-text-primary);
  margin-top: 2rem;
  margin-bottom: 2rem;
}

h3, h4 {
  color: var(--clr-primary-light);
}

.installation-guide {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 1.5rem 0;
}

.step {
  background: var(--clr-surface-2);
  border-radius: 8px;
  padding: 1.75rem;
  border: 1px solid var(--clr-border);
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
  background-color: var(--clr-primary-light);
  color: #1a1a1a;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.download-link a:hover {
  background-color: var(--clr-primary);
}

.command-block {
  background: var(--clr-background);
  border-left: 3px solid var(--clr-primary-light);
  padding: 0.8rem 1.2rem;
  margin: 1rem 0;
  border-radius: 4px;
  overflow-x: auto;
}

.code-block {
  background: var(--clr-background);
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

code {
  background: var(--clr-surface-2);
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