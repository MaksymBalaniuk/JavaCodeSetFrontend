import { Injectable } from '@angular/core';
import {FilterCodeBlockTask} from "../component/ui/search/search.component";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  initFilterCodeBlockTask: FilterCodeBlockTask = {
    name: 'All',
    completed: true,
    subtasks: [
      {name: 'Title', completed: true},
      {name: 'Tag', completed: true},
      {name: 'Description', completed: true},
      {name: 'Content', completed: true}
    ]
  };

  filterQuery = '';
  filterCodeBlockTask: FilterCodeBlockTask = this.initFilterCodeBlockTask;

  constructor() {
  }

  clear(): void {
    this.filterQuery = '';
    this.filterCodeBlockTask = this.initFilterCodeBlockTask;
  }
}
