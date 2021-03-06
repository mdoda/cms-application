import { Component, OnInit,Input } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { Message } from   '../message.model';
import { MessageService } from '../message.service';
import { ContactService } from 'src/app/contacts/contact.service';


@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;
  constructor(private contactService: ContactService) { }

  ngOnInit() {
    this.contactService.getContact(this.message.sender.id)
    .subscribe(contactData =>{
      this.messageSender = contactData.contact?.name;
    })
  }

}
