/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  EuiCard,
  EuiFlexGrid,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiTitle,
} from '@elastic/eui';
import { TraceAnalyticsCoreDeps } from 'public/components/trace_analytics/home';
import React, { useEffect } from 'react';
import { pageStyles } from '../../../../common/constants/shared';

export function AllApps(props: TraceAnalyticsCoreDeps) {
  const { parentBreadcrumbs, http, chrome } = props;

  useEffect(() => {
    chrome.setBreadcrumbs([
      ...parentBreadcrumbs,
      {
        text: 'Integrations',
        href: '#/integrations/plugins',
      },
      {
        text: 'All Integrations',
        href: '#/integrations/plugins/all_apps',
      },
    ]);
  }, []);

  const icons = [
    {
      name: 'Sql',
      icon: 'MySQL',
      path: 'create?type=integration',
      description: 'Collect performance schema metrics, query throughput, custom metrics, and more',
    },
    {
      name: 'Nginx',
      icon: 'Nginx',
      path: 'create?type=integration',
      description: 'Monitor connection and request metrics with NGINX',
    },
    {
      name: 'Kibana',
      icon: 'Kibana',
      path: 'create?type=integration',
      description: 'Monitor connection and request metrics with Kibana',
    },
    {
      name: 'Metrics',
      icon: 'Metrics',
      path: 'create?type=integration',
      description: 'Monitor connection and request metrics with Kibana',
    },
  ];

  const cardNodes = icons.map(function (item, index) {
    return (
      <EuiFlexItem key={index}>
        <EuiCard
          icon={<EuiIcon size="xxl" type={`logo${item.icon}`} />}
          title={item.name}
          href={`#/application_analytics/${item.path}`}
          description={item.description}
        />
      </EuiFlexItem>
    );
  });
  return (
    <div style={pageStyles}>
      <EuiPage>
        <EuiPageBody component="div">
          <EuiPageHeader></EuiPageHeader>
          <EuiPageContent id="applicationArea">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle data-test-subj="applicationHomePageTitle" size="s">
                  <h3>All Integrations</h3>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiHorizontalRule />
            <div>
              <EuiFlexGrid columns={4} gutterSize="l">
                {cardNodes}
              </EuiFlexGrid>
            </div>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </div>
  );
}
