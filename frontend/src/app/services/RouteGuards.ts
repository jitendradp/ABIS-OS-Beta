import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {first, map} from "rxjs/operators";
import {UserService} from "./user.service";

@Injectable()
export class CanActivateRoute implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    return this.userService.createSession().pipe(map((auth) => {
      return true;
    })).pipe(first()); // this might not be necessary - ensure `first` is imported if you use it
  }
}
