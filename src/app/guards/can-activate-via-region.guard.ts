import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {PreferencesService} from "../services/preferences.service";

@Injectable()
export class CanActivateViaRegionGuard implements CanActivate {

  constructor(private preferencesService: PreferencesService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.preferencesService.getPref('region') !== null;
  }
}
