import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationBar } from './shared/navigation-bar';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationBar,
  ],
  template: `
    <div class="min-h-dvh">
      <app-navigation-bar />
      <main class="min-h-[calc(100dvh-4rem)]">
        <router-outlet />
      </main>
    </div>
  `,
})
export class App {
}
