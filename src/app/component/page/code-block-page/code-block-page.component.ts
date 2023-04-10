import {Component, OnInit} from '@angular/core';
import {DataLoadContextService} from "../../../service/data-load-context.service";
import {LoadContext} from "../../../enumeration/load-context";

@Component({
  selector: 'app-code-block-page',
  templateUrl: './code-block-page.component.html',
  styleUrls: ['./code-block-page.component.scss']
})
export class CodeBlockPageComponent implements OnInit {

  constructor(private dataLoadContextService: DataLoadContextService) { }

  ngOnInit(): void {
    if (this.dataLoadContextService.getLoadContext() == LoadContext.CODE_BLOCK_VIEW &&
      this.dataLoadContextService.getCurrentCodeBlock() == null) {
      this.dataLoadContextService.setLoadContext(LoadContext.PUBLIC_CODE_BLOCKS);
    }
  }

  isLoadContextCodeBlockView(): boolean {
    return this.dataLoadContextService.getLoadContext() == LoadContext.CODE_BLOCK_VIEW;
  }

  isLoadContextCodeBlockEdit(): boolean {
    return this.dataLoadContextService.getLoadContext() == LoadContext.CODE_BLOCK_EDIT;
  }

  isLoadContextCodeBlockNotSelected(): boolean {
    return this.dataLoadContextService.getLoadContext() != LoadContext.CODE_BLOCK_VIEW &&
      this.dataLoadContextService.getLoadContext() != LoadContext.CODE_BLOCK_EDIT;
  }
}
