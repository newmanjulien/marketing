<script lang="ts">
  import ContentPage from '$lib/content/ContentPage.svelte';
  import type { ContentParagraph } from '$lib/content/contentTypes';

  const aboutIntro = [
    [
      {
        text: "We are machine learning engineers who have been building sales tech together for over 10 years"
      }
    ],
    [
      {
        text: "We work exclusively with the best and most client-focused professional services firms"
      }
    ],
    [
      {
        text: "We believe business software should be invisible. And we believe that sales tech should let companies be more client-focused rather than distract them from what truly matters"
      }
    ],
    [
      {
        text: "If you'd like to join us, check out "
      },
      {
        text: 'our open roles',
        href: '/careers'
      }
    ]
  ] satisfies ContentParagraph[];
</script>

<ContentPage
  title="About"
  description="Learn about Overbase and the team behind it."
  heading="About"
  introParagraphs={aboutIntro}
/>
