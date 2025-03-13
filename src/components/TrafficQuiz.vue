<template>
  <div class="quiz-container">
    <div class="romantic-message left">❤️ Seni Seviyorum, Serroş! ❤️</div>
    <div class="romantic-message right">🌹 Aşkın her soruda yanında! 🌹</div>
    
    <div v-if="!quizStarted" class="start-screen">
      <h1>Trafik Kuralları Sınavı</h1>
      <p>50 soru • Her soru 2 puan • Geçme notu: 70</p>
      
      <div class="difficulty-selection">
        <h3>Zorluk Seviyesi Seçin</h3>
        <div class="difficulty-buttons">
          <button 
            @click="selectDifficulty('easy')"
            :class="['difficulty-button', { active: selectedDifficulty === 'easy' }]">
            Kolay
          </button>
          <button 
            @click="selectDifficulty('medium')"
            :class="['difficulty-button', { active: selectedDifficulty === 'medium' }]">
            Orta
          </button>
          <button 
            @click="selectDifficulty('hard')"
            :class="['difficulty-button', { active: selectedDifficulty === 'hard' }]">
            Zor
          </button>
          <div class="separator"></div>
        </div>
      </div>

      <button 
        v-if="selectedDifficulty" 
        @click="startQuiz" 
        class="start-button"
        :disabled="loading">
        {{ loading ? 'Yükleniyor...' : 'Sınava Başla' }}
      </button>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>

    <div v-else-if="!quizCompleted" class="quiz-content">
      <div class="quiz-header">
        <h2>Soru {{ currentQuestionIndex + 1 }}/{{ questions.length }}</h2>
        <div class="score">Puan: {{ currentScore }}</div>
        <div class="stats">
          <p>Doğru: {{ correctAnswers }}</p>
          <p>Yanlış: {{ wrongAnswers }}</p>
          <p>Süre: {{ formatTime(timeRemaining) }}</p>
        </div>
      </div>

      <div v-if="currentQuestion" class="question-container">
        <p class="question">{{ currentQuestion.question }}</p>
        <img v-if="currentQuestion.image" :src="require(`@/` + currentQuestion.image)" alt="Traffic Sign" class="traffic-sign-image" />
        <div class="options">
          <button
            v-for="(option, index) in currentQuestion.options || []"
            :key="index"
            @click="checkAnswer(index)"
            :class="{
              'option-button': true,
              'correct': showAnswer && index === currentQuestion.correctAnswer,
              'wrong': showAnswer && selectedAnswers[currentQuestionIndex] === index && index !== currentQuestion.correctAnswer
            }"
            :disabled="showAnswer"
          >
            {{ option }}
          </button>
        </div>
      </div>

      <div class="navigation-buttons">
        <button 
          v-if="currentQuestionIndex > 0" 
          @click="goBack" 
          class="nav-button">
          Geri
        </button>
        <button 
          v-if="showAnswer" 
          @click="nextQuestion" 
          class="next-button"
          :disabled="currentQuestionIndex >= questions.length - 1"
        >
          {{ currentQuestionIndex >= questions.length - 1 ? 'Sınavı Bitir' : 'Sonraki Soru' }}
        </button>
        <button 
          @click="finishExam" 
          class="finish-button finish-exam-button">
          Sınavı Bitir
        </button>
      </div>
    </div>

    <div v-else class="result-screen">
      <h2>Sınav Tamamlandı!</h2>
      <div class="final-score">Final Puanı: {{ currentScore }}</div>
      <div class="result-message" :class="{ 'passed': currentScore >= 70, 'failed': currentScore < 70 }">
        {{ currentScore >= 70 ? 'Tebrikler! Sınavı geçtiniz!' : 'Üzgünüm, sınavı geçemediniz.' }}
      </div>
      <div class="stats">
        <p>Doğru: {{ correctAnswers }}</p>
        <p>Yanlış: {{ wrongAnswers }}</p>
      </div>
      <button @click="restartQuiz" class="restart-button">Tekrar Dene</button>
      <button @click="goToMainMenu" class="main-menu-button">Ana Menü</button>
    </div>
  </div>
</template>

<script>
import confetti from 'canvas-confetti'; // Konfeti kütüphanesini içe aktar

export default {
  name: 'TrafficQuiz',
  data() {
    return {
      quizStarted: false,
      quizCompleted: false,
      currentQuestionIndex: 0,
      currentScore: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      showAnswer: false,
      selectedAnswers: [],
      selectedDifficulty: null,
      loading: false,
      error: null,
      questions: [],
      timeLimit: 30 * 60, // 30 dakika (dakika * 60 saniye)
      timeRemaining: 30 * 60, // Başlangıçta 30 dakika
      timer: null, // Zamanlayıcıyı saklamak için
    }
  },
  computed: {
    currentQuestion() {
      if (!this.questions || this.currentQuestionIndex >= this.questions.length) {
        return null
      }
      return this.questions[this.currentQuestionIndex]
    }
  },
  methods: {
  async fetchQuestions() {
    this.loading = true;
    this.error = null; // Clear previous error
    try {
      // Statik JSON dosyasını kullan
      const response = await fetch('/db.json');
      const data = await response.json();
      
      // Seçilen zorluğa göre soruları filtrele
      this.questions = data[this.selectedDifficulty] || [];
      
      if (this.questions.length < 50) {
        // If there are not enough questions, do not set an error
        if (this.selectedDifficulty !== 'trafik levhaları') {
          throw new Error('Her zorluk seviyesinde 50 soru bulunamadı.');
        }
      }
      this.shuffleQuestions(); // Shuffle questions after fetching
    } catch (err) {
      // Only set the error if it's not the "trafik levhaları" difficulty
      if (this.selectedDifficulty !== 'trafik levhaları') {
        this.error = 'Sorular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
      }
    } finally {
      this.loading = false;
    }
  },

    shuffleQuestions() {
      // Shuffle the questions array
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
      }
    },

    selectDifficulty(difficulty) {
      this.selectedDifficulty = difficulty;
      this.fetchQuestions(); // Fetch questions based on selected difficulty
    },

    async startQuiz() {
      await this.fetchQuestions();
      if (this.questions && this.questions.length > 0) {
        this.quizStarted = true;
        this.currentQuestionIndex = 0;
        this.currentScore = 0;
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.showAnswer = false;
        this.selectedAnswers = [];
        this.timeRemaining = this.timeLimit; // Süreyi sıfırla
        this.startTimer(); // Zamanlayıcıyı başlat
      }
    },

    checkAnswer(selectedIndex) {
      this.selectedAnswers[this.currentQuestionIndex] = selectedIndex;
      this.showAnswer = true;

      const button = document.querySelectorAll('.option-button')[selectedIndex];

      if (selectedIndex === this.questions[this.currentQuestionIndex].correctAnswer) {
        this.currentScore += 2;
        this.correctAnswers++;
        
        // Doğru cevap verildiğinde animasyonu tetikle
        button.classList.add('correct');
        this.launchConfetti(); // Konfeti patlat
      } else {
        this.wrongAnswers++;
        
        // Yanlış cevap verildiğinde animasyonu tetikle
        button.classList.add('wrong');
      }
    },

    launchConfetti() {
      // Konfeti efektini başlat
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 } // Konfeti yukarıdan düşsün
      });
    },

    nextQuestion() {
      this.showAnswer = false;
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.showAnswer = this.selectedAnswers[this.currentQuestionIndex] !== undefined;
      } else {
        this.quizCompleted = true;
      }

      // Buton sınıflarını temizle
      const buttons = document.querySelectorAll('.option-button');
      buttons.forEach(button => {
        button.classList.remove('correct', 'wrong');
      });
    },

    goBack() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.showAnswer = this.selectedAnswers[this.currentQuestionIndex] !== undefined;
      }
    },

    finishExam() {
      clearInterval(this.timer); // Zamanlayıcıyı durdur
      this.quizCompleted = true;
    },

    restartQuiz() {
      this.quizCompleted = false; // Sınav tamamlandı durumunu sıfırla
      this.currentQuestionIndex = 0; // Soru indeksini sıfırla
      this.currentScore = 0; // Puanı sıfırla
      this.correctAnswers = 0; // Doğru cevap sayısını sıfırla
      this.wrongAnswers = 0; // Yanlış cevap sayısını sıfırla
      this.showAnswer = false; // Cevapları gösterme durumunu sıfırla
      this.selectedAnswers = []; // Seçilen cevapları sıfırla
      this.startQuiz(); // Mevcut zorluk seviyesindeki soruları yeniden başlat
    },

    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          clearInterval(this.timer);
          this.finishExam(); // Süre dolduğunda sınavı bitir
        }
      }, 1000); // Her saniyede bir güncelle
    },

    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`; // 00:00 formatında göster
    },

    goToMainMenu() {
      this.quizStarted = false; // Sınav başlamış durumunu sıfırla
      this.quizCompleted = false; // Sınav tamamlandı durumunu sıfırla
      this.currentQuestionIndex = 0; // Soru indeksini sıfırla
      this.currentScore = 0; // Puanı sıfırla
      this.correctAnswers = 0; // Doğru cevap sayısını sıfırla
      this.wrongAnswers = 0; // Yanlış cevap sayısını sıfırla
      this.showAnswer = false; // Cevapları gösterme durumunu sıfırla
      this.selectedAnswers = []; // Seçilen cevapları sıfırla
      this.selectedDifficulty = null; // Zorluk seviyesini sıfırla
      this.error = null; // Hata mesajını sıfırla
    },
  }
}

</script>

<style scoped>
.romantic-message {
  position: absolute;
  font-size: 1.5em;
  font-weight: bold;
  color: #ff69b4; /* Pembe renk */
  text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.5); /* Gölge efekti */
  z-index: 1; /* Diğer içeriklerin üstünde görünmesi için */
}

.romantic-message.left {
  left: 20px; /* Sol tarafta konumlandır */
  top: 20px; /* Üstten biraz boşluk bırak */
}

.romantic-message.right {
  right: 20px; /* Sağ tarafta konumlandır */
  top: 20px; /* Üstten biraz boşluk bırak */
}

.quiz-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 30px;
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #ffe4e6, #ffccf9); /* Aşk dolu bir arka plan */
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(255, 0, 0, 0.2); /* Daha yumuşak bir gölge */
}

.start-screen, .result-screen {
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9); /* Hafif beyaz arka plan */
  border-radius: 15px;
  position: relative;
  border: 2px solid #ff69b4; /* Pembe bir kenar */
}

.start-screen::before {
  content: '❤️';
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 30px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-10px); }
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 25px;
  background: rgba(255, 228, 225, 0.8); /* Hafif pembe arka plan */
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(255, 75, 110, 0.1);
}

.quiz-header h2 {
  color: #ff4b6e;
  margin: 0;
}

.score {
  background: #ff69b4; /* Pembe arka plan */
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: bold;
}

.question-container {
  background: #fff;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 2px solid #ffe4e6;
}

.question {
  font-size: 1.3em;
  margin-bottom: 25px;
  color: #333;
  line-height: 1.5;
}

.options {
  display: grid;
  gap: 12px;
}

.option-button {
  padding: 15px 20px;
  border: 2px solid #ff69b4; /* Pembe kenar */
  border-radius: 10px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1.1em;
  color: #444;
}

.option-button:hover:not(:disabled) {
  background-color: #ffe4e6; /* Hafif pembe arka plan */
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(255, 75, 110, 0.1);
}

.option-button.correct {
  background-color: #4ade80; /* Yeşil arka plan */
  color: white;
  border-color: #22c55e;
  animation: pulse 0.5s; /* Puls efekti */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.option-button.wrong {
  background-color: #ff4b6e; /* Kırmızı arka plan */
  color: white;
  border-color: #e11d48;
  animation: shake 0.5s; /* Sarsılma efekti */
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

.next-button, .start-button, .restart-button, .finish-button, .main-menu-button {
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff69b4, #ffccf9); /* Pembe ve açık pembe geçişli arka plan */
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 75, 110, 0.3);
}

.next-button:hover:not(:disabled),
.start-button:hover,
.restart-button:hover,
.finish-button:hover,
.main-menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 75, 110, 0.4);
}

.next-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

.final-score {
  font-size: 2.5em;
  margin: 30px 0;
  color: #ff4b6e;
  font-weight: bold;
}

.result-message {
  font-size: 1.8em;
  margin: 25px 0;
  font-weight: bold;
  text-align: center;
  color: #ff69b4; /* Pembe renk */
}

.result-message.passed {
  color: #22c55e;
}

.result-message.failed {
  color: #ff4b6e;
}

.stats {
  margin: 25px 0;
  padding: 20px;
  background: rgba(255, 228, 225, 0.8); /* Hafif pembe arka plan */
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stats p {
  margin: 10px 0;
  font-size: 1.2em;
  color: #ff1493;
  font-weight: bold;
}

h1 {
  color: #ff4b6e;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.difficulty-selection {
  margin: 30px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(255, 75, 110, 0.1);
}

.difficulty-selection h3 {
  color: #ff4b6e;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.difficulty-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.difficulty-button {
  padding: 12px 25px;
  border: 2px solid #ff4b6e;
  border-radius: 20px;
  background: white;
  color: #ff4b6e;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.difficulty-button:hover {
  background: #fff6f6;
  transform: translateY(-2px);
}

.difficulty-button.active {
  background: #ff4b6e;
  color: white;
}

.separator {
  width: 2px; /* Width of the line */
  height: 40px; /* Height of the line */
  background-color: #ff69b4; /* Color of the line */
  margin: 0 10px; /* Spacing around the line */
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: #ffe4e6; /* Hafif pembe arka plan */
  color: #e11d48; /* Kırmızı renk */
  border-radius: 10px;
  font-size: 1.1em;
}

.start-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  box-shadow: none;
}

.start-button:disabled:hover {
  transform: none;
}

.nav-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff7f50, #ff1493);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 75, 110, 0.3);
  margin-right: 10px;
}

.nav-button:hover {
  background: linear-gradient(135deg, #ff1493, #ff7f50);
  transform: translateY(-2px);
}

.result-message {
  font-size: 1.8em;
  margin: 25px 0;
  font-weight: bold;
  text-align: center;
}

.result-message.passed {
  color: #22c55e;
}

.result-message.failed {
  color: #ff4b6e;
}

.main-menu-button {
  padding: 15px 30px;
  background: linear-gradient(135deg, #ff4b6e 0%, #ff8080 100%);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1.2em;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 75, 110, 0.3);
  margin-left: 10px;
}

.main-menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 75, 110, 0.4);
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.finish-exam-button {
  margin-left: auto;
}

/* Konfeti CSS */
#confetti {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Tıklanabilirliği devre dışı bırak */
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #ffcc00; /* Konfeti rengi */
  opacity: 0.8;
  animation: fall linear forwards;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0);
  }
  100% {
    transform: translateY(100vh) rotate(720deg); /* Ekranın altına düşme */
  }
}

.traffic-sign-image {
  max-width: 100%; /* Responsive image */
  height: auto; /* Maintain aspect ratio */
  margin: 20px 0; /* Spacing around the image */
}
</style>