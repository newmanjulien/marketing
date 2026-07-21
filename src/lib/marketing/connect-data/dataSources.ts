import {
  CloudIcon,
  GoogleDriveLogoIcon,
  MicrosoftExcelLogoIcon,
  MicrosoftOutlookLogoIcon
} from 'phosphor-svelte';

// The data sources shown in ConnectDataGraphic: the industry pages cycle
// through all of them, the home page shows just the Outlook entry.

export const salesforce = {
  provider: 'Salesforce',
  icon: CloudIcon,
  title: 'Salesforce sales data',
  buttonText: 'Connect sales data',
  description:
    'Overbase reads your accounts, pipeline and closed deals straight from your CRM — nothing changes in how your team works'
};

export const excel = {
  provider: 'Excel',
  icon: MicrosoftExcelLogoIcon,
  title: 'Excel sales data',
  buttonText: 'Connect sales data',
  description:
    'No CRM required — if your firm tracks clients and deals in spreadsheets, Overbase reads them as they are'
};

export const outlook = {
  provider: 'Outlook',
  icon: MicrosoftOutlookLogoIcon,
  title: 'Outlook calendar data',
  buttonText: 'Connect calendar data',
  description:
    'Your calendar shows who your firm meets — Overbase uses it to map relationships, never the content of your meetings'
};

export const googleDrive = {
  provider: 'Google Drive',
  icon: GoogleDriveLogoIcon,
  title: 'Google Drive documents',
  buttonText: 'Connect document data',
  description:
    'Proposals, engagement letters and reports in your shared drives become signals Overbase can match with your partners'
};

export const dataSources = [salesforce, excel, outlook, googleDrive];
