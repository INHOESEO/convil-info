async function loadHTML(elementId, path) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error(`Element with id '${elementId}' not found`);
            return;
        }

        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        // HTML 파싱
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // layout인 경우 head와 script 요소 처리
        if (elementId === 'layout') {
            // CSS 링크 추가
            Array.from(doc.getElementsByTagName('link')).forEach(link => {
                if (!document.querySelector(`link[href="${link.getAttribute('href')}"]`)) {
                    document.head.appendChild(link.cloneNode(true));
                }
            });
            
            // 모든 스크립트 처리
            Array.from(doc.getElementsByTagName('script')).forEach(script => {
                const newScript = document.createElement('script');
                
                // src 속성이 있는 경우
                if (script.src) {
                    // 중복 로드 방지
                    if (!document.querySelector(`script[src="${script.getAttribute('src')}"]`)) {
                        newScript.src = script.src;
                    } else {
                        return; // 이미 존재하면 스킵
                    }
                } else {
                    // 인라인 스크립트인 경우
                    newScript.textContent = script.textContent;
                }
                
                // 기타 속성 복사
                Array.from(script.attributes).forEach(attr => {
                    if (attr.name !== 'src') {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });
                
                document.body.appendChild(newScript);
            });
            
            // body 내용 삽입
            element.innerHTML = doc.body.innerHTML;
        } else {
            // layout이 아닌 경우는 내용만 삽입
            element.innerHTML = doc.body.innerHTML;
        }
        // YouTube 섹션이 로드된 경우 스크립트도 다시 로드
        // if (elementId === 'mainYoutubeSection') {
        //     console.log('YouTube 섹션 로드됨');
            
        //     // CSS 로드
        //     if (!document.querySelector('link[href="./section/css/main-youtube-section.css"]')) {
        //         const link = document.createElement('link');
        //         link.rel = 'stylesheet';
        //         link.type = 'text/css';
        //         link.href = './section/css/main-youtube-section.css';
        //         document.head.appendChild(link);
        //     }

        //     // 스크립트 로드 및 실행
        //     const script = document.createElement('script');
        //     script.src = './section/js/main-youtube-section.js';
        //     script.onload = function() {
        //         console.log('YouTube 스크립트 로드됨');
        //         if (typeof loadVideos === 'function') {
        //             loadVideos();
        //         }
        //     };
        //     document.body.appendChild(script);
        // }
    } catch (error) {
        console.error('HTML 로드 중 에러 발생:', error);
    }
}


async function initLayout() {
    try {
        // 순차적 로드
        await loadHTML('layout', './basic/layout.html');
        await loadHTML('header', './basic/header.html');
        await loadHTML('footer', './basic/footer.html');
        await loadHTML('mainBannerSection', './section/main/main-banner-section.html');

        // 레이아웃 로드 완료 이벤트
        document.dispatchEvent(new CustomEvent('layoutLoaded'));
    } catch (error) {
        console.error('Layout 초기화 중 에러 발생:', error);
    }
}
    
document.addEventListener('DOMContentLoaded', initLayout)    