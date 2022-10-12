/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="cypress" />
import {
  delay,
  TEST_QUERIES,
  querySearch,
  landOnEventVisualizations,
  renderDataConfig,
  saveVisualizationAndVerify,
  deleteVisualization,
} from '../../utils/event_constants';

const renderDataTable = () => {
  landOnEventVisualizations();
  querySearch(TEST_QUERIES[9].query, TEST_QUERIES[9].dateRangeDOM);
  cy.get('[aria-label="config chart selector"] [data-test-subj="comboBoxInput"]')
    .type('Table View')
    .type('{enter}');
};

describe.only('Render Data Table and verify default behavior', () => {
  beforeEach(() => {
    renderDataTable();
  });

  it('Render Data Table and verify by default the data gets render', () => {
    cy.get('.data-table-container').should('exist');
  });

  it('Render Data Table and verify Data Configuration panel default behavior', () => {
    cy.get('.explorer__vizDataConfig').should('exist');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('series').should('exist');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('dimensions').should('exist');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Date Histogram').should('exist');

    cy.get(
      '.panelItem_button .euiButtonIcon.euiButtonIcon--primary.euiButtonIcon--empty.euiButtonIcon--xSmall'
    )
      .eq(0)
      .click();
    cy.get('.first-division .euiFormLabel.euiFormRow__label')
      .contains('Aggregation')
      .should('exist');
    cy.get('.first-division .euiFormLabel.euiFormRow__label').contains('Field').should('exist');
    cy.get('.first-division .euiFormLabel.euiFormRow__label')
      .contains('Custom label')
      .should('exist');

    // cy.get('.euiButton__text').contains('Update chart').should('exist');
  });

  it('Render Data Table and verify Style section for Data Table', () => {
    cy.get('#data-panel').contains('Data').should('exist');
    cy.get('[aria-controls="configPanel__panelOptions"]').contains('Panel options').should('exist');
    cy.get('[aria-controls="configPanel__chartStyles"]').contains('Chart styles').should('exist');
    cy.get('#configPanel__panelOptions').contains('Title').should('exist');
    cy.get('.euiFormHelpText.euiFormRow__text').contains('Name your visualization').should('exist');
    cy.get('#configPanel__panelOptions').contains('Description').should('exist');
  });

  it('Options under Chart Styles section', () => {
    cy.get('[aria-controls="configPanel__chartStyles"]').contains('Chart styles');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Column alignment');
    cy.get('[data-text="Left"]').eq(0).contains('Left');
    cy.get('[data-text="Right"]').eq(0).contains('Right');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Column Width');
  });

  it('Table view should be enabled for Data Table', () => {
    cy.get('.euiSwitch__label').contains('Table view').should('exist');
    cy.get('[data-test-subj="workspace__dataTableViewSwitch"][aria-checked="false"]').click();
    cy.get('.ag-header.ag-pivot-off').should('exist');
  });

  it('Render Data Table and verify legends for Left and Right', () => {
    cy.get('[data-text="Left"]').should('have.text', 'Left');
    cy.get('[data-text="Left"] [data-test-subj="leftAligned"]').should('have.attr', 'checked');
    cy.get('[data-text="Right"]').should('have.text', 'Right').click();
    cy.get('[data-text="Right"] [data-test-subj="rightAligned"]').should(
      'not.have.attr',
      'checked'
    );
  });

  it('Render data table and check for chart style options', () => {
    cy.get('[aria-controls="configPanel__chartStyles"]').contains('Chart styles');
    cy.get('.euiSwitch__label').contains('Show table header').should('exist');
    cy.get('.euiTitle.euiTitle--xxsmall').contains('Column Width');
    cy.get('[data-test-subj="workspace__dataTableViewSwitch"][aria-checked="false"]').click();
    cy.get('.ag-header.ag-pivot-off').should('exist');
  });
});

describe('Save and Delete Visualization', () => {
  beforeEach(() => {
    renderDataTable();
  });

  it('Render Pie chart, Save and Delete Visualization', () => {
    saveVisualizationAndVerify();
    deleteVisualization();
  });
});

describe.only('Render Pie bar chart for 2-way data sync', () => {
  beforeEach(() => {
    landOnEventVisualizations();
    renderDataTable();
  });

  it('Check data configuration fields updated in query on update chart', () => {
    cy.get('.euiFieldNumber').eq(0).clear();
    cy.get('[aria-label="interval field"]').type(2);
    cy.get('[data-test-subj="visualizeEditorRenderButton"]').click();
    cy.get('[data-test-subj="searchAutocompleteTextArea"]').contains('tags');
    cy.get('[data-test-subj="searchAutocompleteTextArea"]').contains('timestamp');
  });
});
