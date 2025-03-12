(function(){var t={3049:function(t,e,s){"use strict";s.r(e),s.d(e,{default:function(){return l}});var n=function(){var t=this,e=t._self._c;return e("div",{attrs:{id:"app"}},[e("TrafficQuiz")],1)},i=[],r=s(5251),o={name:"App",components:{TrafficQuiz:r["default"]}},u=o,c=s(1656),a=(0,c.A)(u,n,i,!1,null,null,null),l=a.exports},5251:function(t,e,s){"use strict";s.r(e),s.d(e,{default:function(){return h}});var n=function(){var t=this,e=t._self._c;return e("div",{staticClass:"quiz-container"},[e("div",{staticClass:"romantic-message left"},[t._v("❤️ Seni Seviyorum, Serroş! ❤️")]),e("div",{staticClass:"romantic-message right"},[t._v("🌹 Aşkın her soruda yanında! 🌹")]),t.quizStarted?t.quizCompleted?e("div",{staticClass:"result-screen"},[e("h2",[t._v("Sınav Tamamlandı!")]),e("div",{staticClass:"final-score"},[t._v("Final Puanı: "+t._s(t.currentScore))]),e("div",{staticClass:"result-message",class:{passed:t.currentScore>=70,failed:t.currentScore<70}},[t._v(" "+t._s(t.currentScore>=70?"Tebrikler! Sınavı geçtiniz!":"Üzgünüm, sınavı geçemediniz.")+" ")]),e("div",{staticClass:"stats"},[e("p",[t._v("Doğru: "+t._s(t.correctAnswers))]),e("p",[t._v("Yanlış: "+t._s(t.wrongAnswers))])]),e("button",{staticClass:"restart-button",on:{click:t.restartQuiz}},[t._v("Tekrar Dene")]),e("button",{staticClass:"main-menu-button",on:{click:t.goToMainMenu}},[t._v("Ana Menü")])]):e("div",{staticClass:"quiz-content"},[e("div",{staticClass:"quiz-header"},[e("h2",[t._v("Soru "+t._s(t.currentQuestionIndex+1)+"/"+t._s(t.questions.length))]),e("div",{staticClass:"score"},[t._v("Puan: "+t._s(t.currentScore))]),e("div",{staticClass:"stats"},[e("p",[t._v("Doğru: "+t._s(t.correctAnswers))]),e("p",[t._v("Yanlış: "+t._s(t.wrongAnswers))]),e("p",[t._v("Süre: "+t._s(t.formatTime(t.timeRemaining)))])])]),t.currentQuestion?e("div",{staticClass:"question-container"},[e("p",{staticClass:"question"},[t._v(t._s(t.currentQuestion.question))]),t.currentQuestion.image?e("img",{staticClass:"traffic-sign-image",attrs:{src:s(5538)("./"+t.currentQuestion.image),alt:"Traffic Sign"}}):t._e(),e("div",{staticClass:"options"},t._l(t.currentQuestion.options||[],(function(s,n){return e("button",{key:n,class:{"option-button":!0,correct:t.showAnswer&&n===t.currentQuestion.correctAnswer,wrong:t.showAnswer&&t.selectedAnswers[t.currentQuestionIndex]===n&&n!==t.currentQuestion.correctAnswer},attrs:{disabled:t.showAnswer},on:{click:function(e){return t.checkAnswer(n)}}},[t._v(" "+t._s(s)+" ")])})),0)]):t._e(),e("div",{staticClass:"navigation-buttons"},[t.currentQuestionIndex>0?e("button",{staticClass:"nav-button",on:{click:t.goBack}},[t._v(" Geri ")]):t._e(),t.showAnswer?e("button",{staticClass:"next-button",attrs:{disabled:t.currentQuestionIndex>=t.questions.length-1},on:{click:t.nextQuestion}},[t._v(" "+t._s(t.currentQuestionIndex>=t.questions.length-1?"Sınavı Bitir":"Sonraki Soru")+" ")]):t._e(),e("button",{staticClass:"finish-button finish-exam-button",on:{click:t.finishExam}},[t._v(" Sınavı Bitir ")])])]):e("div",{staticClass:"start-screen"},[e("h1",[t._v("Trafik Kuralları Sınavı")]),e("p",[t._v("50 soru • Her soru 2 puan • Geçme notu: 70")]),e("div",{staticClass:"difficulty-selection"},[e("h3",[t._v("Zorluk Seviyesi Seçin")]),e("div",{staticClass:"difficulty-buttons"},[e("button",{class:["difficulty-button",{active:"easy"===t.selectedDifficulty}],on:{click:function(e){return t.selectDifficulty("easy")}}},[t._v(" Kolay ")]),e("button",{class:["difficulty-button",{active:"medium"===t.selectedDifficulty}],on:{click:function(e){return t.selectDifficulty("medium")}}},[t._v(" Orta ")]),e("button",{class:["difficulty-button",{active:"hard"===t.selectedDifficulty}],on:{click:function(e){return t.selectDifficulty("hard")}}},[t._v(" Zor ")]),e("div",{staticClass:"separator"})])]),t.selectedDifficulty?e("button",{staticClass:"start-button",attrs:{disabled:t.loading},on:{click:t.startQuiz}},[t._v(" "+t._s(t.loading?"Yükleniyor...":"Sınava Başla")+" ")]):t._e(),t.error?e("div",{staticClass:"error-message"},[t._v(" "+t._s(t.error)+" ")]):t._e()])])},i=[],r=(s(8111),s(7588),s(417)),o=s(1600),u={name:"TrafficQuiz",data(){return{quizStarted:!1,quizCompleted:!1,currentQuestionIndex:0,currentScore:0,correctAnswers:0,wrongAnswers:0,showAnswer:!1,selectedAnswers:[],selectedDifficulty:null,loading:!1,error:null,questions:[],timeLimit:1800,timeRemaining:1800,timer:null}},computed:{currentQuestion(){return!this.questions||this.currentQuestionIndex>=this.questions.length?null:this.questions[this.currentQuestionIndex]}},methods:{async fetchQuestions(){this.loading=!0,this.error=null;try{const t=await r.A.get(`http://localhost:3001/${this.selectedDifficulty}`);if(this.questions=t.data,this.questions.length<50&&"trafik levhaları"!==this.selectedDifficulty)throw new Error("Her zorluk seviyesinde 50 soru bulunamadı.");this.shuffleQuestions()}catch(t){"trafik levhaları"!==this.selectedDifficulty&&(this.error="Sorular yüklenirken bir hata oluştu. Lütfen tekrar deneyin.")}finally{this.loading=!1}},shuffleQuestions(){for(let t=this.questions.length-1;t>0;t--){const e=Math.floor(Math.random()*(t+1));[this.questions[t],this.questions[e]]=[this.questions[e],this.questions[t]]}},selectDifficulty(t){this.selectedDifficulty=t,this.fetchQuestions()},async startQuiz(){await this.fetchQuestions(),this.questions&&this.questions.length>0&&(this.quizStarted=!0,this.currentQuestionIndex=0,this.currentScore=0,this.correctAnswers=0,this.wrongAnswers=0,this.showAnswer=!1,this.selectedAnswers=[],this.timeRemaining=this.timeLimit,this.startTimer())},checkAnswer(t){this.selectedAnswers[this.currentQuestionIndex]=t,this.showAnswer=!0;const e=document.querySelectorAll(".option-button")[t];t===this.questions[this.currentQuestionIndex].correctAnswer?(this.currentScore+=2,this.correctAnswers++,e.classList.add("correct"),this.launchConfetti()):(this.wrongAnswers++,e.classList.add("wrong"))},launchConfetti(){(0,o.A)({particleCount:100,spread:70,origin:{y:.6}})},nextQuestion(){this.showAnswer=!1,this.currentQuestionIndex<this.questions.length-1?(this.currentQuestionIndex++,this.showAnswer=void 0!==this.selectedAnswers[this.currentQuestionIndex]):this.quizCompleted=!0;const t=document.querySelectorAll(".option-button");t.forEach((t=>{t.classList.remove("correct","wrong")}))},goBack(){this.currentQuestionIndex>0&&(this.currentQuestionIndex--,this.showAnswer=void 0!==this.selectedAnswers[this.currentQuestionIndex])},finishExam(){clearInterval(this.timer),this.quizCompleted=!0},restartQuiz(){this.quizCompleted=!1,this.currentQuestionIndex=0,this.currentScore=0,this.correctAnswers=0,this.wrongAnswers=0,this.showAnswer=!1,this.selectedAnswers=[],this.startQuiz()},startTimer(){this.timer=setInterval((()=>{this.timeRemaining>0?this.timeRemaining--:(clearInterval(this.timer),this.finishExam())}),1e3)},formatTime(t){const e=Math.floor(t/60),s=t%60;return`${e}:${s<10?"0":""}${s}`},goToMainMenu(){this.quizStarted=!1,this.quizCompleted=!1,this.currentQuestionIndex=0,this.currentScore=0,this.correctAnswers=0,this.wrongAnswers=0,this.showAnswer=!1,this.selectedAnswers=[],this.selectedDifficulty=null,this.error=null}}},c=u,a=s(1656),l=(0,a.A)(c,n,i,!1,null,"0972b0c7",null),h=l.exports},5538:function(t,e,s){var n={"./App":3049,"./App.vue":3049,"./components/TrafficQuiz":5251,"./components/TrafficQuiz.vue":5251,"./main":8790,"./main.js":8790};function i(t){var e=r(t);return s(e)}function r(t){if(!s.o(n,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return n[t]}i.keys=function(){return Object.keys(n)},i.resolve=r,t.exports=i,i.id=5538},8790:function(t,e,s){"use strict";s.r(e);var n=s(2856),i=s(3049);n.Ay.config.productionTip=!1,new n.Ay({render:t=>t(i["default"])}).$mount("#app")}},e={};function s(n){var i=e[n];if(void 0!==i)return i.exports;var r=e[n]={exports:{}};return t[n].call(r.exports,r,r.exports,s),r.exports}s.m=t,function(){var t=[];s.O=function(e,n,i,r){if(!n){var o=1/0;for(l=0;l<t.length;l++){n=t[l][0],i=t[l][1],r=t[l][2];for(var u=!0,c=0;c<n.length;c++)(!1&r||o>=r)&&Object.keys(s.O).every((function(t){return s.O[t](n[c])}))?n.splice(c--,1):(u=!1,r<o&&(o=r));if(u){t.splice(l--,1);var a=i();void 0!==a&&(e=a)}}return e}r=r||0;for(var l=t.length;l>0&&t[l-1][2]>r;l--)t[l]=t[l-1];t[l]=[n,i,r]}}(),function(){s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,{a:e}),e}}(),function(){s.d=function(t,e){for(var n in e)s.o(e,n)&&!s.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})}}(),function(){s.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){var t={524:0};s.O.j=function(e){return 0===t[e]};var e=function(e,n){var i,r,o=n[0],u=n[1],c=n[2],a=0;if(o.some((function(e){return 0!==t[e]}))){for(i in u)s.o(u,i)&&(s.m[i]=u[i]);if(c)var l=c(s)}for(e&&e(n);a<o.length;a++)r=o[a],s.o(t,r)&&t[r]&&t[r][0](),t[r]=0;return s.O(l)},n=self["webpackChunkserros_oyun"]=self["webpackChunkserros_oyun"]||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))}();var n=s.O(void 0,[504],(function(){return s(8790)}));n=s.O(n)})();
//# sourceMappingURL=app.909c31e6.js.map