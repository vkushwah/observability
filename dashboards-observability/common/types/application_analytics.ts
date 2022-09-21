/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export interface OptionType {
  label: string;
}

export interface ApplicationType {
  id: string;
  dateCreated: string;
  dateModified: string;
  name: string;
  description: string;
  baseQuery: string;
  servicesEntities: string[];
  traceGroups: string[];
  panelId: string;
  availability: { name: string; color: string; availabilityVisId: string };
}

export interface ApplicationRequestType {
  name: string;
  description: string;
  baseQuery: string;
  servicesEntities: string[];
  traceGroups: string[];
  panelId: string;
  availabilityVisId: string;
  // appType: string | null; TODO Uncomment this line when api if fixed to accept this field
}

export interface AvailabilityType {
  name: string;
  color: string;
  availabilityVisId: string;
}
