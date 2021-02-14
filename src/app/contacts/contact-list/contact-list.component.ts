import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {


  contacts:  Contact [] = [];

  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contacts = this.contactService.getContacts();
    this.contactService.contactChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
  }


}
