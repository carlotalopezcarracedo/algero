import {
  ArrowRight,
  ChevronDown,
  Mail,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import {
  type AnchorHTMLAttributes,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BOOKING_URL, CONTACT, destinations, faqs, rooms, type Room } from './data';

const BASE_PATH = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

const navigation = [
  { label: 'Il resort', href: '/resort/' },
  { label: 'Camere', href: '/camere/' },
  { label: 'Ristorante', href: '/ristorante/' },
  { label: 'Dintorni', href: '/itinerari/' },
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

type SiteLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

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
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return;
    }

    event.preventDefault();
    const nextPath = normalisePath(href);
    if (routeFromLocation(window.location.pathname) !== nextPath) {
      window.history.pushState({}, '', browserPathForRoute(nextPath));
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  return (
    <a href={resolvedHref} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}

function BookingLink({ children = 'Prenota il soggiorno', className = '' }) {
  return (
    <a
      className={`booking-link ${className}`.trim()}
      href={BOOKING_URL}
      target="_blank"
      rel="noreferrer"
    >
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={18} strokeWidth={1.7} />
    </a>
  );
}

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
};

function Photo({ src, alt, className = '', eager = false }: PhotoProps) {
  return (
    <img
      className={className}
      src={publicAssetPath(src)}
      alt={alt}
      width="2048"
      height="1536"
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

function Header({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Vai al contenuto
      </a>
      <header className="site-header">
        <div className="site-header__brand-pane">
          <SiteLink href="/" className="wordmark" aria-label="Villa Barbarina, home">
            Villa Barbarina
          </SiteLink>
        </div>

        <div className="site-header__nav-pane">
          <nav
            id="primary-navigation"
            className={`primary-nav ${menuOpen ? 'primary-nav--open' : ''}`}
            aria-label="Navigazione principale"
          >
            {navigation.map((item) => (
              <SiteLink
                key={item.href}
                href={item.href}
                className={pathname === item.href ? 'is-current' : ''}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </SiteLink>
            ))}
            <a
              className="language-link"
              href="https://www.villabarbarina.com/en/"
              aria-label="English version"
            >
              EN
            </a>
          </nav>

          <BookingLink className="header-booking" />

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Chiudi il menu' : 'Apri il menu'}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>
    </>
  );
}

function HomeHero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero__copy">
        <h1 id="home-title">Relax autentico nell’anima verde della Sardegna</h1>
        <p className="home-hero__intro">Tra ulivi, vigne e il mare di Alghero.</p>
        <div className="home-hero__coordinates">{CONTACT.coordinates}</div>
      </div>

      <figure className="home-hero__small-photo">
        <Photo
          src="/images/villa/villa-exterior.webp"
          alt="Camera di Villa Barbarina aperta sul giardino"
          eager
        />
      </figure>

      <figure className="home-hero__main-photo">
        <Photo
          src="/images/villa/pool-guest.webp"
          alt="Ospite che legge a bordo piscina a Villa Barbarina"
          eager
        />
        <figcaption>Il tempo lento, a bordo piscina.</figcaption>
      </figure>
    </section>
  );
}

function ResortIntroduction() {
  return (
    <section className="resort-intro">
      <div className="resort-intro__statement">
        <h2>Una tenuta agricola diventata luogo d’ospitalità.</h2>
      </div>
      <div className="resort-intro__copy">
        <p>
          Villa Barbarina è immersa nella pianura della Nurra, tra cinque ettari di
          uliveti, vigne e prati. Qui il silenzio della campagna incontra camere
          luminose, cucina sarda e una piscina aperta sul paesaggio.
        </p>
        <SiteLink className="text-link" href="/resort/">
          Entra nella tenuta <ArrowRight aria-hidden="true" size={18} />
        </SiteLink>
      </div>
      <figure className="resort-intro__photo">
        <Photo
          src="/images/villa/grounds.webp"
          alt="Il parco e gli edifici di Villa Barbarina"
        />
      </figure>
    </section>
  );
}

function RoomIndex() {
  const [activeSlug, setActiveSlug] = useState(rooms[0].slug);
  const activeRoom = rooms.find((room) => room.slug === activeSlug) ?? rooms[0];

  return (
    <section className="room-index" aria-labelledby="room-index-title">
      <div className="room-index__heading">
        <h2 id="room-index-title">Quattro modi di abitare la quiete.</h2>
        <p>
          Camere diverse per ritmo e dimensione, unite dalla stessa luce, dai materiali
          naturali e dal paesaggio della tenuta.
        </p>
      </div>

      <nav className="room-index__list" aria-label="Tipologie di camera">
        {rooms.map((room) => (
          <SiteLink
            key={room.slug}
            href={room.slug}
            className={`room-index__row ${activeRoom.slug === room.slug ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveSlug(room.slug)}
            onFocus={() => setActiveSlug(room.slug)}
          >
            <span className="room-index__name">{room.menuName}</span>
            <span className="room-index__meta">{room.capacity}</span>
            <ArrowRight aria-hidden="true" size={22} strokeWidth={1.4} />
          </SiteLink>
        ))}
      </nav>

      <figure className="room-index__preview" aria-live="polite">
        <Photo src={activeRoom.primaryImage} alt={activeRoom.imageAlt} />
        <figcaption>
          <span>{activeRoom.lead}</span>
          <span>{activeRoom.idealFor}</span>
        </figcaption>
      </figure>
    </section>
  );
}

function FoodChapter() {
  return (
    <section className="food-chapter" aria-labelledby="food-title">
      <figure className="food-chapter__main-photo">
        <Photo
          src="/images/villa/crudo.webp"
          alt="Piatto del ristorante di Villa Barbarina"
        />
      </figure>
      <div className="food-chapter__copy">
        <h2 id="food-title">
          La Sardegna arriva a tavola senza <span className="no-break">travestimenti.</span>
        </h2>
        <p>
          Pasta tirata a mano, carni locali, pesce del giorno, pizza cotta nel forno a
          legna e vini autoctoni. La cucina racconta la terra con gesti semplici e
          ingredienti scelti.
        </p>
        <SiteLink className="text-link text-link--light" href="/ristorante/">
          Scopri il ristorante <ArrowRight aria-hidden="true" size={18} />
        </SiteLink>
      </div>
      <figure className="food-chapter__detail-photo">
        <Photo
          src="/images/villa/wines.webp"
          alt="Vini del territorio serviti al ristorante"
        />
      </figure>
    </section>
  );
}

function PlaceBand() {
  return (
    <section className="place-band" aria-labelledby="place-title">
      <div className="place-band__header">
        <h2 id="place-title">Campagna, città, costa. Nella stessa giornata.</h2>
        <p>
          Villa Barbarina è un punto quieto da cui raggiungere Alghero, le spiagge della
          Riviera del Corallo e le scogliere di Capo Caccia.
        </p>
      </div>
      <div className="place-band__distances">
        <div>
          <strong>3 km</strong>
          <span>Aeroporto di Alghero</span>
        </div>
        <div>
          <strong>7 km</strong>
          <span>Centro storico</span>
        </div>
        <div>
          <strong>10 km</strong>
          <span>Le Bombarde</span>
        </div>
      </div>
      <figure className="place-band__photo">
        <Photo src="/images/villa/aerial.webp" alt="Villa Barbarina vista dall’alto" />
      </figure>
      <SiteLink className="place-band__link" href="/itinerari/">
        Disegna il tuo itinerario <ArrowRight aria-hidden="true" size={18} />
      </SiteLink>
    </section>
  );
}

function BookingChapter({
  title = 'La tua Sardegna comincia nella quiete.',
  copy = 'Prenota direttamente oppure raccontaci il soggiorno che hai in mente.',
}: {
  title?: string;
  copy?: string;
}) {
  return (
    <section className="booking-chapter" aria-labelledby="booking-title">
      <div>
        <h2 id="booking-title">{title}</h2>
        <p>{copy}</p>
      </div>
      <div className="booking-chapter__actions">
        <BookingLink>Verifica disponibilità</BookingLink>
        <SiteLink className="text-link text-link--light" href="/contatti/">
          Richiedi un preventivo <ArrowRight aria-hidden="true" size={18} />
        </SiteLink>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <main id="main-content">
      <HomeHero />
      <ResortIntroduction />
      <RoomIndex />
      <FoodChapter />
      <PlaceBand />
      <BookingChapter />
    </main>
  );
}

type EditorialHeroProps = {
  title: string;
  lead: string;
  image: string;
  imageAlt: string;
  tone?: 'paper' | 'pine' | 'terracotta';
  imagePosition?: 'left' | 'right';
};

function EditorialHero({
  title,
  lead,
  image,
  imageAlt,
  tone = 'paper',
  imagePosition = 'right',
}: EditorialHeroProps) {
  return (
    <section
      className={`editorial-hero editorial-hero--${tone} editorial-hero--image-${imagePosition}`}
    >
      <div className="editorial-hero__copy">
        <h1>{title}</h1>
        <p>{lead}</p>
      </div>
      <figure className="editorial-hero__photo">
        <Photo src={image} alt={imageAlt} eager />
      </figure>
    </section>
  );
}

function ResortPage() {
  return (
    <main id="main-content">
      <EditorialHero
        title="Il paesaggio non fa da sfondo. È parte del soggiorno."
        lead="Una storica tenuta agricola nella pianura della Nurra, trasformata in un resort dove natura, ospitalità e cucina condividono lo stesso ritmo."
        image="/images/villa/resort-pool.webp"
        imageAlt="Piscina e parco di Villa Barbarina"
      />

      <section className="resort-story">
        <div className="resort-story__lead">
          <h2>Cinque ettari per rallentare.</h2>
          <p>
            Ulivi secolari, vigne, prati curati e il profumo della macchia mediterranea
            circondano le camere. La Riviera del Corallo resta vicina, ma qui il rumore
            si ferma alla soglia.
          </p>
        </div>
        <figure className="resort-story__portrait">
          <Photo src="/images/villa/olive-grove.webp" alt="Ulivi nella tenuta" />
        </figure>
        <div className="resort-story__note">
          <p>
            La villa nasce da una tenuta agricola e conserva un rapporto diretto con la
            terra: nei materiali, nella cucina e nella scala intima degli spazi.
          </p>
        </div>
        <figure className="resort-story__landscape">
          <Photo src="/images/villa/reception.webp" alt="La reception di Villa Barbarina" />
        </figure>
      </section>

      <section className="experience-ledger" aria-labelledby="experience-title">
        <h2 id="experience-title">La giornata, senza programma obbligato.</h2>
        <div className="experience-ledger__rows">
          <div>
            <span>Mattino</span>
            <strong>Colazione e luce sulla veranda</strong>
            <p>Dolci, frutta fresca e il tempo per decidere dove andare.</p>
          </div>
          <div>
            <span>Mezzogiorno</span>
            <strong>Piscina, prato o costa</strong>
            <p>Restare nella tenuta o raggiungere il mare in pochi minuti.</p>
          </div>
          <div>
            <span>Sera</span>
            <strong>Cucina sarda e cielo aperto</strong>
            <p>Una cena in sala o all’aperto, poi il silenzio della campagna.</p>
          </div>
        </div>
      </section>

      <BookingChapter
        title="Una base quieta per incontrare la Sardegna."
        copy="Scegli la camera e prenota direttamente, oppure contattaci per un soggiorno su misura."
      />
    </main>
  );
}

function RoomsPage() {
  return (
    <main id="main-content">
      <EditorialHero
        title="Ventitré camere. Nessuna separata dal paesaggio."
        lead="Legno su misura, tessuti naturali, terrazze e verande private: ogni stanza interpreta il carattere della tenuta con una misura diversa."
        image="/images/villa/room-view.webp"
        imageAlt="Camera di Villa Barbarina affacciata sulla piscina"
        tone="pine"
      />

      <section className="rooms-directory" aria-labelledby="rooms-directory-title">
        <div className="rooms-directory__intro">
          <h2 id="rooms-directory-title">Scegli lo spazio che ti somiglia.</h2>
          <p>
            Tutte le camere dispongono di aria condizionata, TV LCD, minibar,
            cassaforte e bagno privato con doccia in cristallo.
          </p>
        </div>

        <div className="rooms-directory__entries">
          {rooms.map((room) => (
            <article className="room-entry" key={room.slug}>
              <div className="room-entry__text">
                <h3>{room.name}</h3>
                <p>{room.lead}</p>
                <div className="room-entry__facts">
                  <span>{room.capacity}</span>
                  <span>{room.bed}</span>
                  <span>{room.idealFor}</span>
                </div>
                <SiteLink className="text-link" href={room.slug}>
                  Entra nella camera <ArrowRight aria-hidden="true" size={18} />
                </SiteLink>
              </div>
              <figure className="room-entry__photo">
                <Photo src={room.primaryImage} alt={room.imageAlt} />
              </figure>
            </article>
          ))}
        </div>
      </section>
      <BookingChapter />
    </main>
  );
}

function RoomPage({ room }: { room: Room }) {
  return (
    <main id="main-content">
      <EditorialHero
        title={room.name}
        lead={room.lead}
        image={room.primaryImage}
        imageAlt={room.imageAlt}
        tone="paper"
      />

      <section className="room-detail">
        <div className="room-detail__facts" aria-label="Informazioni principali">
          <div>
            <span>Ospiti</span>
            <strong>{room.capacity}</strong>
          </div>
          <div>
            <span>Riposo</span>
            <strong>{room.bed}</strong>
          </div>
          <div>
            <span>Ideale per</span>
            <strong>{room.idealFor}</strong>
          </div>
        </div>

        <div className="room-detail__story">
          <h2>Comfort e atmosfera</h2>
          <p>{room.description}</p>
          <p>{room.detail}</p>
        </div>

        <figure className="room-detail__bath-photo">
          <Photo src={room.secondaryImage} alt={`Bagno della ${room.menuName}`} />
        </figure>

        <div className="room-detail__features">
          <h2>In camera</h2>
          <ul>
            {room.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="next-room" aria-label="Altre camere">
        <span>Continua a esplorare</span>
        <div>
          {rooms
            .filter((candidate) => candidate.slug !== room.slug)
            .slice(0, 3)
            .map((candidate) => (
              <SiteLink href={candidate.slug} key={candidate.slug}>
                {candidate.menuName} <ArrowRight aria-hidden="true" size={17} />
              </SiteLink>
            ))}
        </div>
      </section>

      <BookingChapter
        title="Ritrova il tempo della camera."
        copy="Verifica la disponibilità oppure chiedi allo staff la soluzione più adatta al tuo soggiorno."
      />
    </main>
  );
}

function RestaurantPage() {
  return (
    <main id="main-content">
      <EditorialHero
        title="La cucina sarda, servita nel luogo da cui nasce."
        lead="Ingredienti freschi, ricette della tradizione, pizza cotta nel forno a legna e vini autoctoni: la tavola completa il racconto della tenuta."
        image="/images/villa/crudo.webp"
        imageAlt="Piatto del ristorante di Villa Barbarina"
        tone="terracotta"
        imagePosition="left"
      />

      <section className="restaurant-story">
        <div className="restaurant-story__copy">
          <h2>Sapori autentici, gesti contemporanei.</h2>
          <p>
            Pane carasau, pasta tirata a mano, carni locali cotte lentamente e pesce del
            giorno raccontano la Sardegna più vera. I dolci preparati ogni mattina e la
            selezione di Vermentino e Cannonau chiudono il cerchio.
          </p>
        </div>
        <figure className="restaurant-story__wide-photo">
          <Photo src="/images/villa/restaurant.webp" alt="Colazione servita a Villa Barbarina" />
        </figure>
        <figure className="restaurant-story__detail-photo">
          <Photo src="/images/villa/pizza.webp" alt="Pizza preparata nel ristorante" />
        </figure>
        <div className="restaurant-story__pizza-copy">
          <h2>Il forno a legna, la sera.</h2>
          <p>
            Un impasto leggero e fragrante incontra pomodorini, basilico, formaggi locali
            e l’olio extravergine della terra sarda.
          </p>
        </div>
      </section>

      <section className="restaurant-note">
        <p>
          Il ristorante accoglie gli ospiti in sala o all’aperto. Per orari, eventi e
          richieste particolari, contatta direttamente la struttura.
        </p>
        <a className="text-link text-link--light" href={CONTACT.phoneHref}>
          Chiama il ristorante <ArrowRight aria-hidden="true" size={18} />
        </a>
      </section>

      <BookingChapter
        title="Dormire qui significa anche assaggiare qui."
        copy="Prenota il soggiorno o scrivici per informazioni sul ristorante e sugli eventi."
      />
    </main>
  );
}

function ItinerariesPage() {
  return (
    <main id="main-content">
      <EditorialHero
        title="Ogni strada parte dalla Nurra."
        lead="Mare, scogliere, torri e città: Villa Barbarina resta al centro di un territorio che cambia volto in pochi chilometri."
        image="/images/villa/aerial.webp"
        imageAlt="Vista aerea di Villa Barbarina e della campagna circostante"
        tone="pine"
      />

      <section className="field-notes" aria-labelledby="field-notes-title">
        <div className="field-notes__intro">
          <h2 id="field-notes-title">Un atlante per giornate senza fretta.</h2>
          <p>
            Le distanze sono brevi; il consiglio è lasciare spazio alle deviazioni, alle
            soste e alla luce che cambia sulla costa.
          </p>
        </div>

        <div className="field-notes__list">
          {destinations.map((destination, index) => (
            <article className="field-note" key={destination.name}>
              <span className="field-note__number">{String(index + 1).padStart(2, '0')}</span>
              <div className="field-note__name">
                <h3>{destination.name}</h3>
                <span>{destination.distance}</span>
              </div>
              <p>{destination.text}</p>
              <figure>
                <Photo src={destination.image} alt={destination.alt} />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="coordinates-band">
        <MapPin aria-hidden="true" size={24} strokeWidth={1.4} />
        <div>
          <strong>{CONTACT.coordinates}</strong>
          <span>{CONTACT.address}</span>
        </div>
        <a
          className="text-link text-link--light"
          href="https://maps.google.com/?q=40.6520027,8.2817193"
          target="_blank"
          rel="noreferrer"
        >
          Apri la mappa <ArrowRight aria-hidden="true" size={18} />
        </a>
      </section>

      <BookingChapter />
    </main>
  );
}

function ExtrasPage() {
  return (
    <main id="main-content">
      <EditorialHero
        title="Il soggiorno può continuare oltre la camera."
        lead="Transfer, momenti speciali ed esperienze nel territorio vengono organizzati su richiesta, a partire dalle esigenze reali del tuo viaggio."
        image="/images/villa/terrace-aperitivo.webp"
        imageAlt="Aperitivo sulla terrazza di una camera"
      />

      <section className="extras-ledger" aria-labelledby="extras-title">
        <div>
          <h2 id="extras-title">Raccontaci cosa vuoi vivere.</h2>
          <p>
            La disponibilità dei servizi varia in base al periodo e al tipo di soggiorno.
            Lo staff può aiutarti a verificare transfer, occasioni private e attività nei
            dintorni senza trasformare la vacanza in un pacchetto predefinito.
          </p>
        </div>
        <div className="extras-ledger__rows">
          <div>
            <strong>Arrivare</strong>
            <span>Informazioni e transfer su richiesta</span>
          </div>
          <div>
            <strong>Celebrare</strong>
            <span>Matrimoni, eventi privati e incontri aziendali</span>
          </div>
          <div>
            <strong>Esplorare</strong>
            <span>Indicazioni per spiagge, città e territorio</span>
          </div>
        </div>
        <SiteLink className="booking-link" href="/contatti/">
          <span>Chiedi allo staff</span>
          <ArrowRight aria-hidden="true" size={18} />
        </SiteLink>
      </section>
      <BookingChapter />
    </main>
  );
}

function InquiryForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (_event: FormEvent<HTMLFormElement>) => {
    setSubmitting(true);
    window.setTimeout(() => setSubmitting(false), 2500);
  };

  return (
    <form
      className="inquiry-form"
      action="https://www.villabarbarina.com/confirm7.php"
      method="post"
      target="villa-contact-response"
      onSubmit={handleSubmit}
    >
      <div className="form-row form-row--two">
        <label>
          <span>Nome</span>
          <input name="Nome" type="text" autoComplete="given-name" required />
        </label>
        <label>
          <span>Cognome</span>
          <input name="Cognome" type="text" autoComplete="family-name" required />
        </label>
      </div>

      <div className="form-row form-row--two">
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          <span>Telefono</span>
          <input name="Tel" type="tel" autoComplete="tel" />
        </label>
      </div>

      <div className="form-row form-row--two">
        <label>
          <span>Arrivo</span>
          <input name="Garrivo" type="date" required />
        </label>
        <label>
          <span>Partenza</span>
          <input name="Gpartenza" type="date" required />
        </label>
      </div>

      <div className="form-row form-row--three">
        <label>
          <span>Adulti</span>
          <input name="adulti" type="number" min="1" max="8" defaultValue="2" required />
        </label>
        <label>
          <span>Bambini</span>
          <select name="bambini" defaultValue="0">
            {[0, 1, 2, 3, 4, 5, 6].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Sistemazione</span>
          <select name="sistemazione" defaultValue="Doppia">
            <option>Doppia uso singola</option>
            <option>Doppia</option>
            <option>Tripla</option>
            <option>Quadrupla</option>
            <option>Junior Suite</option>
          </select>
        </label>
      </div>

      <label className="form-row">
        <span>Trattamento</span>
        <select name="trattamento" defaultValue="Camera e Colazione">
          <option>Solo Pernottamento</option>
          <option>Camera e Colazione</option>
          <option>Mezza Pensione</option>
        </select>
      </label>

      <label className="form-row">
        <span>Note</span>
        <textarea name="Note" rows={5} />
      </label>

      <label className="privacy-check">
        <input name="privacy" type="checkbox" value="1" required />
        <span>
          Autorizzo il trattamento dei dati personali e dichiaro di aver letto la{' '}
          <a
            href="https://www.villabarbarina.com/servizi/privacy-policy-29"
            target="_blank"
            rel="noreferrer"
          >
            privacy policy
          </a>
          .
        </span>
      </label>

      <button className="form-submit" type="submit" disabled={submitting}>
        {submitting ? 'Apertura in corso…' : 'Invia la richiesta'}
        <ArrowRight aria-hidden="true" size={18} />
      </button>
      <p className="form-note">
        L’invio apre la conferma del sito ufficiale in una nuova scheda.
      </p>
    </form>
  );
}

function ContactPage() {
  return (
    <main id="main-content">
      <section className="contact-hero">
        <div className="contact-hero__copy">
          <h1>Un contatto diretto, prima di arrivare.</h1>
          <p>
            Per disponibilità, preventivi personalizzati, ristorante o richieste
            speciali, scrivi allo staff di Villa Barbarina.
          </p>
        </div>
        <div className="contact-hero__details">
          <a href={CONTACT.phoneHref}>
            <Phone aria-hidden="true" size={22} strokeWidth={1.5} />
            <span>{CONTACT.phoneLabel}</span>
          </a>
          <a href={`mailto:${CONTACT.email}`}>
            <Mail aria-hidden="true" size={22} strokeWidth={1.5} />
            <span>{CONTACT.email}</span>
          </a>
          <a
            href="https://maps.google.com/?q=40.6520027,8.2817193"
            target="_blank"
            rel="noreferrer"
          >
            <MapPin aria-hidden="true" size={22} strokeWidth={1.5} />
            <span>{CONTACT.address}</span>
          </a>
        </div>
      </section>

      <section className="contact-content">
        <div className="contact-content__form">
          <h2>Richiedi disponibilità</h2>
          <InquiryForm />
        </div>

        <aside className="contact-content__faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Prima di partire</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  <span>{faq.question}</span>
                  <ChevronDown aria-hidden="true" size={19} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main id="main-content" className="not-found">
      <p className="location-line">404 · Sentiero interrotto</p>
      <h1>Questa pagina non conduce alla tenuta.</h1>
      <p>Torna all’inizio o scegli una delle sezioni principali.</p>
      <SiteLink className="booking-link" href="/">
        <span>Torna alla home</span>
        <ArrowRight aria-hidden="true" size={18} />
      </SiteLink>
    </main>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__statement">
        <strong>Villa Barbarina</strong>
        <p>La campagna di Alghero, il mare a pochi minuti.</p>
      </div>
      <div className="site-footer__links">
        <SiteLink href="/resort/">Il resort</SiteLink>
        <SiteLink href="/camere/">Camere</SiteLink>
        <SiteLink href="/ristorante/">Ristorante</SiteLink>
        <SiteLink href="/itinerari/">Dintorni</SiteLink>
        <SiteLink href="/servizi-extra/">Servizi extra</SiteLink>
        <SiteLink href="/contatti/">Contatti</SiteLink>
      </div>
      <address className="site-footer__contact">
        <span>{CONTACT.address}</span>
        <a href={CONTACT.phoneHref}>{CONTACT.phoneLabel}</a>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </address>
      <div className="site-footer__legal">
        <span>© {new Date().getFullYear()} Villa Barbarina S.r.l.</span>
        <span>CIR 090003A1000F2709 · CIN IT090003A1000F2709</span>
        <a
          href="https://www.villabarbarina.com/servizi/privacy-policy-29"
          target="_blank"
          rel="noreferrer"
        >
          Privacy
        </a>
        <a
          href="https://www.villabarbarina.com/servizi/cookie-policy-31"
          target="_blank"
          rel="noreferrer"
        >
          Cookie
        </a>
      </div>
    </footer>
  );
}

function resolvePage(pathname: string): ReactNode {
  const room = rooms.find((candidate) => candidate.slug === pathname);
  if (room) return <RoomPage room={room} />;

  switch (pathname) {
    case '/':
      return <HomePage />;
    case '/resort/':
      return <ResortPage />;
    case '/camere/':
      return <RoomsPage />;
    case '/ristorante/':
      return <RestaurantPage />;
    case '/itinerari/':
      return <ItinerariesPage />;
    case '/servizi-extra/':
      return <ExtrasPage />;
    case '/contatti/':
      return <ContactPage />;
    default:
      return <NotFoundPage />;
  }
}

export default function App() {
  const pathname = usePathname();
  const page = useMemo(() => resolvePage(pathname), [pathname]);

  useEffect(() => {
    const room = rooms.find((candidate) => candidate.slug === pathname);
    const meta = room
      ? {
          title: `${room.menuName} | Villa Barbarina Nature Resort`,
          description: room.description,
        }
      : pageMeta[pathname] ?? {
          title: 'Pagina non trovata | Villa Barbarina',
          description: 'La pagina richiesta non è disponibile.',
        };

    document.title = meta.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    description?.setAttribute('content', meta.description);
    document.body.dataset.route = pathname === '/' ? 'home' : 'inner';
  }, [pathname]);

  return (
    <>
      <Header pathname={pathname} />
      {page}
      <Footer />
    </>
  );
}
