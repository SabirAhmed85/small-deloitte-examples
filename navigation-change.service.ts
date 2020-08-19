import { Subject, Observable, merge } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class NavigationChangeService {
  private _menuChanged$ = new Subject<void>();
  private _innerNavChanged$ = new Subject<string>();
  private _innerNavChangedForBreadcrumb$ = new Subject<string>();

  menuChange(): void {
    this._menuChanged$.next();
  }

  innerNavChange(currentSection: string, toBreadcrumbOnly: boolean = false): void {
    if (!toBreadcrumbOnly) {
      this._innerNavChanged$.next(currentSection);
      this._innerNavChangedForBreadcrumb$.next(currentSection);
    } else {
      this._innerNavChangedForBreadcrumb$.next(currentSection);
    }
  }

  get getMenuChanges$(): Observable<any> {
    return this._menuChanged$.asObservable();
  }

  getInnerNavChanges(forBreadcrumbOnly: boolean = false): Observable<any> {
    return forBreadcrumbOnly ?
      this._innerNavChangedForBreadcrumb$.asObservable() :
      merge(this._innerNavChanged$.asObservable(), this._innerNavChangedForBreadcrumb$.asObservable());
  }
}
