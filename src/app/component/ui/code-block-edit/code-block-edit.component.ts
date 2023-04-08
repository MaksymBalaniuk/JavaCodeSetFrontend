import {Component, OnDestroy, OnInit} from '@angular/core';
import {CodeBlockEntity} from "../../../entity/code-block-entity";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import { Subscription } from 'rxjs';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DataLoadContextService} from "../../../service/data-load-context.service";
import {AuthenticationContextService} from "../../../service/authentication-context.service";
import {CodeBlockService} from "../../../service/api/code-block.service";
import {TagService} from "../../../service/api/tag.service";
import {MatChipInputEvent} from "@angular/material/chips";
import {CodeBlockType} from "../../../enumeration/code-block-type";
import {LoadContext} from "../../../enumeration/load-context";

@Component({
  selector: 'app-code-block-edit',
  templateUrl: './code-block-edit.component.html',
  styleUrls: ['./code-block-edit.component.scss']
})
export class CodeBlockEditComponent implements OnInit, OnDestroy {

  codeBlock: CodeBlockEntity | null = null;
  maxContentLength = 0;
  codeBlockContent = '';
  successContent = true;
  tags: Array<string> = [];
  loadedTags: Array<string> = [];
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  getAllTagsByCodeBlockIdSubscription$!: Subscription;
  currentUserDetailsSubscription$!: Subscription;
  currentUserPremiumLimitsSubscription$!: Subscription;

  form = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.maxLength(100)
    ]),
    description: new FormControl('', [
      Validators.maxLength(255)
    ])
  });

  constructor(private dataLoadContextService: DataLoadContextService,
              private authenticationContextService: AuthenticationContextService,
              private codeBlockService: CodeBlockService,
              private tagService: TagService) { }

  ngOnInit(): void {
    this.loadCodeBlock();
    this.currentUserPremiumLimitsSubscription$ = this.authenticationContextService.userPremiumLimits$
      .subscribe(premiumLimits => {
        this.maxContentLength = premiumLimits.codeBlockContentLimit;
      });
    if (this.dataLoadContextService.codeBlockContentClipboard != '') {
      this.codeBlockContent = this.dataLoadContextService.codeBlockContentClipboard;
    }
  }

  ngOnDestroy(): void {
    if (this.getAllTagsByCodeBlockIdSubscription$ != undefined) {
      this.getAllTagsByCodeBlockIdSubscription$.unsubscribe();
    }
    if (this.currentUserDetailsSubscription$ != undefined) {
      this.currentUserDetailsSubscription$.unsubscribe();
    }
    if (this.currentUserPremiumLimitsSubscription$ != undefined) {
      this.currentUserPremiumLimitsSubscription$.unsubscribe();
    }
    this.dataLoadContextService.codeBlockContentClipboard = '';
  }

  get title(): FormControl {
    return this.form.controls.title;
  }

  get description(): FormControl {
    return this.form.controls.description;
  }

  get titleErrorMessage(): string {
    if (this.form.controls.title.hasError('required')) {
      return 'You must enter a value';
    }
    return this.form.controls.title
      .hasError('maxlength') ? 'Title must contain no more than 100 characters' : '';
  }

  get descriptionErrorMessage(): string {
    return this.form.controls.description
      .hasError('maxlength') ? 'Description must contain no more than 255 characters' : '';
  }

  get contentErrorMessage(): string {
    if (this.codeBlockContent.trim().length == 0) {
      return 'Code field cannot be empty';
    }
    return this.codeBlockContent.trim().length > this.maxContentLength ?
      `Your premium code length limit ${this.maxContentLength}, now ${this.codeBlockContent.length}` : '';
  }

  retryInput(): void {
    this.successContent = true;
  }

  loadCodeBlock(): void {
    this.codeBlock = this.dataLoadContextService.currentCodeBlock;
    this.loadTags();
    this.loadFormFields();
  }

  loadTags(): void {
    if (this.codeBlock != null) {
      this.getAllTagsByCodeBlockIdSubscription$ = this.tagService.getAllTagsByCodeBlockId(this.codeBlock.id)
        .subscribe(tags => {
          this.tags = tags.map(tag => tag.name);
          this.loadedTags = tags.map(tag => tag.name);
        });
    }
  }

  loadFormFields(): void {
    if (this.codeBlock != null) {
      this.form = new FormGroup({
        title: new FormControl(this.codeBlock.title, [
          Validators.required,
          Validators.maxLength(100)
        ]),
        description: new FormControl(this.codeBlock.description, [
          Validators.maxLength(255)
        ])
      });
      this.codeBlockContent = this.codeBlock.content;
    }
  }

  successValidation(): boolean {
    return this.titleErrorMessage == '' &&
      this.descriptionErrorMessage == '' &&
      this.contentErrorMessage == '';
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tagName: string): void {
    const index = this.tags.indexOf(tagName);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  submit(): void {
    if (this.contentErrorMessage != '') {
      this.successContent = false;
    }
    if (this.successValidation() && this.successContent) {
      if (this.codeBlock == null) {
        this.createCodeBlock();
      } else {
        this.updateCodeBlock();
      }
    }
  }

  createCodeBlock(): void {
    if (this.currentUserDetailsSubscription$ != undefined) {
      this.currentUserDetailsSubscription$.unsubscribe();
    }

    this.currentUserDetailsSubscription$ = this.authenticationContextService.userDetails$
      .subscribe(userDetails => {
        if (userDetails.user != null) {
          const codeBlockEntity: CodeBlockEntity = {
            id: '',
            title: this.title.value,
            description: this.description.value,
            content: this.codeBlockContent,
            type: CodeBlockType.PRIVATE,
            created: 0,
            updated: 0,
            userId: userDetails.user.id
          }
          this.codeBlockService.createCodeBlock(codeBlockEntity, userDetails.token)
            .subscribe(codeBlock => {
              if (this.tags.length == 0 && this.loadedTags.length == 0) {
                this.dataLoadContextService.currentCodeBlock = codeBlock;
                this.dataLoadContextService.loadContext = LoadContext.CODE_BLOCK_VIEW;
              } else {
                this.updateCodeBlockTags(codeBlock, userDetails.token);
              }
            })
        }
      });
  }

  updateCodeBlock(): void {
    if (this.currentUserDetailsSubscription$ != undefined) {
      this.currentUserDetailsSubscription$.unsubscribe();
    }

    this.currentUserDetailsSubscription$ = this.authenticationContextService.userDetails$
      .subscribe(userDetails => {
        if (userDetails.user != null && this.codeBlock != null) {
          const codeBlockEntity: CodeBlockEntity = {
            id: this.codeBlock.id,
            title: this.title.value,
            description: this.description.value,
            content: this.codeBlockContent,
            type: this.codeBlock.type,
            created: this.codeBlock.created,
            updated: this.codeBlock.updated,
            userId: this.codeBlock.userId
          }

          this.codeBlockService.updateCodeBlock(codeBlockEntity, userDetails.token)
            .subscribe(codeBlock => {
              if (this.tags.length == 0 && this.loadedTags.length == 0) {
                this.dataLoadContextService.currentCodeBlock = codeBlock;
                this.dataLoadContextService.loadContext = LoadContext.CODE_BLOCK_VIEW;
              } else {
                this.updateCodeBlockTags(codeBlock, userDetails.token);
              }
            });
        }
      });
  }

  updateCodeBlockTags(codeBlock: CodeBlockEntity, token: string): void {
    this.tagService.getAllTagsByCodeBlockId(codeBlock.id)
      .subscribe(tags => {
        tags.forEach(tag => {
          if (!this.tags.includes(tag.name)) {
            this.tagService.deleteTagFromCodeBlock(tag.id, codeBlock.id, token).subscribe();
          }
        });
      });

    this.tags.forEach(tag => {
      if (!this.loadedTags.includes(tag)) {
        this.tagService.createTag({
          id: '',
          name: tag
        }, token).subscribe(tag => {
          this.tagService.addTagToCodeBlock(tag.id, codeBlock.id, token).subscribe();
        });
      }
    });


    this.delay(500).then(() => {
      this.dataLoadContextService.currentCodeBlock = codeBlock;
      this.dataLoadContextService.loadContext = LoadContext.CODE_BLOCK_VIEW;
    });
  }

  async delay(ms: number) {
    await new Promise<void>(resolve =>
      setTimeout(() => resolve(), ms)).then();
  }
}
