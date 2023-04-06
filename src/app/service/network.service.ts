import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor() { }

  protocol = 'http';
  ip = 'localhost';
  port = '8090';

  getAddress(): string {
    return this.protocol + '://' + this.ip + ':' + this.port;
  }
}
