import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserEntity} from "../../../entity/user-entity";
import {Subscription} from "rxjs";
import {AuthenticationContextService} from "../../../service/authentication-context.service";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {

  currentUser: UserEntity | null = null;
  currentUserSubscription$!: Subscription;

  constructor(private authenticationContextService: AuthenticationContextService) {
  }

  ngOnInit(): void {
    this.currentUserSubscription$ = this.authenticationContextService.userDetails$
      .subscribe(userDetails => this.currentUser = userDetails.user);
  }

  ngOnDestroy(): void {
    if (this.currentUserSubscription$ != undefined) {
      this.currentUserSubscription$.unsubscribe();
    }
  }

}
