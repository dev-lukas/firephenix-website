<template>
  <div class="percentile-container">
    <div class="percentile-info">
      <div class="percentile-value">
        <span class="value">Top {{ displayPercentage }}%</span>
        <span class="label">der Spieler</span>
      </div>
      <div class="percentile-description">
        Du gehörst zu den besten {{ displayPercentage }}% aller Spieler
      </div>
    </div>
    <div class="percentile-bar-container">
      <div
        class="percentile-bar"
        :style="{ width: animatedWidth + '%' }"
      >
        <div class="marker">
          <i class="fas fa-caret-up"></i>
          <span>Du</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const props = defineProps({
  rankPercentage: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100,
  },
});

const displayPercentage = parseFloat(props.rankPercentage).toFixed(1);
const topPercentage = Math.max(1, Math.ceil(100 - props.rankPercentage));

const animatedWidth = ref(0);
onMounted(() => {
  setTimeout(() => {
    animatedWidth.value = topPercentage;
  }, 200);
});
watch(() => props.rankPercentage, (newVal) => {
  const newTop = Math.max(1, Math.ceil(100 - newVal));
  animatedWidth.value = 0;
  setTimeout(() => {
    animatedWidth.value = newTop;
  }, 200);
});
</script>

<style scoped>
.percentile-container {
  background: var(--clr-surface);
  border: 1px solid var(--clr-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.percentile-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.percentile-value {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.percentile-value .value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--clr-primary);
}

.percentile-value .label {
  font-size: 0.9rem;
  color: var(--clr-text-secondary);
}

.percentile-description {
  color: var(--clr-text-secondary);
  font-size: 0.9rem;
}

.percentile-bar-container {
  height: 24px;
  background: var(--clr-surface-elevated-1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.percentile-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--clr-primary) 0%,
    var(--clr-primary-light) 100%
  );
  border-radius: 12px;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  min-width: 24px;
  overflow: hidden;
}

.percentile-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: -40%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 100%);
  animation: shimmer 2.2s infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    left: -40%;
  }
  100% {
    left: 100%;
  }
}

.marker {
  position: absolute;
  right: -8px;
  top: -24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--clr-primary);
}

.marker i {
  font-size: 1.2rem;
}

.marker span {
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .percentile-container {
    padding: 1rem;
  }

  .percentile-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .percentile-value .value {
    font-size: 1.5rem;
  }

  .percentile-bar-container {
    height: 20px;
  }
}
</style>
