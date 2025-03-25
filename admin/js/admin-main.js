// 로컬 대시보드 업데이트 (UI에 표시된 상태만 기준으로 업데이트)
function updateLocalDashboard() {
    // 현재 화면에 표시된 모든 상태값 수집
    const statusCells = document.querySelectorAll('.counsel-status-value');
    
    // 상태별 카운트 초기화
    let totalCount = statusCells.length;
    let newCount = 0; // 처리접수중
    let inCoordinationCount = 0; // 상담조율중
    let inProgressCount = 0; // 용역수행중
    let inRevisionCount = 0; // 수정보완중
    let completedCount = 0; // 용역완료
    let canceledCount = 0; // 취소완료
    
    // 각 상태값 계산
    statusCells.forEach(cell => {
        const status = cell.textContent;
        
        switch (status) {
            case '처리접수중':
                newCount++;
                break;
            case '상담조율중':
                inCoordinationCount++;
                break;
            case '용역수행중':
                inProgressCount++;
                break;
            case '수정보완중':
                inRevisionCount++;
                break;
            case '용역완료':
                completedCount++;
                break;
            case '취소완료':
                canceledCount++;
                break;
        }
    });
    
    // 대시보드 UI 업데이트
    document.getElementById('totalCounsels').textContent = totalCount;
    document.getElementById('newCounsels').textContent = newCount;
    document.getElementById('inCoordinationCounsels').textContent = inCoordinationCount;
    document.getElementById('inProgressCounsels').textContent = inProgressCount;
    document.getElementById('inRevisionCounsels').textContent = inRevisionCount;
    document.getElementById('completedCounsels').textContent = completedCount;
    document.getElementById('canceledCounsels').textContent = canceledCount;
}

// 상담 데이터 검색 함수
function searchCounselData() {
    const searchInput = document.getElementById('adminSearch');
    if (!searchInput) return;
    
    const searchText = searchInput.value.trim().toLowerCase();
    
    if (searchText === '') {
        // 검색어가 없으면 모든 행 표시
        const allRows = document.querySelectorAll('#adminCounselTable table tr');
        for (let i = 1; i < allRows.length; i++) { // 헤더 제외
            allRows[i].style.display = '';
        }
        return;
    }
    
    // 모든 행을 순회하며 검색
    const allRows = document.querySelectorAll('#adminCounselTable table tr');
    for (let i = 1; i < allRows.length; i++) { // 헤더 제외
        const row = allRows[i];
        const cells = row.querySelectorAll('td');
        let found = false;
        
        // 각 셀의 내용 확인
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(searchText)) {
                found = true;
                break;
            }
        }
        
        // 검색어가 포함된 행만 표시
        row.style.display = found ? '' : 'none';
    }
}

// 향상된 로딩 표시 함수
function showLoading(show) {
    // 기존 로딩 표시가 있으면 제거
    const existingLoader = document.getElementById('adminLoader');
    if (existingLoader) {
        existingLoader.remove();
    }
    
    if (show) {
        // 로딩 UI 생성
        const loader = document.createElement('div');
        loader.id = 'adminLoader';
        loader.style.position = 'fixed';
        loader.style.top = '0';
        loader.style.left = '0';
        loader.style.width = '100%';
        loader.style.height = '100%';
        loader.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        loader.style.display = 'flex';
        loader.style.justifyContent = 'center';
        loader.style.alignItems = 'center';
        loader.style.zIndex = '9999';
        
        const contentDiv = document.createElement('div');
        contentDiv.style.backgroundColor = 'white';
        contentDiv.style.padding = '25px';
        contentDiv.style.borderRadius = '8px';
        contentDiv.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        contentDiv.style.textAlign = 'center';
        
        const spinnerDiv = document.createElement('div');
        spinnerDiv.style.border = '5px solid #f3f3f3';
        spinnerDiv.style.borderTop = '5px solid #0057ff';
        spinnerDiv.style.borderRadius = '50%';
        spinnerDiv.style.width = '50px';
        spinnerDiv.style.height = '50px';
        spinnerDiv.style.margin = '0 auto 15px';
        
        // 애니메이션 적용
        spinnerDiv.style.animation = 'spin 1s linear infinite';
        
        const textP = document.createElement('p');
        textP.textContent = '로딩 중...';
        textP.style.margin = '0';
        textP.style.fontSize = '16px';
        textP.style.fontWeight = '500';
        textP.style.color = '#333';
        
        contentDiv.appendChild(spinnerDiv);
        contentDiv.appendChild(textP);
        loader.appendChild(contentDiv);
        document.body.appendChild(loader);
        
        // 키프레임 애니메이션 추가
        if (!document.getElementById('spin-animation')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'spin-animation';
            styleEl.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styleEl);
        }
    }
}

// 에러 메시지 표시 함수
function showError(message) {
    alert(message);
}

// 알림 메시지 표시 함수
function showNotification(message) {
    // 기존 알림이 있으면 제거
    const existingNotification = document.getElementById('adminNotification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 새 알림 생성
    const notification = document.createElement('div');
    notification.id = 'adminNotification';
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
    `;
    
    // 알림 표시
    document.body.appendChild(notification);
    
    // 3초 후 자동으로 사라짐
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}// 상수 정의
const SESSION_KEY = 'adminSessionData';
const SESSION_DURATION = 60 * 60 * 1000; // 1시간 (밀리초 단위)
const LOGIN_URL = '../admin/login.html';
// Google Apps Script 웹 앱 URL 설정 (배포 후 URL로 변경 필요)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzthfv3hP8P6GG0Ji9VR7mqHlmf80TcrFXYALVbtzW_065Ct8ofqTERq7oul3ACAfxm/exec";

// 페이지 초기화 상태 관리 변수
let isInitialized = false;

// 세션 체크 함수
function checkAdminSession() {
    // 세션 데이터 가져오기
    const sessionDataJson = localStorage.getItem(SESSION_KEY);
    
    if (!sessionDataJson) {
        // 세션 데이터가 없음 - 로그인 페이지로 리다이렉트
        redirectToLogin('세션이 존재하지 않습니다. 로그인이 필요합니다.');
        return false;
    }
    
    try {
        const sessionData = JSON.parse(sessionDataJson);
        const now = new Date().getTime();
        
        // 세션 만료 확인
        if (sessionData.expiryTime <= now) {
            // 세션 만료 - 세션 데이터 삭제 후 로그인 페이지로 리다이렉트
            localStorage.removeItem(SESSION_KEY);
            redirectToLogin('세션이 만료되었습니다. 다시 로그인해주세요.');
            return false;
        }
        
        // 세션 유효 시간 갱신
        updateSessionExpiry();
        return true;
    } catch (e) {
        // JSON 파싱 오류
        localStorage.removeItem(SESSION_KEY);
        redirectToLogin('세션 데이터 오류. 다시 로그인해주세요.');
        return false;
    }
}

// 세션 만료 시간 업데이트
function updateSessionExpiry() {
    const sessionDataJson = localStorage.getItem(SESSION_KEY);
    if (!sessionDataJson) return;
    
    try {
        const sessionData = JSON.parse(sessionDataJson);
        const now = new Date().getTime();
        
        // 만료 시간 업데이트
        sessionData.expiryTime = now + SESSION_DURATION;
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (e) {
        console.error('세션 업데이트 오류:', e);
    }
}

// 로그인 페이지로 리다이렉트
function redirectToLogin(message) {
    // 선택적으로 메시지를 URL 파라미터로 전달
    if (message) {
        localStorage.setItem('loginMessage', message);
    }
    
    window.location.href = LOGIN_URL;
}

// 로그아웃 함수
function adminLogout() {
    localStorage.removeItem(SESSION_KEY);
    redirectToLogin('로그아웃 되었습니다.');
}

// 페이지 로드 시 세션 체크
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdminSession()) {
        return; // 세션 체크 실패 시 함수 종료
    }
    
    // 로그아웃 버튼 추가
    addLogoutButton();
    
    // 페이지 초기화 (한 번만 실행되도록)
    if (!isInitialized) {
        isInitialized = true;
        initializeAdminPage();
    }
});

// 페이지 초기화 함수
function initializeAdminPage() {
    fetchCounselData();
    setupEventListeners();
    setupDashboard();
}

// 로그아웃 버튼 추가
function addLogoutButton() {
    const headerDiv = document.getElementById('adminHeaderInner');
    if (!headerDiv) return;
    
    // 기존 버튼이 있는지 확인
    if (document.getElementById('adminLogoutButton')) return;
    
    // 로그아웃 버튼 생성
    const logoutButton = document.createElement('button');
    logoutButton.id = 'adminLogoutButton';
    logoutButton.className = 'admin-button logout-button';
    logoutButton.textContent = '로그아웃';
    
    // 검색 컨테이너에 버튼 추가
    const searchContainer = headerDiv.querySelector('#adminHeaderInner');
    if (searchContainer) {
        searchContainer.appendChild(logoutButton);
    } else {
        headerDiv.appendChild(logoutButton);
    }
    
    // 버튼 클릭 이벤트 추가
    logoutButton.addEventListener('click', adminLogout);
}

// 상담 데이터 가져오기
function fetchCounselData() {
    // 로딩 표시
    showLoading(true);
    
    // Google Apps Script 웹 앱 호출
    fetch(`${GOOGLE_SCRIPT_URL}?action=getFormData`)
        .then(response => {
            // 응답 확인 로그
            console.log('Fetch response status:', response.status);
            return response.json();
        })
        .then(data => {
            // 로딩 표시 제거
            showLoading(false);
            
            if (data.result === 'success') {
                displayCounselData(data.data);
                updateDashboard(data.data);
            } else {
                showError('데이터를 가져오는 데 실패했습니다: ' + (data.message || '알 수 없는 오류'));
            }
        })
        .catch(error => {
            showLoading(false);
            console.error('Fetch error details:', error);
            
            // 서버 응답 오류인지 네트워크 오류인지 구분하여 메시지 표시
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                showError('서버 연결에 실패했습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.');
            } else {
                showError('데이터 요청 중 오류가 발생했습니다: ' + error.toString());
            }
        });
}

// 날짜 문자열 포맷 변환 함수 
function formatDateString(dateStr) {
    if (!dateStr) return '';
    
    // ISO 날짜 문자열인지 확인 (예: 2025-03-25T08:33:41.000Z)
    if (typeof dateStr === 'string' && dateStr.includes('T') && dateStr.includes('Z')) {
        try {
            const date = new Date(dateStr);
            
            // 한국 시간대로 변환 (UTC+9)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            
            // UTC 시간에 9시간 추가 (한국 시간)
            const hours = String((date.getUTCHours() + 9) % 24).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } catch (e) {
            console.error('날짜 변환 오류:', e);
            return dateStr; // 변환 실패 시 원본 반환
        }
    }
    
    // ISO 형식이 아니면 그대로 반환
    return dateStr;
}

// HTML 수정 - 취소 처리 버튼 추가
function addCancelButton() {
    const headerDiv = document.getElementById('adminHeaderInner');
    if (!headerDiv) return;
    
    // 기존 버튼이 있는지 확인
    if (document.getElementById('batchCancelButton')) return;
    
    // 버튼 생성 및 추가
    const cancelButton = document.createElement('button');
    cancelButton.id = 'batchCancelButton';
    cancelButton.className = 'admin-button batch-cancel-button';
    cancelButton.innerHTML = '<i class="fas fa-times-circle"></i> 선택한 상담 취소 처리하기';
    
    // 검색 컨테이너 다음에 버튼 삽입
    headerDiv.appendChild(cancelButton);
    
    // 버튼 클릭 이벤트 추가
    cancelButton.addEventListener('click', handleBatchCancel);
}

// 테이블 헤더에 체크박스 열 추가
function modifyTableHeader() {
    const table = document.querySelector('#adminCounselTable table');
    if (!table || !table.rows || table.rows.length === 0) return;
    
    const headerRow = table.rows[0];
    
    // 이미 체크박스 열이 있는지 확인
    if (headerRow.cells[0].classList.contains('checkbox-column')) return;
    
    // 체크박스 열 추가
    const checkboxCell = document.createElement('th');
    checkboxCell.className = 'checkbox-column';
    checkboxCell.style.width = '40px';
    
    // 전체 선택 체크박스 생성
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'selectAllCheckbox';
    selectAllCheckbox.className = 'select-all-checkbox';
    
    // 전체 선택 체크박스 이벤트 리스너
    selectAllCheckbox.addEventListener('change', function() {
        const isChecked = this.checked;
        const checkboxes = document.querySelectorAll('.row-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });
    
    checkboxCell.appendChild(selectAllCheckbox);
    
    // 헤더 첫 번째 위치에 삽입
    headerRow.insertBefore(checkboxCell, headerRow.firstChild);
}

// 상담 데이터 표시 함수 수정
function displayCounselData(data) {
    // 테이블 요소
    const table = document.querySelector('#adminCounselTable table');
    if (!table) return;
    
    // 테이블 헤더에 체크박스 열 추가
    modifyTableHeader();
    
    // 취소 처리 버튼 추가
    addCancelButton();
    
    // 기존 데이터 행 제거 (헤더 제외)
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    
    // 데이터 역순 정렬 (최신 항목이 먼저 오도록)
    // 헤더(인덱스 0)는 제외하고 데이터 행만 역순 정렬
    const sortedData = [data[0]].concat(data.slice(1).reverse());
    
    // 첫 번째 행은 헤더이므로 인덱스 1부터 시작
    for (let i = 1; i < sortedData.length; i++) {
        const rowData = sortedData[i];
        
        // 새 행 추가
        const newRow = table.insertRow();
        
        // 체크박스 셀 추가 (맨 앞)
        const checkboxCell = newRow.insertCell(0);
        checkboxCell.className = 'checkbox-column';
        
        // 체크박스 생성
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'row-checkbox';
        checkbox.setAttribute('data-row-id', rowData[0]);
        
        // 취소완료 상태인 경우 체크박스 비활성화
        if (rowData[20] === '취소완료') {
            checkbox.disabled = true;
            checkbox.title = '이미 취소 처리된 상담입니다';
        }
        
        checkboxCell.appendChild(checkbox);
        
        // 처리 상태 셀을 두 번째 열에 추가 (인덱스 1)
        const statusCell = newRow.insertCell(1);
        statusCell.className = 'counsel-status';
        
        // 처리 상태 표시 - U열(인덱스 20)의 상태값 사용
        const statusValue = rowData[20] || '처리접수중';
        statusCell.innerHTML = `
            <p id="counsel-status-now-${rowData[0]}" class="counsel-status-value" data-status="${statusValue}">${statusValue}</p>
            <div class="status-buttons" id="status-buttons-${rowData[0]}">
                ${getStatusButtons(statusValue, rowData[0])}
            </div>
        `;
        
        // 나머지 셀들 추가 (U열은 제외하고 원래 순서대로)
        for (let j = 0; j < 20; j++) {
            const cell = newRow.insertCell(j + 2); // 인덱스 2부터 시작 (체크박스가 0, 처리 상태가 1)
            
            // 파일 첨부 정보 (G열, 원래 인덱스 6 -> 현재 인덱스 8)
            if (j === 6) {
                const fileLinks = rowData[j] ? rowData[j].split(' | ') : [];
                
                if (fileLinks.length > 0 && fileLinks[0] !== '없음') {
                    let linkHtml = '';
                    for (let k = 0; k < fileLinks.length; k++) {
                        linkHtml += `<a href="${fileLinks[k]}" target="_blank">첨부파일 ${k+1}</a><br>`;
                    }
                    cell.innerHTML = linkHtml;
                } else {
                    cell.textContent = '첨부파일 없음';
                }
            }
            // 날짜 필드 포맷 변환 (B열: 상담 제출 시간, Q열: 희망 마감기한)
            else if (j === 1 || j === 16) {
                cell.textContent = formatDateString(rowData[j]);
            }
            // 일반 텍스트 셀
            else {
                cell.textContent = rowData[j] || '';
            }
            
            // 각 열에 CSS 클래스 추가
            switch (j) {
                case 0: cell.className = 'counsel-lastRow'; break;
                case 1: cell.className = 'counsel-formattedTime'; break;
                case 2: cell.className = 'counsel-serviceType'; break;
                case 3: cell.className = 'counsel-interiorOptions'; break;
                case 4: cell.className = 'counsel-hasPlan'; break;
                case 5: cell.className = 'counsel-spaceSize'; break;
                case 6: cell.className = 'counsel-fileAttachmentInfo'; break;
                case 7: cell.className = 'counsel-identityOptions'; break;
                case 8: cell.className = 'counsel-offlineAdOptions'; break;
                case 9: cell.className = 'counsel-onlineAdOptions'; break;
                case 10: cell.className = 'counsel-websiteOptions'; break;
                case 11: cell.className = 'counsel-name'; break;
                case 12: cell.className = 'counsel-phone'; break;
                case 13: cell.className = 'counsel-email'; break;
                case 14: cell.className = 'counsel-serviceArea'; break;
                case 15: cell.className = 'counsel-serviceField'; break;
                case 16: cell.className = 'counsel-deadline'; break;
                case 17: cell.className = 'counsel-sourceChannel'; break;
                case 18: cell.className = 'counsel-privacyAgreed'; break;
                case 19: cell.className = 'counsel-marketingAgreed'; break;
            }
        }
    }
}

// 선택한 상담 일괄 취소 처리 함수
function handleBatchCancel() {
    // 선택된 체크박스 가져오기
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked:not(:disabled)');
    
    // 선택된 체크박스가 없으면 알림
    if (selectedCheckboxes.length === 0) {
        alert('취소 처리할 상담을 선택해주세요.');
        return;
    }
    
    // 확인 메시지
    const isConfirmed = confirm('정말로 취소하겠습니까? 취소 후에는 상태 변경이 불가능합니다.');
    if (!isConfirmed) return;
    
    // 로딩 표시
    showLoading(true);
    
    // 선택된 각 행 ID 가져오기
    const rowIds = Array.from(selectedCheckboxes).map(checkbox => checkbox.getAttribute('data-row-id'));
    
    // 각 행을 취소 상태로 업데이트할 프로미스 배열
    const updatePromises = rowIds.map(rowId => 
        updateCounselStatus(rowId, '취소완료', true)
    );
    
    // 모든 업데이트가 완료되면
    Promise.all(updatePromises)
        .then(() => {
            showLoading(false);
            showNotification(`${rowIds.length}개의 상담이 취소 처리되었습니다.`);
            
            // 체크박스 초기화
            document.getElementById('selectAllCheckbox').checked = false;
            
            // 대시보드 업데이트
            updateLocalDashboard();
        })
        .catch(error => {
            showLoading(false);
            showError('일부 상담 취소 처리 중 오류가 발생했습니다: ' + error.toString());
        });
}


// 상태에 따른 버튼 생성 함수
function getStatusButtons(currentStatus, rowId) {
    let buttons = '';
    
    // 취소완료 상태인 경우 상태 변경 버튼 표시하지 않음
    if (currentStatus === '취소완료') {
        return `<p class="status-canceled-message">취소 처리되어 상태 변경이 불가능합니다.</p>`;
    }
    
    switch (currentStatus) {
        case '처리접수중':
            // 처리접수중 -> 상담조율중
            buttons = `
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="상담조율중">
                    상담조율중으로 변경
                </button>
            `;
            break;
        case '상담조율중':
            // 상담조율중 -> 처리접수중 or 용역수행중
            buttons = `
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="처리접수중">
                    처리접수중으로 변경
                </button>
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="용역수행중">
                    용역수행중으로 변경
                </button>
            `;
            break;
        case '용역수행중':
            // 용역수행중 -> 상담조율중 or
            buttons = `
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="상담조율중">
                    상담조율중으로 변경
                </button>
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="수정보완중">
                    수정보완중으로 변경
                </button>
            `;
            break;
        case '수정보완중':
            // 수정보완중 -> 용역수행중 or 용역완료
            buttons = `
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="용역수행중">
                    용역수행중으로 변경
                </button>
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="용역완료">
                    용역완료로 변경
                </button>
            `;
            break;
        case '용역완료':
            // 용역완료 -> 수정보완중
            buttons = `
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="수정보완중">
                    수정보완중으로 변경
                </button>
            `;
            break;
        default:
            // 다른 모든 상태에서는 취소완료 버튼 추가
            buttons = `
                <button class="status-change-button" data-row-id="${rowId}" data-new-status="취소완료">
                    취소완료로 변경
                </button>
            `;
    }
    
    return buttons;
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 이벤트 위임을 사용하여 동적으로 생성된 요소에 대한 이벤트 처리
    document.addEventListener('click', function(event) {
        // 상태 변경 버튼 클릭 (새로운 방식)
        if (event.target.classList.contains('status-change-button')) {
            const rowId = event.target.getAttribute('data-row-id');
            const newStatus = event.target.getAttribute('data-new-status');
            
            if (rowId && newStatus) {
                updateCounselStatus(rowId, newStatus);
            }
        }
    });
    
    // 엔터 키로 검색 기능 추가
    document.addEventListener('keyup', function(event) {
        if (event.key === 'Enter' && document.activeElement.id === 'adminSearch') {
            searchCounselData();
        }
    });
    
    // 상단 검색 버튼 클릭
    const searchButton = document.getElementById('adminSearchButton');
    if (searchButton) {
        searchButton.addEventListener('click', searchCounselData);
    }
    
    // 새로고침 버튼 클릭
    const refreshButton = document.getElementById('adminRefreshButton');
    if (refreshButton) {
        refreshButton.addEventListener('click', function(e) {
            e.preventDefault();
            fetchCounselData();
        });
    }
}

// 상태 업데이트 함수 (서버에도 저장)
function updateCounselStatus(rowId, newStatus, isBatchUpdate = false) {
    return new Promise((resolve, reject) => {
        // 일괄 처리가 아닐 경우에만 로딩 표시
        if (!isBatchUpdate) {
            showLoading(true);
        }
        
        // 네트워크 요청 시작 로깅
        console.log(`상태 업데이트 요청: ${rowId} => ${newStatus}`);
        
        // Google Apps Script에 상태 업데이트 요청
        fetch(`${GOOGLE_SCRIPT_URL}?action=updateStatus&rowId=${rowId}&status=${encodeURIComponent(newStatus)}`)
            .then(response => {
                console.log('상태 업데이트 응답 상태:', response.status);
                return response.json();
            })
            .then(data => {
                if (!isBatchUpdate) {
                    showLoading(false);
                }
                
                if (data.result === 'success') {
                    // UI 업데이트
                    const statusCell = document.querySelector(`.counsel-status #counsel-status-now-${rowId}`);
                    if (statusCell) {
                        statusCell.textContent = newStatus;
                        statusCell.setAttribute('data-status', newStatus);
                    }
                    
                    // 상태 버튼 업데이트
                    const buttonsContainer = document.querySelector(`#status-buttons-${rowId}`);
                    if (buttonsContainer) {
                        buttonsContainer.innerHTML = getStatusButtons(newStatus, rowId);
                    }
                    
                    // 취소완료 상태로 변경된 경우 체크박스 비활성화
                    if (newStatus === '취소완료') {
                        const checkbox = document.querySelector(`.row-checkbox[data-row-id="${rowId}"]`);
                        if (checkbox) {
                            checkbox.checked = false;
                            checkbox.disabled = true;
                            checkbox.title = '이미 취소 처리된 상담입니다';
                        }
                    }
                    
                    // 일괄 처리가 아닐 경우에만 성공 메시지와 대시보드 업데이트
                    if (!isBatchUpdate) {
                        showNotification(`상담 #${rowId}이(가) '${newStatus}' 상태로 변경되었습니다.`);
                        updateLocalDashboard();
                    }
                    
                    resolve();
                } else {
                    console.error('상태 업데이트 실패:', data);
                    
                    if (!isBatchUpdate) {
                        showError('상태 업데이트 실패: ' + (data.message || '알 수 없는 오류'));
                    }
                    reject(new Error(data.message || '알 수 없는 오류'));
                }
            })
            .catch(error => {
                console.error('상태 업데이트 오류:', error);
                
                if (!isBatchUpdate) {
                    showLoading(false);
                    showError('상태 업데이트 중 오류 발생: ' + error.toString());
                }
                reject(error);
            });
    });
}

// 대시보드 설정
function setupDashboard() {
    // 대시보드 UI 요소 생성
    const dashboardContainer = document.getElementById('adminDashboard');
    if (!dashboardContainer) return;
    
    // 대시보드 내용 초기화
    dashboardContainer.innerHTML = '';
    
    // 대시보드 항목 추가 - 7개 그리드로 변경
    const dashboardItems = [
        { id: 'totalCounsels', title: '전체 상담 건수', value: '0', gridClass: 'grid20' },
        { id: 'newCounsels', title: '처리접수중', value: '0', gridClass: 'grid20' },
        { id: 'inCoordinationCounsels', title: '상담조율중', value: '0', gridClass: 'grid20' },
        { id: 'inProgressCounsels', title: '용역수행중', value: '0', gridClass: 'grid20' },
        { id: 'inRevisionCounsels', title: '수정보완중', value: '0', gridClass: 'grid20' },
        { id: 'completedCounsels', title: '용역완료', value: '0', gridClass: 'grid20' },
        { id: 'canceledCounsels', title: '취소완료', value: '0', gridClass: 'grid20' }
    ];
    
    dashboardItems.forEach(item => {
        const dashboardItem = document.createElement('div');
        dashboardItem.className = item.gridClass;
        dashboardItem.innerHTML = `
            <div class="dashboard-item">
                <h3>${item.title}</h3>
                <p id="${item.id}" class="dashboard-value">${item.value}</p>
            </div>
        `;
        dashboardContainer.appendChild(dashboardItem);
    });
}

// 대시보드 데이터 업데이트
function updateDashboard(data) {
    if (!data || data.length <= 1) return; // 헤더만 있는 경우 건너뛰기
    
    // 상태별 카운트 계산
    let totalCount = data.length - 1; // 헤더 제외
    let newCount = 0; // 처리접수중
    let inCoordinationCount = 0; // 상담조율중
    let inProgressCount = 0; // 용역수행중
    let inRevisionCount = 0; // 수정보완중
    let completedCount = 0; // 용역완료
    let canceledCount = 0; // 취소완료
    
    // 각 행 반복
    for (let i = 1; i < data.length; i++) {
        const status = data[i][20] || '처리접수중'; // 20번 인덱스 = 처리 상태 열
        
        switch (status) {
            case '처리접수중':
                newCount++;
                break;
            case '상담조율중':
                inCoordinationCount++;
                break;
            case '용역수행중':
                inProgressCount++;
                break;
            case '수정보완중':
                inRevisionCount++;
                break;
            case '용역완료':
                completedCount++;
                break;
            case '취소완료':
                canceledCount++;
                break;
        }
    }
    
    // 대시보드 UI 업데이트
    document.getElementById('totalCounsels').textContent = totalCount;
    document.getElementById('newCounsels').textContent = newCount;
    document.getElementById('inCoordinationCounsels').textContent = inCoordinationCount;
    document.getElementById('inProgressCounsels').textContent = inProgressCount;
    document.getElementById('inRevisionCounsels').textContent = inRevisionCount;
    document.getElementById('completedCounsels').textContent = completedCount;
    document.getElementById('canceledCounsels').textContent = canceledCount;
}