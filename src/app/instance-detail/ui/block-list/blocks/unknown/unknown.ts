import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-unknown-cp',
  imports: [
    TranslocoPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-card">
      <header class="ui-card-header">{{ "UNKNOWN.HEADER" | transloco }}</header>
      <div class="ui-card-content">
        {{ "UNKNOWN.ALERT_MSG" | transloco }}
      </div>
    </section>
  `,
})
export class Unknown {
  instanceId = input.required<string>();
  block = input.required<unknown>();
}
