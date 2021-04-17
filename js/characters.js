const universes = ["adventure-time", "steven-universe"];

const characters = {
  "adventure-time": [
    "finn",
    "bmo",
    "bubble-gum",
    "ice-king",
    "jake",
    "lumpy-space",
    "marceline",
  ],

  "steven-universe": [
    "steven",
    "sapphire",
    "grant",
    "greg",
    "rose-quartz",
    //easter-egg: character based on theme (on loading only)
    localStorage.getItem("theme"),
    "ruby",
    "pearl",
  ],
};

function getUniverseStr(universeIndex){
  return universes[universeIndex];
}

function getCharacterStr(unvierseIndex, index){
  return characters[getUniverseStr(unvierseIndex)][index];
}

function getCharacterPath(universeIndex, index) {
  const universeStr = getUniverseStr(universeIndex);
  return "../assets/" + universeStr + "/" + characters[universeStr][index] + ".svg";
}

function getDecoratedCharacterName(characterName){
  return utils.initCap(characterName.replace('-', ' ')); 
}
