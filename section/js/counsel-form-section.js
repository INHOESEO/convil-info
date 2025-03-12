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
            
            .etc-input, .service-input {
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
        setupServiceTypeField();
        setupEtcField();
        setupFormButtons();
        setupFormSectionsVisibility();
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
        phoneInputs[0].addEventListener('input', function (event) {
            // 숫자만 입력받기
            this.value = this.value.replace(/[^0-9]/g, '');

            // 3자리 입력 시 다음 입력란으로 포커스 이동
            if (this.value.length >= 3) {
                this.value = this.value.substring(0, 3); // 3자리로 제한
                phoneInputs[1].focus();
            }
        });

        // 두 번째 입력란 (중간 번호)
        phoneInputs[1].addEventListener('input', function (event) {
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
        phoneInputs[2].addEventListener('input', function (event) {
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
        if (emailSelect.value === '직접입력') {
            emailbox2.style.display = 'inline-block';
            emailbox2.removeAttribute('readonly');
        } else {
            emailbox2.style.display = 'none';
            emailbox2.setAttribute('readonly', 'readonly');
            if (emailSelect.value && emailSelect.value !== '직접입력') {
                emailbox2.value = emailSelect.options[emailSelect.selectedIndex].text;
            }
        }

        emailSelect.addEventListener('change', function () {
            if (this.value === '직접입력') {
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

    // 서비스 업종 설정 함수
    function setupServiceTypeField() {
        const serviceTypeSelect = document.querySelector('select.form-question3-element3-value.fq3e3v-2');

        if (!serviceTypeSelect) return;

        const serviceTypeParent = serviceTypeSelect.closest('div');
        let serviceTypeInput = serviceTypeParent.querySelector('input[name="servicebox"]');

        // 입력 필드가 없으면 생성
        if (!serviceTypeInput) {
            serviceTypeInput = document.createElement('input');
            serviceTypeInput.type = 'text';
            serviceTypeInput.className = 'service-input form-question3-element3-value fq3e3v-2';
            serviceTypeInput.name = 'servicebox';
            serviceTypeInput.placeholder = '서비스 업종을 입력하세요';
            serviceTypeInput.style.display = 'none';
            serviceTypeParent.appendChild(serviceTypeInput);
        }

        // 초기 상태 설정
        if (serviceTypeSelect.value === '직접입력') {
            serviceTypeInput.style.display = 'inline-block';
        } else {
            serviceTypeInput.style.display = 'none';
            // 선택된 옵션 텍스트를 입력 필드에 설정
            if (serviceTypeSelect.value) {
                serviceTypeInput.value = serviceTypeSelect.options[serviceTypeSelect.selectedIndex].text;
            }
        }

        // 변경 이벤트 설정
        serviceTypeSelect.addEventListener('change', function () {
            if (this.value === '직접입력') {
                serviceTypeInput.style.display = 'inline-block';
                serviceTypeInput.value = '';
                serviceTypeInput.focus();
            } else {
                serviceTypeInput.style.display = 'none';
                serviceTypeInput.value = this.options[this.selectedIndex].text;
            }
        });

        // 입력 필드 이벤트
        serviceTypeInput.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                const errorContainer = this.closest('li');
                if (errorContainer) {
                    const errorMsg = errorContainer.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.classList.remove('show');
                    }
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

                // 오류 메시지 숨기기 (있을 경우)
                const errorContainer = this.closest('li');
                if (errorContainer) {
                    const errorMsg = errorContainer.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.classList.remove('show');
                    }
                }
            }
        });

        // 입력 필드의 변경 이벤트
        etcInput.addEventListener('input', function () {
            if (this.value.trim() !== '') {
                const errorContainer = this.closest('li');
                if (errorContainer) {
                    const errorMsg = errorContainer.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.classList.remove('show');
                    }
                }
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

    // 서비스 선택에 따른 폼 섹션 표시 관리 함수
    function setupFormSectionsVisibility() {
        // 필요한 요소들
        const serviceButtons = document.querySelectorAll('.form-question1-value');
        const question2Section = document.querySelector('.form-question2');
        const question3Section = document.querySelector('.form-question3');
        const question4Section = document.querySelector('.form-question4');
        const interiorCategory = document.querySelector('.form-question2-category-interior');
        const brandingCategory = document.querySelector('.form-question2-category-branding');

        if (!serviceButtons.length || !question2Section || !question3Section || !question4Section || !interiorCategory || !brandingCategory) {
            console.log('필요한 폼 섹션 요소를 찾을 수 없습니다');
            return;
        }

        // form-question2 위치에 안내 메시지 추가
        let guideContainer2 = document.querySelector('.form-guide-container-2');
        if (!guideContainer2) {
            guideContainer2 = document.createElement('div');
            guideContainer2.className = 'form-guide-container-2';

            const guideMessage2 = document.createElement('p');
            guideMessage2.className = 'form-selection-guide';
            guideMessage2.textContent = '의뢰하실 서비스를 먼저 골라주세요.';
            guideMessage2.style.textAlign = 'center';
            guideMessage2.style.padding = '40px 0';
            guideMessage2.style.fontSize = '16px';
            guideMessage2.style.color = '#666';

            guideContainer2.appendChild(guideMessage2);
            question2Section.parentNode.insertBefore(guideContainer2, question2Section);
        }

        // form-question3 위치에 안내 메시지 추가
        let guideContainer3 = document.querySelector('.form-guide-container-3');
        if (!guideContainer3) {
            guideContainer3 = document.createElement('div');
            guideContainer3.className = 'form-guide-container-3';

            const guideMessage3 = document.createElement('p');
            guideMessage3.className = 'form-selection-guide';
            guideMessage3.textContent = '의뢰하실 서비스를 먼저 골라주세요.';
            guideMessage3.style.textAlign = 'center';
            guideMessage3.style.padding = '40px 0';
            guideMessage3.style.fontSize = '16px';
            guideMessage3.style.color = '#666';

            guideContainer3.appendChild(guideMessage3);
            question3Section.parentNode.insertBefore(guideContainer3, question3Section);
        }

        // 초기 상태 설정
        // 이미 선택된 서비스가 있는지 확인
        const activeButton = document.querySelector('.form-question1-value.active');

        if (activeButton) {
            // 이미 선택된 서비스가 있으면 폼 섹션 표시
            guideContainer2.style.display = 'none';
            guideContainer3.style.display = 'none';
            question2Section.style.display = 'block';
            question3Section.style.display = 'block';
            question4Section.style.display = 'block';

            // 선택된 서비스에 따라 카테고리 표시
            const serviceType = activeButton.getAttribute('value');
            if (serviceType === '인테리어') {
                interiorCategory.style.display = 'block';
                brandingCategory.style.display = 'none';
            } else if (serviceType === '브랜딩') {
                interiorCategory.style.display = 'none';
                brandingCategory.style.display = 'block';
            } else if (serviceType === '컨빌 패키지') {
                interiorCategory.style.display = 'block';
                brandingCategory.style.display = 'block';
            }
        } else {
            // 선택된 서비스가 없으면 폼 섹션 숨김
            guideContainer2.style.display = 'block';
            guideContainer3.style.display = 'block';
            question2Section.style.display = 'none';
            question3Section.style.display = 'none';
            question4Section.style.display = 'none';
        }

        // 서비스 버튼 클릭 이벤트 설정
        serviceButtons.forEach(button => {
            if (button.getAttribute('data-sections-setup')) return; // 이미 설정된 경우 스킵

            button.addEventListener('click', function () {
                // 폼 섹션 표시
                guideContainer2.style.display = 'none';
                guideContainer3.style.display = 'none';
                question2Section.style.display = 'block';
                question3Section.style.display = 'block';
                question4Section.style.display = 'block';

                // 선택된 서비스에 따라 카테고리 표시
                const serviceType = this.getAttribute('value');
                console.log('선택된 서비스:', serviceType);

                if (serviceType === '인테리어') {
                    interiorCategory.style.display = 'block';
                    brandingCategory.style.display = 'none';
                } else if (serviceType === '브랜딩') {
                    interiorCategory.style.display = 'none';
                    brandingCategory.style.display = 'block';
                } else if (serviceType === '컨빌 패키지') {
                    interiorCategory.style.display = 'block';
                    brandingCategory.style.display = 'block';
                }
            });

            button.setAttribute('data-sections-setup', 'true');
        });
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