// sw.js: Service Workerファイルである。オフライン機能やPWAの基盤となる。

// キャッシュするアセットのバージョンと名前
const CACHE_NAME = 'tablit-cache-v1.1.0';

// キャッシュするファイルのリスト
// 基本的なファイルのみをキャッシュし、動的なコンテンツや外部CDNはキャッシュしない戦略
const urlsToCache = [
  './',
  './index.html'
];

// Service Workerのインストールイベント
// キャッシュストレージを開き、基本的なアセットをキャッシュする
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Service Workerのフェッチイベント
// リクエストされたリソースがキャッシュに存在すればそれを返し、なければネットワークから取得する
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュにヒットした場合、そのレスポンスを返す
        if (response) {
          return response;
        }
        // キャッシュになければ、ネットワークからリソースを取得する
        return fetch(event.request);
      })
  );
});

// Service Workerのアクティベートイベント
// 古いバージョンのキャッシュを削除する
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // ホワイトリストに含まれていないキャッシュは削除する
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});