// 폼 데이터 수집 및 제출 코드

// Google Apps Script 웹 앱 URL 설정
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwiL9LfvmQt7ElMCIUy9WsaCqY6TjSqrbMy0tsDoRXPQCw6orqh3GTFn4T8Pv1Mg2HZ/exec";

// 즉시 실행 함수로 래핑하여 바로 실행
(function() {
  setupFormSubmissionHandler();
  
  // 페이지가 이미 로드된 경우와 아직 로드 중인 경우 모두 처리
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupFormSubmissionHandler();
  } else {
    document.addEventListener('DOMContentLoaded', setupFormSubmissionHandler);
  }
  
  // 일정 간격으로 폼 체크 (DOM이 동적으로 변경될 경우 대비)
  setTimeout(setupFormSubmissionHandler, 1000);
  
  function setupFormSubmissionHandler() {
    const form = document.querySelector('.counsel-form');
    if (form && !form.getAttribute('data-submission-handler-added')) {
      form.setAttribute('data-submission-handler-added', 'true');
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 기존의 유효성 검사 함수를 통과했다면 데이터 수집 및 제출 실행
        const isValid = validateForm();
        
        if (isValid) {
          collectAndSubmitData();
        }
      });
      
      console.log('폼 제출 핸들러가 성공적으로 설정되었습니다.');
    }
  }
})();

// 폼 데이터 수집 및 제출 함수
function collectAndSubmitData() {
  // 서비스 선택 (인테리어, 브랜딩, 컨빌 패키지)
  const serviceSelected = document.querySelector('.form-question1-value.active');
  const serviceType = serviceSelected ? 
    serviceSelected.querySelector('h3').textContent.trim() : "";
  
  // 인테리어 옵션
  const interiorOptions = Array.from(document.querySelectorAll('.form-question2-element1-value.active'))
    .map(el => el.textContent.trim())
    .join(', ');
  
  // 도면 보유 여부
  const planButton = document.querySelector('.form-question2-element2-value.active');
  const hasPlan = planButton ? planButton.textContent.trim() : "";
  
  // 평수
  const sqftInput = document.querySelector('.form-question2-element3-value');
  const sqft = sqftInput ? sqftInput.value.trim() : "";
  
  // 이름
  const name = document.querySelector('.form-question3-element1-value').value.trim();
  
  // 전화번호 (3개 입력 필드)
  const phoneBox1 = document.querySelector('input[name="numberbox1"]').value.trim();
  const phoneBox2 = document.querySelector('input[name="numberbox2"]').value.trim();
  const phoneBox3 = document.querySelector('input[name="numberbox3"]').value.trim();
  
  // 이메일 (2개 입력 필드 + 셀렉트)
  const emailBox1 = document.querySelector('input[name="emailbox1"]').value.trim();
  const emailBox2 = document.querySelector('input[name="emailbox2"]').value.trim();
  
  // 서비스 지역
  const serviceAreaSelect = document.querySelector('.form-question3-element3-value.fq3e3v-1');
  const serviceArea = serviceAreaSelect.options[serviceAreaSelect.selectedIndex].text;
  
  // 서비스 업종
  const serviceTypeInput = document.querySelector('input[name="servicebox"]').value.trim();
  
  // 희망 마감기한
  const deadlineInput = document.querySelector('.form-question3-element4-value');
  const deadline = deadlineInput.value;
  
  // 유입경로
  const channelSelect = document.querySelector('.form-question3-element5-value');
  const sourceChannel = channelSelect.options[channelSelect.selectedIndex].text;
  
  // 기타 유입경로
  const etcInput = document.querySelector('.etc-input');
  const etcDetail = etcInput && etcInput.style.display !== 'none' ? etcInput.value.trim() : "";
  
  // 브랜딩 옵션들 (아이덴티티, 오프라인 광고, 온라인 광고, 홈페이지)
  const identityOptions = Array.from(document.querySelectorAll('.form-question2-element5-value.active'))
    .map(el => el.textContent.trim())
    .join(', ');
    
  const offlineAdOptions = Array.from(document.querySelectorAll('.form-question2-element6-value.active'))
    .map(el => el.textContent.trim())
    .join(', ');
    
  const onlineAdOptions = Array.from(document.querySelectorAll('.form-question2-element7-value.active'))
    .map(el => el.textContent.trim())
    .join(', ');
    
  const websiteOptions = Array.from(document.querySelectorAll('.form-question2-element8-value.active'))
    .map(el => el.textContent.trim())
    .join(', ');
  
  // 동의 체크박스
  const privacyAgreed = document.querySelector('.personal-agree input').checked ? 
    "개인정보 처리방침 동의" : "";
  const marketingAgreed = document.querySelector('.marketing-agree input').checked ? 
    "마케팅 정보 수신 동의" : "";
  
  // 파일 관련 정보 (파일 업로드는 별도 처리 필요)
  const hasFiles = document.querySelector('.file-info').children.length > 0 ? 
    "있음" : "없음";
  
  // 콘솔에 수집된 데이터 로깅 (디버깅 용도)
  console.log('수집된 데이터:', {
    serviceType,
    interiorOptions,
    hasPlan,
    sqft,
    name,
    phone: `${phoneBox1}-${phoneBox2}-${phoneBox3}`,
    email: `${emailBox1}@${emailBox2}`,
    serviceArea,
    serviceTypeInput,
    deadline,
    sourceChannel
  });
  
  // 데이터 객체 생성
  const formData = {
    serviceType,
    interiorOptions,
    hasPlan,
    sqft,
    placeImg: hasFiles,
    identityOptions,
    offlineAdOptions,
    onlineAdOptions,
    websiteOptions,
    name,
    numberbox1: phoneBox1,
    numberbox2: phoneBox2,
    numberbox3: phoneBox3,
    emailbox1: emailBox1,
    emailbox2: emailBox2,
    serviceArea: serviceAreaSelect.value,
    servicebox: serviceTypeInput,
    deadline,
    sourceChannel: channelSelect.value,
    etcDetail,
    privacyAgreed,
    marketingAgreed
  };
  
  // 로딩 표시 추가
  const submitBtn = document.querySelector('.counsel-form-submit');
  const originalBtnText = submitBtn.value;
  submitBtn.value = "제출 중...";
  submitBtn.disabled = true;
  
  // Google Apps Script 웹 앱으로 데이터 전송
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(formData).toString()
  })
  .then(response => {
    console.log('폼 제출 완료');
    alert('문의가 성공적으로 접수되었습니다. 감사합니다.');
    
    // 폼 초기화
    document.querySelector('.counsel-form').reset();
    document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
    
    // 파일 정보 초기화 (파일 정보가 있는 경우)
    const fileInfo = document.querySelector('.file-info');
    if (fileInfo) fileInfo.innerHTML = '';
    
    const totalSize = document.querySelector('.total-size');
    if (totalSize) totalSize.textContent = '';
    
    // 버튼 상태 복원
    submitBtn.value = originalBtnText;
    submitBtn.disabled = false;
    
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  })
  .catch(error => {
    console.error('폼 제출 오류:', error);
    alert('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    
    // 버튼 상태 복원
    submitBtn.value = originalBtnText;
    submitBtn.disabled = false;
  });
}

// 유효성 검사 함수 
function validateForm() {
  // 오류 메시지 초기화
  clearErrorMessages();

  let isValid = true;

  // 1. 서비스 선택 검사
  const serviceSelected = document.querySelector('.form-question1-value.active');
  if (!serviceSelected) {
    showError('.counsel-form ul li:first-child', '서비스를 선택해주세요.');
    isValid = false;
  }

  // 2. 인테리어 옵션 검사
  const interiorOptions = document.querySelectorAll('.form-question2-element1-value.active');
  if (interiorOptions.length === 0) {
    showError('.form-question2-element.fq2e-1', '인테리어 옵션을 최소 1개 선택해주세요.');
    isValid = false;
  }

  // 3. 도면 보유 여부 검사
  const planButton = document.querySelector('.form-question2-element2-value.active');
  if (!planButton) {
    showError('.form-question2-element.fq2e-2', '도면 보유 여부를 선택해주세요.');
    isValid = false;
  }

  // 4. 평수 입력 검사
  const sqftInput = document.querySelector('.form-question2-element3-value');
  const sqftValue = sqftInput.value.trim();
  if (sqftValue === '') {
    showError('.form-question2-element.fq2e-3', '평수를 입력해주세요.');
    isValid = false;
  }

  // 5. 이름 입력 검사
  const nameInput = document.querySelector('.form-question3-element1-value');
  if (!nameInput.value.trim()) {
    showError('.form-question3-element.fq3e-1', '이름을 입력해주세요.');
    isValid = false;
  }

  // 6. 연락처 검사
  const phoneInputs = document.querySelectorAll('.form-question3-element2-value.fq3e2v-1');
  const phoneValues = Array.from(phoneInputs).map(input => input.value.trim());
  if (phoneValues.some(value => value === '')) {
    showError('.fq3e-2 ul li:first-child', '전화번호를 모두 입력해주세요.');
    isValid = false;
  }

  // 7. 이메일 검사
  const emailInputs = document.querySelectorAll('.form-question3-element2-value.fq3e2v-2');
  const emailValues = Array.from(emailInputs).map(input => input.value.trim());
  if (emailValues.some(value => value === '')) {
    showError('.fq3e-2 ul li:last-child', '이메일을 모두 입력해주세요.');
    isValid = false;
  }

  // 8. 서비스 지역 검사
  const serviceAreaSelect = document.querySelector('.form-question3-element3-value.fq3e3v-1');
  if (!serviceAreaSelect.value) {
    showError('.fq3e-3 ul li:first-child', '서비스 지역을 선택해주세요.');
    isValid = false;
  }

  // 9. 서비스 업종 검사
  const serviceTypeSelect = document.querySelector('.form-question3-element3-value.fq3e3v-2');
  const serviceTypeInput = document.querySelector('input[name="servicebox"]');
  
  // 직접 입력일 경우에만 입력값 검사
  if (serviceTypeSelect.value === 'self' && !serviceTypeInput.value.trim()) {
    showError('.fq3e-3 ul li:last-child', '서비스 업종을 입력해주세요.');
    isValid = false;
  } else if (!serviceTypeSelect.value) {
    // 아무것도 선택하지 않은 경우
    showError('.fq3e-3 ul li:last-child', '서비스 업종을 선택해주세요.');
    isValid = false;
  }

  // 10. 희망 마감기한 검사
  const deadlineInput = document.querySelector('.form-question3-element4-value');
  if (!deadlineInput.value) {
    showError('.form-question3-element.fq3e-4', '희망 마감기한을 선택해주세요.');
    isValid = false;
  }

  // 11. 유입경로 검사
  const channelSelect = document.querySelector('.form-question3-element5-value');
  const etcInput = document.querySelector('.etc-input');
  
  if (!channelSelect.value) {
    showError('.form-question3-element.fq3e-5', '유입경로를 선택해주세요.');
    isValid = false;
  } else if (channelSelect.value === 'etc' && !etcInput.value.trim()) {
    // 기타를 선택했을 때만 기타 입력란 검사
    showError('.form-question3-element.fq3e-5', '기타 유입경로를 입력해주세요.');
    isValid = false;
  }

  // 12. 개인정보 처리방침 동의 검사
  const personalSelect = document.querySelector('.personal-agree input');
  if (!personalSelect.checked) {
    showError('.personal-agree', '개인정보 처리방침 및 이용약관에 동의해주세요.');
    isValid = false;
  }

  // 유효성 검사 결과
  if (!isValid) {
    // 첫 번째 오류 메시지 위치로 스크롤
    const firstError = document.querySelector('.error-message.show');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  
  console.log('유효성 검사 결과:', isValid ? '통과' : '실패');
  return isValid;
}

// 오류 메시지 표시 함수
function showError(selector, message) {
  const container = document.querySelector(selector);
  if (!container) return;

  // 기존 오류 메시지 제거
  let existingError = container.querySelector('.error-message');
  if (!existingError) {
    existingError = document.createElement('div');
    existingError.className = 'error-message';
    container.appendChild(existingError);
  }

  existingError.textContent = message;
  existingError.classList.add('show');
}

// 모든 오류 메시지 초기화
function clearErrorMessages() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.classList.remove('show'));
}