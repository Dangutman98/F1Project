export interface RacingSpot {
  id: number;
  spotName: string;
  description: string;
  imageUrl: string;
  country: string;
  region: string;
  status: 'current' | 'upcoming' | 'former';
}

export const racingSpots: RacingSpot[] = [
  // Current F1 Circuits - Europe
  {
    id: 1,
    spotName: "Silverstone Circuit",
    description: "Home of British motorsport, featuring high-speed corners and rich F1 history dating back to the first championship.",
    imageUrl: "../assets/racing-spots/silverstone.jpg",
    country: "UK",
    region: "Europe",
    status: "current"
  },
  {
    id: 2,
    spotName: "Circuit de Spa-Francorchamps",
    description: "One of the most challenging and historic circuits in F1, home to the famous Eau Rouge corner.",
    imageUrl: "../assets/racing-spots/spa.jpg",
    country: "Belgium",
    region: "Europe",
    status: "current"
  },
  {
    id: 3,
    spotName: "Hungaroring",
    description: "A tight and twisty circuit known for its technical challenges and hot summer races.",
    imageUrl: "../assets/racing-spots/hungaroring.jpg",
    country: "Hungary",
    region: "Europe",
    status: "current"
  },
  {
    id: 4,
    spotName: "Circuit Zandvoort",
    description: "A historic track revived for modern F1, featuring unique banked corners and coastal location.",
    imageUrl: "../assets/racing-spots/zandvoort.jpg",
    country: "Netherlands",
    region: "Europe",
    status: "current"
  },
  {
    id: 5,
    spotName: "Autodromo Nazionale Monza",
    description: "Known as the 'Temple of Speed', famous for its high-speed straights and rich racing heritage.",
    imageUrl: "../assets/racing-spots/monza.jpg",
    country: "Italy",
    region: "Europe",
    status: "current"
  },
  {
    id: 6,
    spotName: "Imola Circuit",
    description: "Autodromo Enzo e Dino Ferrari, a challenging circuit with rich motorsport history.",
    imageUrl: "../assets/racing-spots/imola.jpg",
    country: "Italy",
    region: "Europe",
    status: "current"
  },
  {
    id: 7,
    spotName: "Circuit de Barcelona-Catalunya",
    description: "Technical circuit that tests both car and driver, moving to Madrid in 2026.",
    imageUrl: "../assets/racing-spots/barcelona.jpg",
    country: "Spain",
    region: "Europe",
    status: "current"
  },
  {
    id: 8,
    spotName: "Red Bull Ring",
    description: "Fast, flowing circuit in the Styrian mountains with stunning scenery.",
    imageUrl: "../assets/racing-spots/redbullring.jpg",
    country: "Austria",
    region: "Europe",
    status: "current"
  },
  {
    id: 9,
    spotName: "Baku City Circuit",
    description: "High-speed street circuit featuring a mix of tight corners and long straights.",
    imageUrl: "../assets/racing-spots/baku.jpg",
    country: "Azerbaijan",
    region: "Europe",
    status: "current"
  },
  // Current F1 Circuits - Americas
  {
    id: 10,
    spotName: "Circuit of the Americas",
    description: "Modern F1 circuit featuring challenging elevation changes and technical sections.",
    imageUrl: "../assets/racing-spots/cota.jpg",
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 11,
    spotName: "Miami International Autodrome",
    description: "New street circuit around Hard Rock Stadium complex.",
    imageUrl: "../assets/racing-spots/miami.jpg",
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 12,
    spotName: "Las Vegas Strip Circuit",
    description: "Night race through the iconic Las Vegas Strip.",
    imageUrl: "../assets/racing-spots/lasvegas.jpg",
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 13,
    spotName: "Autódromo Hermanos Rodríguez",
    description: "High-altitude circuit with passionate fans and unique stadium section.",
    imageUrl: "../assets/racing-spots/mexico.jpg",
    country: "Mexico",
    region: "Americas",
    status: "current"
  },
  {
    id: 14,
    spotName: "Interlagos",
    description: "Autódromo José Carlos Pace, known for producing exciting races and unpredictable weather.",
    imageUrl: "../assets/racing-spots/interlagos.jpg",
    country: "Brazil",
    region: "Americas",
    status: "current"
  },
  {
    id: 15,
    spotName: "Circuit Gilles Villeneuve",
    description: "Fast street circuit on an island, known for its 'Wall of Champions'.",
    imageUrl: "../assets/racing-spots/villeneuve.jpg",
    country: "Canada",
    region: "Americas",
    status: "current"
  },
  // Current F1 Circuits - Asia & Middle East
  {
    id: 16,
    spotName: "Shanghai International Circuit",
    description: "Modern facility with unique layout featuring demanding corner combinations.",
    imageUrl: "../assets/racing-spots/shanghai.jpg",
    country: "China",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 17,
    spotName: "Suzuka International Racing Course",
    description: "Figure-8 layout featuring the challenging 130R corner and rich F1 history.",
    imageUrl: "../assets/racing-spots/suzuka.jpg",
    country: "Japan",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 18,
    spotName: "Marina Bay Street Circuit",
    description: "Spectacular night race through the streets of Singapore.",
    imageUrl: "../assets/racing-spots/singapore.jpg",
    country: "Singapore",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 19,
    spotName: "Bahrain International Circuit",
    description: "Modern desert track hosting night races under floodlights.",
    imageUrl: "../assets/racing-spots/bahrain.jpg",
    country: "Bahrain",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 20,
    spotName: "Jeddah Corniche Circuit",
    description: "Ultra-fast street circuit along the Red Sea coast.",
    imageUrl: "../assets/racing-spots/jeddah.jpg",
    country: "Saudi Arabia",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 21,
    spotName: "Losail International Circuit",
    description: "Night race venue originally designed for MotoGP.",
    imageUrl: "../assets/racing-spots/losail.jpg",
    country: "Qatar",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 22,
    spotName: "Yas Marina Circuit",
    description: "Modern facility hosting the season finale under lights.",
    imageUrl: "../assets/racing-spots/yasmarina.jpg",
    country: "UAE",
    region: "Asia & Middle East",
    status: "current"
  },
  // Current F1 Circuits - Oceania
  {
    id: 23,
    spotName: "Albert Park Circuit",
    description: "Fast street circuit through Melbourne's parklands.",
    imageUrl: "../assets/racing-spots/melbourne.jpg",
    country: "Australia",
    region: "Oceania",
    status: "current"
  },
  // Upcoming Circuits
  {
    id: 24,
    spotName: "Madrid Racing Circuit",
    description: "New purpose-built facility set to host F1 from 2026, replacing Barcelona.",
    imageUrl: "../assets/racing-spots/madrid.jpg",
    country: "Spain",
    region: "Europe",
    status: "upcoming"
  },
  // Former Circuits - Europe
  {
    id: 25,
    spotName: "Nürburgring",
    description: "Legendary German circuit known for its challenging layout and unpredictable weather.",
    imageUrl: "../assets/racing-spots/nurburgring.jpg",
    country: "Germany",
    region: "Europe",
    status: "former"
  },
  {
    id: 26,
    spotName: "Hockenheimring",
    description: "Historic German track famous for its long straights through the forest.",
    imageUrl: "../assets/racing-spots/hockenheim.jpg",
    country: "Germany",
    region: "Europe",
    status: "former"
  },
  {
    id: 27,
    spotName: "Paul Ricard Circuit",
    description: "Modern test track with distinctive blue and red run-off areas.",
    imageUrl: "../assets/racing-spots/paulricard.jpg",
    country: "France",
    region: "Europe",
    status: "former"
  },
  {
    id: 28,
    spotName: "Magny-Cours",
    description: "Technical French circuit that hosted F1 from 1991 to 2008.",
    imageUrl: "../assets/racing-spots/magnycours.jpg",
    country: "France",
    region: "Europe",
    status: "former"
  },
  {
    id: 29,
    spotName: "Valencia Street Circuit",
    description: "Modern street circuit around Valencia's harbor area.",
    imageUrl: "../assets/racing-spots/valencia.jpg",
    country: "Spain",
    region: "Europe",
    status: "former"
  },
  {
    id: 30,
    spotName: "Brands Hatch",
    description: "Classic British circuit with challenging elevation changes.",
    imageUrl: "../assets/racing-spots/brandshatch.jpg",
    country: "UK",
    region: "Europe",
    status: "former"
  },
  {
    id: 31,
    spotName: "Donington Park",
    description: "Historic British track that nearly hosted F1 in 2010.",
    imageUrl: "../assets/racing-spots/donington.jpg",
    country: "UK",
    region: "Europe",
    status: "former"
  },
  {
    id: 32,
    spotName: "Estoril Circuit",
    description: "Portuguese circuit known for its challenging layout and coastal winds.",
    imageUrl: "../assets/racing-spots/estoril.jpg",
    country: "Portugal",
    region: "Europe",
    status: "former"
  },
  {
    id: 33,
    spotName: "Jarama Circuit",
    description: "Technical Spanish circuit that hosted F1 in the 1970s and early 1980s.",
    imageUrl: "../assets/racing-spots/jarama.jpg",
    country: "Spain",
    region: "Europe",
    status: "former"
  },
  {
    id: 34,
    spotName: "Pescara Circuit",
    description: "Longest F1 track ever at 25.8 km, hosted one championship race in 1957.",
    imageUrl: "../assets/racing-spots/pescara.jpg",
    country: "Italy",
    region: "Europe",
    status: "former"
  },
  // Former Circuits - Americas
  {
    id: 35,
    spotName: "Indianapolis Motor Speedway",
    description: "Historic oval track with infield road course section.",
    imageUrl: "../assets/racing-spots/indianapolis.jpg",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 36,
    spotName: "Long Beach Street Circuit",
    description: "Iconic street circuit that hosted F1 in the late 1970s and early 1980s.",
    imageUrl: "../assets/racing-spots/longbeach.jpg",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 37,
    spotName: "Detroit Street Circuit",
    description: "Challenging street circuit through downtown Detroit.",
    imageUrl: "../assets/racing-spots/detroit.jpg",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 38,
    spotName: "Phoenix Street Circuit",
    description: "Short-lived street circuit in the Arizona heat.",
    imageUrl: "../assets/racing-spots/phoenix.jpg",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 39,
    spotName: "Watkins Glen International",
    description: "Historic road course that hosted F1 for 20 years.",
    imageUrl: "../assets/racing-spots/watkinsglen.jpg",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 40,
    spotName: "Caesar's Palace Circuit",
    description: "Temporary circuit in Las Vegas casino parking lot (1981-82).",
    imageUrl: "../assets/racing-spots/caesarspalace.jpg",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 41,
    spotName: "Autódromo Juan y Oscar Gálvez",
    description: "Argentine circuit that hosted F1 from 1953 to 1998.",
    imageUrl: "../assets/racing-spots/galvez.jpg",
    country: "Argentina",
    region: "Americas",
    status: "former"
  },
  // Former Circuits - Asia & Middle East
  {
    id: 42,
    spotName: "Sepang International Circuit",
    description: "Modern Malaysian circuit known for its challenging layout and tropical weather.",
    imageUrl: "../assets/racing-spots/sepang.jpg",
    country: "Malaysia",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 43,
    spotName: "Korea International Circuit",
    description: "Purpose-built facility that briefly hosted F1 from 2010 to 2013.",
    imageUrl: "../assets/racing-spots/korea.jpg",
    country: "South Korea",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 44,
    spotName: "Buddh International Circuit",
    description: "Modern Indian circuit that hosted F1 from 2011 to 2013.",
    imageUrl: "../assets/racing-spots/buddh.jpg",
    country: "India",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 45,
    spotName: "Fuji Speedway",
    description: "Historic Japanese circuit in the shadow of Mount Fuji.",
    imageUrl: "../assets/racing-spots/fuji.jpg",
    country: "Japan",
    region: "Asia & Middle East",
    status: "former"
  },
  // Former Circuits - Africa
  {
    id: 46,
    spotName: "Kyalami Circuit",
    description: "South African circuit that hosted F1 during the apartheid era.",
    imageUrl: "../assets/racing-spots/kyalami.jpg",
    country: "South Africa",
    region: "Africa",
    status: "former"
  },
  // Former Circuits - Oceania
  {
    id: 47,
    spotName: "Adelaide Street Circuit",
    description: "Former Australian GP venue known for its street circuit character and exciting races.",
    imageUrl: "../assets/racing-spots/adelaide.jpg",
    country: "Australia",
    region: "Oceania",
    status: "former"
  }
]; 