const fs = require('fs');
const path = require('path');

// 필요한 디렉토리 생성
const targetDir = path.join(__dirname, 'resources', 'libs', 'three.js');
fs.mkdirSync(targetDir, { recursive: true });

// 파일 복사 함수
function copyFile(source, target) {
    fs.copyFileSync(
        path.join(__dirname, 'node_modules', 'three', source),
        path.join(targetDir, target)
    );
    console.log(`Copied ${target}`);
}

// 필요한 파일들 복사
copyFile('build/three.min.js', 'three.min.r128.js');
copyFile('examples/js/loaders/ColladaLoader.js', 'ColladaLoader.r128.js');
copyFile('examples/js/controls/OrbitControls.js', 'OrbitControls.r128.js');

console.log('Setup completed!')