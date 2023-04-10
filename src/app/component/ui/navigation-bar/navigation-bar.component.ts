import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../../service/modal.service";
import {AuthenticationContextService} from "../../../service/authentication-context.service";
import {Subscription} from "rxjs";
import {UserPremium} from "../../../enumeration/user-premium";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnDestroy {

  username!: string;
  userPremium = false;

  userDetailsSubscription!: Subscription;

  constructor(public modalService: ModalService,
              public authenticationContextService: AuthenticationContextService) { }

  ngOnInit(): void {
    this.userDetailsSubscription = this.authenticationContextService.userDetails$.subscribe(userDetails => {
      if (userDetails.user == null) {
        this.username = '';
      } else {
        this.username = userDetails.user.username;
        this.userPremium = userDetails.user.premium != UserPremium.NONE;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userDetailsSubscription != undefined) {
      this.userDetailsSubscription.unsubscribe();
    }
  }
}
