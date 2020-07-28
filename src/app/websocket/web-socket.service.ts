import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  constructor(private toastr: ToastrService) {}

  subject = webSocket('wss://socket.blockcypher.com/v1/btc/test3');
  ping;

  connectWs(address) {
    console.log('connected websocket');
    this.subject.subscribe(
      (msg: any) => {
        if (!msg.event) {
          if (msg.block_height === -1) {
            if (msg.inputs[0].addresses[0] === address) {
              const sliceHash = msg.hash.slice(0, 9);
              const hash = sliceHash + '...';
              this.toastr.success(
                `トランザクション: ${hash}を送信しました`,
                moment().format('YYYY/MM/DD HH:mm')
              );
            } else {
              const sliceHash = msg.hash.slice(0, 9);
              const hash = sliceHash + '...';
              this.toastr.info(
                `あなた宛てのトランザクション: ${hash}を受信しました`,
                moment().format('YYYY/MM/DD HH:mm'),
                { disableTimeOut: true, closeButton: true }
              );
            }
          } else {
            const sliceHash = msg.hash.slice(0, 9);
            const hash = sliceHash + '...';
            this.toastr.info(
              `トランザクション: ${hash}が承認されました`,
              moment().format('YYYY/MM/DD HH:mm'),
              { disableTimeOut: true, closeButton: true }
            );
          }
        }
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log('disconnected websocket');
      }
    );

    this.subject.next({
      event: 'unconfirmed-tx',
      address: address,
      token: environment.BC_TOKEN,
    });

    this.subject.next({
      event: 'confirmed-tx',
      address: address,
      token: environment.BC_TOKEN,
    });

    this.ping = setInterval(() => {
      this.subject.next({
        event: 'ping',
      });
    }, 30000);
  }

  closeWs() {
    clearInterval(this.ping);
    this.subject.complete();
  }
}
