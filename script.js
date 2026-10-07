// Mock Data Database for Reliable Images
const imageDatabase = {
    japanese: [
        "https://images.unsplash.com/photo-1529626455594-49260f1ea888?w=400&q=80", // Japanese Girl
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", // Japan Street/Model vibe
        "https://images.unsplash.com/photo-1590845946626-24ece37e29e9?w=400&q=80", // Asian Model
        "https://images.unsplash.com/photo-1542051841857-1a6385d87563?w=400&q=80"  // Japanese Aesthetic
    ],
    european: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80", // European Woman
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80", // European Portrait
        "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80", // European Beauty
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80"  // Blonde/Euro Vibe
    ],
    american: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", // American Model
        "https://images.unsplash.com/photo-1529626455594-49260f1ea888?w=400&q=80", // US Style
        "https://images.unsplash.com/photo-1534528741775-53994a69d7ad?w=400&q=80", // Hollywood Vibe
        "https://images.unsplash.com/photo-1503023365862-12031429796b?w=400&q=80"   // Casual US
    ],
    african: [
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80", // African Beauty
        "https://images.unsplash.com/photo-1531123897727-81914a3d92b1?w=400&q=80", // African Model
        "https://images.unsplash.com/photo-1508214751196-bcfd9ca404e5?w=400&q=80", // African Style
        "https://images.unsplash.com/photo-1618625104273-054239297933?w=400&q=80"  // African Heritage
    ],
    latina: [
        "https://images.unsplash.com/photo-1529139574466-a302c27e03b4?w=400&q=80", // Latina Model
        "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb450?w=400&q=80", // Latin Beauty
        "https://images.unsplash.com/photo-1516975080654-3d31f7226e87?w=400&q=80", // Latina Style
        "https://images.unsplash.com/photo-1501281668745-f7f57925c12b?w=400&q=80"   // Exotic/Latin
    ]
};

// Helper to get random image from category
function getRandomImage(category) {
    const images = imageDatabase[category] || imageDatabase['american']; // Fallback
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

// DOM Elements
const imageGrid = document.getElementById('image-grid');
const videoGrid = document.getElementById('video-grid');
const tabBtns = document.querySelectorAll('.tab-btn');

// Function to render cards
function renderCards(container, type, categoryFilter = 'all') {
    container.innerHTML = ''; // Clear existing content
    
    let totalItems = 100; // Always show 100 items per view
    
    for (let i = 0; i < totalItems; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Determine category for this item
        let cat = categoryFilter === 'all' ? categories[i % categories.length] : categoryFilter;
        
        // Use reliable Unsplash/Pexels URLs based on category
        let imgUrl = getRandomImage(cat);
        
        // Mock Data
        const title = `${cat.charAt(0).toUpperCase() + cat.slice(1)} Set - Vol ${i + 1}`;
        const views = Math.floor(Math.random() * 5000) + 100;
        const duration = `${Math.floor(Math.random() * 40) + 10}:${Math.floor(Math.random() * 50) + 10}`;

        if (type === 'image') {
            card.innerHTML = `
                <img src="${imgUrl}" alt="${title}" loading="lazy">
                <div class="card-info">
                    <h3>${title}</h3>
                    <span>${views} Views</span>
                </div>
            `;
        } else {
            // Video Player Style
            card.innerHTML = `
                <div style="position:relative;">
                    <img src="${imgUrl}" alt="${title}" style="height:160px;" loading="lazy">
                    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); font-size:30px; color:white; text-shadow: 0 0 10px black;">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <span class="duration-badge">${duration}</span>
                </div>
                <div class="card-info">
                    <h3>${title}</h3>
                    <span>${views} Views • HD</span>
                </div>
            `;
        }
        
        container.appendChild(card);
    }
}

// Categories List
const categories = ['japanese', 'european', 'american', 'african', 'latina'];

// Initial Render
renderCards(imageGrid, 'image', 'all');
renderCards(videoGrid, 'video', 'all');

// Tab Click Event Listeners
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const category = btn.getAttribute('data-category');
        
        // Re-render both grids with filter
        renderCards(imageGrid, 'image', category);
        renderCards(videoGrid, 'video', category);
    });
});