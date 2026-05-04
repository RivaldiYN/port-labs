import 'dotenv/config'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import slugify from 'slugify'

async function seed() {
  console.log('ðŸŒ± Starting database seed...\n')

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env')
  }

  const client = postgres(process.env.DATABASE_URL, { max: 1 })
  const db = drizzle(client, { schema })

  try {
    //  ”€ ”€ 1. Profile  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
    console.log('ðŸ‘¤ Seeding profile...')
    await db.insert(schema.profile).values({
      name: 'Rivaldi Yonathan Nainggolan',
      tagline: 'Full Stack Developer    Building the Impossible.',
      bio: 'Passionate Full Stack Developer with experience in ReactJS, Elysia.js, Laravel & PostgreSQL. Currently studying Informatics at ITERA (Institut Teknologi Sumatera) with GPA 3.45. Open to exciting projects and collaboration.',
      email: 'aldinggln9@gmail.com',
      githubUrl: 'https://github.com/RivaldiYN',
      linkedinUrl: 'https://linkedin.com/in/rivaldiyn',
      location: 'Lampung, Indonesia',
    }).onConflictDoNothing()
    console.log('    œ… Profile seeded\n')

    //  ”€ ”€ 2. Skills  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
    console.log('ðŸ”§ Seeding skills...')
    await db.insert(schema.skills).values([
      // Frontend
      { name: 'ReactJS', category: 'frontend', proficiency: 5, sortOrder: 1 },
      { name: 'TypeScript', category: 'frontend', proficiency: 4, sortOrder: 2 },
      { name: 'Tailwind CSS', category: 'frontend', proficiency: 5, sortOrder: 3 },
      { name: 'Next.js', category: 'frontend', proficiency: 4, sortOrder: 4 },
      { name: 'Framer Motion', category: 'frontend', proficiency: 3, sortOrder: 5 },
      // Backend
      { name: 'Elysia.js', category: 'backend', proficiency: 4, sortOrder: 1 },
      { name: 'Laravel', category: 'backend', proficiency: 4, sortOrder: 2 },
      { name: 'Node.js', category: 'backend', proficiency: 4, sortOrder: 3 },
      { name: 'Golang', category: 'backend', proficiency: 3, sortOrder: 4 },
      // Database
      { name: 'PostgreSQL', category: 'database', proficiency: 5, sortOrder: 1 },
      { name: 'MySQL', category: 'database', proficiency: 4, sortOrder: 2 },
      { name: 'Redis', category: 'database', proficiency: 3, sortOrder: 3 },
      // Tools
      { name: 'Git', category: 'tools', proficiency: 5, sortOrder: 1 },
      { name: 'Docker', category: 'tools', proficiency: 3, sortOrder: 2 },
      { name: 'Figma', category: 'tools', proficiency: 4, sortOrder: 3 },
    ]).onConflictDoNothing()
    console.log('    œ… 15 skills seeded\n')

    //  ”€ ”€ 3. Experiences  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
    console.log('ðŸ’¼ Seeding experiences...')
    await db.insert(schema.experiences).values([
      {
        company: 'PT Technova Solusi Integrasi',
        role: 'Frontend Developer (Remote)',
        description: 'Mengembangkan dashboard monitoring berbasis ReactJS dengan integrasi OpenStreetMap dan Machine Learning. Memimpin pengembangan UI/UX untuk sistem manajemen lapangan yang digunakan oleh ratusan pengguna.',
        techStack: ['ReactJS', 'TypeScript', 'OpenStreetMap', 'TailwindCSS', 'REST API'],
        startDate: '2025-10-01',
        endDate: '2026-10-01',
        isCurrent: false,
        sortOrder: 1,
      },
      {
        company: 'PT Kimia Farma Tbk',
        role: 'Full Stack Developer Intern',
        description: 'Membangun sistem HRIS (Human Resource Information System) internal menggunakan Laravel dan PostgreSQL. Mengimplementasikan fitur penggajian, absensi, dan laporan HR dengan Redis untuk caching.',
        techStack: ['Laravel', 'PostgreSQL', 'Redis', 'Vue.js', 'REST API'],
        startDate: '2025-12-01',
        endDate: '2026-06-01',
        isCurrent: false,
        sortOrder: 2,
      },
    ]).onConflictDoNothing()
    console.log('    œ… 2 experiences seeded\n')

    //  ”€ ”€ 4. Projects  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
    console.log('ðŸ—‚ï¸  Seeding projects...')

    const projectsData = [
      {
        title: 'Dashboard ML Monitoring    PT Technova',
        description: 'Dashboard real-time untuk monitoring lapangan dengan integrasi Machine Learning dan OpenStreetMap. Menampilkan data sensor, prediksi anomali, dan heatmap interaktif.',
        content: `## Overview\n\nDashboard monitoring berbasis web yang dibangun untuk PT Technova Solusi Integrasi. Sistem ini mengintegrasikan data real-time dari sensor IoT dengan model Machine Learning untuk deteksi anomali.\n\n## Fitur Utama\n\n- **Real-time Monitoring**    Update data setiap 5 detik via WebSocket\n- **Heatmap Interaktif**    Visualisasi distribusi data di atas peta OpenStreetMap\n- **Anomaly Detection**    Integrasi model ML untuk prediksi anomali\n- **Responsive Dashboard**    Support mobile dan desktop\n\n## Tech Stack\n\n- ReactJS + TypeScript\n- OpenStreetMap (Leaflet.js)\n- TailwindCSS\n- WebSocket (real-time)\n- REST API`,
        techStack: ['ReactJS', 'TypeScript', 'OpenStreetMap', 'TailwindCSS', 'WebSocket'],
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-01-15'),
      },
      {
        title: 'HRIS    PT Kimia Farma',
        description: 'Sistem Human Resource Information System internal untuk PT Kimia Farma Tbk. Mengelola penggajian, absensi, dan laporan HR dengan dashboard admin yang komprehensif.',
        content: `## Overview\n\nSistem HRIS (Human Resource Information System) yang dibangun sebagai proyek magang di PT Kimia Farma Tbk. Sistem ini mengelola seluruh proses HR dari absensi hingga penggajian.\n\n## Fitur Utama\n\n- **Manajemen Karyawan**    CRUD data karyawan lengkap\n- **Sistem Absensi**    Check-in/out dengan QR Code\n- **Penggajian Otomatis**    Kalkulasi gaji dengan potongan dan tunjangan\n- **Laporan HR**    Export PDF dan Excel\n- **Caching Redis**    Performa optimal untuk data yang sering diakses\n\n## Tech Stack\n\n- Laravel 11 (PHP)\n- PostgreSQL\n- Redis\n- Vue.js\n- REST API`,
        techStack: ['Laravel', 'PostgreSQL', 'Redis', 'Vue.js', 'PHP'],
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-02-01'),
      },
      {
        title: 'Antigravity Portfolio',
        description: 'Website portfolio personal dengan CMS admin, dibangun dengan Elysia.js backend dan React frontend. Tema Spotify Green dengan animasi premium dan WCAG 2.1 AA compliant.',
        content: `## Overview\n\nPortfolio personal yang kamu sedang lihat sekarang! Dibangun dengan stack modern yang berfokus pada performa dan aksesibilitas.\n\n## Fitur Utama\n\n- **CMS Admin**    Kelola project, post, dan profil via dashboard\n- **Blog**    Tulis artikel dengan Markdown editor\n- **Dark Mode**    Tema Spotify Green yang premium\n- **WCAG 2.1 AA**    Fully accessible\n- **Animasi**    Framer Motion + custom CSS animations\n\n## Tech Stack\n\n- Elysia.js (Bun runtime)\n- React + TypeScript\n- TailwindCSS\n- PostgreSQL + Drizzle ORM\n- MinIO (file storage)`,
        techStack: ['Elysia.js', 'React', 'TypeScript', 'PostgreSQL', 'TailwindCSS', 'Drizzle ORM'],
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2026-03-01'),
      },
    ]

    for (const project of projectsData) {
      const slug = slugify(project.title, { lower: true, strict: true })
      await db.insert(schema.projects).values({
        ...project,
        slug,
      }).onConflictDoNothing()
    }
    console.log('    œ… 3 projects seeded\n')

    //  ”€ ”€ 5. Posts  ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€ ”€
    console.log('ðŸ“° Seeding posts...')

    const postsData = [
      {
        title: 'Kenapa Saya Memilih Elysia.js untuk Backend Portfolio Ini',
        excerpt: 'Elysia.js adalah framework TypeScript yang berjalan di Bun runtime. Lebih cepat dari Express, lebih ringan dari NestJS, dan developer experience yang luar biasa.',
        content: `## Latar Belakang\n\nKetika membangun portfolio ini, saya dihadapkan pada pilihan framework backend: Express, Fastify, NestJS, atau Elysia.js. Pilihan saya jatuh pada Elysia.js.\n\n## Kenapa Elysia.js?\n\n### 1. Performa Luar Biasa\n\nElysia.js berjalan di atas Bun runtime yang diklaim 3x lebih cepat dari Node.js. Dalam benchmark sederhana, Elysia mampu menangani lebih dari 200k request/detik.\n\n### 2. Type Safety End-to-End\n\nElysia memiliki sistem tipe yang sangat ketat. Setiap route, middleware, dan response punya tipe yang terdefinisi dengan baik.\n\n### 3. Developer Experience\n\nSintaks yang bersih, plugin ekosistem yang bagus (JWT, CORS, Swagger), dan error message yang informatif.\n\n## Kesimpulan\n\nElysia.js adalah pilihan yang tepat untuk project portfolio yang membutuhkan performa tinggi dengan developer experience yang menyenangkan.`,
        tags: ['Elysia.js', 'Backend', 'Bun', 'TypeScript', 'Performance'],
        isPublished: true,
        publishedAt: new Date('2026-03-10'),
      },
      {
        title: 'Membangun WCAG 2.1 AA Compliant Website dari Awal',
        excerpt: 'Aksesibilitas bukan sekadar checkbox compliance. Ini adalah tanggung jawab developer. Berikut panduan praktis membangun website yang accessible dari hari pertama.',
        content: `## Mengapa Aksesibilitas Penting?\n\nSekitar 15% populasi dunia hidup dengan disabilitas. Membangun website yang tidak accessible berarti mengecualikan jutaan pengguna potensial.\n\n## WCAG 2.1 AA    Apa Saja yang Perlu Diperhatikan?\n\n### 1. Kontras Warna\n\nRasio kontras minimum:\n- **4.5:1** untuk teks normal (< 18pt)\n- **3:1** untuk teks besar (> 18pt)\n\nTheme Spotify Green (#1db954) di atas background gelap (#121212) menghasilkan rasio **5.93:1**    pass!\n\n### 2. Keyboard Navigation\n\nSemua interaksi harus bisa dilakukan dengan keyboard saja. Tab order harus logis mengikuti layout visual.\n\n### 3. ARIA Attributes\n\nGunakan ARIA attributes yang tepat:\n- Modal: \`role="dialog"\` + \`aria-modal="true"\`\n- Toast: \`role="alert"\` + \`aria-live="assertive"\`\n- Icon buttons: \`aria-label\` yang deskriptif\n\n## Tools untuk Testing\n\n\`\`\`bash\nnpx @axe-core/cli http://localhost:5173 --tags wcag2a,wcag2aa\n\`\`\`\n\n## Kesimpulan\n\nMulai dari awal jauh lebih mudah daripada retrofit accessibility ke codebase yang sudah ada. Jadikan accessibility sebagai bagian dari definisi "done".`,
        tags: ['Accessibility', 'WCAG', 'Frontend', 'Best Practices', 'UI/UX'],
        isPublished: true,
        publishedAt: new Date('2026-03-20'),
      },
    ]

    for (const post of postsData) {
      const slug = slugify(post.title, { lower: true, strict: true })
      await db.insert(schema.posts).values({
        ...post,
        slug,
      }).onConflictDoNothing()
    }
    console.log('    œ… 2 posts seeded\n')

    console.log('ðŸŽ‰ Seed completed successfully!')
    console.log(' ”'.repeat(50))
    console.log('  Profile  : 1 row')
    console.log('  Skills   : 15 rows')
    console.log('  Experiences: 2 rows')
    console.log('  Projects : 3 rows')
    console.log('  Posts    : 2 rows')
    console.log(' ”'.repeat(50))

  } catch (error) {
    console.error(' Œ Seed failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

seed()
