import fs from 'fs';
import path from 'path';
import process from 'process';

class CsvResponse {
  constructor(filename) {
    this.filename = filename;
  }

  marshall(res, next) {
    fs.readFile(this.filename, 'utf8', (err, data) => {
      if(err) {
        next(err);
        return;
      }

      res.contentType('text/csv')
        .attachment('cars.csv')
        .status(200)
        .send(data);
    })
  }
}

class Cars {
  csv() {
    return new CsvResponse(path.resolve(process.cwd(), 'src', 'cars', 'cars.csv'))
  }
}


export default new Cars();