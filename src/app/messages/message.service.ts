import { Injectable } from '@angular/core';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model';
import { ContactService } from '../contacts/contact.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

maxMessageId: number;
messageChangedEvent = new Subject<Message[]>();

private messages: Message [] = [];

constructor(private http: HttpClient) {
}

// getMessages(){
//   return this.messages.slice();
// }
storeMessages() {
  let messages = JSON.stringify(this.messages);
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  this.http.put('https://wdd430-cms-2cfe4-default-rtdb.firebaseio.com/messages.json',
   messages,
   {headers: headers})
  .subscribe(
    ()=>{
      this.messageChangedEvent.next(this.messages.slice())
    }
  );
}

getMessage(id: string){
  return this.messages.find((message: Message) => message.id === id );
}

getMaxId(){
  return Math.max.apply(Math, this.messages.map((message: Message) => message.id));
  }


addMessage(newMessage: Message){


  if(!newMessage){
    return;
  }

  this.maxMessageId++;
  newMessage.id = this.maxMessageId.toString();
  this.messages.push(newMessage);

  this.storeMessages();

}

getMessages(){

  this.http.get('https://wdd430-cms-2cfe4-default-rtdb.firebaseio.com/messages.json')
  .subscribe(
    //success function
    (messages: Message[])=>{
    this.messages = messages;

    this.maxMessageId = this.getMaxId();
    this.messageChangedEvent.next(this.messages.slice());
    },
    // error function
    (error: any) =>{
      console.log(error);
    }
  )
}

}
