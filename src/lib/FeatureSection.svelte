<script>
  import { onMount } from 'svelte'
  import gsap from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  gsap.registerPlugin(ScrollTrigger)

  export let title = ''
  export let text = ''
  export let index = 0

  let el

  onMount(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    })

    tl.from(el.querySelectorAll('.reveal'), { y: 40, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power2.out' })
  })
</script>

<style>
  section { padding: 80px 0; border-top: 1px solid var(--border); text-align:left }
  .content { max-width: 900px; margin: 0 auto }
  .media { margin-top: 18px }
</style>

<section bind:this={el} id={index === 0 ? 'features' : undefined}>
  <div class="content">
    <h2 class="reveal">{title}</h2>
    <p class="reveal">{text}</p>
    <div class="media reveal">
      <slot />
    </div>
  </div>
</section>
