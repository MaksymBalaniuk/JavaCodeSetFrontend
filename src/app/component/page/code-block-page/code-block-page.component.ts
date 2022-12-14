import {Component, OnInit} from '@angular/core';
import {DataLoadContextService, LoadContext} from "../../../service/data-load-context.service";

@Component({
  selector: 'app-code-block-page',
  templateUrl: './code-block-page.component.html',
  styleUrls: ['./code-block-page.component.scss']
})
export class CodeBlockPageComponent implements OnInit {

  constructor(private dataLoadContextService: DataLoadContextService) {
  }

  ngOnInit(): void {
  }

  isLoadContextCodeBlockView(): boolean {
    return this.dataLoadContextService.loadContext == LoadContext.CODE_BLOCK_VIEW;
  }

  isLoadContextCodeBlockEdit(): boolean {
    return this.dataLoadContextService.loadContext == LoadContext.CODE_BLOCK_EDIT;
  }

  isLoadContextCodeBlockNotSelected(): boolean {
    return this.dataLoadContextService.loadContext != LoadContext.CODE_BLOCK_VIEW &&
      this.dataLoadContextService.loadContext != LoadContext.CODE_BLOCK_EDIT;
  }
}
