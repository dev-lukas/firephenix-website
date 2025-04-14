<template>
  <div class="range-system-wiki">
    <h2>Unser Rangsystem</h2>
    <p>
      Das FirePhenix Rangsystem ist ein Cross-Plattform Aktivitätstracker, der es dir ermöglicht, deine Fortschritte zu verfolgen
      und Belohnungen zu verdienen, während du auf unserem Server spielst.
    </p>
    <p>
      Je mehr Zeit du investierst, desto höher steigst du im Rang auf.
      Dabei kannst du Perks freischalten, wie eigene Channel, Dateien-Uploads oder Serverrechte um andere Mitspieler zu bewegen.
      Wenn du dich unter dem Reiter "Mein Profil" anmeldest, kannst du deinen Fortschritt zwischen verschiedenen Plattformen synchronisieren.
    </p>
    <p>
      In der folgenden Tabelle findest du alle Ränge, die du erreichen kannst, sowie die Zeit, die du dafür benötigst und die Belohnungen, die du erhältst.
    </p>

    <div class="ranks-table-container">
      <table class="modern-ranks-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Zeit benötigt</th>
            <th>Belohnungen</th>
          </tr>
        </thead>
        <tbody>
          <tr class="rank-row" v-for="level in 25" :key="level">
            <td class="level-cell">
              <div class="level-info">
                <div class="level-icon-container">
                  <img :src="getLevelIconPath(level)" :alt="`Level ${level} Icon`" class="level-icon" />
                </div>
                <span>Level {{ level }}</span>
              </div>
            </td>
            <td>{{ getLevelTime(level) }}</td>
            <td>{{ getLevelRewards(level) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const levelTimeRequirements = {
    1: '0 Stunden',
    2: '5 Stunden',
    3: '10 Stunden',
    4: '20 Stunden',
    5: '40 Stunden',
    6: '50 Stunden',
    7: '60 Stunden',
    8: '70 Stunden',
    9: '80 Stunden',
    10: '90 Stunden',
    11: '100 Stunden',
    12: '125 Stunden',
    13: '150 Stunden',
    14: '175 Stunden',
    15: '200 Stunden',
    16: '250 Stunden',
    17: '300 Stunden',
    18: '400 Stunden',
    19: '600 Stunden',
    20: '1200 Stunden',
    21: '2500 Stunden',
    22: '5000 Stunden',
    23: '10000 Stunden',
    24: '20000 Stunden',
    25: '30000 Stunden',
}

const levelRewards = {
  1: '',
  2: '',
  3: '',
  4: 'TeamSpeak Avatar',
  5: 'TeamSpeak Beschreibung',
  6: 'Temporärer Channel erstellen',
  11: 'Dateien-Upload',
  15: 'Erstellen von Semi-permanenten Channel',
  20: 'Moverechte für Spieler ohne Moveshield',
  21: 'Erstellen eines eigenen Channels',
  25: 'Upgraden des Channels zu einem Apex-Channel',
}

const getLevelIconPath = (level) => {
  return `/src/assets/images/level/${level}.png`
}

const getLevelTime = (level) => {
  return levelTimeRequirements[level] || 'Zu definieren'
}

const getLevelRewards = (level) => {
  return levelRewards[level] || ' '
}
</script>

<style scoped>
ul {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

li {
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 0.5rem;
}	

.range-system-wiki h2,
.range-system-wiki h3 {
  color: #FFA500;
  margin-bottom: 1rem;
}

.range-system-wiki p,
.range-system-wiki li {
  color: #cccccc; 
}

.ranks-table-container {
  overflow-x: auto;
  margin: 2rem 0;
}

.modern-ranks-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4); 
  border-radius: 12px; 
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  background: #2c2c2c; 
  color: #e0e0e0;
}

.modern-ranks-table thead {
  background: var(--clr-surface); 
}

.modern-ranks-table th {
  padding: 1.2rem 1rem; 
  text-align: left;
  font-weight: 600;
  letter-spacing: 0.75px; 
  text-transform: uppercase;
  font-size: 0.85rem; 
  color: #FFA500;
  border-bottom: 2px solid #FFA500; 
}

.modern-ranks-table td {
  padding: 1rem;
  border-bottom: 1px solid #444444; 
  transition: background-color 0.3s ease;
  color: #cccccc;
  vertical-align: middle; 
}

.modern-ranks-table tbody tr:last-child td {
  border-bottom: none; 
}

.rank-row {
  transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease;
  position: relative;
  z-index: 1;
}

.rank-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5); 
  z-index: 2;
  background: #3a3a3a; 
}

.rank-row:hover td {
  color: #ffffff; 
}

.level-cell {
  min-width: 200px;
  color: #e0e0e0; 
  font-weight: 500;
}

.level-info {
  display: flex;
  align-items: center;
  gap: 12px; 
}

.level-icon-container {
  width: 65px; 
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #444; 
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.rank-row:hover .level-icon-container {
  background-color: #858585; 
}

.level-icon {
  width: 64px; 
  height: 64px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.rank-row:hover .level-icon {
  transform: scale(1.1); 
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.rank-row {
  animation: fadeIn 0.6s ease forwards;
  opacity: 0;
}

@media (max-width: 768px) {
  .modern-ranks-table {
    font-size: 0.9rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
  }

  .modern-ranks-table th,
  .modern-ranks-table td {
    padding: 0.8rem;
  }

  .level-cell {
    min-width: 150px;
  }

  .level-icon-container {
    width: 32px;
    height: 32px;
  }

  .level-icon {
    width: 22px;
    height: 22px;
  }

  p {
    margin-bottom: 1rem;
  }
}

.rank-row:nth-child(1) { animation-delay: 0.05s; }
.rank-row:nth-child(2) { animation-delay: 0.1s; }
.rank-row:nth-child(3) { animation-delay: 0.15s; }
.rank-row:nth-child(4) { animation-delay: 0.2s; }
.rank-row:nth-child(5) { animation-delay: 0.25s; }
.rank-row:nth-child(6) { animation-delay: 0.3s; }
.rank-row:nth-child(7) { animation-delay: 0.35s; }
.rank-row:nth-child(8) { animation-delay: 0.4s; }
.rank-row:nth-child(9) { animation-delay: 0.45s; }
.rank-row:nth-child(10) { animation-delay: 0.5s; }
.rank-row:nth-child(11) { animation-delay: 0.55s; }
.rank-row:nth-child(12) { animation-delay: 0.6s; }
.rank-row:nth-child(13) { animation-delay: 0.65s; }
.rank-row:nth-child(14) { animation-delay: 0.7s; }
.rank-row:nth-child(15) { animation-delay: 0.75s; }
.rank-row:nth-child(16) { animation-delay: 0.8s; }
.rank-row:nth-child(17) { animation-delay: 0.85s; }
.rank-row:nth-child(18) { animation-delay: 0.9s; }
.rank-row:nth-child(19) { animation-delay: 0.95s; }
.rank-row:nth-child(20) { animation-delay: 1s; }
.rank-row:nth-child(21) { animation-delay: 1.05s; }
.rank-row:nth-child(22) { animation-delay: 1.1s; }
.rank-row:nth-child(23) { animation-delay: 1.15s; }
.rank-row:nth-child(24) { animation-delay: 1.2s; }
.rank-row:nth-child(25) { animation-delay: 1.25s; }
</style>