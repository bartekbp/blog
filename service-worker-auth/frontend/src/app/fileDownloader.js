import contentDisposition from 'content-disposition';

import module from 'module';


module.service('fileDownloader', class {
  constructor($http) {
    this.$http = $http;
  }

  async download(url) {
    const response = await this.$http.get(url, {
      responseType: 'blob',
    });

    const blob = response.data;
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const dispositionHeader = response.headers('Content-Disposition');
    if(dispositionHeader) {
      const disposition = contentDisposition.parse(dispositionHeader);
      if(disposition.parameters && disposition.parameters.filename) {
        a.download = disposition.parameters.filename;
      }
    }

    a.href = objectUrl;
    a.click();
  }
});