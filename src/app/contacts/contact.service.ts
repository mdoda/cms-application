import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactChangedEvent = new Subject<Contact[]>();

  maxContactId: number;

  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id:string){
    return this.contacts.find((contact) =>contact.id === id);
  }

  deleteContact(contact:Contact){
    if(!contact){
      return;
    }

    const pos = this.contacts.indexOf(contact);

    if(pos < 0){
      return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.next(this.contacts.slice());
  }

  getMaxId(){
    return Math.max.apply(Math, this.contacts.map((contact: Contact) => contact.id));
  }

  addContact(newContact: Contact){

    if(!newContact){
      return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.contactChangedEvent.next(this.contacts.slice());
 }


  updateContact(originalContact: Contact, newContact: Contact){

  if(!originalContact || !newContact){
     return;
  }

  const pos = this.contacts.indexOf(originalContact);

  if(pos < 0){
    return;
  }

  newContact.id = originalContact.id;
  this.contacts[pos] = newContact;
 }
}
