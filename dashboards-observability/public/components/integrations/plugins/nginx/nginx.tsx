import React, { useEffect } from 'react';
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
export function Nginx() {
  const Title = 'Nginx App';

  return (
    <EuiPage>
      <EuiPageBody component="div">
        <EuiPageHeader></EuiPageHeader>
        <EuiPageContent id="applicationArea">
          <EuiPageContentHeader>
            <EuiPageContentHeaderSection>
              <EuiTitle data-test-subj="applicationHomePageTitle" size="s">
                <h3>{Title}</h3>
              </EuiTitle>
            </EuiPageContentHeaderSection>
          </EuiPageContentHeader>
          <EuiHorizontalRule />
          <div>
            <EuiFlexGrid columns={4} gutterSize="l">
              {'Nginx'}
            </EuiFlexGrid>
          </div>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}
