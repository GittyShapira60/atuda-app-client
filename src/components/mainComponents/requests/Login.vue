<template>
  <div class="flex-card">
    <p class="user-name text-center">היי {{ username }}</p>
    <p class="simple-title text-login text-center">ברוך הבא לאזור האישי שלך</p>
    <BlueCard
      title="חדש!"
      text="באפשרותך להגיש בקשות באופן דיגיטלי ולעקוב כאן אחרי סטטוס הטיפול בהן"
      v-if="requests.length === 0"
    />
    <BlueCard text="סטטוס הבקשות הפעילות שלך" v-if="requests.length !== 0" />
    <v-container
      class="login-container pa-0 overflow-login"
      v-if="requests.length !== 0"
    >
      <RequestDetailsList :requests="requests" />
      <div
        :class="{
          specific: requests.length === 0,
          'd-flex justify-center': true,
        }"
      >
        <p class="text-login-info text-center">
          {{ text }}
        </p>
      </div>
    </v-container>
    <p v-if="requests.length === 0" class="text-login-info text-center">
      {{ text }}
    </p>
  </div>
  <FooterButton text="כניסה לאיזור הבקשות" @clicked="clicked" />
</template>

<script lang="ts" setup>
import { RequestDetails } from '@/interfaces/RequestDetails'

defineProps<{
  username: string
  requests: RequestDetails[]
}>()

const emit = defineEmits<{ (click: 'clicked'): void }>()
const clicked = () => {
  emit('clicked')
}

const text = 'בקרוב תוכלו לקבל כאן מידע וכלים נוספים להתנהלות בזמן העתודה'
</script>

<style lang="scss">
.flex-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-name {
  font-size: 5.14vw;
  font-weight: 600;
  line-height: 5.14vw;
  color: rgb(var(--v-theme-Professor-Plum));
  margin-top: 8.084vw !important;
}
.simple-title {
  margin-top: 1.5vh;
}

.login-container {
  padding: 3.75vw !important;
  margin: 3vw !important;
  width: 98% !important;
}
.text-login {
  margin-bottom: 2.2vh;
  width: 70vw;
  font-size: 3.738vw !important;
  line-height: 5.14vw !important;
}
.text-login-info {
  width: 70vw;
  font-size: 3.738vw !important;
  line-height: 5.14vw !important;
  margin-top: 5vw;
  margin-bottom: 5vw !important;
}
.specific {
  margin-top: 2.4vh !important;
}

.overflow-login {
  height: 46vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.5vw 5vw !important;
}

@media screen and (max-height: 668px) {
  .overflow-login {
    height: 39vh;
    padding: 0 5vw !important;
  }
}
</style>
