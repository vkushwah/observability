/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiForm,
  EuiFormRow,
  EuiHorizontalRule,
  EuiLink,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiSpacer,
  EuiText,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui';
import DSLService from 'public/services/requests/dsl';
import React, { ReactChild, useEffect, useState } from 'react';
import PPLService from 'public/services/requests/ppl';
import { last } from 'lodash';
import { AppAnalyticsComponentDeps } from '../home';
import { TraceConfig } from './config_components/trace_config';
import { ServiceConfig } from './config_components/service_config';
import { LogConfig } from './config_components/log_config';
import { PPLReferenceFlyout } from '../../../components/common/helpers';
import {
  ApplicationRequestType,
  ApplicationType,
  OptionType,
} from '../../../../common/types/application_analytics';
import { fetchAppById } from '../helpers/utils';
import { FlyoutContainers } from '../../common/flyout_containers';
import { NginxDocument } from '../../integrations/plugins/nginx/doc';
import { INTEGRATION } from '../../../../common/constants/shared';

interface CreateAppProps extends AppAnalyticsComponentDeps {
  dslService: DSLService;
  pplService: PPLService;
  setToasts: (title: string, color?: string, text?: ReactChild) => void;
  createApp: (app: ApplicationRequestType, type: string, appType?: string | null) => void;
  updateApp: (
    appId: string,
    updateAppData: Partial<ApplicationRequestType>,
    type: string,
    appName: string,
    appType?: string | null
  ) => void;
  clearStorage: () => void;
  existingAppId: string;
  appName: string | null;
  appType: string | null;
}

export const CreateApp = (props: CreateAppProps) => {
  const {
    parentBreadcrumbs,
    chrome,
    http,
    query,
    name,
    description,
    pplService,
    createApp,
    updateApp,
    setToasts,
    setNameWithStorage,
    setDescriptionWithStorage,
    setQueryWithStorage,
    setFilters,
    clearStorage,
    existingAppId,
    appType,
    appName,
  } = props;
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [isFlyoutVisibleIntegration, setIsFlyoutVisibleIntegration] = useState(false);
  const [selectedServices, setSelectedServices] = useState<OptionType[]>([]);
  const [selectedTraces, setSelectedTraces] = useState<OptionType[]>([]);

  const editMode = existingAppId !== 'undefined';
  const [existingApp, setExistingApp] = useState<ApplicationType>({
    id: existingAppId,
    dateCreated: '',
    dateModified: '',
    name: '',
    description: '',
    baseQuery: '',
    servicesEntities: [],
    traceGroups: [],
    panelId: '',
    availability: { name: '', color: '', availabilityVisId: '' },
  });

  const breadCrumbs =
    appType === INTEGRATION
      ? [
          {
            text: 'Integrations',
            href: '#/integrations/plugins',
          },
          {
            text: 'All Integrations',
            href: '#/integrations/plugins/all_apps',
          },
        ]
      : [
          {
            text: 'Application analytics',
            href: '#/application_analytics',
          },
        ];

  useEffect(() => {
    chrome.setBreadcrumbs([
      ...parentBreadcrumbs,
      ...breadCrumbs,
      {
        text: editMode ? 'Edit' : 'Create',
        href: `#/application_analytics/${editMode ? 'edit' : 'create'}`,
      },
    ]);
  }, []);

  useEffect(() => {
    if (editMode && existingAppId) {
      fetchAppById(
        http,
        pplService,
        existingAppId,
        setExistingApp,
        setFilters,
        () => {},
        setToasts
      );
    }
  }, [existingAppId]);

  useEffect(() => {
    if (editMode) {
      setNameWithStorage(existingApp.name);
      setDescriptionWithStorage(existingApp.description);
      setQueryWithStorage(existingApp.baseQuery);
    }
  }, [existingApp]);

  const closeFlyout = () => {
    setIsFlyoutVisible(false);
  };

  const closeIntegrationFlyout = () => {
    setIsFlyoutVisibleIntegration(false);
  };

  const openIntegrationFlyout = () => {
    setIsFlyoutVisibleIntegration(true);
  };

  let integrationFlyout;
  if (isFlyoutVisibleIntegration) {
    integrationFlyout = (
      <FlyoutContainers
        closeFlyout={closeIntegrationFlyout}
        flyoutHeader={
          <EuiPageHeader>
            <EuiPageHeaderSection>
              {/* <EuiTitle data-test-subj="createPageTitle" size="l">
                <h1>{appName} Doc</h1>
              </EuiTitle> */}
            </EuiPageHeaderSection>
          </EuiPageHeader>
        }
        flyoutBody={
          <EuiPageContent id="appInfo">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle size="m">
                  <h2>{appName} information</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiHorizontalRule />
            <EuiText grow={false}>
              NGINX is open source software for web serving, reverse proxying, caching, load
              balancing, media streaming, and more. It started out as a web server designed for
              maximum performance and stability. In addition to its HTTP server capabilities, NGINX
              can also function as a proxy server for email (IMAP, POP3, and SMTP) and a reverse
              proxy and load balancer for HTTP, TCP, and UDP servers.
            </EuiText>
            <EuiLink href="https://www.nginx.com/resources/glossary/nginx/" target="_blank">
              Click here to know more about NGINX
            </EuiLink>
          </EuiPageContent>
        }
        flyoutFooter={
          <EuiFlyoutFooter>
            <EuiFlexGroup gutterSize="s" justifyContent="spaceBetween">
              <EuiFlexItem grow={false}>
                <EuiButton onClick={closeIntegrationFlyout}>Close</EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlyoutFooter>
        }
        ariaLabel="pplReferenceFlyout"
      />
    );
  }

  let flyout;
  if (isFlyoutVisible) {
    flyout = <PPLReferenceFlyout module="explorer" closeFlyout={closeFlyout} />;
  }

  const isDisabled = !name || (!query && !selectedTraces.length && !selectedServices.length);

  const missingField = (needLog: boolean) => {
    let popoverContent = '';
    if (isDisabled || (needLog && !query)) {
      if (!name) {
        popoverContent = 'Name is required.';
      } else if (!query && !selectedServices.length && !selectedTraces.length) {
        popoverContent = 'Provide at least one log source, service, entity or trace group.';
      } else if (needLog && !query) {
        popoverContent = 'Log source is required to set availability.';
      }
      return <p>{popoverContent}</p>;
    }
  };

  const onCreate = (type: string) => {
    const appData = {
      name,
      description,
      baseQuery: query,
      servicesEntities: selectedServices.map((option) => option.label),
      traceGroups: selectedTraces.map((option) => option.label),
      panelId: '',
      availabilityVisId: '',
      // appType: appType, TODO uncomment this when backend api is fixed to accept this new field
    };
    createApp(appData, type, appType);
  };

  const onUpdate = () => {
    const appData = {
      name,
      description,
      servicesEntities: selectedServices.map((option) => option.label),
      traceGroups: selectedTraces.map((option) => option.label),
    };
    updateApp(existingAppId, appData, 'update', appName, appType);
  };

  const redirectOnCancel =
    appType === INTEGRATION ? 'integrations/plugins' : 'application_analytics';
  const onCancel = () => {
    clearStorage();
    window.location.assign(`${last(parentBreadcrumbs)!.href}${redirectOnCancel}`);
  };

  const renderDocument = (appName: string | null) => {
    switch (appName) {
      case 'Nginx':
        return <NginxDocument appName={appName} />;
      default:
        return 'Add Documet component';
    }
  };

  return (
    <div>
      <EuiPage>
        <EuiPageBody component="div" style={{ maxWidth: '980px' }}>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle data-test-subj="createPageTitle" size="l">
                <h1>{editMode ? 'Edit' : 'Create'} application</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent id="appInfo">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle size="m">
                  <h2>Application information</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiHorizontalRule />
            <EuiForm component="form">
              <EuiFormRow label="Name" data-test-subj="nameFormRow">
                <EuiFieldText
                  name="name"
                  value={name}
                  onChange={(e) => setNameWithStorage(e.target.value)}
                />
              </EuiFormRow>
              <EuiFormRow label="Description" data-test-subj="descriptionFormRow">
                <EuiFieldText
                  name="description"
                  value={description}
                  onChange={(e) => setDescriptionWithStorage(e.target.value)}
                />
              </EuiFormRow>
            </EuiForm>
          </EuiPageContent>
          <EuiSpacer />
          <EuiPageContent id="composition">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle size="m">
                  <h2>Composition</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiHorizontalRule />
            <LogConfig editMode={editMode} setIsFlyoutVisible={setIsFlyoutVisible} {...props} />
            <EuiHorizontalRule />
            <ServiceConfig
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              {...props}
            />
            <EuiHorizontalRule />
            <TraceConfig
              selectedTraces={selectedTraces}
              setSelectedTraces={setSelectedTraces}
              {...props}
            />
          </EuiPageContent>
          <EuiSpacer />
          <EuiFlexGroup>
            <EuiFlexItem grow={false}>
              <EuiButton data-test-subj="cancelCreateButton" onClick={onCancel}>
                Cancel
              </EuiButton>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiToolTip position="top" content={missingField(false)}>
                <EuiButton
                  data-test-subj="createButton"
                  isDisabled={isDisabled}
                  onClick={editMode ? onUpdate : () => onCreate('create')}
                  fill={editMode ? true : false}
                >
                  {editMode ? 'Save' : 'Create'}
                </EuiButton>
              </EuiToolTip>
            </EuiFlexItem>
            {editMode || (
              <EuiFlexItem grow={false}>
                <EuiToolTip position="top" content={missingField(true)}>
                  <EuiButton
                    data-test-subj="createAndSetButton"
                    fill
                    isDisabled={isDisabled || !query}
                    onClick={() => onCreate('createSetAvailability')}
                  >
                    Create and Set Availability
                  </EuiButton>
                </EuiToolTip>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        </EuiPageBody>
        {appType === INTEGRATION && renderDocument(appName)}
      </EuiPage>
      {integrationFlyout}
      {flyout}
    </div>
  );
};
