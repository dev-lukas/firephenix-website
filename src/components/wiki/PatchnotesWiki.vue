<template>
  <div class="patchnotes-wiki">
    <h2 class="patchnotes-title">Patchnotes</h2>
    
    <div v-for="note in patchnotes" :key="note.id" class="patchnote-wrapper">
      <div class="patchnote-card">
        <!-- Header Section -->
        <div class="patchnote-header">
          <div class="patchnote-header-content">
            <h3 class="patchnote-version">{{ note.title }}</h3>
            <div class="patchnote-meta">
              <span class="patchnote-date">{{ note.date }}</span>
            </div>
          </div>
          <div class="patchnote-header-decoration"></div>
        </div>

          <!-- Blog Content Section -->
          <div class="patchnote-content">
            <div class="patchnote-blog" v-html="note.blogContent"></div>
            
            <!-- Images Section -->
            <div v-if="note.images && note.images.length" class="patchnote-images">
              <img v-for="(img, idx) in note.images" :key="idx" :src="img" class="patchnote-image" alt="Patchnote image" />
            </div>
          </div>

          <!-- Changes Summary Section -->
          <div class="patchnote-changes-wrapper">
            <h3 class="changes-title">Änderungsübersicht</h3>
            <div class="patchnote-changes">
              <div v-if="note.added && note.added.length" class="change-section added-section">
                <div class="change-header">
                  <div class="change-icon">+</div>
                  <span class="change-label">Hinzugefügt</span>
                </div>
                <ul class="change-list">
                  <li v-for="(item, idx) in note.added" :key="'a'+idx" class="change-item">{{ item }}</li>
                </ul>
              </div>
              
              <div v-if="note.changed && note.changed.length" class="change-section changed-section">
                <div class="change-header">
                  <div class="change-icon">~</div>
                  <span class="change-label">Geändert</span>
                </div>
                <ul class="change-list">
                  <li v-for="(item, idx) in note.changed" :key="'c'+idx" class="change-item">{{ item }}</li>
                </ul>
              </div>
              
              <div v-if="note.fixed && note.fixed.length" class="change-section fixed-section">
                <div class="change-header">
                  <div class="change-icon">✓</div>
                  <span class="change-label">Behoben</span>
                </div>
                <ul class="change-list">
                  <li v-for="(item, idx) in note.fixed" :key="'f'+idx" class="change-item">{{ item }}</li>
                </ul>
              </div>
              
              <div v-if="note.removed && note.removed.length" class="change-section removed-section">
                <div class="change-header">
                  <div class="change-icon">−</div>
                  <span class="change-label">Entfernt</span>
                </div>
                <ul class="change-list">
                  <li v-for="(item, idx) in note.removed" :key="'r'+idx" class="change-item">{{ item }}</li>
                </ul>
              </div>            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const patchnotes = ref([
  {
    id: 2,
    title: 'v1.0.1',
    date: '13. Juni 2025',
    description: 'Bugfixes und kleine Verbesserungen für die neue Webseite',
    blogContent: `
      <h3>QoL und Bugfixes</h3>
      <p>Seit Launch gab es einige kleine Verbesserungen und Fehler die behoben wurden.</p>
      <p>Ember wurde etwas verbessert und sollte nun auf Fragen besser eingehen und sich nicht im Kreis drehen. Einige Texte auf der Webseite wurden angepasst.
      Kleinere Fehler die auftraten wurden behoben.</p>
      <p>Vielen Dank an alle die Feedback gegeben haben und Fehler gemeldet haben!</p>
      <p>Lukas ~ Admin</p>
     `,
    images: [],
    added: [],
    changed: [
      'Mitglieder-Channel heißen nun sinnvoller Prestige-Channel',
      'Verbesserte Ember Interaktion',
      'Kleinere Textanpassungen auf der Webseite',
      'Heatmap Farben wurden verbessert',
    ],
    fixed: [
      'Kurzzeitige falsche Rangzuweisung zu Level I',
      'Falsche Zeitangabe zum Levelup im Profil-Tab',
      'Profil-Settings werden bei einem Merge nicht mehr überschrieben',
    ],
    removed: [],
  },
  {
    id: 1,
    title: 'v1.0 - FirePhenix Rebirth',
    date: '1. Juni 2025',
    description: 'Großer Neuanfang mit vielen neuen Features und Verbesserungen',
    blogContent: `
      <h3>Ein völliger Neuanfang!</h3>
      <p>Wie ihr in den letzten Monaten eventuell mitbekommen habt, ist seit dem Server-Umzug letzten Herbst nicht viel passiert. Die Webseite war längere Zeit offline, dem TeamSpeak Server fehlten
        Icons und noch einige weitere kleinere Mäkeligkeiten traten auf, ohne viel Bewegung außer einigen kleinen Hotfixen.</p>
      <p>Das ganze war einem Rewrite der meisten wichtigsten Komponenten von FirePhenix zu Schulden. Dabei blieb einfach wenig Zeit für Legacy-Support, was sowohl meines eher stressigen Alltags
        aber auch einfach einem Blick auf die ablösenden Systeme zu verschulden war.</p>
      <p>Nun ist es aber endlich soweit! Ich hoffe ihr verzeit. Kommen wir zu den endlosen Änderungen:</p>
      <h3>Webseite</h4>
      <p>Wenn ihr diese Patchnotes lest, seit ihr bereits auf der neuen Webseite! Glückwunsch! Ihr erkennt wahrscheinlich sehr schnell, dass die gesamte Seite völlig neu ist.
        Nicht nur technisch wurde diese grunderneuert, sie hat auch einen neuen Anstrich erhalten. Im Sinne der Augen der meisten ist die Seite jetzt in einem Dark Theme designed.
        Im Sinne des FirePhenix Themes ist nun ein feuriges Orange die Akzentfarbe geworden. Ich hoffe Sie gefällt!</p>
      <p>Während die alte Webseite auf mobilen Geräten nicht wirklich gut aussah oder überhaupt funktionierte, ist die neue Webseite nun auch für mobile Geräte optimiert.</p>
      <p>Weiterhin kam natürlich auch neue Funktionalität hinzu. Die Rankingseite und -liste wurde völlig überarbeitet. Wir bieten neue Achievements an, neue Metriken zum bestaunen
        und generell ein deutlich polierteres und integriertes Interface für das Rankingsystem!</p>
      <p>Das eigene Profil wurde überarbeitet. Dabei sind ein paar Funktionen verschwunden, neue sind aber dafür auch hinzugekommen! Der Login, nun wieder durch Steam OpenID, 
        ist deutlich sicherer und gibt eine einfache Verbindung zu Steam basierten Game-Servern her. Den alten Move-Blocker, jetzt Move-Shield, kann man einfacher denje aktivieren
        und deaktivieren. Accounts sind bequemer zu verbinden. Man muss keinen Channel mehr betreten, man erhält einfach einen Einmal-Code per Nachricht. Desweiteren ist eine
        Channel-Erstellung nun kinderleicht.
      </p>  
      <h3>TeamSpeak</h3>  
        Wo wir bei Channel-Erstellungen bereits sind: <u>Eigene, permanente Channel im oberen Bereich sind nun für jeden möglich</u>. Was vorher nur handselektierte Nutzer erhalten hatten, ist nun
        für jeden erreichbar. Da FirePhenix ein Passions Projekt von mir ist, möchte ich weder Spieler ausschließen von solchen grundlegenden Funktionen, noch Geld verlangen für irgendein Service.</p>
      <p>Permanente Channel sind jetzt bequem im Profil für jeden erstellbar, der Prestige I erreicht hat. Also keine Sorge, es bleibt etwas exklusives für den Community-Kern.</p>
      <p>Gleichzeitig verabschieden wir uns von Gruppen-Channel. Diese sind nun nicht mehr verfügbar. Das ganze war einfach zu unübersichtlich und wurde selten genutzt.
        Desweiteren sorgte der Icon-Upload für eine sehr ungleiche Icon-Qualität auf dem Server und für noch ein weiteres Icon.</p>
      <p>Bei dem Icon-Chaos bleibend, wird auch der Icon-Picker entfernt. Ich bin ein großer Befürworter von einem kreativen Ausleben, aber 3 weitere Icons, neben Gruppen, Channel, Rang Icon
        und 3 myTeamSpeak Icons sorgte für bis zu 9 Icons. Da blicken neue Spieler nicht durch was für was steht, und ohne Ultra-Wide Monitor kann man die sowieso nicht sehen /s.
        Ich möchte zurück zu grundlegenden Icons welche, neben den myTeamSpeak Icons, wirkliche Funktionalität darstellen. Deswegen wurden auch alle weiteren extra Icons (Altes Eisen, e.t.c)
        in die Achievements verlagert.</p>
      <p>Natürlich gibt es aber auch noch mehr neues! Zum einen hat der TeamSpeak endlich wieder FileTransfer! Lange ausgeschaltet, ist er wieder verfügbar. Entnehmt die Upload-Qoutas für Spieler
        bitte der Rangtabelle ein Klick weiter unter Rangsystem. Beachtet auch dass der FileTransfer <u>kein Speicher ist</u>. Dateien werden aus diesem regelmäßig automatisch gelöscht 
        um die VPS Festplatte nicht volllaufen zulassen.</p>
      <p>Desweiteren gibt es nun ein neues Tier an Channeln. <i>Apex-Channel</i>. Dies sind nun die neuen Channel die ganz oben thronen. Wie ihr diese erhaltet, erfahrt ihr gleich. Prinzipiell sind sie
        aber für jeden erreichbar.
      <h3>Rangsystem</h3>
      <p>Das Rangsystem wurde von mir völlig neu geschrieben. Prinzipiell ändert sich an der funktionsweise auch nichts. Das Rangsystem trackt eure Zeit die ihr auf FirePhenix Voice-Channel verbringt
        und ihr steigt Level auf wie gewohnt. Die Anforderungen sind gleich geblieben und ihr habt natürlich eure Zeit und Stats behalten. Das ganze war eher technisch bedingt, da das TSN.Net Rankingsystem,
        welches wir vorher verwendet haben, einige technische Limitationen für mich aufweiste und einen alten PHP-Techstack mitbrachte.</p>
      <p>Da das Rangsystem nun aber von mir selbst geschrieben wurde, kann ich es auch besser anpassen und erweitern. Einen Blick darauf, was nun alles möglich ist, zeigen die neuen Heatmap Stats, Login-Streaks
        und die wohl größte Änderung des neuen Rangsystems: <u>Seasons</u>.</p>
      <p>Seien wir ehrlich: Erik schnappt niemand mehr den Platz Eins weg, außer er gönnt sich mehrere, vielleicht so 10, Sabbaticals. Das ist für jeden mit einer Ash Ketchum Mentalität "Ich will der Allerbeste sein" natürlich Schade.
        Deswegen gibt es nun ein Seasonales System zusätzlich dazu. Das seasonale System ist prinzipiell dasselbe wie das normale Rangsystem, bloß auf ein Jahr limitiert. Keine Angst, es ersetzt nicht das Rangsystem,
        es ist einfach zusätzlich. Im Gegensatz zu den 25 Leveln gibt es nur 6 Divisionen. In diesen steigt ihr mit der Zeit auf und die oberste Phönix Division wird aus den besten 15 Spielern gebildet.
        Genaueres könnt ihr im Season Tab nachlesen.</p>
      <p>Die Seaons habe, im Gegensatz zu dem Rangsystem, keinen Einfluss auf euere Rechte und Befugnisse. Alles was ihr am Ende einer Season erhaltet ist rein kosmetisch. Neben dem Ruhm versteht sich. In der ersten Season gibt es Profilrahmen für die Webseite und Game-Server Skins.</p>
      <p>Sowohl der beste Spieler der Season, als auch jeder Spieler der Prestige V erreicht hat, erhält einen <i>Apex Channel</i>. Ganz oben thronend ist es die ultimative Belohnung und der Beweis, dass dieser
        Spieler an der Spitze der FirePhenix Community steht.</p>
      <p>Eine weitere Möglichkeit bot sich an, mit einem neuen Rangsystem. Dieses hat nun auch eine volle Unterstützung für:</p>
     <h3>Discord</h3>
     <p>Von einem absoluten Notfall-Ort in Zeiten wo der TeamSpeak nicht erreichbar ist, wurde der Discord nun aufpoliert. Versteht mich nicht falsch, ich will auf keinen Fall TeamSpeak
        ablösen. Nichts liegt mir ferner. Aber mit der Zeit nutzen immer mehr Leute Discord und da sollte FirePhenix einen anbieten.</p>
     <p>Der Discord sollte in den meisten Fällen Feature-Parität mit dem TeamSpeak haben. Das bedeutet, dass ihr die gleichen Rechte und Möglichkeiten habt wie im TeamSpeak. Move-Rechte, Move-Shields
        Channel-Erstellung mit den zusätzlichen Benefits von Discord (Sticker, Streaming, Soundboard), aber natürlich auch seinen Nachteilen (Datenschutz, Resourcennutzung). Das Rangsystem trackt eure Zeit genauso.</p>
     <p>Als extra Feature bietet der Discord auch einen 'Frag Ember' Channel. Hier könnt ihr der netten Phönix-KI Ember fragen stellen, die sie nach bestem gewissen beantwortet. Ohne Gewähr versteht sich.</p>
     <p>Beachtet aber, dass ihr, um euren TeamSpeak Rang auf Discord zu erhalten, den Discord Account und euren TeamSpeak Account verbinden müsst. Das ganze ist kinderleicht bei Mein Profil zu machen.</p>
     <p>Mit den Änderungen kann ich stolz nun sagen, dass der Discord der offizielle FirePhenix Discord ist. Mich werdet ihr aber wohl trotzdem meist eher auf dem TeamSpeak antreffen. Die Moderation von dem Discord Server übernimmt Flippster98, Philip.</p>
     <h3>TTT Server</h3>
     <p>Schon fast eine Legende mit vielen guten erlebten Zeiten, ist der TTT Server nun auch wieder da! Mit allen alten, heißgeliebten Features. Alte Maps, angepasste Waffen, Skins und natürlich Gambling!
        Das ganze poliert unter der Haube mit TTT2 als Grundstein, aber ohne neue Rollen. Just the Basics. Traitor, Detective, Innocent. Ich hoffe ihr könnt so und auf LAN-Partys viel Spaß damit haben!</p>
     <p>Desweiteren ist die Season Eins Belohnung TTT Skins! Ihr könnt sie bereits im Ingame Shop begutachten. Nach Ende der Season könnt ihr Sie dann in eurem Profil einlösen.</p>
     <h3>Abschlussworte</h3>
     <p>So, das war eine Menge Text! Ich hoffe es sind einige Features dabei, die euch erfreuen können, ich habe sicher auch einige vergessen. Ich hoffe ihr habt viel Spaß mit dem FirePhenix Rebirth!</p>
     <p>Wenn ihr Bugs findet, Fragen habt oder sonstige Anliegen, pm me!</p>
     <p>Lukas ~ Admin</p>
     `,
    images: [],
    added: [
      'Neues Website Design',
      'Neuer Website Techstack',
      'Mobile Layout',
      'Steam OpenID Login',
      'TTT-Server',
      'Discord-Server',
      'Discord-Rankingsystem',
      'Permanente Channel',
      'Seasons',
      'Apex-Channel',
      'FileTransfer',
      'Seasonale Belohnungen',	
    ],
    changed: [],
    fixed: [],
    removed: [
      'TeamSpeak Login',
      'Gruppen-Channel',
      'Icon-Picker',
    ],
  },
]);
</script>

<style scoped>
.patchnotes-wiki {
  color: var(--clr-text-secondary);
}

.patchnotes-title {
  color: var(--clr-text-primary);
  margin-bottom: 2rem;
  font-size: 1.8rem;
  border-bottom: 1px solid var(--clr-primary-transparent);
  padding-bottom: 0.5rem;
}

.patchnote-wrapper {
  margin-bottom: 4rem;
}

.patchnote-card {
  background: var(--clr-surface-2);
  border: 2px solid var(--clr-border);
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.patchnote-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--clr-primary) 0%, var(--clr-primary-light) 100%);
}

.patchnote-card:hover {
  transform: translateY(-4px);
  border-color: var(--clr-border-strong);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.patchnote-header {
  position: relative;
  padding: 3rem 3rem 2rem;
  background: linear-gradient(135deg, var(--clr-surface-3) 0%, var(--clr-surface-2) 100%);
  border-bottom: 1px solid var(--clr-border);
}

.patchnote-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.patchnote-version {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--clr-primary-light);
  margin: 0;
  letter-spacing: -0.5px;
}

.patchnote-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.patchnote-date {
  color: var(--clr-text-secondary);
  font-size: 1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background: var(--clr-surface);
  border-radius: 20px;
  border: 1px solid var(--clr-border);
}

.patchnote-header-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, var(--clr-primary-transparent) 0%, transparent 70%);
  opacity: 0.3;
}

.patchnote-content {
  padding: 3rem;
}

.patchnote-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.patchnote-image {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 2px solid var(--clr-border);
  transition: transform 0.3s ease;
}

.patchnote-image:hover {
  transform: scale(1.02);
  border-color: var(--clr-border-strong);
}

.patchnote-changes-wrapper {
  margin-top: 3rem;
  padding: 3rem;
  background: var(--clr-surface);
  border-top: 2px solid var(--clr-border);
}

.changes-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--clr-text-primary);
  margin: 0 0 2.5rem;
  text-align: center;
}

.patchnote-changes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

.change-section {
  background: var(--clr-surface-2);
  border-radius: 12px;
  padding: 2rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.change-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
}

.added-section {
  border-color: var(--clr-added);
}

.added-section::before {
  background: var(--clr-added);
}

.changed-section {
  border-color: var(--clr-primary);
}

.changed-section::before {
  background: var(--clr-primary);
}

.fixed-section {
  border-color: var(--clr-fixed);
}

.fixed-section::before {
  background: var(--clr-fixed);
}

.removed-section {
  border-color: var(--clr-error);
}

.removed-section::before {
  background: var(--clr-error);
}

.change-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.change-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  color: var(--clr-text-primary);
}

.added-section .change-icon {
  background: var(--clr-added);
}

.changed-section .change-icon {
  background: var(--clr-primary);
}

.fixed-section .change-icon {
  background: var(--clr-fixed);
}

.removed-section .change-icon {
  background: var(--clr-error);
}

.change-label {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--clr-text-primary);
}

.change-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.change-item {
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--clr-border);
  color: var(--clr-text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  position: relative;
  padding-left: 1.5rem;
}

.change-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--clr-primary);
  font-weight: bold;
}

.change-item:last-child {
  border-bottom: none;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .patchnotes-title {
    font-size: 1.6rem;
  }
  
  .patchnote-card {
    border-radius: 12px;
  }
  
  .patchnote-header,
  .patchnote-content,
  .patchnote-changes-wrapper {
    padding: 2rem;
  }
  
  .patchnote-changes {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .patchnotes-title {
    font-size: 1.5rem;
  }
  
  .patchnote-wrapper {
    margin-bottom: 3rem;
  }
  
  .patchnote-header,
  .patchnote-content,
  .patchnote-changes-wrapper {
    padding: 1.5rem;
  }
  
  .patchnote-header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .patchnote-version {
    font-size: 1.8rem;
  }
  
  .patchnote-images {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 2rem 0;
  }
  
  .change-section {
    padding: 1.5rem;
  }
  
  .changes-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .patchnote-header,
  .patchnote-content,
  .patchnote-changes-wrapper {
    padding: 1rem;
  }
  
  .patchnote-version {
    font-size: 1.5rem;
  }
  
  .change-section {
    padding: 1rem;
  }
}
</style>

<style>
.patchnote-blog {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--clr-text-secondary);
}

.patchnote-blog h3 {
  color: var(--clr-primary-light);
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.5rem;
}

.patchnote-blog h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 2px;
  background: var(--clr-primary);
}

.patchnote-blog h4 {
  color: var(--clr-text-primary);
  margin-top: 2rem;
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.patchnote-blog p {
  margin-bottom: 1.2rem;
  color: var(--clr-text-secondary);
}

.patchnote-blog h3:first-child + p {
  font-size: 1.15rem;
  color: var(--clr-text-secondary);
  margin-bottom: 1.5rem;
}

.patchnote-blog u {
  text-decoration: none;
  background: linear-gradient(transparent 50%, var(--clr-primary-transparent) 50%);
  color: var(--clr-primary-light);
  padding: 0 0.2rem;
}

.patchnote-blog i {
  color: var(--clr-primary-light);
  font-style: italic;
}

.patchnote-blog strong {
  color: var(--clr-text-primary);
  font-weight: 700;
}

@media (max-width: 768px) {
  .patchnote-blog {
    font-size: 1rem;
    line-height: 1.7;
  }
  
  .patchnote-blog h3 {
    font-size: 1.2rem;
    margin-top: 2rem;
  }
  
  .patchnote-blog h4 {
    font-size: 1.1rem;
    margin-top: 1.5rem;
  }
  .patchnote-blog > p:first-of-type {
    font-size: 1.05rem;
  }
}
</style>