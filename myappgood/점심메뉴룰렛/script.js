const menuList = [
    '🍜 라면', '🍕 피자', '🍔 햄버거', '🍣 초밥',
    '🍝 파스타', '🥗 샐러드', '🍛 카레', '🌮 타코',
    '🍲 찌개', '🍱 도시락', '🥙 케밥', '🍗 치킨',
    '🍖 삼겹살', '🥩 스테이크', '🍜 우동', '🍳 돈까스',
    '🥟 만두', '🌯 부리또', '🍢 어묵', '🥘 쌀국수',
    '🍙 김밥', '🌭 핫도그', '🥪 샌드위치', '🍰 디저트'
];

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
    '#F8B88B', '#FAD7A0', '#AED6F1', '#A9DFBF'
];

const canvas = document.getElementById('rouletteCanvas');
const ctx = canvas.getContext('2d');
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = canvas.width / 2;

let menus = [];
let currentRotation = 0;
let isSpinning = false;

function shuffleMenus() {
    menus = [...menuList].sort(() => Math.random() - 0.5);
}

function drawRoulette(rotation = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const anglePerSection = (Math.PI * 2) / menus.length;
    
    menus.forEach((menu, i) => {
        const startAngle = rotation + (i * anglePerSection);
        const endAngle = startAngle + anglePerSection;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSection / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 3;
        ctx.fillText(menu, radius * 0.7, 5);
        ctx.restore();
    });
}

function spin() {
    if (isSpinning) return;
    
    isSpinning = true;
    document.getElementById('startBtn').disabled = true;
    document.getElementById('result').textContent = '돌아가는 중...';
    document.getElementById('result').classList.remove('show');
    
    const spinDuration = 3000 + Math.random() * 2000;
    const spinRotations = 5 + Math.random() * 3;
    const totalRotation = spinRotations * Math.PI * 2;
    
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = totalRotation * easeOut;
        
        drawRoulette(currentRotation);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            const normalizedRotation = currentRotation % (Math.PI * 2);
            const anglePerSection = (Math.PI * 2) / menus.length;
            
            // 화살표는 위쪽(270도 = 3π/2)을 가리킴
            // 룰렛이 시계방향으로 회전하므로, 회전 후 위치에서 화살표가 가리키는 섹션 찾기
            const pointerAngle = (Math.PI * 3 / 2);  // 위쪽 방향
            
            // 회전된 후 각 섹션의 시작 각도와 비교
            let selectedIndex = 0;
            for (let i = 0; i < menus.length; i++) {
                const sectionStart = (normalizedRotation + (i * anglePerSection)) % (Math.PI * 2);
                const sectionEnd = (sectionStart + anglePerSection) % (Math.PI * 2);
                
                // 위쪽(270도) 방향이 이 섹션 안에 있는지 확인
                if (sectionStart <= sectionEnd) {
                    if (pointerAngle >= sectionStart && pointerAngle < sectionEnd) {
                        selectedIndex = i;
                        break;
                    }
                } else {
                    if (pointerAngle >= sectionStart || pointerAngle < sectionEnd) {
                        selectedIndex = i;
                        break;
                    }
                }
            }
            
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = `<span class="emoji">🎉</span> 오늘의 점심: ${menus[selectedIndex]}`;
            resultDiv.classList.add('show');
            
            isSpinning = false;
            document.getElementById('startBtn').disabled = false;
        }
    }
    
    animate();
}

// 이벤트 리스너
document.getElementById('startBtn').addEventListener('click', spin);

// 초기화
shuffleMenus();
drawRoulette();