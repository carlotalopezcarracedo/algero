import {
  ArrowRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import {
  type AnchorHTMLAttributes,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
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
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  fast: 0.22,
  normal: 0.42,
  slow: 0.85,
};

const navigation = [
  { label: 'Resort', href: '/resort/' },
  { label: 'Camere', href: '/camere/' },
  { label: 'Ristorante', href: '/ristorante/' },
  { label: 'Itinerari', href: '/itinerari/' },
  { label: 'Servizi', href: '/servizi-extra/' },
  { label: 'Contatti', href: '/contatti/' },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Villa Barbarina Nature Resort | Alghero, Sardegna',
    description: 'Un resort 4 stelle tra ulivi, vigne e il mare di Alghero. Camere, piscina, ristorante e prenotazione diretta.',
  },
  '/resort/': {
    title: 'Il Resort | Villa Barbarina Nature Resort',
    description: 'Cinque ettari di natura nella Nurra, una storica tenuta agricola e l’ospitalità autentica di Villa Barbarina.',
  },
  '/camere/': {
    title: 'Le Camere | Villa Barbarina Nature Resort',
    description: 'Scopri le camere doppie, triple, quadruple e Junior Suite di Villa Barbarina ad Alghero.',
  },
  '/ristorante/': {
    title: 'Il Ristorante | Villa Barbarina Nature Resort',
    description: 'Cucina sarda, ingredienti locali, pizza cotta nel forno a legna e vini del territorio.',
  },
  '/itinerari/': {
    title: 'Dintorni e itinerari | Villa Barbarina Nature Resort',
    description: 'Da Villa Barbarina verso Alghero, Le Bombarde, Capo Caccia e la costa della Nurra.',
  },
  '/servizi-extra/': {
    title: 'Servizi extra | Villa Barbarina Nature Resort',
    description: 'Richiedi informazioni su transfer, esperienze, eventi e servizi per personalizzare il soggiorno.',
  },
  '/contatti/': {
    title: 'Contatti | Villa Barbarina Nature Resort',
    description: 'Contatta Villa Barbarina per disponibilità, preventivi personalizzati e informazioni sul soggiorno.',
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

function BookingLink({ children = 'Prenota', className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <a className={`button button--primary ${className}`.trim()} href={BOOKING_URL} target="_blank" rel="noreferrer">
      <span>{children}</span><ArrowRight aria-hidden="true" size={17} />
    </a>
  );
}

function TextLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return (
    <SiteLink className={`text-link ${light ? 'text-link--light' : ''}`} href={href}>
      <span>{children}</span><ArrowRight aria-hidden="true" size={17} />
    </SiteLink>
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

function ImageReveal({ src, alt, className = '', eager = false }: PhotoProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.figure
      className={`image-reveal ${className}`.trim()}
      initial={reduceMotion ? false : { clipPath: 'inset(8% 0 0 0)', opacity: 0.72 }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: MOTION.slow, ease: MOTION.ease }}
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 1.03 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.16 }}
        transition={{ duration: MOTION.slow, ease: MOTION.ease }}
      >
        <Photo src={src} alt={alt} eager={eager} />
      </motion.div>
    </motion.figure>
  );
}

function Header({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hasLightHero = rooms.some((room) => room.slug === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const backgroundTargets = document.querySelectorAll<HTMLElement>('#app-content, .site-footer');
    backgroundTargets.forEach((element) => {
      if (menuOpen) element.setAttribute('inert', '');
      else element.removeAttribute('inert');
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      backgroundTargets.forEach((element) => element.removeAttribute('inert'));
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">Vai al contenuto</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : 'is-at-top'} ${hasLightHero ? 'has-light-hero' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
        <SiteLink href="/" className="wordmark" aria-label="Villa Barbarina, home">
          <span>Villa</span><strong>Barbarina</strong><small>Nature Resort · Alghero</small>
        </SiteLink>
        <nav className="desktop-nav" aria-label="Navigazione principale">
          {navigation.map((item) => (
            <SiteLink key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {item.label}
            </SiteLink>
          ))}
        </nav>
        <div className="header-actions">
          <a className="language-link" href="https://www.villabarbarina.com/en/">IT <span>/ EN</span></a>
          <BookingLink className="header-booking">Prenota</BookingLink>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Menu mobile">
          {navigation.map((item, index) => (
            <motion.div
              key={item.href}
              initial={false}
              animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: MOTION.normal, ease: MOTION.ease, delay: menuOpen ? index * 0.035 : 0 }}
            >
              <SiteLink href={item.href} tabIndex={menuOpen ? 0 : -1}>{item.label}</SiteLink>
            </motion.div>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <BookingLink className="mobile-menu__booking">Prenota il soggiorno</BookingLink>
          <div><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
          <a href="https://www.villabarbarina.com/en/">Italiano / English</a>
        </div>
      </div>
    </>
  );
}

function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.035]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -28]);

  return (
    <section className="home-hero" ref={heroRef} aria-labelledby="home-hero-title">
      <motion.figure
        className="home-hero__media"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.05, ease: MOTION.ease }}
        style={reduceMotion ? undefined : { scale: imageScale }}
      >
        <Photo src="/images/villa/olive-grove.webp" alt="La piscina e il corpo centrale di Villa Barbarina nella campagna di Alghero" eager />
      </motion.figure>
      <motion.div
        className="home-hero__content shell"
        style={reduceMotion ? undefined : { y: copyY }}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: MOTION.ease, delay: 0.35 }}
      >
        <p className="eyebrow eyebrow--light">Alghero · Sardegna</p>
        <h1 id="home-hero-title">Relax autentico nell’anima verde della Sardegna.</h1>
        <p className="home-hero__lead">Una tenuta tra ulivi e vigne, a pochi minuti dal mare di Alghero.</p>
        <div className="hero-actions">
          <BookingLink>Prenota il soggiorno</BookingLink>
          <SiteLink className="button button--secondary button--light" href="/resort/">Scopri il resort</SiteLink>
        </div>
      </motion.div>
      <a className="home-hero__scroll" href="#intro"><span>Scopri</span><ChevronDown aria-hidden="true" size={18} /></a>
    </section>
  );
}

function PropertyFacts() {
  const facts = [
    ['23 camere', 'spaziose e luminose'],
    ['Piscina', 'aperta sul paesaggio'],
    ['Ristorante', 'cucina sarda e forno a legna'],
    ['3 km', 'dall’aeroporto di Alghero'],
  ];
  return (
    <section className="property-facts shell" aria-label="Villa Barbarina in breve">
      {facts.map(([title, detail]) => <div key={title}><strong>{title}</strong><span>{detail}</span></div>)}
    </section>
  );
}

function HomeIntroduction() {
  return (
    <>
      <section className="intro-section shell" id="intro" aria-labelledby="intro-title">
        <div className="section-kicker"><span>01</span><p>La tenuta</p></div>
        <div className="intro-section__copy">
          <h2 id="intro-title">Il ritmo quieto della campagna, vicino al mare.</h2>
          <div>
            <p>Villa Barbarina è immersa nella pianura della Nurra, tra cinque ettari di uliveti, vigne e prati. Qui l’ospitalità ha una scala intima: camere aperte sul verde, una grande piscina e una cucina legata alla terra.</p>
            <TextLink href="/resort/">Conosci Villa Barbarina</TextLink>
          </div>
        </div>
      </section>
      <div className="shell intro-landscape">
        <ImageReveal src="/images/villa/room-view.webp" alt="La piscina di Villa Barbarina vista da una terrazza privata" />
      </div>
      <PropertyFacts />
    </>
  );
}

function ResortExperience() {
  return (
    <section className="resort-experience section-space" aria-labelledby="resort-experience-title">
      <div className="shell story-grid">
        <ImageReveal className="story-grid__main" src="/images/villa/villa-exterior.webp" alt="Una camera di Villa Barbarina affacciata sul giardino" />
        <div className="story-grid__content">
          <div className="section-kicker"><span>02</span><p>Vivere la tenuta</p></div>
          <h2 id="resort-experience-title">Cinque ettari per ritrovare il proprio tempo.</h2>
          <p>La villa nasce da una storica tenuta agricola e conserva un rapporto diretto con la terra: nei materiali, nei sapori e nel silenzio che circonda ogni camera.</p>
          <TextLink href="/resort/">Scopri Villa Barbarina</TextLink>
          <ImageReveal className="story-grid__detail" src="/images/villa/pool-guest.webp" alt="Un momento di relax sul bordo della piscina" />
        </div>
      </div>
    </section>
  );
}

function RoomsExplorer({ compact = false }: { compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeRoom = rooms[activeIndex];

  return (
    <section className={`rooms-section section-space ${compact ? 'rooms-section--compact' : ''}`} aria-labelledby="rooms-title">
      <div className="shell">
        {!compact ? (
          <div className="section-heading">
            <div className="section-kicker"><span>03</span><p>Le camere</p></div>
            <div><h2 id="rooms-title">Spazio, luce e quiete.</h2><p>Quattro tipologie, tutte con il comfort essenziale e un rapporto diretto con il paesaggio.</p></div>
          </div>
        ) : <h2 className="sr-only" id="rooms-title">Le camere</h2>}
        <div className="room-tabs" role="tablist" aria-label="Scegli una camera">
          {rooms.map((room, index) => (
            <button
              key={room.slug}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? 'is-active' : ''}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>{room.menuName}
            </button>
          ))}
        </div>
        <div className="room-explorer">
          <div className="room-explorer__media">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={activeRoom.slug}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 8% 0)' }}
                animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? MOTION.fast : 0.52, ease: MOTION.ease }}
              >
                <Photo src={activeRoom.primaryImage} alt={activeRoom.imageAlt} />
              </motion.figure>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="room-explorer__content"
              key={`${activeRoom.slug}-content`}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: MOTION.normal, ease: MOTION.ease }}
            >
              <p className="eyebrow">{activeRoom.idealFor}</p>
              <h3>{activeRoom.menuName}</h3>
              <div className="room-explorer__facts"><span>{activeRoom.capacity}</span><span>{activeRoom.bed}</span></div>
              <p>{activeRoom.description}</p>
              <div className="room-explorer__actions">
                <TextLink href={activeRoom.slug}>Scopri la camera</TextLink>
                <BookingLink>Prenota</BookingLink>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="room-list-mobile">
          {rooms.map((room) => (
            <article key={room.slug}>
              <ImageReveal src={room.primaryImage} alt={room.imageAlt} />
              <div><p className="eyebrow">{room.capacity} · {room.bed}</p><h3>{room.menuName}</h3><p>{room.lead}</p><TextLink href={room.slug}>Scopri la camera</TextLink></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisualPause() {
  return (
    <section className="visual-pause shell-wide" aria-label="La piscina di Villa Barbarina vista dall’alto">
      <ImageReveal src="/images/villa/aerial.webp" alt="Vista aerea della piscina e del parco di Villa Barbarina" />
    </section>
  );
}

function RestaurantFeature() {
  return (
    <section className="restaurant-feature section-space" aria-labelledby="restaurant-feature-title">
      <div className="shell culinary-grid">
        <ImageReveal className="culinary-grid__main" src="/images/villa/crudo.webp" alt="Selezione di piatti di mare del ristorante Villa Barbarina" />
        <div className="culinary-grid__content">
          <div className="section-kicker"><span>04</span><p>Il ristorante</p></div>
          <h2 id="restaurant-feature-title">La Sardegna, servita con semplicità.</h2>
          <p>Pasta tirata a mano, carni locali, pesce del giorno, pizza cotta nel forno a legna e vini autoctoni. Una cucina sincera, legata agli ingredienti e alle stagioni.</p>
          <TextLink href="/ristorante/">Scopri il ristorante</TextLink>
          <ImageReveal className="culinary-grid__detail" src="/images/villa/grounds.webp" alt="Vino, pane e ingredienti freschi del territorio" />
        </div>
      </div>
    </section>
  );
}

function DestinationExplorer({ compact = false }: { compact?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeDestination = destinations[activeIndex];

  return (
    <section className={`destination-section section-space ${compact ? 'destination-section--compact' : ''}`} aria-labelledby="destination-title">
      <div className="shell">
        {!compact ? (
          <div className="section-heading">
            <div className="section-kicker"><span>05</span><p>Il territorio</p></div>
            <div><h2 id="destination-title">Fuori dalla tenuta, la Sardegna.</h2><p>Campagna, città e costa possono appartenere alla stessa giornata.</p></div>
          </div>
        ) : <h2 className="sr-only" id="destination-title">Itinerari in Sardegna</h2>}
        <div className="destination-explorer">
          <div className="destination-explorer__media">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={activeDestination.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? MOTION.fast : 0.5, ease: MOTION.ease }}
              >
                <Photo src={activeDestination.image} alt={activeDestination.alt} />
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="destination-explorer__list">
            {destinations.map((destination, index) => (
              <button
                key={destination.name}
                type="button"
                className={activeIndex === index ? 'is-active' : ''}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{destination.name}</strong><small>{destination.distance}</small></span>
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={activeDestination.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: MOTION.normal }}>
                {activeDestination.text}
              </motion.p>
            </AnimatePresence>
            <TextLink href="/itinerari/">Esplora gli itinerari</TextLink>
          </div>
        </div>
        <div className="destination-list-mobile">
          {destinations.map((destination, index) => (
            <article key={destination.name}>
              <ImageReveal src={destination.image} alt={destination.alt} />
              <div><span>{String(index + 1).padStart(2, '0')}</span><h3>{destination.name}</h3><small>{destination.distance}</small><p>{destination.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="location-section section-space" aria-labelledby="location-title">
      <div className="shell location-grid">
        <div>
          <p className="eyebrow">Dove siamo</p>
          <h2 id="location-title">Nella Nurra, tra Alghero e la costa.</h2>
          <p>Villa Barbarina si trova a Santa Maria La Palma, a 3 km dall’aeroporto e a circa 7 km dal centro storico di Alghero. L’auto è consigliata per esplorare liberamente spiagge e promontori.</p>
          <a className="button button--secondary" href="https://maps.google.com/?q=40.6520027,8.2817193" target="_blank" rel="noreferrer">Apri in Google Maps</a>
        </div>
        <div className="location-details">
          <MapPin aria-hidden="true" size={24} strokeWidth={1.5} />
          <div><span>Indirizzo</span><strong>{CONTACT.address}</strong></div>
          <div><span>Coordinate</span><strong>{CONTACT.coordinates}</strong></div>
          <div><span>Contatti</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
        </div>
      </div>
    </section>
  );
}

function FinalBooking({ title = 'La tua Sardegna comincia nella quiete.' }: { title?: string }) {
  return (
    <section className="final-booking shell-wide" aria-labelledby="final-booking-title">
      <Photo src="/images/villa/night-exterior.webp" alt="Villa Barbarina illuminata al tramonto" />
      <div className="final-booking__content">
        <p className="eyebrow eyebrow--light">Prenotazione diretta</p>
        <h2 id="final-booking-title">{title}</h2>
        <p>Verifica la disponibilità oppure contatta direttamente lo staff.</p>
        <div><BookingLink>Prenota il soggiorno</BookingLink><a href={`mailto:${CONTACT.email}`} className="button button--secondary button--light">Scrivici</a></div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main id="main-content">
      <HomeHero />
      <HomeIntroduction />
      <ResortExperience />
      <RoomsExplorer />
      <VisualPause />
      <RestaurantFeature />
      <DestinationExplorer />
      <LocationSection />
      <FinalBooking />
    </main>
  );
}

type PageHeroProps = { eyebrow: string; title: string; lead: string; image: string; imageAlt: string };

function PageHero({ eyebrow, title, lead, image, imageAlt }: PageHeroProps) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="page-hero" aria-labelledby="page-hero-title">
      <motion.figure initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.95, ease: MOTION.ease }}>
        <Photo src={image} alt={imageAlt} eager />
      </motion.figure>
      <motion.div className="page-hero__content shell" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.25 }}>
        <p className="eyebrow eyebrow--light">{eyebrow}</p><h1 id="page-hero-title">{title}</h1><p>{lead}</p>
      </motion.div>
    </section>
  );
}

function ResortPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Il resort" title="Una tenuta da vivere con naturalezza." lead="Cinque ettari di verde, una grande piscina e il silenzio della campagna a pochi minuti da Alghero." image="/images/villa/resort-pool.webp" imageAlt="La piscina e gli edifici di Villa Barbarina" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>La storia</p></div><div><h2>Il paesaggio è parte del soggiorno.</h2><p>Villa Barbarina nasce da una storica tenuta agricola nella pianura della Nurra. Ulivi, vigne e prati circondano camere luminose, spazi raccolti e una piscina aperta sul verde.</p></div></section>
      <section className="balanced-story shell section-space"><ImageReveal src="/images/villa/villa-exterior.webp" alt="Le camere di Villa Barbarina affacciate sul giardino" /><div><p className="eyebrow">Ospitalità</p><h2>Intima, semplice, attenta.</h2><p>La scala contenuta del resort permette di vivere gli spazi senza fretta. Le terrazze private, i materiali naturali e il rapporto diretto con lo staff rendono ogni soggiorno personale.</p><TextLink href="/camere/">Scopri le camere</TextLink></div></section>
      <PropertyFacts />
      <section className="balanced-story balanced-story--reverse shell section-space"><ImageReveal src="/images/villa/pool-guest.webp" alt="Ospite in relax sul bordo della piscina" /><div><p className="eyebrow">Il ritmo del giorno</p><h2>Dalla colazione al tramonto.</h2><p>Una mattina lenta, il prato, la piscina, una giornata sulla costa e il rientro a tavola. La posizione della tenuta lascia libertà di scegliere ogni giorno.</p><TextLink href="/itinerari/">Esplora il territorio</TextLink></div></section>
      <FinalBooking />
    </main>
  );
}

function RoomsPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Le camere" title="Camere aperte sulla quiete." lead="Spazi luminosi, arredi artigianali e terrazze private affacciate sulla tenuta." image="/images/villa/room-view.webp" imageAlt="Vista della piscina dalla terrazza di una camera" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>Scegli la camera</p></div><div><h2>Quattro tipologie, lo stesso senso di calma.</h2><p>Tutte le camere dispongono di aria condizionata, TV LCD, minibar, cassaforte e bagno privato con doccia in cristallo.</p></div></section>
      <RoomsExplorer compact />
      <FinalBooking title="Scegli lo spazio giusto per il tuo soggiorno." />
    </main>
  );
}

type GalleryImage = { src: string; alt: string };

function Gallery({ images }: { images: GalleryImage[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selected === null) return undefined;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'Tab') {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selected]);

  return (
    <>
      <div className="gallery-grid">
        {images.map((image, index) => (
          <button type="button" key={`${image.src}-${index}`} onClick={() => setSelected(index)} aria-label={`Apri immagine ${index + 1}`}>
            <Photo src={image.src} alt={image.alt} />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null ? (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Galleria fotografica" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button ref={closeButtonRef} type="button" className="lightbox__close" onClick={() => setSelected(null)} aria-label="Chiudi galleria" autoFocus><X aria-hidden="true" /></button>
            <motion.figure initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: MOTION.normal, ease: MOTION.ease }}><Photo src={images[selected].src} alt={images[selected].alt} eager /></motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function RoomHero({ room }: { room: Room }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="room-hero" aria-labelledby="room-hero-title">
      <div className="shell room-hero__grid">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.68, ease: MOTION.ease, delay: 0.15 }}>
          <p className="eyebrow">Villa Barbarina · Le camere</p>
          <h1 id="room-hero-title">{room.name}</h1>
          <p>{room.lead}</p>
          <BookingLink>Prenota questa camera</BookingLink>
        </motion.div>
        <motion.figure initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(6% 0 0 0)', scale: 1.02 }} animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)', scale: 1 }} transition={{ duration: 0.9, ease: MOTION.ease }}>
          <Photo src={room.primaryImage} alt={room.imageAlt} eager />
        </motion.figure>
      </div>
    </section>
  );
}

function RoomPage({ room }: { room: Room }) {
  const gallery = [
    { src: room.primaryImage, alt: room.imageAlt },
    { src: room.secondaryImage, alt: `Bagno della ${room.menuName}` },
    { src: '/images/villa/room-pool.webp', alt: 'Camera affacciata sulla piscina' },
    { src: '/images/villa/terrace-aperitivo.webp', alt: 'Terrazza privata affacciata sul verde' },
  ];
  return (
    <main id="main-content">
      <RoomHero room={room} />
      <section className="room-summary shell"><div><span>Ospiti</span><strong>{room.capacity}</strong></div><div><span>Letto</span><strong>{room.bed}</strong></div><div><span>Ideale per</span><strong>{room.idealFor}</strong></div><BookingLink>Prenota questa camera</BookingLink></section>
      <section className="room-overview shell section-space"><div><p className="eyebrow">La camera</p><h2>{room.lead}</h2><p>{room.description}</p><p>{room.detail}</p><BookingLink>Verifica disponibilità</BookingLink></div><ImageReveal src={room.secondaryImage} alt={`Bagno e dettagli della ${room.menuName}`} /></section>
      <section className="amenities shell section-space" aria-labelledby="amenities-title"><div><p className="eyebrow">Comfort</p><h2 id="amenities-title">Tutto ciò che serve.</h2></div><ul>{room.features.map((feature) => <li key={feature}><span aria-hidden="true" />{feature}</li>)}</ul></section>
      <section className="room-gallery shell section-space" aria-labelledby="gallery-title"><div className="section-heading"><div className="section-kicker"><span>02</span><p>Galleria</p></div><div><h2 id="gallery-title">Guarda la camera.</h2><p>Spazi, dettagli e il rapporto con l’esterno.</p></div></div><Gallery images={gallery} /></section>
      <section className="next-rooms shell"><p>Scopri anche</p>{rooms.filter((candidate) => candidate.slug !== room.slug).map((candidate) => <SiteLink href={candidate.slug} key={candidate.slug}>{candidate.menuName}<ArrowRight aria-hidden="true" size={18} /></SiteLink>)}</section>
      <FinalBooking />
    </main>
  );
}

function RestaurantPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Il ristorante" title="La cucina sarda, nel luogo da cui nasce." lead="Ingredienti freschi, ricette della tradizione, pizza nel forno a legna e vini del territorio." image="/images/villa/crudo.webp" imageAlt="Piatto di mare del ristorante Villa Barbarina" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>La tavola</p></div><div><h2>Sapori riconoscibili, ingredienti scelti.</h2><p>Il ristorante accompagna il soggiorno con una cucina semplice e generosa: pasta fatta a mano, carni locali, pesce del giorno e specialità preparate nel forno a legna.</p></div></section>
      <section className="balanced-story shell section-space"><ImageReveal src="/images/villa/grounds.webp" alt="Vino, pane e ingredienti freschi" /><div><p className="eyebrow">Il territorio nel piatto</p><h2>La materia prima viene prima di tutto.</h2><p>Le ricette sarde incontrano prodotti stagionali, vini autoctoni e una sala affacciata sul verde della tenuta.</p><a className="button button--secondary" href={`mailto:${CONTACT.email}`}>Contatta il ristorante</a></div></section>
      <section className="food-gallery shell"><ImageReveal src="/images/villa/pizza.webp" alt="Pizza cotta nel forno a legna" /><ImageReveal src="/images/villa/wines.webp" alt="Selezione di vini del territorio" /><ImageReveal src="/images/villa/breakfast.webp" alt="Colazione di Villa Barbarina" /></section>
      <section className="practical-strip shell"><div><span>Colazione</span><strong>Ogni mattina per gli ospiti</strong></div><div><span>Cucina</span><strong>Tradizione sarda e forno a legna</strong></div><div><span>Informazioni</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a></div></section>
      <FinalBooking title="Il soggiorno continua a tavola." />
    </main>
  );
}

function ItinerariesPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Il territorio" title="Ogni strada parte dalla Nurra." lead="Mare, scogliere, torri e città: paesaggi diversi a pochi chilometri dalla tenuta." image="/images/villa/capo-caccia.webp" imageAlt="Le scogliere e la torre di Capo Caccia" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>Esplorare</p></div><div><h2>Una posizione, molte Sardegne.</h2><p>Dal centro storico di Alghero alle spiagge della Riviera del Corallo, Villa Barbarina è un punto di partenza tranquillo per giornate sempre diverse.</p></div></section>
      <DestinationExplorer compact />
      <LocationSection />
      <FinalBooking />
    </main>
  );
}

function ExtrasPage() {
  const services = [
    ['Arrivare', 'Informazioni e transfer su richiesta.'],
    ['Celebrare', 'Matrimoni, eventi privati e incontri aziendali.'],
    ['Esplorare', 'Indicazioni per spiagge, città ed esperienze nel territorio.'],
  ];
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Servizi" title="Un soggiorno costruito intorno a te." lead="Transfer, momenti speciali ed esperienze vengono organizzati su richiesta insieme allo staff." image="/images/villa/terrace-aperitivo.webp" imageAlt="Aperitivo su una terrazza di Villa Barbarina" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>Su richiesta</p></div><div><h2>Raccontaci cosa vuoi vivere.</h2><p>La disponibilità dei servizi varia in base al periodo e al tipo di soggiorno. Lo staff può aiutarti senza trasformare la vacanza in un pacchetto predefinito.</p></div></section>
      <section className="service-ledger shell">{services.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{title}</h2><p>{copy}</p></article>)}</section>
      <section className="marketplace shell section-space" aria-labelledby="marketplace-title"><div><p className="eyebrow">Catalogo esperienze</p><h2 id="marketplace-title">Consulta le proposte disponibili.</h2><p>Apri il marketplace ufficiale Villa Barbarina e contatta lo staff per organizzare i dettagli.</p><a className="button button--primary" href={SMARTNESS_URL} target="_blank" rel="noreferrer">Apri il marketplace <ArrowRight aria-hidden="true" size={17} /></a></div><iframe src={SMARTNESS_URL} title="Marketplace esperienze Villa Barbarina" loading="lazy" /></section>
      <FinalBooking />
    </main>
  );
}

function InquiryForm() {
  const [submitting, setSubmitting] = useState(false);
  const [childrenCount, setChildrenCount] = useState(0);
  const [today] = useState(() => new Date().toISOString().slice(0, 10));
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
      <button className="button button--primary form-submit" type="submit" disabled={submitting}>{submitting ? 'Apertura in corso…' : 'Invia la richiesta'}<ArrowRight aria-hidden="true" size={17} /></button>
      <p className="form-note">L’invio apre la conferma del sito ufficiale in una nuova scheda.</p>
    </form>
  );
}

function ContactPage() {
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Contatti" title="Siamo qui per aiutarti a partire." lead="Disponibilità, soggiorni personalizzati, ristorante e richieste speciali: parla direttamente con lo staff." image="/images/villa/room-pool.webp" imageAlt="Camera di Villa Barbarina affacciata sulla piscina" />
      <section className="contact-ledger shell"><a href={CONTACT.phoneHref}><Phone aria-hidden="true" /><span>Telefono</span><strong>{CONTACT.phoneLabel}</strong></a><a href={`mailto:${CONTACT.email}`}><Mail aria-hidden="true" /><span>Email</span><strong>{CONTACT.email}</strong></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /><span>WhatsApp</span><strong>331 410 6025</strong></a><a href="https://maps.google.com/?q=40.6520027,8.2817193" target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /><span>Come arrivare</span><strong>Apri la mappa</strong></a></section>
      <section className="contact-workspace shell section-space"><div><p className="eyebrow">Richiesta diretta</p><h2>Raccontaci il soggiorno.</h2><InquiryForm /></div><aside aria-labelledby="faq-title"><p className="eyebrow">Informazioni utili</p><h2 id="faq-title">Prima di partire.</h2><div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary><span>{faq.question}</span><ChevronDown aria-hidden="true" size={18} /></summary><p>{faq.answer}</p></details>)}</div></aside></section>
    </main>
  );
}

function NotFoundPage() {
  return <main id="main-content" className="not-found"><p className="eyebrow">404</p><h1>Questa pagina non conduce alla tenuta.</h1><SiteLink className="button button--primary" href="/">Torna alla home</SiteLink></main>;
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand"><SiteLink href="/" className="wordmark wordmark--footer"><span>Villa</span><strong>Barbarina</strong><small>Nature Resort · Alghero</small></SiteLink><p>Una tenuta nella campagna di Alghero, tra ulivi, vigne e il mare della Sardegna.</p><BookingLink>Prenota il soggiorno</BookingLink></div>
        <nav aria-label="Navigazione piè di pagina">{navigation.map((item) => <SiteLink key={item.href} href={item.href}>{item.label}</SiteLink>)}</nav>
        <address><span>{CONTACT.address}</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a><a href="https://www.villabarbarina.com/en/">IT / EN</a></address>
      </div>
      <div className="shell footer-legal"><span>© {new Date().getFullYear()} {LEGAL.company}</span><span>P.IVA / CF {LEGAL.vat} · REA {LEGAL.rea}</span><span>CIR {LEGAL.cir} · CIN {LEGAL.cin}</span><a href="https://www.villabarbarina.com/servizi/privacy-policy-29" target="_blank" rel="noreferrer">Privacy</a><a href="https://www.villabarbarina.com/servizi/cookie-policy-31" target="_blank" rel="noreferrer">Cookie</a></div>
    </footer>
  );
}

function MobileDock() {
  return <nav className="mobile-dock" aria-label="Contatti rapidi"><a href={CONTACT.phoneHref}><Phone aria-hidden="true" size={17} /><span>Chiama</span></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={17} /><span>WhatsApp</span></a><a href={BOOKING_URL} target="_blank" rel="noreferrer"><ArrowRight aria-hidden="true" size={17} /><span>Prenota</span></a></nav>;
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
  const page = resolvePage(pathname);

  useEffect(() => {
    const room = rooms.find((candidate) => candidate.slug === pathname);
    const meta = room
      ? { title: `${room.menuName} | Villa Barbarina Nature Resort`, description: room.description }
      : pageMeta[pathname] ?? { title: 'Pagina non trovata | Villa Barbarina', description: 'La pagina richiesta non è disponibile.' };
    document.title = meta.title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', meta.description);
    document.body.dataset.route = pathname === '/' ? 'home' : 'inner';
  }, [pathname]);

  return (
    <>
      <Header pathname={pathname} />
      <motion.div id="app-content" key={pathname} initial={{ opacity: 0.985 }} animate={{ opacity: 1 }} transition={{ duration: MOTION.fast }}>{page}</motion.div>
      <Footer />
      <MobileDock />
    </>
  );
}
