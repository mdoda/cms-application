import { Injectable, EventEmitter } from '@angular/core';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Document } from './document.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DocumentService {

  documentChangedEvent = new Subject<Document[]>();

  selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document [] = [];

  maxDocumentId: number;

constructor() {
  this.documents = MOCKDOCUMENTS;
   this.maxDocumentId = this.getMaxId();
}

getDocuments(){
  return this.documents.slice();
}

getDocument(id: string){
  return this.documents.find((document) => document.id === id);
}

 deleteDocument(document: Document){
   if(!document){
     return;
   }

   const pos = this.documents.indexOf(document);

   if(pos<0){
     return;
   }
   this.documents.splice(pos,1);
   this.documentChangedEvent.next(this.documents.slice());
 }

 getMaxId(){
  return Math.max.apply(Math, this.documents.map((contact: Document) => contact.id));
  }


 addDocument(newDocument: Document){

    if(!newDocument){
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    this.documentChangedEvent.next(this.documents.slice());
 }

 updateDocument(originalDocument: Document, newDocument: Document){
  if(!originalDocument || !newDocument){
    return;
  }

  const pos = this.documents.indexOf(originalDocument);

  if(pos < 0){
    return;
  }
  newDocument.id = originalDocument.id;
  this.documents[pos] = newDocument;
 }

}
