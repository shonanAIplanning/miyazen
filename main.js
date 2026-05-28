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

});