export class Dispositivo {
  publicIP: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;

  constructor(ip: string, nv: string, nn: string, so: string, vso: string) {
    this.publicIP = ip;
    this.browser = nv;
    this.browserVersion = nn;
    this.os = so;
    this.osVersion = vso;
  }
}
