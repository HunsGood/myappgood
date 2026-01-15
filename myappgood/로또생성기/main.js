function toggleMode() {
        document.body.classList.toggle("dark");
    }

    function getColor(num) {
        if (num <= 10) return "yellow";
        if (num <= 20) return "blue";
        if (num <= 30) return "red";
        if (num <= 40) return "gray";
        return "green";
    }

    const hotNumbers  = [34, 12, 27, 33, 43];
    const coldNumbers = [9, 22, 41, 29, 23];

    function generateLotto() {
        const results = document.getElementById("results");
        results.innerHTML = "";

        // 게임 1~5
        for (let i = 1; i <= 5; i++) {
            const nums = [];
            while (nums.length < 6) {
                const n = Math.floor(Math.random() * 45) + 1;
                if (!nums.includes(n)) nums.push(n);
            }
            nums.sort((a, b) => a - b);

            let html = `<div class="game">
                <div class="game-title">게임 ${i}</div>
                <div class="numbers">`;

            nums.forEach(n => {
                html += `<div class="ball ${getColor(n)}">${n}</div>`;
            });

            html += `</div></div>`;
            results.innerHTML += html;
        }

        // 게임 6 (통계 기반)
        const mix = [];

        while (mix.length < 3) {
            const n = hotNumbers[Math.floor(Math.random() * hotNumbers.length)];
            if (!mix.includes(n)) mix.push(n);
        }

        while (mix.length < 6) {
            const n = coldNumbers[Math.floor(Math.random() * coldNumbers.length)];
            if (!mix.includes(n)) mix.push(n);
        }

        mix.sort((a, b) => a - b);

        let html6 = `<div class="game">
            <div class="game-title">게임 6 · 통계 기반 추천</div>
            <div class="game-desc">
                가장 많이 나온 번호와<br>
                가장 적게 나온 번호를 조합하여<br>
                무작위로 생성한 추천 번호입니다.
            </div>
            <div class="numbers">`;

        mix.forEach(n => {
            html6 += `<div class="ball ${getColor(n)}">${n}</div>`;
        });

        html6 += `</div></div>`;
        results.innerHTML += html6;
    }

    // 페이지 접속 시 자동 생성
    window.onload = generateLotto;