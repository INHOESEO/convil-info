async function loadHTML(elementId, path) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with id '${elementId}' not found`);
            return;
        }

        const response = await fetch(path);
        const html = await response.text();
        element.innerHTML = html;

        // YouTube 섹션이 로드된 경우 스크립트도 다시 로드
        if (elementId === 'mainYoutubeSection') {
            console.log('YouTube 섹션 로드됨'); // 디버깅용
            
            // CSS 로드
            if (!document.querySelector('link[href="./section/css/main-youtube-section.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = './section/css/main-youtube-section.css';
                document.head.appendChild(link);
            }

            // 스크립트 로드 및 실행
            const script = document.createElement('script');
            script.src = './section/js/main-youtube-section.js';
            script.onload = function() {
                console.log('YouTube 스크립트 로드됨'); // 디버깅용
                if (typeof loadVideos === 'function') {
                    loadVideos();
                }
            };
            document.body.appendChild(script);
        }
    } catch (error) {
        console.error('HTML 로드 중 에러 발생:', error);
    }
}

// 순차적 로드
async function initLayout() {
    // 먼저 layout 로드
    await loadHTML('layout', './basic/layout.html');
    await loadHTML('header', './basic/header.html');
    await loadHTML('footer', './basic/footer.html');
    await loadHTML('mainDashboardSection', './section/main/main-dashboard-section.html');
    await loadHTML('mainYoutubeSection', './section/main/main-youtube-section.html');

    // header 높이만큼 container에 margin-top 설정
    const header = document.getElementById('header');
    const container = document.getElementById('container');
    
    if (header && container) {
        const headerHeight = header.offsetHeight;
        container.style.marginTop = headerHeight + 'px';
    }
}

document.addEventListener('DOMContentLoaded', initLayout);

// 창 크기가 변경될 때도 margin 조정
window.addEventListener('resize', function() {
    const header = document.getElementById('header');
    const container = document.getElementById('container');
    
    if (header && container) {
        const headerHeight = header.offsetHeight;
        container.style.marginTop = headerHeight + 'px';
    }
});

document.addEventListener('DOMContentLoaded', initLayout);