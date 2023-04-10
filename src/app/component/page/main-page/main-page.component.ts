import {Component, OnDestroy, OnInit} from '@angular/core';
import {PremiumLimits} from "../../../dto/premium-limits";
import {Subscription} from "rxjs";
import {CodeBlockEntity} from "../../../entity/code-block-entity";
import {AuthenticationContextService} from "../../../service/authentication-context.service";
import {DataLoadContextService} from "../../../service/data-load-context.service";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {LoadContext} from "../../../enumeration/load-context";
import {NavigationService} from "../../../service/navigation.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  selectedTabIndex = 0;
  addCodeBlockButtonVisible = false;
  currentUserPremiumLimits!: PremiumLimits;
  codeBlocks: Array<CodeBlockEntity> = [];

  currentUserPremiumLimitsSubscription$!: Subscription;
  codeBlocksSubscription$!: Subscription;

  constructor(public authenticationContextService: AuthenticationContextService,
              public dataLoadContextService: DataLoadContextService,
              private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.codeBlocksSubscription$ = this.dataLoadContextService.codeBlocks$
      .subscribe(codeBlocks => this.codeBlocks = codeBlocks);
    this.currentUserPremiumLimitsSubscription$ =
      this.authenticationContextService.userPremiumLimits$.subscribe(premiumLimits => {
        this.currentUserPremiumLimits = premiumLimits;
        if (this.dataLoadContextService.getLoadContext() == LoadContext.CODE_BLOCK_VIEW ||
          this.dataLoadContextService.getLoadContext() == LoadContext.CODE_BLOCK_EDIT) {
          this.loadPubicContext();
        } else {
          this.dataLoadContextService.loadLastFilteredCodeBlocksContext();
        }
      });
    this.setSelectedTabByLoadContext(this.dataLoadContextService.getLoadContext());
    if (this.dataLoadContextService.getLoadContext() == LoadContext.PRIVATE_CODE_BLOCKS) {
      this.addCodeBlockButtonVisible = this.isAddCodeBlockButtonAvailable();
    }
  }

  ngOnDestroy(): void {
    if (this.currentUserPremiumLimitsSubscription$ != undefined) {
      this.currentUserPremiumLimitsSubscription$.unsubscribe();
    }
    if (this.codeBlocksSubscription$ != undefined) {
      this.codeBlocksSubscription$.unsubscribe();
    }
  }

  setSelectedTabByLoadContext(loadContext: LoadContext) {
    if (loadContext == LoadContext.PUBLIC_CODE_BLOCKS) {
      this.selectedTabIndex = 0;
    } else if (loadContext == LoadContext.PRIVATE_CODE_BLOCKS) {
      this.selectedTabIndex = 1;
    } else if (loadContext == LoadContext.FAVORITES_CODE_BLOCKS) {
      this.selectedTabIndex = 2;
    }
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index == 0) {
      this.loadPubicContext();
    } else if (tabChangeEvent.index == 1) {
      this.loadPrivateContext();
    } else if (tabChangeEvent.index == 2) {
      this.loadFavoritesContext();
    }
  }

  isAddCodeBlockButtonAvailable(): boolean {
    if (this.currentUserPremiumLimits != undefined) {
      return this.codeBlocks.length < this.currentUserPremiumLimits.codeBlocksLimit;
    }
    return false;
  }

  loadPubicContext(): void {
    this.addCodeBlockButtonVisible = false;
    this.loadContext(LoadContext.PUBLIC_CODE_BLOCKS);
  }

  loadPrivateContext(): void {
    this.addCodeBlockButtonVisible = true;
    this.loadContext(LoadContext.PRIVATE_CODE_BLOCKS);
  }

  loadFavoritesContext(): void {
    this.addCodeBlockButtonVisible = false;
    this.loadContext(LoadContext.FAVORITES_CODE_BLOCKS);
  }

  loadContext(loadContext: LoadContext): void {
    this.dataLoadContextService.setLoadContext(loadContext);
    this.dataLoadContextService.loadLastFilteredCodeBlocksContext();
  }

  addNewCodeBlock(): void {
    this.dataLoadContextService.setCurrentCodeBlock(null);
    this.dataLoadContextService.setLoadContext(LoadContext.CODE_BLOCK_EDIT);
    this.navigationService.redirectToCodeBlockPage();
  }
}
