<script>
  import { onMount, onDestroy } from 'svelte'
  import * as THREE from 'three'

  let container
  let renderer, scene, camera, animationId

  onMount(() => {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.set(0, 1.5, 3)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x4f46e5 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(2, 2, 2)
    scene.add(light)

    const ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambient)

    function onResize() {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', onResize)

    function animate() {
      animationId = requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
    }
  })

  onDestroy(() => {
    if (renderer && renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  })
</script>

<style>
  .three-container {
    width: 100%;
    height: 320px;
    border-radius: 8px;
    overflow: hidden;
    background: linear-gradient(180deg, #0f172a 0%, #0b1220 100%);
  }
</style>

<div bind:this={container} class="three-container"></div>
