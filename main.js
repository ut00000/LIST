// ----- 診断の土台（設定項目） -----

// ★ 1. 全28問の質問データ
// (前回と同じ設定を使用)
const questions = [
    // --- 質問群1 (q1) ---
    { text: "質問1: 新しいことにも、しり込みせずに挑戦できる", group: "q1", type: "A", reverse: false },
    { text: "質問2: 困難なことにも、積極的に挑戦する", group: "q1", type: "A", reverse: false },
    { text: "質問3: 初対面であっても自ら進んで話しかける", group: "q1", type: "A", reverse: false },
    { text: "質問4: ものごとの原因を追求して考えられる", group: "q1", type: "A", reverse: false },
    { text: "質問5: より正しいものの見方・考え方はないかと、追求して仕事を進めらる", group: "q1", type: "A", reverse: false },
    { text: "質問6: 重要な選択は、プラスとマイナスの両方から考えて、判断できる", group: "q1", type: "A", reverse: false },
    { text: "質問7: 複雑なものの中から、法則性や規則性を見つけ出すことに関心がある", group: "q1", type: "A", reverse: false },
    // --- 質問群2 (q2) ---
    { text: "質問8: 誰とでも気さくに話すことができる", group: "q2", type: "B", reverse: false },
    { text: "質問9: 人と話すことが好き", group: "q2", type: "B", reverse: false },
    { text: "質問10: 会議の進行役や会の幹事を率先してつとめる", group: "q2", type: "B", reverse: false },
    { text: "質問11: 初対面であっても、すぐに打ち解けた話ができる", group: "q2", type: "B", reverse: false },
    { text: "質問12: 仕事は、人と人とのつながりに重きをおいて進める", group: "q2", type: "B", reverse: false },
    { text: "質問13: 互いの協力やチームワークを大切にして仕事を進める", group: "q2", type: "B", reverse: false },
    { text: "質問14: 困っているメンバーを見ると、すぐに手助けする", group: "q2", type: "B", reverse: false },
    // --- 質問群3 (q3) ---
    { text: "質問15: 他人のやり方を認めることができる", group: "q3", type: "C", reverse: false },
    { text: "質問16: まず相手の意見を聞いてから自分の意見を言う", group: "q3", type: "C", reverse: false },
    { text: "質問17: 事を荒立てるようなことはしない", group: "q3", type: "C", reverse: false },
    { text: "質問18: 周りとの調和を大切にしながらものごとを進めている", group: "q3", type: "C", reverse: false },
    { text: "質問19: 相手の気持ちをくみながら仕事を進められる", group: "q3", type: "C", reverse: false },
    { text: "質問20: 他者の意見に最後までしっかりと耳を傾けられる", group: "q3", type: "C", reverse: false },
    { text: "質問21: 相手の話をよく聞いて、気持ちを受け止めようとする", group: "q3", type: "C", reverse: false },
    // --- 質問群4 (q4) ---
    { text: "質問22: 発言する際は、よく考えてから発言する", group: "q4", type: "D", reverse: false },
    { text: "質問23: ひとり静かに、黙々と仕事が進められる", group: "q4", type: "D", reverse: false },
    { text: "質問24: 自らの考えに固執することなく、柔軟に対応することができる", group: "q4", type: "D", reverse: false },
    { text: "質問25: 何事も石橋をたたいて渡るほうだ", group: "q4", type: "D", reverse: false },
    { text: "質問26: 仕事は手順・段取りを考えて効率よく進めようとする", group: "q4", type: "D", reverse: false },
    { text: "質問27: 論理に飛躍や矛盾がないように説明することができる", group: "q4", type: "D", reverse: false },
    { text: "質問28: ものごとを筋道立てて考えられる", group: "q4", type: "D", reverse: false },
];

// ★ 2. 点数 (変更不要)
const scoresPoints = [1, 2, 3, 4, 5, 6];

// ★ 3. タイプマッピング (変更不要)
const typeMapping = {
    A: 'L',
    B: 'I',
    C: 'S',
    D: 'T'
};

// ★ 4. 総質問数を定義
const TOTAL_QUESTIONS = 28; // 全体の質問総数 (28問)

// ----- 診断ロジック（修正版） -----

document.addEventListener('DOMContentLoaded', () => {

    const quizArea = document.getElementById('quiz-area');
    const nextButton = document.getElementById('next-button');

    // 【変更点 1】 進捗バーの要素を取得
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');

    // 1. ページ情報をボタンから取得
    const currentPage = nextButton.dataset.page; // 'q1', 'q2', 'q3', 'q4'
    const nextPage = nextButton.dataset.next;

    // 2. このページに表示する質問をフィルタリング
    const pageQuestions = questions.filter(q => q.group === currentPage);
    const questionsOnThisPage = pageQuestions.length; // このページの質問数 (7)

    let pageAnswers = {};

    // 【変更点 2】 進捗の「開始時点」での回答数を計算
    let answeredQuestionsOffset = 0; // このページが始まる前の回答数
    if (currentPage === 'q2') answeredQuestionsOffset = 7;  // (q1の7問)
    if (currentPage === 'q3') answeredQuestionsOffset = 14; // (q1+q2の14問)
    if (currentPage === 'q4') answeredQuestionsOffset = 21; // (q1+q2+q3の21問)


    // 3. 質問をHTMLに描画
    pageQuestions.forEach((question, index) => {
        const qBlock = document.createElement('div');
        qBlock.classList.add('question-block');

        const qText = document.createElement('h3');
        qText.classList.add('question-text');
        qText.textContent = question.text;
        qBlock.appendChild(qText);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options-container');

        for (let i = 0; i < 6; i++) {
            const button = document.createElement('button');
            button.classList.add('option-button');
            button.dataset.questionIndex = index;
            button.dataset.optionIndex = i;

            const circle = document.createElement('div');
            circle.classList.add('option-circle');
            button.appendChild(circle);

            button.addEventListener('click', () => {
                // 4. クリック時の処理
                handleOptionClick(button, index, i);

                // 【変更点 3】 クリックするたびに進捗を更新
                updateProgress();
            });
            optionsDiv.appendChild(button);
        }

        qBlock.appendChild(optionsDiv);
        quizArea.appendChild(qBlock);
    });

    // 4. 選択肢クリック時の処理 (ロジックは変更なし)
    function handleOptionClick(clickedButton, questionIndex, optionIndex) {
        pageAnswers[questionIndex] = optionIndex; // 回答を記録

        // デザイン処理 (ハイライト)
        const allButtonsForThisQuestion = document.querySelectorAll(`.option-button[data-question-index="${questionIndex}"]`);
        allButtonsForThisQuestion.forEach(btn => btn.classList.remove('selected'));
        clickedButton.classList.add('selected');

        // 5. 全問回答したかチェック
        checkAllAnswered();
    }

    // 5. 全問回答チェック (ロジックは変更なし)
    function checkAllAnswered() {
        if (Object.keys(pageAnswers).length === questionsOnThisPage) {
            nextButton.disabled = false; // ボタンを有効化
        }
    }

    // 【変更点 4】 進捗バー更新関数 (ロジックを修正)
    function updateProgress() {
        // このページで回答済みの質問数
        const answeredOnThisPage = Object.keys(pageAnswers).length;

        // 全体での回答済み質問数
        const totalAnswered = answeredQuestionsOffset + answeredOnThisPage;

        // パーセンテージ計算 (例: (0 + 1) / 28 -> 3.57% -> 4%)
        // (例: (21 + 7) / 28 -> 100%)
        const progressPercent = Math.round((totalAnswered / TOTAL_QUESTIONS) * 100);

        // HTML側の固定幅 (例: 25%) を上書きする
        if (progressBar && progressText) {
            progressBar.style.width = progressPercent + '%';
            progressText.textContent = progressPercent + '%';
        }
    }

    // 7. 「次へ」または「診断する」ボタン (ロジックは変更なし)
    nextButton.addEventListener('click', () => {
        saveScores();
        if (nextPage === 'calculate') {
            calculateResult();
        } else {
            window.location.href = nextPage;
        }
    });

    // 8. 点数計算・保存 (ロジックは変更なし)
    function saveScores() {
        let totalScores;
        if (currentPage === 'q1') {
            totalScores = { A: 0, B: 0, C: 0, D: 0 };
        } else {
            totalScores = JSON.parse(localStorage.getItem('totalScores')) || { A: 0, B: 0, C: 0, D: 0 };
        }

        pageQuestions.forEach((question, index) => {
            const optionIndex = pageAnswers[index];
            let point = scoresPoints[optionIndex];
            if (question.reverse) {
                point = (scoresPoints.length + 1) - point;
            }
            totalScores[question.type] += point;
        });
        localStorage.setItem('totalScores', JSON.stringify(totalScores));
    }

    // 9. 最終結果の計算とリダイレクト (ロジックは変更なし)
    function calculateResult() {
        const finalScores = JSON.parse(localStorage.getItem('totalScores'));

        const sortedScores = Object.entries(finalScores)
            .map(([type, score]) => ({ type: type, score: score }))
            .sort((a, b) => b.score - a.score);

        const mainGroup = sortedScores[0].type;
        const subGroup = sortedScores[1].type;

        const mainType = typeMapping[mainGroup];
        const subType = typeMapping[subGroup];
        const finalType = mainType + subType;

        localStorage.removeItem('totalScores');
        window.location.href = `result_${finalType}.html`;
    }

    // 【変更点 5】 ページ読み込み時に、現在の進捗（例: q2なら7問回答済みの25%）を反映
    updateProgress();
});