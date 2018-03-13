import module from 'module';
import parse from 'url-parse';
import './swService';

module.run((auth, fileDownloader, sw) => {
  document.addEventListener('click', event => {
    const target = event.target;
    if(target.tagName.toLowerCase() !== 'a') {
      return;
    }

    const path = parse(target.href).pathname;
    if(!path.startsWith('/api') || !sw.isRunning()) {
      event.preventDefault();
      fileDownloader.download(href);
    }
  });
});

import './authHttpInterceptor';
import './fileDownloader';
import './auth';
import './cars';
import './login';



