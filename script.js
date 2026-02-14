// ==================== DEFAULT GERMAN MUSIC COLLECTION ====================
// Pre-loaded German music from various genres (Schlager, NDW, Modern Pop/Rock)
const defaultSongs = [
    // Schlager classics
    { title: "99 Luftballons", artist: "Nena", url: "https://www.youtube.com/watch?v=Fpu5a0Bl8eY" },
    { title: "Du hast", artist: "Rammstein", url: "https://www.youtube.com/watch?v=W3q8Od5qJio" },
    { title: "Major Tom", artist: "Peter Schilling", url: "https://www.youtube.com/watch?v=wO0A0XcWy88" },
    { title: "Atemlos durch die Nacht", artist: "Helene Fischer", url: "https://www.youtube.com/watch?v=haECT-SerHk" },
    { title: "Ich war noch niemals in New York", artist: "Udo Jürgens", url: "https://www.youtube.com/watch?v=Q4DDmCo1WJM" },
    
    // NDW (Neue Deutsche Welle)
    { title: "Nur geträumt", artist: "Nena", url: "https://www.youtube.com/watch?v=K-5xAg1PSpQ" },
    { title: "Da Da Da", artist: "Trio", url: "https://www.youtube.com/watch?v=lNYcviXK4rg" },
    { title: "Ein bisschen Frieden", artist: "Nicole", url: "https://www.youtube.com/watch?v=wfRLXyMZpVE" },
    
    // Modern German pop/rock
    { title: "Auf uns", artist: "Andreas Bourani", url: "https://www.youtube.com/watch?v=mWEw64kW6lY" },
    { title: "Astronaut", artist: "Sido ft. Andreas Bourani", url: "https://www.youtube.com/watch?v=NeVa8PfD9BY" },
    { title: "An Tagen wie diesen", artist: "Die Toten Hosen", url: "https://www.youtube.com/watch?v=j09hpp3AxIE" },
    { title: "Schrei nach Liebe", artist: "Die Ärzte", url: "https://www.youtube.com/watch?v=6X9CEi8wkBc" }
];

// ==================== GLOBAL VARIABLES ====================
let playlist = [...defaultSongs];
let currentIndex = 0;
let isPlaying = false;

// ==================== DOM ELEMENTS ====================
const audioPlayer = document.getElementById('audioPlayer');
const vinyl = document.getElementById('vinyl');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songList = document.getElementById('songList');
const nowPlaying = document.getElementById('nowPlaying');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const volumeSlider = document.getElementById('volumeSlider');
const titleInput = document.getElementById('titleInput');
const artistInput = document.getElementById('artistInput');
const urlInput = document.getElementById('urlInput');
const addBtn = document.getElementById('addBtn');

// ==================== UTILITY FUNCTIONS ====================

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null
 */
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// ==================== PLAYLIST FUNCTIONS ====================

/**
 * Render the entire playlist to the DOM
 */
function renderPlaylist() {
    songList.innerHTML = '';
    
    playlist.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'song-item' + (index === currentIndex && isPlaying ? ' active' : '');
        
        songItem.innerHTML = `
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        `;
        
        // Add click event to play this song
        songItem.onclick = () => playSong(index);
        
        songList.appendChild(songItem);
    });
}

// ==================== PLAYBACK FUNCTIONS ====================

/**
 * Play a song from the playlist by index
 * @param {number} index - Index of the song in the playlist
 */
function playSong(index) {
    currentIndex = index;
    const song = playlist[currentIndex];
    
    // Check if it's a YouTube URL
    const youtubeID = getYouTubeID(song.url);
    
    if (youtubeID) {
        // YouTube video - show info and open in new tab
        nowPlaying.style.display = 'block';
        currentTitle.textContent = song.title;
        currentArtist.textContent = song.artist;
        
        isPlaying = true;
        vinyl.classList.add('spinning');
        playBtn.textContent = '⏸';
        
        // Open YouTube in new tab
        window.open(song.url, '_blank');
        
        renderPlaylist();
    } else {
        // Direct audio URL - play in audio element
        audioPlayer.src = song.url;
        audioPlayer.play().then(() => {
            isPlaying = true;
            vinyl.classList.add('spinning');
            playBtn.textContent = '⏸';
            
            nowPlaying.style.display = 'block';
            currentTitle.textContent = song.title;
            currentArtist.textContent = song.artist;
            
            renderPlaylist();
        }).catch(error => {
            console.error('Error playing audio:', error);
            alert('Fehler beim Abspielen. Bitte überprüfe die URL.');
        });
    }
}

/**
 * Toggle play/pause state
 */
function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        isPlaying = false;
        vinyl.classList.remove('spinning');
        playBtn.textContent = '▶';
    } else {
        if (currentIndex >= 0 && currentIndex < playlist.length) {
            playSong(currentIndex);
        } else {
            playSong(0);
        }
    }
}

/**
 * Play previous song in playlist
 */
function playPrevious() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playSong(currentIndex);
}

/**
 * Play next song in playlist
 */
function playNext() {
    currentIndex = (currentIndex + 1) % playlist.length;
    playSong(currentIndex);
}

// ==================== CUSTOM SONG FUNCTIONS ====================

/**
 * Add a custom song to the playlist
 */
function addCustomSong() {
    const title = titleInput.value.trim();
    const artist = artistInput.value.trim();
    const url = urlInput.value.trim();

    // Validate inputs
    if (!title || !artist || !url) {
        alert('Bitte fülle alle Felder aus.');
        return;
    }

    // Add song to playlist
    playlist.push({ title, artist, url });
    renderPlaylist();
    
    // Clear inputs
    titleInput.value = '';
    artistInput.value = '';
    urlInput.value = '';
    
    alert('Lied erfolgreich hinzugefügt!');
}

// ==================== VOLUME CONTROL ====================

/**
 * Update audio volume based on slider value
 * @param {Event} e - Input event from volume slider
 */
function updateVolume(e) {
    audioPlayer.volume = e.target.value / 100;
}

// ==================== EVENT LISTENERS ====================

// Play/Pause button
playBtn.addEventListener('click', togglePlayPause);

// Previous button
prevBtn.addEventListener('click', playPrevious);

// Next button
nextBtn.addEventListener('click', playNext);

// Volume slider
volumeSlider.addEventListener('input', updateVolume);

// Add custom song button
addBtn.addEventListener('click', addCustomSong);

// Auto-play next song when current song ends
audioPlayer.addEventListener('ended', playNext);

// Enter key in input fields to add song
[titleInput, artistInput, urlInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomSong();
        }
    });
});

// ==================== INITIALIZATION ====================

/**
 * Initialize the music player
 */
function init() {
    // Set initial volume
    audioPlayer.volume = 0.7;
    
    // Render initial playlist
    renderPlaylist();
    
    console.log('🎵 Deutscher Musikspieler geladen!');
    console.log(`📀 ${playlist.length} Lieder in der Sammlung`);
}

// Run initialization when DOM is ready
init();