import { Component, ViewChild, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, from } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, ActivatedRoute} from '@angular/router';

import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {


  @ViewChild('drawer') drawer: any;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public authService: AuthService
    ) {}

    ngOnInit(): void {
    }


    toWalletPage() {
      const userId = JSON.parse(localStorage.getItem('app-meta')).userId;
      this.router.navigate(['/wallet/' + userId]);
    }

    logout() {
      this.authService.logout();
    }

    closeSideNav() {
      if (this.drawer._mode === "over") {
        this.drawer.close();
      }
    }


}
