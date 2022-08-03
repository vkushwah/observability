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

export const AppTable = () => {
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

  const createButtonText = 'Add Integration';
  const appAnalytics = 'Application Analytics';
  const icons = [
    {
      name: 'Sql',
      icon: 'MySQL',
      description: 'Collect performance schema metrics, query throughput, custom metrics, and more',
    },
    {
      name: 'Nginx',
      icon: 'Nginx',
      description: 'Monitor connection and request metrics with NGINX',
    },
  ];

  const cardNodes = icons.map(function (item, index) {
    return (
      <EuiFlexItem key={index}>
        <EuiCard
          icon={<EuiIcon size="xxl" type={`logo${item.icon}`} />}
          title={item.name}
          href={`#/integrations/plugins/${item.name}`}
          // isDisabled={item === 'Kibana' ? true : false}
          description={item.description}
          // onClick={() => window.alert('Card clicked')}
        />
      </EuiFlexItem>
    );
  });

  return (
    <div style={pageStyles}>
      <EuiPage>
        <EuiPageBody component="div">
          {modal}
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Overview</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent id="applicationArea">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle data-test-subj="applicationHomePageTitle" size="s">
                  <h3>
                    Integrations
                    {/* <span className="panel-header-count"> ({applications.length})</span> */}
                  </h3>
                </EuiTitle>
              </EuiPageContentHeaderSection>
              <EuiPageContentHeaderSection>
                <EuiFlexGroup gutterSize="s">
                  <EuiFlexItem>
                    <EuiButton fill href="#/application_analytics">
                      {appAnalytics}
                    </EuiButton>
                  </EuiFlexItem>
                  <EuiFlexItem>
                    <EuiButton fill href="#/integrations/plugins/all_apps">
                      {createButtonText}
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiHorizontalRule />
            {/* <EuiFlexGrid columns={4} gutterSize="l">
              {cardNodes}
            </EuiFlexGrid> */}
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
      {/* {isModalVisible && modalLayout} */}
    </div>
  );
};
