<template>
  <div class="support-wiki">
    <h2>Support & FAQ</h2>
    <p>
      Häufig gestellte Fragen und Hilfe bei Problemen auf unserem Server.
      Solltest du hier keine Antwort finden, kontaktiere uns bitte über einer der unteren Möglichkeiten.
    </p>

    <div class="faq-search">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="search-icon" />
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Frage suchen..." 
        class="search-input" 
      />
    </div>

    <div class="faq-section">
      <div 
        v-for="(question, index) in filteredQuestions" 
        :key="index" 
        class="faq-item"
      >
        <div 
          class="faq-question" 
          @click="toggleQuestion(index)"
          :class="{ active: activeQuestions.includes(index) }"
        >
          <span>{{ question.question }}</span>
          <font-awesome-icon 
            :icon="activeQuestions.includes(index) ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" 
            class="chevron-icon" 
          />
        </div>
        <div 
          class="faq-answer"
          :class="{ active: activeQuestions.includes(index) }"
        >
          <div>{{ question.answer }}</div>
        </div>
      </div>
    </div>

    <h2>Support kontaktieren</h2>
    <div class="support-options">
      <div class="support-option">
        <font-awesome-icon icon="fa-brands fa-discord" class="support-icon discord" />
        <div>
          <h4>Discord</h4>
          <p>Tritt unserem Discord-Server bei und stelle deine Frage einfach einem Team-Mitglied!</p>
          <a href="https://discord.gg/sT4NPRQSAT" class="support-link">Discord beitreten</a>
        </div>
      </div>

      <div class="support-option">
        <font-awesome-icon icon="fa-solid fa-envelope" class="support-icon email" />
        <div>
          <h4>E-Mail</h4>
          <p>Für komplexere Anfragen kannst du uns eine E-Mail schreiben.</p>
          <a href="mailto:admin@firephenix.de" class="support-link">admin@firephenix.de</a>
        </div>
      </div>
      
      <div class="support-option">
        <font-awesome-icon icon="fa-solid fa-headset" class="support-icon teamspeak" />
        <div>
          <h4>TeamSpeak</h4>
          <p>Du findest unsere Support-Mitarbeiter auch auf unserem TeamSpeak Server.</p>
          <a href="ts3server://firephenix.de?port=9987" class="support-link">firephenix.de</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const activeQuestions = ref([]);

const questions = [
  { 
    question: 'Wann finden Server-Restarts statt?', 
    answer: 'Unser TeamSpeak Server wird jeden Montag um 4:30 Uhr neu gestartet. Der Garry\'s Mod Server wird jeden Tag um 4:30 Uhr neu gestartet. Die restlichen Dienste werden nach Bedarf neu gestartet.'
  }, 
  { 
    question: 'Ich kann mich nicht mit einem der Server verbinden, was kann ich tun?', 
    answer: 'Schau gerne auf unserer Server Status Seite vorbei, um zu sehen, ob der Server online ist. Sollten alle Server online sein, aber du kannst dich trotzdem nicht verbinden, überprüfe deine Internetverbindung. Wenn das Problem weiterhin besteht, kontaktiere unseren Support.'
  },
  { 
    question: 'Ich habe meinen TeamSpeak / Discord Account verloren, was kann ich tuen?', 
    answer: 'Wir können leider auch nicht deine Accounts wiederherstellen. Denke deswegen immer daran starke Passwörter und ein myTeamSpeak Konto zu verwenden. Was wir aber anbieten können, ist deine gesammelte Zeit auf einen neuen Account zu übertragen. Hierbei wird dein alter Account dann für das Rangsystem deaktiviert. Melde dich hierfür bei unserem Support.'
  },
  { 
    question: 'Wieso muss ich mich mit Steam einloggen um mein Profil zu managen?', 
    answer: 'Wir benutzten Steams OpenID Integration aus zwei Gründen. Zum einen bietet es eine sichere und einfache Möglichkeit, sich bei unserem System anzumelden. Um den sicheren Login kümmert sich Steam, wir müssen also keine Sicherheits relevanten Daten speichern: Wir erhalten von Steam nur deine Steam-ID. Desweiteren bietet dies eine einfache Möglichkeit, dir Belohnungen auf unserem Garrys Mod Server gutzuschreiben.'
  },
  { 
    question: 'Andere Nutzer bewegen mich, ich möchte das aber nicht. Was kann ich tun?', 
    answer: 'Melde dich unter dem Reiter "Mein Profil" an und gehe zu den Einstellungen. Dort kannst du die Option "MoveShield" aktivieren. Dies verhindert, dass andere Spieler dich bewegen können. Melde uns zusätzlich gerne den Spieler, der dich gestört hat, damit wir gegebenenfalls Maßnahmen ergreifen können.'
  },
  {
    question: 'Ich möchte nicht, dass meine Aktivitäten auf den Servern getrackt werden. Was kann ich tun?', 
    answer: 'Melde dich gerne bei unserem Support und wir deaktivieren dein Profil. Dein Account wird dann nicht mehr getracked. Bitte beachte, dass du dann auch keine Belohnungen mehr erhalten kannst.',
  },
  { 
    question: 'Ich habe einen Bug gefunden, was kann ich tun?', 
    answer: 'Wir freuen uns immer über Bug-Reports! Melde dich dafür einfach bei unserem Support und beschreibe den Bug so genau wie möglich. Wir werden uns dann schnellstmöglich darum kümmern.'
  },
  { 
    question: 'Ich habe Lila Texutren auf dem Garry\'s Mod Server, was kann ich tun?',
    answer: 'Das ist ein bekanntes Problem, dass auftritt, wenn du die benötigten CS:Source Texturen nicht installiert hast. Dafür bieten dir wir unter dem Garrys Mod Tab einen Anleitung an.'
  },
  { 
    question: 'Ich habe eine Idee für ein neues Feature, was kann ich tun?', 
    answer: 'Wir freuen uns immer über neue Ideen! Melde dich dafür einfach bei unserem Support und beschreibe deine Idee so genau wie möglich. Wir werden uns dann schnellstmöglich darum kümmern.'
  }
];

const filteredQuestions = computed(() => {
  if (!searchQuery.value) return questions;
  const query = searchQuery.value.toLowerCase();
  return questions.filter(q => 
    q.question.toLowerCase().includes(query) || 
    q.answer.toLowerCase().includes(query)
  );
});

const toggleQuestion = (index) => {
  const position = activeQuestions.value.indexOf(index);
  if (position !== -1) {
    activeQuestions.value.splice(position, 1);
  } else {
    activeQuestions.value.push(index);
  }
};
</script>

<style scoped>

h2 {
  color: var(--clr-primary);
  margin-bottom: 1rem;
}

.faq-search {
  position: relative;
  margin: 2rem 0;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  font-size: 1rem;
  border-radius: 6px;
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  color: var(--clr-text-primary);
}

.search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--clr-text-secondary);
}

.faq-section {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  border: 1px solid var(--clr-border);
  border-radius: 6px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--clr-surface-2);
  cursor: pointer;
  font-weight: 500;
  color: var(--clr-text-primary);
}

.faq-question.active {
  border-bottom: 1px solid var(--clr-border);
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  overflow: hidden;
  transition: grid-template-rows 0.3s ease;
  background: var(--clr-surface);
}

.faq-answer > div {
  min-height: 0;
  overflow: hidden;
  padding: 0 1rem;
  max-height: 0;
  opacity: 0;
  transition: padding 0.3s ease, opacity 0.3s ease, max-height 0.3s ease;
}

.faq-answer.active {
  grid-template-rows: 1fr;
}

.faq-answer.active > div {
  padding: 1rem;
  max-height: 1000px;
  opacity: 1;
}

.support-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.support-option {
  display: flex;
  gap: 1rem;
  background: var(--clr-surface-2);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--clr-border);
}

.support-icon {
  font-size: 2rem;
  align-self: flex-start;
}

.discord {
  color: #7289da;
}

.email {
  color: #f98500;
}

.teamspeak {
  color: #2b86f5;
}

.support-option h4 {
  margin-bottom: 0.5rem;
  color: var(--clr-text-primary);
}

.support-link {
  display: inline-block;
  margin-top: 0.75rem;
  color: var(--clr-primary-light);
  text-decoration: none;
}

.support-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .support-options {
    grid-template-columns: 1fr;
  }
}
</style>