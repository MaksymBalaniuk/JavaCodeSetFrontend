import {Component, OnDestroy, OnInit} from '@angular/core';
import {PremiumLimits} from "../../../dto/premium-limits";
import {Subscription} from "rxjs";
import {CodeBlockEntity} from "../../../entity/code-block-entity";
import {AuthenticationContextService} from "../../../service/authentication-context.service";
import {DataLoadContextService} from "../../../service/data-load-context.service";
import {PaginatorService} from "../../../service/paginator.service";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {LoadContext} from "../../../enumeration/load-context";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  addCodeBlockButtonVisible = false;
  currentUserPremiumLimits!: PremiumLimits;
  codeBlocks: Array<CodeBlockEntity> = [];

  currentUserPremiumLimitsSubscription$!: Subscription;
  codeBlocksSubscription$!: Subscription;

  constructor(public authenticationContextService: AuthenticationContextService,
              public dataLoadContextService: DataLoadContextService,
              private paginatorService: PaginatorService) { }

  ngOnInit(): void {
    this.codeBlocksSubscription$ = this.dataLoadContextService.codeBlocks$
      .subscribe(codeBlocks => this.codeBlocks = codeBlocks);
    this.currentUserPremiumLimitsSubscription$ =
      this.authenticationContextService.userPremiumLimits$.subscribe(premiumLimits => {
        this.currentUserPremiumLimits = premiumLimits;
        if (this.dataLoadContextService.loadContext == LoadContext.CODE_BLOCK_VIEW ||
          this.dataLoadContextService.loadContext == LoadContext.CODE_BLOCK_EDIT) {
          this.loadPubicContext();
        } else {
          this.dataLoadContextService.loadLastFilteredCodeBlocksContext();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.currentUserPremiumLimitsSubscription$ != undefined) {
      this.currentUserPremiumLimitsSubscription$.unsubscribe();
    }
    if (this.codeBlocksSubscription$ != undefined) {
      this.codeBlocksSubscription$.unsubscribe();
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
    this.paginatorService.initOptions();
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
    this.dataLoadContextService.loadContext = loadContext;
    this.dataLoadContextService.loadLastFilteredCodeBlocksContext();
  }

  addNewCodeBlock(): void {
    this.dataLoadContextService.currentCodeBlock = null;
    this.dataLoadContextService.loadContext = LoadContext.CODE_BLOCK_EDIT;
  }
}
