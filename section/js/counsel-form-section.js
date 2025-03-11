// 통합된 상담 폼 UI 개선 스크립트
(function () {
    // 초기화 실행
    applyCustomStyles();

    if (document.readyState !== 'loading') {
        initializeUI();
    } else {
        document.addEventListener('DOMContentLoaded', initializeUI);
    }

    document.addEventListener('layoutLoaded', initializeUI);
    [100, 500, 1000, 2000].forEach(delay => {
        setTimeout(initializeUI, delay);
    });

    setupMutationObserver();
    setupFormSubmit();

    // 스타일 적용 함수
    function applyCustomStyles() {
        if (document.querySelector('#custom-form-styles')) return;

        const styleElement = document.createElement('style');
        styleElement.id = 'custom-form-styles';
        styleElement.textContent = `
            .custom-file-upload {
                position: relative;
                width: 100%;
                background: #E5E7EB;
                padding: 30px 0 24px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s;
                margin-bottom: 10px;
            }
            
            .custom-file-upload:hover {
                background: #f0f5ff;
            }
            
            .custom-file-upload .upload-icon {
                display: block;
                margin: 0 auto 15px;
            }
            
            .custom-file-upload .upload-text {
                font-size: 14px;
                font-weight: 500;
                color: #797979;
                line-height: 1.5;
            }
            
            .custom-file-upload input[type="file"] {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                cursor: pointer;
            }
            
            .file-info {
                margin-top: 10px;
            }
            
            .file-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 15px;
                background: #f0f5ff;
                border: 1px solid #0057ff;
                border-radius: 10px;
                margin-bottom: 8px;
            }
            
            .file-name {
                font-size: 14px;
                font-weight: 500;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 70%;
            }
            
            .file-size {
                font-size: 12px;
                color: #666;
                margin-left: 10px;
            }
            
            .remove-file {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #e3e3e3;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            
            .remove-file:after {
                content: "×";
                font-size: 16px;
                color: #797979;
            }
            
            .total-size {
                font-size: 12px;
                color: #666;
                text-align: right;
                margin-top: 5px;
            }
            
            .file-error {
                color: #ff3333;
                font-size: 12px;
                margin-top: 5px;
                display: none;
            }
            
            .file-error.show {
                display: block;
            }
            
            .unit-input-wrapper {
                position: relative;
                display: inline-block;
            }
            
            .unit-input {
                padding-right: 30px;
                width: 144px;
                color: #797979;
                border: 2px solid #e3e3e3;
                border-radius: 34px;
                padding: 7px 35px 7px 16px;
                font-size: 14px;
                font-weight: 500;
                letter-spacing: -0.44px;
            }
            
            .unit-input:focus {
                border-color: #0057ff;
                outline: none;
            }
            
            .unit-text {
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 14px;
                font-weight: 500;
                color: #797979;
                pointer-events: none;
            }
            
            .unit-input::placeholder {
                color: #b9b9b9;
                letter-spacing: -0.44px;
            }
            
            #counselFormSectionInner .counsel-form > ul > li > .form-question3 input:focus,
            #counselFormSectionInner .counsel-form > ul > li > .form-question3 select:focus,
            #counselFormSectionInner .counsel-form > ul > li > .form-question3 input.has-value,
            #counselFormSectionInner .counsel-form > ul > li > .form-question3 select.has-value {
                border: 2px solid #0057ff !important;
                color: #0057ff !important;
                outline: none;
            }
            
            #counselFormSectionInner .counsel-form > ul > li > .form-question3 input[name="emailbox2"] {
                display: none;
            }
            
            #counselFormSectionInner .counsel-form > ul > li > .form-question3 input[name="emailbox2"].show {
                display: inline-block;
            }
            
            .etc-input {
                width: 173px;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: -0.44px;
                border-radius: 10px;
                border: 2px solid #E3E3E3;
                padding: 7px 10px 6px;
            }
            
            .check-icon-select {
                display: none;
                margin-right: 5px;
                vertical-align: middle;
            }
            
            .check-icon-button {
                display: none;
                margin-right: 5px;
                vertical-align: middle;
            }
            
            .form-question1-value.active .fq1v-select-btn .check-icon-select {
                display: inline-block;
            }
            
            .form-question2 button.active .check-icon-button {
                display: inline-block;
            }
            
            .error-message {
                color: #ff3333;
                font-size: 12px;
                margin-top: 15px;
                margin-left: 10px;
                display: none;
            }
            
            .error-message.show {
                display: inline-block;
            }
        `;

        document.head.appendChild(styleElement);
    }

    // UI 초기화 함수
    function initializeUI() {
        setupUnitInput();
        setupFileUpload();
        setupFormQuestion3Styles();
        setupPhoneInputs();
        setupEmailField();
        setupEtcField();
        setupServiceField();
        setupFormButtons();
        setupFormSubmit()
    }

    // 단위 텍스트 인풋 필드 설정
    function setupUnitInput() {
        const originalInput = document.querySelector('.form-question2-element3-value:not(.unit-input)');
        if (!originalInput) return;

        const parentElement = originalInput.parentElement;
        const spanElement = parentElement.querySelector('span');

        const customInputHTML = `
            <div class="unit-input-wrapper">
                <input class="form-question2-element3-value fq2e3v-1 unit-input" 
                    type="text" 
                    name="sqft" 
                    placeholder="예) 72">
                <span class="unit-text">평</span>
            </div>
        `;

        originalInput.outerHTML = customInputHTML;

        if (spanElement) {
            parentElement.appendChild(spanElement);
        }
    }

    // 파일 업로드 UI 설정
    function setupFileUpload() {
        const originalFileInput = document.querySelector('.form-question2-element4-value:not(.in-custom-upload)');
        if (!originalFileInput) return;

        const parentElement = originalFileInput.parentElement;

        const customUploadHTML = `
            <div class="custom-file-upload">
                <svg class="upload-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="29" viewBox="0 0 28 29" fill="none">
                    <mask id="mask0_230_326" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="28" height="29">
                        <rect x="0.257812" y="0.469727" width="27.6119" height="27.6119" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_230_326)">
                        <path d="M12.9128 23.4797V14.1032L9.92155 17.0944L8.31086 15.4262L14.0633 9.67375L19.8158 15.4262L18.2051 17.0944L15.2138 14.1032V23.4797H12.9128ZM4.85938 10.8242V7.37277C4.85938 6.73999 5.08468 6.1983 5.53529 5.74769C5.9859 5.29708 6.52759 5.07178 7.16036 5.07178H20.9663C21.5991 5.07178 22.1408 5.29708 22.5914 5.74769C23.042 6.1983 23.2673 6.73999 23.2673 7.37277V10.8242H20.9663V7.37277H7.16036V10.8242H4.85938Z" fill="#797979"/>
                    </g>
                </svg>
                <p class="upload-text">여기에 JPG, PNG, DOC, DOCX, PPT, PPTX, AI 또는 PDF 파일을 첨부해주세요. (파일당 최대 10MB, 총 50MB)</p>
                <input class="form-question2-element4-value fq2e4v-1 in-custom-upload" type="file" name="placeImg" accept="image/jpg, image/png, .pdf, .doc, .docx, .hwp, .ai, .ppt, .pptx" multiple />
            </div>
            <div class="file-info"></div>
            <div class="file-error">파일 크기 제한을 초과했습니다. 각 파일은 10MB 이하, 총 파일 크기는 50MB 이하여야 합니다.</div>
            <div class="total-size"></div>
        `;

        parentElement.innerHTML = customUploadHTML;

        const newFileInput = parentElement.querySelector('.form-question2-element4-value');
        const fileInfo = parentElement.querySelector('.file-info');
        const fileError = parentElement.querySelector('.file-error');
        const totalSizeInfo = parentElement.querySelector('.total-size');

        if (!newFileInput || !fileInfo || !fileError || !totalSizeInfo) return;

        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024;
        let selectedFiles = [];

        function formatFileSize(bytes) {
            if (bytes < 1024) return bytes + ' B';
            else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            else return (bytes / 1048576).toFixed(1) + ' MB';
        }

        function updateTotalSize() {
            const totalSize = selectedFiles.reduce((total, file) => total + file.size, 0);
            totalSizeInfo.textContent = `총 파일 크기: ${formatFileSize(totalSize)}`;
            return totalSize;
        }

        function renderFileList() {
            fileInfo.innerHTML = '';

            selectedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';

                const fileName = document.createElement('div');
                fileName.className = 'file-name';
                fileName.textContent = file.name;

                const fileSize = document.createElement('div');
                fileSize.className = 'file-size';
                fileSize.textContent = formatFileSize(file.size);

                const removeBtn = document.createElement('div');
                removeBtn.className = 'remove-file';
                removeBtn.setAttribute('data-index', index);

                removeBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const idx = parseInt(this.getAttribute('data-index'));
                    selectedFiles.splice(idx, 1);
                    renderFileList();
                    updateTotalSize();
                    fileError.classList.remove('show');
                });

                fileItem.appendChild(fileName);
                fileItem.appendChild(fileSize);
                fileItem.appendChild(removeBtn);
                fileInfo.appendChild(fileItem);
            });
        }

        newFileInput.addEventListener('change', function (e) {
            const files = Array.from(this.files || []);
            let hasError = false;

            files.forEach(file => {
                if (file.size > MAX_FILE_SIZE) {
                    hasError = true;
                }
            });

            const potentialTotalSize = selectedFiles.reduce((total, file) => total + file.size, 0) +
                files.reduce((total, file) => total + file.size, 0);

            if (potentialTotalSize > MAX_TOTAL_SIZE) {
                hasError = true;
            }

            if (hasError) {
                fileError.classList.add('show');
            } else {
                fileError.classList.remove('show');
                selectedFiles = [...selectedFiles, ...files];
                renderFileList();
                updateTotalSize();
            }

            this.value = '';
        });
    }

    // 입력 필드 이벤트 리스너 설정
    function setupFormQuestion3Styles() {
        const inputFields = document.querySelectorAll('#counselFormSectionInner .counsel-form > ul > li > .form-question3 input');
        const selectFields = document.querySelectorAll('#counselFormSectionInner .counsel-form > ul > li > .form-question3 select');

        inputFields.forEach(input => {
            if (input.getAttribute('data-style-applied')) return;

            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            }

            input.addEventListener('input', function () {
                if (this.value.trim() !== '') {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });

            input.setAttribute('data-style-applied', 'true');
        });

        selectFields.forEach(select => {
            if (select.getAttribute('data-style-applied')) return;

            if (select.value && select.value !== '' && !select.options[select.selectedIndex].disabled) {
                select.classList.add('has-value');
            }

            select.addEventListener('change', function () {
                if (this.value && this.value !== '' && !this.options[this.selectedIndex].disabled) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });

            select.setAttribute('data-style-applied', 'true');
        });
    }

    // setupPhoneInputs 함수 추가
    function setupPhoneInputs() {
        const phoneInputs = document.querySelectorAll('.form-question3-element2-value.fq3e2v-1');
        if (phoneInputs.length !== 3) return;

        // 첫 번째 입력란 (지역번호)
        phoneInputs[0].addEventListener('input', function () {
            // 숫자만 입력받기
            this.value = this.value.replace(/[^0-9]/g, '');

            // 3자리 입력 시 다음 입력란으로 포커스 이동
            if (this.value.length >= 3) {
                this.value = this.value.substring(0, 3); // 3자리로 제한
                phoneInputs[1].focus();
            }
        });

        // 두 번째 입력란 (중간 번호)
        phoneInputs[1].addEventListener('input', function () {
            // 숫자만 입력받기
            this.value = this.value.replace(/[^0-9]/g, '');

            // 4자리 입력 시 다음 입력란으로 포커스 이동
            if (this.value.length >= 4) {
                this.value = this.value.substring(0, 4); // 4자리로 제한
                phoneInputs[2].focus();
            }

            // 값이 없는 상태에서 백스페이스를 누르면 이전 입력란으로 포커스 이동
            if (this.value.length === 0 && event.inputType === 'deleteContentBackward') {
                phoneInputs[0].focus();
                phoneInputs[0].setSelectionRange(phoneInputs[0].value.length, phoneInputs[0].value.length);
            }
        });

        // 세 번째 입력란 (마지막 번호)
        phoneInputs[2].addEventListener('input', function () {
            // 숫자만 입력받기
            this.value = this.value.replace(/[^0-9]/g, '');

            // 4자리로 제한
            if (this.value.length > 4) {
                this.value = this.value.substring(0, 4);
            }

            // 값이 없는 상태에서 백스페이스를 누르면 이전 입력란으로 포커스 이동
            if (this.value.length === 0 && event.inputType === 'deleteContentBackward') {
                phoneInputs[1].focus();
                phoneInputs[1].setSelectionRange(phoneInputs[1].value.length, phoneInputs[1].value.length);
            }
        });

        // 최대 길이 속성 설정
        phoneInputs[0].setAttribute('maxlength', '3');
        phoneInputs[1].setAttribute('maxlength', '4');
        phoneInputs[2].setAttribute('maxlength', '4');
    }

    // 이메일 입력 필드 설정
    function setupEmailField() {
        // 이메일 선택 셀렉트 요소
        const emailSelect = document.querySelector('select.form-question3-element2-value.fq3e2v-2');

        // 이메일 두 번째 입력 필드 (도메인)
        const emailbox2 = document.querySelector('input[name="emailbox2"]');

        if (!emailSelect || !emailbox2) return;

        // 초기 로드 시 처리
        if (emailSelect.value === 'self') {
            emailbox2.style.display = 'inline-block';
            emailbox2.removeAttribute('readonly');
        } else {
            emailbox2.style.display = 'none';
            emailbox2.setAttribute('readonly', 'readonly');
            if (emailSelect.value && emailSelect.value !== 'self') {
                emailbox2.value = emailSelect.options[emailSelect.selectedIndex].text;
            }
        }

        emailSelect.addEventListener('change', function () {
            if (this.value === 'self') {
                emailbox2.style.display = 'inline-block';
                emailbox2.value = '';
                emailbox2.removeAttribute('readonly');
                emailbox2.focus();
            } else {
                emailbox2.style.display = 'none';
                emailbox2.setAttribute('readonly', 'readonly');
                if (this.value) {
                    emailbox2.value = this.options[this.selectedIndex].text;
                }
            }
        });
    }

    // 서비스 업종 필드 설정
    function setupServiceField() {
        const serviceSelect = document.querySelector('.form-question3-element3-value.fq3e3v-2');
        const serviceInput = document.querySelector('input[name="servicebox"]');

        if (!serviceSelect || !serviceInput) return;

        if (serviceSelect.value === '직접입력') {
            serviceInput.style.display = 'inline-block';
            serviceInput.removeAttribute('readonly');
        } else {
            serviceInput.style.display = 'none';
            serviceInput.setAttribute('readonly', 'readonly');

            if (serviceSelect.value && serviceSelect.value !== 'self') {
                serviceInput.value = serviceSelect.options[serviceSelect.selectedIndex].text;
            }
        }

        serviceSelect.addEventListener('change', function () {
            if (this.value === '직접입력') {
                serviceInput.style.display = 'inline-block';
                serviceInput.value = '';
                serviceInput.removeAttribute('readonly');
                serviceInput.focus();
            } else {
                serviceInput.style.display = 'none';
                serviceInput.setAttribute('readonly', 'readonly');

                if (this.value) {
                    serviceInput.value = this.options[this.selectedIndex].text;
                }
            }
        });
    }

    // 기타 입력 필드 설정
    function setupEtcField() {
        const etcSelect = document.querySelector('.form-question3-element5-value');
        if (!etcSelect) return;

        const selectContainer = etcSelect.parentElement;
        let etcInput = selectContainer.querySelector('.etc-input');

        if (!etcInput) {
            etcInput = document.createElement('input');
            etcInput.type = 'text';
            etcInput.className = 'etc-input form-question3-element5-value fq3e5v-2';
            etcInput.name = 'etcDetail';
            etcInput.placeholder = '기타 내용을 입력하세요';
            etcInput.style.display = 'none';
            selectContainer.appendChild(etcInput);
        }

        if (etcSelect.value === '기타') {
            etcInput.style.display = 'inline-block';
        } else {
            etcInput.style.display = 'none';
        }

        etcSelect.addEventListener('change', function () {
            if (this.value === '기타') {
                etcInput.style.display = 'inline-block';
                etcInput.focus();
            } else {
                etcInput.style.display = 'none';
            }
        });
    }

    // 버튼 설정 함수
    function setupFormButtons() {
        // 서비스 선택 버튼에 대한 체크 아이콘 (fq1v-select-btn에 추가)
        const checkIconSelect = `<svg class="check-icon-select" xmlns="http://www.w3.org/2000/svg" width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M1.83594 8.63212L6.59094 14.9089L18.1388 1.5708" stroke="white" stroke-width="3" stroke-linecap="round"/>
        </svg>`;

        // 기타 버튼에 대한 체크 아이콘 (파란색 체크)
        const checkIconButton = `<svg class="check-icon-button" xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 20 15" fill="none">
            <path d="M2 7.54942L6.71422 12.9371L18.163 1.48828" stroke="#0057FF" stroke-width="2.02038" stroke-linecap="round"/>
        </svg>`;

        // 1. 서비스 선택 (중복 불가)
        const serviceButtons = document.querySelectorAll('.form-question1-value');
        serviceButtons.forEach(button => {
            if (button.getAttribute('data-setup')) return;

            // fq1v-select-btn에 체크 아이콘 추가
            const selectBtn = button.querySelector('.fq1v-select-btn');
            if (selectBtn && !selectBtn.querySelector('.check-icon-select')) {
                selectBtn.innerHTML = checkIconSelect + selectBtn.innerHTML;
            }

            button.addEventListener('click', function (e) {
                e.preventDefault();
                serviceButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });

            button.setAttribute('data-setup', 'true');
        });

        // 2. 인테리어 옵션 (중복 가능)
        const interiorButtons = document.querySelectorAll('.form-question2-element1-value');
        interiorButtons.forEach(button => {
            if (button.getAttribute('data-setup')) return;

            button.innerHTML = checkIconButton + button.innerHTML;

            button.addEventListener('click', function (e) {
                e.preventDefault();
                this.classList.toggle('active');
            });

            button.setAttribute('data-setup', 'true');
        });

        // 3. 도면 보유 여부 (중복 불가)
        const planButtons = document.querySelectorAll('.form-question2-element2-value');
        planButtons.forEach(button => {
            if (button.getAttribute('data-setup')) return;

            button.innerHTML = checkIconButton + button.innerHTML;

            button.addEventListener('click', function (e) {
                e.preventDefault();
                planButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });

            button.setAttribute('data-setup', 'true');
        });

        // 4. 브랜딩 옵션들 (모두 중복 가능)
        const brandingCategories = ['.form-question2-element5-value', '.form-question2-element6-value',
            '.form-question2-element7-value', '.form-question2-element8-value'];

        brandingCategories.forEach(category => {
            const buttons = document.querySelectorAll(category);
            buttons.forEach(button => {
                if (button.getAttribute('data-setup')) return;

                button.innerHTML = checkIconButton + button.innerHTML;

                button.addEventListener('click', function (e) {
                    e.preventDefault();
                    this.classList.toggle('active');
                });

                button.setAttribute('data-setup', 'true');
            });
        });
    }

    // 폼 제출 시 유효성 검사
    function setupFormSubmit() {
        const form = document.querySelector('.counsel-form');
        if (!form) return;

        // 기존 이벤트 리스너 제거
        form.removeEventListener('submit', handleSubmit);

        // 제출 핸들러 함수 분리
        function handleSubmit(e) {
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

            // 9. 서비스 업종 검사 - 수정된 부분
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

            // 11. 유입경로 검사 - 수정된 부분
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

            // 제출 방지 또는 허용
            if (!isValid) {
                e.preventDefault();
                // 첫 번째 오류 메시지 위치로 스크롤
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

        // 이벤트 리스너 추가 (한 번만)
        form.addEventListener('submit', handleSubmit);
    }

    // DOM 변경 감시
    function setupMutationObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = function (mutationsList) {
            initializeUI();
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        return observer;
    }
})();

// form-question1 : 필수
// form-question2-element fq2e-1  : 필수
// form-question2-element fq2e-2 : 필수
// form-question2-element fq2e-3 : 필수
// form-question2-element fq2e-4 : 선택
// form-question2-element fq2e-5 : 선택
// form-question2-element fq2e-6 : 선택
// form-question2-element fq2e-7 : 선택
// form-question2-element fq2e-8 :선택
// form-question3-element fq3e-1 : 필수
// form-question3-element fq3e-2 : 필수
// form-question3-element fq3e-3 : 필수
// form-question3-element fq3e-4 : 필수
// form-question3-element fq3e-5 : 필수
// personal-agree : 필수

