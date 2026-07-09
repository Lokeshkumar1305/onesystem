import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'oh-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, HeaderComponent, SidenavComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  pageTitle = '';
  pageSubtitle = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.updatePageMeta();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.updatePageMeta());
  }

  private updatePageMeta(): void {
    let active = this.route.firstChild;
    while (active?.firstChild) {
      active = active.firstChild;
    }
    const data = active?.snapshot.data ?? {};
    this.pageTitle = data['title'] ?? '';
    this.pageSubtitle = data['subtitle'] ?? '';
  }
}
