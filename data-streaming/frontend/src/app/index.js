import templateUrl from './index.html'

export default {
  templateUrl,
  controller: class App {
    constructor() {
      console.log('works!')
    }
  }
}