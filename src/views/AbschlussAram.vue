<!-- views/AbschlussAram.vue -->
<template>
  <div class="aram-page">
    <div class="snow snow-far"></div>
    <div class="snow snow-near"></div>

    <header class="aram-hero">
      <div class="hero-backdrop"></div>
      <div class="hero-content">
        <p class="hero-eyebrow">
          <font-awesome-icon :icon="['fas', 'snowflake']" />
          FirePhenix Community
        </p>
        <h1>Abschluss-Aram</h1>
        <p class="hero-tagline">
          Wenn man einmal ein Abschluss-Aram begonnen hat, gibt es kein Zurück mehr.
          Die Heulende Schlucht ruft.
        </p>
      </div>
    </header>

    <section class="aram-section records-section">
      <h2 class="section-title gott-heading">Heartsteel Gott</h2>
      <div class="mythic-divider" aria-hidden="true"></div>
      <p class="section-subtitle">
        Zwei Modi, zwei ewige Rekorde. Wer die meisten Heartsteel-Stacks türmt, thront über der Schlucht.
      </p>

      <div class="monument">
        <svg
          v-for="corner in ['c-tl', 'c-tr', 'c-bl', 'c-br']"
          :key="corner"
          class="corner"
          :class="corner"
          viewBox="0 0 56 56"
          aria-hidden="true"
        >
          <path d="M4 54 V20 L20 4 H54" />
          <path d="M12 54 V24 L24 12 H54" />
          <rect x="16.5" y="16.5" width="7" height="7" transform="rotate(45 20 20)" />
        </svg>

        <div class="monument-inner">
          <article class="feat primary">
            <div class="halo-wrap">
              <svg class="halo" viewBox="0 0 240 150" aria-hidden="true">
                <g class="rays">
                  <line x1="120" y1="58" x2="120" y2="14" />
                  <line x1="138" y1="60" x2="145" y2="36" />
                  <line x1="102" y1="60" x2="95" y2="36" />
                  <line x1="155" y1="67" x2="177" y2="29" />
                  <line x1="85" y1="67" x2="63" y2="29" />
                  <line x1="169" y1="78" x2="187" y2="61" />
                  <line x1="71" y1="78" x2="53" y2="61" />
                  <line x1="181" y1="93" x2="219" y2="71" />
                  <line x1="59" y1="93" x2="21" y2="71" />
                  <line x1="188" y1="110" x2="212" y2="103" />
                  <line x1="52" y1="110" x2="28" y2="103" />
                </g>
                <circle class="ring" cx="120" cy="128" r="52" />
                <circle class="ring ring-fine" cx="120" cy="128" r="59" />
              </svg>
              <img :src="heartsteelIcon" alt="Heartsteel" class="relic" />
            </div>
            <p class="feat-mode">{{ records[0].mode }}</p>
            <p class="feat-value">{{ records[0].value }}</p>
            <p class="feat-unit">Heartsteel-Stacks</p>
            <router-link :to="playerRoute(records[0].holderId)" class="plaque plaque-gold">
              <font-awesome-icon :icon="['fas', 'crown']" />
              <span>{{ playerNames[records[0].holderId] }}</span>
            </router-link>
          </article>

          <div class="monument-rule" aria-hidden="true"></div>

          <article class="feat secondary">
            <div class="mini-ring">
              <img :src="heartsteelIcon" alt="Heartsteel" class="relic relic-small" />
            </div>
            <p class="feat-mode">{{ records[1].mode }}</p>
            <p class="feat-value">{{ records[1].value }}</p>
            <p class="feat-unit">Heartsteel-Stacks</p>
            <router-link :to="playerRoute(records[1].holderId)" class="plaque">
              <font-awesome-icon :icon="['fas', 'crown']" />
              <span>{{ playerNames[records[1].holderId] }}</span>
            </router-link>
          </article>
        </div>
      </div>
    </section>

    <section class="aram-section rules-section">
      <h2 class="section-title">
        <font-awesome-icon :icon="['fas', 'scroll']" />
        Regelwerk
      </h2>
      <p class="section-subtitle">
        Vorab muss gesagt werden, dass man einige Zeit einplanen sollte. Das Ganze findet,
        wie der Name schon sagt, in der Heulenden Schlucht statt und im Prinzip geht es
        eigentlich nur darum, einen Sieg einzufahren &ndash; mit ein paar Komplikationen.
      </p>

      <ol class="rules-list">
        <li v-for="rule in rules" :key="rule.number" class="rule-item">
          <div class="rule-number">{{ rule.number }}</div>
          <div class="rule-body">
            <p class="rule-text">{{ rule.text }}</p>
            <ul v-if="rule.subrules" class="subrules">
              <li v-for="sub in rule.subrules" :key="sub.number">
                <span class="subrule-number">{{ sub.number }}</span>
                <span>{{ sub.text }}</span>
              </li>
            </ul>
          </div>
        </li>
      </ol>

      <div class="hardcore">
        <p class="hardcore-tag">
          <font-awesome-icon :icon="['fas', 'fire']" />
          Hardcore
        </p>
        <h3>Abschluss-Aram+</h3>
        <p class="hardcore-sub">
          Für die langen Abende, an denen ein Abschluss-Aram nicht genug ist.
        </p>
        <p class="hardcore-intro">
          Es steht natürlich außer Frage, dass es zu einfach wäre, einfach nur zwei
          Abschluss-Arams hintereinander zu spielen. Deshalb gilt im Abschluss-Aram+:
        </p>
        <ul class="subrules hardcore-steps">
          <li>
            <span class="subrule-number">+1.</span>
            <span>Zuerst wird ein Abschluss-Aram ganz normal gespielt.</span>
          </li>
          <li>
            <span class="subrule-number">+2.</span>
            <span>
              Das zweite Abschluss-Aram muss mit dem zweiten Game gewonnen werden, ansonsten
              beginnt man wieder von vorne!
            </span>
          </li>
          <li>
            <span class="subrule-number">+3.</span>
            <span>Die Most-Damage-Regel entfällt &ndash; bei beiden Abschluss-Arams.</span>
          </li>
        </ul>
      </div>

    </section>

    <section class="aram-section creators-section">
      <h2 class="section-title">
        <font-awesome-icon :icon="['fas', 'users']" />
        Die Schöpfer
      </h2>
      <p class="section-subtitle">Erdacht in der Heulenden Schlucht, geschmiedet auf FirePhenix.</p>

      <div class="creators-grid">
        <router-link
          v-for="creator in creators"
          :key="creator.id"
          :to="playerRoute(creator.id)"
          class="creator-card"
        >
          <div class="creator-avatar">
            <font-awesome-icon :icon="['fas', 'snowflake']" />
          </div>
          <div class="creator-info">
            <span class="creator-name">{{ playerNames[creator.id] }}</span>
          </div>
          <span class="creator-cta">Profil ansehen</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import heartsteelIcon from '../assets/images/games/heartsteel.png';

interface SubRule {
  number: string;
  text: string;
}

interface Rule {
  number: string;
  text: string;
  subrules?: SubRule[];
}

const PRIVATEJOKER_ID = 98;
const FLIPPSTER_ID = 79;
const LUKAS_ID = 1;

// Fallbacks until the live names arrive from the ranking API
const playerNames = reactive<Record<number, string>>({
  [PRIVATEJOKER_ID]: 'PrivateJoker',
  [FLIPPSTER_ID]: 'Flippster',
  [LUKAS_ID]: 'Lukas',
});

const playerRoute = (id: number) => `/ranking/player-${id}`;

onMounted(() => {
  Object.keys(playerNames).forEach(async (key) => {
    const id = Number(key);
    try {
      const response = await fetch(`/api/ranking/profile?id=${id}`);
      if (!response.ok) return;
      const profile = await response.json();
      if (typeof profile?.name === 'string' && profile.name.trim()) {
        playerNames[id] = profile.name;
      }
    } catch {
      // keep fallback name
    }
  });
});

const records = [
  {
    mode: 'ARAM Mayhem',
    value: '26.859',
    holderId: PRIVATEJOKER_ID,
  },
  {
    mode: 'Normales ARAM',
    value: '2.201',
    holderId: PRIVATEJOKER_ID,
  },
];

const creators = [
  { id: PRIVATEJOKER_ID },
  { id: FLIPPSTER_ID },
  { id: LUKAS_ID },
];

const rules: Rule[] = [
  {
    number: '1.',
    text: 'Das erste Aram zählt nicht!',
    subrules: [
      { number: '1.1.', text: 'Dieses absichtlich zu verlieren ist natürlich nicht erlaubt!' },
      {
        number: '1.2.',
        text: 'Wenn man nach dem ersten Aram einen Sieg einfährt, gilt das Abschluss-Aram als beendet.',
      },
    ],
  },
  {
    number: '2.',
    text: 'Ein Spieler aus der Gruppe muss Most-Damage vom Team haben!',
    subrules: [
      {
        number: '2.1.',
        text: 'Sobald die Gruppe aus 4 oder mehr Spielern besteht, muss ein Spieler Most-Damage im gesamten Spiel haben!',
      },
    ],
  },
  { number: '3.', text: 'Es wird niemals aufgegeben!' },
  {
    number: '4.',
    text: 'Der Nexus darf nicht angegriffen werden!',
    subrules: [
      { number: '4.1.', text: 'Nur die Minions dürfen das Spiel für einen entscheiden!' },
      { number: '4.2.', text: 'Gegnerische Minions dürfen gecleared werden!' },
    ],
  },
  {
    number: '5.',
    text: 'Wenn ein Call von einem gemacht wird und mindestens einer aus der Gruppe „Call is Call" antwortet, dann muss der Call durchgezogen werden!',
    subrules: [
      {
        number: '5.1.',
        text: 'Sollte keiner den Call bestätigen, aber auch keiner Widerspruch einlegen, dann wird der Call trotzdem ausgeführt.',
      },
      {
        number: '5.2.',
        text: 'Bei gleichzeitigem Call und Widerspruch gewinnt der Heartsteel-Gott des jeweiligen Modus und/oder darf entscheiden.',
      },
    ],
  },
  {
    number: '6.',
    text: 'Tanks müssen mit Heartsteel gebaut werden!',
    subrules: [
      {
        number: '6.1.',
        text: 'Sollte der Fall eintreten, dass die Mehrheit der Lobby Heartsteel baut, müssen alle Heartsteel bauen!',
      },
    ],
  },
  {
    number: '7.',
    text: 'Sollte während des Abschluss-Aram eine Person der Gruppe joinen, wird das gesamte Abschluss-Aram resettet und man beginnt wieder von vorne!',
  },
  {
    number: '8.',
    text: 'Für das Abschluss-Aram ist die Kommunikation unabdingbar.',
    subrules: [
      { number: '8.1.', text: 'Nicht ansprechbar sein ist eine Strafe!' },
    ],
  },
  {
    number: '9.',
    text: 'Regelbrüche jeglicher Art führen dazu, dass das laufende Game als ungültig eingestuft wird!',
    subrules: [
      {
        number: '9.1.',
        text: 'Der Spieler, der für den Regelbruch verantwortlich ist, wird natürlich bestraft!',
      },
      {
        number: '9.1.1.',
        text: 'Im nächsten Game wird dessen Champion vom Rest der Gruppe ausgesucht!',
      },
    ],
  },
];
</script>

<style scoped>
.aram-page {
  --ice-bright: #bfeaff;
  --ice-light: #7dd3fc;
  --ice-mid: #38bdf8;
  --ice-deep: rgba(56, 189, 248, 0.16);
  --ice-border: rgba(125, 211, 252, 0.22);
  --ice-border-strong: rgba(125, 211, 252, 0.45);
  --ice-surface: rgba(10, 25, 47, 0.82);

  /* engraved-metal language: thin linework, muted gold reserved for records */
  --engrave: rgba(158, 196, 226, 0.42);
  --engrave-strong: rgba(196, 224, 246, 0.75);
  --gold: #c9ad72;
  --gold-dim: rgba(201, 173, 114, 0.55);
  --font-myth: Georgia, 'Palatino Linotype', 'Book Antiqua', 'Times New Roman', serif;

  position: relative;
  min-height: 100vh;
  padding: 40px 2rem 5rem;
  overflow: hidden;
  color: var(--clr-text-secondary);
  background: linear-gradient(180deg, #070f1e 0%, #0a1830 55%, #08111f 100%);
}

/* falling snow */
.snow {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    radial-gradient(2px 2px at 20% 15%, rgba(255, 255, 255, 0.8), transparent 55%),
    radial-gradient(1.6px 1.6px at 45% 40%, rgba(255, 255, 255, 0.7), transparent 55%),
    radial-gradient(2.2px 2.2px at 70% 10%, rgba(255, 255, 255, 0.75), transparent 55%),
    radial-gradient(1.4px 1.4px at 85% 55%, rgba(255, 255, 255, 0.6), transparent 55%),
    radial-gradient(1.8px 1.8px at 10% 70%, rgba(255, 255, 255, 0.7), transparent 55%),
    radial-gradient(1.5px 1.5px at 58% 82%, rgba(255, 255, 255, 0.6), transparent 55%);
  background-size: 620px 620px;
}

.snow-far {
  opacity: 0.4;
  animation: snowfall 34s linear infinite;
}

.snow-near {
  opacity: 0.7;
  background-size: 430px 430px;
  animation: snowfall 21s linear infinite;
}

@keyframes snowfall {
  from {
    background-position: 0 -620px;
  }
  to {
    background-position: -140px 620px;
  }
}

/* ---------- hero ---------- */
.aram-hero {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 3rem auto 3.5rem;
  border: 1px solid var(--engrave);
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

.hero-backdrop {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image: url('../assets/images/games/freljord_bridge.png');
  background-size: cover;
  background-position: center 30%;
}

.hero-backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(90% 80% at 50% 100%, rgba(6, 13, 28, 0.55), transparent 70%),
    linear-gradient(180deg, rgba(6, 13, 28, 0.35) 0%, rgba(6, 13, 28, 0.78) 100%);
}

.hero-content {
  padding: 5.5rem 2rem 5rem;
  text-align: center;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.1rem;
  padding: 0.4rem 1rem;
  border: 1px solid var(--engrave);
  background: rgba(8, 20, 38, 0.72);
  color: var(--engrave-strong);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
}

.aram-hero h1 {
  margin: 0 0 1rem;
  font-family: var(--font-myth);
  font-weight: 500;
  font-size: 3.5rem;
  letter-spacing: 0.06em;
  color: #ecf5fd;
  text-shadow: 0 2px 26px rgba(3, 8, 18, 0.9);
}

.hero-tagline {
  max-width: 560px;
  margin: 0 auto;
  color: var(--clr-white-light);
  font-size: 1.12rem;
  line-height: 1.65;
  text-shadow: 0 2px 14px rgba(4, 10, 22, 0.9);
}

/* ---------- shared section styles ---------- */
.aram-section {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto 3.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  margin: 0 0 0.6rem;
  color: var(--clr-text-primary);
  font-family: var(--font-myth);
  font-weight: 500;
  letter-spacing: 0.06em;
  font-size: 1.9rem;
  text-align: center;
}

.section-title svg {
  font-size: 1.35rem;
  color: var(--engrave-strong);
}

.section-subtitle {
  max-width: 720px;
  margin: 0 auto 2rem;
  color: var(--clr-text-secondary);
  font-size: 1.02rem;
  line-height: 1.6;
  text-align: center;
}

/* ---------- Heartsteel Gott monument ----------
   Engraved metal linework instead of glow: geometric shapes
   (line, diamond, circle), sharp corners, gold only as reward color. */
.gott-heading {
  font-family: var(--font-myth);
  font-weight: 500;
  letter-spacing: 0.08em;
}

.mythic-divider {
  position: relative;
  width: min(360px, 70%);
  height: 14px;
  margin: 0.3rem auto 1.1rem;
  background:
    linear-gradient(90deg, transparent, var(--engrave)) left center / calc(50% - 20px) 1px no-repeat,
    linear-gradient(270deg, transparent, var(--engrave)) right center / calc(50% - 20px) 1px no-repeat;
}

.mythic-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  transform: translate(-50%, -50%) rotate(45deg);
  border: 1px solid var(--gold-dim);
}

.monument {
  position: relative;
  max-width: 960px;
  margin: 0 auto;
  padding: 3.2rem 3rem 2.8rem;
  background: rgba(9, 19, 36, 0.78);
  border: 1px solid var(--engrave);
}

/* inner offset frame, classic double linework */
.monument::before {
  content: '';
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(158, 196, 226, 0.14);
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 46px;
  height: 46px;
  fill: none;
  stroke: var(--engrave-strong);
  stroke-width: 1.5;
  z-index: 1;
}

.corner rect {
  stroke: var(--gold-dim);
}

.c-tl {
  top: -4px;
  left: -4px;
}

.c-tr {
  top: -4px;
  right: -4px;
  transform: scaleX(-1);
}

.c-bl {
  bottom: -4px;
  left: -4px;
  transform: scaleY(-1);
}

.c-br {
  bottom: -4px;
  right: -4px;
  transform: scale(-1);
}

.monument-inner {
  display: grid;
  grid-template-columns: 1.3fr 1px 1fr;
  gap: 2.75rem;
  align-items: center;
}

.monument-rule {
  position: relative;
  width: 1px;
  height: 86%;
  justify-self: center;
  background: linear-gradient(180deg, transparent, var(--engrave) 22%, var(--engrave) 78%, transparent);
}

.monument-rule::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  transform: translate(-50%, -50%) rotate(45deg);
  border: 1px solid var(--engrave-strong);
  background: rgba(9, 19, 36, 1);
}

.feat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* halo of engraved rays over the featured relic */
.halo-wrap {
  position: relative;
  width: 240px;
  height: 184px;
  margin-bottom: 0.4rem;
}

.halo {
  position: absolute;
  top: 0;
  left: 0;
  width: 240px;
  height: 150px;
  fill: none;
}

.halo .rays line {
  stroke: var(--engrave);
  stroke-width: 1.2;
  stroke-linecap: square;
}

.halo .rays line:nth-child(odd) {
  stroke: rgba(158, 196, 226, 0.28);
}

.halo .ring {
  stroke: var(--engrave);
  stroke-width: 1;
}

.halo .ring-fine {
  stroke: rgba(158, 196, 226, 0.2);
  stroke-dasharray: 2 5;
}

.relic {
  position: absolute;
  left: 50%;
  top: 128px;
  transform: translate(-50%, -50%);
  width: 88px;
  height: 88px;
  border: 1px solid var(--gold-dim);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.55);
}

.mini-ring {
  position: relative;
  width: 108px;
  height: 108px;
  margin-bottom: 1rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--engrave);
  border-radius: 50%;
}

.relic-small {
  position: static;
  transform: none;
  width: 72px;
  height: 72px;
}

.feat-mode {
  margin: 0.4rem 0 0.9rem;
  color: var(--engrave-strong);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}

.feat-value {
  margin: 0;
  font-family: var(--font-myth);
  font-weight: 400;
  font-size: 4.3rem;
  line-height: 1;
  color: #edf5fc;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
}

.secondary .feat-value {
  font-size: 2.9rem;
  color: #d3e2ef;
}

.feat-unit {
  margin: 0.5rem 0 1.4rem;
  color: var(--clr-text-secondary);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

/* engraved name plaque, beveled ends */
.plaque {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 1.8rem;
  border: 1px solid var(--engrave);
  background: rgba(14, 26, 46, 0.85);
  clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%);
  font-family: var(--font-myth);
  font-size: 1.05rem;
  letter-spacing: 0.04em;
  color: #dcebf7;
  transition: background 0.2s ease, color 0.2s ease;
}

.plaque svg {
  font-size: 0.85rem;
  color: var(--engrave-strong);
}

.plaque:hover {
  background: rgba(24, 40, 66, 0.95);
  color: var(--clr-white);
}

.plaque-gold {
  border-color: var(--gold-dim);
  color: #e6d8b0;
}

.plaque-gold svg {
  color: var(--gold);
}

.plaque-gold:hover {
  background: rgba(44, 38, 24, 0.55);
  color: #f3e9cc;
}

/* ---------- rules ---------- */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rule-item {
  display: flex;
  gap: 1.1rem;
  padding: 1.15rem 1.4rem;
  border: 1px solid var(--ice-border);
  border-radius: 10px;
  background: var(--ice-surface);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.rule-item:hover {
  border-color: var(--ice-border-strong);
  background: rgba(13, 31, 56, 0.88);
}

.rule-number {
  flex: 0 0 2.6rem;
  height: 2.6rem;
  display: grid;
  place-items: center;
  border: 1px solid var(--ice-border-strong);
  border-radius: 8px;
  background: var(--ice-deep);
  color: var(--ice-bright);
  font-weight: 800;
}

.rule-body {
  min-width: 0;
  align-self: center;
}

.rule-text {
  margin: 0;
  color: var(--clr-text-primary);
  font-size: 1.05rem;
  line-height: 1.5;
}

.subrules {
  margin: 0.65rem 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.subrules li {
  display: flex;
  gap: 0.6rem;
  color: var(--clr-text-secondary);
  line-height: 1.5;
}

.subrule-number {
  flex: 0 0 auto;
  color: var(--ice-light);
  font-weight: 700;
}

/* Abschluss-Aram+ : the hardcore banner. Ember linework against the
   ice theme signals danger; same engraved language as the monument. */
.hardcore {
  position: relative;
  margin-top: 2.4rem;
  padding: 2.1rem 2rem 1.8rem;
  border: 1px solid rgba(224, 122, 95, 0.42);
  background: rgba(30, 14, 15, 0.66);
  text-align: center;
}

.hardcore::before {
  content: '';
  position: absolute;
  inset: 7px;
  border: 1px solid rgba(224, 122, 95, 0.16);
  pointer-events: none;
}

.hardcore-tag {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0.3rem 1.1rem;
  border: 1px solid rgba(224, 122, 95, 0.55);
  background: #140b0e;
  color: #e8926c;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
}

.hardcore h3 {
  margin: 0.3rem 0 0.2rem;
  font-family: var(--font-myth);
  font-weight: 500;
  font-size: 1.7rem;
  letter-spacing: 0.05em;
  color: #f3d9c8;
}

.hardcore-sub {
  margin: 0 0 1.1rem;
  font-family: var(--font-myth);
  font-style: italic;
  color: rgba(232, 172, 140, 0.75);
}

.hardcore-intro {
  max-width: 640px;
  margin: 0 auto 1rem;
  line-height: 1.6;
}

.hardcore-steps {
  max-width: 560px;
  margin: 0 auto;
  text-align: left;
}

.hardcore .subrule-number {
  min-width: 2.1rem;
  color: #e8926c;
}

/* ---------- creators ---------- */
.creators-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.creator-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.9rem;
  padding: 1.9rem 1.5rem;
  border: 1px solid var(--engrave);
  background: rgba(9, 19, 36, 0.78);
  color: var(--clr-text-secondary);
  text-align: center;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.creator-card:hover {
  border-color: var(--engrave-strong);
  background: rgba(13, 26, 47, 0.9);
  color: var(--clr-text-secondary);
}

.creator-avatar {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border: 1px solid var(--engrave);
  transform: rotate(45deg);
  color: var(--engrave-strong);
  font-size: 1.25rem;
}

.creator-avatar svg {
  transform: rotate(-45deg);
}

.creator-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.creator-name {
  color: var(--clr-text-primary);
  font-family: var(--font-myth);
  font-size: 1.3rem;
  letter-spacing: 0.03em;
}

.creator-cta {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--engrave-strong);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.creator-card:hover .creator-cta {
  border-bottom-color: var(--engrave-strong);
}

/* ---------- responsive / motion ---------- */
@media (max-width: 860px) {
  .creators-grid {
    grid-template-columns: 1fr;
  }

  .monument {
    padding: 2.4rem 1.5rem 2rem;
  }

  .monument-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .monument-rule {
    width: 70%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--engrave) 22%, var(--engrave) 78%, transparent);
  }

  .aram-hero h1 {
    font-size: 2.4rem;
  }

  .hero-content {
    padding: 4rem 1.25rem 3.5rem;
  }

  .feat-value {
    font-size: 3.4rem;
  }
}

@media (max-width: 640px) {
  .aram-page {
    padding: 40px 1rem 3rem;
  }

  .rule-item {
    flex-direction: column;
    gap: 0.7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .snow {
    animation: none;
  }
}
</style>
