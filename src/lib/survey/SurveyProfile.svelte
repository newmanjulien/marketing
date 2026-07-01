<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    label,
    title,
    imageSrc,
    imageAlt,
    caption,
    children
  }: {
    label: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    caption: string;
    children: Snippet;
  } = $props();
</script>

<section class="survey-profile">
  <p class="survey-profile__label">{label}</p>
  <h2>{title}</h2>

  <figure>
    <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
    <figcaption>{caption}</figcaption>
  </figure>

  <div class="survey-profile__body">
    {@render children()}
  </div>
</section>

<style>
  .survey-profile {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .survey-profile__label {
    margin: 0;
    font-size: 14px;
    font-weight: 350;
    line-height: 1;
    letter-spacing: 0;
    color: rgb(120 113 108);
    text-transform: uppercase;
  }

  .survey-profile h2 {
    margin: 0;
    font-family: var(--font-heading);
    font-size: 28px;
    font-weight: 500;
    line-height: 1.14;
    color: rgb(28 25 23);
  }

  .survey-profile figure {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 6px 0 0;
  }

  .survey-profile img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 4px;
  }

  .survey-profile figcaption {
    font-size: 13px;
    font-weight: 350;
    line-height: 1.35;
    color: rgb(120 113 108);
  }

  .survey-profile__body {
    display: flex;
    max-width: 620px;
    flex-direction: column;
    gap: 14px;
    margin: 4px 0 0;
    font-size: 16px;
    font-weight: 350;
    line-height: 1.55;
    color: rgb(68 64 60);
  }

  .survey-profile__body :global(p) {
    margin: 0;
  }

  @media (max-width: 640px) {
    .survey-profile {
      gap: 12px;
    }

    .survey-profile h2 {
      font-size: 25px;
    }
  }
</style>
