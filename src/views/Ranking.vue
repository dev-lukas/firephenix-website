<!-- views/Ranking.vue -->
<template>
  <div class="ranking-page">
    <UserStats />
    <UsageChart />
    <RankingList />
    <UserTable />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RankingList from '../components/ranking/RankingList.vue'
import UserStats from '../components/ranking/UserStats.vue'
import UsageChart from '../components/ranking/UsageChart.vue'
import UserTable from '../components/ranking/UserTable.vue'
</script>

<style scoped>
.ranking-page {
  min-height: 100vh;
  background-color: var(--clr-background);
  padding: 80px 20px 40px;
}
</style>
