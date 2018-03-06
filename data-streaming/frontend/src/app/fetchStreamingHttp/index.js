import module from 'module';
import 'common/streamingHttpClient';

import templateUrl from '../displayData.template.html';

module.component('fetchStreamingHttp', {
  templateUrl,
  bindings: {
    'dataSize': '<',
  },
  controller: class {
    constructor(streamingHttpClient) {
      this.streamingHttpClient = streamingHttpClient;
    }

    $onInit() {
      this.fetchData();
    }

    fetchData() {
      this.data = [];
      const startTime = performance.now();
      this.sub = this.streamingHttpClient.get(`/api/dataObs?limit=${this.dataSize}`, '!.*')
        .subscribe(row => {
          this.data.push(row);
        }, null, () => {
          this.processedIn = performance.now() - startTime;
        })
    }

    $onDestroy() {
      this.sub.unsubscribe();
    }
  }
});