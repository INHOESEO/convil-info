// 인테리어 기능 통합 스크립트
(function() {
    // DOM이 완전히 로드되었는지 확인하고 약간의 지연 추가
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // DOM이 로드된 후 약간의 지연 추가
            setTimeout(initializeInterior, 100);
        });
    } else {
        // 이미 DOM이 로드되었다면 약간의 지연 후 실행
        setTimeout(initializeInterior, 100);
    }
    
    function initializeInterior() {
        // 엄격한 선택자로 요소 찾기 시도
        let videoGrid = document.querySelector('#interiorListSectionInner .video-interior-list .grid-row.video-interior-grid');
        
        if (!videoGrid) {
            // 두 번째 시도: 덜 엄격한 선택자
            videoGrid = document.querySelector('.video-interior-grid');
        }
        
        if (!videoGrid) {
            // 세 번째 시도: grid-row 클래스가 있는 요소 중 첫 번째
            videoGrid = document.querySelector('.video-interior-list .grid-row');
        }
        
        if (!videoGrid) {
            return;
        }
        
        // 인테리어 상태 및 페이지네이션 초기화
        const interiorState = {
            videoGrid: videoGrid,
            currentPage: 1,
            itemsPerPage: 12,
            totalItems: videoInteriorData.length,
            filteredData: [...videoInteriorData] // 처음에는 모든 데이터 포함
        };
        
        // 페이지네이션 컨트롤 생성
        createPaginationControls(interiorState);
        
        // 인테리어 렌더링
        renderVideoInterior(interiorState);
    }
    
    // 페이지네이션 컨트롤 생성 함수
    function createPaginationControls(state) {
        const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
        
        // 페이지네이션 컨테이너 생성 또는 가져오기
        let paginationContainer = document.querySelector('.interior-pagination');
        
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.className = 'interior-pagination';
            
            // 비디오 그리드 후에 삽입
            state.videoGrid.parentNode.insertBefore(paginationContainer, state.videoGrid.nextSibling);
        } else {
            // 기존 페이지네이션이 있으면 내용 비우기
            paginationContainer.innerHTML = '';
        }
        
        // 아이템이 없거나 한 페이지 이하면 페이지네이션 표시 안함
        if (state.totalItems === 0 || totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        } else {
            paginationContainer.style.display = 'flex';
        }
        
        // 이전 페이지 버튼
        const prevButton = document.createElement('button');
        prevButton.textContent = '이전';
        prevButton.className = 'pagination-btn prev-btn';
        prevButton.disabled = state.currentPage === 1;
        
        prevButton.addEventListener('click', function() {
            if (state.currentPage > 1) {
                state.currentPage--;
                renderVideoInterior(state);
                updatePaginationActive(state);
            }
        });
        
        paginationContainer.appendChild(prevButton);
        
        // 페이지 번호 버튼들
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = `pagination-btn page-btn ${i === state.currentPage ? 'active' : ''}`;
            pageButton.dataset.page = i;
            
            pageButton.addEventListener('click', function() {
                state.currentPage = parseInt(this.dataset.page);
                renderVideoInterior(state);
                updatePaginationActive(state);
            });
            
            paginationContainer.appendChild(pageButton);
        }
        
        // 다음 페이지 버튼
        const nextButton = document.createElement('button');
        nextButton.textContent = '다음';
        nextButton.className = 'pagination-btn next-btn';
        nextButton.disabled = state.currentPage === totalPages;
        
        nextButton.addEventListener('click', function() {
            if (state.currentPage < totalPages) {
                state.currentPage++;
                renderVideoInterior(state);
                updatePaginationActive(state);
            }
        });
        
        paginationContainer.appendChild(nextButton);
    }
    
    // 페이지네이션 활성화 상태 업데이트
    function updatePaginationActive(state) {
        const prevButton = document.querySelector('.prev-btn');
        const nextButton = document.querySelector('.next-btn');
        const pageButtons = document.querySelectorAll('.pagination-btn.page-btn');
        const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
        
        // 이전/다음 버튼 상태 업데이트
        if (prevButton) prevButton.disabled = state.currentPage === 1;
        if (nextButton) nextButton.disabled = state.currentPage === totalPages;
        
        // 페이지 버튼 상태 업데이트
        pageButtons.forEach(button => {
            const page = parseInt(button.dataset.page);
            if (page === state.currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // 비디오 인테리어 그리드 렌더링 함수
    function renderVideoInterior(state) {
        try {
            // 상태 객체에서 그리드 요소 참조 가져오기
            const videoGrid = state.videoGrid;
            
            if (!videoGrid) {
                return;
            }
            
            // 기존 내용 비우기
            videoGrid.innerHTML = '';
            
            // 필터링된 데이터가 없으면 메시지 표시
            if (state.filteredData.length === 0) {
                const noResultsElement = document.createElement('div');
                noResultsElement.className = 'no-results-message';
                noResultsElement.style.width = '100%';
                noResultsElement.style.padding = '50px 20px';
                noResultsElement.style.textAlign = 'center';
                noResultsElement.style.fontSize = '18px';
                noResultsElement.style.color = '#666';
                noResultsElement.textContent = '인테리어 항목이 없습니다.';
                
                videoGrid.appendChild(noResultsElement);
                return;
            }
            
            // 현재 페이지에 표시할 항목 계산
            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = Math.min(startIndex + state.itemsPerPage, state.totalItems);
            
            // 현재 페이지의 항목만 렌더링
            for (let i = startIndex; i < endIndex; i++) {
                // 필터링된 데이터 배열의 범위를 벗어나지 않도록 확인
                if (i >= state.filteredData.length) break;
                
                const item = state.filteredData[i];
                
                const interiorElement = document.createElement('div');
                interiorElement.className = 'grid33';
                
                // YouTube URL이 Shorts인지 확인하고 조정
                const videoUrl = processYouTubeUrl(item.videoUrl);
                
                // 인테리어 요소 HTML 구조 생성
                interiorElement.innerHTML = `
                    <div class="interior-element">
                        <img class="interior-element-thumb" src="${item.thumbnail}" alt="${item.title}">
                        <h3 class="interior-element-title">${item.title}</h3>
                    </div>
                    <div class="modal interior-element-modal">
                        <div class="modal-header">
                            <p>${item.title}</p>
                            <img src="../source/svg/modal-close.svg" alt="닫기">
                        </div>
                        <div class="modal-body">
                            <iframe width="100%" height="500" src="${videoUrl}" title="${item.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                        </div>
                    </div>
                `;
                
                videoGrid.appendChild(interiorElement);
            }
            
            // 모달 기능 초기화
            initializeModals();
            
            // 페이지네이션 상태 업데이트
            updatePaginationActive(state);
        } catch (error) { }
    }
})();

// 수정된 비디오 인테리어 데이터 배열
const videoInteriorData = [
    {
        thumbnail: "../source/img/interior/interior-element-thumb-01.png",
        title: "1. 창업 준비해? 안보면 손해",
        videoUrl: "https://www.youtube.com/embed/iKqFHzKaiIQ?si=jgKnx7mjIglkUHXg"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-02.png",
        title: "2. 실내 캠핑장 감성까지 잡기 / 현장 컨설팅",
        videoUrl: "https://www.youtube.com/embed/X8YMk8XdV2s?si=Quu3S9eOJPQJr_zj"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-03.png",
        title: "3. 반셀프 인테리어로 30% 이상 공사비 절감!",
        videoUrl: "https://www.youtube.com/embed/4kjG6AF3EBQ?si=FNfbIZcALSy7QDik"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-04.png",
        title: "4. 반셀프 인테리어 인터뷰",
        videoUrl: "https://www.youtube.com/embed/_kJKeTYkMPg?si=E6OQj8bUf4cRtJHF"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-05.png",
        title: "5. 전원주택 인테리어 팁",
        videoUrl: "https://www.youtube.com/embed/xA_YAq8Uz4c?si=Q28BzV5VpEF_keNg"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-06.png",
        title: "6. 매출상승 고깃집 창업 팁",
        videoUrl: "https://www.youtube.com/embed/EjxRZYxsiBg?si=mbdPEr4ouAfGEBvd"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-07.png",
        title: "7. 창업 비용 절약 (인테리어 꿀팁)",
        videoUrl: "https://www.youtube.com/embed/uihCvCv8MnU?si=OOnVVdK8Mt9Amksu"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-08.png",
        title: "8. 한식당 프랜차이즈 비용 절약하기",
        videoUrl: "https://www.youtube.com/embed/KZ5vH3KKqas?si=s0qnpARhkz7-owfi"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-09.png",
        title: "9. 아파트 반셀프 인테리어 꿀팁",
        videoUrl: "https://www.youtube.com/embed/IiTPZ-E6zCo?si=7TDTcg11JhNl4le5"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-10.png",
        title: "10. 상가 인테리어 도면 전문업체",
        videoUrl: "https://www.youtube.com/embed/nlyj_XG2zII?si=cpF2ms-gjaD1tO9S"
    },
    {
        thumbnail: "../source/img/interior/interior-element-thumb-11.png",
        title: "11. 인테리어 하기 전 꼭 보면 좋은 영상!",
        videoUrl: "https://www.youtube.com/embed/ol8f05gNbMw?si=lJB-TEyysHVrG5gK"
    },
];

// YouTube URL 처리 함수
function processYouTubeUrl(url) {
    try {
        // 이미 수정된 임베드 URL이면 그대로 반환
        if (url.includes('/embed/')) {
            return url;
        }
        
        // URL에서 비디오 ID 추출
        let videoId = '';
        
        // shorts URL 처리
        if (url.includes('/shorts/')) {
            videoId = url.split('/shorts/')[1];
            // URL 매개변수 제거
            if (videoId.includes('?')) {
                videoId = videoId.split('?')[0];
            }
        } 
        // 일반 YouTube URL 처리
        else if (url.includes('watch?v=')) {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            videoId = urlParams.get('v');
        }
        // 짧은 youtu.be URL 처리
        else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
            if (videoId.includes('?')) {
                videoId = videoId.split('?')[0];
            }
        }
        
        // 비디오 ID가 추출되었으면 임베드 URL 생성
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
        
        // 추출 실패 시 원래 URL 반환
        return url;
    } catch (error) {
        return url; // 오류 발생 시 원래 URL 반환
    }
}

// 모달 기능 초기화 함수
function initializeModals() {
    try {
        // 모든 인테리어 요소 선택
        const interiorElements = document.querySelectorAll('.interior-element');
        
        // 모달 열기 이벤트 추가
        interiorElements.forEach((element, index) => {
            element.addEventListener('click', function(e) {
                const modal = this.parentElement.querySelector('.interior-element-modal');
                if (modal) {
                    modal.style.display = 'block';
                    
                    // 모달 배경 추가
                    addModalBackground();
                    
                    // 스크롤 방지
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // 모달 닫기 버튼에 이벤트 추가
        const closeButtons = document.querySelectorAll('.modal-header img');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // 이벤트 버블링 방지
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';

                    // 모달 배경 제거
                    removeModalBackground();
                    
                    // 스크롤 복원
                    document.body.style.overflow = '';
                }
            });
        });
    } catch (error) { }
}

// 모달 배경 추가 함수
function addModalBackground() {
    // 이미 배경이 있는지 확인
    if (!document.querySelector('.modal-background')) {
        const background = document.createElement('div');
        background.className = 'modal-background';
        
        document.body.appendChild(background);
        
        // 배경 클릭 시 모달 닫기
        background.addEventListener('click', function() {
            const openModals = document.querySelectorAll('.modal[style="display: block;"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
            removeModalBackground();
            
            // 스크롤 복원
            document.body.style.overflow = '';
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

// 인테리어 탭 전환 및 초기화 기능
(function() {
    // 여러 이벤트에서 초기화 시도
    window.addEventListener('load', initializeInteriorPage);
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initializeInteriorPage, 200);
    });
    
    // 백업으로 약간의 지연 후 한 번 더 실행
    setTimeout(initializeInteriorPage, 500);
    setTimeout(initializeInteriorPage, 1000);
    
    // 이미 초기화했는지 추적
    let initialized = false;
    
    function initializeInteriorPage() {
        // 이미 초기화되었으면 중복 실행 방지
        if (initialized) return;
        
        console.log('인테리어 페이지 초기화 시도...');
        
        // 탭 버튼 및 콘텐츠 요소 선택
        const videoTab = document.querySelector('#interiorNavSectionInner .interior-nav-content .video-interior-nav');
        const videoContent = document.querySelector('#interiorListSectionInner .video-interior-list');
        
        // 필요한 요소가 모두 존재하는지 확인
        if (!videoTab || !videoContent) {
            console.log('인테리어 페이지 요소를 찾을 수 없음. 나중에 다시 시도합니다.');
            return;
        }
        
        console.log('인테리어 페이지 요소 발견. 초기화 진행 중...');
        
        // 초기 상태 설정 (비디오 탭 활성화)
        videoTab.classList.add('active');
        videoContent.style.display = 'block';
        
        // 비디오 탭 클릭 이벤트
        videoTab.addEventListener('click', function() {
            console.log('비디오 탭 클릭됨');
            if (videoTab.classList.contains('active')) return;
            
            videoTab.classList.add('active');
            videoContent.style.display = 'block';
            
            console.log('비디오 인테리어 탭 활성화됨');
        });
        
        // 이전 모달 이벤트 리스너 재설정 (중복 방지용)
        resetModalListeners();
        
        // 초기화 완료 표시
        initialized = true;
        console.log('인테리어 페이지 초기화 완료!');
    }
    
    // 모달 이벤트 리스너 재설정 (중복 방지)
    function resetModalListeners() {
        const interiorElements = document.querySelectorAll('.interior-element');
        
        interiorElements.forEach(element => {
            // 기존 이벤트 제거 (실제로는 복제해서 교체)
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // 새 이벤트 추가
            newElement.addEventListener('click', function() {
                const modal = this.parentElement.querySelector('.interior-element-modal');
                if (modal) {
                    modal.style.display = 'block';
                    addModalBackground();
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // 모달 닫기 버튼도 재설정
        const closeButtons = document.querySelectorAll('.modal-header img');
        closeButtons.forEach(button => {
            // 기존 이벤트 제거 (실제로는 복제해서 교체)
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // 새 이벤트 추가
            newButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                    removeModalBackground();
                    document.body.style.overflow = '';
                }
            });
        });
    }
})();