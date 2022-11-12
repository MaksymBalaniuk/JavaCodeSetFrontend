import {Component, OnDestroy, OnInit} from '@angular/core';
import {ModalService} from "../../../service/modal.service";
import {AuthenticationContextService} from "../../../service/authentication-context.service";
import {Subscription} from "rxjs";
import {UserPremium} from "../../../enumeration/user-premium";
import {DataLoadContextService, LoadContext} from "../../../service/data-load-context.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent implements OnInit, OnDestroy {

  constructor(public modalService: ModalService,
              public authenticationContextService: AuthenticationContextService,
              private dataLoadContextService: DataLoadContextService,
              private router: Router) {
  }

  username!: string;
  userPremium = false;
  userDetailsSubscription!: Subscription;

  ngOnInit(): void {
    this.userDetailsSubscription = this.authenticationContextService.userDetails$.subscribe(userDetails => {
      if (userDetails.user == null) {
        this.username = '';
      } else {
        this.username = userDetails.user.username;
        this.userPremium = userDetails.user.premium != UserPremium.NONE;
      }
    })
  }

  ngOnDestroy(): void {
    if (this.userDetailsSubscription != undefined) {
      this.userDetailsSubscription.unsubscribe();
    }
  }

  logout(): void {
    if (this.dataLoadContextService.loadContext == LoadContext.CODE_BLOCK_EDIT) {
      this.dataLoadContextService.currentCodeBlock = null;
      this.dataLoadContextService.loadContext = LoadContext.PUBLIC_CODE_BLOCKS;
    }
    this.router.navigateByUrl('').then();
  }
}
