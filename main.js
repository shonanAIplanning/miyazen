// ページのHTMLが完全に読み込まれた後に処理を実行する
window.addEventListener('DOMContentLoaded', function() {
    
    // スクロール時に表示させたい「.fade-in」クラスを持つすべての要素を取得
    var fadeElements = document.querySelectorAll('.fade-in');

    // 画面内に入ってきたかを判定する仕組み（IntersectionObserver）を作成
    var observer = new IntersectionObserver(function(entries) {
        
        // 監視対象の要素を一つずつチェックする
        entries.forEach(function(entry) {
            
            // 要素が画面内に入っている状態（true）の場合
            if (entry.isIntersecting) {
                // CSSで定義してある「is-visible」クラスを付与して表示させる
                entry.target.classList.add('is-visible');
                // 一度表示された要素は、何度も動かないように監視を解除する
                observer.unobserve(entry.target);
            }
        });
        
    }, { rootMargin: '0px', threshold: 0.1 }); // オプション（画面の10%が入ったら判定）

    // 取得したすべてのフェードイン対象要素に対して、個別に監視を開始する
    fadeElements.forEach(function(el) {
        observer.observe(el);
    });

    // 言語切替の処理
    var langButtons = document.querySelectorAll('.lang-btn');
    var body = document.body;

    // ローカルストレージから保存された言語を読み込む（デフォルトは日本語）
    var savedLang = localStorage.getItem('preferred-lang') || 'ja';
    setLanguage(savedLang);

    langButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    function setLanguage(lang) {
        if (lang === 'en') {
            body.classList.add('lang-mode-en');
            body.classList.remove('lang-mode-ja');
            document.title = "Miyazen | Japanese Cuisine, Sushi & Soba in Miyakojima";
            var metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute("content", "A Japanese restaurant in Miyakojima highlighting the essence of local ingredients. Discover our seasonal Kaiseki course and updates via Instagram.");
            }
        } else {
            body.classList.add('lang-mode-ja');
            body.classList.remove('lang-mode-en');
            document.title = "みやぜん | 宮古島 日本料理・寿司・手打ち蕎麦";
            var metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute("content", "宮古島の素材を実直に引き出す日本料理店。一期一会のおまかせコースと、公式Instagramにて発信する限定ランチのご案内。");
            }
        }
        
        // アクティブなボタンのスタイルを更新
        langButtons.forEach(function(button) {
            if (button.getAttribute('data-lang') === lang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        // 選択された言語を保存
        localStorage.setItem('preferred-lang', lang);
    }

});