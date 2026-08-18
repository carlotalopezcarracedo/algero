import {
  ArrowDownRight,
  ArrowRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import {
  type AnchorHTMLAttributes,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BOOKING_URL,
  CONTACT,
  destinations,
  faqs,
  LEGAL,
  rooms,
  SMARTNESS_URL,
  type Room,
  WHATSAPP_URL,
} from './data';

const BASE_PATH = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const MOTION = {
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
  reveal: 0.9,
};

const navigation = [
  { label: 'La tenuta', href: '/resort/' },
  { label: 'Camere', href: '/camere/' },
  { label: 'La tavola', href: '/ristorante/' },
  { label: 'Sardegna', href: '/itinerari/' },
  { label: 'Contatti', href: '/contatti/' },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Villa Barbarina Nature Resort | Alghero, Sardegna',
    description:
      'Un resort 4 stelle tra ulivi, vigne e il mare di Alghero. Scopri camere, ristorante, itinerari e prenotazione diretta.',
  },
  '/resort/': {
    title: 'Il Resort | Villa Barbarina Nature Resort',
    description:
      'Cinque ettari di natura nella Nurra, una storica tenuta agricola e l’ospitalità autentica di Villa Barbarina.',
  },
  '/camere/': {
    title: 'Le Camere | Villa Barbarina Nature Resort',
    description:
      'Scopri le camere doppie, triple, quadruple e Junior Suite di Villa Barbarina ad Alghero.',
  },
  '/ristorante/': {
    title: 'Il Ristorante | Villa Barbarina Nature Resort',
    description:
      'Cucina sarda, ingredienti locali, pizza cotta nel forno a legna e vini del territorio.',
  },
  '/itinerari/': {
    title: 'Dintorni e itinerari | Villa Barbarina Nature Resort',
    description:
      'Da Villa Barbarina verso Alghero, Le Bombarde, Capo Caccia e la costa della Nurra.',
  },
  '/servizi-extra/': {
    title: 'Servizi extra | Villa Barbarina Nature Resort',
    description:
      'Richiedi informazioni su transfer, esperienze, eventi e servizi per personalizzare il soggiorno.',
  },
  '/contatti/': {
    title: 'Contatti | Villa Barbarina Nature Resort',
    description:
      'Contatta Villa Barbarina per disponibilità, preventivi personalizzati e informazioni sul soggiorno.',
  },
};

function normalisePath(pathname: string) {
  if (pathname === '/') return '/';
  return `/${pathname.split('/').filter(Boolean).join('/')}/`;
}

function routeFromLocation(pathname: string) {
  const baseWithoutSlash = BASE_PATH === '/' ? '' : BASE_PATH.slice(0, -1);
  const routePath = baseWithoutSlash && pathname.startsWith(baseWithoutSlash)
    ? pathname.slice(baseWithoutSlash.length) || '/'
    : pathname;
  return normalisePath(routePath);
}

function browserPathForRoute(route: string) {
  const normalizedRoute = normalisePath(route);
  return normalizedRoute === '/' ? BASE_PATH : `${BASE_PATH}${normalizedRoute.slice(1)}`;
}

function publicAssetPath(src: string) {
  return src.startsWith('/') ? `${BASE_PATH}${src.slice(1)}` : src;
}

function usePathname() {
  const [pathname, setPathname] = useState(() => routeFromLocation(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPathname(routeFromLocation(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return pathname;
}

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

function SiteLink({ href, onClick, children, ...props }: SiteLinkProps) {
  const isInternal = href.startsWith('/');
  const resolvedHref = isInternal ? browserPathForRoute(href) : href;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === '_blank' ||
      !isInternal
    ) return;

    event.preventDefault();
    const nextPath = normalisePath(href);
    if (routeFromLocation(window.location.pathname) !== nextPath) {
      window.history.pushState({}, '', browserPathForRoute(nextPath));
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return <a href={resolvedHref} onClick={handleClick} {...props}>{children}</a>;
}

function BookingLink({ children = 'Prenota', className = '' }) {
  return (
    <a className={`booking-link ${className}`.trim()} href={BOOKING_URL} target="_blank" rel="noreferrer">
      <span>{children}</span>
      <ArrowDownRight aria-hidden="true" size={19} strokeWidth={1.5} />
    </a>
  );
}

type PhotoProps = { src: string; alt: string; className?: string; eager?: boolean };

function Photo({ src, alt, className = '', eager = false }: PhotoProps) {
  return (
    <img
      className={className}
      src={publicAssetPath(src)}
      alt={alt}
      width="2048"
      height="1365"
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

function ImageReveal({ src, alt, className = '', caption }: PhotoProps & { caption?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.figure
      className={`image-reveal ${className}`.trim()}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={{
          hidden: reduceMotion ? { clipPath: 'inset(0 0 0% 0)' } : { clipPath: 'inset(0 0 100% 0)' },
          visible: { clipPath: 'inset(0 0 0% 0)' },
        }}
        transition={{ duration: MOTION.reveal, ease: MOTION.ease }}
      >
        <Photo src={src} alt={alt} eager />
      </motion.div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </motion.figure>
  );
}

function ParallaxPhoto({ src, alt, className = '' }: PhotoProps) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-24, 24]);
  return (
    <figure ref={ref} className={`parallax-photo ${className}`.trim()}>
      <motion.div style={reduceMotion ? undefined : { y }}><Photo src={src} alt={alt} eager /></motion.div>
    </figure>
  );
}

function Header({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inverseAtTop = ['/resort/', '/ristorante/', '/itinerari/'].includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">Vai al contenuto</a>
      <header className={`site-header ${inverseAtTop ? 'is-inverse' : ''} ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-is-open' : ''}`}>
        <SiteLink href="/" className="wordmark" aria-label="Villa Barbarina, home">
          <span>Villa</span><strong>Barbarina</strong><small>Nature Resort · Alghero</small>
        </SiteLink>
        <nav className="desktop-nav" aria-label="Navigazione principale">
          {navigation.map((item) => <SiteLink key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.label}</SiteLink>)}
        </nav>
        <div className="header-actions">
          <a className="language-link" href="https://www.villabarbarina.com/en/">IT <span>/ EN</span></a>
          <BookingLink className="header-booking">Prenota</BookingLink>
          <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="fullscreen-menu" aria-label={menuOpen ? 'Chiudi il menu' : 'Apri il menu'} onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div id="fullscreen-menu" className={`fullscreen-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Menu mobile">
          {navigation.map((item, index) => <SiteLink href={item.href} key={item.href} tabIndex={menuOpen ? 0 : -1}><span>{String(index + 1).padStart(2, '0')}</span>{item.label}</SiteLink>)}
          <SiteLink href="/servizi-extra/" tabIndex={menuOpen ? 0 : -1}><span>06</span>Servizi extra</SiteLink>
        </nav>
        <div className="fullscreen-menu__aside"><span>{CONTACT.coordinates}</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
      </div>
    </>
  );
}

function HomeHero() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="arrival" aria-labelledby="arrival-title">
      <motion.div className="arrival__veil" initial={reduceMotion ? false : { scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 1.05, ease: MOTION.ease, delay: 0.08 }} aria-hidden="true" />
      <div className="arrival__word arrival__word--back" aria-hidden="true">BARBARINA</div>
      <motion.figure className="arrival__landscape" initial={reduceMotion ? false : { clipPath: 'inset(8% 8% 8% 8%)' }} animate={{ clipPath: 'inset(0% 0% 0% 0%)' }} transition={{ duration: 1.25, ease: MOTION.ease, delay: 0.25 }}>
        <Photo src="/images/villa/olive-grove.webp" alt="La piscina e il corpo centrale di Villa Barbarina nella campagna della Nurra" eager />
      </motion.figure>
      <motion.div className="arrival__word arrival__word--front" initial={reduceMotion ? false : { y: '115%' }} animate={{ y: 0 }} transition={{ duration: 1.1, ease: MOTION.ease, delay: 0.55 }} aria-hidden="true">RINA</motion.div>
      <motion.div className="arrival__copy" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.75 }}>
        <p className="eyebrow">Tenuta agricola · Santa Maria la Palma</p>
        <h1 id="arrival-title">Relax autentico nell’anima verde della Sardegna.</h1>
        <p>Tra ulivi, vigne e il mare di Alghero.</p>
      </motion.div>
      <div className="arrival__side-note"><span>{CONTACT.coordinates}</span><span>Scorri per entrare</span></div>
    </section>
  );
}

function FirstBreath() {
  return (
    <section className="first-breath" aria-labelledby="first-breath-title">
      <span className="chapter-label">01 / La tenuta</span>
      <h2 id="first-breath-title">La campagna<span>cambia il tempo.</span></h2>
      <div className="first-breath__copy">
        <p>Villa Barbarina è immersa nella pianura della Nurra, tra cinque ettari di uliveti, vigne e prati. Qui il silenzio della campagna incontra camere luminose, cucina sarda e una piscina aperta sul paesaggio.</p>
        <SiteLink className="text-link" href="/resort/">Entrare nella tenuta <ArrowRight aria-hidden="true" size={18} /></SiteLink>
      </div>
      <ImageReveal className="first-breath__portrait" src="/images/villa/pool-guest.webp" alt="Un momento di quiete sul bordo della piscina di Villa Barbarina" caption="La quiete non è un servizio. È il ritmo del luogo." />
      <span className="first-breath__vertical" aria-hidden="true">NURRA</span>
    </section>
  );
}

function EstateFacts() {
  const facts = [['05', 'ettari', 'Ulivi, vigne e prati'], ['23', 'camere', 'Aperte sul paesaggio'], ['03', 'km', 'Dall’aeroporto di Alghero'], ['01', 'tavola', 'Cucina sarda e forno a legna']];
  return (
    <section className="estate-facts" aria-label="Villa Barbarina in breve">
      <span className="estate-facts__lead">Coordinate di soggiorno</span>
      <div className="estate-facts__track">{facts.map(([number, unit, text]) => <div className="estate-fact" key={text}><strong>{number}</strong><span>{unit}</span><p>{text}</p></div>)}</div>
    </section>
  );
}

function EstateChapter() {
  return (
    <section className="estate-chapter" aria-labelledby="estate-title">
      <div className="estate-chapter__ghost" aria-hidden="true">NATURA</div>
      <div className="estate-chapter__copy"><span className="chapter-label chapter-label--light">02 / Il paesaggio</span><h2 id="estate-title">Non fa da sfondo. Fa parte del soggiorno.</h2><p>La villa nasce da una tenuta agricola e conserva un rapporto diretto con la terra: nei materiali, nella cucina e nella scala intima degli spazi.</p></div>
      <ParallaxPhoto className="estate-chapter__wide" src="/images/villa/villa-exterior.webp" alt="Una camera di Villa Barbarina aperta sul giardino" />
      <ImageReveal className="estate-chapter__detail" src="/images/villa/grounds.webp" alt="Vino, pane e ingredienti della tavola di Villa Barbarina" />
      <p className="estate-chapter__note">Cinque ettari per scegliere ogni giorno tra il prato, la piscina e la costa.</p>
    </section>
  );
}

function RoomJourney({ compact = false }: { compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  const activeRoom = rooms[activeIndex];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nextIndex = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(nextIndex)) setActiveIndex(nextIndex);
        }
      });
    }, { rootMargin: '-44% 0px -44% 0px', threshold: 0.01 });
    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`room-journey ${compact ? 'room-journey--compact' : ''}`}>
      <div className="room-journey__stage">
        <div className="room-journey__heading"><span className="chapter-label chapter-label--light">03 / Le camere</span><p>Quattro modi di abitare la quiete.</p></div>
        <nav className="room-journey__index" aria-label="Tipologie di camera">{rooms.map((room, index) => <SiteLink href={room.slug} key={room.slug} className={index === activeIndex ? 'is-active' : ''} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)}><span>{String(index + 1).padStart(2, '0')}</span>{room.menuName}</SiteLink>)}</nav>
        <div className="room-journey__title" aria-live="polite"><span>{activeRoom.lead}</span><motion.h2 key={activeRoom.slug} initial={reduceMotion ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.55, ease: MOTION.ease }}>{activeRoom.menuName}</motion.h2></div>
        <motion.figure className="room-journey__main-image" key={`${activeRoom.slug}-main`} initial={reduceMotion ? false : { clipPath: 'inset(100% 0 0 0)', scale: 1.04 }} animate={{ clipPath: 'inset(0% 0 0 0)', scale: 1 }} transition={{ duration: 0.7, ease: MOTION.ease }}><Photo src={activeRoom.primaryImage} alt={activeRoom.imageAlt} /></motion.figure>
        <motion.figure className="room-journey__detail-image" key={`${activeRoom.slug}-detail`} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.48, ease: MOTION.ease, delay: 0.08 }}><Photo src={activeRoom.secondaryImage} alt={`Dettaglio della ${activeRoom.menuName}`} /></motion.figure>
        <div className="room-journey__meta"><span>{activeRoom.capacity}</span><span>{activeRoom.bed}</span><SiteLink href={activeRoom.slug}>Scopri <ArrowRight aria-hidden="true" size={17} /></SiteLink></div>
      </div>
      <div className="room-journey__steps" aria-hidden="true">{rooms.map((room, index) => <div className="room-journey__step" data-index={index} key={room.slug} ref={(node) => { stepRefs.current[index] = node; }} />)}</div>
      <div className="room-journey__mobile">{rooms.map((room, index) => <article key={room.slug}><span>{String(index + 1).padStart(2, '0')}</span><h2>{room.menuName}</h2><Photo src={room.primaryImage} alt={room.imageAlt} /><p>{room.lead}</p><div><span>{room.capacity}</span><span>{room.bed}</span></div><SiteLink className="text-link text-link--light" href={room.slug}>Entra nella camera <ArrowRight aria-hidden="true" size={18} /></SiteLink></article>)}</div>
    </section>
  );
}

function PhotographicInterruption() {
  return <section className="photographic-break" aria-label="Villa Barbarina vista dall’alto"><ParallaxPhoto src="/images/villa/aerial.webp" alt="Vista aerea della piscina e del parco di Villa Barbarina" /><span>Terra / acqua / ombra</span></section>;
}

function DiningChapter() {
  return (
    <section className="dining-chapter" aria-labelledby="dining-title">
      <div className="dining-chapter__word" aria-hidden="true">RISTORANTE</div>
      <span className="chapter-label chapter-label--light">04 / La tavola</span>
      <div className="dining-chapter__copy"><h2 id="dining-title">La Sardegna arriva a tavola senza travestimenti.</h2><p>Pasta tirata a mano, carni locali, pesce del giorno, pizza cotta nel forno a legna e vini autoctoni. La cucina racconta la terra con gesti semplici e ingredienti scelti.</p><SiteLink className="text-link text-link--light" href="/ristorante/">Sedersi a tavola <ArrowRight aria-hidden="true" size={18} /></SiteLink></div>
      <ImageReveal className="dining-chapter__main" src="/images/villa/crudo.webp" alt="Piatto di mare del ristorante di Villa Barbarina" />
      <ParallaxPhoto className="dining-chapter__detail" src="/images/villa/pizza.webp" alt="Pizza preparata nel forno a legna" />
      <span className="dining-chapter__caption">Ingredienti sardi, senza distanze.</span>
    </section>
  );
}

function DestinationExplorer({ title = 'Fuori dalla tenuta, la Sardegna.' }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDestination = destinations[activeIndex];
  const reduceMotion = useReducedMotion();
  return (
    <section className="destination-explorer" aria-labelledby="destination-title">
      <div className="destination-explorer__intro"><span className="chapter-label">05 / Il territorio</span><h2 id="destination-title">{title}</h2><p>Campagna, città e costa possono appartenere alla stessa giornata.</p></div>
      <div className="destination-explorer__desktop">
        <div className="destination-explorer__list">{destinations.map((destination, index) => <button type="button" key={destination.name} className={index === activeIndex ? 'is-active' : ''} onMouseEnter={() => setActiveIndex(index)} onFocus={() => setActiveIndex(index)} onClick={() => setActiveIndex(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{destination.name}</strong><small>{destination.distance}</small><ArrowRight aria-hidden="true" size={22} strokeWidth={1.4} /></button>)}</div>
        <div className="destination-explorer__visual" aria-live="polite"><motion.figure key={activeDestination.name} initial={reduceMotion ? false : { clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 0.65, ease: MOTION.ease }}><Photo src={activeDestination.image} alt={activeDestination.alt} /></motion.figure><p>{activeDestination.text}</p></div>
      </div>
      <div className="destination-explorer__mobile">{destinations.map((destination, index) => <article key={destination.name}><span>{String(index + 1).padStart(2, '0')}</span><h3>{destination.name}</h3><small>{destination.distance}</small><Photo src={destination.image} alt={destination.alt} /><p>{destination.text}</p></article>)}</div>
    </section>
  );
}

function BookingScene({ title = 'La tua Sardegna comincia nella quiete.', copy = 'Prenota direttamente oppure raccontaci il soggiorno che hai in mente.' }: { title?: string; copy?: string }) {
  return (
    <section className="booking-scene" aria-labelledby="booking-scene-title">
      <figure><Photo src="/images/villa/night-exterior.webp" alt="Villa Barbarina illuminata nella quiete della sera" eager /></figure>
      <div className="booking-scene__word" aria-hidden="true">ARRIVARE</div>
      <div className="booking-scene__copy"><span className="chapter-label chapter-label--light">Il prossimo viaggio</span><h2 id="booking-scene-title">{title}</h2><p>{copy}</p><div><BookingLink>Verifica disponibilità</BookingLink><SiteLink className="text-link text-link--light" href="/contatti/">Scrivi allo staff <ArrowRight aria-hidden="true" size={18} /></SiteLink></div></div>
    </section>
  );
}

function HomePage() {
  return <main id="main-content"><HomeHero /><FirstBreath /><EstateFacts /><EstateChapter /><RoomJourney /><PhotographicInterruption /><DiningChapter /><DestinationExplorer /><BookingScene /></main>;
}

type CinematicHeroProps = { eyebrow: string; title: string; word: string; lead: string; image: string; imageAlt: string; tone?: 'mineral' | 'olive' | 'wine' };

function CinematicHero({ eyebrow, title, word, lead, image, imageAlt, tone = 'mineral' }: CinematicHeroProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section className={`cinematic-hero cinematic-hero--${tone}`}>
      <div className="cinematic-hero__word" aria-hidden="true">{word}</div>
      <motion.figure initial={reduceMotion ? false : { clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.05, ease: MOTION.ease, delay: 0.15 }}><Photo src={image} alt={imageAlt} eager /></motion.figure>
      <motion.div className="cinematic-hero__copy" initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.45 }}><span className="chapter-label">{eyebrow}</span><h1>{title}</h1><p>{lead}</p></motion.div>
    </section>
  );
}

function ResortPage() {
  return (
    <main id="main-content">
      <CinematicHero eyebrow="Villa Barbarina / La tenuta" title="Il paesaggio non fa da sfondo. È parte del soggiorno." word="NURRA" lead="Una storica tenuta agricola nella pianura della Nurra, trasformata in un resort dove natura, ospitalità e cucina condividono lo stesso ritmo." image="/images/villa/villa-exterior.webp" imageAlt="Una camera di Villa Barbarina affacciata sulla tenuta" tone="olive" />
      <section className="estate-story" aria-labelledby="estate-story-title">
        <div className="estate-story__opening"><span className="chapter-label">01 / Origine</span><h2 id="estate-story-title">Cinque ettari per rallentare.</h2><p>Ulivi secolari, vigne, prati curati e il profumo della macchia mediterranea circondano le camere. La Riviera del Corallo resta vicina, ma qui il rumore si ferma alla soglia.</p></div>
        <ImageReveal className="estate-story__image-a" src="/images/villa/olive-grove.webp" alt="La piscina di Villa Barbarina aperta sul cielo della Nurra" />
        <ParallaxPhoto className="estate-story__image-b" src="/images/villa/reception.webp" alt="La reception di Villa Barbarina" />
        <blockquote>La terra resta visibile nei materiali, nella cucina e nella scala intima degli spazi.</blockquote>
      </section>
      <section className="day-notation" aria-labelledby="day-title"><h2 id="day-title">Una giornata, tre ritmi.</h2><div><article><span>07:30</span><h3>La luce sulla veranda</h3><p>Colazione, frutta fresca e tempo per decidere.</p></article><article><span>12:00</span><h3>Il prato o la costa</h3><p>Restare nella tenuta o raggiungere il mare in pochi minuti.</p></article><article><span>20:00</span><h3>La tavola e il cielo</h3><p>Cucina sarda, poi il silenzio della campagna.</p></article></div></section>
      <PhotographicInterruption />
      <BookingScene title="Una base quieta per incontrare la Sardegna." copy="Scegli la camera e prenota direttamente, oppure contattaci per un soggiorno su misura." />
    </main>
  );
}

function RoomsPage() {
  return <main id="main-content"><CinematicHero eyebrow="Villa Barbarina / Le camere" title="Ventitré camere. Nessuna separata dal paesaggio." word="CAMERE" lead="Legno su misura, tessuti naturali, terrazze e verande private: ogni stanza interpreta il carattere della tenuta con una misura diversa." image="/images/villa/room-view.webp" imageAlt="Camera di Villa Barbarina affacciata sulla piscina" /><section className="rooms-prologue"><span>Spazi diversi / stessa quiete</span><p>Tutte le camere dispongono di aria condizionata, TV LCD, minibar, cassaforte e bagno privato con doccia in cristallo.</p></section><RoomJourney compact /><BookingScene /></main>;
}

type GalleryImage = { src: string; alt: string };

function EditorialGallery({ images }: { images: GalleryImage[] }) {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  useEffect(() => {
    if (!activeImage) return;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveImage(null); };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKeyDown); };
  }, [activeImage]);
  return (
    <><div className="editorial-gallery">{images.map((image, index) => <button type="button" key={`${image.src}-${index}`} onClick={() => setActiveImage(image)} aria-label={`Apri immagine: ${image.alt}`}><Photo src={image.src} alt={image.alt} /><span>Apri</span></button>)}</div>{activeImage ? <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galleria fotografica"><button type="button" autoFocus onClick={() => setActiveImage(null)} aria-label="Chiudi immagine"><X aria-hidden="true" /></button><Photo src={activeImage.src} alt={activeImage.alt} eager /><p>{activeImage.alt}</p></div> : null}</>
  );
}

function RoomPage({ room }: { room: Room }) {
  return (
    <main id="main-content">
      <section className="room-hero"><div className="room-hero__index">{String(rooms.indexOf(room) + 1).padStart(2, '0')} / 04</div><h1>{room.name}</h1><figure><Photo src={room.primaryImage} alt={room.imageAlt} eager /></figure><p>{room.lead}</p><div className="room-hero__facts"><span>{room.capacity}</span><span>{room.bed}</span><span>{room.idealFor}</span></div></section>
      <section className="room-story" aria-labelledby="room-story-title"><div><span className="chapter-label">Dentro la camera</span><h2 id="room-story-title">Comfort e atmosfera</h2><p>{room.description}</p><p>{room.detail}</p></div><ImageReveal src={room.secondaryImage} alt={`Bagno della ${room.menuName}`} /><ParallaxPhoto src="/images/villa/terrace-aperitivo.webp" alt="Terrazza privata affacciata sul verde" /></section>
      <section className="amenities" aria-labelledby="amenities-title"><h2 id="amenities-title">In camera</h2><ul>{room.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
      <section className="room-gallery-section" aria-labelledby="gallery-title"><span className="chapter-label">Dettagli / luce / materia</span><h2 id="gallery-title">La camera, senza fretta.</h2><EditorialGallery images={[{ src: room.primaryImage, alt: room.imageAlt }, { src: room.secondaryImage, alt: `Bagno della ${room.menuName}` }, { src: '/images/villa/room-view.webp', alt: 'La vista dalla camera verso la piscina' }, { src: '/images/villa/villa-exterior.webp', alt: 'La terrazza immersa nel verde della tenuta' }]} /></section>
      <section className="next-rooms" aria-label="Altre camere"><span>Continua a esplorare</span>{rooms.filter((candidate) => candidate.slug !== room.slug).map((candidate) => <SiteLink href={candidate.slug} key={candidate.slug}>{candidate.menuName}<ArrowRight aria-hidden="true" size={20} /></SiteLink>)}</section>
      <BookingScene title="Ritrova il tempo della camera." copy="Verifica la disponibilità oppure chiedi allo staff la soluzione più adatta al tuo soggiorno." />
    </main>
  );
}

function RestaurantPage() {
  return (
    <main id="main-content">
      <CinematicHero eyebrow="Villa Barbarina / La tavola" title="La cucina sarda, servita nel luogo da cui nasce." word="TAVOLA" lead="Ingredienti freschi, ricette della tradizione, pizza cotta nel forno a legna e vini autoctoni: la tavola completa il racconto della tenuta." image="/images/villa/crudo.webp" imageAlt="Piatto del ristorante di Villa Barbarina" tone="wine" />
      <section className="food-editorial" aria-labelledby="food-editorial-title"><div className="food-editorial__copy"><span className="chapter-label chapter-label--light">01 / Materia prima</span><h2 id="food-editorial-title">Sapori autentici, gesti contemporanei.</h2><p>Pane carasau, pasta tirata a mano, carni locali cotte lentamente e pesce del giorno raccontano la Sardegna più vera. I dolci preparati ogni mattina e la selezione di Vermentino e Cannonau chiudono il cerchio.</p></div><ImageReveal className="food-editorial__wine" src="/images/villa/wines.webp" alt="Vini sardi selezionati dal ristorante" /><ParallaxPhoto className="food-editorial__table" src="/images/villa/restaurant.webp" alt="La tavola di Villa Barbarina" /><ImageReveal className="food-editorial__pizza" src="/images/villa/pizza.webp" alt="Pizza cotta nel forno a legna" /><div className="food-editorial__note"><span>La sera</span><h3>Il forno a legna.</h3><p>Un impasto leggero incontra pomodorini, basilico, formaggi locali e olio extravergine.</p></div></section>
      <section className="restaurant-practical"><p>Il ristorante accoglie gli ospiti in sala o all’aperto. Per orari, eventi e richieste particolari, contatta direttamente la struttura.</p><a className="text-link text-link--light" href={CONTACT.phoneHref}>Chiama il ristorante <ArrowRight aria-hidden="true" size={18} /></a></section>
      <BookingScene title="Dormire qui significa anche assaggiare qui." copy="Prenota il soggiorno o scrivici per informazioni sul ristorante e sugli eventi." />
    </main>
  );
}

function ItinerariesPage() {
  return <main id="main-content"><CinematicHero eyebrow="Villa Barbarina / Dintorni" title="Ogni strada parte dalla Nurra." word="SARDEGNA" lead="Mare, scogliere, torri e città: Villa Barbarina resta al centro di un territorio che cambia volto in pochi chilometri." image="/images/villa/capo-caccia.webp" imageAlt="Torre e paesaggio costiero vicino ad Alghero" tone="olive" /><DestinationExplorer title="Un atlante per giornate senza fretta." /><section className="map-strip"><MapPin aria-hidden="true" size={24} strokeWidth={1.4} /><div><strong>{CONTACT.coordinates}</strong><span>{CONTACT.address}</span></div><a className="text-link text-link--light" href="https://maps.google.com/?q=40.6520027,8.2817193" target="_blank" rel="noreferrer">Apri la mappa <ArrowRight aria-hidden="true" size={18} /></a></section><BookingScene /></main>;
}

function ExtrasPage() {
  return (
    <main id="main-content">
      <CinematicHero eyebrow="Villa Barbarina / Su richiesta" title="Il soggiorno può continuare oltre la camera." word="TEMPO" lead="Transfer, momenti speciali ed esperienze nel territorio vengono organizzati su richiesta, a partire dalle esigenze reali del tuo viaggio." image="/images/villa/terrace-aperitivo.webp" imageAlt="Aperitivo sulla terrazza di una camera" />
      <section className="extras-manifesto" aria-labelledby="extras-title"><div><span className="chapter-label">Parliamone</span><h2 id="extras-title">Raccontaci cosa vuoi vivere.</h2><p>La disponibilità dei servizi varia in base al periodo e al tipo di soggiorno. Lo staff può aiutarti senza trasformare la vacanza in un pacchetto predefinito.</p></div><div className="extras-manifesto__list"><article><span>01</span><h3>Arrivare</h3><p>Informazioni e transfer su richiesta.</p></article><article><span>02</span><h3>Celebrare</h3><p>Matrimoni, eventi privati e incontri aziendali.</p></article><article><span>03</span><h3>Esplorare</h3><p>Indicazioni per spiagge, città e territorio.</p></article></div></section>
      <section className="smartness" aria-labelledby="smartness-title"><div><span className="chapter-label chapter-label--light">Catalogo esperienze</span><h2 id="smartness-title">Scegli, poi chiedi allo staff.</h2><p>Consulta le proposte disponibili nel marketplace ufficiale Villa Barbarina.</p><a className="text-link text-link--light" href={SMARTNESS_URL} target="_blank" rel="noreferrer">Apri in una nuova scheda <ArrowRight aria-hidden="true" size={18} /></a></div><iframe src={SMARTNESS_URL} title="Marketplace esperienze Villa Barbarina" loading="lazy" /></section>
      <BookingScene />
    </main>
  );
}

function InquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const arrival = form.elements.namedItem('Garrivo') as HTMLInputElement;
    const departure = form.elements.namedItem('Gpartenza') as HTMLInputElement;
    departure.setCustomValidity('');
    if (arrival.value && departure.value && departure.value <= arrival.value) {
      event.preventDefault();
      departure.setCustomValidity('La partenza deve essere successiva all’arrivo.');
      departure.reportValidity();
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 2500);
  };
  return (
    <form className="inquiry-form" action="https://www.villabarbarina.com/confirm7.php" method="post" target="villa-contact-response" onSubmit={handleSubmit}>
      <div className="form-row form-row--two"><label><span>Nome</span><input name="Nome" type="text" autoComplete="given-name" required /></label><label><span>Cognome</span><input name="Cognome" type="text" autoComplete="family-name" required /></label></div>
      <div className="form-row form-row--two"><label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label><label><span>Telefono</span><input name="Tel" type="tel" autoComplete="tel" required /></label></div>
      <div className="form-row form-row--two"><label><span>Arrivo</span><input name="Garrivo" type="date" min={today} required /></label><label><span>Partenza</span><input name="Gpartenza" type="date" min={today} onChange={(event) => event.currentTarget.setCustomValidity('')} required /></label></div>
      <div className="form-row form-row--three"><label><span>Adulti</span><input name="adulti" type="number" min="1" max="8" defaultValue="2" required /></label><label><span>Bambini</span><select name="bambini" value={childrenCount} onChange={(event) => setChildrenCount(Number(event.target.value))}>{[0, 1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label><span>Sistemazione</span><select name="sistemazione" defaultValue="Doppia"><option>Doppia uso singola</option><option>Doppia</option><option>Tripla</option><option>Quadrupla</option><option>Junior Suite</option></select></label></div>
      {childrenCount > 0 ? <div className="child-ages" aria-label="Età dei bambini">{Array.from({ length: childrenCount }, (_, index) => <label key={index}><span>Età bambino {index + 1}</span><input name={`eta_bambino_${index + 1}`} type="number" min="0" max="17" required /></label>)}</div> : null}
      <label className="form-row"><span>Trattamento</span><select name="trattamento" defaultValue="Camera e Colazione"><option>Solo Pernottamento</option><option>Camera e Colazione</option><option>Mezza Pensione</option></select></label>
      <label className="form-row"><span>Note</span><textarea name="Note" rows={5} /></label>
      <label className="privacy-check"><input name="privacy" type="checkbox" value="1" required /><span>Autorizzo il trattamento dei dati personali e dichiaro di aver letto la <a href="https://www.villabarbarina.com/servizi/privacy-policy-29" target="_blank" rel="noreferrer">privacy policy</a>.</span></label>
      <button className="form-submit" type="submit" disabled={submitting}>{submitting ? 'Apertura in corso…' : 'Invia la richiesta'}<ArrowRight aria-hidden="true" size={18} /></button><p className="form-note">L’invio apre la conferma del sito ufficiale in una nuova scheda.</p>
    </form>
  );
}

function ContactPage() {
  return (
    <main id="main-content">
      <section className="contact-opening"><span className="chapter-label">Villa Barbarina / Contatti</span><h1>Parliamo prima di arrivare.</h1><figure><Photo src="/images/villa/room-pool.webp" alt="La quiete della piscina vista dalla camera" eager /></figure><p>Per disponibilità, preventivi personalizzati, ristorante o richieste speciali, scrivi direttamente allo staff.</p></section>
      <section className="contact-ledger" aria-label="Recapiti"><a href={CONTACT.phoneHref}><span>Telefono</span><strong>{CONTACT.phoneLabel}</strong><Phone aria-hidden="true" /></a><a href={`mailto:${CONTACT.email}`}><span>Email</span><strong>{CONTACT.email}</strong><Mail aria-hidden="true" /></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>331 410 6025</strong><MessageCircle aria-hidden="true" /></a><a href="https://maps.google.com/?q=40.6520027,8.2817193" target="_blank" rel="noreferrer"><span>Come arrivare</span><strong>{CONTACT.address}</strong><MapPin aria-hidden="true" /></a></section>
      <section className="contact-workspace"><div><span className="chapter-label">Richiesta diretta</span><h2>Raccontaci il soggiorno.</h2><InquiryForm /></div><aside aria-labelledby="faq-title"><span className="chapter-label">Informazioni utili</span><h2 id="faq-title">Prima di partire</h2><div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary><span>{faq.question}</span><ChevronDown aria-hidden="true" size={19} /></summary><p>{faq.answer}</p></details>)}</div></aside></section>
    </main>
  );
}

function NotFoundPage() {
  return <main id="main-content" className="not-found"><span className="chapter-label">404 / Sentiero interrotto</span><h1>Questa pagina non conduce alla tenuta.</h1><SiteLink className="booking-link" href="/"><span>Torna alla home</span><ArrowRight aria-hidden="true" size={18} /></SiteLink></main>;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__name" aria-hidden="true"><span>VILLA</span><strong>BARBARINA</strong></div>
      <div className="site-footer__lead"><p>La campagna di Alghero.<br />Il mare a pochi minuti.</p><BookingLink>Verifica disponibilità</BookingLink></div>
      <nav className="site-footer__nav" aria-label="Navigazione piè di pagina">{navigation.map((item) => <SiteLink key={item.href} href={item.href}>{item.label}</SiteLink>)}<SiteLink href="/servizi-extra/">Servizi extra</SiteLink></nav>
      <address className="site-footer__contact"><span>{CONTACT.address}</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={`mailto:${CONTACT.pec}`}>PEC: {CONTACT.pec}</a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a></address>
      <div className="site-footer__legal"><span>© {new Date().getFullYear()} {LEGAL.company}</span><span>P.IVA / CF {LEGAL.vat} · REA {LEGAL.rea}</span><span>Capitale {LEGAL.capital} · Costituzione {LEGAL.established}</span><span>CIR {LEGAL.cir} · CIN {LEGAL.cin}</span><a href="https://www.villabarbarina.com/servizi/privacy-policy-29" target="_blank" rel="noreferrer">Privacy</a><a href="https://www.villabarbarina.com/servizi/cookie-policy-31" target="_blank" rel="noreferrer">Cookie</a></div>
    </footer>
  );
}

function MobileDock() {
  return <nav className="mobile-dock" aria-label="Contatti rapidi"><a href={CONTACT.phoneHref}><Phone aria-hidden="true" size={17} /><span>Chiama</span></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={17} /><span>WhatsApp</span></a><a href={BOOKING_URL} target="_blank" rel="noreferrer"><ArrowDownRight aria-hidden="true" size={17} /><span>Prenota</span></a></nav>;
}

function resolvePage(pathname: string): ReactNode {
  const room = rooms.find((candidate) => candidate.slug === pathname);
  if (room) return <RoomPage room={room} />;
  switch (pathname) {
    case '/': return <HomePage />;
    case '/resort/': return <ResortPage />;
    case '/camere/': return <RoomsPage />;
    case '/ristorante/': return <RestaurantPage />;
    case '/itinerari/': return <ItinerariesPage />;
    case '/servizi-extra/': return <ExtrasPage />;
    case '/contatti/': return <ContactPage />;
    default: return <NotFoundPage />;
  }
}

export default function App() {
  const pathname = usePathname();
  const page = useMemo(() => resolvePage(pathname), [pathname]);
  useEffect(() => {
    const room = rooms.find((candidate) => candidate.slug === pathname);
    const meta = room ? { title: `${room.menuName} | Villa Barbarina Nature Resort`, description: room.description } : pageMeta[pathname] ?? { title: 'Pagina non trovata | Villa Barbarina', description: 'La pagina richiesta non è disponibile.' };
    document.title = meta.title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', meta.description);
    document.body.dataset.route = pathname === '/' ? 'home' : 'inner';
  }, [pathname]);
  return <><Header pathname={pathname} />{page}<Footer /><MobileDock /></>;
}
