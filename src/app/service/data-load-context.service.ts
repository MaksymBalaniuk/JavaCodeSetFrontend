import {Injectable} from '@angular/core';
import {CodeBlockEntity} from "../entity/code-block-entity";
import {SearchService} from "./search.service";
import {CodeBlockService} from "./api/code-block.service";
import {FilterCodeBlock} from "../dto/filter-code-block";
import {FilterCodeBlockTask} from "../component/ui/search/search.component";
import {Subject, Subscription} from "rxjs";
import {CodeBlockType} from "../enumeration/code-block-type";
import {AuthenticationContextService, UserDetails} from "./authentication-context.service";
import {EstimateType} from "../enumeration/estimate-type";

export enum LoadContext {
  PUBLIC_CODE_BLOCKS = 'PUBLIC_CODE_BLOCKS',
  PRIVATE_CODE_BLOCKS = 'PRIVATE_CODE_BLOCKS',
  FAVORITES_CODE_BLOCKS = 'FAVORITES_CODE_BLOCKS',
  CODE_BLOCK_VIEW = 'CODE_BLOCK_VIEW',
  CODE_BLOCK_EDIT = 'CODE_BLOCK_EDIT'
}

@Injectable({
  providedIn: 'root'
})
export class DataLoadContextService {

  userDetails!: UserDetails;
  codeBlocks$ = new Subject<Array<CodeBlockEntity>>();
  loadContext = LoadContext.PUBLIC_CODE_BLOCKS;
  currentCodeBlock!: CodeBlockEntity | null;
  codeBlockContentAutoFill = '';

  getAllFilteredCodeBlocksSubscription$!: Subscription;
  getAllFilteredCodeBlocksByUserIdSubscription$!: Subscription;
  getAllFilteredCodeBlocksByUserIdAndEstimateTypeSubscription$!: Subscription;

  constructor(private searchService: SearchService,
              private codeBlockService: CodeBlockService,
              private authenticationContextService: AuthenticationContextService) {
    authenticationContextService.userDetails$.subscribe(userDetails => {
      this.userDetails = userDetails;
      this.loadLastFilteredCodeBlocksContext();
    });
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

    if (this.loadContext == LoadContext.PUBLIC_CODE_BLOCKS) {
      this.loadFilteredCodeBlocks(CodeBlockType.PUBLIC);
    } else if (this.loadContext == LoadContext.PRIVATE_CODE_BLOCKS) {
      this.loadFilteredCodeBlocksByUserId(this.userDetails,
        CodeBlockType.PUBLIC, CodeBlockType.PRIVATE, CodeBlockType.HIDDEN);
    } else if (this.loadContext == LoadContext.FAVORITES_CODE_BLOCKS) {
      this.loadFilteredCodeBlocksByUserIdAndEstimateType(this.userDetails,
        EstimateType.LIKE, CodeBlockType.PUBLIC, CodeBlockType.PRIVATE);
    }
  }

  loadFilteredCodeBlocks(...codeBlockTypes: Array<CodeBlockType>): void {
    this.getAllFilteredCodeBlocksSubscription$ = this.codeBlockService.getAllFilteredCodeBlocks(
      this.mapToFilterCodeBlock(this.searchService.filterQuery, this.searchService.filterCodeBlockTask))
      .subscribe(codeBlocks => {
      this.codeBlocks$.next(codeBlocks.filter(codeBlock =>
        codeBlockTypes.some(codeBlockType => codeBlock.type == codeBlockType)));
    });
  }

  loadFilteredCodeBlocksByUserId(userDetails: UserDetails, ...codeBlockTypes: Array<CodeBlockType>): void {
    if (userDetails.user != null && userDetails.token != '') {
      this.getAllFilteredCodeBlocksByUserIdSubscription$ = this.codeBlockService.getAllFilteredCodeBlocksByUserId(
        userDetails.user.id, userDetails.token,
        this.mapToFilterCodeBlock(this.searchService.filterQuery, this.searchService.filterCodeBlockTask))
        .subscribe(codeBlocks => {
          this.codeBlocks$.next(codeBlocks.filter(codeBlock =>
            codeBlockTypes.some(codeBlockType => codeBlock.type == codeBlockType)));
        });
    }
  }

  loadFilteredCodeBlocksByUserIdAndEstimateType(
    userDetails: UserDetails, estimateType: EstimateType, ...codeBlockTypes: Array<CodeBlockType>): void {
    if (userDetails.user != null && userDetails.token != '') {
      this.getAllFilteredCodeBlocksByUserIdAndEstimateTypeSubscription$ = this.codeBlockService
        .getAllFilteredCodeBlocksByUserIdAndEstimateType(userDetails.user.id, userDetails.token, estimateType,
          this.mapToFilterCodeBlock(this.searchService.filterQuery, this.searchService.filterCodeBlockTask))
        .subscribe(codeBlocks => {
          this.codeBlocks$.next(codeBlocks.filter(codeBlock =>
            codeBlockTypes.some(codeBlockType => codeBlock.type == codeBlockType)));
        });
    }
  }

  mapToFilterCodeBlock(filterQuery: string, filterCodeBlockTask: FilterCodeBlockTask): FilterCodeBlock {
    const subtasks = filterCodeBlockTask.subtasks;
    let result = {
      filterQuery: filterQuery,
      filterTitle: false,
      filterDescription: false,
      filterContent: false,
      filterTags: false
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
