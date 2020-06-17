import { Component, OnInit } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/websocket';
import * as settings from '../../../appsettings.js';
import { DataModel } from './models/DataModel.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'IoT';
  peopleLimit = settings.peopleLimit;
  datasetSize = settings.datasetSize;
  lastData: DataModel[];
  private socket: WebSocketSubject<DataModel[]>;

  ngOnInit(): void {
    this.socket = webSocket(settings.webUrl);
    this.socket.subscribe(x => {
      this.lastData = x;
    });
  }
}
