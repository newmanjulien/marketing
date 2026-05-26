<script lang="ts">
  import type { Component } from 'svelte';
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

  type Integration = {
    label: string;
    icon: Component;
  };

  const integrations: Integration[] = [
    { label: 'Salesforce', icon: CloudIcon },
    { label: 'Outlook', icon: MicrosoftOutlookLogoIcon },
    { label: 'Snowflake', icon: SnowflakeIcon },
    { label: 'Gong', icon: PhoneCallIcon },
    { label: 'Excel', icon: MicrosoftExcelLogoIcon },
    { label: 'Slack', icon: SlackLogoIcon },
    { label: 'Bloomberg', icon: ChartLineUpIcon },
    { label: 'Docusign', icon: SignatureIcon },
    { label: 'Teams', icon: MicrosoftTeamsLogoIcon },
    { label: 'Gmail', icon: GoogleLogoIcon },
    { label: 'Hubspot', icon: GraphIcon },
    { label: 'Zoominfo', icon: UserListIcon }
  ];
</script>

<div class="grid grid-cols-1 gap-[12px] sm:grid-cols-2 md:grid-cols-3">
  {#each integrations as integration}
    <div
      class="integration-tile flex h-[45px] items-center rounded-[8px] border border-stone-200/70 bg-white px-[13px] text-stone-700 md:h-[45px]"
    >
      <span class="flex h-[25px] w-[25px] shrink-0 items-center justify-center text-stone-300">
        <integration.icon size={24} weight="regular" />
      </span>
      <span class="ml-[16px] text-[14px] font-normal leading-none tracking-normal">
        {integration.label}
      </span>
    </div>
  {/each}
</div>
