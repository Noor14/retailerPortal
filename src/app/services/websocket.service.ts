import { Injectable } from '@angular/core';
import * as io from "socket.io-client";
import { Observable} from 'rxjs';
import { socketURL } from 'src/app/constant/baseurl';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket; // connect socket.io server
  constructor() { 
  }

  connect(eventName: string, id: number){
    if(!this.socket){
      this.socket =  io(socketURL);
    }
    return new Observable(observer => {
      this.socket.on(`${eventName}${id}`, (data)=>{
        observer.next(data);
      })
    })
  }
  emit(eventName: string, id: number){
    this.socket = io(socketURL);
    this.socket.emit(eventName, id)
  }
}
