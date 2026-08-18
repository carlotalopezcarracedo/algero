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
  createContext,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useContext,
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
  type Room,
  WHATSAPP_URL,
} from './data';
import { translate, type Locale } from './translations';

const BASE_PATH = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const MOTION = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  fast: 0.22,
  normal: 0.42,
  slow: 0.85,
};

type LanguageContextValue = {
  locale: Locale;
  t: (value: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'it',
  t: (value) => value,
});

function useLanguage() {
  return useContext(LanguageContext);
}

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

function localeFromLocation(): Locale {
  return new URLSearchParams(window.location.search).get('lang') === 'en' ? 'en' : 'it';
}

function useLocale() {
  const [locale, setLocale] = useState<Locale>(localeFromLocation);

  useEffect(() => {
    const onPopState = () => setLocale(localeFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return locale;
}

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

function SiteLink({ href, onClick, children, ...props }: SiteLinkProps) {
  const { locale } = useLanguage();
  const isInternal = href.startsWith('/');
  const localeQuery = locale === 'en' ? '?lang=en' : '';
  const resolvedHref = isInternal ? `${browserPathForRoute(href)}${localeQuery}` : href;

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
      window.history.pushState({}, '', `${browserPathForRoute(nextPath)}${localeQuery}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return <a href={resolvedHref} onClick={handleClick} {...props}>{children}</a>;
}

function BookingLink({ children, className = '' }: { children?: ReactNode; className?: string }) {
  const { t } = useLanguage();
  const label = typeof children === 'string' ? t(children) : children ?? t('Prenota');
  return (
    <a className={`button button--primary ${className}`.trim()} href={BOOKING_URL} target="_blank" rel="noreferrer">
      <span>{label}</span><ArrowRight aria-hidden="true" size={17} />
    </a>
  );
}

function TextLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  const { t } = useLanguage();
  const label = typeof children === 'string' ? t(children) : children;
  return (
    <SiteLink className={`text-link ${light ? 'text-link--light' : ''}`} href={href}>
      <span>{label}</span><ArrowRight aria-hidden="true" size={17} />
    </SiteLink>
  );
}

function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { locale } = useLanguage();
  const pathname = browserPathForRoute(routeFromLocation(window.location.pathname));

  const handleLanguage = (event: MouseEvent<HTMLAnchorElement>, nextLocale: Locale) => {
    event.preventDefault();
    const nextUrl = `${pathname}${nextLocale === 'en' ? '?lang=en' : ''}`;
    window.history.pushState({}, '', nextUrl);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className={`language-switch ${compact ? 'language-switch--compact' : ''}`} role="group" aria-label="Language">
      <a href={pathname} lang="it" aria-current={locale === 'it' ? 'true' : undefined} onClick={(event) => handleLanguage(event, 'it')}>IT</a>
      <span aria-hidden="true">/</span>
      <a href={`${pathname}?lang=en`} lang="en" aria-current={locale === 'en' ? 'true' : undefined} onClick={(event) => handleLanguage(event, 'en')}>EN</a>
    </div>
  );
}

type PhotoProps = { src: string; alt: string; className?: string; eager?: boolean; sizes?: string };

const compactImageWidths: Record<string, number> = {
  'aerial.webp': 1096,
  'alghero.webp': 1096,
  'capo-caccia.webp': 1096,
  'le-bombarde.webp': 1096,
  'night-exterior.webp': 1024,
  'porticciolo.webp': 1096,
  'resort-pool.webp': 1170,
};

function Photo({
  src,
  alt,
  className = '',
  eager = false,
  sizes = '(max-width: 720px) 100vw, (max-width: 1280px) 82vw, 1280px',
}: PhotoProps) {
  const isResponsive = src.endsWith('.webp');
  const originalWidth = compactImageWidths[src.split('/').pop() ?? ''] ?? 2048;
  const responsiveSources = isResponsive
    ? [
        `${publicAssetPath(src.replace(/\.webp$/, '-720.webp'))} 720w`,
        ...(originalWidth > 1280 ? [`${publicAssetPath(src.replace(/\.webp$/, '-1280.webp'))} 1280w`] : []),
        `${publicAssetPath(src)} ${originalWidth}w`,
      ].join(', ')
    : undefined;
  return (
    <img
      className={className}
      src={publicAssetPath(src)}
      srcSet={responsiveSources}
      sizes={isResponsive ? sizes : undefined}
      alt={alt}
      width="2048"
      height="1536"
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

function ImageReveal({ src, alt, className = '', eager = false, sizes }: PhotoProps) {
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
        <Photo src={src} alt={alt} eager={eager} sizes={sizes} />
      </motion.div>
    </motion.figure>
  );
}

function BotanicalMotif({ className = '' }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`botanical-motif ${className}`.trim()}
      aria-hidden="true"
      initial={reduceMotion ? false : { opacity: 0, rotate: -3 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: MOTION.slow, ease: MOTION.ease }}
    >
      <svg viewBox="0 0 220 126" fill="none">
        <motion.path
          d="M19 108C52 96 77 74 96 47C108 30 126 19 151 14"
          initial={reduceMotion ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.35, ease: MOTION.ease }}
        />
        <motion.path d="M83 65C66 59 52 62 42 74C58 79 72 76 83 65ZM103 39C91 27 78 22 63 25C72 40 86 45 103 39ZM123 25C124 10 134 2 151 2C150 15 141 23 123 25ZM93 51C111 49 124 55 132 69C115 72 102 66 93 51ZM68 79C82 80 91 88 95 102C80 101 71 93 68 79Z" />
        <circle cx="151" cy="14" r="4" />
      </svg>
    </motion.div>
  );
}

function RevealBlock({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.62, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}

function BrandLogo({ footer = false }: { footer?: boolean }) {
  const { t } = useLanguage();
  return (
    <SiteLink href="/" className={`brand-logo ${footer ? 'brand-logo--footer' : ''}`} aria-label={t('Villa Barbarina, home')}>
      <img
        src={publicAssetPath('/images/villa/logo-bianco.png')}
        alt="Villa Barbarina Hotel & Restaurant"
        width="527"
        height="118"
        loading={footer ? 'lazy' : 'eager'}
        decoding="async"
      />
    </SiteLink>
  );
}

function Header({ pathname }: { pathname: string }) {
  const { locale, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hasLightHero = rooms.some((room) => room.slug === pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [locale, pathname]);

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
      <a className="skip-link" href="#main-content">{t('Vai al contenuto')}</a>
      <header className={`site-header ${scrolled ? 'is-scrolled' : 'is-at-top'} ${hasLightHero ? 'has-light-hero' : ''} ${menuOpen ? 'is-menu-open' : ''}`}>
        <BrandLogo />
        <nav className="desktop-nav" aria-label={t('Navigazione principale')}>
          {navigation.map((item) => (
            <SiteLink key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
              {t(item.label)}
            </SiteLink>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageSwitch compact />
          <BookingLink className="header-booking">Prenota</BookingLink>
          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={t(menuOpen ? 'Chiudi il menu' : 'Apri il menu')}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label={t('Menu mobile')}>
          {navigation.map((item, index) => (
            <motion.div
              key={item.href}
              initial={false}
              animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: MOTION.normal, ease: MOTION.ease, delay: menuOpen ? index * 0.035 : 0 }}
            >
              <SiteLink href={item.href} tabIndex={menuOpen ? 0 : -1}>{t(item.label)}</SiteLink>
            </motion.div>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <BookingLink className="mobile-menu__booking">Prenota il soggiorno</BookingLink>
          <div><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
          <LanguageSwitch />
        </div>
      </div>
    </>
  );
}

function HomeHero() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.035]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const heroPoster = publicAssetPath(window.matchMedia('(max-width: 720px)').matches
    ? '/images/villa/olive-grove-720.webp'
    : '/images/villa/olive-grove-1280.webp');

  return (
    <section className="home-hero" ref={heroRef} aria-labelledby="home-hero-title">
      <motion.figure
        className="home-hero__media"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.05, ease: MOTION.ease }}
        style={reduceMotion ? undefined : { scale: imageScale }}
      >
        {reduceMotion ? (
          <Photo src="/images/villa/olive-grove.webp" alt={t('La piscina e il corpo centrale di Villa Barbarina nella campagna di Alghero')} eager />
        ) : (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroPoster}
            aria-hidden="true"
          >
            <source src={publicAssetPath('/images/villa/villa-barbarina-hero.mp4')} type="video/mp4" />
          </video>
        )}
      </motion.figure>
      <motion.div
        className="home-hero__content shell"
        style={reduceMotion ? undefined : { y: copyY }}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, ease: MOTION.ease, delay: 0.35 }}
      >
        <p className="eyebrow eyebrow--light">{t('Alghero · Sardegna')}</p>
        <h1 id="home-hero-title">{t('Relax autentico nell’anima verde della Sardegna.')}</h1>
        <p className="home-hero__lead">{t('Una tenuta tra ulivi e vigne, a pochi minuti dal mare di Alghero.')}</p>
        <div className="hero-actions">
          <BookingLink>Prenota il soggiorno</BookingLink>
          <SiteLink className="button button--secondary button--light" href="/resort/">{t('Scopri il resort')}</SiteLink>
        </div>
      </motion.div>
      <motion.div
        className="home-hero__coordinates"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: MOTION.slow, ease: MOTION.ease, delay: 0.7 }}
      >
        <span>40°39' N</span><i /><span>8°16' E</span>
      </motion.div>
      <a className="home-hero__scroll" href="#intro"><span>{t('Scopri')}</span><ChevronDown aria-hidden="true" size={18} /></a>
    </section>
  );
}

function PropertyFacts() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const facts = [
    ['23 camere', 'spaziose e luminose'],
    ['Piscina', 'aperta sul paesaggio'],
    ['Ristorante', 'cucina sarda e forno a legna'],
    ['3 km', 'dall’aeroporto di Alghero'],
  ];
  return (
    <section className="property-facts shell" aria-label={t('Villa Barbarina in breve')}>
      {facts.map(([title, detail], index) => <motion.div key={title} initial={reduceMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.55 }} transition={{ duration: MOTION.normal, ease: MOTION.ease, delay: reduceMotion ? 0 : index * 0.055 }}><strong>{t(title)}</strong><span>{t(detail)}</span></motion.div>)}
    </section>
  );
}

function HomeIntroduction() {
  const { t } = useLanguage();
  return (
    <>
      <section className="intro-section shell" id="intro" aria-labelledby="intro-title">
        <div className="section-kicker"><span>01</span><p>{t('La tenuta')}</p></div>
        <BotanicalMotif className="intro-section__motif" />
        <RevealBlock className="intro-section__copy">
          <h2 id="intro-title">{t('Il ritmo quieto della campagna, vicino al mare.')}</h2>
          <div>
            <p>{t('Villa Barbarina è immersa nella pianura della Nurra, tra cinque ettari di uliveti, vigne e prati. Qui l’ospitalità ha una scala intima: camere aperte sul verde, una grande piscina e una cucina legata alla terra.')}</p>
            <TextLink href="/resort/">Conosci Villa Barbarina</TextLink>
          </div>
        </RevealBlock>
      </section>
      <div className="shell intro-landscape">
        <ImageReveal src="/images/villa/room-view.webp" alt={t('La piscina di Villa Barbarina vista da una terrazza privata')} />
      </div>
      <PropertyFacts />
    </>
  );
}

function ResortExperience() {
  const { t } = useLanguage();
  return (
    <section className="resort-experience section-space" data-chapter="02" aria-labelledby="resort-experience-title">
      <div className="shell story-grid">
        <ImageReveal className="story-grid__main" src="/images/villa/villa-exterior.webp" alt={t('Una camera di Villa Barbarina affacciata sul giardino')} />
        <RevealBlock className="story-grid__content">
          <div className="section-kicker"><span>02</span><p>{t('Vivere la tenuta')}</p></div>
          <h2 id="resort-experience-title">{t('Cinque ettari per ritrovare il proprio tempo.')}</h2>
          <p>{t('La villa nasce da una storica tenuta agricola e conserva un rapporto diretto con la terra: nei materiali, nei sapori e nel silenzio che circonda ogni camera.')}</p>
          <TextLink href="/resort/">Scopri Villa Barbarina</TextLink>
          <ImageReveal className="story-grid__detail" src="/images/villa/pool-guest.webp" alt={t('Un momento di relax sul bordo della piscina')} />
        </RevealBlock>
      </div>
    </section>
  );
}

function RoomsExplorer({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeRoom = rooms[activeIndex];

  return (
    <section className={`rooms-section section-space ${compact ? 'rooms-section--compact' : ''}`} data-chapter={compact ? undefined : '03'} aria-labelledby="rooms-title">
      <div className="shell">
        {!compact ? (
          <div className="section-heading">
            <div className="section-kicker"><span>03</span><p>{t('Le camere')}</p></div>
            <div><h2 id="rooms-title">{t('Spazio, luce e quiete.')}</h2><p>{t('Quattro tipologie, tutte con il comfort essenziale e un rapporto diretto con il paesaggio.')}</p></div>
          </div>
        ) : <h2 className="sr-only" id="rooms-title">{t('Le camere')}</h2>}
        <div className="room-tabs" role="tablist" aria-label={t('Scegli una camera')}>
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
              <span>{String(index + 1).padStart(2, '0')}</span>{t(room.menuName)}
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
                <Photo src={activeRoom.primaryImage} alt={t(activeRoom.imageAlt)} />
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
              <p className="eyebrow">{t(activeRoom.idealFor)}</p>
              <h3>{t(activeRoom.menuName)}</h3>
              <div className="room-explorer__facts"><span>{t(activeRoom.capacity)}</span><span>{t(activeRoom.bed)}</span></div>
              <p>{t(activeRoom.description)}</p>
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
              <ImageReveal src={room.primaryImage} alt={t(room.imageAlt)} />
              <div><p className="eyebrow">{t(room.capacity)} · {t(room.bed)}</p><h3>{t(room.menuName)}</h3><p>{t(room.lead)}</p><TextLink href={room.slug}>Scopri la camera</TextLink></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisualPause() {
  const { t } = useLanguage();
  return (
    <section className="visual-pause shell-wide" aria-label={t('La piscina di Villa Barbarina vista dall’alto')}>
      <ImageReveal src="/images/villa/aerial.webp" alt={t('Vista aerea della piscina e del parco di Villa Barbarina')} />
    </section>
  );
}

function RestaurantFeature() {
  const { t } = useLanguage();
  return (
    <section className="restaurant-feature section-space" data-chapter="04" aria-labelledby="restaurant-feature-title">
      <div className="shell culinary-grid">
        <ImageReveal className="culinary-grid__main" src="/images/villa/crudo.webp" alt={t('Selezione di piatti di mare del ristorante Villa Barbarina')} />
        <RevealBlock className="culinary-grid__content">
          <div className="section-kicker"><span>04</span><p>{t('Il ristorante')}</p></div>
          <h2 id="restaurant-feature-title">{t('La Sardegna, servita con semplicità.')}</h2>
          <p>{t('Pasta tirata a mano, carni locali, pesce del giorno, pizza cotta nel forno a legna e vini autoctoni. Una cucina sincera, legata agli ingredienti e alle stagioni.')}</p>
          <TextLink href="/ristorante/">Scopri il ristorante</TextLink>
          <ImageReveal className="culinary-grid__detail" src="/images/villa/grounds.webp" alt={t('Vino, pane e ingredienti freschi del territorio')} />
        </RevealBlock>
      </div>
    </section>
  );
}

function DestinationExplorer({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeDestination = destinations[activeIndex];

  return (
    <section className={`destination-section section-space ${compact ? 'destination-section--compact' : ''}`} data-chapter={compact ? undefined : '05'} aria-labelledby="destination-title">
      <div className="shell">
        {!compact ? (
          <div className="section-heading">
            <div className="section-kicker"><span>05</span><p>{t('Il territorio')}</p></div>
            <div><h2 id="destination-title">{t('Fuori dalla tenuta, la Sardegna.')}</h2><p>{t('Campagna, città e costa possono appartenere alla stessa giornata.')}</p></div>
          </div>
        ) : <h2 className="sr-only" id="destination-title">{t('Itinerari in Sardegna')}</h2>}
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
                <Photo src={activeDestination.image} alt={t(activeDestination.alt)} />
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
                <span><strong>{destination.name}</strong><small>{t(destination.distance)}</small></span>
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            ))}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p key={activeDestination.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: MOTION.normal }}>
                {t(activeDestination.text)}
              </motion.p>
            </AnimatePresence>
            <TextLink href="/itinerari/">Esplora gli itinerari</TextLink>
          </div>
        </div>
        <div className="destination-list-mobile">
          {destinations.map((destination, index) => (
            <article key={destination.name}>
              <ImageReveal src={destination.image} alt={t(destination.alt)} />
              <div><span>{String(index + 1).padStart(2, '0')}</span><h3>{destination.name}</h3><small>{t(destination.distance)}</small><p>{t(destination.text)}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection() {
  const { t } = useLanguage();
  return (
    <section className="location-section section-space" aria-labelledby="location-title">
      <div className="shell location-grid">
        <div>
          <p className="eyebrow">{t('Dove siamo')}</p>
          <h2 id="location-title">{t('Nella Nurra, tra Alghero e la costa.')}</h2>
          <p>{t('Villa Barbarina si trova a Santa Maria La Palma, a 3 km dall’aeroporto e a circa 7 km dal centro storico di Alghero. L’auto è consigliata per esplorare liberamente spiagge e promontori.')}</p>
          <a className="button button--secondary" href="https://maps.google.com/?q=40.6520027,8.2817193" target="_blank" rel="noreferrer">{t('Apri in Google Maps')}</a>
        </div>
        <div className="location-details">
          <MapPin aria-hidden="true" size={24} strokeWidth={1.5} />
          <div><span>{t('Indirizzo')}</span><strong>{CONTACT.address}</strong></div>
          <div><span>{t('Coordinate')}</span><strong>{CONTACT.coordinates}</strong></div>
          <div><span>{t('Contatti')}</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
        </div>
      </div>
    </section>
  );
}

function FinalBooking({ title = 'La tua Sardegna comincia nella quiete.' }: { title?: string }) {
  const { t } = useLanguage();
  return (
    <section className="final-booking shell-wide" aria-labelledby="final-booking-title">
      <Photo src="/images/villa/night-exterior.webp" alt={t('Villa Barbarina illuminata al tramonto')} />
      <div className="final-booking__content">
        <p className="eyebrow eyebrow--light">{t('Prenotazione diretta')}</p>
        <h2 id="final-booking-title">{t(title)}</h2>
        <p>{t('Verifica la disponibilità oppure contatta direttamente lo staff.')}</p>
        <div><BookingLink>Prenota il soggiorno</BookingLink><a href={`mailto:${CONTACT.email}`} className="button button--secondary button--light">{t('Scrivici')}</a></div>
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
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  return (
    <section className="page-hero" aria-labelledby="page-hero-title">
      <motion.figure initial={reduceMotion ? false : { opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.95, ease: MOTION.ease }}>
        <Photo src={image} alt={t(imageAlt)} eager />
      </motion.figure>
      <motion.div className="page-hero__content shell" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: MOTION.ease, delay: 0.25 }}>
        <p className="eyebrow eyebrow--light">{t(eyebrow)}</p><h1 id="page-hero-title">{t(title)}</h1><p>{t(lead)}</p>
      </motion.div>
    </section>
  );
}

function ResortPage() {
  const { t } = useLanguage();
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Il resort" title="Una tenuta da vivere con naturalezza." lead="Cinque ettari di verde, una grande piscina e il silenzio della campagna a pochi minuti da Alghero." image="/images/villa/resort-pool.webp" imageAlt="La piscina e gli edifici di Villa Barbarina" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>{t('La storia')}</p></div><div><h2>{t('Il paesaggio è parte del soggiorno.')}</h2><p>{t('Villa Barbarina nasce da una storica tenuta agricola nella pianura della Nurra. Ulivi, vigne e prati circondano camere luminose, spazi raccolti e una piscina aperta sul verde.')}</p></div></section>
      <section className="balanced-story shell section-space"><ImageReveal src="/images/villa/villa-exterior.webp" alt={t('Le camere di Villa Barbarina affacciate sul giardino')} /><div><p className="eyebrow">{t('Ospitalità')}</p><h2>{t('Intima, semplice, attenta.')}</h2><p>{t('La scala contenuta del resort permette di vivere gli spazi senza fretta. Le terrazze private, i materiali naturali e il rapporto diretto con lo staff rendono ogni soggiorno personale.')}</p><TextLink href="/camere/">Scopri le camere</TextLink></div></section>
      <PropertyFacts />
      <section className="balanced-story balanced-story--reverse shell section-space"><ImageReveal src="/images/villa/pool-guest.webp" alt={t('Ospite in relax sul bordo della piscina')} /><div><p className="eyebrow">{t('Il ritmo del giorno')}</p><h2>{t('Dalla colazione al tramonto.')}</h2><p>{t('Una mattina lenta, il prato, la piscina, una giornata sulla costa e il rientro a tavola. La posizione della tenuta lascia libertà di scegliere ogni giorno.')}</p><TextLink href="/itinerari/">Esplora il territorio</TextLink></div></section>
      <FinalBooking />
    </main>
  );
}

function RoomsPage() {
  const { t } = useLanguage();
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Le camere" title="Camere aperte sulla quiete." lead="Spazi luminosi, arredi artigianali e terrazze private affacciate sulla tenuta." image="/images/villa/room-view.webp" imageAlt="Vista della piscina dalla terrazza di una camera" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>{t('Scegli la camera')}</p></div><div><h2>{t('Quattro tipologie, lo stesso senso di calma.')}</h2><p>{t('Tutte le camere dispongono di aria condizionata, TV LCD, minibar, cassaforte e bagno privato con doccia in cristallo.')}</p></div></section>
      <RoomsExplorer compact />
      <FinalBooking title="Scegli lo spazio giusto per il tuo soggiorno." />
    </main>
  );
}

type GalleryImage = { src: string; alt: string };

function Gallery({ images }: { images: GalleryImage[] }) {
  const { locale, t } = useLanguage();
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
          <button type="button" key={`${image.src}-${index}`} onClick={() => setSelected(index)} aria-label={locale === 'en' ? `Open image ${index + 1}` : `Apri immagine ${index + 1}`}>
            <Photo src={image.src} alt={image.alt} />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null ? (
          <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={t('Galleria fotografica')} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button ref={closeButtonRef} type="button" className="lightbox__close" onClick={() => setSelected(null)} aria-label={t('Chiudi galleria')} autoFocus><X aria-hidden="true" /></button>
            <motion.figure initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: MOTION.normal, ease: MOTION.ease }}><Photo src={images[selected].src} alt={images[selected].alt} eager /></motion.figure>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function RoomHero({ room }: { room: Room }) {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  return (
    <section className="room-hero" aria-labelledby="room-hero-title">
      <div className="shell room-hero__grid">
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.68, ease: MOTION.ease, delay: 0.15 }}>
          <p className="eyebrow">{t('Villa Barbarina · Le camere')}</p>
          <h1 id="room-hero-title">{t(room.name)}</h1>
          <p>{t(room.lead)}</p>
          <BookingLink>Prenota questa camera</BookingLink>
        </motion.div>
        <motion.figure initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(6% 0 0 0)', scale: 1.02 }} animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)', scale: 1 }} transition={{ duration: 0.9, ease: MOTION.ease }}>
          <Photo src={room.primaryImage} alt={t(room.imageAlt)} eager />
        </motion.figure>
      </div>
    </section>
  );
}

function RoomPage({ room }: { room: Room }) {
  const { locale, t } = useLanguage();
  const gallery = [
    { src: room.primaryImage, alt: t(room.imageAlt) },
    { src: room.secondaryImage, alt: locale === 'en' ? `Bathroom in the ${t(room.menuName)}` : `Bagno della ${room.menuName}` },
    { src: '/images/villa/room-pool.webp', alt: t('Camera affacciata sulla piscina') },
    { src: '/images/villa/terrace-aperitivo.webp', alt: t('Terrazza privata affacciata sul verde') },
  ];
  return (
    <main id="main-content">
      <RoomHero room={room} />
      <section className="room-summary shell"><div><span>{t('Ospiti')}</span><strong>{t(room.capacity)}</strong></div><div><span>{t('Letto')}</span><strong>{t(room.bed)}</strong></div><div><span>{t('Ideale per')}</span><strong>{t(room.idealFor)}</strong></div><BookingLink>Prenota questa camera</BookingLink></section>
      <section className="room-overview shell section-space"><div><p className="eyebrow">{t('La camera')}</p><h2>{t(room.lead)}</h2><p>{t(room.description)}</p><p>{t(room.detail)}</p><BookingLink>Verifica disponibilità</BookingLink></div><ImageReveal src={room.secondaryImage} alt={locale === 'en' ? `Bathroom and details in the ${t(room.menuName)}` : `Bagno e dettagli della ${room.menuName}`} /></section>
      <section className="amenities shell section-space" aria-labelledby="amenities-title"><div><p className="eyebrow">{t('Comfort')}</p><h2 id="amenities-title">{t('Tutto ciò che serve.')}</h2></div><ul>{room.features.map((feature) => <li key={feature}><span aria-hidden="true" />{t(feature)}</li>)}</ul></section>
      <section className="room-gallery shell section-space" aria-labelledby="gallery-title"><div className="section-heading"><div className="section-kicker"><span>02</span><p>{t('Galleria')}</p></div><div><h2 id="gallery-title">{t('Guarda la camera.')}</h2><p>{t('Spazi, dettagli e il rapporto con l’esterno.')}</p></div></div><Gallery images={gallery} /></section>
      <section className="next-rooms shell"><p>{t('Scopri anche')}</p>{rooms.filter((candidate) => candidate.slug !== room.slug).map((candidate) => <SiteLink href={candidate.slug} key={candidate.slug}>{t(candidate.menuName)}<ArrowRight aria-hidden="true" size={18} /></SiteLink>)}</section>
      <FinalBooking />
    </main>
  );
}

function RestaurantPage() {
  const { t } = useLanguage();
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Il ristorante" title="La cucina sarda, nel luogo da cui nasce." lead="Ingredienti freschi, ricette della tradizione, pizza nel forno a legna e vini del territorio." image="/images/villa/crudo.webp" imageAlt="Piatto di mare del ristorante Villa Barbarina" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>{t('La tavola')}</p></div><div><h2>{t('Sapori riconoscibili, ingredienti scelti.')}</h2><p>{t('Il ristorante accompagna il soggiorno con una cucina semplice e generosa: pasta fatta a mano, carni locali, pesce del giorno e specialità preparate nel forno a legna.')}</p></div></section>
      <section className="balanced-story shell section-space"><ImageReveal src="/images/villa/grounds.webp" alt={t('Vino, pane e ingredienti freschi')} /><div><p className="eyebrow">{t('Il territorio nel piatto')}</p><h2>{t('La materia prima viene prima di tutto.')}</h2><p>{t('Le ricette sarde incontrano prodotti stagionali, vini autoctoni e una sala affacciata sul verde della tenuta.')}</p><a className="button button--secondary" href={`mailto:${CONTACT.email}`}>{t('Contatta il ristorante')}</a></div></section>
      <section className="food-gallery shell"><ImageReveal src="/images/villa/pizza.webp" alt={t('Pizza cotta nel forno a legna')} /><ImageReveal src="/images/villa/wines.webp" alt={t('Selezione di vini del territorio')} /><ImageReveal src="/images/villa/breakfast.webp" alt={t('Colazione di Villa Barbarina')} /></section>
      <section className="practical-strip shell"><div><span>{t('Colazione')}</span><strong>{t('Ogni mattina per gli ospiti')}</strong></div><div><span>{t('Cucina')}</span><strong>{t('Tradizione sarda e forno a legna')}</strong></div><div><span>{t('Informazioni')}</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a></div></section>
      <FinalBooking title="Il soggiorno continua a tavola." />
    </main>
  );
}

function ItinerariesPage() {
  const { t } = useLanguage();
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Il territorio" title="Ogni strada parte dalla Nurra." lead="Mare, scogliere, torri e città: paesaggi diversi a pochi chilometri dalla tenuta." image="/images/villa/capo-caccia.webp" imageAlt="Le scogliere e la torre di Capo Caccia" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>{t('Esplorare')}</p></div><div><h2>{t('Una posizione, molte Sardegne.')}</h2><p>{t('Dal centro storico di Alghero alle spiagge della Riviera del Corallo, Villa Barbarina è un punto di partenza tranquillo per giornate sempre diverse.')}</p></div></section>
      <DestinationExplorer compact />
      <LocationSection />
      <FinalBooking />
    </main>
  );
}

function ExtrasPage() {
  const { t } = useLanguage();
  const services = [
    ['Arrivare', 'Informazioni e transfer su richiesta.'],
    ['Celebrare', 'Matrimoni, eventi privati e incontri aziendali.'],
    ['Esplorare', 'Indicazioni per spiagge, città ed esperienze nel territorio.'],
  ];
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Servizi" title="Un soggiorno costruito intorno a te." lead="Transfer, momenti speciali ed esperienze vengono organizzati su richiesta insieme allo staff." image="/images/villa/terrace-aperitivo.webp" imageAlt="Aperitivo su una terrazza di Villa Barbarina" />
      <section className="page-intro shell section-space"><div className="section-kicker"><span>01</span><p>{t('Su richiesta')}</p></div><div><h2>{t('Raccontaci cosa vuoi vivere.')}</h2><p>{t('La disponibilità dei servizi varia in base al periodo e al tipo di soggiorno. Lo staff può aiutarti senza trasformare la vacanza in un pacchetto predefinito.')}</p></div></section>
      <section className="service-ledger shell">{services.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h2>{t(title)}</h2><p>{t(copy)}</p></article>)}</section>
      <section className="marketplace shell section-space" aria-labelledby="marketplace-title"><RevealBlock><p className="eyebrow">{t('Esperienze su misura')}</p><h2 id="marketplace-title">{t('Costruisci la tua giornata con noi.')}</h2><p>{t('Transfer, escursioni e momenti speciali vengono organizzati direttamente con lo staff, in base al periodo e ai tuoi desideri.')}</p><SiteLink className="button button--primary" href="/contatti/">{t('Contatta lo staff')} <ArrowRight aria-hidden="true" size={17} /></SiteLink></RevealBlock><ImageReveal src="/images/villa/terrace-aperitivo.webp" alt={t('Aperitivo su una terrazza di Villa Barbarina')} /></section>
      <FinalBooking />
    </main>
  );
}

function InquiryForm() {
  const { locale, t } = useLanguage();
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
      departure.setCustomValidity(t('La partenza deve essere successiva all’arrivo.'));
      departure.reportValidity();
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 2500);
  };
  return (
    <form className="inquiry-form" action="https://www.villabarbarina.com/confirm7.php" method="post" target="villa-contact-response" onSubmit={handleSubmit}>
      <div className="form-row form-row--two"><label><span>{t('Nome')}</span><input name="Nome" type="text" autoComplete="given-name" required /></label><label><span>{t('Cognome')}</span><input name="Cognome" type="text" autoComplete="family-name" required /></label></div>
      <div className="form-row form-row--two"><label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label><label><span>{t('Telefono')}</span><input name="Tel" type="tel" autoComplete="tel" required /></label></div>
      <div className="form-row form-row--two"><label><span>{t('Arrivo')}</span><input name="Garrivo" type="date" min={today} required /></label><label><span>{t('Partenza')}</span><input name="Gpartenza" type="date" min={today} onChange={(event) => event.currentTarget.setCustomValidity('')} required /></label></div>
      <div className="form-row form-row--three"><label><span>{t('Adulti')}</span><input name="adulti" type="number" min="1" max="8" defaultValue="2" required /></label><label><span>{t('Bambini')}</span><select name="bambini" value={childrenCount} onChange={(event) => setChildrenCount(Number(event.target.value))}>{[0, 1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label><span>{t('Sistemazione')}</span><select name="sistemazione" defaultValue="Doppia"><option value="Doppia uso singola">{t('Doppia uso singola')}</option><option value="Doppia">{t('Doppia')}</option><option value="Tripla">{t('Tripla')}</option><option value="Quadrupla">{t('Quadrupla')}</option><option value="Junior Suite">Junior Suite</option></select></label></div>
      {childrenCount > 0 ? <div className="child-ages" aria-label={t('Età dei bambini')}>{Array.from({ length: childrenCount }, (_, index) => <label key={index}><span>{locale === 'en' ? `Child ${index + 1} age` : `Età bambino ${index + 1}`}</span><input name={`eta_bambino_${index + 1}`} type="number" min="0" max="17" required /></label>)}</div> : null}
      <label className="form-row"><span>{t('Trattamento')}</span><select name="trattamento" defaultValue="Camera e Colazione"><option value="Solo Pernottamento">{t('Solo Pernottamento')}</option><option value="Camera e Colazione">{t('Camera e Colazione')}</option><option value="Mezza Pensione">{t('Mezza Pensione')}</option></select></label>
      <label className="form-row"><span>{t('Note')}</span><textarea name="Note" rows={5} /></label>
      <label className="privacy-check"><input name="privacy" type="checkbox" value="1" required /><span>{t('Autorizzo il trattamento dei dati personali e dichiaro di aver letto la')} <a href="https://www.villabarbarina.com/servizi/privacy-policy-29" target="_blank" rel="noreferrer">privacy policy</a>.</span></label>
      <button className="button button--primary form-submit" type="submit" disabled={submitting}>{t(submitting ? 'Apertura in corso…' : 'Invia la richiesta')}<ArrowRight aria-hidden="true" size={17} /></button>
      <p className="form-note">{t('L’invio apre la conferma del sito ufficiale in una nuova scheda.')}</p>
    </form>
  );
}

function ContactPage() {
  const { t } = useLanguage();
  return (
    <main id="main-content">
      <PageHero eyebrow="Villa Barbarina · Contatti" title="Siamo qui per aiutarti a partire." lead="Disponibilità, soggiorni personalizzati, ristorante e richieste speciali: parla direttamente con lo staff." image="/images/villa/room-pool.webp" imageAlt="Camera di Villa Barbarina affacciata sulla piscina" />
      <section className="contact-ledger shell"><a href={CONTACT.phoneHref}><Phone aria-hidden="true" /><span>{t('Telefono')}</span><strong>{CONTACT.phoneLabel}</strong></a><a href={`mailto:${CONTACT.email}`}><Mail aria-hidden="true" /><span>Email</span><strong>{CONTACT.email}</strong></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /><span>WhatsApp</span><strong>331 410 6025</strong></a><a href="https://maps.google.com/?q=40.6520027,8.2817193" target="_blank" rel="noreferrer"><MapPin aria-hidden="true" /><span>{t('Come arrivare')}</span><strong>{t('Apri la mappa')}</strong></a></section>
      <section className="contact-workspace shell section-space"><div><p className="eyebrow">{t('Richiesta diretta')}</p><h2>{t('Raccontaci il soggiorno.')}</h2><InquiryForm /></div><aside aria-labelledby="faq-title"><p className="eyebrow">{t('Informazioni utili')}</p><h2 id="faq-title">{t('Prima di partire.')}</h2><div className="faq-list">{faqs.map((faq) => <details key={faq.question}><summary><span>{t(faq.question)}</span><ChevronDown aria-hidden="true" size={18} /></summary><p>{t(faq.answer)}</p></details>)}</div></aside></section>
    </main>
  );
}

function NotFoundPage() {
  const { t } = useLanguage();
  return <main id="main-content" className="not-found"><p className="eyebrow">404</p><h1>{t('Questa pagina non conduce alla tenuta.')}</h1><SiteLink className="button button--primary" href="/">{t('Torna alla home')}</SiteLink></main>;
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand"><BrandLogo footer /><p>{t('Una tenuta nella campagna di Alghero, tra ulivi, vigne e il mare della Sardegna.')}</p><BookingLink>Prenota il soggiorno</BookingLink></div>
        <nav aria-label={t('Navigazione piè di pagina')}>{navigation.map((item) => <SiteLink key={item.href} href={item.href}>{t(item.label)}</SiteLink>)}</nav>
        <address><span>{CONTACT.address}</span><a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer">WhatsApp</a><LanguageSwitch /></address>
      </div>
      <div className="shell footer-legal"><span>© {new Date().getFullYear()} {LEGAL.company}</span><span>P.IVA / CF {LEGAL.vat} · REA {LEGAL.rea}</span><span>CIR {LEGAL.cir} · CIN {LEGAL.cin}</span><a href="https://www.villabarbarina.com/servizi/privacy-policy-29" target="_blank" rel="noreferrer">Privacy</a><a href="https://www.villabarbarina.com/servizi/cookie-policy-31" target="_blank" rel="noreferrer">Cookie</a></div>
    </footer>
  );
}

function MobileDock() {
  const { t } = useLanguage();
  return <nav className="mobile-dock" aria-label={t('Contatti rapidi')}><a href={CONTACT.phoneHref}><Phone aria-hidden="true" size={17} /><span>{t('Chiama')}</span></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={17} /><span>WhatsApp</span></a><a href={BOOKING_URL} target="_blank" rel="noreferrer"><ArrowRight aria-hidden="true" size={17} /><span>{t('Prenota')}</span></a></nav>;
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
  const locale = useLocale();
  const t = (value: string) => translate(locale, value);
  const page = resolvePage(pathname);

  useEffect(() => {
    const room = rooms.find((candidate) => candidate.slug === pathname);
    const meta = room
      ? { title: `${t(room.menuName)} | Villa Barbarina Nature Resort`, description: t(room.description) }
      : pageMeta[pathname] ?? { title: 'Pagina non trovata | Villa Barbarina', description: 'La pagina richiesta non è disponibile.' };
    document.title = room ? meta.title : t(meta.title);
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', room ? meta.description : t(meta.description));
    document.documentElement.lang = locale;
    document.body.dataset.route = pathname === '/' ? 'home' : 'inner';
  }, [locale, pathname]);

  return (
    <LanguageContext.Provider value={{ locale, t }}>
      <Header pathname={pathname} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          id="app-content"
          key={`${pathname}-${locale}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: MOTION.normal, ease: MOTION.ease }}
        >
          <motion.span
            className="route-transition-line"
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0.9 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.72, ease: MOTION.ease }}
          />
          {page}
        </motion.div>
      </AnimatePresence>
      <Footer />
      <MobileDock />
    </LanguageContext.Provider>
  );
}
