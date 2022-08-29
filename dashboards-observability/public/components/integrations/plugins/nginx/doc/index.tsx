import {
  EuiButton,
  EuiButtonEmpty,
  EuiCodeBlock,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyoutFooter,
  EuiHorizontalRule,
  EuiLink,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import React, { useState } from 'react';
import { FlyoutContainers } from '../../../../common/flyout_containers';
import { NginxConfig } from './constant';

type Props = {
  appName: string;
};

export function NginxDocument({ appName }: Props) {
  const [isFlyoutVisibleIntegration, setIsFlyoutVisibleIntegration] = useState(false);
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
          <EuiPageContent style={{ overflow: 'scroll' }} id="appInfo">
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle size="l">
                  <h1>{appName} Configurations</h1>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiHorizontalRule />
            <EuiTitle data-test-subj="createPageTitle" size="s">
              <h6>{NginxConfig.STEP_1}</h6>
            </EuiTitle>
            <br />
            <EuiText data-test-subj="createPageTitle" size="s">
              {NginxConfig.STEP1_DESC}
            </EuiText>
            <br />
            <EuiCodeBlock language="json" overflowHeight={300}>
              {NginxConfig.CONFIGURATION_STEP1}
            </EuiCodeBlock>
            <br />
            <EuiTitle data-test-subj="createPageTitle" size="s">
              <h6>{NginxConfig.STEP_2}</h6>
            </EuiTitle>
            <br />
            <EuiText data-test-subj="createPageTitle" size="s">
              {NginxConfig.STEP2_DESC}
            </EuiText>
            <br />
            <EuiCodeBlock language="json" overflowHeight={300}>
              {NginxConfig.CONFIGURATION_STEP2}
            </EuiCodeBlock>
            <br />
            <EuiTitle data-test-subj="createPageTitle" size="s">
              <h6>{NginxConfig.STEP_3}</h6>
            </EuiTitle>
            <br />
            <EuiText data-test-subj="createPageTitle" size="s">
              {NginxConfig.STEP3_DESC}
            </EuiText>
            <br />
            <EuiCodeBlock language="json" overflowHeight={300}>
              {NginxConfig.CONFIGURATION_STEP3}
            </EuiCodeBlock>
            <br />
            <EuiText data-test-subj="createPageTitle" size="s">
              {NginxConfig.STEP5_DESC}
            </EuiText>
            <br />
            <EuiCodeBlock language="json" overflowHeight={300}>
              {NginxConfig.CONFIGURATION_STEP4}
            </EuiCodeBlock>
            <br />
            <EuiTitle data-test-subj="createPageTitle" size="s">
              <h6>{NginxConfig.STEP_4}</h6>
            </EuiTitle>
            <br />
            <EuiText data-test-subj="createPageTitle" size="s">
              {NginxConfig.STEP4_DESC}
            </EuiText>
            <br />
            <EuiCodeBlock language="json" overflowHeight={300}>
              {NginxConfig.CONFIGURATION_STEP5}
            </EuiCodeBlock>
            <br />
            <EuiLink
              href={
                'https://github.com/opensearch-project/observability/issues/646#issuecomment-1153889558'
              }
              target="_blank"
            >
              Click here for more details
            </EuiLink>
            <br />
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
        ariaLabel="configurationLayout"
      />
    );
  }

  return (
    <div>
      <EuiPageBody component="div" style={{ marginLeft: '28px' }}>
        <EuiPageHeader>
          <EuiPageHeaderSection>
            <EuiTitle data-test-subj="createPageTitle" size="l">
              <h1>Document panel</h1>
            </EuiTitle>
          </EuiPageHeaderSection>
        </EuiPageHeader>
        <EuiPageContent id="appInfo">
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle size="m">
                <h2>{appName} information</h2>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiHorizontalRule />
          <EuiTitle data-test-subj="createPageTitle" size="m">
            <h6>Installation</h6>
          </EuiTitle>
          <br />
          <EuiText grow={false}>
            NGINX is open source software for web serving, reverse proxying, caching, load
            balancing, media streaming, and more. It started out as a web server designed for
            maximum performance and stability.
          </EuiText>
          <br />
          <EuiTitle data-test-subj="createPageTitle" size="s">
            <h6>{NginxConfig.STEP_1}</h6>
          </EuiTitle>
          <EuiPanel color="subdued" borderRadius="none" hasShadow={false}>
            <p>sudo apt update</p>
          </EuiPanel>
          <br />
          <EuiTitle data-test-subj="createPageTitle" size="s">
            <h3>{NginxConfig.STEP_2}</h3>
          </EuiTitle>
          <EuiPanel color="subdued" borderRadius="none" hasShadow={false}>
            <p>sudo apt install nginx</p>
          </EuiPanel>
          <EuiSpacer />
          <EuiButtonEmpty color={'primary'} onClick={openIntegrationFlyout}>
            Configurations
          </EuiButtonEmpty>
          {/* <EuiPanel color="transparent" hasBorder={false}>
        <p>I am a transparent box simply for padding</p>
      </EuiPanel> */}
        </EuiPageContent>
      </EuiPageBody>
      {integrationFlyout}
    </div>
  );
}
