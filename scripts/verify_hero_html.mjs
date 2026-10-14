async function verifyHero() {
  const response = await fetch('http://localhost:3001/')
  const html = await response.text()

  const heroMatch = html.match(/<section id="hero"[\s\S]*?<\/section>/)
  if (heroMatch) {
    console.log('=== HERO SECTION HTML (first 1000 chars) ===')
    console.log(heroMatch[0].slice(0, 1000))
    console.log('...\n')

    console.log('=== VERIFICATION CHECKS ===')
    console.log('1. Availability badge present:', html.includes('Available for opportunities'))
    console.log('2. Heading contains Dilum:', html.includes("Hi! I&#x27;m") || html.includes("Hi! I'm") || html.includes('Dilum'))
    console.log('3. Subtitle contains AI & ML Enthusiast:', html.includes('AI &amp; ML Enthusiast') || html.includes('AI & ML Enthusiast'))
    console.log('4. Description contains Exploring AI and Machine Learning:', html.includes('Exploring AI and Machine Learning to build intelligent solutions'))
    console.log('5. CTA Button "View My Work":', html.includes('View My Work'))
    console.log('6. CTA Button "Get In Touch":', html.includes('Get In Touch'))
    console.log('7. Profile Image present:', html.includes('avatar-1787626962339-lh7bdy.jpeg') || html.includes('profile-images'))
    console.log('8. Floating AI/ML badge removed:', !html.includes('🤖 AI/ML'))
    console.log('9. Floating Software Dev badge removed:', !html.includes('💻 Software Dev'))
    console.log('10. GitHub link present:', html.includes('https://github.com/dilumgit'))
    console.log('11. LinkedIn link present:', html.includes('linkedin.com'))
    console.log('12. Email mailto present:', html.includes('mailto:dilkaru999@gmail.com'))
  } else {
    console.error('Hero section not found!')
    process.exit(1)
  }
}

verifyHero()
