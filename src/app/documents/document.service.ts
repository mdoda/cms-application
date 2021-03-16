import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class DocumentService {

  documentChangedEvent = new Subject<Document[]>();

  selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document [] = [];

  maxDocumentId: number;

constructor(private http: HttpClient) {
  //this.documents = MOCKDOCUMENTS;
   this.maxDocumentId = this.getMaxId();
}

getDocuments(){

  this.http.get('https://wdd430-cms-2cfe4-default-rtdb.firebaseio.com/documents.json')
  .subscribe(
    //success function
    (documents: Document[])=>{
    this.documents = documents;

    this.maxDocumentId = this.getMaxId();
    this.documentChangedEvent.next(this.documents.slice());
    },
    // error function
    (error: any) =>{
      console.log(error);
    }
  )
}

storeDocuments() {
  let documents = JSON.stringify(this.documents);
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  this.http.put('https://wdd430-cms-2cfe4-default-rtdb.firebaseio.com/documents.json',
   documents,
   {headers: headers})
  .subscribe(
    ()=>{
      this.documentChangedEvent.next(this.documents.slice())
    }
  );
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

   this.storeDocuments();
 }

 getMaxId(){
  return Math.max.apply(Math, this.documents.map((document: Document) => document.id));
  }


 addDocument(newDocument: Document){

    if(!newDocument){
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);

    this.storeDocuments();
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

  this.storeDocuments();
 }

}
