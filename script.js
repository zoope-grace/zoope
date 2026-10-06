/**
         * THUMBNAIL GENERATION
         * Generates a base64 image from the first frame of a video
         */
        const generateVideoThumbnail = (file) => {
            return new Promise((resolve) => {
                const video = document.createElement('video');
                video.src = URL.createObjectURL(file);
                video.currentTime = 1; // Capture frame at 1 second
                video.muted = true;

                video.onloadeddata = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    URL.revokeObjectURL(video.src);
                    resolve(dataUrl);
                };
            });
        };

        /**
         * UI CONTROLS
         */
        const openModal = (id) => {
            document.getElementById(id).style.display = 'flex';
        };

        const closeModal = (id) => {
            document.getElementById(id).style.display = 'none';
        };

        /**
         * CORE FUNCTIONALITY: SAVING DATA
         */
        async function saveVideo() {
            const name = document.getElementById('vid-name').value;
            const fileInput = document.getElementById('vid-file');
            const subInput = document.getElementById('vid-sub');

            if (!name || !fileInput.files[0]) {
                alert("অনুগ্রহ করে নাম এবং ভিডিও ফাইল সিলেক্ট করুন।");
                return;
            }

            const videoFile = fileInput.files[0];
            const subFile = subInput.files[0];

            // Generate thumbnail
            const thumbnail = await generateVideoThumbnail(videoFile);

            // Create Object URLs for the actual files
            // Note: In a real production offline app, you would use FileSystemHandle
            // but for a single-file HTML prototype, ObjectURLs persist until page refresh.
            const videoUrl = URL.createObjectURL(videoFile);
            let subUrl = "";
            if (subFile) {
                subUrl = URL.createObjectURL(subFile);
            }

            const videoData = {
                id: Date.now(),
                name: name,
                url: videoUrl,
                subtitleUrl: subUrl,
                thumbnail: thumbnail,
                date: new Date().toLocaleDateString()
            };

            await saveData('videos', videoData);
            closeModal('videoModal');
            renderContent();
            
            // Reset inputs
            document.getElementById('vid-name').value = "";
            document.getElementById('vid-file').value = "";
            document.getElementById('vid-sub').value = "";
        }

        async function savePhotoSet() {
            const name = document.getElementById('set-name').value;
            const files = document.getElementById('set-files').files;

            if (!name || files.length === 0) {
                alert("অনুগ্রহ করে নাম এবং অন্তত একটি ফাইল সিলেক্ট করুন।");
                return;
            }

            const mediaItems = [];
            for (let file of files) {
                let thumb = "";
                if (file.type.startsWith('video/')) {
                    thumb = await generateVideoThumbnail(file);
                } else {
                    // For images, we can just use the image itself as thumbnail
                    thumb = URL.createObjectURL(file);
                }
                
                mediaItems.push({
                    url: URL.createObjectURL(file),
                    type: file.type,
                    thumbnail: thumb
                });
            }

            const setData = {
                id: Date.now(),
                name: name,
                items: mediaItems,
                cover: mediaItems[0].thumbnail
            };

            await saveData('photoSets', setData);
            closeModal('setModal');
            renderContent();

            document.getElementById('set-name').value = "";
            document.getElementById('set-files').value = "";
        }
/**
         * RENDER LOGIC
         */
        async function renderContent() {
            const mainContent = document.getElementById('main-content');
            const layoutPref = await getSetting('layout-pref') || 'A';
            
            const videos = await getAllData('videos');
            const photoSets = await getAllData('photoSets');

            let html = "";

            // Layout Logic
            const sections = [];
            if (layoutPref === 'A') {
                sections.push({ type: 'videos', data: videos, title: 'ভিডিও কালেকশন' });
                sections.push({ type: 'photos', data: photoSets, title: 'ফটো সেট কালেকশন' });
            } else {
                sections.push({ type: 'photos', data: photoSets, title: 'ফটো সেট কালেকশন' });
                sections.push({ type: 'videos', data: videos, title: 'ভিডিও কালেকশন' });
            }

            sections.forEach(section => {
                html += `<div class="section-container">
                            <h2 class="section-title">${section.title}</h2>
                            <div class="grid-layout">`;
                
                if (section.type === 'videos') {
                    section.data.forEach(vid => {
                        html += `
                            <div class="media-card" onclick="playVideo(${vid.id})">
                                <img src="${vid.thumbnail}" class="card-thumb" alt="${vid.name}">
                                <div class="card-info">
                                    <span class="card-name">${vid.name}</span>
                                    <span class="card-date">${vid.date}</span>
                                </div>
                            </div>`;
                    });
                } else {
                    section.data.forEach(set => {
                        html += `
                            <div class="media-card" onclick="openSet(${set.id})">
                                <img src="${set.cover}" class="card-thumb" alt="${set.name}">
                                <div class="card-info">
                                    <span class="card-name">${set.name}</span>
                                    <span class="card-count">${set.items.length} আইটেম</span>
                                </div>
                            </div>`;
                    });
                }
                
                html += `</div></div>`;
            });

            mainContent.innerHTML = html;
        }

        /**
         * ACTION FUNCTIONS
         */
        async function playVideo(id) {
            const videos = await getAllData('videos');
            const vid = videos.find(v => v.id === id);
            const player = document.getElementById('mainVideoPlayer');
            const track = document.getElementById('videoTrack');
            
            player.src = vid.url;
            if (vid.subtitleUrl) {
                track.src = vid.subtitleUrl;
            } else {
                track.src = "";
            }
            
            openModal('playerOverlay');
            player.play();
        }

        async function openSet(id) {
            const sets = await getAllData('photoSets');
            const set = sets.find(s => s.id === id);
            const lightbox = document.getElementById('lightboxContent');
            
            let contentHtml = `<div class="set-grid">`;
            set.items.forEach(item => {
                contentHtml += `
                    <div class="set-item" onclick="viewItem('${item.url}', '${item.type}')">
                        <img src="${item.thumbnail}" style="width:100%; border-radius:10px; cursor:pointer;">
                    </div>`;
            });
            contentHtml += `</div>`;
            
            lightbox.innerHTML = contentHtml;
            openModal('lightboxOverlay');
        }

        function viewItem(url, type) {
            const lightbox = document.getElementById('lightboxContent');
            if (type.startsWith('video/')) {
                lightbox.innerHTML = `<video src="${url}" controls autoplay style="max-width:100%; max-height:80vh;"></video>`;
            } else {
                lightbox.innerHTML = `<img src="${url}" class="lightbox-img">`;
            }
        }

        async function saveSettings() {
            const pref = document.getElementById('layout-pref').value;
            await setSetting('layout-pref', pref);
            closeModal('settingsModal');
            renderContent();
        }

        function closePlayer() {
            const player =document.getElementById('mainVideoPlayer');
            player.pause();
            player.src = "";
            closeModal('playerOverlay');
        }

        function closeLightbox() {
            document.getElementById('lightboxContent').innerHTML = "";
            closeModal('lightboxOverlay');
        }

        /**
         * INITIALIZATION
         */
        window.onload = async () => {
            try {
                await initDB();
                await renderContent();
            } catch (error) {
                console.error("Initialization failed:", error);
                alert("Database initialization failed. Please refresh the page.");
            }
        };

        // Handle modal closing when clicking outside the content
        window.onclick = function(event) {
            if (event.target.classList.contains('overlay')) {
                event.target.style.display = "none";
            }
        };
    </script>
</body>
</html>