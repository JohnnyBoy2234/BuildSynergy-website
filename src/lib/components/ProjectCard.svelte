<script lang="ts">
  import type { Project } from '$lib/portfolio';

  let { project }: { project: Project } = $props();
  let cardEl: HTMLAnchorElement;

  function onMove(e: MouseEvent) {
    const r = cardEl.getBoundingClientRect();
    cardEl.style.setProperty('--mx', `${e.clientX - r.left}px`);
    cardEl.style.setProperty('--my', `${e.clientY - r.top}px`);
  }
</script>

<a
  class="proj-card"
  href={`/portfolio/${project.slug}`}
  bind:this={cardEl}
  onmousemove={onMove}
  aria-label={`${project.title} — ${project.category}`}
>
  <div class="card-spotlight" aria-hidden="true"></div>

  <div class="card-media">
    <img
      src={project.heroImage}
      alt={`${project.title} preview`}
      loading="lazy"
      style={`view-transition-name: hero-${project.slug}`}
    />
  </div>

  <div class="card-body">
    <div class="card-meta">
      <span class="card-cat">{project.category}</span>
      <span class="card-year">{project.year}</span>
    </div>
    <h3 class="card-title">{project.title}</h3>
    <p class="card-summary">{project.summary}</p>
    <span class="card-cta">View project →</span>
  </div>
</a>

<style>
  .proj-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    box-shadow: var(--shadow-sm);
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    isolation: isolate;
  }
  .proj-card:hover {
    border-color: color-mix(in srgb, var(--indigo) 40%, transparent);
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
  }

  .card-spotlight {
    position: absolute; inset: 0; z-index: 0;
    border-radius: inherit;
    background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), var(--indigo-soft), transparent 65%);
    opacity: 0; transition: opacity 0.4s; pointer-events: none;
  }
  .proj-card:hover .card-spotlight { opacity: 1; }

  .card-media {
    position: relative; z-index: 1;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
  }
  .card-media img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .proj-card:hover .card-media img { transform: scale(1.04); }

  .card-body {
    position: relative; z-index: 1;
    display: flex; flex-direction: column; gap: 0.6rem;
    padding: 1.5rem 1.5rem 1.65rem;
  }
  .card-meta {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.75rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--text-muted);
  }
  .card-title {
    font-family: var(--display);
    font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em;
    color: var(--text);
  }
  .card-summary { font-size: 0.9rem; line-height: 1.6; color: var(--text-body); }
  .card-cta {
    margin-top: 0.55rem;
    font-family: var(--display); font-size: 0.9rem; font-weight: 600;
    color: var(--indigo);
    transition: transform 0.25s;
  }
  .proj-card:hover .card-cta { transform: translateX(3px); }

  @media (prefers-reduced-motion: reduce) {
    .proj-card, .card-media img, .card-cta { transition: none !important; transform: none !important; }
    .card-spotlight { display: none; }
  }
</style>
