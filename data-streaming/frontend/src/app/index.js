import 'rxjs/add/operator/do';

import module from 'module';

import './fetchHttp';
import './fetchStreamingHttp';
import './fetchServerSentEvents';

import templateUrl from './index.html';
import './index.scss';

module.component('app', {
  templateUrl,
  bindings: {
    dataSize: '<',
  },
  controller: class {}
});