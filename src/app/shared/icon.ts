import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName = 'chevron-down' | 'close' | 'dns' | 'done' | 'redo' | 'sync';

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    class: 'inline-flex size-5 shrink-0',
  },
  template: `
    @switch (name()) {
      @case ('chevron-down') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="m6 9 6 6 6-6" />
        </svg>
      }
      @case ('close') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      }
      @case ('dns') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <rect width="20" height="8" x="2" y="2" rx="2" />
          <rect width="20" height="8" x="2" y="14" rx="2" />
          <path d="M6 6h.01" />
          <path d="M6 18h.01" />
        </svg>
      }
      @case ('done') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      }
      @case ('redo') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
        </svg>
      }
      @case ('sync') {
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M21 12a9 9 0 0 0-15-6.7L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
          <path d="M16 16h5v5" />
        </svg>
      }
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
}
