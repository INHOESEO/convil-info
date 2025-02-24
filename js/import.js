async function loadHTML(elementId, path) {
    try {
        console.log(`Loading HTML for ${elementId}`);
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

        // live-server 스크립트 제거
        const cleanDoc = removeLiveServerScripts(doc);

        if (elementId === 'mainThreedSection') {
            console.log('Threed section loaded, checking scripts...');
        }
        
        // CSS 링크 추가 (layout과 section 모두)
        Array.from(cleanDoc.getElementsByTagName('link')).forEach(link => {
            const href = link.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                const newLink = link.cloneNode(true);
                document.head.appendChild(newLink);
            }
        });

        // body 내용 삽입
        if (elementId === 'layout') {
            element.innerHTML = cleanDoc.body.innerHTML;
        } else {
            const mainContent = cleanDoc.body.querySelector(`#${elementId}Inner`);
            if (mainContent) {
                element.innerHTML = mainContent.outerHTML;
            }
        }

        // 스크립트 처리
        const scripts = Array.from(cleanDoc.getElementsByTagName('script')).filter(script => {
            return !script.textContent.includes('live-server') && 
                   !script.textContent.includes('WebSocket');
        });

        // 순차적으로 스크립트 로드
        for (const script of scripts) {
            try {
                console.log('Processing script:', script.src || 'inline script');
                await loadScript(script);
                console.log('Script loaded successfully');
            } catch (error) {
                console.error('Script load error:', error);
            }
        }

        // layoutLoaded 이벤트 발생
        if (elementId === 'layout') {
            document.dispatchEvent(new CustomEvent('layoutLoaded'));
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
        console.error(`Error loading ${elementId}:`, error);
    }
}

// 헬퍼 함수들
function removeLiveServerScripts(doc) {
    const scripts = doc.getElementsByTagName('script');
    Array.from(scripts).forEach(script => {
        if (script.textContent.includes('live-server') || 
            script.textContent.includes('WebSocket')) {
            script.remove();
        }
    });
    return doc;
}

function loadScript(script) {
    return new Promise((resolve, reject) => {
        if (script.src) {
            // 이미 로드된 스크립트는 스킵
            if (document.querySelector(`script[src="${script.src}"]`)) {
                resolve();
                return;
            }
            const newScript = document.createElement('script');
            newScript.src = script.src;
            newScript.onload = resolve;
            newScript.onerror = reject;
            document.body.appendChild(newScript);
        } else {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
            resolve();
        }
    });
}

// HTML에서 live-server 스크립트 제거
function cleanHTML(html) {
    return html.replace(
        /<script[\s\S]*?<\/script>/gi,
        match => match.includes('live-server') ? '' : match
    );
}

async function initLayout() {
    try {
        await loadHTML('layout', './basic/layout.html');
        await loadHTML('header', './basic/header.html');
        await loadHTML('footer', './basic/footer.html');
        await loadHTML('mainBannerSection', './section/main/main-banner-section.html');
        await loadHTML('mainWhyusSection', './section/main/main-whyus-section.html');
        await loadHTML('mainThreedSection', './section/main/main-threed-section.html');
    } catch (error) {
        console.error('Layout 초기화 중 에러 발생:', error);
    }
}

document.addEventListener('DOMContentLoaded', initLayout);