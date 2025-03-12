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
    imageUrl: "/src/assets/racing-spots/Silverstone.png",
    country: "UK",
    region: "Europe",
    status: "current"
  },
  {
    id: 2,
    spotName: "Circuit de Spa-Francorchamps",
    description: "One of the most challenging and historic circuits in F1, home to the famous Eau Rouge corner.",
    imageUrl: "/src/assets/racing-spots/Spa-Francorchamps.svg.png",
    country: "Belgium",
    region: "Europe",
    status: "current"
  },
  {
    id: 3,
    spotName: "Hungaroring",
    description: "A tight and twisty circuit known for its technical challenges and hot summer races.",
    imageUrl: "/src/assets/racing-spots/Hungaroring.svg.png",
    country: "Hungary",
    region: "Europe",
    status: "current"
  },
  {
    id: 4,
    spotName: "Circuit Zandvoort",
    description: "A historic track revived for modern F1, featuring unique banked corners and coastal location.",
    imageUrl: "/src/assets/racing-spots/Zandvoort.png",
    country: "Netherlands",
    region: "Europe",
    status: "current"
  },
  {
    id: 5,
    spotName: "Autodromo Nazionale Monza",
    description: "Known as the 'Temple of Speed', famous for its high-speed straights and rich racing heritage.",
    imageUrl: "/src/assets/racing-spots/Monza.svg.png",
    country: "Italy",
    region: "Europe",
    status: "current"
  },
  {
    id: 6,
    spotName: "Imola Circuit",
    description: "Autodromo Enzo e Dino Ferrari, a challenging circuit with rich motorsport history.",
    imageUrl: "/src/assets/racing-spots/Imola.svg.png",
    country: "Italy",
    region: "Europe",
    status: "current"
  },
  {
    id: 7,
    spotName: "Circuit de Barcelona-Catalunya",
    description: "Technical circuit that tests both car and driver, moving to Madrid in 2026.",
    imageUrl: "/src/assets/racing-spots/Circuit_de_Catalunya.svg.png",
    country: "Spain",
    region: "Europe",
    status: "current"
  },
  {
    id: 8,
    spotName: "Red Bull Ring",
    description: "Fast, flowing circuit in the Styrian mountains with stunning scenery.",
    imageUrl: "/src/assets/racing-spots/Red Bull Ring.svg.png",
    country: "Austria",
    region: "Europe",
    status: "current"
  },
  {
    id: 9,
    spotName: "Baku City Circuit",
    description: "High-speed street circuit featuring a mix of tight corners and long straights.",
    imageUrl: "/src/assets/racing-spots/Baku.svg.png",
    country: "Azerbaijan",
    region: "Europe",
    status: "current"
  },
  // Current F1 Circuits - Americas
  {
    id: 10,
    spotName: "Circuit of the Americas",
    description: "Modern F1 circuit featuring challenging elevation changes and technical sections.",
    imageUrl: "/src/assets/racing-spots/Americas.svg.png",
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 11,
    spotName: "Miami International Autodrome",
    description: "New street circuit around Hard Rock Stadium complex.",
    imageUrl: "/src/assets/racing-spots/Miami.svg.png",
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 12,
    spotName: "Las Vegas Strip Circuit",
    description: "Night race through the iconic Las Vegas Strip.",
    imageUrl: "/src/assets/racing-spots/Las_Vegas_Strip.png",
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 13,
    spotName: "Autódromo Hermanos Rodríguez",
    description: "High-altitude circuit with passionate fans and unique stadium section.",
    imageUrl: "/src/assets/racing-spots/Autódromo_Hermanos_Rodríguez.svg.png",
    country: "Mexico",
    region: "Americas",
    status: "current"
  },
  {
    id: 14,
    spotName: "Interlagos",
    description: "Autódromo José Carlos Pace, known for producing exciting races and unpredictable weather.",
    imageUrl: "/src/assets/racing-spots/Interlagos.svg.png",
    country: "Brazil",
    region: "Americas",
    status: "current"
  },
  {
    id: 15,
    spotName: "Circuit Gilles Villeneuve",
    description: "Fast street circuit on an island, known for its 'Wall of Champions'.",
    imageUrl: "/src/assets/racing-spots/Gilles.svg.png",
    country: "Canada",
    region: "Americas",
    status: "current"
  },
  // Current F1 Circuits - Asia & Middle East
  {
    id: 16,
    spotName: "Shanghai International Circuit",
    description: "Modern facility with unique layout featuring demanding corner combinations.",
    imageUrl: "/src/assets/racing-spots/Shanghai_International_Racing.svg.png",
    country: "China",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 17,
    spotName: "Suzuka International Racing Course",
    description: "Figure-8 layout featuring the challenging 130R corner and rich F1 history.",
    imageUrl: "/src/assets/racing-spots/Suzuka.svg.png",
    country: "Japan",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 18,
    spotName: "Marina Bay Street Circuit",
    description: "Spectacular night race through the streets of Singapore.",
    imageUrl: "/src/assets/racing-spots/Marina_Bay.svg.png",
    country: "Singapore",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 19,
    spotName: "Bahrain International Circuit",
    description: "Modern desert track hosting night races under floodlights.",
    imageUrl: "/src/assets/racing-spots/Bahrain_International.svg.png",
    country: "Bahrain",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 20,
    spotName: "Jeddah Corniche Circuit",
    description: "Ultra-fast street circuit along the Red Sea coast.",
    imageUrl: "/src/assets/racing-spots/Jeddah.svg.png",
    country: "Saudi Arabia",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 21,
    spotName: "Losail International Circuit",
    description: "Night race venue originally designed for MotoGP.",
    imageUrl: "/src/assets/racing-spots/Losail.svg.png",
    country: "Qatar",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 22,
    spotName: "Yas Marina Circuit",
    description: "Modern facility hosting the season finale under lights.",
    imageUrl: "/src/assets/racing-spots/Yas_Marina.png",
    country: "UAE",
    region: "Asia & Middle East",
    status: "current"
  },
  // Current F1 Circuits - Oceania
  {
    id: 23,
    spotName: "Albert Park Circuit",
    description: "Fast street circuit through Melbourne's parklands.",
    imageUrl: "/src/assets/racing-spots/Albert_Park.svg.png",
    country: "Australia",
    region: "Oceania",
    status: "current"
  },
  // Upcoming Circuits
  {
    id: 24,
    spotName: "Madrid Racing Circuit",
    description: "New purpose-built facility set to host F1 from 2026, replacing Barcelona.",
    imageUrl: "/src/assets/racing-spots/Madrid.avif",
    country: "Spain",
    region: "Europe",
    status: "upcoming"
  },
  // Former Circuits - Europe
  {
    id: 25,
    spotName: "Nürburgring",
    description: "Legendary German circuit known for its challenging layout and unpredictable weather.",
    imageUrl: "/src/assets/racing-spots/Nürburgring.svg.png",
    country: "Germany",
    region: "Europe",
    status: "former"
  },
  {
    id: 26,
    spotName: "Hockenheimring",
    description: "Historic German track famous for its long straights through the forest.",
    imageUrl: "/src/assets/racing-spots/Hockenheim.svg.png",
    country: "Germany",
    region: "Europe",
    status: "former"
  },
  {
    id: 27,
    spotName: "Paul Ricard Circuit",
    description: "Modern test track with distinctive blue and red run-off areas.",
    imageUrl: "/src/assets/racing-spots/PaulRicard.svg.png",
    country: "France",
    region: "Europe",
    status: "former"
  },
  {
    id: 28,
    spotName: "Magny-Cours",
    description: "Technical French circuit that hosted F1 from 1991 to 2008.",
    imageUrl: "/src/assets/racing-spots/Magny-Cours.svg.png",
    country: "France",
    region: "Europe",
    status: "former"
  },
  {
    id: 29,
    spotName: "Valencia Street Circuit",
    description: "Modern street circuit around Valencia's harbor area.",
    imageUrl: "/src/assets/racing-spots/Valencia.svg.png",
    country: "Spain",
    region: "Europe",
    status: "former"
  },
  {
    id: 30,
    spotName: "Brands Hatch",
    description: "Classic British circuit with challenging elevation changes.",
    imageUrl: "/src/assets/racing-spots/Brands_Hatch.svg.png",
    country: "UK",
    region: "Europe",
    status: "former"
  },
  {
    id: 31,
    spotName: "Donington Park",
    description: "Historic British track that nearly hosted F1 in 2010.",
    imageUrl: "/src/assets/racing-spots/DoningtonPark.svg.png",
    country: "UK",
    region: "Europe",
    status: "former"
  },
  {
    id: 32,
    spotName: "Estoril Circuit",
    description: "Portuguese circuit known for its challenging layout and coastal winds.",
    imageUrl: "/src/assets/racing-spots/Estoril.png",
    country: "Portugal",
    region: "Europe",
    status: "former"
  },
  {
    id: 33,
    spotName: "Jarama Circuit",
    description: "Technical Spanish circuit that hosted F1 in the 1970s and early 1980s.",
    imageUrl: "/src/assets/racing-spots/Jarama.svg.png",
    country: "Spain",
    region: "Europe",
    status: "former"
  },
  {
    id: 34,
    spotName: "Pescara Circuit",
    description: "Longest F1 track ever at 25.8 km, hosted one championship race in 1957.",
    imageUrl: "/src/assets/racing-spots/Pescara.svg.png",
    country: "Italy",
    region: "Europe",
    status: "former"
  },
  // Former Circuits - Americas
  {
    id: 35,
    spotName: "Indianapolis Motor Speedway",
    description: "Historic oval track with infield road course section.",
    imageUrl: "/src/assets/racing-spots/IndianapolisMotorSpeedway.svg.png",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 36,
    spotName: "Long Beach Street Circuit",
    description: "Iconic street circuit that hosted F1 in the late 1970s and early 1980s.",
    imageUrl: "/src/assets/racing-spots/LongBeach.jpg",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 37,
    spotName: "Detroit Street Circuit",
    description: "Challenging street circuit through downtown Detroit.",
    imageUrl: "/src/assets/racing-spots/Detroit Street.svg.png",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 38,
    spotName: "Phoenix Street Circuit",
    description: "Short-lived street circuit in the Arizona heat.",
    imageUrl: "/src/assets/racing-spots/Phoenix.svg.png",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 39,
    spotName: "Watkins Glen International",
    description: "Historic road course that hosted F1 for 20 years.",
    imageUrl: "/src/assets/racing-spots/Watkins_Glen.png",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 40,
    spotName: "Caesar's Palace Circuit",
    description: "Temporary circuit in Las Vegas casino parking lot (1981-82).",
    imageUrl: "/src/assets/racing-spots/Caesars_Palace.png",
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 41,
    spotName: "Autódromo Juan y Oscar Gálvez",
    description: "Argentine circuit that hosted F1 from 1953 to 1998.",
    imageUrl: "/src/assets/racing-spots/Autódromo Oscar y Juan Gálvez.svg.png",
    country: "Argentina",
    region: "Americas",
    status: "former"
  },
  // Former Circuits - Asia & Middle East
  {
    id: 42,
    spotName: "Sepang International Circuit",
    description: "Modern Malaysian circuit known for its challenging layout and tropical weather.",
    imageUrl: "/src/assets/racing-spots/Sepang.svg.png",
    country: "Malaysia",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 43,
    spotName: "Korea International Circuit",
    description: "Purpose-built facility that briefly hosted F1 from 2010 to 2013.",
    imageUrl: "/src/assets/racing-spots/Korea_international.svg.png",
    country: "South Korea",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 44,
    spotName: "Buddh International Circuit",
    description: "Modern Indian circuit that hosted F1 from 2011 to 2013.",
    imageUrl: "/src/assets/racing-spots/Buddh.svg.png",
    country: "India",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 45,
    spotName: "Fuji Speedway",
    description: "Historic Japanese circuit in the shadow of Mount Fuji.",
    imageUrl: "/src/assets/racing-spots/Fuji.svg.png",
    country: "Japan",
    region: "Asia & Middle East",
    status: "former"
  },
  // Former Circuits - Africa
  {
    id: 46,
    spotName: "Kyalami Circuit",
    description: "South African circuit that hosted F1 during the apartheid era.",
    imageUrl: "/src/assets/racing-spots/Kyalami.png",
    country: "South Africa",
    region: "Africa",
    status: "former"
  },
  // Former Circuits - Oceania
  {
    id: 47,
    spotName: "Adelaide Street Circuit",
    description: "Former Australian GP venue known for its street circuit character and exciting races.",
    imageUrl: "/src/assets/racing-spots/Adelaide.svg.png",
    country: "Australia",
    region: "Oceania",
    status: "former"
  }
]; 