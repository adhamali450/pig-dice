const utils = {
  rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },

  initCap(str){
    var separateStr = str.toLowerCase().split(' ');
    for (var i = 0; i < separateStr.length; i++) {
        separateStr[i] = separateStr[i].charAt(0).toUpperCase() +
        separateStr[i].substring(1);
    }
    return separateStr.join(' ');
  },

  numberBetween(min, max, number){
    if(number >= min && number < max)
      return true;

    return false;
  },

  navigate(href){
      window.location.href = href;
  }
};
