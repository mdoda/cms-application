import { Injectable, EventEmitter } from '@angular/core';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

messageChangedEvent = new EventEmitter<Message[]>();

private messages: Message [] = [];

constructor() {
  this.messages =   MOCKMESSAGES;
}

getMessages(){
  return this.messages.slice();
}

getMessage(id: string){
  return this.messages.find((message: Message) => message.id === id );
}

addMessage(message: Message){
  this.messages.push(message);
  this.messageChangedEvent.emit(this.messages.slice())
}

}
