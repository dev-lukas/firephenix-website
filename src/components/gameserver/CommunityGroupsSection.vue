<template>
  <BaseSection class="community-groups-section">
    <div class="groups-header">
      <h2>Community</h2>
      <p>Gruppen, Organisationen und Inhalte außerhalb unserer eigenen Plattformen.</p>
    </div>

    <div class="groups-list">
      <article
        v-for="group in groups"
        :key="group.url"
        class="group-card"
        :style="getGroupCardStyle(group)"
      >
        <div v-if="group.backgroundImage" class="group-card-bg"></div>
        <div class="group-main">
          <div class="group-icon">
            <font-awesome-icon :icon="group.icon" />
          </div>
          <div>
            <p class="group-platform">{{ group.platform }}</p>
            <h3>{{ group.name }}</h3>
            <p class="group-description">{{ group.description }}</p>
          </div>
        </div>
        <a
          v-if="group.url"
          :href="group.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group-link"
        >
          <span>{{ group.actionLabel || 'Öffnen' }}</span>
          <font-awesome-icon :icon="['fas', 'globe']" />
        </a>
        <button v-else type="button" class="group-link" @click="openGroupModal(group)">
          <span>{{ group.actionLabel || 'Öffnen' }}</span>
          <font-awesome-icon :icon="['fas', 'globe']" />
        </button>
      </article>
    </div>

    <aside class="community-request">
      <div class="request-copy">
        <font-awesome-icon :icon="['fas', 'question-circle']" />
        <div>
          <h3>Eigene FirePhenix Gruppe oder Inhalte?</h3>
          <p>Wenn hier etwas ergänzt werden soll, kannst du uns kurz Bescheid geben.</p>
        </div>
      </div>
      <button type="button" class="group-link request-link" @click="showRequestModal = true">
        <span>Kontakt aufnehmen</span>
        <font-awesome-icon :icon="['fas', 'envelope']" />
      </button>
    </aside>

    <BaseModal v-model="showGroupModal">
      <template #title>{{ selectedGroup?.name }}</template>
      <div class="group-modal-content">
        <div class="group-modal-icon">
          <font-awesome-icon :icon="selectedGroup?.icon || ['fas', 'users']" />
        </div>
        <p class="group-modal-eyebrow">{{ selectedGroup?.platform }}</p>
        <h3>{{ selectedGroup?.modalTitle || 'Beitreten' }}</h3>
        <p>{{ selectedGroup?.modalMessage }}</p>
        <div v-if="selectedGroup?.contact" class="group-modal-contact">
          <span>Kontakt</span>
          <strong>{{ selectedGroup.contact }}</strong>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="primary" @click="showGroupModal = false">Verstanden</BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="showRequestModal">
      <template #title>Eintrag vorschlagen</template>
      <div class="group-modal-content">
        <div class="group-modal-icon">
          <font-awesome-icon :icon="['fas', 'question-circle']" />
        </div>
        <p class="group-modal-eyebrow">Community</p>
        <h3>Gruppe oder Inhalt hinzufügen</h3>
        <p>
          Hast du eine FirePhenix Gruppe, Modliste oder andere Inhalte, die hier verlinkt werden sollen?
          Melde dich bei Lukas oder schreib eine Mail.
        </p>
        <div class="request-actions">
          <div class="group-modal-contact">
            <span>Direkt</span>
            <strong>Lukas irgendwo Bescheid geben</strong>
          </div>
          <a href="mailto:admin@firephenix.de" class="mail-link">
            <font-awesome-icon :icon="['fas', 'envelope']" />
            <span>admin@firephenix.de</span>
          </a>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="primary" @click="showRequestModal = false">Schließen</BaseButton>
      </template>
    </BaseModal>
  </BaseSection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseSection from '../base/BaseSection.vue';
import BaseButton from '../base/BaseButton.vue';
import BaseModal from '../base/BaseModal.vue';
import steamCommunityImage from '../../assets/images/communities/steam.png';
import starCitizenCommunityImage from '../../assets/images/communities/starcitizen.png';
import gtaCommunityImage from '../../assets/images/communities/gta.png';
import stellarisCommunityImage from '../../assets/images/communities/stellaris.png';
import armaCommunityImage from '../../assets/images/communities/arma.png';

interface CommunityGroup {
  name: string;
  platform: string;
  description: string;
  url?: string;
  actionLabel?: string;
  contact?: string;
  modalTitle?: string;
  modalMessage?: string;
  icon: string[];
  backgroundImage?: string;
}

const showGroupModal = ref(false);
const showRequestModal = ref(false);
const selectedGroup = ref<CommunityGroup | null>(null);

const groups: CommunityGroup[] = [
  {
    name: 'FirePhenixDE',
    platform: 'Steam',
    description: 'Steam Community Gruppe für Events, Server und gemeinsame Spielrunden.',
    url: 'https://steamcommunity.com/groups/firephenixde',
    icon: ['fas', 'users'],
    backgroundImage: steamCommunityImage,
  },
  {
    name: 'FirePhenix',
    platform: 'Star Citizen',
    description: 'FirePhenix Organisation im Roberts Space Industries Universum.',
    url: 'https://robertsspaceindustries.com/en/orgs/FPXORG',
    icon: ['fas', 'star'],
    backgroundImage: starCitizenCommunityImage,
  },
  {
    name: 'GTA 5',
    platform: 'Steam',
    description: 'Gruppe für gemeinsame GTA Online Sessions, Heists und freie Runden.',
    contact: 'Flippster98 (Philip)',
    modalTitle: 'Ingame beitreten',
    modalMessage: 'Der GTA 5 Gruppe kannst du nur direkt im Spiel beitreten. Melde dich bei Philip, damit er dich zur Gruppe hinzufügen kann.',
    icon: ['fas', 'car'],
    backgroundImage: gtaCommunityImage,
  },
  {
    name: 'Stellaris Modliste',
    platform: 'Steam Workshop',
    description: 'Modliste und Workshop-Anlaufstelle für gemeinsame Stellaris Runden.',
    url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2590878195',
    icon: ['fas', 'list'],
    backgroundImage: stellarisCommunityImage,
  },
  {
    name: 'Arma 3 Modliste',
    platform: 'Steam Workshop',
    description: 'Modliste und Workshop-Anlaufstelle für gemeinsame Arma 3 Einsätze.',
    url: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2541208071',
    icon: ['fas', 'list'],
    backgroundImage: armaCommunityImage,
  },
];

const getGroupCardStyle = (group: CommunityGroup) => {
  if (!group.backgroundImage) return {};
  return {
    '--group-background-image': `url(${group.backgroundImage})`,
  };
};

const openGroupModal = (group: CommunityGroup) => {
  selectedGroup.value = group;
  showGroupModal.value = true;
};
</script>

<style scoped>
.community-groups-section {
  padding-top: 2rem;
}

.groups-header {
  max-width: 760px;
  margin: 0 auto 2rem;
  text-align: center;
}

.groups-header h2 {
  color: var(--clr-text-primary);
  font-size: 2rem;
  margin: 0 0 0.75rem;
}

.groups-header p {
  color: var(--clr-text-secondary);
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0;
}

.groups-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  max-width: 1120px;
  margin: 0 auto;
}

.community-request {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  max-width: 1120px;
  margin: 1.25rem auto 0;
  padding: 1.25rem 1.5rem;
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  background: var(--clr-surface);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.16);
}

.request-copy {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.request-copy > svg {
  flex: 0 0 auto;
  color: var(--clr-primary-light);
  font-size: 1.45rem;
}

.request-copy h3 {
  margin: 0 0 0.25rem;
  color: var(--clr-text-primary);
  font-size: 1.1rem;
}

.request-copy p {
  margin: 0;
  color: var(--clr-text-secondary);
  line-height: 1.45;
}

.request-link {
  margin-top: 0;
}

.group-card {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  min-height: 260px;
  isolation: isolate;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.22), rgba(37, 99, 235, 0.18));
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
}

.group-card-bg {
  position: absolute;
  inset: -1px;
  z-index: -2;
  background-image: var(--group-background-image);
  background-position: center;
  background-size: cover;
}

.group-card::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, rgba(12, 17, 24, 0.94) 0%, rgba(12, 17, 24, 0.8) 48%, rgba(12, 17, 24, 0.42) 100%),
    linear-gradient(180deg, rgba(12, 17, 24, 0.18), rgba(12, 17, 24, 0.42));
}

.group-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
  pointer-events: none;
}

.group-main {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  min-width: 0;
}

.group-icon {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(12, 17, 24, 0.72);
  color: var(--clr-primary-light);
  border: 1px solid var(--clr-border-strong);
  font-size: 1.3rem;
  backdrop-filter: blur(8px);
}

.group-platform {
  margin: 0 0 0.25rem;
  color: var(--clr-primary-light);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.group-card h3 {
  color: var(--clr-text-primary);
  margin: 0 0 0.45rem;
  font-size: 1.65rem;
}

.group-description {
  color: var(--clr-text-secondary);
  margin: 0;
  line-height: 1.55;
  font-size: 1.02rem;
}

.group-link {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 0 0 auto;
  margin-top: auto;
  padding: 0.65rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--clr-border-strong);
  color: var(--clr-text-primary);
  background: rgba(12, 17, 24, 0.7);
  text-decoration: none;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.group-link:hover {
  color: var(--clr-primary-light);
  background: var(--clr-primary-transparent);
  transform: translateY(-2px);
}

.group-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: var(--clr-text-secondary);
  line-height: 1.6;
  text-align: center;
}

.group-modal-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid var(--clr-border-strong);
  background:
    radial-gradient(circle at 50% 35%, rgba(249, 133, 0, 0.26), transparent 58%),
    var(--clr-surface-3);
  color: var(--clr-primary-light);
  font-size: 1.5rem;
}

.group-modal-eyebrow {
  margin: 0;
  color: var(--clr-primary-light);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.group-modal-content h3 {
  margin: 0;
  color: var(--clr-text-primary);
  font-size: 1.35rem;
}

.group-modal-content p {
  margin: 0;
}

.group-modal-contact {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  margin-top: 0.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  background: var(--clr-surface-3);
}

.group-modal-contact span {
  color: var(--clr-text-secondary);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.group-modal-contact strong {
  color: var(--clr-primary-light);
  font-size: 1rem;
}

.request-actions {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(180px, auto);
  gap: 0.75rem;
  align-items: stretch;
  margin-top: 0.5rem;
}

.request-actions .group-modal-contact {
  margin-top: 0;
}

.mail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--clr-border-strong);
  border-radius: 8px;
  color: var(--clr-text-primary);
  background: rgba(249, 133, 0, 0.12);
  text-decoration: none;
  transition: all 0.2s ease;
}

.mail-link:hover {
  color: var(--clr-primary-light);
  background: var(--clr-primary-transparent);
  transform: translateY(-1px);
}

@media (max-width: 860px) {
  .groups-list {
    grid-template-columns: 1fr;
  }

  .community-request {
    align-items: stretch;
    flex-direction: column;
  }

  .request-link {
    width: 100%;
  }

  .request-actions {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .group-card {
    align-items: stretch;
    min-height: 260px;
    padding: 1.25rem;
  }

  .group-main {
    align-items: flex-start;
  }

  .group-card h3 {
    font-size: 1.35rem;
  }

  .group-link {
    width: 100%;
  }
}
</style>
