import { Observable } from 'rxjs/Observable';
import Oboe from 'oboe';

import module from 'module';

module.service('streamingHttpClient', class {
  constructor($rootScope) {
    this.$scope = $rootScope;
  }

  get(config, pattern = '!') {
    return Observable.create(subscriber => {
      const oboe = Oboe(config)
        .start((status, headers) => {
          if (status < 200 || status >= 300) {
            oboe.abort();
            this.$scope.$applyAsync(() => subscriber.error(status, headers));
          }
        })
        .fail(error => {
          this.$scope.$applyAsync(() => subscriber.error(error));
        })
        .node(pattern, node => {
          this.$scope.$applyAsync(() => subscriber.next(node));
          return Oboe.drop;
        })
        .done(emptyJson => {
          this.$scope.$applyAsync(() => subscriber.complete());
          return Oboe.drop;
        });
      return () => oboe.abort();
    })
  }
});