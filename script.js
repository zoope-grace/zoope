document.addEventListener('DOMContentLoaded', () => {
    const imageGrid = document.getElementById('imageGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // মক ডাটা: এখানে আপনি unphalash এর আসল ইমেজ লিঙ্ক বসাবেন
    const images = [
        { id: 1, category: 'hot', url: 'https://via.placeholder.com/400x600?text=Hot1' },
        { id: 2, category: 'cute', url: 'https://via.placeholder.com/400x600?text=Cute1' },
        { id: 3, category: 'premium', url: 'https://via.placeholder.com/400x600?text=Premium1' },
        { id: 4, category: 'hot', url: 'https://via.placeholder.com/400x600?text=Hot2' },
        { id: 5, category: 'cute', url: 'https://via.placeholder.com/400x600?text=Cute2' },
        { id: 6, category: 'premium', url: 'https://via.placeholder.com/400x600?text=Premium2' },
    ];

    // গ্যালারি রেন্ডার করার ফাংশন
    function renderGallery(filter = 'all') {
        imageGrid.innerHTML = ''; // আগের ছবি পরিষ্কার করা

        const filteredImages = filter === 'all' 
            ? images 
            : images.filter(img => img.category === filter);

        filteredImages.forEach(img => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.setAttribute('data-category', img.category);
            
            card.innerHTML = `
                <img src="${img.url}" alt="Japanese Model">
                <div class="overlay">
                    <span class="badge">${img.category}</span>
                    <button class="view-btn">View Full Size</button>
                </div>
            `;
            imageGrid.appendChild(card);
        });
    }

    // ফিল্টার বাটন ইভেন্ট
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');// ফিল্টার ভ্যালু নিয়ে গ্যালারি আপডেট করা
        const filterValue = btn.getAttribute('data-filter');
        renderGallery(filterValue);
    });
});

// ইমেজের উপর ক্লিক করলে ফুল সাইজ দেখানোর জন্য একটি সিম্পল ফাংশন (ঐচ্ছিক)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) {
        const imgSrc = e.target.closest('.image-card').querySelector('img').src;
        window.open(imgSrc, '_blank');
    }
});