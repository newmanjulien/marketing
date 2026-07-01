<script lang="ts">
  import {
    ChartLineUpIcon,
    CloudIcon,
    GoogleLogoIcon,
    GraphIcon,
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

  type DataSourceItem = {
    label: string;
    icon: Component;
  };

  const dataSourceItems = [
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
</script>

<div class="grid grid-cols-2 gap-[12px] sm:grid-cols-3">
  {#each dataSourceItems as dataSource (dataSource.label)}
    {@const Icon = dataSource.icon}
    <div
      class="flex h-[45px] items-center rounded-[8px] border border-stone-200/70 bg-white px-[13px] text-stone-700"
    >
      <span class="flex h-[25px] w-[25px] shrink-0 items-center justify-center text-stone-300">
        <Icon size={24} weight="regular" />
      </span>
      <span class="ml-[16px] text-[14px] font-book leading-none tracking-normal">
        {dataSource.label}
      </span>
    </div>
  {/each}
</div>
