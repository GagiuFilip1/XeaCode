/* global React */
const { useState, useEffect, useRef } = React;

/* ---------- Inline icon set (phosphor-style, light 1.5 stroke) ---------- */
const I = {
  Arrow: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>),
  Sun: (p) => (<svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>),
  Moon: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Browser: (p) => (<svg viewBox="0 0 24 24" {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>),
  Phone: (p) => (<svg viewBox="0 0 24 24" {...p}><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>),
  Stack: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>),
  Spark: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/></svg>),
  Mail: (p) => (<svg viewBox="0 0 24 24" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>),
  Pin: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>),
  Clock: (p) => (<svg viewBox="0 0 24 24" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>),
  Github: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M9 19c-4 1.5-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>),
  Linkedin: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>),
  X: (p) => (<svg viewBox="0 0 24 24" {...p}><path d="M4 4l16 16M20 4 4 20"/></svg>),
};

/* ---------- Reveal helper ---------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('in'); io.unobserve(el); } });
    }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
function Reveal({ as: Tag = 'div', delay = 0, children, ...rest }) {
  const ref = useReveal();
  return <Tag ref={ref} className={`reveal ${rest.className||''}`} style={{ transitionDelay: `${delay}ms`, ...rest.style }}>{children}</Tag>;
}

/* ---------- Magnetic button ---------- */
function Btn({ variant = 'primary', icon, children, onClick, href }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*0.15}px, ${y*0.2}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  const cls = `btn btn-${variant}`;
  const inner = <>{children}{icon !== false && <I.Arrow style={{width:16, height:16, fill:'none', stroke:'currentColor', strokeWidth:1.5, strokeLinecap:'round', strokeLinejoin:'round'}}/>}</>;
  return href
    ? <a href={href} className={cls} ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}>{inner}</a>
    : <button type="button" className={cls} ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}>{inner}</button>;
}

/* ---------- Header ---------- */
function Header({ theme, onToggleTheme, active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
    ['#services','Services'],['#process','Process'],['#work','Work'],['#stack','Stack'],['#team','Team'],['#faq','FAQ'],['#contact','Contact'],
  ];
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container inner">
        <a href="#top" className="brand">XeaCode</a>
        <nav className="nav" aria-label="Primary">
          {links.map(([h,l]) => <a key={h} href={h} className={active===h.slice(1)?'is-active':''}>{l}</a>)}
        </nav>
        <div className="header-right">
          <button className="icon-btn" onClick={onToggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <I.Sun/> : <I.Moon/>}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section id="top" className="hero">
      <div className="hero-backdrop">
        <div className="blob b1"/>
        <div className="blob b2"/>
        <div className="blob b3"/>
        <div className="dot-grid"/>
      </div>
      <div className="hero-fade"/>
      <div className="container hero-inner">
        <div className="hero-grid">
          <div className="hero-col">
            <Reveal as="p" className="eyebrow">SENIOR INDEPENDENT STUDIO · EST. 2019</Reveal>
            <Reveal as="h1" delay={80}>
              Web, mobile and<br/>
              .NET API products.
            </Reveal>
          </div>
          <div className="hero-col">
            <Reveal as="p" className="lead" delay={160}>
              We design and ship production web, mobile, and .NET API products for teams that have outgrown templates and outsourced delivery. One studio, one standard, every line.
            </Reveal>
            <Reveal as="p" className="trust-strip" delay={220}>
              .NET 8 · NEXT.JS · SWIFT · KOTLIN · POSTGRES · AZURE · AWS
            </Reveal>
            <Reveal className="hero-ctas" delay={280}>
              <Btn variant="primary" href="#contact">Start a project</Btn>
              <Btn variant="secondary" href="#work">See selected work</Btn>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services ---------- */
const SERVICES = [
  { icon: 'Browser', title: 'Web product engineering', desc: 'Production Next.js apps with type-safe data layers and the details that matter — auth, billing, observability, accessibility. No prototypes left in production.', engagement: '6–14 WEEK ENGAGEMENTS' },
  { icon: 'Phone',   title: 'Mobile apps, native or cross-platform', desc: 'Swift, Kotlin, or React Native — whichever matches the team that has to maintain it. Shipped to App Store and Play Store, not handed off as a zip file.', engagement: '8–16 WEEK ENGAGEMENTS' },
  { icon: 'Stack',   title: '.NET API platforms', desc: 'C# 12 / .NET 8 services with CQRS, idempotent jobs, and migrations you can read on a Friday. Built for teams who have to live with the code for five years.', engagement: 'RETAINER OR PROJECT' },
  { icon: 'Spark',   title: 'Audits & rescues', desc: 'A senior pair of eyes on an inherited codebase. Two-week structured review, written report, optional remediation. Often the cheapest engagement we run.', engagement: '2 WEEKS, FIXED FEE' },
];
function ServiceCard({ icon, title, desc, engagement, delay = 0 }) {
  const Icon = I[icon];
  return (
    <Reveal className="card service-card" delay={delay}>
      <span className="icon-badge"><Icon/></span>
      <h3>{title}</h3>
      <p className="p desc">{desc}</p>
      <p className="engagement">{engagement}</p>
    </Reveal>
  );
}
function Services() {
  return (
    <section id="services" className="section">
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">01 — WHAT WE DO</Reveal>
          <Reveal as="h2" delay={80}>Four ways we work with you.</Reveal>
          <Reveal as="p" className="p" delay={140}>We keep the studio focused. Every engagement is led by a principal who writes code; no account managers, no junior bench, no resourcing surprises.</Reveal>
        </header>
        <div className="services-grid">
          {SERVICES.map((s, i) => <ServiceCard key={s.title} {...s} delay={i*80}/>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Process ---------- */
const STEPS = [
  { deliverable: 'KICK-OFF DOC · STAKEHOLDER MAP', title: 'Discover.', body: 'Two weeks of structured conversations and prior-art review. We leave with a written problem statement and a list of the things you do not have to build.' },
  { deliverable: 'CLICKABLE PROTOTYPE · ADRs', title: 'Shape.', body: 'A working prototype of the riskiest screens, architecture decisions documented as ADRs, and a delivery plan with named owners.' },
  { deliverable: 'WEEKLY MERGED PRs · CHANGELOG', title: 'Build.', body: 'Weekly visible progress in your repo. Production deploys from week three. Every Friday a written changelog with screenshots, decisions, and trade-offs.' },
  { deliverable: 'RUNBOOK · KNOWLEDGE TRANSFER', title: 'Hand off.', body: 'The codebase your team inherits is the one they would have written if they had the time. Two weeks of paired work after launch, runbook included.' },
];
function ProcessStep({ idx, total, deliverable, title, body, delay }) {
  return (
    <Reveal className="process-step" delay={delay}>
      <div className="num">
        <span className="cur">0{idx+1}</span><span className="tot">/ 0{total}</span>
      </div>
      <p className="deliverable">{deliverable}</p>
      <h3>{title}</h3>
      <p className="p">{body}</p>
    </Reveal>
  );
}
function Process() {
  return (
    <section id="process" className="section" style={{background:'var(--bg-elevated)'}}>
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">02 — HOW WE WORK</Reveal>
          <Reveal as="h2" delay={80}>Four phases. No black boxes.</Reveal>
        </header>
        <div className="process-grid">
          <aside className="process-progress" aria-hidden="true">
            <div className="progress-track"><div className="progress-fill"/></div>
          </aside>
          <div>
            {STEPS.map((s, i) => <ProcessStep key={s.title} {...s} idx={i} total={STEPS.length} delay={i*60}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Work ---------- */
const WORK = [
  { title: 'A subscription billing platform for a European insurance broker.', body: '.NET 8 services replacing a 12-year-old VB.NET monolith. Migrated 180k policies with zero customer-facing downtime.', stack: ['.NET 8','POSTGRES','AZURE','REACT'], meta: '14 WEEKS · DELIVERED Q1 2025', outcome: 'Underwriting cycle time fell from nine days to under two. Two engineers run the entire platform.' },
  { title: 'A field-service mobile app for a national HVAC operator.', body: 'Offline-first Kotlin app for 600 technicians. Syncs jobs, parts, and photos over patchy LTE; built around the workflow, not the data model.', stack: ['KOTLIN','KTOR','POSTGRES','S3'], meta: '11 WEEKS · DELIVERED Q3 2024', outcome: 'Paperwork time per job halved. Parts-misorder rate down from 8% to under 1%.' },
  { title: 'A real-time analytics dashboard for a logistics startup.', body: 'Server-rendered Next.js with a streaming GraphQL layer; loads under 400ms on 4G. Replaced a Tableau workbook the ops team had outgrown.', stack: ['NEXT.JS','GRAPHQL','POSTGRES','REDIS'], meta: '7 WEEKS · DELIVERED Q4 2024', outcome: 'Dispatchers moved from end-of-shift reports to live decisions. Three roles consolidated.' },
];
function WorkRow({ title, body, stack, meta, outcome, delay }) {
  return (
    <Reveal className="work-row" delay={delay}>
      <h3>{title}</h3>
      <p className="p body">{body}</p>
      <div className="stack">{stack.map((t, i) => <span key={t}>{t}{i<stack.length-1 && <span className="dot"> · </span>}</span>)}</div>
      <p className="meta">{meta}</p>
      <p className="outcome">{outcome}</p>
    </Reveal>
  );
}
function Work() {
  return (
    <section id="work" className="section">
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">03 — SELECTED WORK</Reveal>
          <Reveal as="h2" delay={80}>Three engagements,<br/>described plainly.</Reveal>
          <Reveal as="p" className="p" delay={140}>Every active client is under NDA. The three below are the most recent we can describe in this much detail — full case studies on request.</Reveal>
        </header>
        <div className="work-list">
          {WORK.map((w, i) => <WorkRow key={w.title} {...w} delay={i*80}/>)}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stack marquee ---------- */
const STACK_TILES = ['.NET 8','C# 12','TYPESCRIPT','NEXT.JS','REACT','SWIFT','KOTLIN','POSTGRES','REDIS','AZURE','AWS','TERRAFORM','GRAFANA','PLAYWRIGHT'];
function Marquee() {
  const half = STACK_TILES.concat(STACK_TILES);
  return (
    <section id="stack" className="section">
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">04 — TOOLS WE REACH FOR</Reveal>
          <Reveal as="h2" delay={80}>A focused toolbox.</Reveal>
          <Reveal as="p" className="p" delay={140}>We pick tools that will still be sensible in five years. The list below is intentionally short — we use it deeply, not broadly.</Reveal>
          <Reveal as="p" className="cat-breadcrumb" delay={180}>
            <span>BACKEND</span><span className="dot">·</span><span>FRONTEND</span><span className="dot">·</span><span>MOBILE</span><span className="dot">·</span><span>INFRA</span><span className="dot">·</span><span>OBSERVABILITY</span>
          </Reveal>
        </header>
        <div className="marquee-wrap">
          <div className="marquee-track marquee-left">{half.map((t,i) => <div className="tile" key={'a'+i}>{t}</div>)}</div>
          <div className="marquee-track marquee-right">{half.slice().reverse().map((t,i) => <div className="tile" key={'b'+i}>{t}</div>)}</div>
        </div>
        <Reveal as="p" className="scope-note p">We have opinions about microservices (mostly: don&apos;t, yet), about ORMs (yes, with care), and about feature flags (always). Ask us, on a call.</Reveal>
      </div>
    </section>
  );
}

/* ---------- Team ---------- */
const PRINCIPLES = [
  { label: 'SENIORS ONLY', body: 'No bench, no juniors learning on your time. The person who shapes the engagement writes the code.' },
  { label: 'DOCUMENTED DECISIONS', body: 'Decisions live in ADRs and weekly changelogs, not Slack. Your team can read why we chose what we chose, two years from now.' },
  { label: 'ONE PROJECT AT A TIME', body: 'One project at a time, two at most. If we cannot give you a principal half the week, we say no.' },
  { label: 'EXIT AT WEEK TWO', body: 'Every engagement has a no-fee exit clause through week two. If the fit is wrong, both sides walk.' },
];
function Team() {
  return (
    <section id="team" className="section" style={{background:'var(--bg-elevated)'}}>
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">05 — WHO WE ARE</Reveal>
          <Reveal as="h2" delay={80}>A studio of two,<br/>plus a long bench of friends.</Reveal>
        </header>
        <div className="team-col">
          <Reveal as="p" className="stats">FOUNDED 2019 · BASED IN BUCHAREST, ROMANIA · SHIPPED 31 PRODUCTS · ONE OFFICE CAT</Reveal>
          <Reveal className="paras">
            <p className="p">XeaCode is Filip Gagiu and one rotating principal, matched to the scope of the work. We have been writing software professionally since 2011 and running this studio since 2019.</p>
            <p className="p">Most of our work arrives by referral from teams we have shipped for. We keep the studio small intentionally — we would rather say no twice a quarter than reduce the level of attention we can give each project.</p>
            <p className="p">When the scope needs more capacity, we bring in a short list of people we have worked alongside for years. They sign the same contracts, write the same changelogs, and leave at the end of the engagement.</p>
          </Reveal>
          <Reveal as="ul" className="principles" delay={120}>
            {PRINCIPLES.map(p => (
              <li className="principle" key={p.label}>
                <div className="label">{p.label}</div>
                <div className="body">{p.body}</div>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQS = [
  ['What does an engagement cost?', 'Most projects land between €60k and €240k, billed in fortnightly blocks. Audits are a fixed €18k. We send a written estimate before any contract; if the number changes during the project, we tell you in writing the same week.'],
  ['How fast can you start?', 'Usually three to six weeks. We work one project at a time and never overbook. If the timing is wrong, we will say so on the first call and recommend someone else.'],
  ['Will we own the code?', 'Yes, fully. The repo is in your GitHub org from day one. We commit under your CI, your branch protection, your review rules.'],
  ['Do you sign NDAs?', 'Yes, before the first technical conversation. We will also sign your MSA, your DPA, your SOC2-flavoured vendor questionnaire. We have lived through them all.'],
  ['What if it is not working out?', 'Every engagement has a no-fee exit through week two and a 30-day termination clause after that. We would rather you leave cleanly than stay unhappy.'],
];
function Faq() {
  return (
    <section id="faq" className="section">
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">06 — COMMON QUESTIONS</Reveal>
          <Reveal as="h2" delay={80}>The five we get asked most.</Reveal>
        </header>
        <Reveal as="dl" className="faq-list">
          {FAQS.map(([q,a]) => (
            <div className="faq-row" key={q}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Field({ label, name, type='text', textarea, value, onChange, error, required }) {
  return (
    <div className="field">
      <label htmlFor={name} className="label">{label}{required && ' *'}</label>
      {textarea
        ? <textarea id={name} name={name} rows="6" value={value} onChange={onChange} aria-invalid={!!error}/>
        : <input id={name} name={name} type={type} value={value} onChange={onChange} aria-invalid={!!error}/>}
    </div>
  );
}
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [err, setErr] = useState(null);
  const [sent, setSent] = useState(false);
  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErr({ t: 'Three fields are missing.', b: 'Name, email and a description of the project are all required.' });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErr({ t: 'That email looks off.', b: 'Double-check the address and try again.' });
      return;
    }
    setErr(null); setSent(true);
  };
  return (
    <section id="contact" className="section" style={{background:'var(--bg-elevated)'}}>
      <div className="container">
        <header className="section-head">
          <Reveal as="p" className="eyebrow">07 — START A PROJECT</Reveal>
          <Reveal as="h2" delay={80}>Tell us about the work.</Reveal>
          <Reveal as="p" className="p" delay={140}>Two paragraphs is plenty for a first reply. We answer every message ourselves, usually inside one business day.</Reveal>
        </header>
        <div className="contact-grid">
          {sent
            ? <div className="success-card"><h3>Thanks — message received.</h3><p className="p">You will hear from Filip within one business day. Real address, real signature.</p></div>
            : (
              <form className="contact-form" onSubmit={submit} noValidate>
                <p className="preform-note">No automated replies. Filip reads every message.</p>
                <Field label="YOUR NAME" name="name" value={form.name} onChange={onChange} required/>
                <Field label="EMAIL" name="email" type="email" value={form.email} onChange={onChange} required/>
                <Field label="COMPANY (OPTIONAL)" name="company" value={form.company} onChange={onChange}/>
                <Field label="WHAT ARE YOU BUILDING?" name="message" textarea value={form.message} onChange={onChange} required/>
                {err && <div className="form-error"><p className="t">{err.t}</p><p className="b">{err.b}</p></div>}
                <div><Btn variant="primary">Send the brief</Btn></div>
              </form>
            )}
          <aside>
            <dl className="contact-details">
              <div className="contact-detail">
                <span className="label">EMAIL</span>
                <a href="mailto:hello@xeacode.com"><I.Mail/> hello@xeacode.com</a>
              </div>
              <div className="contact-detail">
                <span className="label">BASED IN</span>
                <a><I.Pin/> Bucharest, Romania (CET / CEST)</a>
              </div>
              <div className="contact-detail">
                <span className="label">TYPICAL REPLY</span>
                <a><I.Clock/> One business day, written personally</a>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-cols">
          <div className="footer-col">
            <span className="brand">XeaCode</span>
            <p className="p" style={{fontSize:14, maxWidth:'32ch'}}>A senior independent software studio. Web, mobile, and .NET API products, shipped end-to-end.</p>
          </div>
          <div className="footer-col">
            <span className="col-label">STUDIO</span>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#work">Work</a></li>
              <li><a href="#team">Team</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <span className="col-label">ELSEWHERE</span>
            <div className="socials">
              <a className="social-pill" aria-label="GitHub" href="#"><I.Github/></a>
              <a className="social-pill" aria-label="LinkedIn" href="#"><I.Linkedin/></a>
              <a className="social-pill" aria-label="X" href="#"><I.X/></a>
            </div>
            <a href="mailto:hello@xeacode.com" style={{color:'var(--fg)', textDecoration:'none', fontSize:14, marginTop:8}}>hello@xeacode.com</a>
          </div>
        </div>
        <div className="footer-bot">
          <p className="copy">© 2019–2026 XEACODE SRL<span className="sep">/</span>BUCHAREST, ROMANIA</p>
          <p className="ti">INDEPENDENT SINCE 2019</p>
        </div>

      </div>
    </footer>
  );
}

/* ---------- App ---------- */
function App() {
  const [theme, setTheme] = useState('dark');
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);
  return (
    <>
      <Header theme={theme} onToggleTheme={() => setTheme(t => t==='dark'?'light':'dark')}/>
      <main>
        <Hero/>
        <Services/>
        <Process/>
        <Work/>
        <Marquee/>
        <Team/>
        <Faq/>
        <Contact/>
      </main>
      <Footer/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
