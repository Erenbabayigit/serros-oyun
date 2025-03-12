<template>
  <div id="app">
    <TrafficQuiz />
  </div>
</template>

<script>
import TrafficQuiz from './components/TrafficQuiz.vue'

export default {
  name: 'App',
  components: {
    TrafficQuiz
  }
}
</script>

<style>
#app {
  font-family: 'Comic Sans MS', cursive, sans-serif;
  color: #ff69b4; /* Hot Pink */
  min-height: 100vh;
  padding: 20px;
  background: linear-gradient(135deg, #ffdee9 0%, #ffb6c1 100%); /* Light Pink gradient */
}

body {
  margin: 0;
  padding: 0;
}

.start-button {
  background-color: #ff69b4; /* Hot Pink */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.start-button:hover {
  background-color: #ff1493; /* Deep Pink */
}

.question {
  font-size: 20px;
  color: #ff1493; /* Deep Pink */
}
</style>
