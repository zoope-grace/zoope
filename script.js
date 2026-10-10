// ============================
// কনফিগারেশন
// ============================
// Pexels API Key এখানে বসান (https://www.pexels.com/api/)
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY_HERE';

// প্রতি লোডে কতগুলো ছবি/ভিডিও আসবে
const PHOTOS_PER_PAGE = 12;
const VIDEOS_PER_PAGE = 6;

// বর্তমান পেজ ট্র্যাকিং
let currentPhotoPage = 1;
let currentVideoPage = 1;

// ============================
// DOM এলিমেন্ট
// ============================
const photoGallery = document.getElementById('photo-gallery');
const videoGallery = document.getElementById('video-gallery');
const loadMorePhotosBtn = document.getElementById('load-more-photos');
const loadMoreVideosBtn = document.getElementById('load-more-videos');

// ============================
// ছবি লোড করার ফাংশন
// ============================
async function loadPhotos(page = 1) {
    try {
        // ইসলামিক থিমের জন্য সার্চ কোয়েরি (Pexels-এ mosque, islamic architecture প্রচুর আছে)
        const query = 'mosque islamic architecture';
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${PHOTOS_PER_PAGE}&page=${page}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data = await response.json();
        displayPhotos(data.photos);

        // Pexels API থেকে সর্বোচ্চ রেজোলিউশনের ছবি পেতে 'src.large2x' বা 'src.original' ব্যবহার করা যায়
        // এখানে 'src.large' ব্যবহার করা হয়েছে যাতে লোড দ্রুত হয়

    } catch (error) {
        console.error('ছবি লোড করতে সমস্যা:', error);
        if (currentPhotoPage === 1) {
            photoGallery.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">ছবি লোড করা যায়নি। API Key চেক করুন।</p>';
        }
    }
}

// ============================
// ছবি প্রদর্শন
// ============================
function displayPhotos(photos) {
    if (currentPhotoPage === 1) {
        photoGallery.innerHTML = '';
    }

    if (!photos || photos.length === 0) {
        if (currentPhotoPage === 1) {
            photoGallery.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">কোনো ছবি পাওয়া যায়নি।</p>';
        }
        return;
    }

    photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${photo.src.large}" alt="${photo.alt || 'Islamic Image'}" loading="lazy">
            <div class="overlay">
                <p>📷 ${photo.photographer || 'Pexels'}</p>
            </div>
        `;
        // ছবিতে ক্লিক করলে নতুন ট্যাবে বড় ছবি খুলবে
        item.addEventListener('click', () => {
            window.open(photo.src.original, '_blank');
        });
        photoGallery.appendChild(item);
    });
}

// ============================
// ভিডিও লোড করার ফাংশন
// ============================
async function loadVideos(page = 1) {
    try {
        // ইসলামিক থিমের জন্য ভিডিও সার্চ
        const query = 'mosque prayer islamic';
        const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${VIDEOS_PER_PAGE}&page=${page}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': PEXELS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data = await response.json();
        displayVideos(data.videos);

    } catch (error) {
        console.error('ভিডিও লোড করতে সমস্যা:', error);
        if (currentVideoPage === 1) {
            videoGallery.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">ভিডিও লোড করা যায়নি। API Key চেক করুন।</p>';
        }
    }
}

// ============================
// ভিডিও প্রদর্শন
// ============================
function displayVideos(videos) {
    if (currentVideoPage === 1) {
        videoGallery.innerHTML = '';
    }

    if (!videos || videos.length === 0) {
        if (currentVideoPage === 1) {
            videoGallery.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">কোনো ভিডিও পাওয়া যায়নি।</p>';
        }
        return;
    }

    videos.forEach(video => {
        // সবচেয়ে ভালো মানের (HD) ভিডিও ফাইল বেছে নেওয়া
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

// ============================
// ইভেন্ট লিসেনার
// ============================
loadMorePhotosBtn.addEventListener('click', () => {
    currentPhotoPage++;
    loadPhotos(currentPhotoPage);
});

loadMoreVideosBtn.addEventListener('click', () => {
    currentVideoPage++;
    loadVideos(currentVideoPage);
});

// ============================
// পেজ লোড হওয়ার সময়
// ============================
document.addEventListener('DOMContentLoaded', () => {
    loadPhotos(1);
    loadVideos(1);
});