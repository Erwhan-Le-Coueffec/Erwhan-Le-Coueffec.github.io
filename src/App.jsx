import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Download, Github, Languages, Mail, MapPin, Menu, Microscope, MoveRight, Ruler, Sparkles, X } from 'lucide-react'
import { copy, EMAIL } from './copy'

const ids = ['about','projects','experience','skills','contact']
const card = 'border border-cyan-100/10 bg-white/[.025] rounded-2xl'
const shell = 'mx-auto w-[min(1160px,calc(100%-2rem))] md:w-[min(1160px,calc(100%-4rem))]'

function Header({ lang, setLang, t }) {
  const [open,setOpen] = useState(false)
  const location = useLocation()
  const home = location.pathname === '/'
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#061018]/80 backdrop-blur-xl">
    <div className={`${shell} flex h-[70px] items-center justify-between gap-4`}>
      <Link to="/" className="flex items-center gap-2 font-semibold"><i className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_#54d6ff]"/>Erwhan Le Coueffec</Link>
      <nav className="hidden gap-6 text-sm text-slate-400 lg:flex">{ids.map((id,i)=><a key={id} href={`${home?'':'/'}#${id}`} className="hover:text-white">{t.nav[i]}</a>)}</nav>
      <div className="flex items-center gap-2">
        <label className="flex h-9 items-center gap-2 rounded-full border border-cyan-100/10 px-3 text-xs text-slate-300"><Languages size={15}/><select className="bg-transparent outline-none" value={lang} onChange={e=>setLang(e.target.value)}><option className="bg-[#061018]" value="en">EN</option><option className="bg-[#061018]" value="fr">FR</option><option className="bg-[#061018]" value="de">DE</option></select></label>
        <button className="grid h-9 w-9 place-items-center rounded-full border border-cyan-100/10 lg:hidden" onClick={()=>setOpen(!open)}>{open?<X size={19}/>:<Menu size={19}/>}</button>
      </div>
    </div>
    {open&&<div className={`${shell} grid pb-4 lg:hidden`}>{ids.map((id,i)=><a key={id} href={`${home?'':'/'}#${id}`} className="border-b border-white/5 py-3 text-sm text-slate-300" onClick={()=>setOpen(false)}>{t.nav[i]}</a>)}</div>}
  </header>
}

function Heading({data}) { return <div className="mb-9 max-w-4xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{data[0]}</p><h2 className="text-3xl font-semibold tracking-[-.04em] md:text-5xl">{data[1]}</h2>{data[2]&&<p className="mt-4 max-w-2xl leading-7 text-slate-400">{data[2]}</p>}</div> }
function Button({href,children,primary=true}) { return <a href={href} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold transition hover:-translate-y-0.5 ${primary?'bg-cyan-100 text-[#041019]':'border border-cyan-100/10 bg-white/[.02] text-slate-200'}`}>{children}</a> }

function Visual() { const reduced=useReducedMotion(); return <div className="pointer-events-none absolute -right-56 top-24 h-[38rem] w-[38rem] opacity-70 md:-right-24"><div className="absolute inset-0 rounded-full border border-cyan-300/10"/><div className="absolute inset-16 rounded-full border border-cyan-300/10"/><motion.i animate={reduced?{}:{x:[-20,20,-20],opacity:[.25,.8,.25]}} transition={{duration:8,repeat:Infinity}} className="absolute left-0 top-1/2 h-px w-full -rotate-12 bg-gradient-to-r from-transparent via-cyan-200 to-transparent shadow-[0_0_14px_#54d6ff]"/><div className="absolute inset-28 rounded-full bg-[repeating-linear-gradient(90deg,transparent_0_8px,rgba(84,214,255,.1)_8px_9px)]"/></div> }

function ProjectCard({p,to,icon}) { return <Link to={to} className={`${card} overflow-hidden transition hover:-translate-y-1 hover:border-cyan-300/25`}><div className="relative h-52 overflow-hidden border-b border-cyan-100/10 bg-[radial-gradient(circle_at_70%_35%,rgba(72,201,245,.18),transparent_35%),#08141c]"><div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-cyan-300/20 text-cyan-300">{icon}</div><div className="absolute inset-0 skew-x-[-16deg] bg-[repeating-linear-gradient(90deg,transparent_0_23px,rgba(84,214,255,.08)_23px_24px,transparent_24px_42px)]"/></div><div className="p-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-cyan-300">{p[0]}</p><h3 className="mt-2 text-xl font-semibold">{p[1]}</h3><p className="mt-3 leading-7 text-slate-400">{p[2]}</p><div className="mt-5 flex items-baseline gap-3 border-t border-white/5 pt-4"><strong className="text-2xl text-cyan-100">{p[3]}</strong><span className="text-xs text-slate-500">{p[4]}</span></div><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">{p[5]}<MoveRight size={16}/></span></div></Link> }

function Home({t}) {
  const reduced=useReducedMotion(); const reveal=reduced?{}:{initial:{opacity:0,y:18},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.15},transition:{duration:.5}}
  return <main>
    <section className={`${shell} relative flex min-h-svh items-center pt-28`}><Visual/><motion.div className="relative z-10 max-w-4xl" initial={reduced?false:{opacity:0,y:18}} animate={{opacity:1,y:0}}><div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-2 text-xs font-semibold text-cyan-100"><Sparkles size={14}/>{t.hero[0]}</div><h1 className="mt-6 text-[clamp(3rem,10vw,6.4rem)] font-semibold leading-[.93] tracking-[-.06em]">{t.hero[1]}<span className="mt-2 block text-[.48em] font-normal leading-tight text-cyan-100">{t.hero[2]}</span></h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">{t.hero[3]}</p><div className="mt-7 flex flex-wrap gap-3"><Button href="#projects">{t.hero[4]}<ArrowRight size={17}/></Button><Button href={`mailto:${EMAIL}`} primary={false}>{t.hero[5]}<Mail size={16}/></Button></div><p className="mt-5 flex items-center gap-2 text-sm text-slate-500"><MapPin size={15}/>{t.hero[6]}</p></motion.div></section>

    <section id="about" className={`${shell} scroll-mt-24 py-24`}><motion.div {...reveal}><Heading data={t.about}/><div className="grid gap-5 md:grid-cols-[1.2fr_.8fr]"><div className="space-y-4 leading-8 text-slate-400"><p>{t.about[2]}</p><p>{t.about[3]}</p></div><div className={`${card} p-5`}><Microscope className="text-cyan-300"/><h3 className="mt-4 font-semibold">{t.about[4]}</h3><p className="mt-2 leading-7 text-slate-400">{t.about[5]}</p></div></div><div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>{t.looking[0]}</span>{t.looking.slice(1).map(x=><span className="rounded-full border border-cyan-100/10 px-3 py-2 text-slate-300" key={x}>{x}</span>)}</div></motion.div></section>

    <section id="projects" className={`${shell} scroll-mt-24 py-24`}><motion.div {...reveal}><Heading data={t.projects}/><div className="grid gap-5 md:grid-cols-2"><ProjectCard p={t.holo} to="/projects/holoscan" icon={<Ruler/>}/><ProjectCard p={t.doe} to="/projects/camera-doe" icon={<Microscope/>}/></div><h3 className="mt-12 font-semibold text-slate-300">{t.academic[0]}</h3><div className="mt-4 grid gap-4 md:grid-cols-3">{t.academic.slice(1).map((x,i)=><article className="border-t border-cyan-100/10 pt-4" key={x[0]}><span className="text-xs text-slate-600">0{i+1}</span><h4 className="mt-2 font-semibold">{x[0]}</h4><p className="mt-2 text-sm leading-6 text-slate-500">{x[1]}</p></article>)}</div></motion.div></section>

    <section id="experience" className={`${shell} scroll-mt-24 py-24`}><motion.div {...reveal}><Heading data={t.expTitle}/><div className="border-t border-cyan-100/10">{t.exp.map(x=><article className="grid gap-3 border-b border-cyan-100/10 py-6 md:grid-cols-[10rem_1fr]" key={x[0]}><div className="text-xs text-slate-500">{x[2]}</div><div><h3 className="font-semibold">{x[1]}</h3><p className="mt-1 text-sm text-cyan-200">{x[0]}</p><ul className="mt-4 list-disc space-y-2 pl-4 text-sm leading-6 text-slate-400">{x[3].map(y=><li key={y}>{y}</li>)}</ul></div></article>)}</div></motion.div></section>

    <section className={`${shell} py-24`}><motion.div {...reveal}><Heading data={t.eduTitle}/><div className="grid gap-4 md:grid-cols-3">{t.edu.map(x=><article className={`${card} p-5`} key={x[0]}><span className="text-xs text-slate-500">{x[1]}</span><h3 className="mt-4 font-semibold">{x[0]}</h3><h4 className="mt-2 text-sm text-slate-300">{x[2]}</h4><p className="mt-3 text-sm leading-6 text-slate-500">{x[3]}</p>{x[4]&&<p className="mt-3 text-xs leading-5 text-cyan-200">{x[4]}</p>}</article>)}</div></motion.div></section>

    <section id="skills" className={`${shell} scroll-mt-24 py-24`}><motion.div {...reveal}><Heading data={t.skillsTitle}/><div className="grid gap-4 md:grid-cols-3">{t.skills.map(x=><article className={`${card} p-5`} key={x[0]}><h3 className="font-semibold">{x[0]}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{x[1]}</p></article>)}</div><div className="mt-4 grid gap-4 md:grid-cols-2"><article className={`${card} p-5`}><h3 className="font-semibold">{t.language[0]}</h3>{t.language.slice(1).map(x=><p className="mt-2 text-sm text-slate-400" key={x}>{x}</p>)}</article><article className={`${card} p-5`}><h3 className="font-semibold">{t.interests[0]}</h3><p className="mt-2 text-sm leading-7 text-slate-400">{t.interests[1]}</p></article></div></motion.div></section>

    <section id="contact" className={`${shell} scroll-mt-24 py-24`}><motion.div {...reveal} className={`${card} p-6 md:p-10`}><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{t.contact[0]}</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-.04em] md:text-5xl">{t.contact[1]}</h2><p className="mt-5 max-w-2xl leading-7 text-slate-400">{t.contact[2]}</p><div className="mt-7 flex flex-wrap gap-3"><Button href={`mailto:${EMAIL}`}><Mail size={16}/>{t.contact[3]}</Button>{t.contact.slice(4).map((x,i)=><button disabled key={x} title="Coming next" className="inline-flex min-h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-cyan-100/10 px-4 text-sm font-bold text-slate-500">{i===0?null:<Download size={16}/>} {x}</button>)}</div><p className="mt-4 text-xs text-slate-600">{EMAIL}</p></motion.div></section>
  </main>
}

function CasePage({t,type}) {
  const data=type==='holo'?t.holoCase:t.doeCase; useEffect(()=>window.scrollTo(0,0),[type])
  return <main className={`${shell} min-h-screen pb-24 pt-28`}><Link className="inline-flex items-center gap-2 text-sm text-slate-400" to="/"><ArrowLeft size={16}/>{t.back}</Link><div className="max-w-4xl py-12"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">{data[0]}</p><h1 className="mt-3 text-[clamp(2.5rem,8vw,5rem)] font-semibold leading-none tracking-[-.055em]">{data[1]}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{data[2]}</p></div><div className="grid h-64 place-items-center rounded-2xl border border-cyan-100/10 bg-[radial-gradient(circle_at_70%_30%,rgba(66,205,248,.15),transparent_30%),repeating-linear-gradient(90deg,rgba(84,214,255,.04)_0_1px,transparent_1px_28px),#08141c] text-sm text-slate-600">Project visual · final photo / graph to add</div><div className="mt-10 border-t border-cyan-100/10">{data.slice(3).map((body,i)=><article className={`grid gap-3 border-b border-cyan-100/10 py-7 md:grid-cols-[4rem_1fr] ${i===4?'text-cyan-100':''}`} key={t.caseLabels[i]}><span className="text-xs text-slate-600">0{i+1}</span><div className="max-w-4xl"><h2 className="font-semibold">{t.caseLabels[i]}</h2><p className="mt-3 leading-8 text-slate-400">{body}</p></div></article>)}</div></main>
}

export default function App(){
  const [lang,setLang]=useState(()=>localStorage.getItem('portfolio-language')||'en'); const t=copy[lang]||copy.en
  useEffect(()=>{localStorage.setItem('portfolio-language',lang);document.documentElement.lang=lang},[lang])
  return <div className="min-h-screen overflow-hidden bg-[#061018] text-slate-50"><Header lang={lang} setLang={setLang} t={t}/><Routes><Route path="/" element={<Home t={t}/>}/><Route path="/projects/holoscan" element={<CasePage t={t} type="holo"/>}/><Route path="/projects/camera-doe" element={<CasePage t={t} type="doe"/>}/><Route path="*" element={<Home t={t}/>}/></Routes><footer className={`${shell} flex flex-col gap-3 border-t border-cyan-100/10 py-6 text-xs text-slate-600 md:flex-row md:justify-between`}><span>{t.footer}</span><a className="inline-flex items-center gap-2 text-slate-400" href="https://github.com/Erwhan-Le-Coueffec" target="_blank" rel="noreferrer"><Github size={15}/>GitHub</a></footer></div>
}
