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

    // 画像モーダル（ライトボックス）の処理
    var modal = document.getElementById('image-modal');
    var modalImg = document.getElementById('modal-img');
    var captionText = document.getElementById('modal-caption');
    var closeBtn = document.querySelector('.modal-close');
    var slideImages = document.querySelectorAll('.hero-slide img');

    slideImages.forEach(function(img) {
        // カーソルスタイル変更のためのイベント追加
        img.style.cursor = 'zoom-in';
        
        img.addEventListener('click', function() {
            // 現在アクティブ（表示中）の画像のみを拡大対象とする（言語切り替えで隠れているものは除外）
            var style = window.getComputedStyle(this);
            if (style.display !== 'none') {
                openModal(this.src, this.alt);
            }
        });
    });

    function openModal(src, alt) {
        if (!modal || !modalImg || !captionText) return;
        modal.style.display = 'flex';
        // transitionを効かせるため僅かに遅延させてクラスを追加
        setTimeout(function() {
            modal.classList.add('is-open');
        }, 10);
        modalImg.src = src;
        captionText.innerHTML = alt;
        document.body.style.overflow = 'hidden'; // 背後のコンテンツスクロールを防止
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('is-open');
        // フェードアウトアニメーション後に非表示にする
        setTimeout(function() {
            modal.style.display = 'none';
        }, 400);
        document.body.style.overflow = ''; // スクロール再開
    }

    // 閉じるボタン押下時
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    // 背景クリック時（画像本体以外をクリックで閉じる）
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target !== modalImg) {
                closeModal();
            }
        });
    }

    // ESCキーで閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // スライドショーの左右ナビゲーション & 自動スクロール制御
    var sliderVisual = document.querySelector('.hero-visual');
    var sliderTrack = document.querySelector('.hero-slider-track');
    var slides = document.querySelectorAll('.hero-slide');
    var prevBtn = document.querySelector('.prev-btn');
    var nextBtn = document.querySelector('.next-btn');
    
    if (sliderVisual && sliderTrack && slides.length > 0) {
        var currentIndex = 0;
        var totalSlides = slides.length;
        var autoplayInterval;
        
        function showSlide(index) {
            if (index >= totalSlides) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = totalSlides - 1;
            } else {
                currentIndex = index;
            }
            sliderTrack.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        }
        
        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(function() {
                showSlide(currentIndex + 1);
            }, 6000); // 6秒ごとにスライド
        }
        
        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                showSlide(currentIndex - 1);
                startAutoplay(); // 手動操作後にオートプレイタイマーをリセット
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                showSlide(currentIndex + 1);
                startAutoplay(); // 手動操作後にオートプレイタイマーをリセット
            });
        }
        
        // マウスホバー中は一時停止、離れたら再開
        sliderVisual.addEventListener('mouseenter', stopAutoplay);
        sliderVisual.addEventListener('mouseleave', startAutoplay);
        
        // 初期起動
        startAutoplay();
    }

});