import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {

  editMode = false;
  originalDocument: Document;
  document: Document;
  id: string;


  constructor(private documentService: DocumentService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) =>{
          this.id = params.id;
          if(!this.id){
            this.editMode = false;
            return;
          }

          //this.originalDocument =  this.documentService.getDocument(this.id);

          this.documentService.getDocument(this.id)
          .subscribe(
            response =>{
              this.originalDocument = response.document;
              if(!this.originalDocument){
                return;
              }
              this.editMode = true;
          // this.document = this.originalDocument;
            this.document = JSON.parse(JSON.stringify(this.originalDocument)); //question
            }
          );
        }
        );
  }

  onCancel(){
    this.router.navigate(['./documents']);
  }

  onSubmit(form: NgForm){
    const value = form.value;
    let newDocument = new Document('', value.id, value.name, value.description, value.url, null);
    if(this.editMode){
      this.documentService.updateDocument(this.originalDocument, newDocument );
    }else{
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['./documents']);
  }
}
