import Circuit_de_Catalunya from '../assets/racing-spots/Circuit_de_Catalunya.svg.png';
import RedBullRing from '../assets/racing-spots/Red Bull Ring.svg.png';
import Baku from '../assets/racing-spots/Baku.svg.png';
import Americas from '../assets/racing-spots/Americas.svg.png';
import Miami from '../assets/racing-spots/Miami.svg.png';
import LasVegas from '../assets/racing-spots/Las_Vegas_Strip.png';
import Bahrain from '../assets/racing-spots/Bahrain_International.svg.png';
import Jeddah from '../assets/racing-spots/Jeddah.svg.png';
import Losail from '../assets/racing-spots/Losail.svg.png';
import YasMarina from '../assets/racing-spots/Yas_Marina.png';
import AlbertPark from '../assets/racing-spots/Albert_Park.svg.png';
import Madrid from '../assets/racing-spots/Circuit_de_Catalunya.svg.png';
import WatkinsGlen from '../assets/racing-spots/Watkins_Glen.png';
import CaesarsPalace from '../assets/racing-spots/Caesars_Palace.png';
import AutodromoGalvez from '../assets/racing-spots/Autódromo Oscar y Juan Gálvez.svg.png';
import Sepang from '../assets/racing-spots/Sepang.svg.png';
import Korea from '../assets/racing-spots/Korea_international.svg.png';
import Buddh from '../assets/racing-spots/Buddh.svg.png';
import Silverstone from '../assets/racing-spots/Silverstone.png';
import SpaFrancorchamps from '../assets/racing-spots/Spa-Francorchamps.svg.png';
import Hungaroring from '../assets/racing-spots/Hungaroring.svg.png';
import Zandvoort from '../assets/racing-spots/Zandvoort.png';
import Monza from '../assets/racing-spots/Monza.svg.png';
import Imola from '../assets/racing-spots/Imola.svg.png';
import HermanosRodriguez from '../assets/racing-spots/Autódromo_Hermanos_Rodríguez.svg.png';
import Interlagos from '../assets/racing-spots/Interlagos.svg.png';
import Gilles from '../assets/racing-spots/Gilles.svg.png';
import Shanghai from '../assets/racing-spots/Shanghai_International_Racing.svg.png';
import Suzuka from '../assets/racing-spots/Suzuka.svg.png';
import MarinaBay from '../assets/racing-spots/Marina_Bay.svg.png';
import Nurburgring from '../assets/racing-spots/Nürburgring.svg.png';
import Hockenheim from '../assets/racing-spots/Hockenheim.svg.png';
import PaulRicard from '../assets/racing-spots/PaulRicard.svg.png';
import MagnyCours from '../assets/racing-spots/Magny-Cours.svg.png';
import Valencia from '../assets/racing-spots/Valencia.svg.png';
import BrandsHatch from '../assets/racing-spots/Brands_Hatch.svg.png';
import DoningtonPark from '../assets/racing-spots/DoningtonPark.svg.png';
import Estoril from '../assets/racing-spots/Estoril.png';
import Jarama from '../assets/racing-spots/Jarama.svg.png';
import Pescara from '../assets/racing-spots/Pescara.svg.png';
import Indianapolis from '../assets/racing-spots/IndianapolisMotorSpeedway.svg.png';
import LongBeach from '../assets/racing-spots/LongBeach.jpg';
import Detroit from '../assets/racing-spots/Detroit Street.svg.png';
import Phoenix from '../assets/racing-spots/Phoenix.svg.png';
import Fuji from '../assets/racing-spots/Fuji.svg.png';
import Kyalami from '../assets/racing-spots/Kyalami.png';
import Adelaide from '../assets/racing-spots/Adelaide.svg.png';

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
    imageUrl: Silverstone,
    country: "UK",
    region: "Europe",
    status: "current"
  },
  {
    id: 2,
    spotName: "Circuit de Spa-Francorchamps",
    description: "One of the most challenging and historic circuits in F1, home to the famous Eau Rouge corner.",
    imageUrl: SpaFrancorchamps,
    country: "Belgium",
    region: "Europe",
    status: "current"
  },
  {
    id: 3,
    spotName: "Hungaroring",
    description: "A tight and twisty circuit known for its technical challenges and hot summer races.",
    imageUrl: Hungaroring,
    country: "Hungary",
    region: "Europe",
    status: "current"
  },
  {
    id: 4,
    spotName: "Circuit Zandvoort",
    description: "A historic track revived for modern F1, featuring unique banked corners and coastal location.",
    imageUrl: Zandvoort,
    country: "Netherlands",
    region: "Europe",
    status: "current"
  },
  {
    id: 5,
    spotName: "Autodromo Nazionale Monza",
    description: "Known as the 'Temple of Speed', famous for its high-speed straights and rich racing heritage.",
    imageUrl: Monza,
    country: "Italy",
    region: "Europe",
    status: "current"
  },
  {
    id: 6,
    spotName: "Imola Circuit",
    description: "Autodromo Enzo e Dino Ferrari, a challenging circuit with rich motorsport history.",
    imageUrl: Imola,
    country: "Italy",
    region: "Europe",
    status: "current"
  },
  {
    id: 7,
    spotName: "Circuit de Barcelona-Catalunya",
    description: "Technical circuit that tests both car and driver, moving to Madrid in 2026.",
    imageUrl: Circuit_de_Catalunya,
    country: "Spain",
    region: "Europe",
    status: "current"
  },
  {
    id: 8,
    spotName: "Red Bull Ring",
    description: "Fast, flowing circuit in the Styrian mountains with stunning scenery.",
    imageUrl: RedBullRing,
    country: "Austria",
    region: "Europe",
    status: "current"
  },
  {
    id: 9,
    spotName: "Baku City Circuit",
    description: "High-speed street circuit featuring a mix of tight corners and long straights.",
    imageUrl: Baku,
    country: "Azerbaijan",
    region: "Europe",
    status: "current"
  },
  // Current F1 Circuits - Americas
  {
    id: 10,
    spotName: "Circuit of the Americas",
    description: "Modern F1 circuit featuring challenging elevation changes and technical sections.",
    imageUrl: Americas,
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 11,
    spotName: "Miami International Autodrome",
    description: "New street circuit around Hard Rock Stadium complex.",
    imageUrl: Miami,
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 12,
    spotName: "Las Vegas Strip Circuit",
    description: "Night race through the iconic Las Vegas Strip.",
    imageUrl: LasVegas,
    country: "USA",
    region: "Americas",
    status: "current"
  },
  {
    id: 13,
    spotName: "Autódromo Hermanos Rodríguez",
    description: "High-altitude circuit with passionate fans and unique stadium section.",
    imageUrl: HermanosRodriguez,
    country: "Mexico",
    region: "Americas",
    status: "current"
  },
  {
    id: 14,
    spotName: "Interlagos",
    description: "Autódromo José Carlos Pace, known for producing exciting races and unpredictable weather.",
    imageUrl: Interlagos,
    country: "Brazil",
    region: "Americas",
    status: "current"
  },
  {
    id: 15,
    spotName: "Circuit Gilles Villeneuve",
    description: "Fast street circuit on an island, known for its 'Wall of Champions'.",
    imageUrl: Gilles,
    country: "Canada",
    region: "Americas",
    status: "current"
  },
  // Current F1 Circuits - Asia & Middle East
  {
    id: 16,
    spotName: "Shanghai International Circuit",
    description: "Modern facility with unique layout featuring demanding corner combinations.",
    imageUrl: Shanghai,
    country: "China",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 17,
    spotName: "Suzuka International Racing Course",
    description: "Figure-8 layout featuring the challenging 130R corner and rich F1 history.",
    imageUrl: Suzuka,
    country: "Japan",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 18,
    spotName: "Marina Bay Street Circuit",
    description: "Spectacular night race through the streets of Singapore.",
    imageUrl: MarinaBay,
    country: "Singapore",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 19,
    spotName: "Bahrain International Circuit",
    description: "Modern desert track hosting night races under floodlights.",
    imageUrl: Bahrain,
    country: "Bahrain",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 20,
    spotName: "Jeddah Corniche Circuit",
    description: "Ultra-fast street circuit along the Red Sea coast.",
    imageUrl: Jeddah,
    country: "Saudi Arabia",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 21,
    spotName: "Losail International Circuit",
    description: "Night race venue originally designed for MotoGP.",
    imageUrl: Losail,
    country: "Qatar",
    region: "Asia & Middle East",
    status: "current"
  },
  {
    id: 22,
    spotName: "Yas Marina Circuit",
    description: "Modern facility hosting the season finale under lights.",
    imageUrl: YasMarina,
    country: "UAE",
    region: "Asia & Middle East",
    status: "current"
  },
  // Current F1 Circuits - Oceania
  {
    id: 23,
    spotName: "Albert Park Circuit",
    description: "Fast street circuit through Melbourne's parklands.",
    imageUrl: AlbertPark,
    country: "Australia",
    region: "Oceania",
    status: "current"
  },
  // Upcoming Circuits
  {
    id: 24,
    spotName: "Madrid Racing Circuit",
    description: "New state-of-the-art circuit set to host F1 from 2026, replacing Barcelona.",
    imageUrl: Madrid,
    country: "Spain",
    region: "Europe",
    status: "upcoming"
  },
  // Former Circuits - Europe
  {
    id: 25,
    spotName: "Nürburgring",
    description: "Legendary German circuit known for its challenging layout and unpredictable weather.",
    imageUrl: Nurburgring,
    country: "Germany",
    region: "Europe",
    status: "former"
  },
  {
    id: 26,
    spotName: "Hockenheimring",
    description: "Historic German track famous for its long straights through the forest.",
    imageUrl: Hockenheim,
    country: "Germany",
    region: "Europe",
    status: "former"
  },
  {
    id: 27,
    spotName: "Paul Ricard Circuit",
    description: "Modern test track with distinctive blue and red run-off areas.",
    imageUrl: PaulRicard,
    country: "France",
    region: "Europe",
    status: "former"
  },
  {
    id: 28,
    spotName: "Magny-Cours",
    description: "Technical French circuit that hosted F1 from 1991 to 2008.",
    imageUrl: MagnyCours,
    country: "France",
    region: "Europe",
    status: "former"
  },
  {
    id: 29,
    spotName: "Valencia Street Circuit",
    description: "Modern street circuit around Valencia's harbor area.",
    imageUrl: Valencia,
    country: "Spain",
    region: "Europe",
    status: "former"
  },
  {
    id: 30,
    spotName: "Brands Hatch",
    description: "Classic British circuit with challenging elevation changes.",
    imageUrl: BrandsHatch,
    country: "UK",
    region: "Europe",
    status: "former"
  },
  {
    id: 31,
    spotName: "Donington Park",
    description: "Historic British track that nearly hosted F1 in 2010.",
    imageUrl: DoningtonPark,
    country: "UK",
    region: "Europe",
    status: "former"
  },
  {
    id: 32,
    spotName: "Estoril Circuit",
    description: "Portuguese circuit known for its challenging layout and coastal winds.",
    imageUrl: Estoril,
    country: "Portugal",
    region: "Europe",
    status: "former"
  },
  {
    id: 33,
    spotName: "Jarama Circuit",
    description: "Technical Spanish circuit that hosted F1 in the 1970s and early 1980s.",
    imageUrl: Jarama,
    country: "Spain",
    region: "Europe",
    status: "former"
  },
  {
    id: 34,
    spotName: "Pescara Circuit",
    description: "Longest F1 track ever at 25.8 km, hosted one championship race in 1957.",
    imageUrl: Pescara,
    country: "Italy",
    region: "Europe",
    status: "former"
  },
  // Former Circuits - Americas
  {
    id: 35,
    spotName: "Indianapolis Motor Speedway",
    description: "Historic oval track with infield road course section.",
    imageUrl: Indianapolis,
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 36,
    spotName: "Long Beach Street Circuit",
    description: "Iconic street circuit that hosted F1 in the late 1970s and early 1980s.",
    imageUrl: LongBeach,
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 37,
    spotName: "Detroit Street Circuit",
    description: "Challenging street circuit through downtown Detroit.",
    imageUrl: Detroit,
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 38,
    spotName: "Phoenix Street Circuit",
    description: "Short-lived street circuit in the Arizona heat.",
    imageUrl: Phoenix,
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 39,
    spotName: "Watkins Glen International",
    description: "Historic road course that hosted F1 for 20 years.",
    imageUrl: WatkinsGlen,
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 40,
    spotName: "Caesar's Palace Circuit",
    description: "Temporary circuit in Las Vegas casino parking lot (1981-82).",
    imageUrl: CaesarsPalace,
    country: "USA",
    region: "Americas",
    status: "former"
  },
  {
    id: 41,
    spotName: "Autódromo Juan y Oscar Gálvez",
    description: "Argentine circuit that hosted F1 from 1953 to 1998.",
    imageUrl: AutodromoGalvez,
    country: "Argentina",
    region: "Americas",
    status: "former"
  },
  // Former Circuits - Asia & Middle East
  {
    id: 42,
    spotName: "Sepang International Circuit",
    description: "Modern Malaysian circuit known for its challenging layout and tropical weather.",
    imageUrl: Sepang,
    country: "Malaysia",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 43,
    spotName: "Korea International Circuit",
    description: "Purpose-built facility that briefly hosted F1 from 2010 to 2013.",
    imageUrl: Korea,
    country: "South Korea",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 44,
    spotName: "Buddh International Circuit",
    description: "Modern Indian circuit that hosted F1 from 2011 to 2013.",
    imageUrl: Buddh,
    country: "India",
    region: "Asia & Middle East",
    status: "former"
  },
  {
    id: 45,
    spotName: "Fuji Speedway",
    description: "Historic Japanese circuit in the shadow of Mount Fuji.",
    imageUrl: Fuji,
    country: "Japan",
    region: "Asia & Middle East",
    status: "former"
  },
  // Former Circuits - Africa
  {
    id: 46,
    spotName: "Kyalami Circuit",
    description: "South African circuit that hosted F1 during the apartheid era.",
    imageUrl: Kyalami,
    country: "South Africa",
    region: "Africa",
    status: "former"
  },
  // Former Circuits - Oceania
  {
    id: 47,
    spotName: "Adelaide Street Circuit",
    description: "Former Australian GP venue known for its street circuit character and exciting races.",
    imageUrl: Adelaide,
    country: "Australia",
    region: "Oceania",
    status: "former"
  }
]; 