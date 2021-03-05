import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  messages: Message [] = [];


  constructor(private messageService: MessageService) { }

  ngOnInit(){

    this.subscription = this.messageService.messageChangedEvent.subscribe(
      (messages: Message[]) => {
        this.messages = messages
      });

     this.messageService.getMessages();
  }

  // onAddMessage(message: Message){
  //   this.messageService.addMessage(message);
  // }

  ngOnDestroy(){
this.subscription.unsubscribe();
  }

}
