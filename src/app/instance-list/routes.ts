import { Route } from '@angular/router';

import { InstanceListPage } from './ui/page';

import { InstanceListDataClient } from './store/instance-list-data-client';
import { InstanceListStore } from './store/instance-list-store';

export default [
  {
    path: '',
    component: InstanceListPage,
    title: 'Instance List',
    providers: [
      InstanceListDataClient,
      InstanceListStore,
    ],
  },
] satisfies Route[];
