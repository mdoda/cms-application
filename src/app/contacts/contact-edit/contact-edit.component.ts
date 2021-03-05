import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact; //pristine state
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode = false;
  id:string;
  invalidGroupContact: boolean;

  constructor(private contactService: ContactService,
              private router: Router,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params.id;

        if(!this.id){
          this.editMode = false;
          return;
        }

        this.originalContact = this.contactService.getContact(this.id);

        if(!this.originalContact){
          return;
        }

        this.editMode = true;
        this.contact =  JSON.parse(JSON.stringify(this.originalContact));

        if(this.originalContact.group && this.originalContact.group.length > 0){
          this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
        }
      }
    )
  }

  onCancel(){
    this.router.navigate(['./contacts']);
  }


  onSubmit(form: NgForm){
    const value = form.value;
    let newContact = new Contact(this.contact?.id, value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    if(this.editMode){
      this.contactService.updateContact(this.originalContact, newContact );
    }else{
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['./contacts']);
  }

  isInvalidContact(newContact:Contact){
    if(!newContact){
      return true;
    }
    if(this.contact && newContact.id === this.contact.id){
      return true;
    }

    for(let i=0; i < this.groupContacts.length; i++ ){
      if(newContact.id === this.groupContacts[i].id){
        return true;
      }
    }

    return false;
  }

  onRemoveItem(index: number){
    if(index < 0 || index >= this.groupContacts.length){
      return;
    }
    this.groupContacts.splice(index,1);
  }

  addToGroup(event: any){
    const selectedContact: Contact = event.dragData;
    this.invalidGroupContact = this.isInvalidContact(selectedContact);

    if(this.invalidGroupContact){
      return;
    }

    this.groupContacts.push(selectedContact);
  }
}
