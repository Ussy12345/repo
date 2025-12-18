// Quran Audio App - JavaScript with Arabic Text Display
const API_BASE = 'https://api.alquran.cloud/v1';

// DOM Elements
const surahListElement = document.getElementById('surahList');
const audioPlayerElement = document.getElementById('audioPlayer');
const audioElement = document.getElementById('audioElement');
const nowPlayingTitle = document.getElementById('nowPlayingTitle');
const nowPlayingReciter = document.getElementById('nowPlayingReciter');
const closePlayerBtn = document.getElementById('closePlayerBtn');
const searchInput = document.getElementById('searchInput');
const arabicTextContainer = document.getElementById('arabicTextContainer');
const arabicTextContent = document.getElementById('arabicTextContent');
const closeTextBtn = document.getElementById('closeTextBtn');

// State
let allSurahs = [];
let currentAudioUrl = '';
let currentSurahNumber = null;

// Step 1: Fetch and Display the List of Surahs
async function fetchSurahs() {
    try {
        const response = await fetch(`${API_BASE}/surah`);
        const data = await response.json();

        if (data.code === 200 && data.data) {
            allSurahs = data.data;
            displaySurahs(allSurahs);
        } else {
            throw new Error('Failed to load Surahs');
        }
    } catch (error) {
        console.error('Error fetching Surahs:', error);
        surahListElement.innerHTML = `<li class="loading">Error loading Surahs. Please check your connection.</li>`;
    }
}

// Step 2: Display Surahs in the List
function displaySurahs(surahs) {
    surahListElement.innerHTML = '';

    surahs.forEach(surah => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-number', surah.number);

        listItem.innerHTML = `
            <div class="surah-name">
                <span class="surah-number">${surah.number}</span>
                <span class="surah-name-arabic">${surah.name}</span>
                <span class="surah-name-translation">${surah.englishName} (${surah.englishNameTranslation})</span>
            </div>
            <div class="surah-info">
                <span class="ayahs">${surah.numberOfAyahs} Ayahs</span>
                <span class="revelation">${surah.revelationType}</span>
            </div>
        `;

        listItem.addEventListener('click', () => playSurah(surah));
        surahListElement.appendChild(listItem);
    });
}

// Step 3: Function to Play a Surah and Fetch Arabic Text
async function playSurah(surah) {
    // If same surah is clicked again, just show the text/player (no re-fetch)
    if (currentSurahNumber === surah.number) {
        audioPlayerElement.classList.add('active');
        arabicTextContainer.classList.add('active');
        return;
    }

    currentSurahNumber = surah.number;

    // Update UI
    nowPlayingTitle.textContent = `${surah.number}. ${surah.englishName}`;
    nowPlayingReciter.textContent = `Reciter: Abdul Basit Abdul Samad`;

    // Show loading state for Arabic text
    arabicTextContent.innerHTML = `<p class="loading-text">Loading Arabic text... <i class="fas fa-spinner fa-spin"></i></p>`;
    arabicTextContainer.classList.add('active');

    // Step 4: Fetch Arabic text from API (default edition 'quran-uthmani' for Arabic)
    try {
        const [textResponse] = await Promise.all([
            fetch(`${API_BASE}/surah/${surah.number}`),
            // Audio URL setup (can be done in parallel)
            (() => {
                const reciter = 'afs';
                const surahNumberPadded = surah.number.toString().padStart(3, '0');
                const audioUrl = `https://server8.mp3quran.net/${reciter}/${surahNumberPadded}.mp3`;
                audioElement.src = audioUrl;
                currentAudioUrl = audioUrl;
            })()
        ]);

        const textData = await textResponse.json();

        if (textData.code === 200 && textData.data) {
            displayArabicText(textData.data.ayahs);
        } else {
            throw new Error('Failed to load Arabic text');
        }
    } catch (error) {
        console.error('Error fetching Arabic text:', error);
        arabicTextContent.innerHTML = `<p class="loading-text">Error loading Arabic text. Please try again.</p>`;
    }

    // Show and play audio
    audioPlayerElement.classList.add('active');
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log("Autoplay prevented. User must click play button.");
        });
    }
}

// Step 5: Function to Display Arabic Text
function displayArabicText(ayahs) {
    arabicTextContent.innerHTML = '';

    ayahs.forEach(ayah => {
        const verseElement = document.createElement('div');
        verseElement.className = 'arabic-verse';
        verseElement.innerHTML = `
            <span class="verse-number">${ayah.numberInSurah}</span>
            ${ayah.text}
        `;
        arabicTextContent.appendChild(verseElement);
    });
}

// Step 6: Close Audio Player
closePlayerBtn.addEventListener('click', () => {
    audioPlayerElement.classList.remove('active');
    audioElement.pause();
    audioElement.currentTime = 0;
});

// Step 7: Close Arabic Text Container
closeTextBtn.addEventListener('click', () => {
    arabicTextContainer.classList.remove('active');
});

// Step 8: Implement Search
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        displaySurahs(allSurahs);
        return;
    }

    const filteredSurahs = allSurahs.filter(surah =>
        surah.englishName.toLowerCase().includes(searchTerm) ||
        surah.englishNameTranslation.toLowerCase().includes(searchTerm) ||
        surah.name.toLowerCase().includes(searchTerm) ||
        surah.number.toString().includes(searchTerm)
    );

    displaySurahs(filteredSurahs);
});

// Step 9: Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && audioPlayerElement.classList.contains('active')) {
        e.preventDefault();
        if (audioElement.paused) {
            audioElement.play();
        } else {
            audioElement.pause();
        }
    }
    if (e.code === 'Escape') {
        audioPlayerElement.classList.remove('active');
        arabicTextContainer.classList.remove('active');
        audioElement.pause();
    }
});

// Step 10: Initialize the App
window.addEventListener('DOMContentLoaded', () => {
    fetchSurahs();
    console.log('🌙 Ummah Quran App with Arabic text initialized!');
});

// Optional: Auto-hide player after audio ends
audioElement.addEventListener('ended', () => {
    setTimeout(() => {
        audioPlayerElement.classList.remove('active');
        audioElement.currentTime = 0;
    }, 3000);
});