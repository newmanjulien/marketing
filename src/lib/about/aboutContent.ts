import type { RichTextParagraph, TextPageContent } from '$lib/text-page/textPageTypes';

const aboutIntro = [
  'We are machine learning engineers who have been building sales tech together for over 10 years',
  'We work exclusively with the best and most client-focused professional services firms',
  'We believe business software should be invisible. And we believe that sales tech should let companies be more client-focused rather than distract them from what truly matters',
  [
    {
      text: "If you'd like to join us, check out "
    },
    {
      text: 'our open roles',
      href: '/careers'
    }
  ]
] satisfies RichTextParagraph[];

export const aboutPageContent = {
  title: 'About',
  description: 'Learn about Overbase and the team behind it.',
  heading: 'About',
  introParagraphs: aboutIntro,
  links: [],
  sections: []
} satisfies TextPageContent;
