import { HttpClient }        from '@angular/common/http';
import { Injectable }        from '@angular/core';
import { MatIconRegistry, IconResolver }   from '@angular/material/icon';
import { DomSanitizer }                             from '@angular/platform-browser';
import { catchError, map, Observable, of, timeout } from 'rxjs';
import { Feature }                                  from '../models/aixm/feature';
import { ApiResponse }       from '../models/api-response';
import { BackendApiService } from './backend-api.service';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  private url: string = 'aixm/features';
  private features: Feature[] = [];
  private defaultSvgIcon: string = 'assets/images/icons/AIXM/default.svg';

  constructor(
      private backendApiService: BackendApiService,
      private matIconRegistry: MatIconRegistry,
      private domSanitizer: DomSanitizer,
      private httpClient: HttpClient
  ) {
    const resolver: IconResolver = (name: string) => domSanitizer.bypassSecurityTrustResourceUrl(`assets/images/icons/AIXM/${name}/${name}.svg`);
    matIconRegistry.addSvgIconResolver(resolver);

  }

  public initIcons(): void {
    this.refreshFeatures();

  }

  private refreshFeatures(): void {
    this.backendApiService.getData(this.url).subscribe((data: ApiResponse): void => {
      // console.log(data);
      if (data.data) {
        this.features = data.data;
        this.features.forEach((feature: Feature): void => {
          let url: string = `assets/images/icons/AIXM/${feature.abbreviation}/${feature.abbreviation}.svg`;
          // this.matIconRegistry.addSvgIcon(feature.abbreviation, this.domSanitizer.bypassSecurityTrustResourceUrl(url));
          this.fileExists(url).subscribe((exists: boolean): void => {
            if (exists) {
              this.matIconRegistry.addSvgIcon(feature.abbreviation, this.domSanitizer.bypassSecurityTrustResourceUrl(url));
            } else {
              this.matIconRegistry.addSvgIcon(feature.abbreviation, this.domSanitizer.bypassSecurityTrustResourceUrl(this.defaultSvgIcon));
            }
          });
        });
      }
    });
  }

  private fileExists(url: string): Observable<boolean> {
    return this.httpClient.get(url,{ observe: 'response', responseType: 'blob' })
        .pipe(map((): boolean => true), catchError(() => of(false)));
  }

}
