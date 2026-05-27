export type LegalSection = {
  title: string;
  paragraphs: string[];
};

export type LegalPageContent = {
  slug: string;
  label: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

const sharedClosingSection: LegalSection = {
  title: 'Contact',
  paragraphs: [
    'Questions about this page may be sent to the Overbase team. This placeholder copy will be replaced with final legal language before publication.',
    'Notices should include enough detail for us to identify the relevant account, workspace, agreement, or security matter.'
  ]
};

export const legalPages = [
  {
    slug: 'terms-of-service',
    label: 'Terms',
    title: 'Terms of Use',
    description: 'Terms of use for Overbase.',
    updatedAt: '05/26/2026',
    sections: [
      {
        title: 'Introduction',
        paragraphs: [
          'Welcome to Overbase, Inc. These terms are placeholder text and describe the general rules that may apply when customers, partners, and visitors use our website, application, and related services.',
          'By accessing the service, you agree that final terms may govern your use of Overbase. The language on this page is dummy content and should not be treated as legal advice or a binding agreement.',
          'The services may include tools for sharing data, discovering partner opportunities, and receiving email-based recommendations. Final terms will explain eligibility, account responsibilities, and acceptable use.'
        ]
      },
      {
        title: 'Accounts and Access',
        paragraphs: [
          'You may need an account to use portions of the service. You are responsible for keeping login credentials confidential and for activity that occurs under your account.',
          'We may change, suspend, or discontinue parts of the service as the product evolves. Dummy copy in this section reserves room for production language about access, availability, and support.'
        ]
      },
      {
        title: 'Customer Data',
        paragraphs: [
          'Customers and partners may submit business information to Overbase. Placeholder terms will be replaced with final language describing ownership, permissions, processing instructions, and permitted use.',
          'The final agreement may also describe how data is shared between approved parties and how customers can request deletion, export, or correction of their information.'
        ]
      },
      sharedClosingSection
    ]
  },
  {
    slug: 'dpa',
    label: 'DPA',
    title: 'Data Processing Addendum',
    description: 'Data processing addendum for Overbase.',
    updatedAt: '05/26/2026',
    sections: [
      {
        title: 'Scope',
        paragraphs: [
          'This data processing addendum is placeholder text for customers that may provide personal data to Overbase in connection with the services.',
          'The final addendum will describe the relationship between the parties, the categories of data processed, the business purposes for processing, and the instructions that apply.'
        ]
      },
      {
        title: 'Processing Commitments',
        paragraphs: [
          'Overbase will process customer data only as described in the final agreement and documented customer instructions. This dummy copy marks space for obligations around confidentiality, security, and assistance.',
          'The production version may include provisions for subprocessors, international transfers, audit requests, incident notification, deletion, and return of data.'
        ]
      },
      {
        title: 'Customer Responsibilities',
        paragraphs: [
          'Customers are responsible for providing notices, obtaining required permissions, and ensuring that submitted data may be processed by Overbase for the intended business purpose.',
          'This placeholder section may be replaced with operational details for data source configuration, partner permissions, and account-level controls.'
        ]
      },
      sharedClosingSection
    ]
  },
  {
    slug: 'security',
    label: 'Security',
    title: 'Security',
    description: 'Security practices for Overbase.',
    updatedAt: '05/26/2026',
    sections: [
      {
        title: 'Overview',
        paragraphs: [
          'Security is central to how Overbase handles customer and partner data. This page contains dummy text that outlines the structure of a future security overview.',
          'The final page may describe how Overbase protects systems, reviews access, monitors infrastructure, and responds to vulnerabilities or security events.'
        ]
      },
      {
        title: 'Access Controls',
        paragraphs: [
          'Access to production systems is limited to authorized team members with a business need. Placeholder copy in this section will be replaced with final details about authentication, authorization, and review processes.',
          'Customer-facing access controls may include workspace permissions, invitation flows, and partner sharing controls. Final language will describe the controls available in the product.'
        ]
      },
      {
        title: 'Data Protection',
        paragraphs: [
          'Overbase may use encryption, logging, network controls, and operational safeguards to protect data. This dummy copy reserves room for specific security practices after they are approved for publication.',
          'The production version may also include vulnerability disclosure instructions, incident response commitments, and information about third-party infrastructure providers.'
        ]
      },
      sharedClosingSection
    ]
  }
] as const satisfies LegalPageContent[];

export type LegalSlug = (typeof legalPages)[number]['slug'];

export const legalNavigationItems = legalPages.map(({ label }) => ({
  label,
  href: '#'
}));

export const getLegalPage = (slug: string) => legalPages.find((page) => page.slug === slug);
