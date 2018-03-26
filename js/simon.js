const state = {
  pattern: [], //new Array(),
  round: 0,
  n: 1,
  speed: 1000,
  clicked: 0,
  isPlaying: false,
  colors: [
    'green',
    'red',
    'yellow',
    'blue'
  ],
  audio: {
    'green': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    'red': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    'yellow': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    'blue': new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
  }
};
  
        /* AUDIO INITIALIZATION */

    const playAudio = (color) => {
      let clone = state.audio[color].cloneNode();
      clone.play();
      anim(color);
    }
    

        /* COLOR ANIMATION */

    const anim = (color) => {
      let i = 0;
      (function (i) {
        setTimeout(function () {
          $("#" + color).css("opacity", "1");
          setTimeout(function(){ $("#" + color).css("opacity", "0.5"); }, 1000);
        }, 1500*i);
      })(i);
    }

    
        /* PATTERN CREATION & MODIFICATION */

  const generatePattern = (length) => {
    state.pattern = []; //Empty pattern

     while (state.pattern.length < length) {
      let int = Math.floor(Math.random() * 4) + 1;
      state.pattern.push(state.colors[int - 1]);
    };
    //return state.pattern; //Probably unnecessary since we're changing a state that is globally referenced
  }

  const patternAdd = () => {
    if (state.pattern.length === 20) {
        notifyUser("CONGRATULATIONS! YOU REACHED THE FINAL LEVEL... WANT TO PLAY AGAIN?");
        reset();
        return false
    }
    
    state.round++
    let int = Math.floor(Math.random() * 4) + 1;
    state.pattern.push(state.colors[int - 1]);
    setTimeout(function() {simon(state.pattern)}, 1000);
  }



        /* TURNS - PLAYER/SIMON */

  //SIMON'S TURN
  const simon = (pattern) => {
    notifyUser("SIMON'S TURN");
    
    $("#turn").html("Simon");
    
    for (let i = 0; i < state.pattern.length; i++) {
      (function (i) {
        setTimeout(function () {
          playAudio(state.pattern[i]);
        }, state.speed*i);
      })(i);
    }

    setTimeout(function() { player(); }, state.speed*state.pattern.length+1000);
  }
  
  //PLAYER'S TURN
  const player = () => {
    if (state.isPlaying === false) {
      notifyUser("TRY AGAIN?");
      return false;
    }
    
    notifyUser("YOUR TURN...");
    $("#turn").html("User");
    $(".colors").unbind("click");
    state.clicked = 0;
    $(".colors").on("click", function(e) { 
         state.clicked++;

        if (state.clicked > state.pattern.length) {
          return false
        }

       else if (state.clicked <= state.pattern.length && e.target.id === state.pattern[state.clicked - 1]) {
          if (state.clicked === state.pattern.length) {
            setTimeout(function() { notifyUser("THAT'S RIGHT! CONTINUING PATTERN..."); patternAdd(); }, 500);
            return false
          }
        }

        else if (state.clicked >= state.pattern.length || e.target.id !== state.pattern[state.clicked - 1]) {
          reset();
          notifyUser("YOU LOST... TRY AGAIN?");
          return false
        }
    });
  }

 /* OTHERS */
const notifyUser = (msg) => {
  $('.vertical-line span').html(msg);
}

const reset = () => {
  state.isPlaying = false;
  state.pattern = [];
  state.round = 0;
  state.speed = 1000;
  $('#start').html('START');
  notifyUser("TRY AGAIN?");
}



        /* EVENT HANDLERS */

  //.COLORS
/*
  $(".colors").click(function (e) {
    let color = e.target.id;
    playAudio(color);
  });
*/
  
  //#START
  $('#start').click(function () {
    if (state.isPlaying === false) {
      notifyUser("STARTING GAME...");
      $('#start').html('RESET');
      state.isPlaying = true;
      generatePattern(state.n);
      setTimeout(function(){ simon(state.pattern) }, 1000);
    }
    else if (state.isPlaying === true) {
      notifyUser("RESETTING GAME...");
      setTimeout(function() { reset(); }, 1000);
    }
  });