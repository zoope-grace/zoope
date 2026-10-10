// ========== কনফিগারেশন ==========
// আপনার Pexels API Key এখানে বসান (https://www.pexels.com/api/)
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY_HERE';

const PHOTOS_PER_PAGE = 12;
const VIDEOS_PER_PAGE = 6;

let currentPhotoPage = 1;
let currentVideoPage = 1;

// ========== DOM এলিমেন্ট ==========
const photoGallery = document.getElementById('photo-gallery');
const videoGallery = document.getElementById('video-gallery');
const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreVideoBtn = document.getElementById('load-more-video-btn');

// ========== ছবি লোড করার ফাংশন ==========
async function loadPhotos(page = 1) {
    try {
        // ইসলামিক থিমের জন্য সার্চ কোয়েরি
        const query = 'islamic architecture mosque';
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${PHOTOS_PER_PAGE}&page=${page}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        displayPhotos(data.photos);

    } catch (error) {
        console.error('ছবি লোড করতে সমস্যা:', error);
        photoGallery.innerHTML = '<p style="text-align:center; width:100%;">ছবি লোড করা যায়নি। API Key চেক করুন।</p>';
    }
}

// ========== ছবি প্রদর্শন ==========
function displayPhotos(photos) {
    if (currentPhotoPage === 1) photoGallery.innerHTML = '';

    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${photo.src.large}" alt="${photo.alt || 'Islamic Image'}" loading="lazy">
            <div class="overlay">
                <p>ছবি: ${photo.photographer}</p>
            </div>
        `;
        // ছবিতে ক্লিক করলে বড় করে দেখা যাবে
        item.addEventListener('click', () => {
            window.open(photo.src.original, '_blank');
        });
        photoGallery.appendChild(item);
    });
}

// ========== ভিডিও লোড করার ফাংশন ==========
async function loadVideos(page = 1) {
    try {
        const query = 'mosque prayer islamic';
        const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${VIDEOS_PER_PAGE}&page=${page}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });

        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        displayVideos(data.videos);

    } catch (error) {
        console.error('ভিডিও লোড করতে সমস্যা:', error);
        videoGallery.innerHTML = '<p style="text-align:center; width:100%;">ভিডিও লোড করা যায়নি। API Key চেক করুন।</p>';
    }
}

// ========== ভিডিও প্রদর্শন ==========
function displayVideos(videos) {
    if (currentVideoPage === 1) videoGallery.innerHTML = '';

    videos.forEach(video => {
        // সবচেয়ে ভালো মানের ভিডিও ফাইল খোঁজা
        const videoFile = video.video_files.find(file => file.quality === 'hd') || video.video_files[0];
        
        const item = document.createElement('div');
        item.className = 'video-item';
        item.innerHTML = `
            <video controls poster="${video.image}" preload="metadata">
                <source src="${videoFile.link}" type="video/mp4">
                আপনার ব্রাউজার ভিডিও সাপোর্ট করে না।
            </video>
        `;
        videoGallery.appendChild(item);
    });
}

// ========== "আরও লোড" বাটনের ইভেন্ট ==========
loadMoreBtn.addEventListener('click', () => {
    currentPhotoPage++;
    loadPhotos(currentPhotoPage);
});

loadMoreVideoBtn.addEventListener('click', () => {
    currentVideoPage++;
    loadVideos(currentVideoPage);
});

// ========== পেজ লোড হওয়ার সময় ==========
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos(1);
    loadVideos(1);
});