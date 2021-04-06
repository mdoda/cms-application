import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  nativeWindow: any;
  document: Document;
  id: string;


  constructor(private documentService: DocumentService,
              private router: Router,
              private route: ActivatedRoute,
              private windRefService: WindRefService) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params.id;
        //this.document = this.documentService.getDocument(this.id);
        this.documentService.getDocument(this.id)
        .subscribe(
          response => {
            this.document = response.document;
          }
        )
      }
    )

    this.nativeWindow = this.windRefService.getNativeWindow();
  }

  onView() {
    if (this.document.url)
      this.nativeWindow.open(this.document.url);
  }

  onDelete(){
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
