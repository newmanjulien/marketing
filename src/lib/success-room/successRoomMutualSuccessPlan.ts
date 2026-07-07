export type MutualSuccessBenefitCard = {
  id: string;
  title: string;
  description: string;
};

export type MutualSuccessPlanTask = {
  title: string;
  date: string;
  assigneeImageHref: string | null;
};

export type MutualSuccessPlanItem = {
  id: string;
  title: string;
  description: string;
  variant?: 'muted';
  tasks: readonly MutualSuccessPlanTask[];
};

export const mutualSuccessBenefitCards = [
  {
    id: 'faster-onboarding',
    title: 'Faster onboarding',
    description: 'Dummy benefit copy that explains the expected business value in a short paragraph.'
  },
  {
    id: 'cleaner-handoffs',
    title: 'Cleaner handoffs',
    description: 'Dummy benefit copy that keeps the card balanced while matching the surrounding plan.'
  },
  {
    id: 'less-manual-work',
    title: 'Less manual work',
    description: 'Dummy benefit copy for a workflow improvement that will be replaced with real content.'
  },
  {
    id: 'earlier-risk-signals',
    title: 'Earlier risk signals',
    description: 'Dummy benefit copy describing a useful customer insight surfaced at the right moment.'
  },
  {
    id: 'better-follow-up',
    title: 'Better follow-up',
    description: 'Dummy benefit copy that describes a more consistent rhythm across the account team.'
  },
  {
    id: 'clearer-reporting',
    title: 'Clearer reporting',
    description: 'Dummy benefit copy for shared visibility into progress, next steps, and outcomes.'
  }
] as const satisfies readonly MutualSuccessBenefitCard[];

export const mutualSuccessPlanItems = [
  {
    id: 'setup-proof-of-concept',
    title: 'Set up proof of concept',
    description: 'Confirm goals, data access, stakeholders, and success criteria.',
    tasks: [
      {
        title: 'Confirm the proof of concept sponsor and day-to-day owner.',
        date: 'Jul 12',
        assigneeImageHref: null
      },
      {
        title: 'Document the target workflow and sample output expectations.',
        date: 'Jul 15',
        assigneeImageHref: '/julien.png'
      },
      {
        title: 'Share access requirements for source systems and stakeholder calendars.',
        date: 'Jul 18',
        assigneeImageHref: null
      }
    ]
  },
  {
    id: 'start-proof-of-concept',
    title: 'Start 6-week proof of concept',
    description: 'Launch the workflow, review early outputs, and tune the process.',
    tasks: [
      {
        title: 'Kick off the first workflow review with the core project team.',
        date: 'Jul 22',
        assigneeImageHref: null
      },
      {
        title: 'Review initial records for completeness, accuracy, and formatting.',
        date: 'Jul 29',
        assigneeImageHref: '/julien.png'
      },
      {
        title: 'Agree on the weekly feedback cadence and decision log.',
        date: 'Aug 2',
        assigneeImageHref: null
      }
    ]
  },
  {
    id: 'evaluate-proof-of-concept',
    title: 'Proof of concept evaluation',
    description: 'Assess results, document learnings, and decide whether to move forward.',
    variant: 'muted',
    tasks: [
      {
        title: 'Compare proof of concept outcomes against agreed success criteria.',
        date: 'Aug 26',
        assigneeImageHref: null
      },
      {
        title: 'Summarize operational learnings, risks, and recommended next steps.',
        date: 'Aug 29',
        assigneeImageHref: '/julien.png'
      },
      {
        title: 'Confirm the go-forward decision and implementation owners.',
        date: 'Sep 3',
        assigneeImageHref: null
      }
    ]
  }
] as const satisfies readonly MutualSuccessPlanItem[];
