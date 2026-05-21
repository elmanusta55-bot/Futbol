// JavaScript faylı - Dinamik Funksionallıq

// Mobil Menyusu Toggle Etmə
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenuMobile = document.querySelector('.nav-menu-mobile');

    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            menuBtn.classList.toggle('active');
            navMenuMobile.classList.toggle('active');
        });
    }

    // Menyuda seçilən linki qapat
    const navLinks = document.querySelectorAll('.nav-menu-mobile a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('active');
            navMenuMobile.classList.remove('active');
        });
    });
});

// Bildirişlər Sistemi
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.querySelector('.notifications-container') || createNotificationsContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'goal' ? 'futbol' : type === 'info' ? 'info-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 400);
    }, duration);
}

function createNotificationsContainer() {
    const container = document.createElement('div');
    container.className = 'notifications-container';
    container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
}

// Canlı Məlumatlar Yenilənməsi
let lastScores = {};

async function fetchLiveScores() {
    const container = document.getElementById('live-matches-container');
    const timeEl = document.getElementById('update-time');
    
    try {
        const mockData = [
            { id: 1, home: "Qarabağ", away: "Sabah", score: "2 - 1", time: "65'", league: "Azərbaycan", status: "live" },
            { id: 2, home: "Galatasaray", away: "Fenerbahçe", score: "1 - 0", time: "45'", league: "Türkiyə", status: "live" },
            { id: 3, home: "Real Madrid", away: "Barcelona", score: "3 - 2", time: "88'", league: "İspaniya", status: "live" }
        ];

        // Skoru dəyişəndə bildiriş göstər
        mockData.forEach(match => {
            const key = `${match.id}`;
            if (lastScores[key] && lastScores[key] !== match.score) {
                showNotification(`⚽ ${match.home} ${match.score} ${match.away}`, 'goal', 5000);
            }
            lastScores[key] = match.score;
        });

        container.innerHTML = '';
        
        mockData.forEach(match => {
            const matchCard = document.createElement('div');
            matchCard.className = 'glass p-5 rounded-2xl hover:border-emerald-500/30 transition cursor-pointer group match-card';
            matchCard.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase">${match.league}</span>
                    <span class="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded flex items-center gap-1">
                        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        ${match.time}
                    </span>
                </div>
                <div class="flex justify-between items-center">
                    <div class="flex-1 text-right font-bold text-lg">${match.home}</div>
                    <div class="px-6 text-2xl font-black text-emerald-500">${match.score}</div>
                    <div class="flex-1 text-left font-bold text-lg">${match.away}</div>
                </div>
                <div class="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-slate-500">
                    <button class="hover:text-emerald-500 transition flex items-center gap-1">
                        <i class="fas fa-heart"></i> Favorit
                    </button>
                    <button class="hover:text-emerald-500 transition flex items-center gap-1">
                        <i class="fas fa-share"></i> Paylaş
                    </button>
                    <button class="hover:text-emerald-500 transition flex items-center gap-1">
                        <i class="fas fa-bell"></i> Xəbər
                    </button>
                </div>
            `;
            container.appendChild(matchCard);

            // Favorit butonunun funksionallığı
            const favoriteBtn = matchCard.querySelector('.hover\\:text-emerald-500:nth-child(1)');
            favoriteBtn.addEventListener('click', function() {
                saveFavorite(match.id, match.home, match.away);
            });
        });

        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        timeEl.innerText = `Son yenilənmə: ${hours}:${minutes}`;

    } catch (error) {
        console.error("Xəta:", error);
        container.innerHTML = '<div class="glass p-6 text-red-400 text-center rounded-2xl"><i class="fas fa-exclamation-circle mr-2"></i>Məlumat gətirilərkən xəta baş verdi.</div>';
    }
}

// Favorit komandaları saxlamaq (Local Storage)
function saveFavorite(matchId, home, away) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const matchKey = `${home}_${away}`;
    
    if (!favorites.find(fav => fav.match === matchKey)) {
        favorites.push({ id: matchId, match: matchKey, home, away });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification(`❤️ ${home} vs ${away} favoritə əlavə edildi!`, 'info');
    } else {
        favorites = favorites.filter(fav => fav.match !== matchKey);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        showNotification(`${home} vs ${away} favoritdən çıxarıldı.`, 'info');
    }
}

// Sayt açılanda və hər 60 saniyədən bir yenilə
fetchLiveScores();
setInterval(fetchLiveScores, 60000);

// Naviqasiya funksionallığı
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a, .nav-menu-mobile a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Hələlik demo
            const page = this.textContent.trim();
            if (page !== 'Canlı') {
                e.preventDefault();
                showNotification(`📄 ${page} səhifəsi hazırlanır...`, 'info');
            }
        });
    });

    // Giriş düyməsi
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showNotification('🔐 Giriş sistem hazırlanır...', 'info');
        });
    }
});

// Şirkətli yazı
console.log('%c⚽ FUTBOL.AZ ⚽', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cCanlı futbol nəticələri sistemi yükləndi', 'color: #10b981; font-size: 14px;');
