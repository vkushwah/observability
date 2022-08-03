import { EuiLink } from '@elastic/eui';
import _ from 'lodash';
import { ObservabilitySideBar } from '../../common/side_nav';
import { TraceAnalyticsCoreDeps } from 'public/components/trace_analytics/home';
import DSLService from 'public/services/requests/dsl';
import PPLService from 'public/services/requests/ppl';
import SavedObjects from 'public/services/saved_objects/event_analytics/saved_objects';
import TimestampUtils from 'public/services/timestamp/timestamp';
import React from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { NotificationsStart } from '../../../../../../src/core/public';
import './app_analytics.scss';
import { Sql } from './sql/sql';
import { AppTable } from './app_table';
import { Nginx } from './nginx/nginx';
import { AllApps } from './all_apps';
import { CreateApp } from './create';

export type AppAnalyticsCoreDeps = TraceAnalyticsCoreDeps;

interface HomeProps extends RouteComponentProps, AppAnalyticsCoreDeps {
  // pplService: PPLService;
  // dslService: DSLService;
  // savedObjects: SavedObjects;
  // timestampUtils: TimestampUtils;
  // notifications: NotificationsStart;
}

export const Home = (props: TraceAnalyticsCoreDeps) => {
  const { parentBreadcrumbs, http, chrome } = props;
  const integrationsBreadcrumb = {
    text: 'Integration',
    href: '#/integrations/plugins',
  };

  return (
    <>
      <Switch>
        <Route
          exact
          path={['/integrations', '/integrations/plugins']}
          render={() => {
            chrome.setBreadcrumbs([
              ...parentBreadcrumbs,
              integrationsBreadcrumb,
              {
                text: 'Home',
                href: '#/integrations/plugins',
              },
            ]);
            return (
              <ObservabilitySideBar>
                <AppTable />
              </ObservabilitySideBar>
            );
          }}
        />
        <Route
          exact
          path={['/integrations/plugins/all_apps']}
          render={(routerProps) => (
            <AllApps parentBreadcrumbs={parentBreadcrumbs} http={http} chrome={chrome} />
          )}
        />
        <Route
          exact
          path={['/integrations/plugins/create/:id+']}
          render={(routerProps) => <CreateApp appName={routerProps.match.params.id} />}
        />
        <Route
          exact
          path={'/integrations/plugins/:id+'}
          render={(routerProps) => {
            switch (routerProps.match.params.id) {
              case 'Sql':
                return <Sql />;
              case 'Nginx':
                return <Nginx />;
            }
          }}
        />
      </Switch>
    </>
  );
};
