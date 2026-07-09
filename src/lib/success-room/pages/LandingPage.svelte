<script lang="ts">
  import ContentMeasure from '$lib/page/ContentMeasure.svelte';
  import PageFrame from '$lib/page/PageFrame.svelte';
  import PillTabs from '$lib/ui/PillTabs.svelte';
  import type { PillTab } from '$lib/ui/PillTabs.svelte';
  import ResourceCard from '../documents/ResourceCard.svelte';
  import Header from '../shell/Header.svelte';
  import QuestionsPanel from './QuestionsPanel.svelte';
  import TeamPanel from '../team/TeamPanel.svelte';
  import { createSuccessRoomLandingDraft } from '../persistence/landingDraft.svelte';
  import type { SuccessRoom } from '../domain/types';

  const baseSuccessRoomSections = [
    {
      key: 'documents',
      label: 'Documents'
    },
    {
      key: 'team',
      label: 'Team'
    },
    {
      key: 'questions',
      label: 'Questions'
    }
  ] as const satisfies readonly PillTab[];

  let { room }: { room: SuccessRoom } = $props();
  const successRoomSections = $derived(
    room.questions.length > 0
      ? baseSuccessRoomSections
      : baseSuccessRoomSections.filter((section) => section.key !== 'questions')
  );

  const draft = createSuccessRoomLandingDraft(() => room);
</script>

<PageFrame>
  <ContentMeasure as="section" width="narrow">
    <Header
      eyebrow="Success room"
      title={room.prospectName}
      description={room.description}
    />

    <PillTabs
      idBase={`success-room-${room.slug}`}
      tabs={successRoomSections}
      ariaLabel={`${room.prospectName} success room sections`}
      defaultActiveTabKey="documents"
      listClass="mt-[34px]"
      panelClass="mt-[38px]"
    >
      {#snippet children(section)}
        {#if section.key === 'documents'}
          <nav
            class="grid grid-cols-1 gap-[14px] sm:grid-cols-2 sm:gap-[18px]"
            aria-label={`${room.prospectName} success room resources`}
          >
            {#each room.resources as resource (resource.slug)}
              <ResourceCard {room} {resource} />
            {/each}
          </nav>
        {:else if section.key === 'team'}
          <TeamPanel roomSlug={room.slug} team={room.team} />
        {:else if section.key === 'questions'}
          <QuestionsPanel
            questions={room.questions}
            questionAnswers={draft.questionAnswers}
            onQuestionAnswersChange={draft.setQuestionAnswers}
          />
        {/if}
      {/snippet}
    </PillTabs>
  </ContentMeasure>
</PageFrame>
