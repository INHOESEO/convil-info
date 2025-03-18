// 관리자 페이지 메인 스크립트

// Google Apps Script 웹 앱 URL 설정 (배포 후 URL로 변경 필요)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwUs0kT6UKVFy8yBPhFQEpgDTalSYyPsvgi_FZ-USuw5pUCZ-fZoAhwmWZU2VkuwUcJ/exec";

// 페이지 로드 시 데이터 가져오기
document.addEventListener('DOMContentLoaded', function() {
    fetchCounselData();
    setupEventListeners();
    setupDashboard();
});

// 상담 데이터 가져오기
function fetchCounselData() {
    // 로딩 표시
    showLoading(true);
    
    // Google Apps Script 웹 앱 호출
    fetch(`${GOOGLE_SCRIPT_URL}?action=getFormData`)
        .then(response => response.json())
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
            showError('데이터 요청 중 오류가 발생했습니다: ' + error.toString());
        });
}

// 상담 데이터 표시 함수
function displayCounselData(data) {
    // 테이블 요소
    const table = document.querySelector('#adminCounselTable table');
    if (!table) return;
    
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
        
        // 각 셀에 데이터 추가
        for (let j = 0; j < rowData.length; j++) {
            const cell = newRow.insertCell();
            
            // 특별한 형식이 필요한 열 처리
            if (j === 20) { // 처리 상태 열 (T열, 0-based 인덱스로 20)
                cell.className = 'counsel-status';
                
                // 처리 상태 표시 및 변경 UI
                cell.innerHTML = `
                    <p id="counsel-status-now-${rowData[0]}" class="counsel-status-value">${rowData[j] || '처리접수중'}</p>
                    <select class="counsel-status-select" data-row-id="${rowData[0]}">
                        <option value="처리접수중">처리접수중</option>
                        <option value="상담조율중">상담조율중</option>
                        <option value="용역수행중">용역수행중</option>
                        <option value="수정보완중">수정보완중</option>
                        <option value="용역완료">용역완료</option>
                        <option value="취소완료">취소완료</option>
                    </select>
                    <button class="counsel-status-change" data-row-id="${rowData[0]}">변경</button>
                    <button class="counsel-status-save" data-row-id="${rowData[0]}" style="display:none;">저장</button>
                `;
                
                // 기존 상태값으로 선택 상자 초기화
                const select = cell.querySelector('select');
                select.value = rowData[j] || '처리접수중';
            } 
            // 파일 첨부 정보 (G열, 0-based 인덱스로 6)
            else if (j === 6) {
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

// 이벤트 리스너 설정
function setupEventListeners() {
    // 이벤트 위임을 사용하여 동적으로 생성된 요소에 대한 이벤트 처리
    document.addEventListener('click', function(event) {
        // 상태 변경 버튼 클릭
        if (event.target.classList.contains('counsel-status-change')) {
            const rowId = event.target.getAttribute('data-row-id');
            const statusCell = event.target.closest('.counsel-status');
            
            // 현재 상태 표시 숨기기
            const currentStatus = statusCell.querySelector(`#counsel-status-now-${rowId}`);
            if (currentStatus) currentStatus.style.display = 'none';
            
            // 선택 상자 표시
            const select = statusCell.querySelector('select');
            if (select) select.style.display = 'inline-block';
            
            // 변경 버튼 숨기기
            event.target.style.display = 'none';
            
            // 저장 버튼 표시
            const saveButton = statusCell.querySelector(`.counsel-status-save[data-row-id="${rowId}"]`);
            if (saveButton) saveButton.style.display = 'inline-block';
        }
        
        // 상태 저장 버튼 클릭
        if (event.target.classList.contains('counsel-status-save')) {
            const rowId = event.target.getAttribute('data-row-id');
            const statusCell = event.target.closest('.counsel-status');
            const select = statusCell.querySelector('select');
            
            if (select) {
                const newStatus = select.value;
                
                // 로딩 표시
                showLoading(true);
                
                // Google Apps Script에 상태 업데이트 요청
                fetch(`${GOOGLE_SCRIPT_URL}?action=updateStatus&rowId=${rowId}&status=${encodeURIComponent(newStatus)}`)
                    .then(response => response.json())
                    .then(data => {
                        showLoading(false);
                        
                        if (data.result === 'success') {
                            // UI 업데이트
                            const currentStatus = statusCell.querySelector(`#counsel-status-now-${rowId}`);
                            if (currentStatus) {
                                currentStatus.textContent = newStatus;
                                currentStatus.style.display = 'block';
                            }
                            
                            // 선택 상자 숨기기
                            select.style.display = 'none';
                            
                            // 저장 버튼 숨기기
                            event.target.style.display = 'none';
                            
                            // 변경 버튼 표시
                            const changeButton = statusCell.querySelector(`.counsel-status-change[data-row-id="${rowId}"]`);
                            if (changeButton) changeButton.style.display = 'inline-block';
                            
                            // 성공 메시지
                            showNotification('상태가 업데이트되었습니다.');
                            
                            // 대시보드 업데이트
                            fetchCounselData();
                        } else {
                            showError('상태 업데이트 실패: ' + (data.message || '알 수 없는 오류'));
                        }
                    })
                    .catch(error => {
                        showLoading(false);
                        showError('상태 업데이트 중 오류 발생: ' + error.toString());
                    });
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
        refreshButton.addEventListener('click', fetchCounselData);
    }
}

// 대시보드 설정
function setupDashboard() {
    // 대시보드 UI 요소 생성
    const dashboardContainer = document.getElementById('adminDashboard');
    if (!dashboardContainer) return;
    
    // 대시보드 내용 초기화
    dashboardContainer.innerHTML = '';
    
    // 대시보드 항목 추가
    const dashboardItems = [
        { id: 'totalCounsels', title: '전체 상담 건수', value: '0', gridClass: 'grid20' },
        { id: 'newCounsels', title: '신규 접수(미처리)', value: '0', gridClass: 'grid20' },
        { id: 'inProgressCounsels', title: '진행중', value: '0', gridClass: 'grid20' },
        { id: 'completedCounsels', title: '완료', value: '0', gridClass: 'grid20' },
        { id: 'canceledCounsels', title: '취소', value: '0', gridClass: 'grid20' }
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
    let newCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let canceledCount = 0;
    
    // 각 행 반복
    for (let i = 1; i < data.length; i++) {
        const status = data[i][20] || '처리접수중'; // 20번 인덱스 = 처리 상태 열
        
        if (status === '처리접수중') {
            newCount++;
        } else if (status === '상담조율중' || status === '용역수행중' || status === '수정보완중') {
            inProgressCount++;
        } else if (status === '용역완료') {
            completedCount++;
        } else if (status === '취소완료') {
            canceledCount++;
        }
    }
    
    // 대시보드 UI 업데이트
    document.getElementById('totalCounsels').textContent = totalCount;
    document.getElementById('newCounsels').textContent = newCount;
    document.getElementById('inProgressCounsels').textContent = inProgressCount;
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

// 로딩 표시 함수
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
        loader.innerHTML = `
            <div class="loader-overlay">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p>로딩 중...</p>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
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
}