const API_BASE = '/api';

const projects = [
  {
    id: 'meridian',
    title: 'Meridian',
    shortDesc: 'A real-time data pipeline visualisation tool for distributed systems observability.',
    longDesc: 'Meridian is an open-source observability dashboard built to give engineers a live view of their data pipelines. It connects to Kafka, RabbitMQ, and custom event streams, rendering flow diagrams that update in real time via WebSocket. The project was born from frustration with existing tools that required expensive SaaS subscriptions for features that belong in the developer toolchain.',
    stack: ['TypeScript', 'Node.js', 'WebSocket', 'D3.js', 'Kafka', 'Redis'],
    category: 'systems',
    github: 'https://github.com/james-ohare',
    demo: null,
    featured: true,
    year: 2024,
  },
  {
    id: 'cartographer',
    title: 'Cartographer',
    shortDesc: 'An open-source API schema explorer that generates interactive documentation from OpenAPI specs.',
    longDesc: 'Cartographer takes any OpenAPI 3.x specification and produces a navigable, filterable documentation interface with live request playgrounds. Unlike Swagger UI, it is designed to be embedded into existing developer portals, with full theming support and a minimal JavaScript footprint under 30kb gzipped.',
    stack: ['TypeScript', 'Preact', 'OpenAPI', 'Vite', 'CSS Modules'],
    category: 'tools',
    github: 'https://github.com/james-ohare',
    demo: 'https://cartographer.dev',
    featured: true,
    year: 2024,
  },
  {
    id: 'driftwood',
    title: 'Driftwood',
    shortDesc: 'A lightweight, git-backed CMS for Markdown content with a clean editorial interface.',
    longDesc: 'Driftwood is a headless CMS for teams who write in Markdown and deploy via CI/CD. Content lives in a Git repository alongside the codebase, with Driftwood providing a polished editorial UI over the top. It supports branching workflows, image optimisation, and webhook-based build triggers for any static site generator.',
    stack: ['Go', 'React', 'SQLite', 'GitHub API', 'Docker'],
    category: 'tools',
    github: 'https://github.com/james-ohare',
    demo: null,
    featured: true,
    year: 2023,
  },
  {
    id: 'signal',
    title: 'Signal',
    shortDesc: 'A self-hosted WebSocket notification service with topic-based subscriptions and delivery guarantees.',
    longDesc: 'Signal is a drop-in notification backend for web applications. It handles WebSocket connections at scale using a pub/sub model, with Redis as the message broker. It includes delivery confirmation, offline queuing, and a REST API for publishing events from any backend service.',
    stack: ['Go', 'Redis', 'WebSocket', 'PostgreSQL', 'Docker'],
    category: 'systems',
    github: 'https://github.com/james-ohare',
    demo: null,
    featured: false,
    year: 2023,
  },
  {
    id: 'atlas',
    title: 'Atlas',
    shortDesc: 'A distributed caching library for Node.js with automatic invalidation and cluster-aware routing.',
    longDesc: 'Atlas provides a unified caching interface over Redis Cluster with built-in support for cache stampede prevention, automatic TTL management, and a decorator pattern for easy integration with existing functions. Designed for high-throughput services where cache coherency across multiple Node.js instances is critical.',
    stack: ['TypeScript', 'Node.js', 'Redis Cluster', 'Jest'],
    category: 'libraries',
    github: 'https://github.com/james-ohare',
    demo: null,
    featured: false,
    year: 2023,
  },
  {
    id: 'prism',
    title: 'Prism',
    shortDesc: 'A colour scheme generator that extracts harmonious palettes from images using K-means clustering.',
    longDesc: 'Prism runs K-means clustering on the pixel data of any uploaded image to extract dominant colours and generate accessible colour schemes. It outputs CSS variables, Tailwind config, and Figma-compatible colour tokens. A WASM build runs the clustering entirely in-browser with no server round-trip.',
    stack: ['Rust', 'WebAssembly', 'TypeScript', 'Canvas API'],
    category: 'tools',
    github: 'https://github.com/james-ohare',
    demo: 'https://prism.tools',
    featured: false,
    year: 2022,
  },
];

const DataLayer = {
  async getAll() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('API unavailable');
      return await res.json();
    } catch {
      return projects;
    }
  },

  async getById(id) {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`);
      if (!res.ok) throw new Error('API unavailable');
      return await res.json();
    } catch {
      return projects.find(p => p.id === id) || null;
    }
  },

  getFeatured() {
    return projects.filter(p => p.featured);
  },
};

const Router = {
  getParam(key) {
    return new URLSearchParams(window.location.search).get(key);
  },
};

const UI = {
  renderProjectCard(project) {
    return `
      <article class="project-card fade-up" onclick="window.location.href='project.html?id=${project.id}'">
        <div class="project-year">${project.year}</div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-desc">${project.shortDesc}</p>
        <div class="project-tags">
          ${project.stack.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <span class="project-link">View project <span>&#8594;</span></span>
      </article>
    `;
  },

  renderProjectGrid(containerId, projectList) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = projectList.map(p => this.renderProjectCard(p)).join('');
    initScrollObserver();
  },

  renderProjectDetail(project) {
    const container = document.getElementById('project-detail');
    if (!container) return;

    document.title = `${project.title} — James O'Hare`;

    container.innerHTML = `
      <div class="project-detail-header fade-up">
        <div class="project-detail-label">${project.category}</div>
        <h1 class="project-detail-title">${project.title}</h1>
        <div class="project-detail-meta">
          <div class="project-detail-meta-item">
            <label>Year</label>
            <span>${project.year}</span>
          </div>
          <div class="project-detail-meta-item">
            <label>Category</label>
            <span>${project.category}</span>
          </div>
          <div class="project-detail-meta-item">
            <label>Stack</label>
            <span>${project.stack.slice(0, 3).join(', ')}</span>
          </div>
        </div>
      </div>

      <div class="project-detail-body fade-up stagger-1">
        ${project.longDesc.split('\n').map(p => `<p>${p}</p>`).join('')}
      </div>

      <div class="project-detail-section fade-up stagger-2">
        <div class="project-detail-section-title">Tech Stack</div>
        <div class="stack-list">
          ${project.stack.map(t => `<span class="stack-tag">${t}</span>`).join('')}
        </div>
      </div>

      <div class="project-detail-section fade-up stagger-3">
        <div class="project-detail-section-title">Links</div>
        <div class="project-links">
          ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="project-link-btn">GitHub Repo &#8599;</a>` : ''}
          ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener" class="project-link-btn">Live Demo &#8599;</a>` : ''}
        </div>
      </div>
    `;

    initScrollObserver();
  },

  renderNotFound() {
    const container = document.getElementById('project-detail');
    if (!container) return;
    container.innerHTML = `
      <div class="not-found">
        <div class="not-found-code">404</div>
        <div class="not-found-title">Project not found</div>
        <div class="not-found-desc">This project does not exist or may have been removed.</div>
        <br><br>
        <a href="projects.html" class="btn btn-outline">All Projects</a>
      </div>
    `;
  },
};

function initScrollObserver() {
  const els = document.querySelectorAll('.fade-up:not(.visible)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      mobile.classList.toggle('open');
    });
  }

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

async function initHomePage() {
  const featured = DataLayer.getFeatured();
  UI.renderProjectGrid('featured-grid', featured);
}

async function initProjectsPage() {
  const all = await DataLayer.getAll();
  UI.renderProjectGrid('all-projects-grid', all);

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      const filtered = cat === 'all' ? all : all.filter(p => p.category === cat);
      UI.renderProjectGrid('all-projects-grid', filtered);
    });
  });
}

async function initProjectDetailPage() {
  const id = Router.getParam('id');
  if (!id) {
    UI.renderNotFound();
    return;
  }
  const project = await DataLayer.getById(id);
  if (!project) {
    UI.renderNotFound();
    return;
  }
  UI.renderProjectDetail(project);
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollObserver();

  const page = window.location.pathname.split('/').pop();

  if (page === '' || page === 'index.html') {
    initHomePage();
  } else if (page === 'projects.html') {
    initProjectsPage();
  } else if (page === 'project.html') {
    initProjectDetailPage();
  }
});
