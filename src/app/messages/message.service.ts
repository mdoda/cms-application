import { Injectable } from '@angular/core';
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
  this.maxMessageId = this.getMaxId();
}

sortAndSend(){
this.messageChangedEvent.next(this.messages.slice());
}



getMessage(id: string){
  return this.messages.find((message: Message) => message.id === id );
}

getMaxId(){
  return Math.max.apply(Math, this.messages.map((message: Message) => message.id));
  }


addMessage(message: Message){

  if(!message){
    return;
  }

  message.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  this.http.post<{response: string, newMessage: Message}>('http://localhost:3000/messages',
  message,
  {headers: headers})
  .subscribe(
    (responseData) =>{
      message._id = responseData.newMessage._id;
      message.id = responseData.newMessage.id;

      this.messages.push(message);
      this.sortAndSend();
    }
  );
}

getMessages(){
  this.http.get<{message: string, messages: Message[]}>('http://localhost:3000/messages')
  .subscribe(
    //success function
    (responseData)=>{
    this.messages = responseData.messages;
    this.sortAndSend();
    // this.maxMessageId = this.getMaxId();
    // this.messageChangedEvent.next(this.messages.slice());
    },
    // error function
    (error: any) =>{
      console.log(error);
    }
  );
}

}
