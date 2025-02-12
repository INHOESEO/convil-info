const API_KEY = 'AIzaSyD_YEZsA8TnFHQTXJCEbkSxRQvoWqaH5Bg';
const CHANNEL_ID = 'UCuLL6K3wbBDThigSdJ0rnZQ';
const MAX_RESULTS = 5;

async function getChannelVideos(pageToken = '') {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}`
            + `&channelId=${CHANNEL_ID}`
            + `&part=snippet,id`
            + `&order=date`
            + `&maxResults=${MAX_RESULTS}`
            + (pageToken ? `&pageToken=${pageToken}` : '')
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return null;
    }
}

function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('ko-KR');
}

function createVideoElement(video) {
    const videoDiv = document.createElement('div');
    videoDiv.className = 'video-item';
    
    const title = video.snippet.title;
    const publishDate = formatDate(video.snippet.publishTime);
    const videoId = video.id.videoId;
    
    videoDiv.innerHTML = `
        <iframe 
            class="video-frame"
            src="https://www.youtube.com/embed/${videoId}"
            title="${title}"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>
        <div class="video-title">${title}</div>
        <div class="video-date">${publishDate}</div>
    `;
    
    return videoDiv;
}

async function loadVideos() {
    console.log('loadVideos 함수 실행됨');
    
    const videosContainer = document.getElementById('videos');
    if (!videosContainer) {
        console.error('videos 컨테이너를 찾을 수 없습니다.');
        return;
    }
    
    // 컨테이너를 비워서 중복 로드 방지
    videosContainer.innerHTML = '';
    
    // 한 번만 API 호출
    const data = await getChannelVideos();
    if (!data || !data.items) return;
    
    // MAX_RESULTS 만큼만 표시
    data.items.forEach(video => {
        if (video.id.videoId) {
            videosContainer.appendChild(createVideoElement(video));
        }
    });
}

// DOMContentLoaded 이벤트 리스너 제거 (import.js에서 처리)
// window.onload 이벤트로 변경
window.onload = function() {
    if (document.getElementById('videos')) {
        loadVideos();
    }
};