<template>
  <div class="support-wiki">
    <h2>Support & FAQ</h2>
    <p>
      Häufig gestellte Fragen und Hilfe bei Problemen auf unserem Server.
      Solltest du hier keine Antwort finden, kontaktiere uns bitte über unseren Discord-Server.
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
          {{ question.answer }}
        </div>
      </div>
    </div>

    <h3>Support kontaktieren</h3>
    <div class="support-options">
      <div class="support-option">
        <font-awesome-icon icon="fa-brands fa-discord" class="support-icon discord" />
        <div>
          <h4>Discord</h4>
          <p>Tritt unserem Discord-Server bei und stelle deine Frage im #support-Kanal.</p>
          <a href="https://discord.gg/firephenix" class="support-link">Discord beitreten</a>
        </div>
      </div>

      <div class="support-option">
        <font-awesome-icon icon="fa-solid fa-envelope" class="support-icon email" />
        <div>
          <h4>E-Mail</h4>
          <p>Für komplexere Anfragen kannst du uns eine E-Mail schreiben.</p>
          <a href="mailto:support@firephenix.de" class="support-link">support@firephenix.de</a>
        </div>
      </div>
      
      <div class="support-option">
        <font-awesome-icon icon="fa-solid fa-headset" class="support-icon teamspeak" />
        <div>
          <h4>TeamSpeak</h4>
          <p>Du findest unsere Support-Mitarbeiter auch auf unserem TeamSpeak Server.</p>
          <a href="#" class="support-link">ts.firephenix.de</a>
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
    question: 'Wie bekomme ich Zugang zum VIP-Bereich?', 
    answer: 'Der VIP-Bereich ist für Spieler ab Level 5 oder mit einem aktiven VIP-Abonnement zugänglich.'
  },
  { 
    question: 'Ich kann mich nicht mit dem Server verbinden, was kann ich tun?', 
    answer: 'Überprüfe zunächst deine Internetverbindung und stelle sicher, dass du die neueste Version von Garrys Mod installiert hast. Falls das Problem weiterhin besteht, kontaktiere unseren Support auf Discord.'
  },
  { 
    question: 'Wie melde ich einen Spieler, der gegen die Regeln verstößt?', 
    answer: 'Verwende den /report Befehl im Spiel oder melde den Vorfall in unserem Discord-Server im #report-Kanal mit Screenshots oder Videos als Beweis.'
  },
  { 
    question: 'Wann finden Server-Wartungen statt?', 
    answer: 'Reguläre Wartungen finden jeden Montag von 2:00 bis 4:00 Uhr morgens statt. Außerplanmäßige Wartungen werden mindestens 24 Stunden im Voraus auf unserem Discord angekündigt.'
  },
  { 
    question: 'Wie kann ich meinen Account mit Discord verknüpfen?', 
    answer: 'Benutze den /link Befehl im Spiel und folge den Anweisungen, die dir per Ingame-Nachricht mitgeteilt werden.'
  },
  { 
    question: 'Wie kann ich dem Serverteam beitreten?', 
    answer: 'Wir veröffentlichen regelmäßig Bewerbungsaufrufe auf unserer Website und Discord. Du kannst dich für verschiedene Positionen wie Moderator, Event-Planer oder Entwickler bewerben.'
  },
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
.faq-search {
  position: relative;
  margin: 2rem 0;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  font-size: 1rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--clr-text-primary);
}

.search-icon {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.faq-section {
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  font-weight: 500;
  color: var(--clr-text-primary);
}

.faq-question.active {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.chevron-icon {
  transition: transform 0.3s ease;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding: 0 1rem;
  line-height: 1.6;
}

.faq-answer.active {
  max-height: 500px;
  padding: 1rem;
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
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  color: #f98500;
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