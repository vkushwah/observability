import { EuiBreadcrumb } from '@elastic/eui';
import React from 'react';
import { CoreStart } from '../../../../../../../src/core/public';
import DSLService from '../../../../services/requests/dsl';
import PPLService from '../../../../services/requests/ppl';
import { Tabs } from '../../common/tabs';

interface CustomPanelViewProps {
  panelId: string;
  page: 'app' | 'operationalPanels';
  http: CoreStart['http'];
  pplService: PPLService;
  dslService: DSLService;
  chrome: CoreStart['chrome'];
  parentBreadcrumbs: EuiBreadcrumb[];
  setToast: (
    title: string,
    color?: string,
    text?: React.ReactChild | undefined,
    side?: string | undefined
  ) => void;
  onEditClick: (savedVisualizationId: string) => any;
  startTime: string;
  endTime: string;
  setStartTime: any;
  setEndTime: any;
  childBreadcrumbs?: EuiBreadcrumb[];
  appId?: string;
  updateAvailabilityVizId?: any;
  onAddClick?: any;
  tabId?: string;
  appType: string;
}

export const SqlTab = (props: CustomPanelViewProps) => {
  const {
    panelId,
    page,
    appId,
    http,
    pplService,
    dslService,
    chrome,
    parentBreadcrumbs,
    childBreadcrumbs,
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    updateAvailabilityVizId,
    tabId,
    appType,
    setToast,
    onEditClick,
    onAddClick,
  } = props;

  return (
    <Tabs
      panelId={panelId}
      http={http}
      pplService={pplService}
      dslService={dslService}
      chrome={chrome}
      parentBreadcrumbs={parentBreadcrumbs}
      childBreadcrumbs={childBreadcrumbs}
      // App analytics will not be renaming/cloning/deleting panels
      renameCustomPanel={async () => undefined}
      cloneCustomPanel={async () => Promise.reject()}
      deleteCustomPanel={async () => Promise.reject()}
      setToast={setToast}
      page={page}
      appId={appId}
      updateAvailabilityVizId={updateAvailabilityVizId}
      startTime={startTime}
      endTime={endTime}
      setStartTime={setStartTime}
      setEndTime={setEndTime}
      onAddClick={onAddClick}
      onEditClick={onEditClick}
      tabId={tabId}
      appType={appType}
    />
  );
};
