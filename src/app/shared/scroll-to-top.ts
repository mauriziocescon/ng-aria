import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-scroll-to-top',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="go-up ui-icon-button" aria-label="Scroll to top" (click)="scrollToTop()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false">
        <path
          fill-rule="evenodd"
          d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"
        />
      </svg>
    </button>
  `,
  styles: `
    .go-up {
      position: fixed;
      width: 3.25rem;
      height: 3.25rem;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.7);
      background: rgba(255, 255, 255, 0.9);
      color: #004494;
      font-size: 1.8rem;
      line-height: 1;
      opacity: 0.95;
      bottom: 1rem;
      right: 1rem;
      z-index: 200;
      cursor: pointer;
      border-radius: 0.75rem;
      box-shadow: 0 18px 45px -24px rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
    }

    .go-up svg {
      display: block;
    }

    @media (prefers-color-scheme: dark) {
      .go-up {
        border-color: rgba(51, 65, 85, 0.7);
        background: rgba(30, 41, 59, 0.9);
        color: #38bdf8;
        box-shadow: 0 18px 45px -24px rgba(0, 0, 0, 0.85);
      }
    }
  `,
})
export class ScrollToTop implements OnDestroy {
  private readonly zone = inject(NgZone);
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);

  private sub: Subscription | undefined = undefined;

  private readonly domReady = afterNextRender(() => {
    this.manageVisibility();

    this.sub = this.zone.runOutsideAngular(() =>
      fromEvent(window, 'scroll')
        .pipe(debounceTime(250))
        .subscribe(() => this.zone.run(() => this.manageVisibility())),
    );
  });

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  scrollToTop() {
    this.document.documentElement.scrollTop = 0;
  }

  private manageVisibility() {
    const scrollTopHeight = this.document.documentElement.scrollTop || 0;
    if (scrollTopHeight > 100) {
      this.renderer.setStyle(this.el.nativeElement, 'visibility', 'visible');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'visibility', 'hidden');
    }
  }
}
