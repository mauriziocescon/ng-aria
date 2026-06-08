import { Route } from '@angular/router';

import { InstanceDetailPage } from './ui/page';

import { InstanceDetailDataClient } from './store/instance-detail-data-client';
import { InstanceDetailStore } from './store/instance-detail-store';

export default [
  {
    path: '',
    component: InstanceDetailPage,
    title: 'Instance Detail',
    providers: [
      InstanceDetailDataClient,
      InstanceDetailStore,
    ],
    canDeactivate: [(component: InstanceDetailPage) => component.canDeactivate],
  },
] satisfies Route[];
