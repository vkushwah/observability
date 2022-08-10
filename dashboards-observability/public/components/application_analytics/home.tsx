/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */

import React, { ReactChild, useEffect, useState, useRef } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import DSLService from 'public/services/requests/dsl';
import PPLService from 'public/services/requests/ppl';
import SavedObjects from 'public/services/saved_objects/event_analytics/saved_objects';
import TimestampUtils from 'public/services/timestamp/timestamp';
import { EuiGlobalToastList, EuiLink, EuiSelectOption } from '@elastic/eui';
import { Toast } from '@elastic/eui/src/components/toast/global_toast_list';
import { isEmpty, last } from 'lodash';
import { batch, useDispatch } from 'react-redux';
import { AppTable } from './components/app_table';
import { Application } from './components/application';
import { CreateApp } from './components/create';
import { TraceAnalyticsComponentDeps, TraceAnalyticsCoreDeps } from '../trace_analytics/home';
import { FilterType } from '../trace_analytics/components/common/filters/filters';
import { handleIndicesExistRequest } from '../trace_analytics/requests/request_handler';
import { ObservabilitySideBar } from '../common/side_nav';
import { NotificationsStart } from '../../../../../src/core/public';
import { changeQuery } from '../event_analytics/redux/slices/query_slice';
import { updateTabName } from '../event_analytics/redux/slices/query_tab_slice';
import { APP_ANALYTICS_API_PREFIX } from '../../../common/constants/application_analytics';
import {
  ApplicationRequestType,
  ApplicationType,
} from '../../../common/types/application_analytics';
import {
  SAVED_OBJECT_ID,
  SAVED_OBJECT_TYPE,
  SAVED_QUERY,
  SAVED_VISUALIZATION,
} from '../../../common/constants/explorer';
import {
  calculateAvailability,
  fetchPanelsVizIdList,
  isNameValid,
  removeTabData,
} from './helpers/utils';
import {
  CUSTOM_PANELS_API_PREFIX,
  CUSTOM_PANELS_DOCUMENTATION_URL,
} from '../../../common/constants/custom_panels';
import { AllApps } from '../integrations/plugins/all_apps';
import { fetchAppById } from '../application_analytics/helpers/utils';

export type AppAnalyticsCoreDeps = TraceAnalyticsCoreDeps;

interface HomeProps extends RouteComponentProps, AppAnalyticsCoreDeps {
  pplService: PPLService;
  dslService: DSLService;
  savedObjects: SavedObjects;
  timestampUtils: TimestampUtils;
  notifications: NotificationsStart;
  appType: string;
}

export interface AppAnalyticsComponentDeps extends TraceAnalyticsComponentDeps {
  name: string;
  description: string;
  setNameWithStorage: (newName: string) => void;
  setDescriptionWithStorage: (newDescription: string) => void;
  setQueryWithStorage: (newQuery: string) => void;
  setFiltersWithStorage: (newFilters: FilterType[]) => void;
  setAppConfigs: (newAppConfigs: FilterType[]) => void;
}

export const Home = (props: HomeProps) => {
  const {
    pplService,
    dslService,
    timestampUtils,
    savedObjects,
    parentBreadcrumbs,
    http,
    chrome,
    notifications,
    appType,
  } = props;
  const [triggerSwitchToEvent, setTriggerSwitchToEvent] = useState(0);
  const dispatch = useDispatch();
  const selectedPanelNameRef = useRef('');
  const [applicationList, setApplicationList] = useState<ApplicationType[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [indicesExist, setIndicesExist] = useState(true);
  const [appConfigs, setAppConfigs] = useState<FilterType[]>([]);
  const storedFilters = sessionStorage.getItem('AppAnalyticsFilters');
  const [filters, setFilters] = useState<FilterType[]>(
    storedFilters ? JSON.parse(storedFilters) : []
  );
  const [visWithAvailability, setVisWithAvailability] = useState<EuiSelectOption[]>([]);

  const [application, setApplication] = useState<ApplicationType>({
    id: '',
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

  const [name, setName] = useState(sessionStorage.getItem('AppAnalyticsName') || '');
  const [description, setDescription] = useState(
    sessionStorage.getItem('AppAnalyticsDescription') || ''
  );
  const [query, setQuery] = useState<string>(sessionStorage.getItem('AppAnalyticsQuery') || '');
  const [startTime, setStartTime] = useState<string>(
    sessionStorage.getItem('AppAnalyticsStartTime') || 'now-24h'
  );
  const [endTime, setEndTime] = useState<string>(
    sessionStorage.getItem('AppAnalyticsEndTime') || 'now'
  );

  // Setting state with storage to save input when user refreshes page
  const setFiltersWithStorage = (newFilters: FilterType[]) => {
    setFilters(newFilters);
    sessionStorage.setItem('AppAnalyticsFilters', JSON.stringify(newFilters));
  };
  const setNameWithStorage = (newName: string) => {
    setName(newName);
    sessionStorage.setItem('AppAnalyticsName', newName);
  };
  const setDescriptionWithStorage = (newDescription: string) => {
    setDescription(newDescription);
    sessionStorage.setItem('AppAnalyticsDescription', newDescription);
  };
  const setQueryWithStorage = (newQuery: string) => {
    setQuery(newQuery);
    sessionStorage.setItem('AppAnalyticsQuery', newQuery);
  };

  useEffect(() => {
    handleIndicesExistRequest(http, setIndicesExist);
  }, []);

  const commonProps: AppAnalyticsComponentDeps = {
    parentBreadcrumbs,
    http,
    chrome,
    name,
    setNameWithStorage,
    description,
    setDescriptionWithStorage,
    query,
    setQuery,
    setQueryWithStorage,
    appConfigs,
    setAppConfigs,
    filters,
    setFilters,
    setFiltersWithStorage,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    indicesExist,
  };

  const setToast = (title: string, color = 'success', text?: ReactChild) => {
    if (!text) text = '';
    setToasts([...toasts, { id: new Date().toISOString(), title, text, color } as Toast]);
  };

  const clearStorage = () => {
    setNameWithStorage('');
    setDescriptionWithStorage('');
    setFiltersWithStorage([]);
    setQueryWithStorage('');
  };

  const moveToApp = (id: string, type: string) => {
    window.location.assign(`${last(parentBreadcrumbs)!.href}application_analytics/${id}`);
    if (type === 'createSetAvailability') {
      setTriggerSwitchToEvent(2);
    }
  };

  const createPanelForApp = (applicationId: string, appName: string, type: string) => {
    return http
      .post(`${CUSTOM_PANELS_API_PREFIX}/panels`, {
        body: JSON.stringify({
          panelName: `${appName}'s Panel`,
          applicationId,
        }),
      })
      .then((res) => {
        updateApp(applicationId, { panelId: res.newPanelId }, type, appName);
      })
      .catch((err) => {
        setToast(
          'Please ask your administrator to enable Operational Panels for you.',
          'danger',
          <EuiLink href={CUSTOM_PANELS_DOCUMENTATION_URL} target="_blank">
            Documentation
          </EuiLink>
        );
        console.error(err);
      });
  };

  const deletePanelForApp = (appPanelId: string) => {
    const concatList = [appPanelId].toString();
    return http.delete(`${CUSTOM_PANELS_API_PREFIX}/panelList/` + concatList).catch((err) => {
      setToast(
        'Error occurred while deleting Operational Panels, please make sure you have the correct permission.',
        'danger'
      );
      console.error(err.body.message);
    });
  };

  const deleteSavedVisualizationsForPanel = async (appPanelId: string) => {
    const savedVizIdsToDelete = await fetchPanelsVizIdList(http, appPanelId);
    if (!isEmpty(savedVizIdsToDelete)) {
      savedObjects
        .deleteSavedObjectsList({ objectIdList: savedVizIdsToDelete })
        .then((res) => {
          deletePanelForApp(appPanelId);
        })
        .catch((err) => {
          setToast('Error occurred while deleting Saved Visualizations', 'danger');
          console.error(err);
        });
    }
  };

  // Fetches all existing applications
  const fetchApps = () => {
    return http
      .get(`${APP_ANALYTICS_API_PREFIX}/`)
      .then(async (res) => {
        // Want to calculate availability going down the table
        const availabilityVisIdStore: Record<string, string> = {};
        for (let i = 0; i < res.data.length; i++) {
          availabilityVisIdStore[res.data[i].id] = res.data[i].availability.availabilityVisId;
          res.data[i].availability = { name: '', color: 'loading', availabilityVisId: '' };
        }
        setApplicationList(res.data);
        for (let i = res.data.length - 1; i > -1; i--) {
          res.data[i].availability = await calculateAvailability(
            http,
            pplService,
            res.data[i],
            availabilityVisIdStore[res.data[i].id],
            () => {}
          );
          // Need to set state with new object to trigger re-render
          setApplicationList([
            ...res.data.filter((app: ApplicationType) => app.id !== res.data[i].id),
            res.data[i],
          ]);
        }
      })
      .catch((err) => {
        setToast('Error occurred while fetching applications', 'danger');
        console.error(err);
      });
  };

  // tabid change
  // const getSavedDataById = async (objectId: string) => {
  //   // load saved query/visualization if object id exists
  //   debugger;
  //   await savedObjects
  //     .fetchSavedObjects({
  //       objectId,
  //     })
  //     .then(async (res) => {
  //       const savedData = res.observabilityObjectList[0];
  //       const isSavedQuery = has(savedData, SAVED_QUERY);
  //       const savedType = isSavedQuery ? SAVED_QUERY : SAVED_VISUALIZATION;
  //       const objectData = isSavedQuery ? savedData.savedQuery : savedData.savedVisualization;
  //       const currQuery = appLogEvents
  //         ? objectData?.query.replace(appBaseQuery + '| ', '')
  //         : objectData?.query || '';

  //       if (appLogEvents) {
  //         debugger;
  //         if (objectData?.selected_date_range?.start && objectData?.selected_date_range?.end) {
  //           setStartTime(objectData.selected_date_range.start);
  //           setEndTime(objectData.selected_date_range.end);
  //         }
  //       }

  //       // update redux
  //       batch(async () => {
  //         await dispatch(
  //           changeQuery({
  //             tabId,
  //             query: {
  //               [RAW_QUERY]: currQuery,
  //               [SELECTED_TIMESTAMP]: objectData?.selected_timestamp?.name || 'timestamp',
  //               [SAVED_OBJECT_ID]: objectId,
  //               [SAVED_OBJECT_TYPE]: savedType,
  //               [SELECTED_DATE_RANGE]:
  //                 objectData?.selected_date_range?.start && objectData?.selected_date_range?.end
  //                   ? [objectData.selected_date_range.start, objectData.selected_date_range.end]
  //                   : ['now-15m', 'now'],
  //             },
  //           })
  //         );
  //         await dispatch(
  //           updateFields({
  //             tabId,
  //             data: {
  //               [SELECTED_FIELDS]: [...objectData?.selected_fields?.tokens],
  //             },
  //           })
  //         );
  //         await dispatch(
  //           updateTabName({
  //             tabId,
  //             tabName: objectData.name,
  //           })
  //         );
  //         // fill saved user configs
  //         if (objectData?.type) {
  //           await dispatch(
  //             updateVizConfig({
  //               tabId,
  //               vizId: objectData?.type,
  //               data: JSON.parse(objectData.user_configs),
  //             })
  //           );
  //         }
  //       });

  //       // update UI state with saved data
  //       setSelectedPanelName(objectData?.name || '');
  //       setCurVisId(objectData?.type || 'bar');
  //       setTempQuery((staleTempQuery: string) => {
  //         return appLogEvents ? currQuery : objectData?.query || staleTempQuery;
  //       });
  //       const tabToBeFocused = isSavedQuery
  //         ? TYPE_TAB_MAPPING[SAVED_QUERY]
  //         : TYPE_TAB_MAPPING[SAVED_VISUALIZATION];
  //       setSelectedContentTab(tabToBeFocused);
  //       await fetchData();
  //     })
  //     .catch((error) => {
  //       notifications.toasts.addError(error, {
  //         title: `Cannot get saved data for object id: ${objectId}`,
  //       });
  //     });
  // };

  // Add visualization to application's panel
  const addVisualizationToPanel = async (
    appId: string,
    visualizationId: string,
    panelId: string
  ) => {
    return http
      .post(`${CUSTOM_PANELS_API_PREFIX}/visualizations`, {
        body: JSON.stringify({
          panelId,
          savedVisualizationId: visualizationId,
        }),
      })
      .then(() => {
        fetchAppById(
          http,
          pplService,
          appId,
          setApplication,
          setAppConfigs,
          setVisWithAvailability,
          setToasts
        );
      })
      .catch((err) => {
        setToasts(`Error in adding ${visualizationName} visualization to the panel`, 'danger');
        console.error(err);
      });
  };
  // need to move to common , copied from explorer
  const handleSavingObject = (appId, appName, type, panelId) => {
    // create new saved visualization
    debugger;
    savedObjects
      .createSavedVisualization({
        query: 'source = opensearch_dashboards_sample_data_logs | stats count() , max( memory ) ',
        fields: [],
        dateRange: ['now/y', 'now'],
        type: 'bar',
        name: appName,
        timestamp: 'timestamp',
        applicationId: appId,
        userConfigs: JSON.stringify({}),
        description: '',
      })
      .then((res: any) => {
        batch(() => {
          addVisualizationToPanel(appId, res.objectId, panelId);
          dispatch(
            changeQuery({
              undefined,
              query: {
                [SAVED_OBJECT_ID]: res.objectId,
                [SAVED_OBJECT_TYPE]: SAVED_VISUALIZATION,
              },
            })
          );
          dispatch(
            updateTabName({
              undefined,
              tabName: selectedPanelNameRef.current,
            })
          );
        });
        setToast('New visualization');
        return res;
      })
      .catch((error: any) => {
        notifications.toasts.addError(error, {
          title: `Cannot save Visualization '${selectedPanelNameRef.current}'`,
        });
      });
  };

  // Create a new application
  const createApp = async (application: ApplicationRequestType, type: string) => {
    const toast = isNameValid(
      application.name,
      applicationList.map((obj) => obj.name)
    );
    if (toast.length > 0) {
      setToast(toast.join(', '), 'danger');
      return;
    }

    const requestBody = {
      name: application.name,
      description: application.description || '',
      baseQuery: application.baseQuery,
      servicesEntities: application.servicesEntities,
      traceGroups: application.traceGroups,
      availabilityVisId: '',
      // appType: application.appType, TODO uncomment this when backend api is fixed to accept this new field
    };

    return http
      .post(`${APP_ANALYTICS_API_PREFIX}/`, {
        body: JSON.stringify(requestBody),
      })
      .then(async (res) => {
        debugger;
        createPanelForApp(res.newAppId, application.name, type);
        const tabId = `application-analytics-tab-${appId}`;
        initializeTabData(dispatch, tabId, NEW_TAB);
        setToast(`Application "${application.name}" successfully created!`);
        clearStorage();
      })
      .catch((err) => {
        setToast(`Error occurred while creating new application "${application.name}"`, 'danger');
        console.error(err);
      });
  };

  // Rename an existing application
  const renameApp = (newAppName: string, appId: string) => {
    const toast = isNameValid(
      newAppName,
      applicationList.map((obj) => obj.name)
    );
    if (toast.length > 0) {
      setToast(toast.join(', '), 'danger');
      return;
    }

    const requestBody = {
      appId,
      name: newAppName,
    };

    return http
      .put(`${APP_ANALYTICS_API_PREFIX}/rename`, {
        body: JSON.stringify(requestBody),
      })
      .then((res) => {
        setApplicationList((prevApplicationList) => {
          const newApplicationData = [...prevApplicationList];
          const renamedApplication = newApplicationData.find(
            (application) => application.id === appId
          );
          if (renamedApplication) renamedApplication.name = newAppName;
          return newApplicationData;
        });
        setToast(`Application successfully renamed to "${newAppName}"`);
      })
      .catch((err) => {
        setToast('Error occurred while renaming application', 'danger');
        console.error(err);
      });
  };

  // Update existing application
  const updateApp = (
    appId: string,
    updateAppData: Partial<ApplicationRequestType>,
    type: string,
    appName: string
  ) => {
    const requestBody = {
      appId,
      updateBody: updateAppData,
    };

    return http
      .put(`${APP_ANALYTICS_API_PREFIX}/`, {
        body: JSON.stringify(requestBody),
      })
      .then((res) => {
        // if (appType === 'integrations') {
        handleSavingObject(appId, appName, type, updateAppData.panelId);
        //  }
        if (type === 'update') {
          setToast('Application successfully updated.');
          clearStorage();
          moveToApp(res.updatedAppId, type);
        }
        if (type.startsWith('create')) {
          moveToApp(res.updatedAppId, type);
        }
      })
      .catch((err) => {
        setToast('Error occurred while updating application', 'danger');
        console.error(err);
      });
  };

  // Delete existing applications
  const deleteApp = (appList: string[], panelList: string[], toastMessage?: string) => {
    return http
      .delete(`${APP_ANALYTICS_API_PREFIX}/${appList.join(',')}`)
      .then((res) => {
        setApplicationList((prevApplicationList) => {
          return prevApplicationList.filter((app) => !appList.includes(app.id));
        });

        for (let i = 0; i < appList.length; i++) {
          removeTabData(dispatch, appList[i], '');
        }

        for (let i = 0; i < panelList.length; i++) {
          deleteSavedVisualizationsForPanel(panelList[i]);
        }

        const message =
          toastMessage || `Application${appList.length > 1 ? 's' : ''} successfully deleted!`;
        setToast(message);
        return res;
      })
      .catch((err: any) => {
        setToast('Error occured while deleting application', 'danger');
        console.error(err);
      });
  };

  const callback = (childFunc: () => void) => {
    if (childFunc && triggerSwitchToEvent > 0) {
      childFunc();
      setTriggerSwitchToEvent(triggerSwitchToEvent - 1);
    }
  };

  return (
    <div>
      <EuiGlobalToastList
        toasts={toasts}
        dismissToast={(removedToast) => {
          setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
        }}
        toastLifeTimeMs={6000}
      />
      <Switch>
        <Route
          exact
          path={['/', '/application_analytics', '/integrations', '/integrations/plugins']}
          render={() => (
            <ObservabilitySideBar>
              <AppTable
                loading={false}
                applications={applicationList}
                fetchApplications={fetchApps}
                renameApplication={renameApp}
                deleteApplication={deleteApp}
                clearStorage={clearStorage}
                moveToApp={moveToApp}
                appType={appType}
                {...commonProps}
              />
            </ObservabilitySideBar>
          )}
        />
        <Route
          exact
          path={[
            '/application_analytics/create',
            '/application_analytics/edit/:id+',
            '/application_analytics/create/:id+',
          ]}
          render={(routerProps) => {
            const query = new URLSearchParams(routerProps.location.search);
            return (
              <CreateApp
                dslService={dslService}
                pplService={pplService}
                createApp={createApp}
                updateApp={updateApp}
                setToasts={setToast}
                clearStorage={clearStorage}
                existingAppId={decodeURIComponent(routerProps.match.params.id) || ''}
                appType={query.get('type')}
                appName={query.get('app')}
                {...commonProps}
              />
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
          path={['/application_analytics/:id+', '/integrations/plugins/:id+']}
          render={(routerProps) => (
            <Application
              disabled={false}
              appId={decodeURIComponent(routerProps.match.params.id)}
              pplService={pplService}
              dslService={dslService}
              savedObjects={savedObjects}
              timestampUtils={timestampUtils}
              notifications={notifications}
              setToasts={setToast}
              updateApp={updateApp}
              callback={callback}
              appType={appType}
              {...commonProps}
            />
          )}
        />
      </Switch>
    </div>
  );
};
