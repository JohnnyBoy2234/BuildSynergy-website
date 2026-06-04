<script>
  let name = ''
  let email = ''
  let message = ''

  function submit(e) {
    e.preventDefault()
    alert('Thanks — this is a mockup. In production we would wire a backend.')
  }
</script>

<style>
  form { max-width: 700px; margin: 0 auto; display:flex; flex-direction:column; gap:12px }
  input, textarea { padding:10px; border-radius:8px; border:1px solid var(--border) }
  button { background:var(--accent); color:white; padding:10px 16px; border-radius:8px; border:none }
</style>

<section id="contact">
  <div>
    <h2>Contact</h2>
    <p>Let's talk about how animations can help your business.</p>
    <form on:submit={submit}>
      <input placeholder="Name" bind:value={name} />
      <input placeholder="Email" bind:value={email} />
      <textarea rows="4" placeholder="Message" bind:value={message}></textarea>
      <button type="submit">Send</button>
    </form>
  </div>
</section>
