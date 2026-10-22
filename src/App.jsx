import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { motion as Motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Download, Languages, Mail, MapPin, Menu, Microscope, MoveRight, Ruler, Sparkles, X } from 'lucide-react'
import { copy, EMAIL } from './copy'
import { cases } from './cases'
import { academic } from './academic'

const ids = ['about','projects','experience','skills','contact']
const card = 'border border-cyan-100/10 bg-white/[.025] rounded-2xl'
const shell = 'mx-auto w-[min(1160px,calc(100%-2rem))] md:w-[min(1160px,calc(100%-4rem))]'

function Header({ lang, setLang, t }) {
  const [open,setOpen] = useState(false)
  const location = useLocation()
  const home = location.pathname === '/'
  return <header aria-label="Primary navigation" className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#061018]/80 backdrop-blur-xl">
    <div className={`${shell} flex h-[70px] items-center justify-between gap-4`}>
      <Link to="/" className="flex items-center gap-2 font-semibold"><i className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_#54d6ff]"/>Erwhan Le Coueffec</Link>
      <nav className="hidden gap-6 text-sm text-slate-400 lg:flex">{ids.map((id,i)=><a key={id} href={`${home?'':'/'}#${id}`} className="hover:text-white">{t.nav[i]}</a>)}</nav>
      <div className="flex items-center gap-2">
        <label className="flex h-9 items-center gap-2 rounded-full border border-cyan-100/10 px-3 text-xs text-slate-300"><Languages size={15}/><select aria-label="Language" className="bg-transparent outline-none" value={lang} onChange={e=>setLang(e.target.value)}><option className="bg-[#061018]" value="en">EN</option><option className="bg-[#061018]" value="fr">FR</option><option className="bg-[#061018]" value="de">DE</option></select></label>
        <button aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="grid h-9 w-9 place-items-center rounded-full border border-cyan-100/10 lg:hidden" onClick={()=>setOpen(!open)}>{open?<X size={19}/>:<Menu size={19}/>}</button>
      </div>
    </div>
    {open&&<div className={`${shell} grid pb-4 lg:hidden`}>{ids.map((id,i)=><a key={id} href={`${home?'':'/'}#${id}`} className="border-b border-white/5 py-3 text-sm text-slate-300" onClick={()=>setOpen(false)}>{t.nav[i]}</a>)}</div>}
  </header>
}

function Heading({data}) { return <div className="mb-9 max-w-4xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{data[0]}</p><h2 className="text-3xl font-semibold tracking-[-.04em] md:text-5xl">{data[1]}</h2>{data[2]&&<p className="mt-4 max-w-2xl leading-7 text-slate-400">{data[2]}</p>}</div> }
function Button({href,children,primary=true}) { return <a href={href} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition hover:-translate-y-0.5 ${primary?'primary-cta':'border border-cyan-100/10 bg-white/[.02] text-slate-200'}`}>{children}</a> }

function Visual() { const reduced=useReducedMotion(); return <div className="pointer-events-none absolute -right-56 top-24 h-[38rem] w-[38rem] opacity-70 md:-right-24"><div className="absolute inset-0 rounded-full border border-cyan-300/10"/><div className="absolute inset-16 rounded-full border border-cyan-300/10"/><Motion.i animate={reduced?{}:{x:[-20,20,-20],opacity:[.25,.8,.25]}} transition={{duration:8,repeat:Infinity}} className="absolute left-0 top-1/2 h-px w-full -rotate-12 bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_14px_#54d6ff]"/><div className="absolute inset-28 rounded-full bg-[repeating-linear-gradient(90deg,transparent_0_8px,rgba(84,214,255,.1)_8px_9px)]"/></div> }

function ProjectCard({p,to,icon}) { return <Link to={to} className={`${card} overflow-hidden transition hover:-translate-y-1 hover:border-cyan-300/25`}><div className="relative h-52 overflow-hidden border-b border-cyan-100/10 bg-[radial-gradient(circle_at_70%_35%,rgba(72,201,245,.18),transparent_35%),#08141c]"><div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-cyan-300/20 text-cyan-300">{icon}</div><div className="absolute inset-0 skew-x-[-16deg] bg-[repeating-linear-gradient(90deg,transparent_0_23px,rgba(84,214,255,.08)_23px_24px,transparent_24px_42px)]"/></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-cyan-300">{p[0]}</p><h3 className="mt-2 text-xl font-semibold">{p[1]}</h3><p className="mt-3 leading-7 text-slate-400">{p[2]}</p><div className="mt-5 flex items-baseline gap-3 border-t border-white/5 pt-4"><strong className="text-2xl text-cyan-100">{p[3]}</strong><span className="text-xs text-slate-500">{p[4]}</span></div><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">{p[5]}<MoveRight size={16}/></span></div></Link> }

function Home({t}) {
  const reduced=useReducedMotion(); const reveal=reduced?{}:{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.15},transition:{duration:.5}}
  return <main>
    <section className={`${shell} relative flex min-h-svh items-center pt-28`}><Visual/><Motion.div className="relative z-10 max-w-4xl" initial={reduced?false:{opacity:0,y:18}} animate={{opacity:1,y:0}}><div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-2 text-xs font-semibold text-cyan-100"><Sparkles size={14}/>{t.hero[0]}</div><h1 className="mt-6 text-[clamp(3rem,10vw,6.4rem)] font-semibold leading-[.93] tracking-[-.06em]">{t.hero[1]}<span className="mt-2 block text-[.48em] font-normal leading-tight text-cyan-100">{t.hero[2]}</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">{t.hero[3]}</p><div className="mt-7 flex flex-wrap gap-3"><Button href="#projects">{t.hero[4]}<ArrowRight size={17}/></Button><Button href={`mailto:${EMAIL}`} primary={false}>{t.hero[5]}<Mail size={16}/></Button></div><p className="mt-5 flex items-center gap-2 text-sm text-slate-500"><MapPin size={15}/>{t.hero[6]}</p></Motion.div></section>

    <section id="about" className={`${shell} scroll-mt-24 py-24`}><Motion.div {...reveal}><Heading data={t.about}/><div className="grid gap-5 md:grid-cols-[1.2fr_.8fr]"><div className="space-y-4 leading-8 text-slate-400"><p>{t.about[2]}</p><p>{t.about[3]}</p></div><div className={`${card} p-5`}><Microscope className="text-cyan-300"/><h3 className="mt-4 font-semibold">{t.about[4]}</h3><p className="mt-2 leading-7 text-slate-400">{t.about[5]}</p></div></div><div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{t.looking[0]}</span>{t.looking.slice(1).map(x=><span className="rounded-full border border-cyan-100/10 px-3 py-2 text-slate-300" key={x}>{x}</span>)}</div></Motion.div></section>

    <section id="projects" className={`${shell} scroll-mt-24 py-24`}><Motion.div {...reveal}><Heading data={t.projects}/><div className="grid gap-5 md:grid-cols-2"><ProjectCard p={t.holo} to="/projects/holoscan" icon={<Ruler/>}/><ProjectCard p={t.doe} to="/projects/camera-doe" icon={<Microscope/>}/></div><div className="mt-12 flex flex-wrap items-baseline justify-between gap-3"><h3 className="font-semibold text-slate-300">{t.academic[0]}</h3><Link to="/academic" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">{t.academicLink}<MoveRight size={16}/></Link></div><div className="mt-4 grid gap-4 md:grid-cols-3">{t.academic.slice(1).map((x,i)=><article className="border-t border-cyan-100/10 pt-4" key={x[0]}><span className="text-xs text-slate-600">0{i+1}</span><h4 className="mt-2 font-semibold">{x[0]}</h4><p className="mt-2 text-sm leading-6 text-slate-500">{x[1]}</p></article>)}</div></Motion.div></section>

    <section id="experience" className={`${shell} scroll-mt-24 py-24`}><Motion.div {...reveal}><Heading data={t.expTitle}/><div className="border-t border-cyan-100/10">{t.exp.map(x=><article className="grid gap-3 border-b border-cyan-100/10 py-6 md:grid-cols-[10rem_1fr]" key={x[0]}><div className="text-xs text-slate-500">{x[2]}</div><div><h3 className="font-semibold">{x[1]}</h3><p className="mt-1 text-sm text-cyan-200">{x[0]}</p><ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-400">{x[3].map(y=><li key={y}>{y}</li>)}</ul></div></article>)}</div></Motion.div></section>

    <section className={`${shell} py-24`}><Motion.div {...reveal}><Heading data={t.eduTitle}/><div className="grid gap-4 md:grid-cols-3">{t.edu.map(x=><article className={`${card} p-5`} key={x[0]}><span className="text-xs text-slate-500">{x[1]}</span><h3 className="mt-4 font-semibold">{x[0]}</h3><h4 className="mt-2 text-sm text-slate-300">{x[2]}</h4><p className="mt-3 text-sm leading-6 text-slate-500">{x[3]}</p>{x[4]&&<p className="mt-3 text-xs leading-5 text-cyan-200">{x[4]}</p>}</article>)}</div></Motion.div></section>

    <section id="skills" className={`${shell} scroll-mt-24 py-24`}><Motion.div {...reveal}><Heading data={t.skillsTitle}/><div className="grid gap-4 md:grid-cols-3">{t.skills.map(x=><article className={`${card} p-5`} key={x[0]}><h3 className="font-semibold">{x[0]}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{x[1]}</p></article>)}</div><div className="mt-4 grid gap-4 md:grid-cols-2"><article className={`${card} p-5`}><h3 className="font-semibold">{t.language[0]}</h3>{t.language.slice(1).map(x=><p className="mt-2 text-sm text-slate-400" key={x}>{x}</p>)}</article><article className={`${card} p-5`}><h3 className="font-semibold">{t.interests[0]}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{t.interests[1]}</p></article></div></Motion.div></section>

    <section id="contact" className={`${shell} scroll-mt-24 py-24`}><Motion.div {...reveal} className={`${card} p-6 md:p-10`}><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{t.contact[0]}</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-.04em] md:text-5xl">{t.contact[1]}</h2><p className="mt-5 max-w-2xl leading-7 text-slate-400">{t.contact[2]}</p><div className="mt-7 flex flex-wrap gap-3"><Button href={`mailto:${EMAIL}`}><Mail size={16}/>{t.contact[3]}</Button><button disabled title="LinkedIn link coming next" className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-cyan-100/10 px-4 text-sm font-bold text-slate-500">{t.contact[4]}</button><a href="/cv/Erwhan_Le_Coueffec_CV_FR.pdf" download="Erwhan_Le_Coueffec_CV_FR.pdf" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-100/10 px-4 text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/30"><Download size={16}/>{t.contact[5]}</a><a href="/cv/Erwhan_Le_Coueffec_CV_EN.pdf" download="Erwhan_Le_Coueffec_CV_EN.pdf" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-cyan-100/10 px-4 text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/30"><Download size={16}/>{t.contact[6]}</a></div><p className="mt-4 text-xs text-slate-600">{EMAIL}</p></Motion.div></section>
  </main>
}

const locales = { fr: 'fr-FR', en: 'en-US', de: 'de-DE' }
function fmt(v, lang, minFrac = 0) {
  if (typeof v === 'number') return v.toLocaleString(locales[lang] || 'en-US', { minimumFractionDigits: Number.isInteger(v) && !minFrac ? 0 : minFrac, maximumFractionDigits: 5, useGrouping: false }).replace('-', '−')
  if (typeof v === 'string' && lang !== 'en' && /^-?\d+\.\d+(e-?\d+)?$/.test(v)) return v.replace('.', ',').replace('-', '−')
  return v
}

const seriesColors = ['#54d6ff', '#a5f3fc', '#fbbf24', '#fb7185']
function DeviationChart({ chart, ui, lang }) {
  const W = 640, H = 300, L = 52, R = 12, T = 14, B = 34, max = 140
  const y = v => T + (max - Math.max(-max, Math.min(max, v))) / (2 * max) * (H - T - B)
  const group = (W - L - R) / 5
  const n = chart.series.length
  return <figure className={`${card} my-6 p-4`}>
    <figcaption className="mb-3 text-sm font-semibold text-slate-200">{chart.c}</figcaption>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={chart.c} className="h-auto w-full">
      <rect x={L} y={y(60)} width={W - L - R} height={y(-60) - y(60)} fill="rgba(84,214,255,.08)" />
      {[120, -120].map(v => <line key={v} x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke="#f87171" strokeDasharray="5 5" strokeOpacity=".7" />)}
      {[-120, -60, 0, 60, 120].map(v => <g key={v}><line x1={L - 4} x2={W - R} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,.08)" /><text x={L - 8} y={y(v) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">{fmt(v, lang)}</text></g>)}
      {[0, 1, 2, 3, 4].map(i => <text key={i} x={L + group * (i + .5)} y={H - 10} textAnchor="middle" fontSize="11" fill="#94a3b8">P{i + 1}</text>)}
      {chart.series.map(([name, vals], s) => vals.map((v, i) => { const cx = L + group * i + group * (s + 1) / (n + 1); return <g key={name + i}><line x1={cx} x2={cx} y1={y(0)} y2={y(v)} stroke={seriesColors[s]} strokeOpacity=".35" strokeWidth="2" /><circle cx={cx} cy={y(v)} r="5" fill={seriesColors[s]}><title>{`${name} · P${i + 1} : ${fmt(v, lang)} µm`}</title></circle></g> }))}
      <text x="14" y={H / 2} transform={`rotate(-90 14 ${H / 2})`} textAnchor="middle" fontSize="11" fill="#94a3b8">µm</text>
    </svg>
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
      {chart.series.map(([name], s) => <span key={name} className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: seriesColors[s] }} />{name}</span>)}
      <span className="inline-flex items-center gap-2"><i className="h-2.5 w-4 rounded-sm bg-cyan-300/20" />{ui.limit60}</span>
      <span className="inline-flex items-center gap-2"><i className="w-4 border-t border-dashed border-red-400" />{ui.limit120}</span>
    </div>
  </figure>
}

function Block({ b, ui, lang }) {
  if (typeof b === 'string') return <p className="mt-4 leading-8 text-slate-400">{b}</p>
  if (b.ul) return <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-400 marker:text-cyan-300">{b.ul.map(x => <li key={x}>{x}</li>)}</ul>
  if (b.eq) return <div className="mt-4 overflow-x-auto rounded-xl border border-cyan-100/10 bg-[#08141c] px-4 py-3 font-mono text-sm leading-7 whitespace-pre text-cyan-100">{b.eq}</div>
  if (b.note) return <p className="mt-5 rounded-xl border-l-2 border-cyan-300 bg-cyan-300/5 px-4 py-3 leading-7 text-cyan-50">{b.note}</p>
  if (b.chart) return <DeviationChart chart={b.chart} ui={ui} lang={lang} />
  if (b.table) return <figure className="mt-5">
    <figcaption className="mb-2 text-xs font-semibold tracking-[.04em] text-slate-500">{b.table.c}</figcaption>
    <div className="overflow-x-auto rounded-xl border border-cyan-100/10">
      <table className="w-full min-w-max border-collapse text-left text-sm">
        <thead className="bg-white/[.03] text-xs text-slate-300"><tr>{b.table.h.map((h, i) => <th key={i} scope="col" className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{b.table.r.map((row, i) => <tr key={i} className="border-t border-cyan-100/5">{row.map((cell, j) => j === 0 ? <th key={j} scope="row" className="px-3 py-2 font-medium text-slate-300">{cell}</th> : <td key={j} className={`px-3 py-2 tabular-nums ${typeof cell === 'number' && Math.abs(cell) > 60 && b.table.c.includes('µm') && !String(row[0]).startsWith('σ') ? 'text-amber-300' : 'text-slate-400'}`}>{fmt(cell, lang, /^(Position|σ|u\()/.test(String(row[0])) ? 1 : 0)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  </figure>
  return null
}

function CasePage({t,lang,type}) {
  const c = cases[lang] || cases.en; const data = c[type]; const ui = c.ui
  useEffect(()=>window.scrollTo(0,0),[type])
  return <main className={`${shell} min-h-screen pb-24 pt-28`}>
    <Link className="inline-flex items-center gap-2 text-sm text-slate-400" to="/"><ArrowLeft size={16}/>{t.back}</Link>
    <div className="max-w-4xl py-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{data.kicker}</p><h1 className="mt-3 text-[clamp(2.3rem,7vw,4.6rem)] font-semibold leading-none tracking-[-.055em]">{data.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{data.lead}</p>
      <dl className="mt-8 grid gap-4 md:grid-cols-3">{data.meta.map(([k,v])=><div key={k} className="border-t border-cyan-100/10 pt-3"><dt className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">{k}</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{v}</dd></div>)}</dl>
    </div>
    <section aria-label={ui.facts} className="grid grid-cols-2 gap-3 md:grid-cols-5">{data.facts.map(([v,l])=><div key={l} className={`${card} p-4`}><strong className="block text-2xl tracking-[-.03em] text-cyan-100">{v}</strong><span className="mt-2 block text-xs leading-5 text-slate-400">{l}</span></div>)}</section>
    <div className="mt-12 grid gap-10 lg:grid-cols-[15rem_1fr]">
      <nav aria-label={ui.toc} className="lg:sticky lg:top-24 lg:self-start"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{ui.toc}</p><ol className="mt-3 flex flex-wrap gap-2 lg:block lg:space-y-1">{data.sections.map((s,i)=><li key={s.title}><a href={`#s-${i}`} className="block rounded-lg border border-cyan-100/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white lg:border-0 lg:px-0 lg:py-1 lg:text-sm">{s.title}</a></li>)}</ol></nav>
      <div className="min-w-0 border-t border-cyan-100/10">
        {data.sections.map((s,i)=><article id={`s-${i}`} key={s.title} className="scroll-mt-24 border-b border-cyan-100/10 py-8"><span className="text-xs text-slate-600">{String(i+1).padStart(2,'0')}</span><h2 className="mt-1 text-xl font-semibold md:text-2xl">{s.title}</h2><div className="max-w-4xl">{s.body.map((b,j)=><Block key={j} b={b} ui={ui} lang={lang}/>)}</div></article>)}
        <p className="mt-6 text-xs leading-5 text-slate-600">{ui.source}</p>
      </div>
    </div>
  </main>
}

function AcademicPage({t,lang}) {
  const a = academic[lang] || academic.en; const ui = (cases[lang] || cases.en).ui
  useEffect(()=>window.scrollTo(0,0),[])
  const teamLabel = k => k === 'solo' ? a.solo : k === 'group' ? a.group : a.groupN
  return <main className={`${shell} min-h-screen pb-24 pt-28`}>
    <Link className="inline-flex items-center gap-2 text-sm text-slate-400" to="/"><ArrowLeft size={16}/>{t.back}</Link>
    <div className="max-w-4xl py-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{a.kicker}</p><h1 className="mt-3 text-[clamp(2.3rem,7vw,4.6rem)] font-semibold leading-none tracking-[-.055em]">{a.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{a.lead}</p></div>
    {['lab','sim'].map(kind => <section key={kind} className="mt-6">
      <h2 className="border-b border-cyan-100/10 pb-3 text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{a.groups[kind]}</h2>
      <nav className="mt-4 flex flex-wrap gap-2">{a.items.filter(i=>i.kind===kind).map(i=><a key={i.id} href={`#${i.id}`} className="rounded-lg border border-cyan-100/10 px-3 py-1.5 text-xs text-slate-400 hover:text-white">{i.title}</a>)}</nav>
      {a.items.filter(i=>i.kind===kind).map(i=><article id={i.id} key={i.id} className={`${card} mt-6 scroll-mt-24 overflow-hidden`}>
        {i.figures && i.figures.length===1 && <figure><img src={i.figures[0].src} alt={i.figures[0].alt} loading="lazy" className="max-h-[26rem] w-full object-cover"/><figcaption className="border-b border-cyan-100/10 bg-[#08141c] px-5 py-2 text-xs leading-5 text-slate-400 md:px-8">{i.figures[0].cap}</figcaption></figure>}
        <div className="p-5 md:p-8">
          <h3 className="text-xl font-semibold md:text-2xl">{i.title}</h3>
          <p className="mt-3 max-w-3xl leading-7 text-slate-300">{i.summary}</p>
          <dl className="mt-5 grid gap-3 text-sm md:grid-cols-[10rem_1fr]">
            <dt className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">{a.labels.date}</dt><dd className="text-slate-300">{i.date}</dd>
            <dt className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">{a.labels.team}</dt><dd className="text-slate-300">{teamLabel(i.team)}</dd>
            <dt className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">{a.labels.tools}</dt><dd className="text-slate-400">{i.tools}</dd>
          </dl>
          <div className="max-w-4xl">{i.body.map((b,j)=><Block key={j} b={b} ui={ui} lang={lang}/>)}</div>
          {i.figures && i.figures.length>1 && <div className="mt-6 grid gap-4 md:grid-cols-2">{i.figures.map(f=><figure key={f.alt} className="overflow-hidden rounded-xl border border-cyan-100/10 bg-white"><img src={f.src} alt={f.alt} loading="lazy" className="h-56 w-full object-contain"/><figcaption className="bg-[#08141c] px-3 py-2 text-xs leading-5 text-slate-400">{f.cap}</figcaption></figure>)}</div>}
          
        </div>
      </article>)}
    </section>)}
  </main>
}

export default function App(){
  const [lang,setLang]=useState(()=>localStorage.getItem('portfolio-language')||'en'); const t=copy[lang]||copy.en
  useEffect(()=>{localStorage.setItem('portfolio-language',lang);document.documentElement.lang=lang},[lang])
  return <div className="min-h-screen overflow-x-clip bg-[#061018] text-slate-50"><a href="#main-content" className="fixed left-3 top-3 z-[60] -translate-y-20 rounded-lg bg-cyan-100 px-3 py-2 text-sm font-bold text-[#041019] focus:translate-y-0">Skip to content</a><Header lang={lang} setLang={setLang} t={t}/><div id="main-content"><Routes><Route path="/" element={<Home t={t}/>}/><Route path="/projects/holoscan" element={<CasePage t={t} lang={copy[lang]?lang:'en'} type="holo"/>}/><Route path="/academic" element={<AcademicPage t={t} lang={copy[lang]?lang:'en'}/>}/><Route path="/projects/camera-doe" element={<CasePage t={t} lang={copy[lang]?lang:'en'} type="doe"/>}/><Route path="*" element={<Home t={t}/>}/></Routes></div><footer className={`${shell} flex flex-col gap-3 border-t border-cyan-100/10 py-6 text-xs text-slate-600 md:flex-row md:justify-between`}><span>{t.footer}</span><a className="inline-flex items-center gap-2 text-slate-400" href="https://github.com/Erwhan-Le-Coueffec" target="_blank" rel="noreferrer">GitHub</a></footer></div>
}
