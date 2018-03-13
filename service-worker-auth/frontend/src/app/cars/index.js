import module from 'module';

import templateUrl from './index.html';


module.component('cars', {
  templateUrl,
  controller: class {
    constructor(fileDownloader) {
      this.fileDownloader = fileDownloader;
    }
  }
});