import { Observable } from 'rxjs/Observable';

import module from 'module';


module.service('serverSentEventsClient', class {
  constructor($rootScope) {
    this.$scope = $rootScope;
  }

  get(url) {
    return Observable.create(subscriber => {
      const source = new EventSource(url);

      source.onmessage = e => {
        this.$scope.$applyAsync(() => subscriber.next(JSON.parse(e.data)));
      };

      source.onerror = err => {
        if(err.eventPhase === EventSource.CLOSED) {
          this.$scope.$applyAsync(() => subscriber.complete());
          return;
        }

        this.$scope.$applyAsync(() => subscriber.error(err));
      };

      return () => source.close();
    });
  }
});