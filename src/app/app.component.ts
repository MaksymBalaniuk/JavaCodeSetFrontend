import { Component } from '@angular/core';
import {ModalService} from "./service/modal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'java-code-set';

  constructor(public modalService: ModalService) { }
}
