import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactChangedEvent = new Subject<Contact[]>();

  maxContactId: number;

  contacts: Contact[] = [];

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(){

    this.http.get('https://wdd430-cms-2cfe4-default-rtdb.firebaseio.com/contacts.json')
    .subscribe(
      //success function
      (contacts: Contact[])=>{
      this.contacts = contacts;

      this.maxContactId = this.getMaxId();
      this.contactChangedEvent.next(this.contacts.slice());
      },
      // error function
      (error: any) =>{
        console.log(error);
      }
    )
  }

  storeContacts() {
    let contacts = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put('https://wdd430-cms-2cfe4-default-rtdb.firebaseio.com/contacts.json',
     contacts,
     {headers: headers})
    .subscribe(
      ()=>{
        this.contactChangedEvent.next(this.contacts.slice())
      }
    );
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
    this.storeContacts();
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

    this.storeContacts();
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

  this.storeContacts();
 }
}
