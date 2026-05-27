import {
  ChartLineUpIcon,
  CloudIcon,
  GraphIcon,
  GoogleLogoIcon,
  MicrosoftExcelLogoIcon,
  MicrosoftOutlookLogoIcon,
  MicrosoftTeamsLogoIcon,
  PhoneCallIcon,
  SignatureIcon,
  SlackLogoIcon,
  SnowflakeIcon,
  UserListIcon
} from 'phosphor-svelte';
import type { Component } from 'svelte';
import type { PageMeta } from '$lib/page/pageMeta';

type HomeFeatureKey = 'dataSources' | 'partnerSharing' | 'opportunityEmail';

type HomeFeatureContent = {
  title: string;
  body: string;
};

type DataSourceItem = {
  label: string;
  icon: Component;
};

type PartnerDataShare = {
  partnerName: string;
  dataSourceSummary: string;
  dataSourceCoverage: number;
};

export const homePageContent = {
  title: 'Overbase - Share sales data',
  description:
    'Overbase helps professional services firms share sales data with ecosystem partners and receive revenue opportunities by email.',
  features: {
    dataSources: {
      title: 'Share your data',
      body: 'Share any structured data like CRM and share any unstructured data like email. Easily share even your most disconnected data'
    },
    partnerSharing: {
      title: 'Partners share their data',
      body: 'Your ecosystem partners can share data with you for free and securely'
    },
    opportunityEmail: {
      title: 'Get opportunities by email',
      body: 'We compare both sides to find overlap, then we send actionable revenue opportunities to your team by email'
    }
  }
} as const satisfies PageMeta & {
  features: Record<HomeFeatureKey, HomeFeatureContent>;
};

export const dataSourceItems = [
  { label: 'Salesforce', icon: CloudIcon },
  { label: 'Outlook', icon: MicrosoftOutlookLogoIcon },
  { label: 'Snowflake', icon: SnowflakeIcon },
  { label: 'Gong', icon: PhoneCallIcon },
  { label: 'Excel', icon: MicrosoftExcelLogoIcon },
  { label: 'Slack', icon: SlackLogoIcon },
  { label: 'Bloomberg', icon: ChartLineUpIcon },
  { label: 'DocuSign', icon: SignatureIcon },
  { label: 'Teams', icon: MicrosoftTeamsLogoIcon },
  { label: 'Gmail', icon: GoogleLogoIcon },
  { label: 'HubSpot', icon: GraphIcon },
  { label: 'ZoomInfo', icon: UserListIcon }
] as const satisfies readonly DataSourceItem[];

export const partnerDataShares = [
  {
    partnerName: 'Kensington, Blake & Thorne',
    dataSourceSummary: 'all data sources',
    dataSourceCoverage: 1
  },
  {
    partnerName: 'Caldwell, Cross & Keating',
    dataSourceSummary: '5 data sources',
    dataSourceCoverage: 0.69
  },
  {
    partnerName: 'Brightfield Partners',
    dataSourceSummary: '2 data sources',
    dataSourceCoverage: 0.14
  }
] as const satisfies readonly PartnerDataShare[];
