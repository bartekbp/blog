import '@babel/polyfill';
import fetchHandler from './fetchHandler';

self.addEventListener('install', function(event) {
  console.log('install');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  console.log('activate');
});

self.addEventListener('fetch', fetchHandler);