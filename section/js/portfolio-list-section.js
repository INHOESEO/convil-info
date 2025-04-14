// 페이지 로드 시 실행되는 즉시 실행 함수
(function() {
    // DOM이 완전히 로드되었는지 확인하고 약간의 지연 추가
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // DOM이 로드된 후 약간의 지연 추가
            setTimeout(initializePortfolio, 100);
        });
    } else {
        // 이미 DOM이 로드되었다면 약간의 지연 후 실행
        setTimeout(initializePortfolio, 100);
    }
    
    function initializePortfolio() {
        // 엄격한 선택자로 요소 찾기 시도
        let videoGrid = document.querySelector('#portfolioListSectionInner .video-portfolio-list .grid-row.video-portfolio-grid');
        
        if (!videoGrid) {
            // 두 번째 시도: 덜 엄격한 선택자
            videoGrid = document.querySelector('.video-portfolio-grid');
        }
        
        if (!videoGrid) {
            // 세 번째 시도: grid-row 클래스가 있는 요소 중 첫 번째
            videoGrid = document.querySelector('.video-portfolio-list .grid-row');
        }
        
        if (!videoGrid) {
            console.error('비디오 포트폴리오 그리드를 찾을 수 없습니다!');
            // 문서의 모든 요소를 로깅하여 디버깅
            const allElements = document.querySelectorAll('*');
            return;
        }
        
        // 레퍼런스 저장 (전역 변수)
        window.portfolioVideoGrid = videoGrid;
        
        renderVideoPortfolio();
    }
})();

// 비디오 포트폴리오 데이터 배열
const videoPortfolioData = [
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "[종합 사례] Before&After를 한 눈에",
        hashtags: ["#식당/카페", "#기타"],
        videoUrl: "https://www.youtube.com/embed/XmxkLfo5j2s"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "3000만원 이상 공사 절약 후기",
        hashtags: ["#식당/카페", "#기타"],
        videoUrl: "https://www.youtube.com/embed/BH7JEFf-cC8"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "실내 캠핑장",
        hashtags: ["#식당/카페", "#기타"],
        videoUrl: "https://www.youtube.com/embed/peXt7BhASNI"
        // 링크오류
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "샤브샤브 가게",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/S5Gqotu5770"
        // 링크오류
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "주택 인테리어",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/KQc85H-a8PA"
        // 링크오류
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "한식집",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/Qkh5rjPF_8Q"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "교회 리모델링",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/vEm3Cpo20tI"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "세신샵",
        hashtags: ["#뷰티/패션", "#기타"],
        videoUrl: "https://www.youtube.com/embed/G7WqNntiPv0"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "아파트",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/CFj4UrsoI0s"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "고깃집",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/WgYJW0vYbII" 
        // 링크오류
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "침실 인테리어",
        hashtags: ["#주거"],
        videoUrl: "https://www.youtube.com/embed/5QOBCGjJg3o"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "한식당",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/Aaj-awEHyoQ"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "사옥 리모델링",
        hashtags: ["#사무실"],
        videoUrl: "https://www.youtube.com/embed/hA03W6_tX8s"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "100평 사무실",
        hashtags: ["#사무실"],
        videoUrl: "https://www.youtube.com/embed/btuu4z_LiU0"
        // 링크오류
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "교회",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/GSaeGFK5-xw"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "카페",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/1mAuXMlrDyM"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "워독 플래그십 스토어 백화점",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/hbyLqxz5skY"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "무인문구점 브랜딩부터 인테리어",
        hashtags: ["#기타"],
        videoUrl: "https://www.youtube.com/embed/hSSzdRrl2TE"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "치킨 프랜차이즈",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/3oMRJ9O9bnE"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "뷰티샵",
        hashtags: ["#뷰티/패션"],
        videoUrl: "https://www.youtube.com/embed/iCFXLP3FUJk"
    },
    {
        thumbnail: "../source/img/portfolio/portfolio-element-thumb-test.png",
        title: "실내 캠핑장 컨설팅 전/후",
        hashtags: ["#식당/카페"],
        videoUrl: "https://www.youtube.com/embed/MFd8xs_2RNU"
    }
    // 여기에 더 많은 비디오 항목을 추가할 수 있습니다
];

// 비디오 포트폴리오 그리드 렌더링 함수
function renderVideoPortfolio() {

    try {
        // 저장된 레퍼런스 사용
        const videoGrid = window.portfolioVideoGrid || document.querySelector('.video-portfolio-grid');
        
        if (!videoGrid) {
            return;
        }
        
        // 기존 내용 비우기
        videoGrid.innerHTML = '';
        
        // 각 비디오 항목에 대해 HTML 생성 및 추가
        videoPortfolioData.forEach((item, index) => {
           
            const portfolioElement = document.createElement('div');
            portfolioElement.className = 'grid33';
            
            // 해시태그 HTML 생성
            const hashtagsHtml = item.hashtags.map(tag => `<li>${tag}</li>`).join('');
            
            // 포트폴리오 요소 HTML 구조 생성
            portfolioElement.innerHTML = `
                <div class="portfolio-element">
                    <img class="portfolio-element-thumb" src="${item.thumbnail}">
                    <h3 class="portfolio-element-title">${item.title}</h3>
                    <ul class="portfolio-element-hashtag">
                        ${hashtagsHtml}
                    </ul>
                </div>
                <div class="modal portfolio-element-modal">
                    <div class="modal-header">
                        <p>${item.title}</p>
                        <img src="../source/svg/portfolio-list-modal-close.svg">
                    </div>
                    <div class="modal-body">
                        <iframe width="100%" height="500" src="${item.videoUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            
            videoGrid.appendChild(portfolioElement);
        });
        
        console.log('모든 항목 렌더링 완료, 모달 초기화 시작');
        // 모달 기능 초기화
        initializeModals();
    } catch (error) {
        console.error('렌더링 함수에서 오류 발생:', error);
    }
}

// 모달 기능 초기화 함수
function initializeModals() {
    try {
        // 모든 포트폴리오 요소 선택
        const portfolioElements = document.querySelectorAll('.portfolio-element');
        console.log(`모달 초기화: ${portfolioElements.length}개 요소 발견`);
        
        // 모달 열기 이벤트 추가
        portfolioElements.forEach((element, index) => {
            element.addEventListener('click', function() {
                const modal = this.parentElement.querySelector('.portfolio-element-modal');
                modal.style.display = 'block';
                
                // 모달 배경 추가
                addModalBackground();
            });
        });
        
        // 모달 닫기 버튼에 이벤트 추가
        const closeButtons = document.querySelectorAll('.modal-header img');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // 이벤트 버블링 방지
                const modal = this.closest('.modal');
                modal.style.display = 'none';
                
                // 모달 배경 제거
                removeModalBackground();
            });
        });
        
        console.log('모달 이벤트 리스너 등록 완료');
    } catch (error) {
        console.error('모달 초기화 중 오류 발생:', error);
    }
}

// 모달 배경 추가 함수
function addModalBackground() {
    // 이미 배경이 있는지 확인
    if (!document.querySelector('.modal-background')) {
        const background = document.createElement('div');
        background.className = 'modal-background';
        background.style.position = 'fixed';
        background.style.top = '0';
        background.style.left = '0';
        background.style.width = '100%';
        background.style.height = '100%';
        background.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        background.style.zIndex = '10';
        
        document.body.appendChild(background);
        
        // 배경 클릭 시 모달 닫기
        background.addEventListener('click', function() {
            const openModals = document.querySelectorAll('.modal[style="display: block;"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
            removeModalBackground();
        });
    }
}

// 모달 배경 제거 함수
function removeModalBackground() {
    const background = document.querySelector('.modal-background');
    if (background) {
        document.body.removeChild(background);
    }
}