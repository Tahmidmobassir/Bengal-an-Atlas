/**
 * Bengali Ethnic History — Timeline Data
 *
 * This module exposes a typed-like TimelineEvent collection.
 * Each event is an instance of TimelineEvent, giving us:
 *  - encapsulation (every event has the same surface)
 *  - O(1) lookup by id via the Map index
 *  - O(n) iteration for rendering
 *  - clear separation of CONTENT from PRESENTATION
 */

class TimelineEvent {
  constructor({
    id,
    order,
    year,
    dateDisplay,
    title,
    subtitle,
    track,        // 'shared' | 'bangladesh' | 'west-bengal'
    era,          // for chapter grouping
    summary,
    body,         // array of paragraphs
    quote,
    quoteAuthor,
    metrics = {}, // { population, bengaliSpeakers, gdp, etc. }
    media = [],   // { svg|emoji|gradient, caption, credit }
    disputed = null,
    sources = []
  }) {
    this.id = id;
    this.order = order;
    this.year = year;
    this.dateDisplay = dateDisplay;
    this.title = title;
    this.subtitle = subtitle;
    this.track = track;
    this.era = era;
    this.summary = summary;
    this.body = body;
    this.quote = quote;
    this.quoteAuthor = quoteAuthor;
    this.metrics = metrics;
    this.media = media;
    this.disputed = disputed;
    this.sources = sources;
  }
}

const TIMELINE = [
  new TimelineEvent({
    id: 'land-of-rivers',
    order: 0,
    year: -10000,
    dateDisplay: 'Before there were Bengalis',
    title: 'A Land Made of Water',
    subtitle: 'The geography that wrote the history',
    track: 'shared',
    era: 'geography',
    summary: 'Seven hundred rivers, the largest delta on Earth, soil so fertile it grows three crops a year. Every event in this story was decided by water before any human picked up a pen.',
    body: [
      'Bengal is what happens when two of the world\'s great rivers, the Ganges and the Brahmaputra, finish their three-thousand-kilometre journeys and braid into a single delta the size of the United Kingdom. Bangladesh alone has about seven hundred rivers and shares fifty-eight cross-border rivers, more than any country on Earth. The land is so flat that most of it sits less than ten metres above sea level. The delta is the largest in the world.',
      'This means three things. First, the silt the rivers deposit is among the most fertile soil on the planet. It is the reason Bengal could feed sixty million people in 1700 when most of Europe couldn\'t feed thirty. Second, the land floods. Every year, about two-thirds of Bangladesh\'s sixty-four districts go under during the monsoon. Third, the borders are absurd: when the British partitioned Bengal in 1947 they drew lines across a delta that doesn\'t hold still, leaving behind a knot of 162 enclaves, including Dahala Khagrabari, the world\'s only third-order enclave: India inside Bangladesh inside India inside Bangladesh.',
      'In 2015, India and Bangladesh finally swapped 162 of these enclaves and let the residents pick a nationality. But the deeper point stands: Bengal is not a place where you draw lines. It is a place where water decides. Empires that understood this prospered. Empires that didn\'t got swept out to sea.'
    ],
    quote: 'The Bengal delta is the largest delta in the world. Bangladesh has more trans-boundary rivers than anywhere on Earth.',
    quoteAuthor: 'Hydrological consensus',
    metrics: {
      rivers: '~700',
      transBoundary: '58',
      avgElevation: '<10 m',
      enclavesSwapped: '162 (2015)'
    },
    media: [{
      type: 'pattern',
      motif: 'delta-rivers-interactive'
    }],
    sources: ['Bangladesh Water Development Board', 'India-Bangladesh Land Boundary Agreement 2015']
  }),

  new TimelineEvent({
    id: 'chalcolithic',
    order: 1,
    year: -10000,
    dateDisplay: 'c. 10,000 – 1500 BC',
    title: 'Who Walked Here First',
    subtitle: 'The peopling of the delta',
    track: 'shared',
    era: 'origins',
    summary: 'The Bengali people are an alluvial deposit. They are made of at least four streams of human migration, separated by thousands of years and thousands of kilometres, all of which arrived at the same delta because the delta was where the rice grew.',
    body: [
      'The oldest hard archaeological evidence for humans on this soil is a scatter of small stone tools on the banks of the Damodar river, in a place called Birbhanpur, near the modern town of Durgapur. Excavated by the archaeologist B. B. Lal between 1954 and 1957, the site yielded thousands of microliths — flakes, blades, scrapers and lunates worked from quartz, rock crystal and chalcedony, some of them from fossilised wood — alongside post-holes that may once have anchored huts. The toolkit is mesolithic, roughly ten thousand to four thousand years old, and the people who made it were hunter-gatherers who fished the river, hunted the deer and wild pig of the surrounding sal forest, and left no name and no language we can read. Genetic studies place them in the lineage now called Ancient Ancestral South Indian, the deep substrate of the entire subcontinent, descended from the wave of modern humans that walked out of Africa some sixty-five thousand years ago and reached South Asia by following the coast. The same lineage is carried today by the Andamanese Islanders and the tribal peoples of central and southern India. Some thread of it runs in every Bengali alive.',
      'The first migration that changed the delta arrived from the east. Sometime between three and four thousand years ago, Austroasiatic-speaking peoples moved into eastern India from mainland Southeast Asia, probably down the Brahmaputra corridor, bringing with them the single most consequential introduction in Bengal\'s history: wet-rice cultivation. They were the ancestors of today\'s Munda peoples — the Santhals, Mundas, Kharias and Hos of the Chhotanagpur plateau and the Bengal hinterland — and the cousins of the Mon-Khmer-speaking populations of Cambodia, Laos and Vietnam. Without them there is no agrarian Bengal. The Bengali word for rice itself, dhan, sits inside an older Austroasiatic family of rice-words that runs east into Southeast Asia. Bengalis carry significantly more East and Southeast Asian ancestry than any other population in mainland South Asia, and this is where it comes from. Dravidian-speaking populations were sharing the region in the same period, contributing the second substrate.',
      'The third stream arrived from the opposite direction. Indo-Aryan-speaking groups began moving down the Gangetic plain from the northwest from about 1500 BC onward, bringing the Sanskrit-derived language family that would, after a thousand years of mixing with the Austroasiatic and Dravidian populations already there, become Bangla. The earliest Vedic texts knew the eastern delta as Vanga, and the Aryan compilers treated it as outside the civilised pale, a wet forested country of unruly peoples. Vanga eventually became Vangaal, then Bangla, then Bengal. From the north and east a fourth stream came down out of the hills: Tibeto-Burman speakers from the Brahmaputra valley and the eastern Himalayas, whose genetic and linguistic traces still concentrate in the Rajbanshi and Koch communities of northern Bengal. Later still, as the timeline ahead will record, came the Persians, Arabs, Turks, and Central Asians of the medieval Muslim centuries. Every wave folded into the previous one. None replaced the people already there. The Bengali genome is one of the most layered in South Asia.',
      'The chalcolithic settlement at Pandu Rajar Dhibi, on a mound by the Ajay river in what is now Purba Bardhaman, was excavated by P. C. Dasgupta between 1962 and 1985. It dates to around 1600 BC — late in this peopling story, not early — and gives us the best single window into what life looked like by the time the migrations had settled into farming villages. The people of Pandu Rajar Dhibi grew rice and pulses, smelted copper into rings and fish hooks and needles, fired black-and-red ware pottery, traded for lapis lazuli from somewhere far to the west, and may even have had contact with the Aegean. They built in mud and reed. They buried their dead with grave goods. They are not the first Bengalis in any meaningful sense — millennia of older inhabitants stand behind them — but they are the first whose lives we can reconstruct in detail. The structural fact of Bengal\'s population, then and now, is this: wet-rice agriculture, introduced by the Austroasiatic stream and refined over three millennia, let the delta carry a density of people no other Indian region could match. By 1700, Bengal would feed sixty million on the same soil where, in the time of Birbhanpur, a few thousand had hunted along the riverbanks. The rivers wrote the geography. The rice wrote the demography. The migrations wrote the people.'
    ],
    quote: 'Bengal is a fertile delta at the crossroads of South and Southeast Asia. It has always been a melting pot.',
    quoteAuthor: 'The contemporary historical consensus on the origins of the Bengali people',
    metrics: {
      oldestEvidence: 'Birbhanpur · c. 10,000 BC',
      austroasiaticArrival: 'c. 2000–1500 BC · from Southeast Asia',
      indoAryanArrival: 'c. 1500 BC onward · from the northwest',
      panduRajarDhibi: 'c. 1600 BC · type-site of chalcolithic Bengal',
      modernSubstrate: 'AASI · Austroasiatic · Dravidian · Indo-Aryan · Tibeto-Burman'
    },
    media: [{ type: 'pattern', motif: 'terracotta-pottery' }],
    sources: [
      'B. B. Lal, "Birbhanpur: A Microlithic Site in the Damodar Valley, West Bengal", Ancient India 14 (1958)',
      'Banglapedia: Birbhanpur',
      'Banglapedia: Pandu Rajar Dhibi',
      'P. C. Dasgupta excavations at Pandu Rajar Dhibi, 1962–65',
      'David Reich et al., Who We Are and How We Got Here: Ancient DNA and the New Science of the Human Past (2018)',
      'Vagheesh Narasimhan et al., "The formation of human populations in South and Central Asia", Science 365 (2019)'
    ]
  }),

  new TimelineEvent({
    id: 'gangaridai',
    order: 2,
    year: -326,
    dateDisplay: 'c. 326 BC',
    title: 'The Elephants of Gangaridai',
    subtitle: 'Alexander turns back',
    track: 'shared',
    era: 'origins',
    summary: 'Alexander of Macedon, having subdued all of Persia, refused to march on the Bengali kingdoms. They had four thousand war elephants.',
    body: [
      'Greek and Roman geographers wrote of a power in the lower Ganges delta called Gangaridai, a kingdom of cultivators, sailors, and elephants. Diodorus Siculus records that Alexander, who had subdued every empire on his eastern march, refused to give battle to the Gangaridae: "upon learning that the Gandaridae had four thousand elephants equipped for war he gave up his campaign against them."',
      'This is the first time Bengal appears in world history. Not as a province. As a power that even Alexander would not touch.'
    ],
    quote: 'Even Alexander refrained from making war upon the Gandaridae alone of all peoples.',
    quoteAuthor: 'Diodorus Siculus, Library of History',
    metrics: { warElephants: '4,000', alexander: 'turned back', firstMention: '326 BC' },
    media: [{
      type: 'photo',
      motif: 'elephant-frieze',
      image: 'gangaridai-elephants.png',
      caption: 'War elephants of Gangaridai, in a 19th-century engraving of Alexander\'s eastern campaign',
      credit: 'Public Domain · 19th-century European engraving'
    }],
    sources: ['Diodorus Siculus, Library', 'Megasthenes, Indica (fragments)']
  }),

  new TimelineEvent({
    id: 'mahasthangarh',
    order: 3,
    year: -300,
    dateDisplay: '3rd century BC – 12th century AD',
    title: 'Pundranagara',
    subtitle: 'The oldest city',
    track: 'shared',
    era: 'origins',
    summary: 'On the bank of the Karatoya river in what is now Bogra, a Mauryan administrator left a six-line stone inscription ordering grain be distributed to a famine-struck province. It is the oldest surviving written document from Bangladesh, and the city that produced it kept being a city for fifteen centuries.',
    body: [
      'Mahasthangarh sits thirteen kilometres north of Bogra town in northern Bangladesh, on the western bank of the Karatoya, a river that in the 3rd century BC was a main channel of the Brahmaputra and is now a thin stream. The citadel is an oblong plateau, fifteen hundred metres long north to south and fourteen hundred east to west, ringed by rampart walls of burnished brick that still rise six metres above the surrounding paddy. The bricks date from the Mauryan period. The walls have outlasted every empire that built on top of them. The city was sited where it was for two reasons, both practical: the Karatoya defended it on the east and deep moats on the other three sides did the rest, and the plateau itself is one of the few stretches of natural high ground in a country most of which lies under ten metres above the sea. This is the oldest urban site in Bengal, but not in South Asia: the Harappan cities of the Indus Valley, fifteen hundred kilometres to the west, had risen, peaked, and collapsed a thousand years before the first Mauryan brick was laid here. Bengal\'s urban history begins late, and begins on its own rivers.',
      'In 1931, archaeologists from the colonial Archaeological Survey of India recovered a small limestone slab inscribed with six lines in Prakrit, written in early Brahmi script. The dialect and lettering date it to the 3rd century BC, the reign of Ashoka. It is the oldest written document found in what is today Bangladesh. The text records an administrative order: a mahamatra, a senior royal officer posted to the prosperous city of Pudanagala (Pundranagara), is told to release sesame and mustard seeds from the royal stores and distribute them among the samvargikas, presumably an administrative caste, who have been struck by famine. The crops were to be stored back in the granary in the fortified area when the harvest recovered. The first recorded act of governance on Bengali soil is a government deciding which of its citizens get fed in a bad year.',
      'Pundranagara was the capital of Pundravardhana, the territory of the ancient Pundra people whose name was old enough to appear in the Mahabharata as one of the kingdoms that fought on the Kaurava side at Kurukshetra. The city served as a provincial capital under the Mauryans, the Guptas, the Palas, and the Senas, in continuous administrative use for roughly fifteen hundred years from the 4th century BC to the 12th century AD. The Chinese Buddhist pilgrim Xuanzang visited in the 640s and counted twenty Buddhist monasteries and three thousand monks in residence. Kautilya\'s Arthashastra, written before the city even existed in its Mauryan form, already mentions Paundrika patrorna, a fine silk from Pundra, and dukula, the fine cotton that would later become the muslin of Dhaka. Long-distance trade ran south through the river to the Bay of Bengal and onward; another road ran west to Pataliputra, the Mauryan capital. Inside the rampart and scattered through the villages around it, named mounds still mark the buried city: Govinda Bhita to the north, a Vishnu temple over an older Buddhist platform; Bairagir Bhita, two Gupta-period brick temples uncovered in the first dig; Mankalir Kund, a sacred tank; Khodar Pathar Bhita, "the stone-of-God platform"; the gigantic terraced stupa plinth Nani Gopal Majumdar exposed in 1934–36; and three kilometres east of the citadel, the legendary Lakshindar-er Medh, "Lakshindar\'s Mound," which Bengali folklore names as the iron-walled wedding chamber of the goddess Manasa\'s curse in the Behula-Lakhinder story.',
      'The site was forgotten for most of the second millennium. Local memory replaced history with legend: in the early 13th century the Sufi saint Shah Sultan Mahisawar, popularly called Balkhi, was said to have crossed the Karatoya on a giant fish-shaped boat and converted the last Hindu king of Mahasthan, the tyrant Parashuram. The saint\'s mazar still occupies the southeast corner of the citadel, alongside a Mughal mosque built under Farrukhsiyar in the early 18th century. The ruins were identified as the long-lost Pundranagara by Sir Alexander Cunningham in 1879 on the basis of Xuanzang\'s description. First excavation came in 1928–29 under K. N. Dikshit, who dug Bairagir Bhita, Govinda Bhita, and the bastion at Munir Ghon. Majumdar followed in 1934–36 with the stupa. Then nothing serious for fifty years. In 1993 a joint Bangladesh-France archaeological mission under Shafiqul Alam and Jean-François Salles began the first stratified excavation of the eastern rampart, peeling back eleven distinct occupation levels from the 4th century BC through the medieval period, dated by charcoal radiocarbon. SAARC declared Mahasthangarh the Cultural Capital of South Asia in 2016. Less than a tenth of the citadel has ever been dug. Most of the oldest city in Bangladesh is still under the grass.'
    ],
    quote: 'Sesame and mustard seeds from the royal granary, to be distributed among those struck by the famine.',
    quoteAuthor: 'The Mahasthan Brahmi Inscription, c. 3rd century BC',
    metrics: {
      citadel: '1,500m × 1,400m',
      rampartHeight: '~6m',
      occupied: 'c. 4th c. BC → 12th c. AD',
      oldestWriting: 'Mahasthan Brahmi Inscription, 1931 discovery',
      monasteries: '20 (per Xuanzang, 640s AD)',
      excavationLevels: '11 (1993–99 France–Bangladesh)',
      excavated: '<10% of citadel',
      saarcCapital: '2016'
    },
    media: [{
      type: 'photo',
      motif: 'mauryan-coin',
      image: 'mahasthangarh.png',
      caption: 'Rampart of the Mahasthangarh citadel, burnished Mauryan brick still standing under fifteen centuries of grass',
      credit: 'Public Domain · Archaeological Survey of Bangladesh'
    }],
    sources: ['Banglapedia: Mahasthan', 'Archaeological Survey of Bangladesh', 'Shafiqul Alam & Jean-François Salles (eds.), France-Bangladesh Joint Venture Excavations at Mahasthangarh: First Interim Report 1993–1999 (Dhaka, 2001)', 'Live History India: "Mahasthangarh"', 'Wikipedia: Mahasthangarh']
  }),

  new TimelineEvent({
    id: 'pala-empire',
    order: 4,
    year: 750,
    dateDisplay: '750 – 1161 AD',
    title: 'The Pala Buddhist Golden Age',
    subtitle: 'When Bengal taught the world',
    track: 'shared',
    era: 'medieval',
    summary: 'Gopala was elected by the people to end an age of anarchy. His dynasty built the universities that would carry Buddhism to Tibet.',
    body: [
      'After centuries of warlordism the chiefs of Gauda did something almost unique in early medieval South Asia: they elected a king. Gopala, a warrior of humble origin, was chosen around 750 AD to end the matsyanyaya, the rule of the fish, where the strong devour the weak. His dynasty would last four hundred years.',
      'Under Dharmapala and Devapala the Pala Empire became the dominant power of northern India. They built four great Buddhist universities (Vikramashila, Odantapuri, Jagaddala, and Somapura Mahavihara) and lavished patronage on Nalanda. The Pala monk Atisha Dipankara walked to Tibet in 1042 AD and refounded Tibetan Buddhism. The Pala bronze style was copied from Java to Yunnan.',
      'Somapura Mahavihara, in Paharpur, Bangladesh, a 21-acre brick complex with 177 monastic cells, survives as a UNESCO World Heritage Site. Visit it and you understand: this was once the largest Buddhist monastery south of the Himalayas.'
    ],
    quote: 'The matsyanyaya, where the strong devour the weak, was ended by the people\'s choice.',
    quoteAuthor: 'Khalimpur copper-plate inscription',
    metrics: { duration: '411 years', universities: '4', territory: 'Bengal → Punjab' },
    media: [{
      type: 'photo',
      motif: 'pala-bronze-buddha',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sompur%20Mahavihara,%20Naogaon,%20Bangladesh.jpg?width=800',
      caption: 'Somapura Mahavihara, Paharpur',
      credit: 'UNESCO World Heritage / Wikimedia · CC-BY-SA'
    }],
    sources: ['R.C. Majumdar, History of Bengal Vol I', 'UNESCO Somapura listing']
  }),

  new TimelineEvent({
    id: 'bakhtiyar',
    order: 5,
    year: 1204,
    dateDisplay: '1204 AD',
    title: 'Eighteen Horsemen',
    subtitle: 'Bakhtiyar Khalji and the end of Hindu Bengal',
    track: 'shared',
    era: 'medieval',
    summary: 'A Turko-Afghan general arrived at Nadia disguised as a horse-trader with eighteen men. The eighty-year-old king fled. But Bengal had already been touched by Islam for three hundred years before he arrived; what changed in 1204 was who held the throne.',
    body: [
      'Islam reached Bengal long before any army did. Arab merchants had been sailing into the port of Chittagong from the 9th century onward, and Persian traders followed them. Two Abbasid Caliphate gold dinars excavated at Paharpur in Rajshahi and Mainamati in Comilla confirm that Muslim traders were doing business in the Pala interior by the 8th or 9th century. The Arab geographer Al-Masudi visited the southeastern delta in the 10th century and recorded a thriving Muslim community in Samatata. In 1154 the Moroccan cartographer Al-Idrisi mapped a regular shipping route between Basra and Chittagong, connecting Bengal directly to Abbasid Baghdad. Sufi mystics who travelled with the traders settled in the port towns and the lower delta, marrying locally, building small communities that did not need a sultan\'s permission to exist. By the time the first Turkish cavalry crossed the Karatoya, Islam in Bengal was already three centuries old. It just was not yet at court.',
      'That changed when Ikhtiyar al-Din Muhammad Bakhtiyar Khalji rode in. He was a Turko-Afghan officer in the army of Muhammad of Ghor, the Ghurid sultan who had just finished dismantling the Ghaznavid dynasty that had ruled Lahore for two centuries. The Ghurids were themselves recent converts: their dynasty had switched from Buddhism to Islam at the beginning of the twelfth century. Bakhtiyar, ambitious and underutilised, was sent east. In 1204, according to the Tabaqat-i Nasiri, he slipped into the Sena capital of Nadia with a vanguard of just eighteen horsemen disguised as horse-traders. The Sena king Lakshmana Sena, then eighty years old, fled east to Bikrampur. The main Khalji force arrived hours later to find the city already taken.',
      'Bakhtiyar established his capital at Lakhnauti. His brief rule ended in 1206 when he died from wounds sustained in a disastrous invasion of Tibet. But the door had been opened in two directions at once. Buddhist monks from the great Pala universities, who had survived the centuries by adapting to whoever ruled, now fled east and north, carrying manuscripts and lineages with them into Nepal and Tibet, where Tibetan Buddhism would later credit them with its second flourishing. And from the west, in the wake of the Mongol invasions that were tearing apart the Persian world from the 1220s onward, refugees streamed east into Bengal: Persian scholars, Turkish soldiers, Central Asian Sufi orders, all of them clustering around the holy men whose tombs would become the new villages\' centre of gravity. Over the next five centuries, Bengal would become Muslim-majority in the east, and not by sword. By something far stranger: river-shifts, forest-clearance, and Sufi pioneers who picked up where the 9th-century traders had left off.'
    ],
    quote: 'He destroyed the city, killed the monks, and burned the books.',
    quoteAuthor: 'Minhaj-i Siraj, Tabaqat-i Nasiri (disputed)',
    metrics: { invaders: '18 horsemen', resistance: 'Minimal', senaCapital: 'Fell in hours', earliestArabTrade: '9th c. Chittagong', abbasidCoins: 'Paharpur + Mainamati' },
    disputed: 'The popular claim that Bakhtiyar destroyed Nalanda derives from the Tabaqat\'s description of a sacked "Bihar" (vihara), which many scholars now identify as Odantapuri, not Nalanda. The Sena dynasty also did not end in 1204: successors ruled at Bikrampur until c. 1245.',
    media: [{ type: 'pattern', motif: 'khalji-coin' }],
    sources: ['Minhaj-i Siraj, Tabaqat-i Nasiri', 'Richard M. Eaton, The Rise of Islam and the Bengal Frontier 1204–1760', 'Al-Masudi, The Meadows of Gold', 'Banglapedia: Islam in Bengal', 'History of Chittagong: Wikipedia']
  }),

  new TimelineEvent({
    id: 'bengal-sultanate',
    order: 6,
    year: 1342,
    dateDisplay: '1342 – 1576',
    title: 'The Bengal Sultanate',
    subtitle: 'When Bengali became the language of the throne',
    track: 'shared',
    era: 'medieval',
    summary: 'For two centuries Bengal was an independent sultanate: wealthy, multireligious, and the first state to make Bangla a court language.',
    body: [
      'Shamsuddin Ilyas Shah unified the three sultanates of Lakhnauti, Satgaon, and Sonargaon in 1352. For the next two centuries Bengal was independent of Delhi and one of the richest states on Earth. Chinese envoys of the Ming emperor came to call. The Ilyas Shahi sultans struck their own coins, built the Adina Mosque of Pandua (then the largest in the subcontinent), and crucially, they made Bengali a language of court patronage.',
      'Under Alauddin Hussain Shah (1494–1519) the Sultanate reached its zenith. He gave state protection to the Hindu Vaishnav saint Chaitanya, who started a devotional movement of Krishna-bhakti that still survives. Hindus called Hussain Shah "Lord Krishna in flesh." Bengali Muslims wrote poetry quoting the Bhagavata. The two religions, in this golden century, were not separate. They braided.',
      'The end came in two waves. In 1538 Sher Shah Suri, the Pashtun general who would briefly displace the Mughal Humayun from Delhi, marched into Gaur and absorbed Bengal into his short-lived Sur Empire. After his death his governors continued under various Afghan dynasties, the last of them the Karranis based at Tanda. On 12 July 1576, at the Battle of Rajmahal, the Mughal general Khan Jahan I defeated Daud Khan Karrani, the last Sultan of Bengal. Daud was beheaded on the field. Two hundred and twenty-four years of independent Bengal ended that afternoon, and Akbar\'s subah of Bengal began.'
    ],
    quote: 'The universal language in use was Bengali.',
    quoteAuthor: 'Ma Huan, Ming Chinese envoy, c. 1421',
    metrics: { duration: '224 years', dynasties: '5 (Ilyas Shahi, Ganesha, Hussain Shahi, Sur, Karrani)', capital: 'Gaur → Pandua → Sonargaon → Tanda', endedAt: 'Battle of Rajmahal, 12 July 1576' },
    media: [{
      type: 'photo',
      motif: 'adina-mosque',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sixty%20Dome%20Mosque%2C%20Bagerhat.jpg?width=800',
      caption: 'Sixty Dome Mosque, Bagerhat (15th c.)',
      credit: 'UNESCO World Heritage / Wikimedia · CC-BY-SA'
    }],
    sources: ['Abdul Karim, Social History of Bengal', 'Ma Huan, Ying-yai Sheng-lan']
  }),

  new TimelineEvent({
    id: 'mughal-islamization',
    order: 7,
    year: 1576,
    dateDisplay: '1576 – 1717',
    title: 'The River Moved East',
    subtitle: 'How East Bengal became Muslim',
    track: 'shared',
    era: 'medieval',
    summary: 'Sometime in the 16th century the Ganges shifted into the Padma channel. Mughal land grants followed. Sufi pioneers cleared the forest. This, not the sword, is why Bangladesh is Muslim.',
    body: [
      'Akbar annexed Bengal in 1576. For the first decades the subah was unruly: the Bengal subahdar Islam Khan Chishti finally pacified the eastern delta in 1610 by moving the capital from Rajmahal to a small fortified post on the Buriganga he renamed Jahangirnagar, after the Mughal emperor. Today we call it Dhaka. Under Shaista Khan, who governed twice (1664–1678 and 1680–1688), the city reached perhaps a million people, expelled the Portuguese pirates of Chittagong, drove out the Arakanese slave-raiders of the southeast, and built the Lalbagh Fort his daughter Pari Bibi would never finish living in. By 1700 the subah of Bengal produced twelve percent of global GDP and Aurangzeb called it "the paradise of nations."',
      'But the real revolution was geographic. Sometime in the 16th century the main channel of the Ganges shifted eastward into the Padma, opening the dense eastern delta to cultivation. Mughal officials issued tax-free taluq grants to charismatic Sufi pioneers, the pirs, who recruited indigenous forest-dwellers, cleared mangrove and sal forest, and built mosques as the new villages\' nucleus. The mosques doubled as schools, courts, granaries and meeting halls — the only stone-and-brick institution most of the village would see.',
      'Up to this point Islam in Bengal had been mostly a town religion. From the Khalji conquest onward it had been the faith of the court and the cantonment: of nobles, qazis, judges, soldiers and madrasa scholars who often claimed Arab or Persian descent and looked outward to the Islamic centres of the wider world. Five hundred years of Persianate administration left its deepest mark not on the religion but on the language. Modern Bangla absorbed roughly ten thousand Persian, Arabic and Turkic loanwords; about a quarter of the everyday vocabulary is foreign in origin. The lexicon itself is a record of who ruled. What happened on the agrarian frontier, meanwhile, was structurally different. Mughal-era mass paper production, cheap by previous standards, made it possible for the first time for the Quran and devotional poetry in Bengali to circulate as written objects rather than the property of memorisers. Islam moved from an oral, urban, foreign-claiming tradition into a written, rural, locally-rooted one. Over generations, Buddhists, low-caste Hindus, and animist forest peoples folded into this new agrarian Islamic core. There is no moment of conversion to point to. Today in the Sundarbans, the forest goddess Bonbibi is worshipped by Hindus and Muslims together. The Sufi tomb of Shah Jalal in Sylhet is a holy site to all faiths. This is the academic consensus, the historian Richard Eaton\'s thesis: Bengal\'s Islamization was an agrarian frontier process, not a conquest.'
    ],
    quote: 'The paradise of nations.',
    quoteAuthor: 'Emperor Aurangzeb, on Bengal',
    metrics: { globalGDP: '12%', dhakaFounded: '1610 by Islam Khan', dhakaPopulation: '~1 million by 1700', muslinExports: 'World\'s largest', shaista: 'Two terms, 1664–88' },
    media: [{
      type: 'photo',
      motif: 'river-shift',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lalbagh%20Fort%20front%20view%20at%20night.jpg?width=800',
      caption: 'Lalbagh Fort, Mughal Dhaka',
      credit: 'Wikimedia Commons · CC-BY-SA'
    }],
    sources: ['Richard M. Eaton, The Rise of Islam and the Bengal Frontier 1204–1760']
  }),

  new TimelineEvent({
    id: 'muslin',
    order: 7.5,
    year: 1700,
    dateDisplay: '17th–18th century',
    title: 'Woven Air',
    subtitle: 'Dhaka muslin, the fabric the British killed',
    track: 'shared',
    era: 'medieval',
    summary: 'The finest cloth in human history was woven on the banks of the Brahmaputra. A whole sari could be drawn through a wedding ring. Within fifty years of Plassey, the trade was dead and the cotton extinct.',
    body: [
      'Long before Bengal was a colony, it was a textile. Dhaka muslin, woven from a single endemic cotton called phuti karpas that grew only on the banks of the Meghna and lower Brahmaputra, reached thread counts of 800 to 1,200 warp threads per inch. Ordinary modern muslin runs 40 to 80. The 7th-century Chinese pilgrim Xuanzang said the cloth was like "the light vapours of dawn." A Mughal-era account claims Aurangzeb once scolded his daughter Zeb-un-Nisa for appearing in public wearing it, mistaking seven layers for indecency.',
      'By 1700 Dhaka was the capital of the worldwide muslin trade. The Dutch East India Company opened a factory there in 1663; the English followed in 1669; the French in 1682. In 1747 the muslin trade of Dhaka alone was valued at twenty-eight and a half lakh rupees. Empress Josephine in Paris wore Dhaka muslin chemises. The 1851 Great Exhibition in London displayed it as a wonder. This was a substantial slice of the 12% of global GDP that Mughal Bengal produced.',
      'Then the East India Company arrived as the state. After Plassey in 1757, Company agents enforced fixed prices, imprisoned weavers who sold to anyone else, and forbade the export of finished muslin in favour of cheaper Manchester-loomed imitations made from the same Bengali cotton. The merchant William Bolts, writing in 1772, described silk-winders cutting off their own thumbs to escape forced labour in Company workshops. Within a generation, the weavers had scattered, the phuti karpas plant had gone locally extinct, and the world\'s finest cloth could no longer be made. In 2013 a Bangladeshi team rediscovered phuti karpas seeds in a museum herbarium and began the long work of reviving the variety. UNESCO recognised the craft in 2013. The fabric they have managed to produce so far reaches a thread count of about 300.'
    ],
    quote: 'A piece of muslin, when laid on the grass and watered with the dew, could not be distinguished from it.',
    quoteAuthor: 'A 17th-century European traveller in Bengal',
    metrics: {
      threadCount: '800–1,200 / inch',
      modernMuslin: '40–80 / inch',
      tradeValue1747: '~28.5 lakh rupees',
      cottonStatus: 'Phuti karpas: extinct in wild by ~1850',
      revivalThreadCount: '~300 (2020s)'
    },
    media: [{
      type: 'photo',
      motif: 'muslin-woman',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Renaldis%20muslin%20woman.jpg?width=800',
      caption: 'Francesco Renaldi, "Muslim Lady Reclining," painted in Dhaka, 1789',
      credit: 'Yale Center for British Art · Public Domain'
    }],
    disputed: 'Popular Bengali accounts often say the British "cut off the thumbs of muslin weavers" to destroy the industry. The earliest source for the thumb-cutting story, William Bolts\'s 1772 Considerations on India Affairs, actually describes silk-winders (not muslin weavers) cutting off their own thumbs to escape forced labour. The systematic colonial destruction of the muslin industry is well-documented; the specific thumb-cutting detail is a later folk simplification of a more disturbing truth.',
    sources: ['William Bolts, Considerations on India Affairs (1772)', 'Banglapedia: "Muslin"', 'Saiful Islam, Muslin: Our Story (Drik, 2016)', 'V&A Museum collection records']
  }),

  new TimelineEvent({
    id: 'nawabs-murshidabad',
    order: 7.75,
    year: 1717,
    dateDisplay: '1717 – 1757',
    title: 'The Nawabs of Murshidabad',
    subtitle: 'When Bengal slipped its Mughal leash',
    track: 'shared',
    era: 'medieval',
    summary: 'After Aurangzeb died in 1707, Bengal\'s revenue minister stopped pretending he answered to Delhi. For forty years his line ruled the richest province on Earth from a new capital named after him, in everything but title independent, until the last of them lost it all in a single afternoon at Plassey.',
    body: [
      'Murshid Quli Khan was born a Deccani Brahmin named Surya Narayan Mishra and sold as a boy to a Mughal nobleman who took him to Persia and raised him as a son. He came back a Shia administrator with a reputation for revenue arithmetic so precise that Aurangzeb himself sent him to Bengal as diwan in 1701. Within a decade he had pushed the subahdar out of the province and merged the two highest offices, governor and chief tax collector, into his own person. In 1716 he moved the capital from Dhaka to a quieter town on the Bhagirathi called Makhsusabad. He renamed it Murshidabad. In 1717 Emperor Farrukhsiyar formally recognised him as hereditary Nawab Nazim of Bengal, Bihar, and Orissa. The Mughal still got an annual tribute. The Mughal got nothing else.',
      'Three Nawabs followed him in roughly forty years, each less interested in Delhi than the last. His son-in-law Shuja-ud-Din Khan (1727–1739) was lavish, polished, and indebted to the Jagat Seths, the Hindu Marwari banking family of Murshidabad who quietly became the richest commercial house in eighteenth-century Asia. Alivardi Khan (1740–1756) seized power in a coup against Shuja-ud-Din\'s son Sarfaraz, then spent his reign fighting Maratha cavalry raids out of the Deccan that depopulated western Bengal and gave the modern Bengali language its word for terror: bargi. Under all of them, Murshidabad grew into one of the biggest cities in the world, perhaps larger than London by mid-century. The Nawab held the army, the courts, the mint, and the foreign-trade licences. The European trading companies, the Dutch, French, and English, kept their warehouses at Bengal\'s pleasure.',
      'Alivardi\'s grandson Siraj-ud-Daulah inherited the throne at twenty-three in April 1756. He was the great-grandson of Murshid Quli, the last male of the line, and according to almost every contemporary source, he was unpopular. He had alienated his own court. His maternal aunt Ghaseti Begum hated him. His commander-in-chief Mir Jafar was already conspiring with the Jagat Seth bankers and the English East India Company before Siraj had finished his coronation. Five months in, Siraj marched on Calcutta to punish the Company for fortifying it without his permission and took the fort with little resistance. That night, in the so-called Black Hole, some number of British captives died in a small cell. The number disputed: probably twenty or so, the British said one hundred and twenty-three. The story travelled to London faster than any correction. Robert Clive sailed up from Madras with reinforcements. On 23 June 1757, on a mango grove at Plassey, Siraj\'s army of fifty thousand met Clive\'s three thousand. Mir Jafar held his cavalry in place. The battle was a fix. Siraj fled, was caught, was killed at twenty-four. The line of Murshid Quli ended in a province that, after that afternoon, would never again belong to anyone born in it.'
    ],
    quote: 'The Nawab\'s jurisdiction covered Bengal, Bihar, and Orissa. The Mughal\'s did not.',
    quoteAuthor: 'Yusuf Ali Khan, contemporary chronicler',
    metrics: {
      firstNawab: 'Murshid Quli Khan (r. 1717–27)',
      lastNawab: 'Siraj-ud-Daulah (r. 1756–57)',
      capital: 'Murshidabad',
      bankers: 'Jagat Seths (Asia\'s wealthiest)',
      maratha: 'Bargi raids 1741–51',
      collapse: 'Plassey, 23 June 1757'
    },
    media: [{ type: 'pattern', motif: 'nawabs-murshidabad' }],
    sources: ['Banglapedia: Murshid Quli Khan', 'Yusuf Ali Khan, Tarikh-i-Bangala-i-Mahabatjangi', 'William Dalrymple, The Anarchy (2019)', 'Sushil Chaudhury, The Prelude to Empire (2000)']
  }),

  new TimelineEvent({
    id: 'plassey',
    order: 8,
    year: 1757,
    dateDisplay: '23 June 1757',
    title: 'A Battle That Wasn\'t',
    subtitle: 'The Battle of Plassey',
    track: 'shared',
    era: 'colonial',
    summary: 'Siraj-ud-Daulah had 50,000 men. Robert Clive had 3,000. The Nawab\'s own commander stood and watched as British artillery killed loyal Bengalis. The "battle" lasted hours.',
    body: [
      'Siraj-ud-Daulah, the twenty-three-year-old Nawab of Bengal, had every advantage at the mango grove of Plassey: a larger army, more artillery, French officers, the home ground. He also had a traitor in his commander Mir Jafar, whom Robert Clive of the East India Company had bribed weeks earlier with the connivance of the Jagat Seth banking family.',
      'A monsoon downpour disabled the Nawab\'s French-officered cannons; the British covered theirs. Mir Jafar refused to move his division. Siraj fled and was murdered shortly after. Clive placed Mir Jafar on the throne, then quickly removed him. In 1765 the EIC took the diwani (the right to collect revenue) from the Mughal emperor for Bengal, Bihar, and Orissa. A trading company now ruled the richest province on Earth.'
    ],
    quote: 'What honour can a banker have?',
    quoteAuthor: 'Robert Clive, on Mir Jafar (apocryphal)',
    metrics: { nawabsArmy: '~50,000', britishForce: '~3,000', battleDuration: 'A few hours', bribePaid: '£234,000' },
    media: [{
      type: 'photo',
      motif: 'plassey-mango-grove',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Clive.jpg?width=800',
      caption: 'Clive meets Mir Jafar after Plassey · Francis Hayman, c. 1762',
      credit: 'National Portrait Gallery, London · Public Domain'
    }],
    sources: ['Britannica: Battle of Plassey', 'William Dalrymple, The Anarchy']
  }),

  new TimelineEvent({
    id: 'company-rule',
    order: 9,
    year: 1770,
    dateDisplay: '1770 – 1858',
    title: 'The Paradise Plundered',
    subtitle: 'The Bengal Famine of 1770 and the Permanent Settlement',
    track: 'shared',
    era: 'colonial',
    summary: 'Within thirteen years of taking power the East India Company presided over a famine that killed up to a third of Bengal. The richest province on Earth was systematically de-industrialized.',
    body: [
      'The Great Bengal Famine of 1770 killed somewhere between 1.2 and 10 million people. The higher figure is from the Company\'s own Court of Directors in May 1770. The Company continued to collect taxes throughout. Warren Hastings reported "violent" collection from survivors.',
      'In 1793, Cornwallis\'s Permanent Settlement turned Mughal-era tax-collecting zamindars into landowners with a fixed payment due to the Company. The cost fell on the peasants, who lost their customary rights. The new landowners, almost all Hindu, squeezed tenants who were overwhelmingly Muslim. A class divide hardened into a religious one. The seeds of 1947 were planted here.',
      'Bengal\'s muslin industry, once supplying half of Europe, was deliberately strangled by British tariffs and the forced replacement of fine cloth with raw cotton for Manchester mills. The economist Utsa Patnaik has calculated that Britain extracted $45 trillion from India between 1765 and 1938.'
    ],
    quote: 'My father, sir, was born in debt, grew in debt, and died in debt. I have inherited my father\'s debt and my son will inherit mine.',
    quoteAuthor: 'East Bengali peasant, 1929',
    metrics: { famineDeaths: '1.2M – 10M', britainExtracted: '$45 trillion (1765–1938)', muslinIndustry: 'Destroyed' },
    media: [{ type: 'pattern', motif: 'indigo-revolt' }],
    sources: ['Utsa Patnaik, Agrarian and Other Histories', 'Madhusree Mukerjee, Churchill\'s Secret War']
  }),

  new TimelineEvent({
    id: 'coxs-bazar',
    order: 9.5,
    year: 1799,
    dateDisplay: '1798 – 1799',
    title: 'Cox\'s Bazar',
    subtitle: 'A British captain dies running a refugee camp; the town keeps his name',
    track: 'shared',
    era: 'colonial',
    summary: 'In 1784 the Burmese army destroyed the Arakanese kingdom of Mrauk U and pushed roughly fifty thousand Buddhist Rakhine families across the Naf River into Company-controlled Bengal. The East India Company sent an obscure captain to settle them in a fishing outpost on the coast. He died a year later. They named the market for him. It is still there.',
    body: [
      'For three and a half centuries the kingdom of Mrauk U on the eastern shore of the Bay of Bengal had been one of the great trading states of the region. Its kings spoke Arakanese, patronised Buddhism, employed Bengali Muslim court officials, and minted coins with Persian script on one side and Burmese on the other. The kingdom traded with the Mughals, with Portuguese pirates, with the Dutch East India Company. Then in 1784 the Konbaung dynasty of Burma, expansionist and centralising, marched across the Arakan Yoma mountains and ended it. The capital fell. The Mahamuni Buddha, Mrauk U\'s holiest image, cast in the 2nd century, was carried back to Mandalay where it still sits in the Mahamuni temple, gold leaf flaking off every year by the kilo. Tens of thousands of Arakanese Buddhists fled north along the coast, crossing the Naf River into Bengal.',
      'Captain Hiram Cox was a thirty-eight-year-old officer of the East India Company who had served as Resident at the Konbaung court in Amarapura between 1796 and 1798 and had been recalled in some disgrace after a diplomatic row with the Burmese king. The Company, not quite knowing what to do with him next, gave him an unglamorous posting: superintend the resettlement of the Arakanese refugees camped in tents at a coastal fishing village called Palongkee, then sometimes Panowa, on the southeastern frontier of the Chittagong district. He arrived in late 1798 with orders to clear land, dig wells, and apportion plots. Within a year he was dead, probably of fever, on the job. The Company\'s gazette reported his death in a single line. To mark the work he had managed to finish, his colleagues named the local market Cox\'s Bazar. About forty to fifty thousand Arakanese had been resettled by then. Their descendants today are the Rakhine people of Bangladesh, still Buddhist, still speaking Arakanese, concentrated in Cox\'s Bazar and the surrounding hill tracts.',
      'The town that took his name grew up around the bazar. By the late twentieth century it had become Bangladesh\'s premier seaside destination, fronting onto what tourist boards claim is the world\'s longest unbroken natural beach: a hundred and twenty-five kilometres of sand running south from the town to the Naf estuary. Above the beach, the road from Chittagong runs through pine forests, hills, and a string of fishing villages. None of this, in 1799, anyone could have predicted. What the Company had built was a refugee camp. What grew from it was a town. The Naf River that the Arakanese had crossed remained the international border, first between Bengal and Burma, then between East Pakistan and Burma, then between Bangladesh and Myanmar. Two hundred and eighteen years after Captain Cox died, the same river would push another wave of refugees in the same direction. The religion would flip. The host would remain the same delta.'
    ],
    quote: 'He was a man of considerable industry and zeal in the public service.',
    quoteAuthor: 'East India Company gazette obituary of Hiram Cox, 1799',
    metrics: {
      mraukUFell: '1784',
      arakaneseResettled: '~40,000–50,000',
      captainCoxDied: 'On the job, 1799',
      townFounded: 'As a refugee resettlement project',
      beachLength: '125 km (claimed longest unbroken)'
    },
    media: [{
      type: 'photo',
      motif: 'coxs-bazar-refuge',
      image: 'coxs-bazar-beach.png',
      caption: 'The Bay of Bengal at Cox\'s Bazar — the coast Captain Cox was sent to in 1798 to resettle Arakanese Buddhists fleeing Burma',
      credit: 'Public Domain'
    }],
    sources: ['G. P. Ramachandra, "Captain Hiram Cox\'s Mission to Burma 1796–1798" (Journal of Southeast Asian Studies, 1980)', 'Banglapedia: "Cox, Hiram"', 'Banglapedia: "Rakhine community"', 'D. G. E. Hall, A History of South-East Asia']
  }),

  new TimelineEvent({
    id: 'renaissance',
    order: 10,
    year: 1828,
    dateDisplay: '19th century',
    title: 'The Bengal Renaissance',
    subtitle: 'Tagore, Bose, Roy, Vivekananda',
    track: 'shared',
    era: 'colonial',
    summary: 'In the same city that British power was administered from, a generation of Bengalis built modern Indian thought.',
    body: [
      'Raja Ram Mohan Roy fought to abolish sati and founded the Brahmo Samaj. Ishwar Chandra Vidyasagar pushed through widow remarriage. The University of Calcutta opened in 1857. Jagadish Chandra Bose demonstrated wireless radio transmission in 1895, two years before Marconi.',
      'And then, towering over everything, came Rabindranath Tagore. Four thousand poems. Two and a half thousand songs. Three thousand paintings. A novel that anticipated feminism by half a century. Two national anthems: India\'s Jana Gana Mana and Bangladesh\'s Amar Sonar Bangla. In 1913, the first non-European Nobel laureate in Literature. When the British massacred civilians at Amritsar in 1919, he returned his knighthood in disgust.',
      'The Renaissance was not unblemished. It was largely a Hindu upper-caste phenomenon, and its complicated relationship with Muslim Bengal would have consequences. But it set the terms for everything modern South Asia would become.'
    ],
    quote: 'Where the mind is without fear and the head is held high, into that heaven of freedom, my Father, let my country awake.',
    quoteAuthor: 'Rabindranath Tagore, Gitanjali',
    metrics: { tagoreWorks: '4,000+ poems', firstNonEuropeanNobel: '1913', boseRadio: '1895 (before Marconi)' },
    media: [{
      type: 'photo',
      motif: 'tagore-portrait',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rabindranath%20Tagore%20in%201909.jpg?width=800',
      caption: 'Rabindranath Tagore, 1909',
      credit: 'Wikimedia Commons · Public Domain'
    }],
    sources: ['Amartya Sen, The Argumentative Indian', 'Krishna Dutta & Andrew Robinson, Tagore: The Myriad-Minded Man']
  }),

  new TimelineEvent({
    id: 'lalon',
    order: 10.5,
    year: 1890,
    dateDisplay: '17 October 1890',
    title: 'Moner Manush',
    subtitle: 'Lalon Shah and the Baul tradition',
    track: 'shared',
    era: 'colonial',
    summary: 'A barely-literate mystic in a Kushtia village wrote two thousand songs that would shape Bengali culture more than any text in any university. His central claim: the divine lives inside the human being, and every wall between religions is a lie.',
    body: [
      'No one knows where Lalon Shah was born, or to whom, or in which faith. The story his followers tell begins with a farmer named Malam finding a half-drowned teenage boy on the muddy bank of the Kaliganga, a tributary of the Ganges that ran through Kushtia before it dried out. The boy was dying of smallpox. Malam and his wife Matijan, who had no children, carried him home and nursed him back. He lost an eye to the disease. He never went back to whatever family he had come from; or, in the version where he did, they would not let him in because he had eaten in a Muslim house. Either way, he stayed in Cheuriya, with Matijan, for the rest of his life, which was somewhere close to one hundred and sixteen years. He asked, on his deathbed, that her name be carved before his on the shrine. The patriarchy that he had spent six decades arguing against denied him even that.',
      'Over those decades he composed somewhere between two thousand and ten thousand songs. About eight hundred survive in trustworthy form. He left no manuscripts; they were transmitted voice to voice, written down later by disciples like Maniruddin Shah. The songs are theological poetry in the form of folk music, sung to ektara, dotara, and dubki. Their central image is the Moner Manush, the "Man of the Heart," the divine that lives not in the temple or the mosque but inside the human body itself. The most famous song asks, "Everyone wants to know what caste Lalon belongs to. I have never seen caste with these two eyes of mine. What mark does anyone carry when they are born, or when they die?" The second-most famous is the Achin Pakhi, the Unknown Bird: a bird flits in and out of a cage of eight rooms and nine doors, no one knows from where, no one knows to where; the cage is built of green sticks and will one day fall apart. Tagore heard a wandering Baul sing it through his roadside window and could not get the first two lines out of his head.',
      'The Bauls refused everything Bengal in 1850 was hardening into: caste, the Hindu-Muslim split, the colonial class order. They lived as wandering mendicants, braided Vaishnava devotional thought with Sufi Islam and Tantric Buddhism, and survived on alms and music. Initiation was a ceremony called bhek in which the new disciple wore a white cloth, the same kafan in which Muslims bury their dead, and walked around their guru\'s shrine in a mock funeral procession: dead, in their old life, while still alive in the new. The Bauls have a word for it. Jyante-mora. Dead while living.',
      'Tagore lived on his family\'s zamindari nearby and absorbed the Baul aesthetic deeply. He published twenty of Lalon\'s songs in the journal Prabasi in 1915 and credited Baul music as a foundational influence on Rabindra Sangeet. Allen Ginsberg visited Cheuriya in 1962 and left with a Baul-influenced poem. UNESCO recognised the Baul tradition as a Masterpiece of the Oral and Intangible Heritage of Humanity in 2005. The 2004 BBC poll for the Greatest Bengali of All Time ranked Lalon twelfth, ahead of most prime ministers. The fight Lalon walked into in 1850 and refused to take a side in, is still going.'
    ],
    quote: 'Everyone asks: what caste is Lalon? I have never seen caste with these two eyes of mine.',
    quoteAuthor: 'Lalon Shah, from "Shob Loke Koy Lalon Ki Jat Shongshare"',
    metrics: {
      songsComposed: '~2,000–10,000',
      songsSurviving: '~800',
      lifespan: '~116 years (1774–1890)',
      tagoreSongsPublished: '20 (1915)',
      unescoRecognition: '2005'
    },
    media: [{
      type: 'photo',
      motif: 'lalon-portrait',
      image: 'lalon-portrait.png',
      caption: 'Lalon Shah, after Jyotirindranath Tagore\'s 1889 sketch from the Padma houseboat',
      credit: 'Derivative drawing · Public Domain'
    }],
    sources: ['Carol Salomon, City of Mirrors: Songs of Lālan Sā̃i (2017)', 'UNESCO Intangible Cultural Heritage Registry', 'The Daily Star: "The real Lalon"', 'BBC Bengali Service', 'Jasimuddin.org: Lalon-Baul Mysticism (Prof Anwarul Karim, Farhad Mazhar)']
  }),

  new TimelineEvent({
    id: 'partition-1905',
    order: 11,
    year: 1905,
    dateDisplay: '16 October 1905',
    title: 'The First Partition',
    subtitle: 'Curzon divides Bengal, and accidentally creates the national anthem of Bangladesh',
    track: 'shared',
    era: 'colonial',
    summary: 'Lord Curzon split Bengal in two on religious lines. Tagore wrote a song in protest. Sixty-six years later it became the national anthem of Bangladesh.',
    body: [
      'On 16 October 1905, Lord Curzon partitioned Bengal, officially for "administrative convenience," practically to divide the most politically active province on religious lines. The new Eastern Bengal and Assam province had a Muslim majority; West Bengal a Hindu one.',
      'The response was the Swadeshi movement: boycott of British goods, mass rallies, the founding of the Muslim League in Dacca in December 1906. Tagore organized a Rakhi Bandhan day on which Hindus and Muslims tied threads on each other\'s wrists in defiance of the partition. He also wrote a song that begins "Amar sonar Bangla, ami tomay bhalobashi," meaning "My golden Bengal, I love you."',
      'The partition was annulled in 1911. The capital of British India was moved from Calcutta to Delhi the same year. Sixty-six years after the song was written, Bangladesh would adopt it as its national anthem.'
    ],
    quote: 'Amar sonar Bangla, ami tomay bhalobashi. My golden Bengal, I love you.',
    quoteAuthor: 'Rabindranath Tagore, 1905',
    metrics: { partition: 'Religious lines', annulled: '1911', tagoreSong: 'Now Bangladesh\'s anthem' },
    media: [{ type: 'pattern', motif: 'swadeshi-flag' }],
    sources: ['Sumit Sarkar, The Swadeshi Movement in Bengal']
  }),

  new TimelineEvent({
    id: 'famine-1943',
    order: 12,
    year: 1943,
    dateDisplay: '1943',
    title: 'The Famine That Should Not Have Happened',
    subtitle: 'Three million dead in the most fertile delta on Earth',
    track: 'shared',
    era: 'colonial',
    summary: 'Bengal had above-average monsoon rains in 1943. The famine was not caused by drought. It was caused by policy.',
    body: [
      'In 1942 the British army, fearing a Japanese invasion through Burma, ordered the "Denial Policy": destroy rice stockpiles, seize boats, deny the Japanese any resource. The rice prices in Bengal skyrocketed beyond what the poor could pay. By summer 1943, peasants were walking to Calcutta in the thousands, where they died on the pavement.',
      'Between 2.1 and 3 million Bengalis died, most of starvation, the rest of cholera and dysentery. A 2019 study by IIT Gandhinagar and UCLA used soil-moisture data to prove what historians had argued for decades: 1943 was not a drought famine. It was a policy famine.',
      'Winston Churchill refused to divert shipping to Bengal. Asked by Parliament about the deaths, he reportedly responded that the famine was the Indians\' own fault for "breeding like rabbits." When Leo Amery raised it again, Churchill asked: "Why hasn\'t Gandhi died yet?"'
    ],
    quote: 'I hate Indians. They are a beastly people with a beastly religion. The famine was their own fault for breeding like rabbits.',
    quoteAuthor: 'Winston Churchill, to Leo Amery, 1943',
    metrics: { deathToll: '2.1M – 3M', cause: 'Policy, not drought', monsoonRain: 'Above average', churchillResponse: 'Refused food aid' },
    disputed: 'Death toll estimates range from 1.5M (Famine Inquiry Commission lower bound) to 4M (Amartya Sen upper bound). 2.1–3M is the modal academic figure. A revisionist position argues distribution and price were the issue, not absolute supply.',
    media: [{
      type: 'photo',
      motif: 'famine-figure',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bengal%20famine%201943%20photo%202.jpg?width=800',
      caption: 'A street in Calcutta, August 1943',
      credit: 'The Statesman archive · Public Domain'
    }],
    sources: ['Amartya Sen, Poverty and Famines', 'Madhusree Mukerjee, Churchill\'s Secret War', 'Mishra et al, Geophysical Research Letters 2019']
  }),

  new TimelineEvent({
    id: 'partition-1947',
    order: 13,
    year: 1947,
    dateDisplay: '14 – 15 August 1947',
    title: 'The Radcliffe Line',
    subtitle: 'A British lawyer with five weeks divides a thousand-year homeland',
    track: 'shared',
    era: 'partition',
    summary: 'Cyril Radcliffe had never been east of Paris before he was given five weeks to draw the borders between India and Pakistan. He never visited the line he drew.',
    body: [
      'In June 1947 a British lawyer named Cyril Radcliffe, who had never previously been to South Asia, was given five weeks to draw two borders, one through Punjab, one through Bengal, that would partition India and create Pakistan. He worked in a Delhi bungalow with outdated maps. The lines were published on 17 August 1947, two days after Pakistan and India had already become independent on 14 and 15 August.',
      'In Bengal, East Bengal, Muslim-majority at 71%, went to Pakistan as its eastern wing. West Bengal, Hindu-majority at 70.8%, went to India. The Hindu Bengali heartland and the Muslim Bengali heartland, after nearly a thousand years of shared language, food, song, and history, were on opposite sides of an international border.',
      'Across the subcontinent, between 12 and 18 million people moved. Hundreds of thousands died in Punjab. Bengal had less of the immediate slaughter of Punjab but more of the long, grinding refugee crisis. Hindus from East Bengal poured into Calcutta. Bihari Muslims poured into East Pakistan. A people had been cut in half.'
    ],
    quote: 'They want to take the language of my mouth. They want to steal my language.',
    quoteAuthor: 'Bengali protest song, 1948',
    metrics: { displaced: '12M – 18M', eastBengalMuslim: '71%', westBengalHindu: '70.8%', radcliffeWeeks: '5' },
    media: [{ type: 'pattern', motif: 'radcliffe-line' }],
    sources: ['Yasmin Khan, The Great Partition', 'Joya Chatterji, Bengal Divided']
  }),

  new TimelineEvent({
    id: 'language-movement',
    order: 14,
    year: 1952,
    dateDisplay: '21 February 1952',
    title: 'Martyrs for a Mother Tongue',
    subtitle: 'Ekushey February',
    track: 'bangladesh',
    era: 'pakistan',
    summary: 'When the government of Pakistan declared Urdu the sole national language, Bengali students died for the right to speak their own. The first protest came not in 1952 but in March 1948, when a young law student named Sheikh Mujibur Rahman was beaten and arrested for picketing the secretariat.',
    body: [
      'It started a week after partition. In February 1948, when the first Constituent Assembly of Pakistan began recording its proceedings in Urdu and English alongside no Bengali, a Hindu member from Comilla named Dhirendra Nath Dutta rose and asked, formally, why a language spoken by fifty-eight percent of the country had no place in its parliament. The motion was struck down. On 2 March, students at Dhaka University and political activists formed the All-Party Rashtrabhasha Sangram Parishad, the State Language Action Committee. Nine days later, on 11 March 1948, they shut Dhaka down.',
      'It was the first general strike in Pakistan\'s eight-month history. Picketers tried to lay siege to the secretariat. Police beat them and arrested several including Shamsul Huq, Oli Ahad, and a tall twenty-eight-year-old law student named Sheikh Mujibur Rahman. Pressure from student protests forced his release on 15 March. The next day Chief Minister Khwaja Nazimuddin signed an agreement promising a Bill in the Assembly making Bengali a state language. He did not deliver it. On 21 March, Muhammad Ali Jinnah stood at the Ramna Race Course in Dhaka and told a crowd of two hundred thousand: "the state language of Pakistan is going to be Urdu and no other language. Anyone who tries to mislead you is really the enemy of Pakistan." When he repeated the line at the Dhaka University convocation three days later, students shouted "no, no" from the audience. Mujib would later write: "The Language Movement did not start on 21 February 1952. It mainly started on 11 March 1948."',
      'Four years of agitation followed. On 21 February 1952, with Mujib in prison again after a 14 February arrest, students at Dhaka University defied Section 144 and marched. Police opened fire near Dhaka Medical College. Rafiq Uddin Ahmed, Abul Barkat, Abdul Jabbar, Abdus Salam, and a nine-year-old boy named Ohiullah were killed. The next day, 22 February, was worse. As the janazah procession moved through the city, police fired again. A thirty-four-year-old clerk named Shafiur Rahman, who had no part in the protest and was simply on his way to work, was shot dead on Nawabpur Road. Casualties were never officially counted.',
      'That night, at the Dhaka Medical College hostel, a small group led by sculptor Sayeed Haider and funded by the local Sardar Pearu Sardar of Hussaini Dalan began building a memorial in brick and concrete on the spot where the firing had happened. By dawn on 23 February the first Shaheed Minar stood, ten feet tall. Police demolished it three days later. They could not demolish what it had marked. The students built it again, in brick, in plaster, in concrete; the Pakistan Army destroyed it during Operation Searchlight in March 1971 and Bangladeshis rebuilt it again. The permanent monument by Hamidur Rahman and Novera Ahmed was finally completed in 1963.',
      'In 1956, after eight years of strikes, arrests, and dead bodies, Pakistan amended its constitution to recognise Bengali alongside Urdu as a state language. By then Bangladesh was already inevitable. UNESCO declared 21 February International Mother Language Day on 17 November 1999. Every Ekushey, before dawn, Bangladeshis walk barefoot to the Shaheed Minar and place flowers at its foot. They are the only people in the history of the world to have died for a language. They are also the only people in the world with a day on the UN calendar to mark it. Today Bangla is the sixth most spoken native language on Earth, with two hundred and eighty-five million speakers. Three hundred million people speak the language because five of them refused, on a February afternoon in 1952, to speak any other.'
    ],
    quote: 'The Language Movement did not start on 21 February 1952. It mainly started on 11 March 1948.',
    quoteAuthor: 'Sheikh Mujibur Rahman, Daily Azad, 16 February 1971',
    metrics: {
      firstDemand: 'Dhirendra Nath Dutta, Feb 1948',
      firstStrike: '11 March 1948 (Mujib arrested)',
      martyrs1952: 'Barkat, Jabbar, Rafiq, Salam, Shafiur, Ohiullah',
      bengaliRecognised: '1956 constitution',
      unescoDeclared: '17 November 1999'
    },
    media: [{
      type: 'photo',
      motif: 'shaheed-minar',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Central%20Shaheed%20Minar%2C%20Dhaka.jpg?width=800',
      caption: 'Shaheed Minar, Dhaka',
      credit: 'Wikimedia Commons · CC-BY-SA'
    }],
    sources: ['Banglapedia: Language Movement', 'Bashir Al-Helal, Bhasha Andoloner Itihash (1985)', 'Sheikh Mujibur Rahman, The Unfinished Memoirs (2012)', 'Wikipedia: Shaheed Minar, Dhaka']
  }),

  new TimelineEvent({
    id: 'ray-pather-panchali',
    order: 14.5,
    year: 1955,
    dateDisplay: '26 August 1955',
    title: 'Bengal on the World Screen',
    subtitle: 'Satyajit Ray and Pather Panchali',
    track: 'west-bengal',
    era: 'pakistan',
    summary: 'A first-time director sold his wife\'s jewellery to finish a Bengali-language film about a poor village boy. Five years later it had won at Cannes, played at MoMA, and made world cinema take Indian film seriously for the first time.',
    body: [
      'Satyajit Ray was a thirty-year-old advertising illustrator at a British agency in Calcutta in 1949 when he met Jean Renoir, who was scouting locations for The River. The next year he saw Vittorio De Sica\'s Bicycle Thieves in London and walked out convinced he could make a film with non-actors, real locations, and no money. He chose to adapt Bibhutibhushan Bandopadhyay\'s 1929 novel Pather Panchali, the story of a Brahmin family\'s slow ruin in a Bengali village. Skeptical Bengali producers refused. Ray sold his wife Bijoya\'s jewellery and his collection of books to begin shooting. Production stretched over two and a half years as the money repeatedly ran out; the West Bengal government finally provided the rest, classifying the film as a "road improvement" project to get it past the bureaucracy.',
      'Pather Panchali premiered at the Museum of Modern Art in New York on 3 May 1955, without subtitles, three months before its Calcutta release. People wept in the aisles. Cannes gave it the Best Human Document prize the following year. Ray followed with Aparajito (1956) and Apur Sansar (1959), completing the Apu Trilogy: a single boy\'s life from childhood in a village to widowed adulthood in Calcutta, scored by Ravi Shankar, told with a restraint that the Western critical establishment had not believed Indian cinema capable of. Akira Kurosawa later said: "Not to have seen the cinema of Ray means existing in the world without seeing the sun or the moon."',
      'Over thirty-six films, Ray became one of the most influential directors of the twentieth century, name-checked as an influence by Scorsese, Truffaut, Wes Anderson, Christopher Nolan. He did everything himself: directed, wrote screenplays, designed costumes and posters, composed scores, operated the camera. In March 1992, too ill to travel, he received an Honorary Academy Award for Lifetime Achievement from a hospital bed in Calcutta, the first and still the only Indian filmmaker to do so. He died twenty-three days later, on 23 April 1992. The accolade the Academy used for him was "rare mastery of the art of motion pictures and a profound humanitarian outlook." That second phrase, the humanism, was the Bengal Renaissance still doing its work, ninety-six years after Tagore won the Nobel and a hundred and sixty after Ram Mohan Roy walked into the colonial city to argue with it.'
    ],
    quote: 'Not to have seen the cinema of Ray means existing in the world without seeing the sun or the moon.',
    quoteAuthor: 'Akira Kurosawa',
    metrics: {
      filmsDirected: '36',
      apuTrilogyYears: '1955–1959',
      cannesAward: 'Best Human Document (1956)',
      honoraryOscar: '30 March 1992',
      indianFilmmakersWithOscar: '1'
    },
    media: [{
      type: 'photo',
      motif: 'ray-stamp',
      image: 'ray-portrait.png',
      caption: 'Ray behind the camera, with crew and a Bengali village in the frame',
      credit: 'Folk-illustration · Public Domain'
    }],
    sources: ['Andrew Robinson, Satyajit Ray: The Inner Eye (1989)', 'BFI: Pather Panchali entry', 'Academy of Motion Picture Arts and Sciences', 'Criterion Collection essays']
  }),

  new TimelineEvent({
    id: 'bhashani-east-pakistan',
    order: 14.75,
    year: 1957,
    dateDisplay: '1949 – 1969',
    title: 'The Red Maulana',
    subtitle: 'Bhashani, the United Front, and the long argument with West Pakistan',
    track: 'bangladesh',
    era: 'pakistan',
    summary: 'Twenty-two years before Mujib called for independence, his teacher was already calling West Pakistan a colonial occupier. The Bengali political movement that produced 1971 was built by an Islamic-socialist preacher in a homespun lungi who toasted Mao and the Quran in the same speech.',
    body: [
      'Abdul Hamid Khan Bhashani was already seventy in 1950 and had been organising peasants for half a century. He had studied at Deoband, joined the Khilafat movement protesting the dissolution of the Ottoman Caliphate, organised tea-garden workers in Assam, and led the Muslims of Sylhet in the 1947 referendum that joined the district to East Bengal rather than India. On 23 June 1949, in the Rose Garden palace in Old Dhaka, he founded the East Pakistan Awami Muslim League with Shamsul Huq as general secretary and a thirty-year-old Sheikh Mujibur Rahman as joint secretary. The party was the first major opposition to Jinnah\'s Muslim League in East Pakistan, and Bhashani was its first president. He would hold that office for eight years.',
      'The 1954 provincial election was the political earthquake. Bhashani, A.K. Fazlul Huq, and Huseyn Shaheed Suhrawardy formed the United Front (Jukta Front) on a 21-point manifesto that began with making Bengali a state language. They won 223 of 237 seats. The ruling Muslim League collapsed to 9. The central government dismissed the new provincial cabinet within two months and put Bhashani under restriction. In 1953, in any case, he had quietly forced the party to drop "Muslim" from its name: it became simply the Awami League, open to non-Muslims, secular in claim. That gesture in a single word was Bhashani\'s actual programme: an Islamic politics that refused to define itself by Islam.',
      'In February 1957 at the Kagmari conference Bhashani publicly broke with Suhrawardy, who as Prime Minister of Pakistan was committing the country to the US-led SEATO and CENTO defence pacts. Bhashani told the gathering that if West Pakistan continued discriminating against the East, then East Pakistan would have no choice but to say "Assalamu Alaikum" to the West, a polite Muslim farewell that everyone in the room heard as a declaration of intent. Five months later, on 25 July 1957, he founded the National Awami Party (NAP) — the major left-wing party of both Pakistans, demanding provincial autonomy and a non-aligned foreign policy. Because of his sympathy for the Chinese revolution and his organising of the East Pakistan Peasant Association, he was known by then as Lal Maulana, the Red Maulana, and as Mozlum Jananeta, the Leader of the Oppressed.',
      'The 1960s belonged to Field Marshal Ayub Khan\'s military regime, and Bhashani spent them in and out of detention. In 1966 Mujib, his old joint secretary, issued the Six Points, demanding effectively the autonomy Bhashani had been calling for ten years earlier; in 1968 Ayub charged Mujib in the Agartala Conspiracy Case for allegedly plotting independence with Indian help. Bhashani led the campaign for Mujib\'s release. The case collapsed under the 1969 Mass Uprising, a six-week popular revolt that the American journalist Dan Coggin would later credit Bhashani with igniting. Ayub fell in March 1969. Yahya Khan replaced him and called the 1970 election that the cyclone would force open. In September 1970, two months before Bhola, Bhashani became the first major Bengali politician on the record demanding outright independence: if the West did not stop its discrimination, East Pakistan would separate and "befriend whomever it wanted." Mujib, more cautious, was still negotiating. By March 1971 the time for arguments was over and so was the era when the Red Maulana was the loudest voice for Bengali nationhood. He would survive the war, advise the Mujibnagar government from inside India, and outlive Mujib too, dying in 1976 at ninety-five. The independence he had been preaching since 1957 had finally arrived, in a form he had never imagined and could not entirely defend.'
    ],
    quote: 'Assalamu Alaikum, West Pakistan.',
    quoteAuthor: 'Maulana Bhashani, Kagmari Conference, 8 February 1957',
    metrics: {
      awamiLeagueFounded: '23 June 1949',
      droppedMuslim: '1953',
      unitedFrontWon: '223 of 237 seats (1954)',
      napFounded: '25 July 1957',
      firstIndependenceCall: 'September 1970'
    },
    media: [{ type: 'pattern', motif: 'bhashani-rally' }],
    sources: ['Banglapedia: Abdul Hamid Khan Bhashani', 'Lawrence Ziring, Bangladesh: From Mujib to Ershad', 'Daily Star: "Remembering a legacy of opposition" (2024)', 'Banglapedia: National Awami Party']
  }),

  new TimelineEvent({
    id: 'bhola-cyclone',
    order: 15,
    year: 1970,
    dateDisplay: '12 November 1970',
    title: 'The Storm That Started a War',
    subtitle: 'The Bhola Cyclone',
    track: 'bangladesh',
    era: 'pakistan',
    summary: 'The deadliest tropical cyclone ever recorded. Half a million dead in a single night. The warning never reached the coast. One month later the genocide began.',
    body: [
      'On 8 November 1970, slow-swirling clouds appeared on radar deep in the Bay of Bengal. By the 9th the system was a tropical storm. By the 11th it was the strongest class of severe cyclone, moving north at 185 km/h directly toward the East Pakistani coast. India\'s meteorological service tracked it the entire way and, historians believe, given the 1965 war and the broader political freeze between the two countries, did not warn Pakistan.',
      'Even Pakistan\'s own warning failed. Central Pakistan had recently switched its storm-severity scale from a 1-to-10 system to a 1-to-4 system, with 4 being most dangerous. The radio bulletin that finally went out on 12 November called the storm "scale four." On the East Pakistani coast, fishermen and their families heard "four" and assumed it meant something like 4 out of 10, a mid-range storm. They did not take shelter. Then a full moon raised the tide an extra 20%, and the storm surge, in places nearly ten metres high, rolled up the delta in the dark.',
      'In the village of Monpura, one of the hundreds of low islands the storm overran, a man named Hai climbed to the roof of his two-storey home with his family as the water rose. The flood reached the second floor in eight minutes. He jumped to a coconut tree two feet from his roof and called for his family to follow. A wave hit the roof. Nobody followed. Hai clung to the coconut tree for hours through 250 km/h winds. When the eye passed, he swam to his uncle\'s house through floating bodies. Of Monpura\'s 50,000 residents, 40,000 were dead. His was one survivor\'s story among hundreds of thousands lost.',
      'When the scale of the disaster became clear, President Yahya Khan stopped briefly in Dhaka on his way home from Beijing and continued to Islamabad. One of his generals later described the cyclone in a phrase that has never been forgotten in Bangladesh: it had "solved about half a million of their problems." Yahya thought the storm had made the December election safer for the West. He was wrong. On 7 December 1970, twenty-five days after the cyclone, Mujib\'s Awami League won 167 of 169 East Pakistani seats. Yahya refused to seat them. Three months later he sent in the army. The cyclone did not start the genocide. But it lit the fuse.'
    ],
    quote: 'A cyclone that solved about half a million of their problems.',
    quoteAuthor: 'A West Pakistani general, on the Bhola death toll',
    metrics: {
      deathToll: '300K – 500K',
      windSpeed: '185 km/h',
      monpuraDead: '40,000 of 50,000',
      warningScale: '"4" misread as 4/10',
      electionAfter: '25 days'
    },
    media: [{ type: 'pattern', motif: 'cyclone-spiral' }],
    sources: [
      'Scott Carney & Jason Miklian, The Vortex',
      'Wikipedia: 1970 Bhola cyclone',
      'New York Times reportage, November 1970'
    ]
  }),

  new TimelineEvent({
    id: 'liberation-war',
    order: 16,
    year: 1971,
    dateDisplay: '26 March – 16 December 1971',
    title: 'The Birth in Blood',
    subtitle: 'The Bangladesh Liberation War',
    track: 'bangladesh',
    era: 'liberation',
    summary: 'Nine months. Up to three million dead. Two to four hundred thousand women raped. Ten million refugees. The largest genocide of the second half of the twentieth century.',
    body: [
      'The war did not come from nowhere. In 1966 Mujib had published a Six-Point Plan demanding provincial autonomy, a separate currency for East Pakistan, and the right of each wing to keep its own foreign-exchange earnings. The Yahya Khan regime arrested him, then released him; he won the December 1970 election with 167 of 169 East Pakistani seats, a clean majority of the entire National Assembly. He should have been Prime Minister of all Pakistan. Instead, on 1 March 1971, Yahya postponed the assembly indefinitely. On 7 March, at the Ramna Race Course in Dhaka, Mujib told a crowd of a million people: "this struggle is for our independence."',
      'On the night of 25 March 1971, the Pakistani army launched Operation Searchlight. Tanks rolled into Dhaka University. Jagannath Hall, the Hindu students\' dormitory, was shelled. Rajarbagh Police Lines was destroyed. Robert Payne estimated seven thousand were killed in Dhaka in a single night. Mujib was arrested and flown to West Pakistan. On 26 March, the independence of Bangladesh was declared on Kalurghat radio. The Mukti Bahini, the freedom fighters, formed.',
      'India absorbed ten million refugees, the largest refugee movement in human history at the time. Indira Gandhi began training and arming the Mukti. The Pakistani army recruited auxiliary militias (the Razakars, Al-Badr, and Al-Shams) from local collaborators, primarily the religious party Jamaat-e-Islami. These units executed many of the most targeted killings: of Hindus, of intellectuals, and of suspected nationalists in the final two days of the war, 14–16 December, when Al-Badr death squads systematically murdered 200+ professors, doctors, journalists and writers in Dhaka.',
      'The U.S. State Department\'s Archer Blood sent the Blood Telegram on 6 April: "Our government has failed to denounce the suppression of democracy. Our government has failed to denounce atrocities. Our government has evidenced what many will consider moral bankruptcy." Nixon and Kissinger were furious. They needed Pakistan as a back-channel to Mao\'s China.',
      'On 3 December 1971, after Pakistan launched preemptive strikes on Indian air bases, India entered the war. The superpowers came next. The United States sent Task Force 74, led by the nuclear-armed aircraft carrier USS Enterprise, into the Bay of Bengal to pressure India. The Soviet Union sent a counter-fleet of nuclear-capable ships from Vladivostok. For roughly two weeks in December 1971, two nuclear task forces shadowed each other in the same body of water: one of the least-remembered nuclear confrontations of the Cold War. The crisis dissolved only when, on 16 December, thirteen days after India\'s entry, the Pakistani Eastern Command surrendered at the Ramna Race Course in Dhaka, the same ground where Jinnah had told Bengalis that Urdu would be their language. 93,000 Pakistani troops became prisoners of war. The death toll is contested: Bangladesh says three million, scholars range from 300,000 to 1.5 million. The rape was systematic, 200,000 to 400,000 women, and explicitly genocidal in intent.'
    ],
    quote: 'Our government has evidenced what many will consider moral bankruptcy.',
    quoteAuthor: 'Archer Blood, the Blood Telegram, 6 April 1971',
    metrics: { deathToll: '300K – 3M', womenRaped: '200K – 400K', refugees: '10 million', duration: '9 months' },
    disputed: 'The death toll is one of the most contested figures of 20th-century history. Bangladesh officially says 3 million; scholars like Sarmila Bose argue ~300,000; R.J. Rummel estimates ~1.5M. The systematic nature of the rape and targeting of intellectuals is undisputed.',
    media: [{
      type: 'photo',
      motif: 'mukti-bahini',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sheikh-Mujibur-Rahman-at-Race-Cource-1971.jpg?width=800',
      caption: 'Mujib at the Ramna Race Course, 7 March 1971',
      credit: 'Bangladesh Press Information Department · Public Domain'
    }],
    sources: ['Gary J. Bass, The Blood Telegram', 'Sarmila Bose, Dead Reckoning', 'Bangladesh Genocide Archive']
  }),

  new TimelineEvent({
    id: 'concert-for-bangladesh',
    order: 16.5,
    year: 1971,
    dateDisplay: '1 August 1971',
    title: 'The Concert for Bangladesh',
    subtitle: 'Madison Square Garden, two shows, forty thousand people',
    track: 'bangladesh',
    era: 'liberation',
    summary: 'A sitar player from Benares asked an ex-Beatle for help. Five months into the war, before any government had picked a side, forty thousand New Yorkers learned the name of a country that did not yet exist.',
    body: [
      'Ravi Shankar was born in Benares with ancestral roots in Bengal. He had spent the spring of 1971 reading Anthony Mascarenhas\'s Sunday Times exposé of the atrocities in East Pakistan and watching the refugee count cross the border he had not seen in decades. In June he asked his friend George Harrison for help raising a few thousand dollars for the children in the camps. Harrison spent the next three months on the telephone.',
      'On Sunday, 1 August 1971, at 2:30 in the afternoon and again at 8 in the evening, two concerts took place at Madison Square Garden in New York City. Shankar and Ali Akbar Khan opened with Indian classical music, an instrument and a tradition most of the audience had never knowingly heard. Harrison followed with Ringo Starr, Eric Clapton, Billy Preston, Leon Russell, Badfinger, and a then-reclusive Bob Dylan, who walked out and sang "A Hard Rain\'s A-Gonna Fall" for the first time in years. Paul McCartney had been asked. He had declined; it was too soon to look like the Beatles again.',
      'Forty thousand people attended. The initial gate receipts raised roughly $250,000. The live album and the Apple Films documentary would bring the total to about twelve million dollars by 1985, administered by UNICEF. More importantly, it was the first concert of its kind in history. Live Aid, Farm Aid, every benefit show that came after, all of them are children of that Sunday afternoon. Shankar said later: in one day, the whole world knew the name of Bangladesh.',
      'A war was being fought to give that name to a state. Five months before the surrender at the Ramna Race Course, the name had already arrived in the only place that, in 1971, still set the global agenda: an English-speaking concert hall in New York. Nixon and Kissinger were still backing Yahya Khan. The U.S. press had been slow. But the world heard "Bangla Desh" sung from a stage by an ex-Beatle before it heard it announced as a country.'
    ],
    quote: 'In one day, the whole world knew the name of Bangladesh. It was a fantastic occasion.',
    quoteAuthor: 'Ravi Shankar, looking back at the concerts',
    metrics: {
      attendees: '40,000',
      shows: '2 (matinee + evening)',
      initialReceipts: '$250,000',
      totalRaisedBy1985: '~$12 million',
      firstOfItsKind: 'Benefit concert format'
    },
    media: [{
      type: 'photo',
      motif: 'concert-bangladesh',
      image: 'concert-for-bangladesh.png',
      caption: 'The 1972 Apple Films release poster, with Clapton, Russell, and Dylan in the arch',
      credit: 'Apple Films / 20th Century-Fox · 1972 promotional poster'
    }],
    sources: ['UNICEF USA archives', 'Wikipedia: Concert for Bangladesh', 'The Beatles official archives', 'Liberation War Museum Bangladesh']
  }),

  new TimelineEvent({
    id: 'stranded-pakistanis',
    order: 16.75,
    year: 1972,
    dateDisplay: '1972 – present',
    title: 'The Stranded',
    subtitle: 'The Biharis of Camp Geneva',
    track: 'bangladesh',
    era: 'modern',
    summary: 'When Pakistan split, half a million Urdu-speaking Biharis chose the wrong side. Five decades later, they are still in temporary camps in Dhaka, citizens of no country.',
    body: [
      'In 1947, hundreds of thousands of Urdu-speaking Muslims from Bihar in northern India fled the partition violence and resettled in East Pakistan. They were not Bengali. They spoke Urdu. They identified with Jinnah\'s Pakistan, not with the Bengali nationalism rising around them. During the 1971 war, many of them sided with the Pakistani army; some served in the auxiliary Razakar militias that participated in atrocities. When the war ended, their neighbours did not forget.',
      'After the surrender, the new Bangladeshi state would not have them. Pakistan, having lost the war, would not take them back either. They were placed in temporary camps, sixty-six of them across the country, that were supposed to last a few months. Camp Geneva in central Dhaka, named because the Red Cross set it up, is now a multi-generational settlement. Cramped, undrained, illegal in the strict sense, and home to about three hundred thousand stateless people. The original residents are dying. Their grandchildren, born in Bangladesh, speaking Urdu and Bengali, with no passport from anywhere, are still here.',
      'A 2008 Bangladeshi High Court ruling gave Biharis born after 1971 the right to citizenship. Most still can\'t access it in practice. They are the human cost of partition that nobody on either side wants to count.'
    ],
    quote: 'We are the leftover people. Pakistan does not want us. Bangladesh does not want us. We are not anyone\'s problem and that is exactly the problem.',
    quoteAuthor: 'A camp resident, Camp Geneva',
    metrics: {
      stateless: '~300,000',
      camps: '66 settlements',
      campAge: '50+ years',
      passports: 'None'
    },
    media: [{ type: 'pattern', motif: 'stranded-camp' }],
    sources: ['Refugees International', 'Al Jazeera "The Stateless Biharis"', '2008 Bangladesh High Court ruling']
  }),

  new TimelineEvent({
    id: 'mujib-assassination',
    order: 17,
    year: 1975,
    dateDisplay: '15 August 1975',
    title: 'The Father Killed at Dawn',
    subtitle: 'The assassination of Sheikh Mujibur Rahman',
    track: 'bangladesh',
    era: 'modern',
    summary: 'Four years after he became the founding father of Bangladesh, Mujib was shot at his residence on Dhanmondi Road 32 along with most of his family. Two daughters survived because they were abroad.',
    body: [
      'Mujib returned from Pakistani prison on 10 January 1972 to a euphoric Dhaka. He became Prime Minister, then in January 1975, President under a one-party constitution called BAKSAL. The honeymoon ended quickly. The 1974 famine, Bangladesh\'s second great famine within a generation, killed perhaps a million and a half people. Corruption ate the new state from the inside.',
      'At dawn on 15 August 1975, a faction of mid-ranking army officers stormed his residence at Dhanmondi 32. Mujib was shot on the staircase. His wife Fazilatunnesa, his three sons including the ten-year-old Russell, and his pregnant daughter-in-law were all killed. Only two daughters survived: Sheikh Hasina and Sheikh Rehana, who were in West Germany. Hasina would return to lead her father\'s party. Three decades later, she would be Prime Minister.',
      'The Indemnity Ordinance of September 1975 shielded the killers from prosecution until Hasina repealed it in 1996. Five were finally hanged in 2010; the sixth in April 2020. The Dhanmondi 32 house is now a museum, or rather, it was, until 5 August 2024, when crowds celebrating Hasina\'s ouster burned it down.'
    ],
    quote: 'I am giving you independence. Now go and protect it.',
    quoteAuthor: 'Sheikh Mujibur Rahman, 7 March 1971',
    metrics: { age: '55', familyKilled: '18 members', survivors: '2 daughters abroad', indemnityRepealed: '1996' },
    media: [{
      type: 'photo',
      motif: 'mujib-portrait',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Official_Portrait_of_Bangabandhu_Sheikh_Mujibur_Rahman.jpg?width=800',
      caption: 'Sheikh Mujibur Rahman, official portrait',
      credit: 'Bangladesh Govt · Public Domain (via Wikimedia)'
    }],
    sources: ['Wikipedia: Assassination of Sheikh Mujibur Rahman']
  }),

  new TimelineEvent({
    id: 'left-front-bengal',
    order: 18,
    year: 1977,
    dateDisplay: '21 June 1977 – 2011',
    title: 'The Longest Red Government',
    subtitle: 'West Bengal under the Left Front',
    track: 'west-bengal',
    era: 'modern',
    summary: 'While Bangladesh cycled through coups, West Bengal entered thirty-four years of unbroken Communist rule, the longest democratically elected Communist government in world history.',
    body: [
      'On 21 June 1977 Jyoti Basu was sworn in as Chief Minister of West Bengal at the head of a Left Front coalition dominated by the CPI(M). He would hold the office for twenty-three years and three months, the longest tenure of any Chief Minister in Indian history until 2018.',
      'The Left Front\'s first decade delivered the most ambitious land reform in independent India: Operation Barga, which registered sharecroppers\' rights and broke the back of the zamindari residue. Calcutta, formally renamed Kolkata in 2001, remained the cultural capital of India. Tagore was a state cult; the Coffee House on College Street stayed open through every political storm; the Durga Pujas became civic theatre.',
      'Buddhadeb Bhattacharjee succeeded Basu in 2000 and tried to industrialize. Singur (the Tata Nano land acquisition) and Nandigram (the 2007 police firing that killed at least fourteen villagers) destroyed him. In 2011 Mamata Banerjee\'s Trinamool Congress ended the Left Front. The Communists, who had governed continuously for three and a half decades, were not just defeated; they were obliterated. In the 2021 election, the CPI(M) and Congress combined won zero seats.'
    ],
    quote: 'We are not in a hurry to industrialize.',
    quoteAuthor: 'Jyoti Basu, 1980s',
    metrics: { duration: '34 years', basuTenure: '23 years 3 months', operationBarga: '1.5M sharecroppers registered', cpimSeats2021: '0' },
    media: [{ type: 'pattern', motif: 'red-flag-kolkata' }],
    sources: ['Atul Kohli, The State and Poverty in India']
  }),

  new TimelineEvent({
    id: 'garment-boom',
    order: 19,
    year: 1978,
    dateDisplay: '1978 – present',
    title: 'The Garment Miracle',
    subtitle: 'How Bangladesh became the world\'s shirt-maker',
    track: 'bangladesh',
    era: 'modern',
    summary: 'A Korean joint venture in 1978. By 2023, Bangladesh is the world\'s second-largest garment exporter, behind only China. Five million workers, 80% women.',
    body: [
      'In 1978, Bangladeshi entrepreneur Noorul Quader signed a partnership with Daewoo of South Korea: 130 Bangladeshi workers travelled to Busan, trained for six months in a Daewoo factory, and came home to start Desh Garments. Most of those 130 went on to found their own factories. The industry compounded.',
      'By 2023, Bangladesh exported $38 billion in ready-made garments, 7.4% of the world total, second only to China\'s $165 billion. Vietnam was third at $31 billion. The industry employs about five million people, eighty percent of them women. For two generations of rural Bangladeshi women, the garment factory was the first thing that gave them a wage of their own.',
      'It came at a cost. In 2013 the Rana Plaza factory collapsed in Savar, killing 1,134 workers. It was the worst industrial disaster in modern history. The accord that followed forced global brands to fund factory safety inspections. But the wages remain among the lowest in the world. The miracle is real. The miracle is also still being negotiated.',
      'Outside the factories, a second labour economy did the same work in reverse. Roughly five and a half million Bangladeshis live and work abroad, mostly on short-term contracts in the Gulf: two million in Saudi Arabia, seven hundred thousand in the UAE, six hundred and eighty thousand in Oman, four hundred thousand in Qatar where they are about an eighth of the entire population. Another six hundred and fifty thousand live in the United Kingdom, concentrated in Tower Hamlets in east London (the borough\'s Bangla-language nickname is Banglatown), and three hundred thousand in the United States, with the largest single concentration in Hamtramck, Michigan, a town with a Bangladeshi mayor and a Bangla-speaking city hall. In FY 2024–25 these workers sent home thirty billion dollars in remittances, up twenty-five percent year on year. After garments, it is the second-largest source of foreign exchange the country has. Two-thirds of all the foreign currency Bangladesh earns comes from the labour of poor women sewing in Dhaka and poor men building roads in Riyadh.',
      'Around the same period, Muhammad Yunus founded Grameen Bank in 1983 to extend microcredit to the rural poor, predominantly women. In 2006 he won the Nobel Peace Prize. Eighteen years later, after the 2024 uprising, he would be sworn in as Chief Adviser to a transitional government.'
    ],
    quote: 'Poverty is not created by the poor. It is created by the system.',
    quoteAuthor: 'Muhammad Yunus',
    metrics: { rmgExports2023: '$38B', globalRank: '#2 (after China)', workers: '~5 million', womenWorkers: '80%', remittancesFY25: '$30B', bengalisAbroad: '~5.5 million' },
    media: [{
      type: 'photo',
      motif: 'garment-factory',
      image: 'garment-factory.png',
      caption: 'Sewing line, ready-made garment factory floor, Bangladesh',
      credit: 'Public Domain · BGMEA / industry documentation'
    }],
    sources: ['WTO World Trade Statistics 2023', 'Naila Kabeer, The Power to Choose', 'Bangladesh Bank: Wage Earners\' Remittance Statistics FY 2024–25', 'BMET: Statistical Report on Overseas Employment']
  }),

  new TimelineEvent({
    id: 'tiger-mangrove',
    order: 19.25,
    year: 1997,
    dateDisplay: '1973 – present',
    title: 'The Tiger and the Mangrove',
    subtitle: 'Bonbibi\'s forest, where the delta meets the sea',
    track: 'shared',
    era: 'modern',
    summary: 'Where the three great rivers of the Atlas finally end, the world\'s largest mangrove forest begins. In its salt-flooded creeks lives the only population of tigers on Earth that swims for a living, and the only deity in South Asia that Hindus and Muslims worship together to be protected from one.',
    body: [
      'South of every other story in this Atlas is the Sundarbans, the long curving forest where the Ganges, Brahmaputra and Meghna finally finish their three-thousand-kilometre journey by losing themselves in the Bay of Bengal. The name means "beautiful forest," after the sundari tree that dominates it. About ten thousand square kilometres in all, sixty percent in Bangladesh and forty in West Bengal, it is the largest contiguous mangrove forest on Earth and one of its most biologically productive natural systems. UNESCO inscribed the Indian side in 1987 and the Bangladeshi side in 1997. Three hundred and thirty-four plant species, four hundred fish species, three hundred birds, forty-two mammals, thirty-five reptiles. Salt water comes in on the tide twice a day and freshwater flows out from the rivers, and the forest survives in the brackish margin where almost nothing else would. The land is geologically newborn. Islands rise from silt, mature for a few centuries, then drown again as the sea inches up. The Sundarbans is one of the few places in the world where the map needs to be redrawn every generation.',
      'In this forest lives a goddess who appears in no Vedic text, no Puranic catalogue, no formal Islamic theology, and whose worship crosses every religious boundary the rest of Bengal observes. Bonbibi — the Lady of the Forest, daughter of a Sufi fakir, chosen by Allah to defeat the tyrant of the Sundarbans — is venerated by Hindus and Muslims together as the protector of the woodcutters, the honey-collectors, and the fishermen who enter the forest knowing that some of them will not come back. Her adversary is Dakshin Rai, the Lord of the South, a zamindar in human form who turns into a tiger to eat people. Bonbibi defeats him but does not kill him. Instead, with the mediation of a third figure — Ghazi Miyan, a Sufi warrior-saint also called Bar Khan Gazi — she divides the forest itself. Half of it belongs to humans; half belongs to the tiger; cross into the other half and you forfeit Bonbibi\'s protection. The Mouli who collects honey and the Bauli who cuts firewood will both, before entering, recite a prayer to Bonbibi and bind a clay mask of Dakshin Rai to the back of their head, because a Sundarbans tiger almost always attacks from behind, and the second face is meant to confuse it. The Bonbibi Johurnama, the verse cycle that records the legend, was composed in the late nineteenth century and is read aloud in village courtyards to this day. There is no other deity quite like her in South Asia.',
      'The animal she divides the forest with is Panthera tigris tigris, the Bengal tiger, the national animal of both India and Bangladesh, an apex predator whose Latin name is a tautology because it was originally named after this place. Sundarbans tigers are unique among the world\'s remaining tiger populations: they swim long distances between islands, they hunt fish, crab, and water monitor lizard as well as deer and wild boar, they tolerate brackish water no other big cat can drink, and they have the highest documented frequency of attacks on humans of any tiger population on Earth. In the colonial period the Raj turned tiger-hunting into theatre — a Viceroy on an elephant, a hundred beaters in the bush, photographs sent home to London — and the population that had once ranged across the entire subcontinent collapsed onto a few last refuges. The Sundarbans, dense and difficult and not worth clearing, became the largest of those refuges. By Indian independence the wild Bengal tiger was a remnant species. By 1972 there were perhaps eighteen hundred left in the entire country.',
      'Indira Gandhi launched Project Tiger in 1973 and the Sundarbans Tiger Reserve was declared in the same year on the Indian side. Bangladesh, three years independent, inherited the framework and ran its own version of it. Conservation in the Sundarbans is not glamorous work. Patrol vessels in the creeks, net fences between forest and village, camera traps in the canopy, foresters quietly buried after meeting the wrong tiger on the wrong path. It has produced measurable results: in the most recent Bangladesh camera-trap census in 2024, biologists counted one hundred and twenty-five adult tigers, up from one hundred and fourteen in 2018 and one hundred and six in 2015 — a seventeen percent increase in nine years, set against a global trend in the opposite direction. The forest itself is in worse shape than the cat. Cyclone Sidr in November 2007 damaged a quarter of it. Cyclone Amphan in 2020 took out another large slice. Sea-level rise is pushing the salt line further inland every decade; upstream dams on the Indian Ganges have cut the dry-season freshwater the forest needs by close to forty percent; the sundari tree itself is dying back in the saltier zones. The tiger is recovering. The forest underneath the tiger is losing ground. Bangladesh in the twenty-first century is the country most exposed to climate change of any large nation on Earth, and the Sundarbans is the frontline. If the forest goes, the storms reach Dhaka. The tiger is the symbol. The mangrove is the structure. Bonbibi knew which of them to pray to first.'
    ],
    quote: 'বনবিবি মা, রক্ষা কর। · Mother Bonbibi, protect us.',
    quoteAuthor: 'The standard invocation of woodcutters and honey-collectors before entering the Sundarbans forest',
    metrics: {
      forestArea: '~10,000 km² · 60% Bangladesh · 40% India',
      unescoInscription: '1987 (India) · 1997 (Bangladesh)',
      tigerCensus: '106 (2015) → 114 (2018) → 125 (2024)',
      biodiversity: '334 plants · 400 fish · 300 birds · 42 mammals',
      cyclonesSurvived: 'Sidr 2007 · Amphan 2020 · Remal 2024',
      bonbibiText: 'Bonbibi Johurnama, late 19th c.'
    },
    media: [{
      type: 'photo',
      motif: 'tiger-mangrove',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pir%20Gazi%20and%20his%20tiger%20in%20Sundarbans.jpg?width=800',
      caption: 'Scene from a Gazi scroll, Bengal, 18th or 19th century. The Sufi saint Pir Gazi rides a tiger through the Sundarbans, the central image of the syncretic cosmology that Hindus and Muslims of the delta share.',
      credit: 'British Museum · Public Domain'
    }],
    sources: [
      'UNESCO World Heritage: The Sundarbans (Bangladesh, inscribed 1997)',
      'UNESCO World Heritage: Sundarbans National Park (India, inscribed 1987)',
      'M. M. Aziz et al., Status of Tigers in the Sundarbans of Bangladesh 2024 (Bangladesh Forest Department / WildTeam)',
      'IUCN World Heritage Outlook: The Sundarbans (2025)',
      'Annu Jalais, Forest of Tigers: People, Politics and Environment in the Sundarbans (2010)',
      'Sutapa Chatterjee Sarkar, The Sundarbans: Folk Deities, Monsters and Mortals (2010)',
      'Banglapedia: Bonbibi, Sundarbans'
    ]
  }),

  new TimelineEvent({
    id: 'achin-pakhi',
    order: 19.5,
    year: 2008,
    dateDisplay: '15 October 2008',
    title: 'The Unknown Bird, Removed',
    subtitle: 'Lalon\'s sculpture taken down at Zia International Airport',
    track: 'bangladesh',
    era: 'modern',
    summary: 'A sculptor named the work for Lalon\'s most famous song: Achin Pakhi, the Unknown Bird. He had nearly finished casting five Baul figures at the airport roundabout when the religious right demanded they come down. The caretaker government, under emergency rule, ordered them removed overnight.',
    body: [
      'Mrinal Haque was the sculptor Dhaka kept giving the commissions to. The horse-drawn carriage in Paribagh, the alphabet at Shahbag, the Liberation War tableaux at half a dozen intersections, the kite in Motijheel: all his. In 2008 the Roads and Highways Department contracted him to build a cluster of five sculptures at the roundabout in front of Zia International Airport. The figures were Bauls: Lalon Shah holding an ektara at the centre, four other mystic minstrels arrayed around him. Haque named the work Achin Pakhi, the Unknown Bird, after Lalon\'s most famous song about the strange bird that flits in and out of the cage of the body. The project cost was about one crore taka. By mid-October he had spent roughly fifty lakh and finished close to half of it.',
      'On 14 October 2008, a group calling itself the Murti Protirodh Committee, the "Sculpture Prevention Committee," held a press conference. Their objection had a specific form. The airport was the gateway through which Bangladeshi pilgrims left for the Hajj. Muslims, they said, should not begin a journey to Mecca by looking at human likenesses, which Islam prohibits. Mufti Fazlul Haque Amini, leader of the Islami Ain Bastabayan Committee, escalated: all sculptures in Bangladesh should be demolished. The country was under a state of emergency. The caretaker government, installed in 2007 under a constitutional caretaker provision and backed by the army, had been keeping order ahead of elections scheduled for that December. It made its calculation. On the night of 15 October 2008 the Roads and Highways Department and Civil Aviation Authority sent crews to the roundabout. By midnight the sculptures were down.',
      'The protest was immediate. Sachetan Shilpi Samaj, an artists\' collective, brought out a procession through Dhaka University on 16 October. Sculptors, painters, writers and students gathered at the foot of the Aparajeya Bangla statue and demanded the work be reinstated. Mrinal Haque told reporters that the night the sculptures came down felt like the death of his mother. The Daily Star ran an editorial calling the decision "pure genuflection before the forces of orthodoxy." A rock musician named Maqsoodul Haque wrote that he chose silence as the weapon. The sculptures never went back up.',
      'The event is small in the catalogue of Bangladesh\'s 2008. It is also a hinge. In 2017 Hifazat-e-Islam would force the removal of a Lady Justice statue from in front of the Supreme Court on the same logic. In 2018 the airport Lalon would be removed again. After the 2024 uprising, attacks on Baul singers and shrines became regular news. The man whose response to caste and religion was to wear them like a costume he could not take off, the man whose most famous song asks what mark anyone carries when they are born or when they die, was first removed in three dimensions from the airport that bears the name of Bangladesh\'s seventh president. The bird flits in and out of the cage. The cage, Lalon wrote, is made of green sticks. It will fall apart one day.'
    ],
    quote: 'I am feeling terrible. This is injustice, this is not fair. My mother has died and I can easily compare my present feeling with that loss.',
    quoteAuthor: 'Mrinal Haque, on the removal of his sculptures',
    metrics: {
      sculpturesRemoved: '5 (Lalon + 4 Bauls)',
      projectCost: 'Tk 1 crore (~50 lakh spent)',
      removalDate: 'Night of 15 October 2008',
      governmentForm: 'Caretaker, under emergency rule',
      hingeEvents: '2017 Lady Justice, 2018 redo, post-2024 attacks'
    },
    media: [{ type: 'pattern', motif: 'achin-pakhi' }],
    sources: ['The Daily Star: "Sculptures near ZIA removed after protests" (15 Oct 2008)', 'BBC Monitoring via COMTEX (18 Oct 2008)', 'bdnews24.com obituary of Mrinal Haque (Aug 2020)', 'The Diplomat: "Islamic Fundamentalism Raises Its Head in Post-Hasina Bangladesh" (Sept 2024)', 'Jasimuddin.org']
  }),

  new TimelineEvent({
    id: 'mamata-era',
    order: 20,
    year: 2011,
    dateDisplay: '20 May 2011 – present',
    title: 'Didi',
    subtitle: 'Mamata Banerjee and Trinamool Congress',
    track: 'west-bengal',
    era: 'modern',
    summary: 'In 2011 a former Congress firebrand ended thirty-four years of Communist rule in West Bengal. She has won every election since.',
    body: [
      'Mamata Banerjee, known as "Didi" (elder sister), wears white cotton saris and rubber sandals. She founded the All India Trinamool Congress in 1998 after breaking from the Indian National Congress. Her platform was simple: throw out the Communists.',
      'The 2007 Nandigram police firing, which killed fourteen villagers in a land-acquisition dispute, gave her the opening. In 2011, Trinamool won 184 of 294 assembly seats. She was sworn in as the first woman Chief Minister of West Bengal on 20 May 2011. The Left Front was finished.',
      'She has won 2016 and 2021. In 2021, Trinamool took 213 of 294 seats and the Left and Congress combined took zero. She is a Bengali-language populist, defending the Hindu-Muslim civic fabric of West Bengal against the BJP\'s nationalism, until 2026, when she lost. (See the final card.)'
    ],
    quote: 'Ma, Maati, Manush. Mother, land, people.',
    quoteAuthor: 'Mamata Banerjee\'s campaign slogan',
    metrics: { tmcSeats2011: '184/294', tmcSeats2021: '213/294', leftSeats2021: '0', wonElections: '2011, 2016, 2021' },
    media: [{
      type: 'photo',
      motif: 'mamata-portrait',
      image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mamata%20Banerjee%20at%20Pravasi%20Bharatiya%20Diwas.jpg?width=800',
      caption: 'Mamata Banerjee, "Didi"',
      credit: 'Government of India · CC-BY'
    }],
    sources: ['Election Commission of India', 'Sumantra Bose, Transforming India']
  }),

  new TimelineEvent({
    id: 'shahbag',
    order: 20.5,
    year: 2013,
    dateDisplay: '5 February 2013',
    title: 'Shahbag',
    subtitle: 'The young Bangladesh demands its old reckoning',
    track: 'bangladesh',
    era: 'modern',
    summary: 'Forty-two years after the genocide, a Dhaka intersection filled with young people demanding the war criminals be hanged. Bangladesh\'s unhealed 1971 wound came back to the surface.',
    body: [
      'On 5 February 2013, the International Crimes Tribunal (re-established by Sheikh Hasina in 2010 to try collaborators of the 1971 genocide) sentenced Jamaat-e-Islami leader Abdul Quader Mollah to life in prison. He had been convicted of mass murder, rape, and the killing of 344 civilians. Life imprisonment was not enough for the generation born after the war.',
      'Within hours, Imran H. Sarker and a small group of bloggers called for protests at the Shahbag intersection in central Dhaka. By the next morning the crowd was in the hundreds of thousands. They wanted the death penalty. They wanted Jamaat-e-Islami banned. They sang Tagore songs through the night. They built a Shaheed Minar replica from cardboard. They called themselves the Projonmo Chottor, the Generation Square, and they would not leave.',
      'It worked. Parliament amended the law to allow appeals against light sentences. Mollah was retried, sentenced to death, and hanged on 12 December 2013. Five more senior Jamaat-e-Islami leaders were executed by 2016. The movement also exposed the limit: Bangladesh\'s religious right struck back with its own mass protests, several bloggers from the Shahbag movement were murdered by Islamist extremists, and the country\'s underlying secular-vs-religious fault line, the one that produced Mujib\'s assassination and shaped every election since, was once again the central question of national life.'
    ],
    quote: 'We are the children of the Mukti Bahini. We were not done with 1971.',
    quoteAuthor: 'A Shahbag protester, February 2013',
    metrics: {
      crowdPeak: 'Hundreds of thousands',
      jamaatExecuted: '6 senior leaders',
      bloggersKilled: '5+ (2013–2016)',
      tribunalReopened: '2010'
    },
    media: [{ type: 'pattern', motif: 'shahbag-crowd' }],
    sources: ['Al Jazeera', 'International Crimes Tribunal of Bangladesh records', 'Human Rights Watch']
  }),

  new TimelineEvent({
    id: 'rohingya-crisis',
    order: 20.75,
    year: 2017,
    dateDisplay: '25 August 2017 – present',
    title: 'The Rohingya Crisis',
    subtitle: 'The largest refugee settlement on Earth, on the same delta',
    track: 'bangladesh',
    era: 'modern',
    summary: 'Two hundred and eighteen years after Captain Cox died running a refugee camp at Palongkee, the same river produced another wave. In ten weeks of late 2017, more than seven hundred and forty thousand Rohingya Muslims crossed the Naf into Bangladesh, fleeing a Burmese-army campaign the United States and the ICJ would later call genocide. Most have not gone home.',
    body: [
      'The Rohingya are a Muslim ethnic group from the northern part of Rakhine State in Myanmar, on the eastern shore of the Naf River. Their presence in the region is documented from at least the fifteenth century, when Muslim Bengali soldiers and administrators served the Buddhist Arakanese kings of Mrauk U. After Burmese independence in 1948, that history was steadily written out of the official one. In 1962 the military regime of Ne Win began stripping Rohingya of citizenship rights they had held under the post-colonial 1949 Residents of Myanmar Registration Act. In 1978 a military operation called Naga Min, Dragon King, drove about two hundred and fifty thousand Rohingya into Bangladesh; international pressure forced repatriation a few years later. Then in 1982 came the act that would do the structural work: the Burma Citizenship Law, which restricted full citizenship to those who could prove descent from one of the country\'s 135 officially recognised "national races," a list that pointedly excluded the Rohingya. To qualify by naturalisation a person had to prove their family had lived in Burma before the first Anglo-Burmese war of 1823, a near-impossible documentary bar. After 1982 the Rohingya were effectively stateless in the country they had been born in. Another roughly two hundred and fifty thousand fled to Bangladesh during the 1991–92 military operations.',
      'On 25 August 2017, militants of the Arakan Rohingya Salvation Army attacked thirty police posts in northern Rakhine, killing twelve officers. The response was disproportionate by an order of magnitude. The Tatmadaw — the Burmese army — launched what it called clearance operations, with auxiliary forces drawn from Rakhine Buddhist communities, across hundreds of Rohingya villages. The work was systematic. Villages were surrounded, men and boys separated and shot in groups, women and girls raped and then in many cases burned alive in their homes, the village then razed and the ash mass-graved. Médecins Sans Frontières estimated at least six thousand seven hundred Rohingya killed in the first month alone, including at least seven hundred and thirty children under five. The actual death toll is almost certainly higher and has never been counted. The survivors walked. By the end of October, more than seven hundred and forty thousand had crossed the Naf into Bangladesh, joining the roughly three hundred thousand from earlier waves who had never been able to return.',
      'They settled at Kutupalong-Balukhali, on the road south of Cox\'s Bazar town. The Bangladeshi government, with one of the world\'s smallest per-capita land budgets, cleared two thousand hectares of forest reserve and let them stay. Within a year the settlement was the largest single refugee camp on Earth, sheltering close to a million people in bamboo-and-tarpaulin shelters running shoulder to shoulder up the hills. Half a decade later it still is. Some Rohingya have been moved to Bhasan Char, a silt-island in the Bay of Bengal that surfaced in 2006, in a relocation scheme international observers have called involuntary. The camps in 2025 are nominally closed to NGO movement and increasingly subject to militia violence; ARSA itself has been assassinating Rohingya community leaders inside the camps for years. Repatriation has been negotiated three times and has failed three times. The Rohingya cannot go back to a Myanmar that does not consider them citizens.',
      'In November 2019 the small West African republic of The Gambia, on behalf of the fifty-seven members of the Organisation of Islamic Cooperation, filed a case at the International Court of Justice in The Hague accusing Myanmar of violating the 1948 Genocide Convention. In January 2020 the Court ordered Myanmar to take all measures in its power to prevent further acts of genocide against the Rohingya. In March 2022 the United States State Department officially determined that the 2017 Tatmadaw campaign had constituted genocide and crimes against humanity, only the eighth such determination the US has ever made. In July 2022 the ICJ rejected Myanmar\'s preliminary objections and found it had jurisdiction. From 12 to 29 January 2026, three months ago, the Court held public hearings on the merits of the case at the Peace Palace. A verdict is pending. Whatever it says, the camps remain. The Rohingya remain. The UN continues to call them the most persecuted minority on Earth, and Bangladesh, one of the poorest large countries in the world, continues to host them, on the same delta that took the Arakanese Buddhists in 1799, on the same coastline that buried Hiram Cox.'
    ],
    quote: 'We came with nothing. The people on this side gave us rice.',
    quoteAuthor: 'A Rohingya woman, Kutupalong camp, 2018',
    metrics: {
      citizenshipStripped: '1982 Burma Citizenship Law',
      earlierWaves: '~250K (1978) · ~250K (1991–92)',
      crossing2017: '740,000+ in 10 weeks',
      msfFirstMonthDeaths: '~6,700 killed incl. 730 under 5',
      campPopulation: '~1 million at Kutupalong-Balukhali',
      icjHearings: '12–29 January 2026 (verdict pending)'
    },
    media: [{ type: 'pattern', motif: 'rohingya-camp' }],
    sources: ['UNHCR Bangladesh — Cox\'s Bazar Operations', 'Médecins Sans Frontières mortality survey, December 2017', 'International Court of Justice — The Gambia v. Myanmar', 'US State Department determination, 21 March 2022', 'Independent Investigative Mechanism for Myanmar (IIMM)', 'Human Rights Watch reports']
  }),

  new TimelineEvent({
    id: 'july-uprising',
    order: 21,
    year: 2024,
    dateDisplay: '5 August 2024',
    title: 'The July Uprising',
    subtitle: 'Sheikh Hasina falls',
    track: 'bangladesh',
    era: 'present',
    summary: 'After fifteen years in power, Sheikh Hasina fled to India as student-led crowds stormed her residence. Muhammad Yunus was sworn in as Chief Adviser three days later.',
    body: [
      'It started over a job quota. On 5 June 2024, the Bangladesh High Court reinstated a 30% quota for descendants of 1971 freedom fighters in government jobs. Students at Dhaka University began protesting. The government cracked down. Police shot demonstrators. The hashtag #StepDownHasina trended.',
      'By late July, the movement had become a general uprising. The Human Rights Support Society later documented over 875 deaths and 30,000 injuries. On 5 August 2024, with crowds approaching Ganabhaban, Sheikh Hasina boarded a helicopter and flew to India. She has not returned. Her father\'s house at Dhanmondi 32 was burned by the crowd.',
      'On 8 August 2024, the 84-year-old Muhammad Yunus (Nobel laureate, founder of Grameen Bank, recently exonerated of charges Hasina\'s government had laid against him) was sworn in as Chief Adviser of the interim government. On 17 November 2025, Hasina was sentenced to death in absentia for crimes against humanity. On 12 February 2026, Bangladesh held a general election. The Bangladesh Nationalist Party won a landslide; Tarique Rahman, son of Khaleda Zia, was sworn in on 17 February 2026.'
    ],
    quote: 'I do not want to remain in power if my people don\'t want me.',
    quoteAuthor: 'Sheikh Hasina, days before her resignation',
    metrics: { protestDeaths: '875+', injured: '30,000+', daysToHandover: '3', yunusAge: '84' },
    media: [{ type: 'pattern', motif: 'july-uprising' }],
    sources: ['Al Jazeera', 'Human Rights Support Society', 'House of Commons Library briefing CBP-10096']
  }),

  new TimelineEvent({
    id: 'bjp-bengal-2026',
    order: 22,
    year: 2026,
    dateDisplay: '9 May 2026',
    title: 'The Saffron Tide',
    subtitle: 'BJP wins West Bengal for the first time',
    track: 'west-bengal',
    era: 'present',
    summary: 'In May 2026, Suvendu Adhikari was sworn in as the ninth Chief Minister of West Bengal, and the first BJP CM in the state\'s history. The cultural-political identity of Bengal is being rewritten in real time.',
    body: [
      'For seven decades, two ideas had governed West Bengal: secular Bengali nationalism (Congress, then Left, then Trinamool) and the cultural-cosmopolitan identity of Kolkata. The BJP\'s Hindutva had no purchase here. Mamata Banerjee built her career on holding the line.',
      'It cracked in 2026. After the Bangladesh transition, after a decade of Hindutva mobilization across India, after intra-TMC corruption scandals and dynastic fatigue, Suvendu Adhikari (a former Mamata lieutenant who defected to the BJP in December 2020) led the party to victory. He was sworn in as Chief Minister on 9 May 2026.',
      'On both sides of the border, the dominant political idea that ran from 1947 through the 2010s, namely secular Bengali identity, Hindu-Muslim braiding, and cultural nationalism rooted in language rather than religion, is now under contest. Whether Bengal as a single cultural unit can survive a Hindutva West Bengal and an Islamist-leaning post-Hasina Bangladesh is the open question of our decade.'
    ],
    quote: 'Sonar Bangla, golden Bengal, was never just a country. It was a feeling held in two scripts.',
    quoteAuthor: 'A Kolkata essayist, May 2026',
    metrics: { firstBJPCM: 'In WB history', dateSwornIn: '9 May 2026', mamataYears: '15', bengalDivision: 'Cultural now matches political' },
    media: [{ type: 'pattern', motif: 'bengal-flags' }],
    sources: ['Election Commission of India', 'Reuters']
  })
];

// Build an O(1) lookup index keyed by id.
// This is the simple data-structure decision the user asked for:
// we keep the array for ordered iteration (rendering) AND a Map for lookups
// (e.g. when a related-event link is clicked).
const TIMELINE_INDEX = new Map(TIMELINE.map(e => [e.id, e]));

// Group by era — used for the chapter dividers.
const ERAS = [
  {
    id: 'geography',
    label: 'The Land',
    range: 'Before history',
    kicker: 'Every scene in this story sits on a river. The Ajay, the Padma, the Ganges, the Brahmaputra. This piece opens by surfacing the river as the spine.'
  },
  { id: 'origins',    label: 'Origins',           range: 'c. 10,000 BC – 3rd c. BC' },
  { id: 'medieval',   label: 'Empires & Faith',   range: '750 – 1757 AD' },
  { id: 'colonial',   label: 'The British Century', range: '1757 – 1947' },
  { id: 'partition',  label: 'Partition',         range: '1947' },
  { id: 'pakistan',   label: 'Two Wings',         range: '1947 – 1971' },
  { id: 'liberation', label: 'Liberation',        range: '1971' },
  { id: 'modern',     label: 'Two Bengals',       range: '1971 – 2023' },
  { id: 'present',    label: 'The Present',       range: '2024 – now' }
];

// Cultural identity content — used in the closing sections.
const CULTURE = {
  language: {
    speakers: 285_000_000,
    rank: 6, // 6th most spoken native language globally
    persianLoanwords: 10_000,
    martyrsDay: '21 February (UNESCO International Mother Language Day, 1999)',
    script: 'Eastern Nagari (Bengali-Assamese)'
  },
  religion: {
    bangladesh: { muslim: 91, hindu: 8, other: 1 },
    westBengal: { hindu: 70, muslim: 27, other: 3 }
  },
  diaspora: [
    { country: 'United Kingdom', count: 652_500, hub: 'Banglatown, Tower Hamlets' },
    { country: 'Saudi Arabia',   count: 2_000_000, hub: 'Riyadh, Jeddah' },
    { country: 'UAE',            count: 706_000, hub: 'Dubai, Sharjah' },
    { country: 'United States',  count: 300_000, hub: 'New York, Detroit, Hamtramck' },
    { country: 'Italy',          count: 213_622, hub: 'Rome, Venice' },
    { country: 'Oman',           count: 680_000, hub: 'Muscat' },
    { country: 'Qatar',          count: 400_000, hub: 'Doha (~12.5% of pop.)' },
    { country: 'Kuwait',         count: 350_000, hub: 'Kuwait City' }
  ],
  remittancesFY2025: 30_040_000_000 // $30.04B
};

// Make available to other scripts
if (typeof window !== 'undefined') {
  window.TIMELINE = TIMELINE;
  window.TIMELINE_INDEX = TIMELINE_INDEX;
  window.ERAS = ERAS;
  window.CULTURE = CULTURE;
}
