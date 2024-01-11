import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {
  constructor() {}

  setStyle(key: string, href: string): void {
    getLinkElementForKey(key).setAttribute("href", href);
    setTimeout((): void => {
      this.redefineThirdPartyStyles();
    }, 100);

  }

  removeStyle(key: string): void {
    const existingLinkElement: Element | null = getExistingLinkElementByKey(key);
    if (existingLinkElement) {
      document.head.removeChild(existingLinkElement);
    }
  }

  redefineThirdPartyStyles(): void {
    let styles: {property: string, replaceBy: string}[] = [
      { property: 'mtx-grid-outline-color', replaceBy: 'mat-table-row-item-outline-color' },
    ];
    styles.forEach((style: {property: string, replaceBy: string}): void => {
      const value: string = getComputedStyle(document.documentElement).getPropertyValue(`--${style.replaceBy}`);
      console.log(value);
      document.documentElement.style.setProperty(`--${style.property}`, value);
    });
  }
}

function getLinkElementForKey(key: string): Element {
  return getExistingLinkElementByKey(key) || createLinkElementWithKey(key);
}

function getExistingLinkElementByKey(key: string): Element | null {
  return document.head.querySelector(
      `link[rel="stylesheet"].${getClassNameForKey(key)}`
  );
}

function createLinkElementWithKey(key: string): HTMLLinkElement {
  const linkEl: HTMLLinkElement = document.createElement("link");
  linkEl.setAttribute("rel", "stylesheet");
  linkEl.classList.add(getClassNameForKey(key));
  document.head.appendChild(linkEl);
  return linkEl;
}

function getClassNameForKey(key: string): string {
  console.log(key);
  return `app-${key}`;
}
