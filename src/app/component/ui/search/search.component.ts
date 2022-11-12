import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from "../../../service/search.service";
import {DataLoadContextService} from "../../../service/data-load-context.service";
import {PaginatorService} from "../../../service/paginator.service";

export interface FilterCodeBlockTask {
  name: string;
  completed: boolean;
  subtasks?: FilterCodeBlockTask[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  allComplete: boolean = true;
  filterQuery = '';

  task: FilterCodeBlockTask = {
    name: 'All',
    completed: true,
    subtasks: [
      {name: 'Title', completed: true},
      {name: 'Tag', completed: true},
      {name: 'Description', completed: true},
      {name: 'Content', completed: true}
    ]
  };

  constructor(private searchService: SearchService,
              public paginatorService: PaginatorService,
              public dataLoadContextService: DataLoadContextService) {
  }

  ngOnInit(): void {
    this.paginatorService.initOptions();
  }

  ngOnDestroy(): void {
    this.searchService.clear();
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    this.search();
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => (t.completed = completed));
    this.search();
  }

  search() {
    this.searchService.filterQuery = this.filterQuery;
    this.searchService.filterCodeBlockTask = this.task;
    this.dataLoadContextService.loadLastFilteredCodeBlocksContext();
  }
}
