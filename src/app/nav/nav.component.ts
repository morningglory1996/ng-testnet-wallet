import { Component, ViewChild, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from 'src/app/auth/shared/auth.service';
import { WebSocketService } from '../websocket/web-socket.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  toolbarStyle = {};
  brandStyle = {};
  toggleStyle = {};
  contentStyle = {};

  @ViewChild('drawer') drawer: any;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public authService: AuthService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        if (url === '/') {
          this.toolbarStyle = {
            'background-color': 'white',
            'box-shadow': 'none',
          };
          this.brandStyle = {
            color: 'rgb(18, 29, 51)',
          };
          this.contentStyle = {
            'background-color': 'white',
          };
          this.toggleStyle = {
            color: 'rgb(18, 29, 51)',
          };
          this.drawer.close();
        } else {
          this.toolbarStyle = {};
          this.brandStyle = {};
          this.contentStyle = {};
          this.toggleStyle = {};
          this.isHandset$.subscribe((result) => {
            if (result === false) {
              this.drawer.open();
            }
          });
        }
      }
    });
  }

  toWalletPage() {
    const userId = JSON.parse(localStorage.getItem('app-meta')).userId;
    this.router.navigate(['/wallet/' + userId]);
  }

  logout() {
    this.authService.logout();
    this.webSocketService.closeWs();
  }

  closeSideNav() {
    if (this.drawer._mode === 'over') {
      this.drawer.close();
    }
  }
}
