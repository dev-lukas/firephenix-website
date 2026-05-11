<template>
  <Transition name="admin-reveal" mode="out-in">
    <section v-if="player" :key="player.id" class="admin-panel player-details">
      <div class="player-header">
        <div>
          <p class="eyebrow">Ausgewählter Spieler</p>
          <h3>{{ player.name }}</h3>
          <div class="chip-row">
            <span class="id-chip steam"
              >Steam {{ player.steam_id || 'nicht verlinkt' }}</span
            >
            <span class="id-chip discord"
              >Discord {{ player.discord_id || 'nicht verlinkt' }}</span
            >
            <span class="id-chip teamspeak"
              >TeamSpeak {{ player.teamspeak_id || 'nicht verlinkt' }}</span
            >
          </div>
        </div>
        <div class="rank-summary">
          <span class="status-pill">Level {{ player.level }}</span>
          <span class="status-pill">Division {{ player.division }}</span>
          <span
            :class="[
              'status-pill',
              player.ranking.disabled ? 'danger' : 'success',
            ]"
          >
            {{
              player.ranking.disabled ? 'Ranking deaktiviert' : 'Ranking aktiv'
            }}
          </span>
        </div>
      </div>

      <div class="detail-grid">
        <article
          v-for="platform in platforms"
          :key="platform"
          class="platform-card"
          :class="platform"
        >
          <header>
            <strong>{{ platformLabel(platform) }}</strong>
            <span>{{ platformId(platform) || 'nicht verlinkt' }}</span>
          </header>
          <dl>
            <div>
              <dt>Gesamtzeit</dt>
              <dd>
                {{ formatMinutes(player.platform_time[platform]?.total_time) }}
              </dd>
            </div>
            <div>
              <dt>Saisonzeit</dt>
              <dd>
                {{ formatMinutes(player.platform_time[platform]?.season_time) }}
              </dd>
            </div>
            <div>
              <dt>Channel</dt>
              <dd>{{ player.channels[platform] || 'kein Channel' }}</dd>
            </div>
            <div>
              <dt>Move-Shield</dt>
              <dd>
                {{ player.moveable[platform] ? 'bewegbar' : 'geschützt' }}
              </dd>
            </div>
            <div>
              <dt>Heatmap</dt>
              <dd>{{ heatmapText(platform) }}</dd>
            </div>
            <div>
              <dt>Streak</dt>
              <dd>{{ streakText(platform) }}</dd>
            </div>
          </dl>
        </article>
      </div>

      <div class="action-grid">
        <section class="action-panel">
          <h4>Ranking übertragen</h4>
          <AdminPlayerPicker
            :admin-fetch="adminFetch"
            :selected="transferTarget"
            label="Zielspieler"
            @update:selected="$emit('update:transferTarget', $event)"
          />
          <div
            class="platform-chip-row"
            role="group"
            aria-label="Plattformen für den Transfer"
          >
            <label
              v-for="platform in platforms"
              :key="platform"
              :class="[
                'platform-chip',
                platform,
                {
                  selected: transferPlatforms.includes(platform),
                  disabled: !platformId(platform),
                },
              ]"
            >
              <input
                v-model="transferPlatformsModel"
                type="checkbox"
                :value="platform"
                :disabled="!platformId(platform)"
              />
              {{ platformLabel(platform) }}
            </label>
          </div>
          <textarea
            :value="transferReason"
            class="admin-textarea"
            placeholder="Grund für den Ranking-Transfer"
            @input="
              $emit(
                'update:transferReason',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          ></textarea>
          <BaseButton
            variant="primary"
            :disabled="
              !transferTarget ||
              transferPlatforms.length === 0 ||
              !transferReason.trim()
            "
            @click="$emit('review', 'transfer')"
          >
            Ranking übertragen
          </BaseButton>
        </section>

        <section class="action-panel">
          <h4>Account-Verknüpfungen</h4>
          <label class="field">
            Plattform für Steam-Unlinking
            <select
              :value="unlinkPlatform"
              class="admin-input"
              @change="
                $emit(
                  'update:unlinkPlatform',
                  ($event.target as HTMLSelectElement).value as Platform
                )
              "
            >
              <option value="teamspeak">TeamSpeak</option>
              <option value="discord">Discord</option>
            </select>
          </label>
          <textarea
            :value="unlinkReason"
            class="admin-textarea"
            placeholder="Grund für das Steam-Unlinking"
            @input="
              $emit(
                'update:unlinkReason',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          ></textarea>
          <BaseButton
            variant="secondary"
            :disabled="!platformId(unlinkPlatform) || !unlinkReason.trim()"
            @click="$emit('review', 'unlink')"
          >
            Steam-Verknüpfung lösen
          </BaseButton>
        </section>

        <section class="action-panel">
          <h4>Ignore-Rolle</h4>
          <label class="field">
            Plattform
            <select
              :value="ignorePlatform"
              class="admin-input"
              @change="
                $emit(
                  'update:ignorePlatform',
                  ($event.target as HTMLSelectElement).value as Platform
                )
              "
            >
              <option value="teamspeak">TeamSpeak</option>
              <option value="discord">Discord</option>
            </select>
          </label>
          <textarea
            :value="ignoreReason"
            class="admin-textarea"
            placeholder="Grund für die Ignore-Rolle"
            @input="
              $emit(
                'update:ignoreReason',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          ></textarea>
          <BaseButton
            variant="secondary"
            :disabled="!platformId(ignorePlatform) || !ignoreReason.trim()"
            @click="$emit('review', 'ignoreRole')"
          >
            Ignore-Rolle zuweisen
          </BaseButton>
        </section>

        <section class="action-panel">
          <h4>Season Skin vergeben</h4>
          <p v-if="player.steam_id" class="action-copy">
            SteamID64 wird automatisch vom ausgewählten Spieler genutzt.
          </p>
          <p v-else class="warning-copy">
            Dieser Spieler hat keine SteamID. Season Skin kann nicht vergeben
            werden.
          </p>
          <label class="field">
            Tier
            <select
              :value="skinTier"
              class="admin-input"
              @change="
                $emit(
                  'update:skinTier',
                  Number(($event.target as HTMLSelectElement).value)
                )
              "
            >
              <option v-for="tier in [2, 3, 4, 5, 6]" :key="tier" :value="tier">
                Tier {{ tier }}
              </option>
            </select>
          </label>
          <textarea
            :value="skinReason"
            class="admin-textarea"
            placeholder="Grund für den Grant"
            @input="
              $emit(
                'update:skinReason',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          ></textarea>
          <BaseButton
            variant="primary"
            :disabled="!player.steam_id || !skinReason.trim()"
            @click="$emit('review', 'seasonSkin')"
          >
            Skin vergeben
          </BaseButton>
        </section>

        <section class="action-panel">
          <h4>Rankingzeit korrigieren</h4>
          <p v-if="!canEditProfile" class="warning-copy">
            Zeitkorrekturen sind nur für aktive Spieler mit verlinkter Plattform
            möglich.
          </p>
          <label class="field">
            Plattform
            <select
              :value="timePlatform"
              class="admin-input"
              :disabled="!canEditProfile"
              @change="
                $emit(
                  'update:timePlatform',
                  ($event.target as HTMLSelectElement).value as Platform
                )
              "
            >
              <option
                v-for="platform in linkedPlatforms"
                :key="platform"
                :value="platform"
              >
                {{ platformLabel(platform) }}
              </option>
            </select>
          </label>
          <div class="time-input-grid">
            <label class="field">
              Gesamtzeit (Minuten)
              <input
                :value="timeTotal"
                class="admin-input"
                type="number"
                min="0"
                step="1"
                :disabled="!canEditProfile"
                @input="
                  $emit(
                    'update:timeTotal',
                    Number(($event.target as HTMLInputElement).value)
                  )
                "
              />
            </label>
            <label class="field">
              Saisonzeit (Minuten)
              <input
                :value="timeSeason"
                class="admin-input"
                type="number"
                min="0"
                step="1"
                :disabled="!canEditProfile"
                @input="
                  $emit(
                    'update:timeSeason',
                    Number(($event.target as HTMLInputElement).value)
                  )
                "
              />
            </label>
          </div>
          <p v-if="timeInvalid" class="warning-copy">
            Saisonzeit darf nicht größer als Gesamtzeit sein.
          </p>
          <textarea
            :value="timeReason"
            class="admin-textarea"
            placeholder="Grund für die Zeitkorrektur"
            :disabled="!canEditProfile"
            @input="
              $emit(
                'update:timeReason',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          ></textarea>
          <BaseButton
            variant="primary"
            :disabled="!canEditProfile || timeInvalid || !timeReason.trim()"
            @click="$emit('review', 'timeUpdate')"
          >
            Zeit speichern
          </BaseButton>
        </section>

        <section class="action-panel">
          <h4>Beitrittsdatum</h4>
          <p v-if="!canEditProfile" class="warning-copy">
            Beitrittsdatum kann nur für aktive Spieler mit verlinkter Plattform
            geändert werden.
          </p>
          <label class="field">
            Datum
            <input
              :value="joinDate"
              class="admin-input"
              type="date"
              :max="today"
              :disabled="!canEditProfile"
              @input="
                $emit(
                  'update:joinDate',
                  ($event.target as HTMLInputElement).value
                )
              "
            />
          </label>
          <textarea
            :value="joinDateReason"
            class="admin-textarea"
            placeholder="Grund für die Datumsänderung"
            :disabled="!canEditProfile"
            @input="
              $emit(
                'update:joinDateReason',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          ></textarea>
          <BaseButton
            variant="secondary"
            :disabled="!canEditProfile || !joinDate || !joinDateReason.trim()"
            @click="$emit('review', 'joinDate')"
          >
            Datum speichern
          </BaseButton>
        </section>

        <section class="action-panel">
          <h4>Spezial-Achievements</h4>
          <p v-if="!canEditProfile" class="warning-copy">
            Achievements sind nur für aktive Spieler mit verlinkter Plattform
            änderbar.
          </p>
          <label class="field">
            Plattform
            <select
              :value="achievementPlatform"
              class="admin-input"
              :disabled="!canEditProfile"
              @change="
                $emit(
                  'update:achievementPlatform',
                  ($event.target as HTMLSelectElement).value as Platform
                )
              "
            >
              <option
                v-for="platform in linkedPlatforms"
                :key="platform"
                :value="platform"
              >
                {{ platformLabel(platform) }}
              </option>
            </select>
          </label>
          <label class="field">
            Achievement
            <select
              :value="achievementType || ''"
              class="admin-input"
              :disabled="!canEditProfile || specialAchievements.length === 0"
              @change="
                $emit(
                  'update:achievementType',
                  Number(($event.target as HTMLSelectElement).value)
                )
              "
            >
              <option
                v-for="achievement in specialAchievements"
                :key="achievement.achievement_type"
                :value="achievement.achievement_type"
              >
                {{ achievement.name }}
              </option>
            </select>
          </label>
          <p class="action-copy">
            Status: {{ achievementGranted ? 'vergeben' : 'nicht vergeben' }}
          </p>
          <textarea
            :value="achievementReason"
            class="admin-textarea"
            placeholder="Grund für die Achievement-Änderung"
            :disabled="!canEditProfile"
            @input="
              $emit(
                'update:achievementReason',
                ($event.target as HTMLTextAreaElement).value
              )
            "
          ></textarea>
          <div class="button-row">
            <BaseButton
              variant="primary"
              :disabled="
                !canEditProfile ||
                !achievementType ||
                achievementGranted ||
                !achievementReason.trim()
              "
              @click="$emit('review', 'specialAchievementGrant')"
            >
              Vergeben
            </BaseButton>
            <BaseButton
              variant="secondary"
              :disabled="
                !canEditProfile ||
                !achievementType ||
                !achievementGranted ||
                !achievementReason.trim()
              "
              @click="$emit('review', 'specialAchievementRevoke')"
            >
              Entfernen
            </BaseButton>
          </div>
        </section>
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '../../base/BaseButton.vue';
import AdminPlayerPicker from './AdminPlayerPicker.vue';
import type {
  AdminFetch,
  Platform,
  PlayerDetail,
  PlayerSummary,
  SpecialAchievementDefinition,
} from './types';

const props = defineProps<{
  player: PlayerDetail | null;
  adminFetch: AdminFetch;
  transferTarget: PlayerSummary | null;
  transferPlatforms: Platform[];
  transferReason: string;
  unlinkPlatform: Platform;
  unlinkReason: string;
  ignorePlatform: Platform;
  ignoreReason: string;
  skinTier: number;
  skinReason: string;
  specialAchievements: SpecialAchievementDefinition[];
  timePlatform: Platform;
  timeTotal: number;
  timeSeason: number;
  timeReason: string;
  joinDate: string;
  joinDateReason: string;
  achievementPlatform: Platform;
  achievementType: number | null;
  achievementReason: string;
}>();

const emit = defineEmits<{
  (e: 'update:transferTarget', value: PlayerSummary | null): void;
  (e: 'update:transferPlatforms', value: Platform[]): void;
  (e: 'update:transferReason', value: string): void;
  (e: 'update:unlinkPlatform', value: Platform): void;
  (e: 'update:unlinkReason', value: string): void;
  (e: 'update:ignorePlatform', value: Platform): void;
  (e: 'update:ignoreReason', value: string): void;
  (e: 'update:skinTier', value: number): void;
  (e: 'update:skinReason', value: string): void;
  (e: 'update:timePlatform', value: Platform): void;
  (e: 'update:timeTotal', value: number): void;
  (e: 'update:timeSeason', value: number): void;
  (e: 'update:timeReason', value: string): void;
  (e: 'update:joinDate', value: string): void;
  (e: 'update:joinDateReason', value: string): void;
  (e: 'update:achievementPlatform', value: Platform): void;
  (e: 'update:achievementType', value: number): void;
  (e: 'update:achievementReason', value: string): void;
  (
    e: 'review',
    value:
      | 'transfer'
      | 'unlink'
      | 'ignoreRole'
      | 'seasonSkin'
      | 'timeUpdate'
      | 'joinDate'
      | 'specialAchievementGrant'
      | 'specialAchievementRevoke'
  ): void;
}>();

const platforms: Platform[] = ['teamspeak', 'discord'];

const transferPlatformsModel = computed({
  get: () => props.transferPlatforms,
  set: (value: Platform[]) => emit('update:transferPlatforms', value),
});

const linkedPlatforms = computed(() =>
  platforms.filter((platform) => Boolean(platformId(platform)))
);

const canEditProfile = computed(
  () =>
    Boolean(props.player) &&
    !props.player?.ranking.disabled &&
    linkedPlatforms.value.length > 0
);

const timeInvalid = computed(
  () =>
    props.timeTotal < 0 ||
    props.timeSeason < 0 ||
    props.timeSeason > props.timeTotal
);

const today = new Date().toISOString().slice(0, 10);

const achievementGranted = computed(() => {
  if (!props.player || !props.achievementType) return false;
  return props.player.special_achievements.some(
    (achievement) =>
      achievement.platform === props.achievementPlatform &&
      achievement.achievement_type === props.achievementType
  );
});

const platformLabel = (platform: Platform) =>
  platform === 'discord' ? 'Discord' : 'TeamSpeak';

const platformId = (platform: Platform) => {
  if (!props.player) return null;
  return platform === 'discord'
    ? props.player.discord_id
    : props.player.teamspeak_id;
};

const formatMinutes = (minutes?: number) => {
  if (minutes == null) return 'keine Daten';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest}m`;
};

const heatmapText = (platform: Platform) => {
  const heatmap = props.player?.activity_heatmap[platform];
  if (!heatmap) return 'keine Aktivität';
  return `${heatmap.slots} Slots · ${formatMinutes(heatmap.minutes)}`;
};

const streakText = (platform: Platform) => {
  const streak = props.player?.login_streaks[platform];
  if (!streak) return 'kein Streak';
  return `${streak.current_streak} aktuell · ${streak.longest_streak} längster`;
};
</script>

<style scoped>
.admin-panel {
  background: var(--clr-surface-2);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.player-details {
  display: grid;
  gap: 1.25rem;
}

.player-header {
  align-items: flex-start;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}

.player-header h3,
.eyebrow,
.action-panel h4,
.action-copy,
.warning-copy {
  margin: 0;
}

.player-header h3,
.action-panel h4 {
  color: var(--clr-text-primary);
}

.eyebrow {
  color: var(--clr-primary);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.chip-row,
.rank-summary,
.platform-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.id-chip,
.status-pill {
  border-radius: 999px;
  font-size: 0.78rem;
  padding: 0.3rem 0.65rem;
}

.id-chip {
  background: var(--clr-transparent-light);
  border: 1px solid var(--clr-border);
  color: var(--clr-text-secondary);
}

.id-chip.discord {
  border-color: rgba(88, 101, 242, 0.36);
}

.id-chip.teamspeak {
  border-color: rgba(37, 128, 195, 0.36);
}

.status-pill {
  background: var(--clr-transparent-light);
  color: var(--clr-text-primary);
  white-space: nowrap;
}

.status-pill.success {
  background: rgba(46, 204, 113, 0.16);
  color: #69e698;
}

.status-pill.danger {
  background: rgba(220, 53, 69, 0.16);
  color: #ff8f9a;
}

.detail-grid,
.action-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.time-input-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.platform-card,
.action-panel {
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  padding: 1rem;
}

.platform-card.discord {
  border-color: rgba(88, 101, 242, 0.26);
}

.platform-card.teamspeak {
  border-color: rgba(37, 128, 195, 0.26);
}

.platform-card header {
  display: grid;
  gap: 0.25rem;
  margin-bottom: 0.9rem;
}

.platform-card header strong {
  color: var(--clr-text-primary);
}

.platform-card header span,
.action-copy,
.warning-copy {
  color: var(--clr-text-secondary);
}

.warning-copy {
  color: #ffb0b8;
}

dl {
  display: grid;
  gap: 0.65rem;
  margin: 0;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

dt {
  color: var(--clr-text-secondary);
}

dd {
  color: var(--clr-text-primary);
  margin: 0;
  overflow-wrap: anywhere;
  text-align: right;
}

.action-panel {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.field {
  color: var(--clr-text-secondary);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  text-align: left;
}

.admin-input,
.admin-textarea {
  background: var(--clr-background);
  border: 1px solid var(--clr-border);
  border-radius: 8px;
  color: var(--clr-text-primary);
  min-height: 42px;
  padding: 0.75rem;
  width: 100%;
}

.admin-textarea {
  min-height: 86px;
  resize: vertical;
}

.platform-chip {
  align-items: center;
  background: var(--clr-transparent-light);
  border: 1px solid var(--clr-border);
  border-radius: 999px;
  color: var(--clr-text-primary);
  cursor: pointer;
  display: inline-flex;
  min-height: 38px;
  padding: 0.45rem 0.8rem;
}

.platform-chip input {
  inline-size: 1px;
  opacity: 0;
  position: absolute;
}

.platform-chip.discord.selected {
  background: rgba(88, 101, 242, 0.22);
  border-color: var(--clr-discord);
}

.platform-chip.teamspeak.selected {
  background: rgba(37, 128, 195, 0.22);
  border-color: var(--clr-teamspeak);
}

.platform-chip.disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.admin-reveal-enter-active,
.admin-reveal-leave-active {
  transition: all 0.22s ease;
}

.admin-reveal-enter-from,
.admin-reveal-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 980px) {
  .detail-grid,
  .action-grid,
  .time-input-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .player-header {
    flex-direction: column;
  }

  dl div {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.15rem;
  }

  dd {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-reveal-enter-active,
  .admin-reveal-leave-active {
    transition: none;
  }
}
</style>
