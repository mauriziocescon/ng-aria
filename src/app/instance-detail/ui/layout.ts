import { Component, computed, inject, input, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-instance-detail-layout',
  imports: [
    NgTemplateOutlet,
  ],
  template: `
    <div class="mx-auto flex w-full max-w-7xl flex-wrap gap-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div [class]="leftClass()">
        <ng-container [ngTemplateOutlet]="left()"/>
      </div>
      <div [class]="rightClass()">
        <ng-container [ngTemplateOutlet]="right()"/>
      </div>
    </div>
  `,
})
export class Layout {
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly left = input.required<TemplateRef<unknown>>();
  readonly right = input.required<TemplateRef<unknown>>();

  protected readonly breakPoints = toSignal(this.breakpointObserver.observe([
    Breakpoints.XLarge,
    Breakpoints.Large,
    Breakpoints.Small,
    Breakpoints.XSmall,
  ]), { initialValue: { matches: false, breakpoints: {} } as BreakpointState });

  protected readonly leftClass = computed(() => {
    const state = this.breakPoints();
    if (state.breakpoints[Breakpoints.XLarge]) {
      return 'w-full xl:w-1/5 xl:pr-4';
    } else if (state.breakpoints[Breakpoints.Large]) {
      return 'w-full lg:w-1/4 lg:pr-4';
    } else if (state.breakpoints[Breakpoints.Small]) {
      return 'w-full';
    } else if (state.breakpoints[Breakpoints.XSmall]) {
      return 'w-full';
    } else {
      return 'w-full md:w-1/3 md:pr-4';
    }
  });
  protected readonly rightClass = computed(() => {
    const state = this.breakPoints();
    if (state.breakpoints[Breakpoints.XLarge]) {
      return 'w-full xl:w-4/5';
    } else if (state.breakpoints[Breakpoints.Large]) {
      return 'w-full lg:w-3/4';
    } else if (state.breakpoints[Breakpoints.Small]) {
      return 'w-full';
    } else if (state.breakpoints[Breakpoints.XSmall]) {
      return 'w-full';
    } else {
      return 'w-full md:w-2/3';
    }
  });
}
