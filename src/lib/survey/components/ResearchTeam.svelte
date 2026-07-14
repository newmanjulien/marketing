<script lang="ts">
  import { researchTeamProfiles } from '../domain/landingContent';
</script>

<section
  class="mt-[58px] border-t border-stone-200 pt-[34px]"
  aria-labelledby="research-team-heading"
>
  <h2
    id="research-team-heading"
    class="font-heading text-[22px] font-medium leading-[1.05] tracking-normal text-stone-900"
  >
    Meet the research team
  </h2>

  <div class="mt-[22px] grid grid-cols-1 gap-[12px] sm:grid-cols-2">
    {#each researchTeamProfiles as profile}
      <article
        class="flex min-h-[132px] items-center gap-[16px] rounded-[11px] border border-stone-200 bg-stone-50/70 p-[16px]"
      >
        <img
          src={profile.imageSrc}
          alt={profile.imageAlt}
          class="h-[82px] w-[82px] shrink-0 rounded-full border border-stone-200 bg-white object-cover object-center shadow-sm"
          loading="lazy"
          decoding="async"
        />
        <div class="min-w-0">
          <h3
            class="font-heading text-[18px] font-medium leading-[1.15] tracking-normal text-stone-900"
          >
            {profile.name}
          </h3>
          <p class="mt-[6px] text-[14px] font-book leading-[1.35] tracking-normal text-stone-600">
            {profile.title}
          </p>
        </div>
      </article>
    {/each}
  </div>
</section>
