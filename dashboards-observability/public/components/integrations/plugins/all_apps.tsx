// import React, { useState } from 'react';
// import { Sql } from './sql/sql';
// import { Nginx } from './nginx/nginx';
// import { HashRouter, Link, Route, Switch } from 'react-router-dom';

// export const Home = () => {
//   const [test, setTest] = useState<string>('sql app');

//   return (
//     <div>
//       <Switch>
//         <Route
//           exact
//           path={'/integrations/plugins/Sql'}
//           render={(props) => {
//             return <Sql />;
//           }}
//         />
//         <Route
//           exact
//           path={'/integrations/plugins/Nginx'}
//           render={(props) => {
//             return <Nginx />;
//           }}
//         />
//         <Link to="/integrations/plugins/Sql">Sql </Link>
//         <Link to="/integrations/plugins/Nginx">Nginx </Link>
//         {/* <Sql />
//         <Nginx /> */}
//       </Switch>
//     </div>
//   );
// };
/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  EuiButton,
  EuiCard,
  EuiCodeBlock,
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiIcon,
  EuiInMemoryTable,
  EuiLink,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiSpacer,
  EuiTableFieldDataColumnType,
  EuiText,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui';
import { ApplicationType, AvailabilityType } from '../../../../common/types/application_analytics';
import _ from 'lodash';
import moment from 'moment';
import React, { useState } from 'react';
import { pageStyles, UI_DATE_FORMAT } from '../../../../common/constants/shared';
import './app_analytics.scss';
// import { Sql } from '../../plugins/sql/sql';

export function AllApps() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => setIsModalVisible(false);
  const showModal = () => setIsModalVisible(true);

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiModal onClose={closeModal}>
        <EuiModalHeader>
          <EuiModalHeaderTitle>
            <h1>Add Apps</h1>
          </EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          This modal has the following apps:
          <EuiSpacer />
          <EuiCodeBlock language="html">
            {'Adobe'}
            <br />
            {'Sql'}
            <br />
            {'Nginx'}
            <br />
            {'Sap'}
          </EuiCodeBlock>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiButton onClick={closeModal} fill>
            Close
          </EuiButton>
        </EuiModalFooter>
      </EuiModal>
    );
  }

  const tableColumns = [
    {
      field: 'name',
      name: 'Name',
      sortable: true,
      truncateText: true,
      render: (value, record) => (
        <EuiLink
          data-test-subj={`${record.name}ApplicationLink`}
          href={`#/integrations/plugins/${record.id}`}
        >
          {_.truncate(record.name, { length: 100 })}
        </EuiLink>
      ),
    },
    {
      field: 'composition',
      name: 'Composition',
      sortable: false,
      truncateText: true,
      render: (value, record) => (
        <EuiToolTip content={record.servicesEntities.concat(record.traceGroups).join(', ')}>
          <EuiText id="compositionColumn" data-test-subj="appAnalytics__compositionColumn">
            {record.servicesEntities.concat(record.traceGroups).join(', ')}
          </EuiText>
        </EuiToolTip>
      ),
    },
    {
      field: 'availability',
      name: 'Current Availability',
      sortable: true,
      render: () => <EuiText>Test data</EuiText>,
    },
    {
      field: 'dateModified',
      name: 'Date Modified',
      sortable: true,
      render: (value) => <EuiText>{moment(value).format(UI_DATE_FORMAT)}</EuiText>,
    },
  ] as Array<EuiTableFieldDataColumnType<ApplicationType>>;

  const icons = [
    {
      name: 'Application Analytics',
      icon: 'Cloud',
      path: 'application_analytics/create',
      description: 'Application analytics',
    },
    {
      name: 'Sql',
      icon: 'MySQL',
      path: 'sql',
      description: 'Collect performance schema metrics, query throughput, custom metrics, and more',
    },
    {
      name: 'Nginx',
      icon: 'Nginx',
      path: 'nginx',
      description: 'Monitor connection and request metrics with NGINX',
    },
    {
      name: 'Kibana',
      icon: 'Kibana',
      path: 'kibana',
      description: 'Monitor connection and request metrics with Kibana',
    },
    {
      name: 'Metrics',
      icon: 'Metrics',
      path: 'metrics',
      description: 'Monitor connection and request metrics with Kibana',
    },
  ];

  const cardNodes = icons.map(function (item, index) {
    return (
      <EuiFlexItem key={index}>
        <EuiCard
          icon={<EuiIcon size="xxl" type={`logo${item.icon}`} />}
          title={item.name}
          href={`#/integrations/plugins/${item.path}`}
          // isDisabled={item === 'Kibana' ? true : false}
          description={item.description}
          // onClick={() => window.alert('Card clicked')}
        />
      </EuiFlexItem>
    );
  });
  // console.log('applications', applications);
  return (
    <div style={pageStyles}>
      <EuiPage>
        <EuiPageBody component="div">
          {modal}
          <EuiPageHeader>
            {/* <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Overview</h1>
              </EuiTitle>
            </EuiPageHeaderSection> */}
          </EuiPageHeader>
          <EuiPageContent id="applicationArea">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle data-test-subj="applicationHomePageTitle" size="s">
                  <h3>
                    All Integrations
                    {/* <span className="panel-header-count"> ({applications.length})</span> */}
                  </h3>
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
      {/* {isModalVisible && modalLayout} */}
    </div>
  );
}
