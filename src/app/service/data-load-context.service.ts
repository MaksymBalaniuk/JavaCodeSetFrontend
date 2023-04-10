import {Injectable} from '@angular/core';
import {UserDetails} from "../entity/user-details";
import {CodeBlockEntity} from "../entity/code-block-entity";
import {LoadContext} from "../enumeration/load-context";
import {Subject, Subscription} from "rxjs";
import {SearchService} from "./search.service";
import {CodeBlockService} from "./api/code-block.service";
import {AuthenticationContextService} from "./authentication-context.service";
import {CodeBlockType} from "../enumeration/code-block-type";
import {EstimateType} from "../enumeration/estimate-type";
import {FilterCodeBlockTask} from "../entity/filter-code-block-task";
import {FilterCodeBlock} from "../dto/filter-code-block";
import {ShareEntity} from "../entity/share-entity";
import {ShareService} from "./api/share.service";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class DataLoadContextService {

  private loadContext = LoadContext.PUBLIC_CODE_BLOCKS;
  private currentCodeBlock!: CodeBlockEntity | null;
  userDetails!: UserDetails;
  codeBlocks$ = new Subject<Array<CodeBlockEntity>>();
  shares$ = new Subject<Array<ShareEntity>>();

  getAllFilteredCodeBlocksSubscription$!: Subscription;
  getAllFilteredCodeBlocksByUserIdSubscription$!: Subscription;
  getAllFilteredCodeBlocksByUserIdAndEstimateTypeSubscription$!: Subscription;
  getAllSharesToUserIdSubscription$!: Subscription;

  constructor(private searchService: SearchService,
              private codeBlockService: CodeBlockService,
              private shareService: ShareService,
              private authenticationContextService: AuthenticationContextService,
              private localStorageService: LocalStorageService) {
    authenticationContextService.userDetails$.subscribe(userDetails => {
      this.userDetails = userDetails;
      const localLoadContext = this.localStorageService.getLoadContext();
      const localCurrentCodeBlock = this.localStorageService.getCurrentCodeBlock();
      if (userDetails.user == null) {
        if (localLoadContext == LoadContext.CODE_BLOCK_EDIT ||
          localLoadContext == LoadContext.CODE_BLOCK_VIEW) {
          if (localCurrentCodeBlock == null) {
            this.setLoadContext(LoadContext.PUBLIC_CODE_BLOCKS);
          } else {
            this.setLoadContext(LoadContext.CODE_BLOCK_VIEW);
          }
        }
      } else {
        this.setLoadContext(localLoadContext);
      }
      this.setCurrentCodeBlock(localCurrentCodeBlock);
      this.loadLastFilteredCodeBlocksContext();
    });
  }

  setLoadContext(loadContext: LoadContext): void {
    this.loadContext = loadContext;
    this.localStorageService.setLoadContext(loadContext);
  }

  getLoadContext(): LoadContext {
    return this.loadContext;
  }

  setCurrentCodeBlock(currentCodeBlock: CodeBlockEntity | null): void {
    this.currentCodeBlock = currentCodeBlock;
    if (currentCodeBlock == null) {
      this.localStorageService.removeCurrentCodeBlock();
    } else {
      this.localStorageService.setCurrentCodeBlock(currentCodeBlock);
    }
  }

  getCurrentCodeBlock(): CodeBlockEntity | null {
    return this.currentCodeBlock;
  }

  loadLastFilteredCodeBlocksContext(): void {
    if (this.getAllFilteredCodeBlocksSubscription$ != undefined) {
      this.getAllFilteredCodeBlocksSubscription$.unsubscribe();
    }
    if (this.getAllFilteredCodeBlocksByUserIdSubscription$ != undefined) {
      this.getAllFilteredCodeBlocksByUserIdSubscription$.unsubscribe();
    }
    if (this.getAllFilteredCodeBlocksByUserIdAndEstimateTypeSubscription$ != undefined) {
      this.getAllFilteredCodeBlocksByUserIdAndEstimateTypeSubscription$.unsubscribe();
    }
    if (this.getAllSharesToUserIdSubscription$ != undefined) {
      this.getAllSharesToUserIdSubscription$.unsubscribe();
    }

    if (this.loadContext == LoadContext.PUBLIC_CODE_BLOCKS) {
      this.loadFilteredCodeBlocks(CodeBlockType.PUBLIC);
    } else if (this.loadContext == LoadContext.PRIVATE_CODE_BLOCKS) {
      this.loadFilteredCodeBlocksByUserId(this.userDetails,
        CodeBlockType.PUBLIC, CodeBlockType.PRIVATE, CodeBlockType.HIDDEN);
    } else if (this.loadContext == LoadContext.FAVORITES_CODE_BLOCKS) {
      this.loadFilteredCodeBlocksByUserIdAndEstimateType(this.userDetails,
        EstimateType.LIKE, CodeBlockType.PUBLIC, CodeBlockType.PRIVATE);
    } else if (this.loadContext == LoadContext.SHARED_CODE_BLOCKS) {
      this.loadSharesToUserId(this.userDetails);
    }
  }

  loadFilteredCodeBlocks(...codeBlockTypes: Array<CodeBlockType>): void {
    this.getAllFilteredCodeBlocksSubscription$ = this.codeBlockService.getAllFilteredCodeBlocks(
      this.mapToFilterCodeBlock(
        this.searchService.filterQuery$.value, this.searchService.filterCodeBlockTask$.value, codeBlockTypes))
      .subscribe(codeBlocks => this.codeBlocks$.next(codeBlocks));
  }

  loadFilteredCodeBlocksByUserId(userDetails: UserDetails, ...codeBlockTypes: Array<CodeBlockType>): void {
    if (userDetails.user != null && userDetails.token != '') {
      this.getAllFilteredCodeBlocksByUserIdSubscription$ = this.codeBlockService.getAllFilteredCodeBlocksByUserId(
        userDetails.user.id, userDetails.token,
        this.mapToFilterCodeBlock(
          this.searchService.filterQuery$.value, this.searchService.filterCodeBlockTask$.value, codeBlockTypes))
        .subscribe(codeBlocks => this.codeBlocks$.next(codeBlocks));
    }
  }

  loadFilteredCodeBlocksByUserIdAndEstimateType(
    userDetails: UserDetails, estimateType: EstimateType, ...codeBlockTypes: Array<CodeBlockType>): void {
    if (userDetails.user != null && userDetails.token != '') {
      this.getAllFilteredCodeBlocksByUserIdAndEstimateTypeSubscription$ = this.codeBlockService
        .getAllFilteredCodeBlocksByUserIdAndEstimateType(userDetails.user.id, userDetails.token, estimateType,
          this.mapToFilterCodeBlock(
            this.searchService.filterQuery$.value, this.searchService.filterCodeBlockTask$.value, codeBlockTypes))
        .subscribe(codeBlocks => this.codeBlocks$.next(codeBlocks));
    }
  }

  loadSharesToUserId(userDetails: UserDetails): void {
    if (userDetails.user != null && userDetails.token != '') {
      this.getAllSharesToUserIdSubscription$ = this.shareService.getAllSharesToUserId(
        userDetails.user.id, userDetails.token)
        .subscribe(shares => this.shares$.next(shares));
    }
  }

  mapToFilterCodeBlock(filterQuery: string, filterCodeBlockTask: FilterCodeBlockTask,
                       codeBlockTypes: Array<CodeBlockType>): FilterCodeBlock {
    const subtasks = filterCodeBlockTask.subtasks;
    let result = {
      filterQuery: filterQuery,
      filterTitle: false,
      filterDescription: false,
      filterContent: false,
      filterTags: false,
      allowedTypes: codeBlockTypes
    }

    if (subtasks != undefined) {
      subtasks.forEach(subtask => {
        if (subtask.name == 'Title' && subtask.completed) {
          result.filterTitle = true;
        }
        if (subtask.name == 'Description' && subtask.completed) {
          result.filterDescription = true;
        }
        if (subtask.name == 'Content' && subtask.completed) {
          result.filterContent = true;
        }
        if (subtask.name == 'Tag' && subtask.completed) {
          result.filterTags = true;
        }
      });
    }

    return result;
  }
}
