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
   //this.maxDocumentId = this.getMaxId();
}

/****************************************************************
 *
 *  EMIT THE DOCUMENT CHANGED EVENT
 *
 ***************************************************************/
sortAndSend(){
  this.documentChangedEvent.next(this.documents.slice());
  }

/****************************************************************
 *
 *  GET LIST OF DOCUMENTS
 *
 ***************************************************************/
getDocuments(){

  this.http.get<{message: string, documents: Document[]}>('http://localhost:3000/documents')
  .subscribe(
    //success function
    (responseData)=>{
    this.documents = responseData.documents;

    // this.maxDocumentId = this.getMaxId();
    this.sortAndSend();
    },
    // error function
    (error: any) =>{
      console.log(error);
    }
  )
}
// getDocuments(){

//   this.http.get('http://localhost:3000/documents')
//   .subscribe(
//     //success function
//     (documents: Document[])=>{
//     this.documents = documents;

//     this.maxDocumentId = this.getMaxId();
//     this.sortAndSend();
//     },
//     // error function
//     (error: any) =>{
//       console.log(error);
//     }
//   )
// }


/****************************************************************
 *
 *  ADD DOCUMENT
 *
 ***************************************************************/
addDocument(document: Document) {
  if (!document) {
    return;
  }

  // make sure id of the new Document is empty
  document.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
    document,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      }
    );
}

/****************************************************************
 *
 *  GET SINGLE DOCUMENT
 *
 ***************************************************************/
getDocument(id: string){
  return this.http.get<{message: string, document: Document}>('http://localhost:3000/documents/' + id);
}

/****************************************************************
 *
 *  DELETE DOCUMENT
 *
 ***************************************************************/
deleteDocument(document: Document) {

  if (!document) {
    return;
  }

 const pos = this.documents.findIndex(d => d.id === document.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      }
    );
}

//  getMaxId(){
//   return Math.max.apply(Math, this.documents.map((document: Document) => document.id));
//   }

/****************************************************************
 *
 *  UPDATE DOCUMENT
 *
 ***************************************************************/
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

}
