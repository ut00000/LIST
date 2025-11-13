// ----- 診断の土台（設定項目） -----

// ★ 1. 全28問の質問データ
// 7問ごとに group を 'q1', 'q2', 'q3', 'q4' に分けてください。
const questions = [
    // --- 質問群1 (q1) ---
    { text: "質問1: 新しいことにも、しり込みせずに挑戦できる", group: "q1", type: "A", reverse: true },
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
    { text: "質問15: ", group: "q3", type: "C", reverse: false },
    { text: "質問16: ", group: "q3", type: "C", reverse: false },
    { text: "質問17: ", group: "q3", type: "C", reverse: false },
    { text: "質問18: ", group: "q3", type: "C", reverse: false },
    { text: "質問19: ", group: "q3", type: "C", reverse: false },
    { text: "質問20: ", group: "q3", type: "C", reverse: false },
    { text: "質問21: ", group: "q3", type: "C", reverse: false },
    // --- 質問群4 (q4) ---
    { text: "質問22: (グループDの質問)", group: "q4", type: "D", reverse: false },
    // ... (q4の残り6問) ...
    { text: "質問28: (グループAの質問)", group: "q4", type: "A", reverse: false },
];

// ★ 2. 点数 (変更不要)
// [反対(1点), ..., 賛成(6点)]
const scoresPoints = [1, 2, 3, 4, 5, 6];

// ★ 3. タイプマッピング (最終計算用)
// A, B, C, D がそれぞれどのアルファベットに対応するか
const typeMapping = {
    A: 'L',
    B: 'I',
    C: 'S',
    D: 'T'
    // 例: A: 'E', B: 'I', C: 'S', D: 'N' など
};

// ----- 診断ロジック（ここから下は変更不要） -----

document.addEventListener('DOMContentLoaded', () => {

    const quizArea = document.getElementById('quiz-area');
    const nextButton = document.getElementById('next-button');

    // 1. ページ情報をボタンから取得
    const currentPage = nextButton.dataset.page; // 'q1', 'q2', 'q3', 'q4'
    const nextPage = nextButton.dataset.next; // 'q2.html', 'q3.html', 'q_final.html', 'calculate'

    // 2. このページに表示する質問をフィルタリング
    const pageQuestions = questions.filter(q => q.group === currentPage);

    // このページの回答を一時的に保存するオブジェクト
    let pageAnswers = {}; // { 0: 3, 1: 5, ... } (質問インデックス: 点数インデックス)

    // 3. 質問をHTMLに描画
    pageQuestions.forEach((question, index) => {
        // 質問ブロックを作成
        const qBlock = document.createElement('div');
        qBlock.classList.add('question-block');

        // 質問文
        const qText = document.createElement('h3');
        qText.classList.add('question-text');
        qText.textContent = question.text;
        qBlock.appendChild(qText);

        // 選択肢コンテナ
        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options-container');

        // 6つの選択肢ボタンを生成
        for (let i = 0; i < 6; i++) {
            const button = document.createElement('button');
            button.classList.add('option-button');
            // このボタンがどの質問(index)のどの選択肢(i)か、データを保持
            button.dataset.questionIndex = index;
            button.dataset.optionIndex = i;

            const circle = document.createElement('div');
            circle.classList.add('option-circle');
            button.appendChild(circle);

            button.addEventListener('click', () => handleOptionClick(button, index, i));
            optionsDiv.appendChild(button);
        }

        qBlock.appendChild(optionsDiv);
        quizArea.appendChild(qBlock);
    });

    // 4. 選択肢クリック時の処理
    function handleOptionClick(clickedButton, questionIndex, optionIndex) {
        // 回答を保存
        pageAnswers[questionIndex] = optionIndex;

        // --- デザイン処理 (ハイライト) ---
        // 同じ質問(questionIndex)のボタンをすべて取得
        const allButtonsForThisQuestion = document.querySelectorAll(`.option-button[data-question-index="${questionIndex}"]`);
        // すべてのハイライトを解除
        allButtonsForThisQuestion.forEach(btn => btn.classList.remove('selected'));
        // クリックされたボタンだけハイライト
        clickedButton.classList.add('selected');

        // 5. 全問回答したかチェック
        checkAllAnswered();
    }

    // 6. 全問回答チェック
    function checkAllAnswered() {
        // pageQuestions.length (7問) と pageAnswersに保存された回答数が同じか
        if (Object.keys(pageAnswers).length === pageQuestions.length) {
            nextButton.disabled = false; // ボタンを有効化
        }
    }

    // 7. 「次へ」または「診断する」ボタンクリック時の処理
    nextButton.addEventListener('click', () => {
        // 8. 点数を計算して localStorage に保存
        saveScores();

        // 9. ページ遷移
        if (nextPage === 'calculate') {
            // 最終計算
            calculateResult();
        } else {
            // 次の質問ページへ
            window.location.href = nextPage;
        }
    });

    // 8. 点数計算・保存
    function saveScores() {
        // 既存の総合スコアをlocalStorageから読み込む (なければ初期化)
        let totalScores = JSON.parse(localStorage.getItem('totalScores')) || { A: 0, B: 0, C: 0, D: 0 };

        // このページの回答を点数化して加算
        pageQuestions.forEach((question, index) => {
            const optionIndex = pageAnswers[index]; // 0〜5
            let point = scoresPoints[optionIndex]; // 1〜6点

            if (question.reverse) {
                point = (scoresPoints.length + 1) - point;
            }

            // 対応するタイプ (A, B, C, D) に加算
            totalScores[question.type] += point;
        });

        // localStorageに保存
        localStorage.setItem('totalScores', JSON.stringify(totalScores));

        // 最初のページ (q1) だったら、前の結果を消す
        if (currentPage === 'q1') {
            // ...あ、q1の時に必ず初期化すべきですね。
            // saveScoresの先頭で初期化するように変更します。
        }
    }

    // 8. 点数計算・保存 (修正版)
    function saveScores() {
        let totalScores;

        // このページが q1 なら、スコアを必ずリセットする
        if (currentPage === 'q1') {
            totalScores = { A: 0, B: 0, C: 0, D: 0 };
        } else {
            // q2以降なら、既存のスコアを読み込む
            totalScores = JSON.parse(localStorage.getItem('totalScores')) || { A: 0, B: 0, C: 0, D: 0 };
        }

        // (以下の処理は同じ) ...
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


    // 9. 最終結果の計算とリダイレクト
    function calculateResult() {
        // 最終スコアを読み込む
        const finalScores = JSON.parse(localStorage.getItem('totalScores'));

        // {A: 50, B: 45, C: 30, D: 60} のような形式から、
        // [{type: 'D', score: 60}, {type: 'A', score: 50}, ...] のように変換してソート
        const sortedScores = Object.entries(finalScores)
            .map(([type, score]) => ({ type: type, score: score }))
            .sort((a, b) => b.score - a.score); // 点数が高い順

        // 1番目（メイン）と2番目（サブ）を取得
        const mainGroup = sortedScores[0].type;
        const subGroup = sortedScores[1].type;

        // アルファベットに変換
        const mainType = typeMapping[mainGroup];
        const subType = typeMapping[subGroup];

        const finalType = mainType + subType; // 例: "AD"

        // localStorageをクリア (診断が終わったため)
        localStorage.removeItem('totalScores');

        // 対応する結果ページにリダイレクト
        // (例: 'result_AD.html' へ)
        window.location.href = `result_${finalType}.html`;
    }

});