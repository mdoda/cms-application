import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Document} from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document [] = [
    new Document('1' , 'WDD 430', 'Web Full Stack', 'URL', null),
    new Document('1' , 'WDD 430', 'Web Full Stack', 'URL', null),
    new Document('1' , 'WDD 430', 'Web Full Stack', 'URL', null),
    new Document('1' , 'WDD 430', 'Web Full Stack', 'URL', null)
  ];
  constructor() { }

  ngOnInit() {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
