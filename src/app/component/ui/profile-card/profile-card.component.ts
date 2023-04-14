import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserEntity} from "../../../entity/user-entity";
import {Subscription} from "rxjs";
import {AuthenticationService} from "../../../service/api/authentication.service";
import {UserPremium} from "../../../enumeration/user-premium";
import {AuthenticationContextService} from "../../../service/authentication-context.service";
import {UserDetails} from "../../../entity/user-details";
import {UserPermissions} from "../../../dto/user-permissions";
import {UserService} from "../../../service/api/user.service";

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit, OnDestroy {

  @Input() user!: UserEntity | null;
  @Input() token!: string;
  @Input() marginTop: string = '0px';
  currentUserDetails!: UserDetails;
  currentUserPermissions!: UserPermissions;

  getAuthenticatedUserSubscription$!: Subscription;
  currentUserDetailsSubscription$!: Subscription;
  currentUserPermissionsSubscription$!: Subscription;
  activateUserByIdSubscription$!: Subscription;
  banUserByIdSubscription$!: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private authenticationContextService: AuthenticationContextService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserDetailsSubscription$ = this.authenticationContextService.userDetails$
      .subscribe(userDetails => this.currentUserDetails = userDetails);
    this.currentUserPermissionsSubscription$ = this.authenticationContextService.userPermissions$
      .subscribe(userPermissions => this.currentUserPermissions = userPermissions);
    if (this.token != undefined && this.token != '') {
      this.getAuthenticatedUserSubscription$ = this.authenticationService.getAuthenticatedUser(this.token)
        .subscribe(userEntity => this.user = userEntity);
    }
  }

  ngOnDestroy(): void {
    if (this.currentUserDetailsSubscription$ != undefined) {
      this.currentUserDetailsSubscription$.unsubscribe();
    }
    if (this.currentUserDetailsSubscription$ != undefined) {
      this.currentUserDetailsSubscription$.unsubscribe();
    }
    if (this.getAuthenticatedUserSubscription$ != undefined) {
      this.getAuthenticatedUserSubscription$.unsubscribe();
    }
    if (this.activateUserByIdSubscription$ != undefined) {
      this.activateUserByIdSubscription$.unsubscribe();
    }
    if (this.banUserByIdSubscription$ != undefined) {
      this.banUserByIdSubscription$.unsubscribe();
    }
  }

  getUserStatus(): string {
    if (this.user != null) {
      return this.user.status.toLowerCase();
    }
    return '';
  }

  getUserPremium(): string {
    if (this.user != null) {
      if (this.user.premium == UserPremium.NONE) {
        return 'no';
      } else if (this.user.premium == UserPremium.ORDINARY) {
        return 'regular';
      } else if (this.user.premium == UserPremium.UNLIMITED) {
        return 'unlimited';
      }
    }
    return '';
  }

  getUserCreated(): number {
    if (this.user != null) {
      return this.user.created;
    }
    return 0;
  }

  isProfileActionsAvailable(): boolean {
    return this.currentUserDetails != null &&
      this.currentUserDetails.user != null &&
      this.user != null &&
      this.currentUserDetails.user.id != this.user.id &&
      this.currentUserPermissions.userBanPermission;
  }

  isBanActionAvailable(): boolean {
    return this.currentUserPermissions.userBanPermission;
  }

  activateUser(): void {
    const currentUserDetails = this.currentUserDetails;
    if (this.user != null) {
      if (this.activateUserByIdSubscription$ != undefined) {
        this.activateUserByIdSubscription$.unsubscribe();
      }

      this.activateUserByIdSubscription$ = this.userService
        .activateUserById(this.user.id, currentUserDetails.token)
        .subscribe(userEntity => this.user = userEntity);
    }
  }

  banUser(): void {
    const currentUserDetails = this.currentUserDetails;
    if (this.user != null) {
      if (this.banUserByIdSubscription$ != undefined) {
        this.banUserByIdSubscription$.unsubscribe();
      }

      this.banUserByIdSubscription$ = this.userService
        .banUserById(this.user.id, currentUserDetails.token)
        .subscribe(userEntity => this.user = userEntity);
    }
  }
}
