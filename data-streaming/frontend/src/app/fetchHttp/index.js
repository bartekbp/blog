import { map, } from 'rxjs/operator';

import module from 'module';
import 'common/httpClient';

import templateUrl from '../displayData.template.html';

module.component('fetchHttp', {
  templateUrl,
  bindings: {
    'dataSize': '<',
  },
  controller: class {
    constructor(httpClient) {
      this.httpClient = httpClient;
    }

    $onInit() {
      this.fetchData();
    }

    fetchData() {
      const startTime = performance.now();
      this.sub = this.httpClient.get(`/api/dataObs?limit=${this.dataSize}`)
        .map(response => response.data)
        .subscribe(data => {
          this.data = data;
          this.processedIn = performance.now() - startTime;
        });
    }

    $onDestroy() {
      this.sub.unsubscribe();
    }
  }
});