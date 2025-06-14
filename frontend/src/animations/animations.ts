import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const animations = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

  // Hero animations
  document.querySelectorAll('.timeline-hero').forEach((block) => {
    const elements = block.querySelectorAll('.js-hero')
    if (elements.length === 0) return

    gsap.set(elements, {
      opacity: 0,
      y: -50,
      immediateRender: true,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: block,
        start: 'top 90%',
        once: false,
      },
    })

    tl.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.2,
      ease: 'power1.inOut',
    })
      .to(
        elements,
        {
          opacity: 0.5,
          duration: 0.5,
          stagger: 0.2,
          ease: 'power1.inOut',
        },
        '+=0.5',
      )
      .to(elements, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
        ease: 'power1.inOut',
      })
  })

  // Timeline blocks with ROW GROUPING (like the original)
  const blocks = document.querySelectorAll('.timeline-block')
  blocks.forEach((block) => {
    const hasApiElements = block.querySelector('.js-from-down')
    if (hasApiElements) {
      return
    }

    const elements = Array.from(block.querySelectorAll('.js-from-down-tl'))
    if (elements.length === 0) return

    // GROUP BY ROWS based on offsetTop (this was the key part!)
    const rows: Record<number, Element[]> = {}
    elements.forEach((el) => {
      const top = (el as HTMLElement).offsetTop
      if (!rows[top]) rows[top] = []
      rows[top].push(el)
    })

    // Animate each row separately
    Object.values(rows).forEach((row) => {
      gsap.set(row, { opacity: 0, y: 50 })
      gsap.to(row, {
        scrollTrigger: {
          trigger: row[0], // Use first element of the row as trigger
          start: 'top 70%',
          once: false,
          markers: false,
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: {
          each: 0.3, // Stagger within the row
        },
        onComplete: function () {
          this.targets()[0].style.transform = ''
        },
      })
    })
  })

  // API-loaded content with stagger animation
  const fromDownContainers = document.querySelectorAll('.js-from-down')
  fromDownContainers.forEach((container) => {
    const childElements = container.children
    if (childElements.length === 0) return

    gsap.set(childElements, { opacity: 0, y: 50 })
    gsap.to(childElements, {
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power1.inOut',
      stagger: 0.2,
    })
  })

  // Horizontal line animations
  const hrs = document.querySelectorAll<HTMLHRElement>('hr.js-hr-animate')
  hrs.forEach((hr) => {
    gsap.set(hr, { width: '0%' })
    gsap.to(hr, {
      width: '100%',
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: hr,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
    })
  })

  ScrollTrigger.refresh()
}

export default animations
