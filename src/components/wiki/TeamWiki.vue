<template>
  <div class="teamwiki">
    <h2>Unser Team</h2>
    <p class="intro">Unser engagiertes Team sorgt für einen reibungslosen Ablauf und steht euch jederzeit mit Rat und Tat zur Seite. Hier stellen wir euch die wichtigsten Ansprechpartner vor:</p>
    <div class="team-cards">
      <a href="#admin-profile" class="team-link">
        <div class="team-card admin">
          <div class="avatar-wrapper">
            <img :src="adminProfileUrl" alt="Admin" class="avatar" />
          </div>
          <div class="card-content">
            <h3>Lukas</h3>
            <span class="role">Admin</span>
            <p>~ Alduin86</p>
            <p>Gründer & Hauptverantwortlicher<br />Leitung & Entwicklung<br /></p>
          </div>
        </div>
      </a>
      <div class="moderator-row">
        <a href="#ts-moderator-profile" class="team-link">
          <div class="team-card moderator">
            <div class="avatar-wrapper">
              <img :src="moderatorProfileUrl" alt="Teamspeak Moderator" class="avatar" />
            </div>
            <div class="card-content">
              <h3>Erik</h3>
              <span class="role">Moderator</span>
              <p>~ Stahlkefer</p>
              <p>Support & Moderation<br />Teamspeak Ansprechpartner<br /></p>
            </div>
          </div>
        </a>
        <a href="#discord-moderator-profile" class="team-link">
          <div class="team-card moderator">
            <div class="avatar-wrapper">
              <img :src="moderatorProfileUrl" alt="Discord Moderator" class="avatar" />
            </div>
            <div class="card-content">
              <h3>Philip</h3>
              <span class="role">Moderator</span>
              <p>~ Flippster98</p>
              <p>Support & Moderation<br />Discord Ansprechpartner<br /></p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const adminProfileUrl = new URL('../../assets/images/staff/admin.png', import.meta.url).href;
const moderatorProfileUrl = new URL('../../assets/images/staff/moderator.png', import.meta.url).href;
</script>

<style scoped>
.teamwiki {
  text-align: center;
}

.teamwiki h2 {
  color: var(--clr-primary);
  margin-bottom: 1.5rem;
}

.intro {
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  color: var(--clr-text-secondary);
  font-size: 1.08rem;
  line-height: 1.6;
}
.team-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  margin-top: 2.5rem;
}
.team-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.moderator-row {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  margin-top: 0.5rem;
}
.team-card {
  background: var(--clr-surface-2);
  border-radius: 22px;
  box-shadow: 0 6px 32px 0 var(--clr-box-shadow-orange), 0 1.5px 8px 0 var(--clr-box-shadow);
  border: 1.5px solid var(--clr-border);
  min-width: 260px;
  max-width: 300px;
  color: var(--clr-text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.2rem 1.7rem 1.7rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s cubic-bezier(.4,2,.6,1), box-shadow 0.22s, border 0.22s;
  backdrop-filter: blur(6px);
}
.team-card:hover {
  transform: translateY(-10px) scale(1.035);
  box-shadow: 0 12px 40px 0 rgba(249,133,0,0.22), 0 2px 12px 0 rgba(0,0,0,0.22);
  border: 1.5px solid var(--clr-primary);
}
.team-card.admin {
  border: 1.5px solid var(--clr-primary);
}
.avatar-wrapper {
  background: var(--clr-surface-2);
  border-radius: 50%;
  padding: 4px;
  margin-bottom: 1.2rem;
  transition: box-shadow 0.22s;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--clr-background);
  border: 2.5px solid var(--clr-primary-light);
  display: block;
}
.card-content {
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.role {
  display: inline-block;
  background: var(--clr-primary);
  color: var(--clr-text-primary);
  font-size: 1.02rem;
  font-weight: 600;
  padding: 0.32rem 1.2rem;
  border-radius: 13px;
  margin-bottom: 0.8rem;
  margin-top: 0.25rem;
  letter-spacing: 0.01em;
  box-shadow: 0 1px 4px 0 var(--clr-box-shadow);
  transition: background 0.18s;
}
.team-card h3 {
  margin: 0.18rem 0 0.12rem;
  font-size: 1.28rem;
  color: var(--clr-text-primary);
  font-weight: 700;
  letter-spacing: 0.01em;
}
.team-card p {
  font-size: 1.01rem;
  color: var(--clr-text-primary);
  margin-top: 0.7rem;
  line-height: 1.5;
  text-align: center;
}
@media (min-width: 900px) {
  .team-cards {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr;
    row-gap: 2.5rem;
  }
  .team-link {
    justify-self: center;
  }
  .moderator-row {
    display: flex;
    flex-direction: row;
    gap: 2.5rem;
    justify-content: center;
  }
}
@media (max-width: 900px) {
  .team-cards {
    flex-direction: column;
    align-items: center;
    gap: 1.7rem;
  }
  .team-card {
    min-width: 220px;
    max-width: 98vw;
  }
  .moderator-row {
    flex-direction: column;
    gap: 1.7rem;
    align-items: center;
  }
}
</style>
