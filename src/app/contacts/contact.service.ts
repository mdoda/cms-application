import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactChangedEvent = new Subject<Contact[]>();

  //maxContactId: number;

  contacts: Contact[] = [];

  constructor(private http: HttpClient,
              private router: Router) {

    // this.maxContactId = this.getMaxId();
  }

  sortAndSend(){
    this.contactChangedEvent.next(this.contacts.slice());
  }

  getContact(id:string){
    return this.http.get<{message: string, contact: Contact}>('http://localhost:3000/contacts/' + id);
  }

  getContacts(){

    this.http.get<{message: string, contacts: Contact[]}>('http://localhost:3000/contacts')
    .subscribe(
      //success function
      (responseData)=>{
      this.contacts = responseData.contacts;
      console.log(this.contacts)
      this.sortAndSend();
      },
      // error function
      (error: any) =>{
        console.log(error);
      }
    )
  }

  deleteContact(contact:Contact){
    if(!contact){
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    //const pos = this.contacts.indexOf(contact);

    if(pos < 0){
      return;
    }
    //delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      }
    )
  }

  // getMaxId(){
  //   return Math.max.apply(Math, this.contacts.map((contact: Contact) => contact.id));
  // }

  addContact(contact: Contact){
    if(!contact){
      return;
    }
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    //add to database
    this.http.post<{message: string, contact: Contact}>('http://localhost:3000/contacts',
    contact,
    {headers: headers})
    .subscribe(
      (responseData) =>{
        //add new contact to contacts
        this.contacts.push(responseData.contact)
        this.sortAndSend();
      }
    );
 }


  updateContact(originalContact: Contact, newContact: Contact){

  if(!originalContact || !newContact){
     return;
  }

  const pos = this.contacts.findIndex(c => c.id === originalContact.id);

  if(pos < 0){
    return;
  }

  newContact.id = originalContact.id;

  //this.contacts[pos] = newContact;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  return this.http.put<{message: string, contact: Contact}>('http://localhost:3000/contacts/' + originalContact.id,
  newContact,
  {headers: headers}
  ).subscribe(
    (response) => {
      this.contacts[pos] = response.contact;
      this.router.navigate(['./contacts']);
      this.sortAndSend();
    }
  );
 }
}
