import { Pipe, PipeTransform } from '@angular/core';
import {CodeBlockEntity} from "../entity/code-block-entity";
import {PaginatorService} from "../service/paginator.service";

@Pipe({
  name: 'codeBlockPaginator'
})
export class CodeBlockPaginatorPipe implements PipeTransform {

  constructor(private paginatorService: PaginatorService) {
  }

  transform(codeBlocks: Array<CodeBlockEntity> | null): Array<CodeBlockEntity> | null {
    if (codeBlocks == null) {
      return codeBlocks;
    } else {
      let startIndex = this.paginatorService.pageIndex * this.paginatorService.pageSize;
      let lastIndex = startIndex + this.paginatorService.pageSize;
      return codeBlocks.slice(startIndex, lastIndex);
    }
  }
}
