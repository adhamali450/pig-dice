const app = Vue.createApp({
  data: () => {
    return {
      universe: 0,
      character: -1,
      objective: 100,
    };
  },
  methods: {
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

    toggleUniverse() {
      //current universe in the slider object is 1-based not 0-based
      document
        .querySelector("#slider-container")
        .addEventListener("transitionend", () => {
          this.universe = FlexSlider.current - 1;
        });
    },

    //upadtes all the characters (on-load and when universe changes)
    setCharacters() {
      document.querySelectorAll(".character").forEach(this.setCharacter);
    },

    //sets a background image to a character button
    setCharacter(item, index, arr) {
        characterStr = getCharacterStr(this.universe, index);

      if (characterStr != undefined) {
        const path = getCharacterPath(this.universe, index);
        item.style.backgroundImage = "url(" + path + ")";

        if (item.classList.contains("disabled"))
          item.classList.remove("disabled");
      } 
      else {
        item.classList.add("disabled");
        item.style.backgroundImage = "url(../assets/lock.svg)";
      }

      //remove previous selected before universe toggle
      if (item.classList.contains("selected")) {
        item.classList.remove("selected");
        this.character = -1;
      }

      //remove error label if visible
      document.querySelector("#character-error").style = "visibility: hidden";
    },

    //Select a specfic character among all the characters
    selectCharacter(item, index, arr) {
      item.addEventListener("click", () => {
        //removing any other selects
        document.querySelectorAll(".character").forEach(this.removeSelectings);

        item.classList.add("selected");
        this.character = index;
      });
    },

    removeSelectings(prevItem) {
      prevItem.classList.remove("selected");
    },

    validateInput() {
      if (this.objective < 1) this.objective = 100;

      if (this.character == -1) {
        document.querySelector("#character-error").style =
          "visibility: visible";
        return false;
      }

      return true;
    },

    startNewGame() {
      /*Validating input
        1- ensuring user picks a character
        2- if objective is lower than 1 (zero or negative) it will be set as 100 by default*/
      if (!this.validateInput()) return;

      /*store universe, character, opponent, objective for the next page
      (using seassion storage)*/

      //universe
      window.sessionStorage.setItem("universe", this.universe);
      //character
      window.sessionStorage.setItem("character", this.character);
      //opponent
      window.sessionStorage.setItem("opponent", this.opponent);
      //objective
      window.sessionStorage.setItem("objective", this.objective);

      //navigating to game.html
      utils.navigate("game.html")
    },
  },
  computed: {
    //universe as a string (0: "adventure-time")
    selectedUniverseStr: function () {
      return universes[this.universe];
    },

    //select a random opponent
    opponent: function () {
      let opponent;

      //making sure the opponent cannot be the same as the character
      do {
        opponent = utils.rand(0, characters[this.selectedUniverseStr].length);
      } while (opponent == this.character);

      return opponent;
    },
  },
  watch: {
    universe: function (val) {
      this.setCharacters();
    },
  },
  beforeMount() {
    window.addEventListener("keyup", (event) => {
      if (event.key === "Enter" || event.code === 13) this.startNewGame();
    });
  },
  mounted() {
    //set page theme and render theme-button animation
    getTheme();

    //render avatars on loading
    this.setCharacters();

    //handling selecting a specific character
    document.querySelectorAll(".character").forEach(this.selectCharacter);
  },
});

app.mount("#app");
