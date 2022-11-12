import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TagService} from "../../../service/api/tag.service";
import {UserService} from "../../../service/api/user.service";
import {EstimateService} from "../../../service/api/estimate.service";
import {SearchService} from "../../../service/search.service";
import {DataLoadContextService, LoadContext} from "../../../service/data-load-context.service";
import {CodeBlockEntity} from "../../../entity/code-block-entity";
import {UserEntity} from "../../../entity/user-entity";
import {TagEntity} from "../../../entity/tag-entity";
import {EstimateEntity} from "../../../entity/estimate-entity";
import {Subscription} from "rxjs";
import {EstimateType} from "../../../enumeration/estimate-type";

@Component({
  selector: 'app-code-block-card',
  templateUrl: './code-block-card.component.html',
  styleUrls: ['./code-block-card.component.scss']
})
export class CodeBlockCardComponent implements OnInit, OnDestroy {

  constructor(private tagService: TagService,
              private userService: UserService,
              private estimateService: EstimateService,
              private searchService: SearchService,
              private dataLoadContextService: DataLoadContextService) {
  }

  ngOnInit(): void {
    this.loadTags();
    this.loadUser();
    this.loadEstimates();
  }

  ngOnDestroy(): void {
    if (this.userSubscription$ != undefined) {
      this.userSubscription$.unsubscribe();
    }
    if (this.tagsSubscription$ != undefined) {
      this.tagsSubscription$.unsubscribe();
    }
    if (this.estimatesSubscription$ != undefined) {
      this.estimatesSubscription$.unsubscribe();
    }
  }

  @Input() codeBlock!: CodeBlockEntity;
  user!: UserEntity;
  tags!: Array<TagEntity>;
  estimates!: Array<EstimateEntity>;

  userSubscription$!: Subscription;
  tagsSubscription$!: Subscription;
  estimatesSubscription$!: Subscription;

  likes = 0;
  dislikes = 0;

  loadUser(): void {
    this.userSubscription$ = this.userService.getUserById(this.codeBlock.userId).subscribe(
      user => this.user = user
    );
  }

  loadTags(): void {
    this.tagsSubscription$ = this.tagService.getAllTagsByCodeBlockId(this.codeBlock.id).subscribe(
      tags => this.tags = tags
    );
  }

  loadEstimates(): void {
    this.estimatesSubscription$ = this.estimateService.getAllEstimatesByCodeBlockId(this.codeBlock.id).subscribe(
      estimates => {
        this.estimates = estimates;
        this.likes = estimates.filter(estimate => estimate.type == EstimateType.LIKE).length;
        this.dislikes = estimates.filter(estimate => estimate.type == EstimateType.DISLIKE).length;
      }
    );
  }

  searchByTag(tagName: string) {
    this.searchService.filterQuery = tagName;
    this.searchService.filterCodeBlockTask = {
      name: 'All',
      completed: false,
      subtasks: [
        {name: 'Title', completed: false},
        {name: 'Tag', completed: true},
        {name: 'Description', completed: false},
        {name: 'Content', completed: false}
      ]
    };
    this.dataLoadContextService.loadLastFilteredCodeBlocksContext();
  }

  viewCodeBlock(): void {
    this.dataLoadContextService.currentCodeBlock = this.codeBlock;
    this.dataLoadContextService.loadContext = LoadContext.CODE_BLOCK_VIEW;
  }
}
