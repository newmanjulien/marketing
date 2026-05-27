<script lang="ts">
  import ContentPage from '$lib/content/ContentPage.svelte';
  import type { ContentLink, ContentParagraph, ContentSection } from '$lib/content/contentTypes';

  const careersIntro = [
    [
      {
        text: "We only hire engineers. We hire 99.9th percentile most smart people. And we never hire anyone who has experience"
      }
    ],
    [
      {
        text: "Reach out if you're an engineering undergrad at MIT or Stanford. Or a CS undergrad at IIT Bombay/Delhi with an AIR of 1 - 50 in the JEE"
      }
    ],
    [
      {
        text: "We also don't care about your visa status"
      }
    ]
  ] satisfies ContentParagraph[];

  const careersLinks = [
    {
      label: 'Product Engineer 1 - USA',
      href: 'https://drive.google.com/file/d/1rCa5Q-wEGkV5wYfdNe4tH1Yn8pFnr3WE/view',
      external: true
    },
    {
      label: 'Product Engineer 1 - India',
      href: 'https://drive.google.com/file/d/11chLFScixDu3RtAG5jKFw6UphwMp4FMF/view',
      external: true
    }
  ] satisfies ContentLink[];

  const careersSections = [
    {
      body: "Overbase is a small team and we don't have a location. We relocate as a group to wherever customers need us most and work from there. Our base pay is as low as possible and we're almost entirely paid based on customer outcomes"
    }
  ] satisfies ContentSection[];
</script>

<ContentPage
  title="Careers"
  description="Learn about careers at Overbase and how the team works."
  heading="Careers at Overbase"
  introParagraphs={careersIntro}
  links={careersLinks}
  sections={careersSections}
/>
