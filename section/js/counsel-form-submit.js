// 폼 데이터 수집 및 제출 코드

// Google Apps Script 웹 앱 URL 설정
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyP2_Bmm2EIXI05b5T0MGvNr7Y-g-r9qXQCi5wLl3OB5SQnEQRuIIiXeJQu5DxtBBB_/exec";

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
  const serviceAreaSelect = document.querySelector('select.form-question3-element3-value.fq3e3v-1');
  const serviceArea = serviceAreaSelect ? 
    serviceAreaSelect.options[serviceAreaSelect.selectedIndex].text : "";
  
  // 서비스 업종
  const serviceTypeSelect = document.querySelector('select.form-question3-element3-value.fq3e3v-2');
  let serviceBusinessType = "";
  
  if (serviceTypeSelect) {
    if (serviceTypeSelect.value === '직접입력') {
      const serviceTypeInput = document.querySelector('input[name="servicebox"]');
      serviceBusinessType = serviceTypeInput ? serviceTypeInput.value.trim() : "";
    } else {
      serviceBusinessType = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text;
    }
  }
  
  // 희망 마감기한
  const deadlineInput = document.querySelector('.form-question3-element4-value');
  const deadline = deadlineInput.value;
  
  // 유입경로
  const channelSelect = document.querySelector('.form-question3-element5-value');
  let sourceChannel = "";
  
  if (channelSelect) {
    if (channelSelect.value === '기타') {
      const etcInput = document.querySelector('.etc-input');
      sourceChannel = etcInput && etcInput.style.display !== 'none' ? etcInput.value.trim() : "";
    } else {
      sourceChannel = channelSelect.options[channelSelect.selectedIndex].text;
    }
  }
  
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
  
  // FormData 객체 생성
  const formDataToSend = new FormData();
  
  // 파일 정보 확인 및 추가
  const fileInput = document.querySelector('.form-question2-element4-value.in-custom-upload');
  const globalSelectedFiles = window.selectedFiles || [];
  const fileCount = globalSelectedFiles.length;
  const fileInfoText = fileCount > 0 ? `${fileCount}개 파일 첨부됨` : "파일 없음";

  // 콘솔에 수집된 데이터 로깅 (디버깅 용도)
  console.log('수집된 데이터:', {
    serviceType,
    interiorOptions,
    hasPlan,
    sqft,
    files: fileInfoText,
    name,
    phone: `${phoneBox1}-${phoneBox2}-${phoneBox3}`,
    email: `${emailBox1}@${emailBox2}`,
    serviceArea,
    serviceBusinessType,
    deadline,
    sourceChannel
  });
  
  // 텍스트 데이터 추가
  formDataToSend.append('serviceType', serviceType);
  formDataToSend.append('interiorOptions', interiorOptions);
  formDataToSend.append('hasPlan', hasPlan);
  formDataToSend.append('sqft', sqft);
  formDataToSend.append('identityOptions', identityOptions);
  formDataToSend.append('offlineAdOptions', offlineAdOptions);
  formDataToSend.append('onlineAdOptions', onlineAdOptions);
  formDataToSend.append('websiteOptions', websiteOptions);
  formDataToSend.append('name', name);
  formDataToSend.append('numberbox1', phoneBox1);
  formDataToSend.append('numberbox2', phoneBox2);
  formDataToSend.append('numberbox3', phoneBox3);
  formDataToSend.append('emailbox1', emailBox1);
  formDataToSend.append('emailbox2', emailBox2);
  formDataToSend.append('serviceArea', serviceAreaSelect ? serviceAreaSelect.value : "");
  formDataToSend.append('servicebox', serviceBusinessType);
  formDataToSend.append('deadline', deadline);
  formDataToSend.append('sourceChannel', channelSelect ? channelSelect.value : "");
  formDataToSend.append('etcDetail', channelSelect && channelSelect.value === '기타' ? sourceChannel : "");
  formDataToSend.append('privacyAgreed', privacyAgreed);
  formDataToSend.append('marketingAgreed', marketingAgreed);
  
  // 파일 처리를 위한 준비
  const submitBtn = document.querySelector('.counsel-form-submit');
  const originalBtnText = submitBtn.value;
  submitBtn.value = "제출 중...";
  submitBtn.disabled = true;
  
  // 파일 처리 및 폼 제출 로직
  if (globalSelectedFiles && globalSelectedFiles.length > 0) {
    console.log("저장된 파일 업로드 시도:", globalSelectedFiles.length + "개 파일");
    
    // 총 파일 개수 전송
    formDataToSend.append('fileCount', globalSelectedFiles.length);
    
    // 파일 읽기를 위한 프로미스 배열
    const fileReadPromises = [];
    
    for (let i = 0; i < globalSelectedFiles.length; i++) {
      const file = globalSelectedFiles[i];
      console.log(`파일 ${i+1}: ${file.name}, 타입: ${file.type}, 크기: ${file.size} 바이트`);
      
      // 파일 메타데이터 먼저 추가
      formDataToSend.append(`fileName${i}`, file.name);
      formDataToSend.append(`fileType${i}`, file.type);
      
      // 파일 읽기 프로미스 생성
      const promise = new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          const base64 = e.target.result.split(',')[1]; // Base64 데이터 부분만 추출
          formDataToSend.append(`fileData${i}`, base64);
          resolve();
        };
        
        reader.onerror = function(e) {
          console.error(`파일 ${file.name} 읽기 오류:`, e);
          reject(e);
        };
        
        reader.readAsDataURL(file);
      });
      
      fileReadPromises.push(promise);
    }
    
    // 모든 파일이 읽어지면 폼 제출 진행
    Promise.all(fileReadPromises)
      .then(() => {
        sendFormData(formDataToSend, submitBtn, originalBtnText);
      })
      .catch(error => {
        // 로딩 스피너 숨김
        const loadingSpinner = document.querySelector('.loading-spinner');
        if (loadingSpinner) {
          loadingSpinner.style.display = 'none';
        }
        
        console.error('파일 처리 중 오류 발생:', error);
        alert('파일 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        
        // 버튼 상태 복원
        submitBtn.value = originalBtnText;
        submitBtn.disabled = false;
      });
  } else {
    // 파일이 없는 경우 바로 제출
    sendFormData(formDataToSend, submitBtn, originalBtnText);
  }
}

// 폼 데이터 제출 함수
function sendFormData(formData, submitBtn, originalBtnText) {
  // 로딩 스피너 표시
  const loadingSpinner = document.querySelector('.loading-spinner');
  if (loadingSpinner) {
    loadingSpinner.style.display = 'flex';
  }
  
  // Google Apps Script 웹 앱으로 데이터 전송
  const xhr = new XMLHttpRequest();
  xhr.open('POST', GOOGLE_SCRIPT_URL, true);
  
  xhr.onload = function() {
    // 로딩 스피너 숨김
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    
    if (xhr.status === 200) {
      console.log('폼 제출 완료');
      alert('문의가 성공적으로 접수되었습니다. 감사합니다.');
      
      // 폼 초기화
      document.querySelector('.counsel-form').reset();
      document.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
      
      // 파일 정보 초기화
      const fileInfo = document.querySelector('.file-info');
      if (fileInfo) fileInfo.innerHTML = '';
      
      const totalSize = document.querySelector('.total-size');
      if (totalSize) totalSize.textContent = '';
      
      // 전역 선택 파일 초기화
      window.selectedFiles = [];
      
      // 버튼 상태 복원
      submitBtn.value = originalBtnText;
      submitBtn.disabled = false;
      
      // 페이지 상단으로 스크롤
      window.scrollTo(0, 0);
    } else {
      console.error('폼 제출 오류:', xhr.responseText);
      alert('문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      
      // 버튼 상태 복원
      submitBtn.value = originalBtnText;
      submitBtn.disabled = false;
    }
  };
  
  xhr.onerror = function() {
    // 로딩 스피너 숨김
    if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
    }
    
    console.error('네트워크 오류');
    alert('네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
    
    // 버튼 상태 복원
    submitBtn.value = originalBtnText;
    submitBtn.disabled = false;
  };
  
  xhr.send(formData);
}

// 유효성 검사 함수 수정
function validateForm() {
  // 오류 메시지 초기화
  clearErrorMessages();
  
  let isValid = true;

  // 1. 서비스 선택 검사
  const serviceSelected = document.querySelector('.form-question1-value.active');
  if (!serviceSelected) {
    showError('.counsel-form ul li:first-child', '서비스를 선택해주세요.');
    isValid = false;
    return isValid; // 서비스가 선택되지 않았으면 여기서 종료
  }

  // 선택된 서비스 유형 확인
  const selectedServiceType = serviceSelected.getAttribute('value');
  const isInteriorVisible = document.querySelector('.form-question2-category-interior').style.display !== 'none';
  const isBrandingVisible = document.querySelector('.form-question2-category-branding').style.display !== 'none';

  // 인테리어 관련 검사 (인테리어 또는 컨빌 패키지 선택 시)
  if (isInteriorVisible) {
    // 2. 인테리어 옵션 검사
    const interiorOptions = document.querySelectorAll('.form-question2-element1-value.active');
    if (interiorOptions.length === 0) {
      showError('.form-question2-element.fq2e-1', '인테리어 옵션을 최소 1개 이상 선택해주세요.');
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
  }

  // 브랜딩 관련 검사 (브랜딩 또는 컨빌 패키지 선택 시)
  if (isBrandingVisible) {
    // 브랜딩 옵션 선택 여부 확인
    const identityOptions = document.querySelectorAll('.form-question2-element5-value.active');
    const offlineAdOptions = document.querySelectorAll('.form-question2-element6-value.active');
    const onlineAdOptions = document.querySelectorAll('.form-question2-element7-value.active');
    const websiteOptions = document.querySelectorAll('.form-question2-element8-value.active');
    
    // 모든 브랜딩 옵션에서 하나도 선택되지 않았는지 확인
    if (
      identityOptions.length === 0 && 
      offlineAdOptions.length === 0 && 
      onlineAdOptions.length === 0 && 
      websiteOptions.length === 0
    ) {
      showError('.form-question2-category-branding', '브랜딩 옵션을 최소 1개 이상 선택해주세요.');
      isValid = false;
    }
  }

  // 공통 검사 항목들 (이름, 연락처, 이메일 등)
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
  const serviceAreaSelect = document.querySelector('select.form-question3-element3-value.fq3e3v-1');
  if (!serviceAreaSelect || !serviceAreaSelect.value) {
    showError('.form-question3-element.fq3e-3 ul li:first-child', '서비스 지역을 선택해주세요.');
    isValid = false;
  }

  // 9. 서비스 업종 검사
  const serviceTypeSelect = document.querySelector('select.form-question3-element3-value.fq3e3v-2');
  const serviceTypeInput = document.querySelector('input[name="servicebox"]');

  if (!serviceTypeSelect || !serviceTypeSelect.value) {
    showError('.form-question3-element.fq3e-3 ul li:last-child', '서비스 업종을 선택해주세요.');
    isValid = false;
  } else if (serviceTypeSelect.value === '직접입력') {
    if (!serviceTypeInput || !serviceTypeInput.value.trim()) {
      showError('.form-question3-element.fq3e-3 ul li:last-child', '서비스 업종을 입력해주세요.');
      isValid = false;
    }
  }
  
  // 10. 희망 마감기한 검사
  const deadlineInput = document.querySelector('.form-question3-element4-value');
  if (!deadlineInput.value) {
    showError('.form-question3-element.fq3e-4', '희망 마감기한을 선택해주세요.');
    isValid = false;
  }

  // 11. 유입경로 검사
  const channelSelect = document.querySelector('.form-question3-element5-value');
  if (!channelSelect || !channelSelect.value) {
    showError('.form-question3-element.fq3e-5', '유입경로를 선택해주세요.');
    isValid = false;
  } else if (channelSelect.value === '기타') {
    const etcInput = document.querySelector('.etc-input');
    if (!etcInput || !etcInput.value.trim()) {
      showError('.form-question3-element.fq3e-5', '기타 유입경로를 입력해주세요.');
      isValid = false;
    }
  }

  // 12. 개인정보 처리방침 동의 검사
  const personalSelect = document.querySelector('.personal-agree input');
  if (!personalSelect.checked) {
    showError('.personal-agree', '개인정보 처리방침 및 이용약관에 동의해주세요.');
    isValid = false;
  }

  // 오류 발견 시 첫 번째 오류 메시지로 스크롤
  if (!isValid) {
    const firstError = document.querySelector('.error-message.show');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

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