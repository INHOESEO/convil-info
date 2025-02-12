async function loadHTML(elementId, path) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with id '${elementId}' not found`);
            return;
        }

        const response = await fetch(path);
        const html = await response.text();
        
        // HTML을 파싱하여 script 태그를 찾습니다
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 먼저 HTML 내용을 삽입
        element.innerHTML = html;
        
        // script 태그들을 찾아서 다시 로드
        const scripts = doc.getElementsByTagName('script');
        for (let script of scripts) {
            const newScript = document.createElement('script');
            
            // src가 있는 경우 (외부 스크립트)
            if (script.src) {
                newScript.src = script.src;
            } else {
                // 인라인 스크립트인 경우
                newScript.textContent = script.textContent;
            }
            
            // 원본 script의 속성들을 복사
            Array.from(script.attributes).forEach(attr => {
                if (attr.name !== 'src') { // src는 이미 처리했으므로 제외
                    newScript.setAttribute(attr.name, attr.value);
                }
            });
            
            // 새 script 태그를 body 끝에 추가
            document.body.appendChild(newScript);
        }

        // YouTube 섹션이 로드된 경우 스크립트도 다시 로드
        if (elementId === 'mainYoutubeSection') {
            console.log('YouTube 섹션 로드됨');
            
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
                console.log('YouTube 스크립트 로드됨');
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

    // 헤더 마진 설정을 위한 이벤트 발생
    const event = new CustomEvent('layoutLoaded');
    document.dispatchEvent(event);
}

document.addEventListener('DOMContentLoaded', initLayout);