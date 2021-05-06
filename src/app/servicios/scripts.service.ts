import { Injectable } from '@angular/core';

interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'oneDrive', src: 'assets/js/one-drive.js' }
];

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  /**
   * Funcion que llama 'loadScript' para cargar una lista de scripts en un componente específico
   * @param scripts Arreglo con los distntos scripts a cargar
   */
  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  removeScript(name: string) {
    const targetelement = 'script'; // Determine element type to create nodelist from
    const targetattr = 'src';
    const allsuspects = document.getElementsByTagName(targetelement);
    for (let i = allsuspects.length; i >= 0; i--) { // Search backwards within nodelist for matching elements to remove
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null
        && allsuspects[i].getAttribute(targetattr) === this.scripts[name].src) {
          allsuspects[i].parentNode.removeChild(allsuspects[i]);
        }
    }
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        script.async = true;
        script.defer = true;
        // console.log('scriptState', script. readyState);
        // console.log('script', script);
        if (script.readyState && script.onreadystatechange) {  // IE
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {  // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

}
