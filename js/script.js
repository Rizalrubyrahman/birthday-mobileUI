document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const appGrid = document.getElementById('appGrid');
    const homeButton = document.getElementById('homeButton');
    const appWindow = document.getElementById('appWindow');
    const appTitle = document.getElementById('appTitle');
    const appContent = document.getElementById('appContent');
    const backButton = document.getElementById('backButton');
    const rotateBtn = document.getElementById('rotateBtn');
    const addAppBtn = document.getElementById('addAppBtn');
    const changeWallpaperBtn = document.getElementById('changeWallpaperBtn');
    const phone = document.querySelector('.phone');
    const lockScreen = document.getElementById('lockScreen');
    const lockTime = document.getElementById('lockTime');
    const lockDate = document.getElementById('lockDate');
    const pinDigits = document.querySelectorAll('.pin-digit');
    const pinButtons = document.querySelectorAll('.pin-btn');
    const pinBackspace = document.getElementById('pinBackspace');
    const pinEnter = document.getElementById('pinEnter');
    const lockMessage = document.getElementById('lockMessage');
     // Lock screen variables
     const CORRECT_PIN = "0608";
     let enteredPin = "";
     let isLocked = true;
     let currentSongIndex = 0;
     let isPlaying = false;
     let currentPlaybackPosition = 0;
     let audioPlayer = new Audio();
     // Initialize lock screen
     function initLockScreen() {
         updateLockTime();
         setInterval(updateLockTime, 60000);
         
         // Add event listeners to PIN buttons
         pinButtons.forEach(button => {
             if (!button.id) { // Exclude backspace button
                 button.addEventListener('click', () => addToPin(button.dataset.digit));
             }
         });
         
         pinBackspace.addEventListener('click', backspacePin);
         
     }
 
     function updateLockTime() {
         const now = new Date();
         const hours = now.getHours().toString().padStart(2, '0');
         const minutes = now.getMinutes().toString().padStart(2, '0');
         lockTime.textContent = `${hours}:${minutes}`;
         
         const options = { weekday: 'long', month: 'long', day: 'numeric' };
         lockDate.textContent = now.toLocaleDateString('en-US', options);
     }
 
     function addToPin(digit) {
         if (enteredPin.length >= 4) return;
         
         enteredPin += digit;
         updatePinDisplay();
         
         if (enteredPin.length === 4) {
             checkPin();
         }
     }
 
     function backspacePin() {
         if (enteredPin.length > 0) {
             enteredPin = enteredPin.slice(0, -1);
             updatePinDisplay();
         }
     }
 
     function updatePinDisplay() {
         pinDigits.forEach((digit, index) => {
             if (index < enteredPin.length) {
                 digit.classList.add('filled');
             } else {
                 digit.classList.remove('filled');
             }
         });
     }
 
     function checkPin() {
         if (enteredPin === CORRECT_PIN) {
             unlockPhone();
         } else {
             lockMessage.textContent = "Wrong PIN. Try again.";
             enteredPin = "";
             updatePinDisplay();
             setTimeout(() => {
                 lockMessage.textContent = "";
             }, 2000);
         }
     }

     function unlockPhone() {
         isLocked = false;
         lockScreen.style.display = 'none';
     }
 
     function lockPhone() {
         isLocked = true;
         enteredPin = "";
         updatePinDisplay();
         lockScreen.style.display = 'flex';
         updateLockTime();
     }
  
    // Sample apps data
    const apps = [
        { name: 'Cake', icon: 'cake', app: 'cake' },
        { name: 'Gallery', icon: 'images', app: 'gallery' },
        { name: 'Message', icon: 'message', app: 'message' },
        { name: 'Music', icon: 'music', app: 'music' },
        { name: 'Games', icon: 'gamepad', app: 'games' } // Added games app
    ];
    
    // Wallpapers
    const wallpapers = [
        'linear-gradient(to bottom, #a1c4fd, #c2e9fb)'
    ];
    
    
    
 
     // Add event listener to home button to lock phone when clicked
     homeButton.addEventListener('click', function() {
         if (appWindow.style.display === 'flex') {
             appWindow.style.display = 'none';
             document.querySelector('.home-screen').style.display = 'flex';
         } else if (!isLocked) {
             lockPhone();
         }
     });
    // Add an app to the home screen
    function addAppToHomeScreen(app) {
        const appIcon = document.createElement('div');
        appIcon.className = 'app-icon';
        appIcon.setAttribute('data-app', app.app);
        
        appIcon.innerHTML = `
            <i class="fas fa-${app.icon}"></i>
            <span>${app.name}</span>
        `;
        
        appIcon.addEventListener('click', function() {
            openApp(app);
        });
        
        appGrid.appendChild(appIcon);
    }
    
    // Open an app
    function openApp(app) {
        if (isLocked) return;
        appTitle.textContent = app.name;
        appContent.innerHTML = getAppContent(app.app);
        appWindow.style.display = 'flex';
        document.querySelector('.home-screen').style.display = 'none';
    }
     // Modify the openApp function to check for lock
     
 
    // Get app content based on app type
    function getAppContent(appType) {
        switch(appType) {
 
            case 'message':
                return `
                    <div class="messages-app">
                        <div class="conversation">
                            <div class="message received">
                                <p>Hey, how are you?</p>
                                <span class="time">10:30 AM</span>
                            </div>
                            <div class="message sent">
                                <p>I'm good, thanks! How about you?</p>
                                <span class="time">10:32 AM</span>
                            </div>
                        </div>
                        <div class="message-input">
                            <input type="text" placeholder="Type a message">
                            <button><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                `;
            case 'music':
                return `
                  <div class="music-app">
                    <div class="album-art">
                        <img src="https://via.placeholder.com/150" alt="Album Art">
                    </div>
                    <div class="song-info">
                        <h4 id="songTitle">Song Title</h4>
                        <p id="artistName">Artist Name</p>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar"></div>
                    </div>
                    <div class="time-display">
                        <span class="current-time">0:00</span>
                        <span class="duration">0:00</span>
                    </div>
                    <div class="player-controls">
                        <button id="prevBtn"><i class="fas fa-backward"></i></button>
                        <button id="playBtn" class="play-btn"><i class="fas fa-play"></i></button>
                        <button id="nextBtn"><i class="fas fa-forward"></i></button>
                    </div>
                    <audio id="audioPlayer"></audio>
                </div>
                `;
            case 'cake':
                return `
                    <div class="camera-app">
                        <div class="camera-viewfinder">
                            <div class="camera-controls">
                                <button class="shutter-button"></button>
                            </div>
                        </div>
                    </div>
                `;
            case 'gallery':
                return `
                    <div class="photos-app">
                        <div class="photo-grid">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7MtgoaZrlx5arqRRDHUEyOICAfwQ2vGyorEKWTiOrdKTL__BUMOb_wlz5gRxvQ4veRA" alt="Photo">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7MtgoaZrlx5arqRRDHUEyOICAfwQ2vGyorEKWTiOrdKTL__BUMOb_wlz5gRxvQ4veRA" alt="Photo">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7MtgoaZrlx5arqRRDHUEyOICAfwQ2vGyorEKWTiOrdKTL__BUMOb_wlz5gRxvQ4veRA" alt="Photo">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7MtgoaZrlx5arqRRDHUEyOICAfwQ2vGyorEKWTiOrdKTL__BUMOb_wlz5gRxvQ4veRA" alt="Photo">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7MtgoaZrlx5arqRRDHUEyOICAfwQ2vGyorEKWTiOrdKTL__BUMOb_wlz5gRxvQ4veRA" alt="Photo">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_7MtgoaZrlx5arqRRDHUEyOICAfwQ2vGyorEKWTiOrdKTL__BUMOb_wlz5gRxvQ4veRA" alt="Photo">
                        </div>
                    </div>
                `;
            
                case 'games':
                return `
                    <div class="games-app">
                        <div class="game-header">
                            <div class="game-stats">
                                <div><i class="fas fa-clock"></i> <span id="gameTime">0</span>s</div>
                                <div><i class="fas fa-sync-alt"></i> <span id="gameMoves">0</span></div>
                            </div>
                        </div>
                        <div class="memory-game" id="memoryGame"></div>
                        <div class="game-controls">
                            <button id="restartGame">Restart Game</button>
                        </div>
                    </div>
                `;
            default:
                return `
                    <div class="default-app">
                        <h3>Welcome to ${appTitle.textContent}</h3>
                        <p>This is a simulated app interface.</p>
                    </div>
                `;
        }
    }
    
    // Update the time in the status bar
    function updateTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.time').textContent = `${hours}:${minutes}`;
    }
    
    // Change the phone wallpaper
    function changeWallpaper() {
        const randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
        document.querySelector('.phone-screen').style.backgroundImage = randomWallpaper;
    }
    
 
    
    // Event listeners
    homeButton.addEventListener('click', function() {
        if (appWindow.style.display === 'flex') {
            appWindow.style.display = 'none';
            document.querySelector('.home-screen').style.display = 'flex';
        }
    });
    
    
    
 
    
 

 
 // Initialize the phone
 function initPhone() {
    initLockScreen(); 
    // Add apps to the home screen
    apps.forEach(app => {
        addAppToHomeScreen(app);
    });
    
    // Set random wallpaper
    changeWallpaper();
    
    // Update time
    updateTime();
    setInterval(updateTime, 60000);
}
   
   // Memory Game Variables
    let gameActive = false;
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moveCount = 0;
    let gameTime = 0;
    let timerInterval;

    // Memory Game Functions
    function initializeMemoryGame() {
        const memoryGame = document.getElementById('memoryGame');
        if (!memoryGame) return;
        
        memoryGame.innerHTML = '';
        moveCount = 0;
        gameTime = 0;
        document.getElementById('gameMoves').textContent = moveCount;
        document.getElementById('gameTime').textContent = gameTime;
        
        if (timerInterval) clearInterval(timerInterval);
        
        // Create card pairs (8 pairs for 16 cards)
        const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        const cards = [...emojis, ...emojis];
        
        // Shuffle cards
        cards.sort(() => Math.random() - 0.5);
        
        // Create card elements
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            card.innerHTML = `<span style="visibility: hidden;">${emoji}</span>`;
            card.addEventListener('click', flipCard);
            memoryGame.appendChild(card);
        });
        
        gameActive = true;
        startTimer();
    }

    function flipCard() {
        if (lockBoard || this === firstCard) return;
        
        this.classList.add('flipped');
        this.querySelector('span').style.visibility = 'visible';
        
        if (!hasFlippedCard) {
            // First click
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second click
        secondCard = this;
        moveCount++;
        document.getElementById('gameMoves').textContent = moveCount;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;
        
        if (isMatch) {
            disableCards();
            checkGameEnd();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('span').style.visibility = 'hidden';
            secondCard.querySelector('span').style.visibility = 'hidden';
            
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            gameTime++;
            document.getElementById('gameTime').textContent = gameTime;
        }, 1000);
    }

    function checkGameEnd() {
        const cards = document.querySelectorAll('.memory-card');
        const matchedCards = document.querySelectorAll('.memory-card.matched');
        
        if (cards.length === matchedCards.length) {
            clearInterval(timerInterval);
            setTimeout(() => {
                alert(`Congratulations! You won in ${moveCount} moves and ${gameTime} seconds!`);
            }, 500);
        }
    }

    // Add event listener for the restart button
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'restartGame') {
            initializeMemoryGame();
        }
    });


    // Music Player Variables
    const songs = [
        {
            title: "Happy Birthday",
            artist: "The Kiboomers",
            cover: "images/birthday-cover.jpeg",
            audio: "music/birthday-song3.mp3"
        },
        {
            title: "Selamat Ulang Tahun",
            artist: "Jamrud",
            cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYoWjIbxrVanMKhIhwFawr--Yvn6pR9hYlIA&s",
            audio: "music/birthday-song.mp3"
        },
        {
            title: "Birthday",
            artist: "Red Velvet",
            cover: "https://i.scdn.co/image/ab67616d0000b273d2ef237da7f94762997c2083",
            audio: "music/birthday-song2.mp3"
        } 
    ];

   

    // Initialize Music Player
  // Initialize Music Player
// Initialize Music Player
    function initMusicPlayer() {
        const playBtn = document.getElementById('playBtn');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Only load new song if not already playing
        if (!audioPlayer.src || audioPlayer.src !== songs[currentSongIndex].audio) {
            loadSong(currentSongIndex);
        } else {
            // Restore playback position
            audioPlayer.currentTime = currentPlaybackPosition;
            updatePlayButton();
        }
        
        // Event listeners
        playBtn.addEventListener('click', togglePlay);
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        
        audioPlayer.addEventListener('ended', nextSong);
        audioPlayer.addEventListener('timeupdate', updateProgress);
        
        const progressContainer = document.querySelector('.progress-container');
        if (progressContainer) {
            progressContainer.addEventListener('click', setProgress);
        }
    }

    function loadSong(index) {
        const song = songs[index];
        document.getElementById('songTitle').textContent = song.title;
        document.getElementById('artistName').textContent = song.artist;
        document.querySelector('.album-art img').src = song.cover;
        audioPlayer.src = song.audio;
        
        if (isPlaying) {
            audioPlayer.play().catch(e => console.log("Auto-play prevented:", e));
        }
    }

    function updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        if (!playBtn) return;
        
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    function togglePlay() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play().catch(e => console.log("Play error:", e));
        }
        isPlaying = !isPlaying;
        updatePlayButton();
    }

    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        updatePlayButton();
    }

    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        updatePlayButton();
    }


    function updateProgress() {
        const progressBar = document.querySelector('.progress-bar');
        const currentTimeDisplay = document.querySelector('.current-time');
        const durationDisplay = document.querySelector('.duration');
        
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time displays
        if (duration) {
            currentTimeDisplay.textContent = formatTime(currentTime);
            durationDisplay.textContent = formatTime(duration);
        }
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    const originalOpenApp = openApp;
     openApp = function(app) {
        // Save current playback position before switching apps
    if (audioPlayer && !isNaN(audioPlayer.currentTime)) {
        currentPlaybackPosition = audioPlayer.currentTime;
    }
         if (isLocked) return;
         originalOpenApp(app);
         if (app.app === 'games') {
             setTimeout(initializeMemoryGame, 0);
         }
         if (app.app === 'music') {
            setTimeout(() => {
                initMusicPlayer();
                if (isPlaying) {
                    audioPlayer.play().catch(e => console.log("Playback error:", e));
                }
                updatePlayButton();
            }, 0);
        }
     };
    backButton.addEventListener('click', function() {
          // Save current playback position
    if (audioPlayer && !isNaN(audioPlayer.currentTime)) {
        currentPlaybackPosition = audioPlayer.currentTime;
    }
    
        appWindow.style.display = 'none';
        document.querySelector('.home-screen').style.display = 'flex';
    });
    
    function checkGameEnd() {
        const cards = document.querySelectorAll('.memory-card');
        const matchedCards = document.querySelectorAll('.memory-card.matched');
        
        if (cards.length === matchedCards.length) {
            clearInterval(timerInterval);
            showCelebration();
        }
    }
    
    function showCelebration() {
        // Create celebration container
        const celebration = document.createElement('div');
        celebration.className = 'game-celebration';
        
        // Add celebration message
        const message = document.createElement('div');
        message.className = 'celebration-message';
        message.textContent = 'Congratulations!';
        celebration.appendChild(message);
        
        // Add stats display
        const stats = document.createElement('div');
        stats.className = 'stats-display';
        stats.innerHTML = `
            <p>You completed the game in:</p>
            <p><strong>${moveCount}</strong> moves</p>
            <p><strong>${gameTime}</strong> seconds</p>
        `;
        celebration.appendChild(stats);
        
        // Add continue button
        const button = document.createElement('button');
        button.className = 'celebration-button';
        button.textContent = 'Play Again';
        button.addEventListener('click', () => {
            celebration.remove();
            initializeMemoryGame();
        });
        celebration.appendChild(button);
        
       // Enhanced confetti generation
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
                   '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
                   '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    // Create 200 pieces for a richer effect
        for (let i = 0; i < 200; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            const size = Math.random() * 10 + 5;
            const shape = Math.random() > 0.5 ? '50%' : '0';
            const color = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 3 + 2;
            const delay = Math.random() * 5;
            
            // Apply styles
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            confetti.style.borderRadius = shape;
            confetti.style.backgroundColor = color;
            confetti.style.left = `${left}vw`;
            confetti.style.animationDuration = `${animationDuration}s`;
            confetti.style.animationDelay = `${delay}s`;
            
            // Add 3D rotation variations
            const rotationX = Math.random() * 360;
            const rotationY = Math.random() * 360;
            confetti.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            
            celebration.appendChild(confetti);
        }
    
        document.body.appendChild(celebration);
    }
    initPhone()
    
});