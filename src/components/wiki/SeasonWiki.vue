<template>
    <div class="range-system-wiki">
      <h2>Season</h2>
      <p>
        Da das FirePhenix Rangsystem ein kumulatives System ist, ist es oft neueren Spielern nicht möglich, mit den alten Spielern mitzuhalten.
        Daher wurde ein jährliches Season-System eingeführt, das es auch neuen Spielern ermöglicht, Erfolge zu feiern und die Spitze einer Rangliste
        zu erreichen. 
      </p>
      <p>
        Das Season-System funktioniert fast identisch mit dem normalen Rangsystem, jedoch mit einigen wichtigen Unterschieden: Zum einen wird jährlich sämtlicher
        Fortschritt zurückgesetzt. Desweiteren erhältst du die Rangbelohnungen nicht sofort, sondern erst am Ende der Season, wenn du den Rang zum Reset halten konntest.
        Desweiteren wird die oberste Division nicht von einer bestimmten Zeit begrentzt, sondern von einer bestimmten Anzahl an Plätzen. Nur die besten zehn Spieler
        jeder Season erhalten den Rang "Phönix".
      </p>
      <p>
        Der letzte wichtige Unterschied ist die Art der Belohnungen. Während du im normalen Rangsystem Belohnungen wie TeamSpeak und Discord Rechte erhältst, erhältst du im Season-System
        ausschließlich nur kosmetische Belohnungen.
      </p>
  
      <div class="ranks-table-container">
        <table class="modern-ranks-table">
          <thead>
            <tr>
              <th>Division</th>
              <th>Zeit benötigt</th>
              <th>Belohnungen</th>
            </tr>
          </thead>
          <tbody>
            <tr class="rank-row" v-for="division in 6" :key="division">
              <td class="level-cell">
                <div class="level-info">
                  <div class="level-icon-container">
                    <img :src="getDivisionIconPath(division)" :alt="`Division ${division} Icon`" class="level-icon" />
                  </div>
                  <span>{{ getDivisionName(division) }}</span>
                </div>
              </td>
              <td>{{ getDivisionRequirements(division) }}</td>
              <td>{{ getDivisionRewards(division) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h2>Belohnungen</h2>
      <div class="rewards-section">
        <div class="reward-card">
          <div class="reward-header">
            <img :src="new URL('../../assets/images/ranks/diamond.png', import.meta.url).href" alt="Profil-Rahmen Icon" class="reward-icon" />
            <h3>Profil-Rahmen</h3>
          </div>
          <p>Je nach Rang erhältst du einen speziellen Glanzeffekt für dein Profilbild, welcher jedem Spieler der dein Profil besucht zeigt, wie hoch du in der letzten Season abgeschlossen hast:</p>
          <div class="glow-effects-container">
            <div v-for="division in 6" :key="division" class="glow-effect-example">
              <div class="glow-frame" :class="`division-${division}`">
                <div class="glow-content">
                  <img :src="getDivisionIconPath(division)" :alt="`Division ${division}`" class="glow-icon" />
                </div>
              </div>
              <span class="glow-label">{{ getDivisionName(division) }}</span>
            </div>
          </div>
        </div>
        <div class="reward-card">
          <div class="reward-header">
            <img :src="new URL('../../assets/images/games/phoenix-agent.png', import.meta.url).href" alt="TTT Skins Icon" class="reward-icon" />
            <h3>TTT Skins</h3>
          </div>
          <p>Zusätzlich erhältst du, wenn du mindestens Silber erreicht hast, einen oder mehrere TTT-Skins:</p>
          <div class="ttt-rewards-container">
            <img :src="new URL('../../assets/images/games/ttt_rewards.png', import.meta.url).href" alt="TTT Skins Belohnungen" class="ttt-rewards-image" />
          </div>
          <p class="reward-note">Bitte beachte, dass dies nur eine Abbildung der TTT Skins sind. Die Ingame-Version kann etwas vom Artwork abweichen. Du kannst die Skins aber jederzeit bereits im Ingame Skinshop betrachten.</p>
        </div>
        <div class="reward-card">
          <div class="reward-header">
            <img :src="new URL('../../assets/images/achievements/apex.png', import.meta.url).href" alt="Apex Channel Icon" class="reward-icon" />
            <h3>Apex Channel</h3>
          </div>
          
          <p>Solltest du als bester einer Season abschließen, erhälst du zusätzlich, was sonst nur Prestige V Spielern vorenthalten ist: <br><br> Du kannst deinen Channel aufwerten zu einem Apex Channel. Dies ist ein permanenter Channel welcher an der höchsten Stelle des Discords und TeamSpeak Servers trohnt. Zeige allen Spielern, dass du zum Apex gehörst!</p>
          <img :src="new URL('../../assets/images/achievements/apex.png', import.meta.url).href" alt="Apex Channel Achievement" class="apex-image" />
          <p class="reward-note">Bitte beachte, dass dies nur eine Upgrade für deinen permanenten Channel ist. Du musst trotzdem Prestige I erreichen.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';

  const divisionRequirements = {
      1: '0 Stunden',
      2: '50 Stunden',
      3: '150 Stunden',
      4: '300 Stunden',
      5: '400 Stunden',
      6: '10 besten Diamant Spieler',
  }
  
  const divisionRewards = {
    1: 'Profil-Rahmen',
    2: 'Profil-Rahmen, TTT Skin',
    3: 'Profil-Rahmen, TTT Skin, Errungenschaft',
    4: 'Profil-Rahmen, TTT Skin, Errungenschaft',
    5: 'Profil-Rahmen, TTT Skin, Errungenschaft',
    6: 'Profil-Rahmen, TTT Skin, Errungenschaft, Apex Channel Upgrade *'
  }

  const divisionName = {
    1: 'Bronze',
    2: 'Silber',
    3: 'Gold',
    4: 'Platin',
    5: 'Diamant',
    6: 'Phönix',
  }

  const divisionIconUrls = computed(() => {
    return {
      1: new URL('../../assets/images/ranks/bronze.png', import.meta.url).href,
      2: new URL('../../assets/images/ranks/silver.png', import.meta.url).href,
      3: new URL('../../assets/images/ranks/gold.png', import.meta.url).href,
      4: new URL('../../assets/images/ranks/platinum.png', import.meta.url).href,
      5: new URL('../../assets/images/ranks/diamond.png', import.meta.url).href,
      6: new URL('../../assets/images/ranks/phoenix.png', import.meta.url).href,
    };
  });

  const getDivisionName = (division) => {
    return divisionName[division] || 'Unbekannt'
  }

  const getDivisionIconPath = (division) => {
    return divisionIconUrls.value[division];
  }
  
  const getDivisionRequirements = (division) => {
    return divisionRequirements[division] || 'Zu definieren'
  }
  
  const getDivisionRewards = (division) => {
    return divisionRewards[division] || ' '
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
  
  .reward-showcase {
    margin-top: 3rem;
  }

  .range-system-wiki h2,
  .range-system-wiki h3 {
    color: var(--clr-primary);
    margin-bottom: 1rem;
  }
  
  .range-system-wiki h4 {
    color: var(--clr-text-secondary);
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .range-system-wiki p,
  .range-system-wiki li {
    color: var(--clr-text-secondary); 
  }
  
  .ranks-table-container {
    overflow-x: auto;
    margin: 2rem 0;
  }
  
  .modern-ranks-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    box-shadow: 0 6px 25px var(--clr-box-shadow); 
    border-radius: 12px; 
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    background: var(--clr-surface-2); 
    color: var(--clr-text-secondary);
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
    color: var(--clr-primary-light);
    background-color: var(--clr-surface-3);
    border-bottom: 2px solid var(--clr-primary-light); 
  }
  
  .modern-ranks-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--clr-border); 
    transition: background-color 0.3s ease;
    color: var(--clr-text-secondary);
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
    box-shadow: 0 8px 20px var(--clr-box-shadow); 
    z-index: 2;
    background: #3a3a3a; 
  }
  
  .rank-row:hover td {
    color: var(--clr-text-primary); 
  }
  
  .level-cell {
    min-width: 200px;
    color: var(--clr-text-secondary); 
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
    background-color: var(--clr-surface-3); 
    border-radius: 50%;
    transition: background-color 0.3s ease;
  }
  
  .rank-row:hover .level-icon-container {
    background-color: var(--clr-surface-4); 
  }
  
  .level-icon {
    width: 64px; 
    height: 64px;
    object-fit: contain;
    margin-top: 10spx;
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
      box-shadow: 0 4px 15px var(--clr-box-shadow);
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
  
  /* Glow Effects Showcase */
  .rewards-showcase {
    margin: 2rem 0;
  }
  
  .rewards-showcase h4 {
    color: var(--clr-primary-light);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .glow-effects-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    margin-top: 1.5rem;
  }
  
  .glow-effect-example {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .glow-frame {
    width: 100px;
    height: 100px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: box-shadow 0.3s ease;
  }
  
  .glow-content {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    background-color: var(--clr-surface-3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .glow-icon {
    width: 64px;
    height: 64px;
    object-fit: contain;
  }
  
  .glow-label {
    font-weight: 600;
    color: var(--clr-text-primary);
  }
  
  .division-1 {
    box-shadow: 0 0 20px rgba(138, 73, 3, 0.872);
  }
  
  .division-2 {
    box-shadow: 0 0 20px rgba(192, 192, 192, 0.872); 
  }
  
  .division-3 {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.872); 
  }
  
  .division-4 {
    box-shadow: 0 0 20px rgba(1, 108, 133, 0.872);
  }
  
  .division-5 {
    box-shadow: 0 0 20px rgba(126, 12, 255, 0.872);
  }
  
  .division-6 {
    box-shadow: 0 0 20px rgba(255, 89, 0, 0.872);
  }
  
  @media (max-width: 768px) {
    .glow-effects-container {
      gap: 1rem;
    }
    
    .glow-frame {
      width: 80px;
      height: 80px;
    }
    
    .glow-content {
      width: 64px;
      height: 64px;
    }
    
    .glow-icon {
      width: 48px;
      height: 48px;
    }

    .ttt-rewards-image {
      max-width: 100%;
      width: 100%;
    }
  }
  
  .ttt-rewards-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1.5rem 0;
    width: 100%;
    max-width: 100%;
  }
  
  .ttt-rewards-image {
    max-width: 100%;
    height: auto;
    border: 4px solid var(--clr-border);
    border-radius: 8px;
    box-shadow: 0 4px 15px var(--clr-box-shadow);
    display: block;
  }

  .rewards-section {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    margin: 2.5rem 0 3rem 0;
    justify-content: flex-start;
  }

  .reward-card {
    background: linear-gradient(135deg, var(--clr-surface-2) 0%, var(--clr-surface-3) 100%);
    border-radius: 18px;
    box-shadow: 0 6px 32px var(--clr-box-shadow);
    padding: 2.5rem 2.5rem 2rem 2.5rem;
    max-width: 540px;
    min-width: 320px;
    flex: 1 1 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    border: 1.5px solid var(--clr-border);
    transition: box-shadow 0.3s, border 0.3s;
  }
  .reward-card:hover {
    box-shadow: 0 10px 40px var(--clr-box-shadow-orange);
    border: 1.5px solid var(--clr-primary);
  }
  .reward-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .reward-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: var(--clr-surface-3);
    box-shadow: 0 2px 8px var(--clr-box-shadow);
    object-fit: contain;
  }
  .reward-card h3 {
    color: var(--clr-primary-light);
    margin: 0;
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  .reward-card p {
    color: var(--clr-text-secondary);
    margin-bottom: 1.1rem;
    text-align: center;
  }
  .reward-note {
    font-size: 0.85rem;
    color: var(--clr-text-secondary);
    margin-top: auto;
  }
  
  @media (max-width: 1100px) {
    .rewards-section {
      flex-direction: column;
      align-items: center;
      gap: 2rem;
    }
    .reward-card {
      max-width: 95vw;
      min-width: 0;
      width: 100%;
      padding: 1.5rem 1rem 1rem 1rem;
    }
  }

  .apex-image {
    max-width: 120px;
    width: 100%;
    height: auto;
    margin: 0.5rem 0 1rem 0;
    display: block;
    border-radius: 10px;
    box-shadow: 0 2px 10px var(--clr-box-shadow);
  }
  </style>