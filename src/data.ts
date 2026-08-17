export const BOOKING_URL =
  'https://book.octorate.com/octobook/site/reservation/index.xhtml?codice=314439';

export const CONTACT = {
  phoneLabel: '079 999 9026',
  phoneHref: 'tel:+390799999026',
  email: 'info@villabarbarina.com',
  address: 'Str. Vicinale Pala Pirastru, 07041 Alghero SS',
  coordinates: '40.6520° N · 8.2817° E',
};

export type Room = {
  slug: string;
  name: string;
  menuName: string;
  lead: string;
  description: string;
  detail: string;
  primaryImage: string;
  secondaryImage: string;
  imageAlt: string;
  capacity: string;
  bed: string;
  idealFor: string;
  features: string[];
};

export const rooms: Room[] = [
  {
    slug: '/camera-doppia/',
    name: 'Camera doppia e doppia uso singola',
    menuName: 'Camera Doppia',
    lead: 'Eleganza naturale, silenzio e luce.',
    description:
      'Spaziosa e luminosa, la Camera Doppia è arredata con materiali naturali, tessuti di pregio e mobili in legno fatti a mano. La terrazza privata apre la stanza alla quiete della campagna.',
    detail:
      'È una scelta intima per una fuga di coppia e un rifugio tranquillo anche per chi soggiorna ad Alghero per lavoro nelle stagioni più quiete.',
    primaryImage: '/images/villa/double-room.webp',
    secondaryImage: '/images/villa/double-bath.webp',
    imageAlt: 'Camera doppia di Villa Barbarina con arredi in legno',
    capacity: '1–2 ospiti',
    bed: 'King size',
    idealFor: 'Coppie · soggiorni individuali',
    features: [
      'Terrazza attrezzata con tavolino e sedie',
      'Letto matrimoniale king size',
      'TV LCD 40″, minibar e cassaforte',
      'Aria condizionata regolabile',
      'Bagno privato con doccia in cristallo',
      'Asciugacapelli e set cortesia',
      'Doppi vetri e tende oscuranti ignifughe',
    ],
  },
  {
    slug: '/camera-tripla/',
    name: 'Camera Tripla con Terrazza',
    menuName: 'Camera Tripla',
    lead: 'Spazio sereno da condividere.',
    description:
      'Pensata per famiglie, amici e piccoli gruppi, la Camera Tripla unisce arredi artigianali, tessuti naturali e una terrazza privata affacciata sul verde della tenuta.',
    detail:
      'La configurazione può accogliere un letto matrimoniale e un singolo oppure, su richiesta, tre letti singoli.',
    primaryImage: '/images/villa/triple-room.webp',
    secondaryImage: '/images/villa/triple-bath.webp',
    imageAlt: 'Camera tripla luminosa di Villa Barbarina',
    capacity: 'Fino a 3 ospiti',
    bed: 'King + singolo',
    idealFor: 'Famiglie · amici',
    features: [
      'Letto king size e letto singolo, o tre singoli su richiesta',
      'Terrazza privata affacciata sul verde',
      'TV LCD 40″ a schermo piatto',
      'Minibar, cassaforte e armadio',
      'Aria condizionata autonoma',
      'Bagno privato con ampia doccia in cristallo',
      'Set cortesia, asciugacapelli e biancheria di qualità',
      'Doppi vetri e tende oscuranti ignifughe',
    ],
  },
  {
    slug: '/camera-quadrupla/',
    name: 'Camera Quadrupla Familiare',
    menuName: 'Camera Quadrupla',
    lead: 'Condivisione, senza rinunciare allo spazio.',
    description:
      'La Camera Quadrupla accoglie comodamente fino a quattro persone, con ampi spazi, comfort contemporaneo e dettagli artigianali legati alla tradizione sarda.',
    detail:
      'Un letto matrimoniale e due singoli, oppure quattro letti singoli su richiesta, permettono di adattare la camera a famiglie e gruppi di amici.',
    primaryImage: '/images/villa/quad-room.webp',
    secondaryImage: '/images/villa/quad-bath.webp',
    imageAlt: 'Camera quadrupla familiare di Villa Barbarina',
    capacity: 'Fino a 4 ospiti',
    bed: 'King + 2 singoli',
    idealFor: 'Famiglie · piccoli gruppi',
    features: [
      'Letto king size e due singoli, o quattro singoli su richiesta',
      'Terrazza privata attrezzata',
      'TV LCD 40″ a schermo piatto',
      'Minibar, cassaforte e armadio',
      'Aria condizionata autonoma',
      'Bagno privato con ampia doccia in cristallo',
      'Set cortesia, asciugacapelli e biancheria di qualità',
      'Doppi vetri e tende oscuranti ignifughe',
    ],
  },
  {
    slug: '/junior-suite/',
    name: 'Junior Suite con Terrazza Privata',
    menuName: 'Junior Suite',
    lead: 'Più spazio per abitare il silenzio.',
    description:
      'La Junior Suite offre spazi generosi, arredi artigianali in legno naturale e una terrazza privata sul paesaggio verde della tenuta.',
    detail:
      'La luce delle ampie vetrate, il letto king size e il bagno curato creano un ambiente intimo per una fuga romantica o un soggiorno più disteso.',
    primaryImage: '/images/villa/suite-room.webp',
    secondaryImage: '/images/villa/suite-bath.webp',
    imageAlt: 'Junior Suite di Villa Barbarina con terrazza privata',
    capacity: '2 ospiti',
    bed: 'King size',
    idealFor: 'Coppie · soggiorni di charme',
    features: [
      'Letto matrimoniale king size',
      'Terrazza privata attrezzata e affacciata sul verde',
      'TV LCD 40″ a schermo piatto',
      'Minibar, cassaforte e armadio',
      'Aria condizionata regolabile',
      'Bagno privato con ampia doccia in cristallo',
      'Set cortesia, asciugacapelli e biancheria di qualità',
      'Doppi vetri e tende oscuranti ignifughe',
    ],
  },
];

export const destinations = [
  {
    name: 'Le Bombarde',
    distance: '10 km dal resort',
    image: '/images/villa/le-bombarde.webp',
    alt: 'Mare turchese e costa della spiaggia Le Bombarde',
    text: 'Sabbia dorata, acqua trasparente e pineta: una delle spiagge più conosciute della Riviera del Corallo.',
  },
  {
    name: 'Capo Caccia',
    distance: 'Costa nord-occidentale',
    image: '/images/villa/capo-caccia.webp',
    alt: 'Scogliere di Capo Caccia sul mare',
    text: 'Falesie chiare, sentieri panoramici e l’orizzonte aperto del promontorio che domina il golfo.',
  },
  {
    name: 'Alghero',
    distance: '7 km dal resort',
    image: '/images/villa/alghero.webp',
    alt: 'Centro storico e bastioni di Alghero',
    text: 'I bastioni, le vie del centro storico e il carattere catalano della città sono raggiungibili in pochi minuti d’auto.',
  },
  {
    name: 'Porto Ferro e Porticciolo',
    distance: 'Nurra costiera',
    image: '/images/villa/porticciolo.webp',
    alt: 'Torre e costa naturale di Porticciolo',
    text: 'Una costa più selvaggia, tra torri, macchia mediterranea e spiagge aperte al maestrale.',
  },
];

export const faqs = [
  {
    question: 'Come si arriva a Villa Barbarina dall’aeroporto di Alghero?',
    answer:
      'Villa Barbarina si trova a circa 3 km dall’aeroporto di Alghero-Fertilia. Il tragitto in taxi richiede pochi minuti; su richiesta è possibile organizzare un transfer privato.',
  },
  {
    question: 'È necessario noleggiare un’auto?',
    answer:
      'L’auto è consigliata per esplorare spiagge, calette e borghi con la massima libertà. Lo staff può indicare operatori locali e organizzare transfer su richiesta.',
  },
  {
    question: 'Qual è la spiaggia più vicina?',
    answer:
      'Le Bombarde è tra le spiagge più vicine, a circa dieci minuti d’auto, con sabbia chiara e acqua trasparente.',
  },
  {
    question: 'Quanto dista il centro storico di Alghero?',
    answer:
      'Il centro storico si trova a circa 7 km ed è raggiungibile in auto in circa 10–12 minuti.',
  },
  {
    question: 'È possibile soggiornare senza auto?',
    answer:
      'Sì, organizzando taxi o transfer per gli spostamenti principali. Per esplorare liberamente la costa e l’entroterra, l’auto resta la soluzione più comoda.',
  },
];
