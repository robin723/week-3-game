window.onload = function() {
	
	// Declare variables + functions

	var answers = [
		"daenerys targaryen",
		"cersei lannister", 
		"jamie lannister",
		"tyrion lannister",
		"joffrey baratheon", 
		"sandor clegane",
		"loras tyrell",
		"petyr baelish",
		"jon snow", 
		"arya stark",
		"syrio forel",
		"jaqen h'ghar",
		"brienne tarth",
		"theon greyjoy",
		"varys",
	];

	var hints = [
		"Mother of Dragons", 
		"Dowager Queen",
		"Kingslayer",
		"Imp",
		"Bastard King",
		"Hound",
		"Flower Knight",
		"Littlefinger",
		"Lord Crow",
		"No One",
		"First Sword of Braavos",
		"Faceless Man",
		"Beauty",
		"Eddard's Ward",
		"Master of Whisperers",
	];

	var userLivesInit; 	// Initial lives
	var userLives;			// User lives

	var userWinsCount = 0;
	var userWins = document.getElementById('userWins');

	var answer;					// Random answer
	var checkAnswer;		// Holds letters to check user guess against

	var word = document.getElementById('word');
	var letters;
	var letter;

	var counter = document.getElementById('direwolf-den');
	var life;
	
	var getUserGuess;
	var userGuess;
	var userGuessPile = document.getElementById('userGuessPile');
	var userGuessed;

	var hint = document.getElementById('hint');
	var hintContent = document.getElementById('hintContent');
	var hintClick; 			// Number of times user click on hint

	var endGame; 				// True or false: Is game ended?

	// Reset counts
	var resetLives = function() {
		userLivesInit = 5;	// Total number of legit Stark kids
		userLives = userLivesInit;
		initDirewolf();
		stats.textContent = userLives + " Direwolves Remaining";
	}
  
	// Create initial user lives count
	var initDirewolf = function() {
		// Clear counter
		counter.innerHTML = "";
		// Create counter
		for (var i = 0; i < userLives; i++) {
			life = document.createElement('img');
			life.setAttribute('src','assets/img/direwolf.png');
			life.setAttribute('width','45px');
			life.setAttribute('height','45px');
			life.setAttribute('id', i);
			counter.appendChild(life);
		}
	}

	// Kill direwolf
	var killDirewolf = function() {
		userLives -=1;
  	document.getElementById(userLives).setAttribute('class','direwolf-kill');
  }

  // Update stats
  var updateStats = function() {
  	userGuessPile.textContent = userGuessed.join(", ");
  	stats.textContent = userLives + " Direwolves Remaining";
  }

  // Update wins
  var updateUserWins = function() {
  	userWins.textContent = userWinsCount;
  }
		
	// Create new word for user to guess
	var newAnswer = function() {
    
    // Clear word
    word.innerHTML = "";
    checkAnswer = [];

    // Get random answer from answers
		answer = answers[Math.floor(Math.random() * answers.length)];
		console.log(answer);

    // Create word
    letters = document.createElement('ul');

    for (var i = 0; i < answer.length; i++) {
      
      letters.setAttribute('id', 'letters');
      letter = document.createElement('li');
      letter.setAttribute('class', 'letter');

    	// Check if alphabetic character
    	if (/^[a-zA-Z]+$/.test(answer[i])) {
    		letter.textContent = "_";
    	} 
    	// Else show as is
    	else {
    		letter.textContent = answer[i];
    	}

      word.appendChild(letters);
      letters.appendChild(letter);

      checkAnswer.push(letter);
    }
  }

  // Update game status
  var updateGameStatus = function() {

  	var letterCount = 0; 	// Number of letters filled
  	var lifeCount = 0; 		// Number of lives left

  	// How many letters filled?
  	for (var i = 0; i < answer.length; i++) {
  		if (checkAnswer[i].textContent !== '_') {
  			letterCount++;
  		}
  	}

  	// How many alive?
		for (var i = 0; i < userLivesInit; i++) {
			if (document.getElementById(i).className !== 'direwolf-kill') {
				lifeCount++;
			}
		}

  	if (letterCount == answer.length && lifeCount > 0) {
	  	// If yes to both, user wins
	  	hint.setAttribute('id', 'you-win');
	  	hintContent.textContent = "You Win";
	  	endGame = true;
	  	userWinsCount++;
	  	updateUserWins();
	  } else if (lifeCount == 0) {
  		// If no lives left, user loses
  		hint.setAttribute('id', 'game-over');
  		hintContent.textContent = "Game Over";
  		endGame = true;
  	}

  	if (endGame) {
  		stats.textContent = "Play Again?";
  	}
	}

	var resetUserGuesses = function() {
		userGuessed = [];
		userGuessPile.textContent = "";
	}

  // Check if value is a letter
  var validateUserGuess = function(input) {
  	if (input.length === 1 && input.match(/[a-z]/i)) {
  		return true;
  	}
  }

  // Get and check user guess
  var checkUserGuess = function() {

  	// If user still has lives
  	if (userLives > 0) {

			// Get user guess
			userGuess = String.fromCharCode(event.keyCode).toLowerCase();
			
			// If user guess is a letter
			if (validateUserGuess(userGuess)) {

				// If user has not already guessed
				if (userGuessed.indexOf(userGuess) === -1) {
					// Check guess against answer
			  	// If incorrect
			    if (answer.indexOf(userGuess) === -1) {
			    	// Deduct life
			    	killDirewolf();

			    	// If user is out of lives
			    	if (userLives == 0) {
							for (var i = 0; i < answer.length; i++) {
							  // Show complete answer
							  checkAnswer[i].textContent = answer[i];
							}
						}
			    }
			    // If correct
			  	for (var i = 0; i < answer.length; i++) {
			      if (answer[i] === userGuess) {
			      	// Update guess in answer
			        checkAnswer[i].textContent = userGuess;
			      } 
					}
					// Add user guess to already guessed
					userGuessed.push(userGuess);
				}
				// console.log("User guessed: " + userGuess);
				// console.log("Already guessed: " + userGuessed);
	  		// console.log("Correct?: " + answer.indexOf(userGuess));
	  		// console.log("Guesses remaining: " + userLives);

				// If only 1 life remains, disable hint
				if (userLives == 1) {
					disableHint();
					hintContent.textContent = "Last Chance";
				}
	  		// Update stats
				updateStats();
				updateGameStatus();
		  }
		}
  }

  var resetHint = function() {
  	hint.setAttribute('id','hint');
  	hintContent.textContent = "Kill 1 To Get Hint";
  	hint.addEventListener('click', showHint);
  	hintClick = 0;
  }

	// Remove click event
  var disableHint = function() {
  	hint.removeEventListener('click', arguments.callee);
  	hint.setAttribute('id','hint-disabled');
  }

  // Show hint only once
  var showHint = function() {
  	if (userLives > 1 && hintClick == 0) {
			// Replace with hint text
	  	hintContent.textContent = hints[(answers.indexOf(answer))];
	  	
	  	// Update lives and stats
	  	killDirewolf();
	  	updateStats();
	  	updateGameStatus(); 

	  	disableHint();
  	}
  	hintClick++;
  }

  var playAgain = function() {
  	// If game has ended
  	if (endGame) {
  		// Reset play
  		startGame();
  	}
  }

  var startGame = function() {
		// Reset
		endGame = false;
		resetLives();
		resetHint();
		resetUserGuesses();
		updateStats();
		updateUserWins();

		// Create element for answer
		newAnswer();
  }
	
	// When window opens, run the following:
	startGame();

	// If user enters keystroke, get input and check answer
	document.addEventListener('keyup', checkUserGuess);

	// If user clicks on stats
	stats.addEventListener('click', playAgain);
}