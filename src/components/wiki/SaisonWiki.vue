<template>
    <div class="range-system-wiki">
      <h2>Saison</h2>
      <p>
        Da das FirePhenix Rangsystem ein kumulatives System ist, ist es oft neueren Spielern nicht möglich, mit den alten Spielern mitzuhalten.
        Daher wurde ein jährliches Saison-System eingeführt, das es auch neuen Spielern ermöglicht, Erfolge zu feiern und die Spitze einer Rangliste
        zu erreichen. 
      </p>
      <p>
        Das Saison-System funktioniert fast identisch mit dem normalen Rangsystem, jedoch mit einigen wichtigen Unterschieden: Zum einen wird jährlich sämtlicher
        Fortschritt zurückgesetzt. Desweiteren erhältst du die Rangbelohnungen nicht sofort, sondern erst am Ende der Saison, wenn du den Rang zum Reset halten konntest.
        Desweiteren wird die oberste Division nicht von einer bestimmten Zeit begrentzt, sondern von einer bestimmten Anzahl an Plätzen. Nur die besten zehn Spieler
        jeder Saison erhalten den Rang "Phönix".
      </p>
      <p>
        Der letzte wichtige Unterschied ist die Art der Belohnungen. Während du im normalen Rangsystem Belohnungen wie TeamSpeak und Discord Rechte erhältst, erhältst du im Saison-System
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
    </div>
  </template>
  
  <script setup>
  const divisionRequirements = {
      1: '0 Stunden',
      2: '50 Stunden',
      3: '150 Stunden',
      4: '300 Stunden',
      5: '400 Stunden',
      6: '10 besten Diamant Spieler',
  }
  
  const divisionRewards = {
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: ''
  }

  const divisionName = {
    1: 'Bronze',
    2: 'Silber',
    3: 'Gold',
    4: 'Platin',
    5: 'Diamant',
    6: 'Phönix',
  }

  const divisionIcon = {
    1: 'bronze.png',
    2: 'silver.png',
    3: 'gold.png',
    4: 'platinum.png',
    5: 'diamond.png',
    6: 'phoenix.png',
  }

  const getDivisionName = (division) => {
    return divisionName[division] || 'Unbekannt'
  }

  const getDivisionIconPath = (division) => {
    return `/src/assets/images/ranks/${divisionIcon[division]}`
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
  </style>