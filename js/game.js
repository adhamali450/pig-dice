let diceAnimation;

const app = Vue.createApp({
  data: () => {
    return {
      //game clock
      totalSeconds: "",
      //main data
      universe: "",
      players: [
        (character = {
          name: "",
          path: "",
        }),
        (opponent = {
          name: "",
          path: "",
        }),
      ],
      objective: 0,
      //in-game data
      scores: [0, 0],
      roundScore: 0,
      firstTurn: 0,
      turn: 0,
      //1: resumed, 0:paused
      isGameResumed: 1,
      /*1: dice is rolling (buttons should be disabled)
        0: dice in not rolling*/
      rolling: 0,

      /*1: if the match is done
        0: if still in progress*/
      isMatchEnded: 0,

      //final game stats
      gameStats: {
        winner: {
          name: "",
          path: "",
        },
        loser: {
          name: "",
          path: "",
        },
        gameTime: "",
        quotes: [
          //Asterisk (if existed) will be replaced by either winner or lose name
          {
            mainQuote: "As always for <winner>, devoted to crush.",
            subQuote: "Not suprised",
          },
          {
            mainQuote: "<loser> actually had a chance,",
            subQuote: "lol just kidding.",
          },
          {
            mainQuote: "Ain't buying this win, <winner>.",
            subQuote: "Developer demands a rematch.",
          },
        ],
        selectedQuote: {
          mainQuote: "",
          subQuote: "",
        },
      },
    };
  },
  methods: {
    pauseControl() {
      //if game is resumed pause it
      if (this.isGameResumed === 1) {
        this.isGameResumed = 0;
      }
      //resuming the game
      else {
        this.isGameResumed = 1;

        //resuming the count
        this.count();
      }

      document.body.classList.toggle("paused");
    },

    roll() {
      const face = utils.rand(1, 7);

      this.animateDice(face);

      this.rolling = 1;
      setTimeout(() => {
        if (face > 1) {
          this.roundScore += face;
        } else {
          this.switchTurns();
        }
        this.rolling = 0;
      }, 2000);
    },

    calculateStats() {
      this.gameStats.winner = this.players[this.turn];
      this.gameStats.loser = this.players[1 - this.turn];

      if (this.gameStats.winner.name !== this.players[0].name) {
        const scoresContainer = document.querySelector(".scores");

        scoresContainer.style.flexDirection = "row-reverse";
      }

      this.gameStats.gameTime = this.formatTime(this.totalSeconds);

      this.gameStats.selectedQuote = this.getQuote(this.scores);
    },

    getQuote(scores) {
      //quote is selected based on a ratio (loser_percentage / winner_percentage)
      /*0 -> 0.2475: first quote
        0.2475 -> 0.7425: second quote
        0.7425 -> 0.99: third quote*/

      //Our inter quartiles:
      const q1 = 0.2475,
        q3 = 0.7425;

      const loserPercentage = this.getScorePercentage(
          this.scores[1 - this.turn]
        ),
        winnerPercentage = this.getScorePercentage(this.scores[this.turn]),
        ratio = loserPercentage / winnerPercentage;

      let quote = null;

      if (utils.numberBetween(0, q1, ratio)) {
        quote = this.gameStats.quotes[0];
      } else if (utils.numberBetween(q1, q3, ratio)) {
        quote = this.gameStats.quotes[1];
      } else if (utils.numberBetween(q3, 0.99, ratio)) {
        quote = this.gameStats.quotes[2];
      }

      //proccessing main quote
      quote.mainQuote = quote.mainQuote.replace(
        "<winner>",
        getDecoratedCharacterName(this.gameStats.winner.name)
      );
      quote.mainQuote = quote.mainQuote.replace(
        "<loser>",
        getDecoratedCharacterName(this.gameStats.loser.name)
      );

      return quote;
    },

    showStatsMenu() {
      //sliding the stats menu up
      const statsMenu = document.querySelector(".stats-menu");

      statsMenu.style.transition =
        "transform var(--game-stats-transition) ease-out var(--game-stats-transition)";
      statsMenu.style.transform = "translate(-50%,0%)";
    },

    hold() {
      const isMatchEnded =
        this.scores[this.turn] + this.roundScore >= this.objective;
      //final hold in the game
      if (isMatchEnded) {
        this.scores[this.turn] = this.objective;
        this.roundScore = 0;

        this.isMatchEnded = true;
      }
      //otherwise
      else {
        this.scores[this.turn] += this.roundScore;
        this.switchTurns();
      }
    },

    switchTurns() {
      this.turn = 1 - this.turn;
      this.roundScore = 0;
    },

    getScorePercentage(score) {
      return (score / this.objective) * 100;
    },

    reset() {
      //resetting scores and turns
      this.scores = [0, 0];
      this.roundScore = 0;
      this.turn = this.firstTurn;

      //resetting clock
      this.resetCount();
    },

    animateDice(face) {
      //remove the old face
      diceAnimation.destroy();

      //render the new face
      diceAnimation = bodymovin.loadAnimation({
        container: document.getElementById("dice-container"),
        animationData: JSON.parse(localStorage.getItem("die-" + face)),
        renderer: "canvas",
        loop: false,
        autoplay: true,
        rendererSettings: {
          progressiveLoad: true,
        },
      });
    },

    generateFirstTurn() {
      this.turn = utils.rand(0, 2);
    },

    switchTheme() {
      const body = document.body;

      if (body.classList.contains("dark")) {
        body.classList.remove("dark");
        body.classList.add("light");

        localStorage.setItem("theme", "light");
      } else if (body.classList.contains("light")) {
        body.classList.remove("light");
        body.classList.add("dark");

        localStorage.setItem("theme", "dark");
      }
    },

    formatTime(seconds) {
      const difference = new Date(seconds * 1000),
        differenceStr = difference.toISOString();
      if (difference.getHours > 0) return differenceStr.substr(11, 8);
      else return differenceStr.substr(14, 5);
    },

    count() {
      if (!this.isGameResumed) return;

      this.totalSeconds++;

      setTimeout(this.count, 1000);
    },

    resetCount() {
      this.totalSeconds = 0;
    },

    getGameData() {
      if (window.sessionStorage.getItem("character") === null) return false;

      //retrieve universe, characters and objective from session-storage

      //universe
      this.universe = window.sessionStorage.getItem("universe");

      //character
      const characterIndex = window.sessionStorage.getItem("character");
      this.players[0].name = getCharacterStr(this.universe, characterIndex);
      this.players[0].path = getCharacterPath(this.universe, characterIndex);

      //opponent
      const opponentIndex = window.sessionStorage.getItem("opponent");
      this.players[1].name = getCharacterStr(this.universe, opponentIndex);
      this.players[1].path = getCharacterPath(this.universe, opponentIndex);

      this.objective = window.sessionStorage.getItem("objective");
      return true;
    },

    gotoMainMenu() {
      utils.navigate("index.html");
    },

    restartGame() {
      location.reload();
    },
  },
  computed: {},
  watch: {
    isMatchEnded: function () {
      if (this.isMatchEnded) {
        this.pauseControl();
        this.calculateStats();
        this.showStatsMenu();
      }
    },
  },

  beforeMount() {
    /*If user went directly into this page without picking a character and an objective,
      direct to idnex.html*/
    if (!this.getGameData()) window.location.href = "index.html";

    //geting color theme (light mode or dark mode);
    getTheme();

    //returning random 0 or 1 as a first turn
    this.generateFirstTurn();
  },
  mounted() {
    //remove player avatar skeleton look
    document.querySelectorAll(".player-avatar").forEach((itme) => {
      itme.classList.remove("premount-style");
    });

    //starting clock
    this.count();

    //loading an initial die with face 1
    diceAnimation = bodymovin.loadAnimation({
      container: document.getElementById("dice-container"),
      animationData: JSON.parse(localStorage.getItem("die-1")),
      renderer: "svg",
      loop: false,
      autoplay: false,
    });
    diceAnimation.goToAndStop(2900);

    const mouseWheelAnimation = bodymovin.loadAnimation({
      container: document.getElementById("mouse-wheel-animation"),
      path: "https://assets5.lottiefiles.com/packages/lf20_66CQcm.json",
      renderer: "svg",
      loop: true,
      autoplay: true,
    });
  },
});

app.mount("#app");
