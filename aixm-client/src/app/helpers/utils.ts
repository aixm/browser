import { environment } from '../../environments/environment';
import { Feature }     from '../models/aixm/feature';


export function isValidUUID(str: string): boolean {
  const regexExp: RegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
}

export function copyToClipboard(val: string): void{
  const selBox: HTMLTextAreaElement = document.createElement('textarea');
  selBox.style.position = 'fixed';
  selBox.style.left = '0';
  selBox.style.top = '0';
  selBox.style.opacity = '0';
  selBox.value = val;
  document.body.appendChild(selBox);
  selBox.focus();
  selBox.select();
  document.execCommand('copy');
  document.body.removeChild(selBox);
}

export function getFeatureImagePath(feature: Feature | undefined): string {
  return `assets/images/icons/AIXM/${feature?.abbreviation}/${feature?.abbreviation}.svg`;
}

export function getFeatureDefaultImagePath(): string {
  return `assets/images/icons/AIXM/default.svg`;
}

export function getFeatureBrokenImagePath(): string {
  return `assets/images/icons/AIXM/broken.svg`;
}

export function getTitle(): string {
  return environment.appTitle;
}

export function handleErrorMissingFeatureImage(event: Event) {
  (event.target as HTMLImageElement).src = 'assets/images/icons/AIXM/default.svg';
}

export function getByKey(fromItems: any[], keyName: string, keyValue: any): any {
  const index: number  = fromItems.findIndex((element): boolean => {
    return element[keyName] === keyValue;
  });
  if (index >= 0 ) {
    return fromItems[index];
  }
  return null;
}

export function getById(fromItems: any[], id: any): any {
  return getByKey(fromItems, 'id', id)
}

export function hexToRgbA(hex: string, alfa: number): string {
  let c: any;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alfa+')';
  }
  return 'rgba(255,255,255,1)';
}

export function camelize(value: string) {
  return value.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
  });
}

export function toCamel(o: any): any {
  let newO;
  let origKey;
  let newKey;
  let value;
  if (o instanceof Array) {
    return o.map( (val) => {
      if (typeof val === 'object') {
        val = toCamel(val);
      }
      return val;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (Object.prototype.hasOwnProperty.call(o, origKey)) {
        newKey = origKey.replace(/(_\w)/g, (m: string) => {
          return m[1].toUpperCase();
        });
      }
      value = o[origKey];
      if (value instanceof Array || (value !== null && value.constructor === Object)) {
        value = toCamel(value);
      }
      // @ts-ignore
      newO[newKey] = value;
    }
  }
  return newO;
}
