
        // DOM Elements
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');
        const greetingElement = document.getElementById('greeting');
        const weatherIcon = document.getElementById('weather-icon');
        const weatherTemp = document.getElementById('weather-temp');
        const weatherLocation = document.getElementById('weather-location');
        const searchInput = document.getElementById('search-input');
        const quickLinksContainer = document.getElementById('quick-links');
        const settingsBtn = document.getElementById('settings-btn');
        const settingsPanel = document.getElementById('settings-panel');
        const closeSettingsBtn = document.getElementById('close-settings');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const blurToggle = document.getElementById('blur-toggle');
        const videoBg = document.getElementById('video-bg');
        const videoOptions = document.querySelectorAll('input[name="bg-video"]');
        const muteBtn = document.getElementById('mute-btn');
        const changeVideoBtn = document.getElementById('change-video-btn');
        const userName = document.getElementById('user-name');

        // Sample data
        const defaultLinks = [
            { name: 'Google', url: 'https://google.com', icon: 'G' },
            { name: 'YouTube', url: 'https://youtube.com', icon: 'YT' },
            { name: 'GitHub', url: 'https://github.com', icon: 'GH' },
            { name: 'Twitter', url: 'https://twitter.com', icon: 'TW' },
            { name: 'Gmail', url: 'https://mail.google.com', icon: 'GM' },
            { name: 'Deepseek R1', url: 'https://deepseek.com', icon: 'R1' },
            { name: 'ChatGPT', url: 'https://chat.openai.com', icon: 'AI' }
        ];  

        // Video options
        const videoSources = [
            "videos/1.mp4",
            "videos/2.mp4",
            "videos/3.mp4",
            "videos/4.mp4", 
            "videos/5.mp4",
            "videos/6.mp4",
            "videos/7.mp4",
            "videos/8.mp4",
            "videos/9.mp4",
            "videos/10.mp4",
            "videos/11.mp4",
            "videos/12.mp4",
            "videos/13.mp4",
            "videos/14.mp4"
        ];

        // Initialize
        function init() {
            updateTime();
            setInterval(updateTime, 1000);
            
            loadQuickLinks();
            updateWeather();
            setupEventListeners();
            loadSettings();
            
            // Load user name from localStorage
            const savedName = localStorage.getItem('userName');
            if (savedName) {
                userName.textContent = savedName;
            }
        }

        // Time and Date
        function updateTime() {
            const now = new Date();
            const timeOptions = { hour: '2-digit', minute: '2-digit' };
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            
            timeElement.textContent = now.toLocaleTimeString(undefined, timeOptions);
            dateElement.textContent = now.toLocaleDateString(undefined, dateOptions);
            
            updateGreeting(now.getHours());
        }

        function updateGreeting(hour) {
            let greeting = 'Good ';
            if (hour < 12) greeting += 'Morning';
            else if (hour < 18) greeting += 'Afternoon';
            else greeting += 'Evening';
            
            const userName = localStorage.getItem('userName') || 'User';
            greetingElement.textContent = `${greeting}, ${userName}`;
        }

        // Weather (mock)
        function updateWeather() {
            const conditions = ['☀️', '🌤️', '⛅', '🌧️', '❄️', '🌩️'];
            weatherIcon.textContent = conditions[Math.floor(Math.random() * conditions.length)];
            weatherTemp.textContent = `${Math.floor(Math.random() * 15) + 15}°C`;
            weatherLocation.textContent = ['New York', 'London', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 4)];
        }

        // Quick Links
        function loadQuickLinks() {
            const savedLinks = JSON.parse(localStorage.getItem('quickLinks')) || defaultLinks;
            
            quickLinksContainer.innerHTML = savedLinks.map(link => `
                <a href="${link.url}" class="link-item" target="">
                    <div class="link-icon">${link.icon}</div>
                    <div class="link-name">${link.name}</div>
                </a>
            `).join('');
        }

        // Video Controls
        function toggleMute() {
            videoBg.muted = !videoBg.muted;
            muteBtn.textContent = videoBg.muted ? '🔇' : '🔊';
            localStorage.setItem('videoMuted', videoBg.muted);
        }

        function changeVideoRandomly() {
            const currentSrc = videoBg.src;
            let newSrc;
            
            do {
                newSrc = videoSources[Math.floor(Math.random() * videoSources.length)];
            } while (newSrc === currentSrc && videoSources.length > 1);
            
            videoBg.src = newSrc;
            videoBg.play();
            
            // Update the selected radio button
            document.querySelectorAll('input[name="bg-video"]').forEach(option => {
                option.checked = option.value === newSrc;
                const parent = option.closest('.video-option');
                if (option.checked) {
                    parent.classList.add('active');
                } else {
                    parent.classList.remove('active');
                }
            });
            
            localStorage.setItem('selectedVideo', newSrc);
        }

        // Settings
        function setupEventListeners() {
            // Search
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        if (query.includes('.') && !query.includes(' ')) {
                            window.location.href = query.startsWith('http') ? query : `https://${query}`;
                        } else {
                            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                        }
                    }
                }
            });
            
            // User name editing
            userName.addEventListener('blur', () => {
                localStorage.setItem('userName', userName.textContent);
                updateTime(); // To update greeting with new name
            });
            
            userName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    userName.blur();
                }
            });
            
            // Settings panel toggle
            settingsBtn.addEventListener('click', toggleSettingsPanel);
            closeSettingsBtn.addEventListener('click', toggleSettingsPanel);
            
            // Dark mode toggle
            darkModeToggle.addEventListener('change', () => {
                document.body.classList.toggle('light-mode', !darkModeToggle.checked);
                localStorage.setItem('darkMode', darkModeToggle.checked);
            });
            
            // Blur effect toggle
            blurToggle.addEventListener('change', () => {
                document.documentElement.style.setProperty(
                    '--blur-amount', 
                    blurToggle.checked ? '10px' : '0px'
                );
                localStorage.setItem('blurEnabled', blurToggle.checked);
            });
            
            // Video background selection
            videoOptions.forEach(option => {
                option.addEventListener('change', (e) => {
                    if (e.target.value) {
                        videoBg.src = e.target.value;
                        videoBg.style.display = 'block';
                    } else {
                        videoBg.style.display = 'none';
                    }
                    localStorage.setItem('selectedVideo', e.target.value);
                    
                    // Update active class
                    document.querySelectorAll('.video-option').forEach(opt => {
                        opt.classList.remove('active');
                    });
                    e.target.closest('.video-option').classList.add('active');
                });
            });
            
            // Video controls
            muteBtn.addEventListener('click', toggleMute);
            changeVideoBtn.addEventListener('click', changeVideoRandomly);
            
            // Close settings when clicking outside
            document.addEventListener('click', (e) => {
                if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
                    settingsPanel.classList.remove('show');
                }
            });
        }

        function toggleSettingsPanel() {
            settingsPanel.classList.toggle('show');
        }

        function loadSettings() {
            // Dark mode
            const darkMode = localStorage.getItem('darkMode') !== 'false';
            darkModeToggle.checked = darkMode;
            document.body.classList.toggle('light-mode', !darkMode);
            
            // Blur effect
            const blurEnabled = localStorage.getItem('blurEnabled') !== 'false';
            blurToggle.checked = blurEnabled;
            document.documentElement.style.setProperty(
                '--blur-amount', 
                blurEnabled ? '10px' : '0px'
            );
            
            // Video background
            const selectedVideo = localStorage.getItem('selectedVideo') || 
                'videos/3.mp4';
            document.querySelector(`input[value="${selectedVideo}"]`).checked = true;
            videoBg.src = selectedVideo;
            if (!selectedVideo) {
                videoBg.style.display = 'none';
            }
            
            // Video mute state
            const videoMuted = localStorage.getItem('videoMuted') !== 'false';
            videoBg.muted = videoMuted;
            muteBtn.textContent = videoMuted ? '🔇' : '🔊';
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', init);
