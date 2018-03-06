import module from 'module';
import 'common/serverSentEventsClient';

import templateUrl from '../displayData.template.html';

module.component('fetchServerSentEvents', {
  templateUrl,
  bindings: {
    'dataSize': '<',
  },
  controller: class {
    constructor(serverSentEventsClient) {
      this.serverSentEventsClient = serverSentEventsClient;
    }

    $onInit() {
      this.fetchData();
    }

    fetchData() {
      this.data = [];
      const startTime = performance.now();
      this.sub = this.serverSentEventsClient.get(`/api/dataSse?limit=${this.dataSize}`)
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