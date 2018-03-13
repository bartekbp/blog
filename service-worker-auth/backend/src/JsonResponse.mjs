export default class JsonResponse {
  constructor(status, body) {
    this.status = status;
    this.body = body;
  }

  marshall(res) {
    res.status(this.status).json(this.body);
  }
}