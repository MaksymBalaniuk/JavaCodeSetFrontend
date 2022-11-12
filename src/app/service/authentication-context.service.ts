import { Injectable } from '@angular/core';
import {UserEntity} from "../entity/user-entity";
import {AuthenticationResponse} from "../dto/authentication-response";
import {UserService} from "./api/user.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {PremiumLimits} from "../dto/premium-limits";
import {UserPermissions} from "../dto/user-permissions";
import {AuthorityService} from "./api/authority.service";

export interface UserDetails {
  user: UserEntity | null;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationContextService {

  userDetails$ = new BehaviorSubject<UserDetails>({
    user: null,
    token: ''
  });

  userPremiumLimits$ = new BehaviorSubject<PremiumLimits>({
    codeBlocksLimit: 0,
    codeBlockContentLimit: 0,
    compilerContentLimit: 0
  });

  userPermissions$ = new BehaviorSubject<UserPermissions>({
    publicStorageManagementPermission: false,
    viewProfilePermission: false,
    userBanPermission: false,
    contentHidePermission: false
  });

  isAuthorized$ = new BehaviorSubject<boolean>(false);

  getUserSubscription$!: Subscription;
  getUserPremiumLimitsSubscription$!: Subscription;
  getUserPermissionsSubscription$!: Subscription;

  constructor(private userService: UserService, private authorityService: AuthorityService) {
  }

  login(authenticationResponse: AuthenticationResponse): void {
    if (this.getUserSubscription$ != undefined) {
      this.getUserSubscription$.unsubscribe();
    }
    this.getUserSubscription$ = this.userService.getUserById(authenticationResponse.id).subscribe(user => {
      const bearerToken = 'Bearer_' + authenticationResponse.token;
      this.userDetails$.next({
        user: user,
        token: bearerToken
      });
      this.updatePremiumLimits(user.id, bearerToken);
      this.updateUserPermissions(user.id, bearerToken);
      this.isAuthorized$.next(true);
    });
  }

  logout(): void {
    this.userDetails$.next({
      user: null,
      token: ''
    });
    this.userPremiumLimits$.next({
      codeBlocksLimit: 0,
      codeBlockContentLimit: 0,
      compilerContentLimit: 0
    });
    this.userPermissions$.next({
      publicStorageManagementPermission: false,
      viewProfilePermission: false,
      userBanPermission: false,
      contentHidePermission: false
    });
    this.isAuthorized$.next(false);
  }

  updatePremiumLimits(userId: string, token: string): void {
    if (this.getUserPremiumLimitsSubscription$ != undefined) {
      this.getUserPremiumLimitsSubscription$.unsubscribe();
    }
    this.getUserPremiumLimitsSubscription$ = this.userService.getUserPremiumLimits(userId, token)
      .subscribe(premiumLimits => this.userPremiumLimits$.next(premiumLimits));
  }

  updateUserPermissions(userId: string, token: string): void {
    if (this.getUserPermissionsSubscription$ != undefined) {
      this.getUserPermissionsSubscription$.unsubscribe();
    }
    this.getUserPremiumLimitsSubscription$ = this.authorityService.getUserPermissions(userId, token)
      .subscribe(userPermissions => this.userPermissions$.next(userPermissions));
  }
}
