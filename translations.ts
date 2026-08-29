// Centralized UI translations: English and Tamil
export type LangCode = 'ta' | 'en' | string;

export const t = (langCode: LangCode, key: string): string => {
  const translations: Record<string, Record<string, string>> = {
    // ── App / Navigation ──────────────────────────────────────────────────
    'nav.chat': { en: 'Health Chat Triage', ta: 'மருத்துவ உரையாடல்' },
    'nav.chat.desc': { en: 'Symptom advice & AI care', ta: 'அறிகுறி ஆலோசனை & AI உதவி' },
    'nav.voice': { en: 'Live Voice Support', ta: 'நேரடி குரல் உதவி' },
    'nav.voice.desc': { en: 'Hands-free voice AI', ta: 'கைமுக்தி குரல் AI' },
    'nav.locator': { en: 'Clinic & Specialist Finder', ta: 'மருத்துவமனை & நிபுணர் கண்டுபிடிப்பு' },
    'nav.locator.desc': { en: 'Nearby hospitals & doctors', ta: 'அருகிலுள்ள மருத்துவமனைகள்' },
    'nav.medicine': { en: 'Pill & Medication Guide', ta: 'மாத்திரை & மருந்து வழிகாட்டி' },
    'nav.medicine.desc': { en: 'Dosage & safe usage info', ta: 'அளவு & பாதுகாப்பான பயன்பாடு' },
    'nav.symptoms': { en: 'Symptom Triage Checker', ta: 'அறிகுறி பரிசோதனை' },
    'nav.symptoms.desc': { en: 'Risk level calculator', ta: 'அபாயம் அளவு கணக்கீடு' },
    'nav.firstaid': { en: 'First-Aid & Emergency Guide', ta: 'முதலுதவி & அவசர வழிகாட்டி' },
    'nav.firstaid.desc': { en: 'Snakebite, ORS, CPR cards', ta: 'பாம்பு கடி, ORS, CPR அட்டைகள்' },
    'nav.vaccines': { en: 'Child Immunization Tracker', ta: 'குழந்தை தடுப்பூசி கண்காணிப்பு' },
    'nav.vaccines.desc': { en: 'Vaccine schedule checklist', ta: 'தடுப்பூசி அட்டவணை பட்டியல்' },
    'nav.schemes': { en: 'Govt. Health Schemes & Aid', ta: 'அரசு நல திட்டங்கள் & உதவிகள்' },
    'nav.schemes.desc': { en: 'CMCHIS, PM-JAY, PMMVY…', ta: 'CMCHIS, PM-JAY, PMMVY…' },
    'nav.services': { en: 'Health Services', ta: 'சுகாதார சேவைகள்' },
    'nav.sos': { en: 'SOS Emergency Satellite', ta: 'SOS அவசர செயற்கைக்கோள்' },
    'nav.emergency.msg': { en: 'Emergency? Call 112 or Ambulance 108', ta: 'அவசரம்? 112 அல்லது ஆம்புலன்ஸ் 108 அழைக்கவும்' },
    'header.doctor': { en: 'Live Doctor', ta: 'நேரடி மருத்துவர்' },
    'header.subtitle': { en: 'Community Care', ta: 'சமுதாய சுகாதாரம்' },
    'disclaimer': {
      en: 'Disclaimer: This AI assistant is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provider.',
      ta: 'மறுப்பு: இந்த AI உதவியாளர் தகவல் நோக்கங்களுக்காக மட்டுமே. இது தொழில்முறை மருத்துவ ஆலோசனை, நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாக அல்ல. எப்போதும் தகுதியான மருத்துவரின் ஆலோசனையை நாடுங்கள்.',
    },

    // ── Chat ──────────────────────────────────────────────────────────────
    'chat.welcome': {
      en: 'Hello! I am your VillageHealth Assistant. I can help you with health information, symptom guidance, and finding local clinics. How are you feeling today?',
      ta: 'வணக்கம்! நான் உங்கள் கிராம சுகாதார உதவியாளன். அறிகுறிகள், மருந்துகள் மற்றும் மருத்துவமனை தகவல்களை என்னிடம் கேட்கலாம். இன்று நீங்கள் எப்படி உணர்கிறீர்கள்?',
    },
    'chat.placeholder': { en: 'Ask your health question here...', ta: 'உங்கள் மருத்துவ கேள்வியை இங்கே கேளுங்கள்...' },
    'chat.footer': {
      en: 'VillageHealth AI can make mistakes. Always consult a local health worker for medical decisions.',
      ta: 'VillageHealth AI தவறு செய்யலாம். மருத்துவ முடிவுகளுக்கு எப்போதும் உள்ளூர் மருத்துவரை அணுகவும்.',
    },
    'chat.livedoctor': { en: 'Connect Live Doctor', ta: 'நேரடி மருத்துவர் இணைப்பு' },
    'chat.advice': { en: 'Need direct medical advice?', ta: 'நேரடி மருத்துவ ஆலோசனை வேண்டுமா?' },
    'chat.error': {
      en: 'I encountered an error. Please check your API key or try again.',
      ta: 'ஒரு பிழை ஏற்பட்டது. API திறவுகோலை சரிபார்க்கவும் அல்லது மீண்டும் முயற்சிக்கவும்.',
    },
    'chat.sources': { en: 'Reliable Sources', ta: 'நம்பகமான ஆதாரங்கள்' },

    // ── Voice ─────────────────────────────────────────────────────────────
    'voice.title.idle': { en: 'Live Voice Assistant', ta: 'நேரடி குரல் உதவியாளர்' },
    'voice.title.listening': { en: "I'm Listening...", ta: 'கேட்கிறேன்...' },
    'voice.title.thinking': { en: 'Analyzing Medical Info...', ta: 'மருத்துவ தகவலை ஆராய்கிறது...' },
    'voice.title.speaking': { en: 'AI Responding Out Loud...', ta: 'AI சத்தமாக பதிலளிக்கிறது...' },
    'voice.subtitle.idle': { en: 'Tap the microphone or type below to get a spoken response.', ta: 'கீழே மைக்ரோஃபோனை தட்டவும் அல்லது தட்டச்சு செய்து குரல் பதிலைப் பெறுங்கள்.' },
    'voice.subtitle.active': { en: 'Listening in {lang}. Speak now — I will reply out loud.', ta: '{lang} மொழியில் கேட்கிறேன். இப்போது பேசுங்கள் — நான் சத்தமாக பதிலளிப்பேன்.' },
    'voice.btn.stop': { en: 'Tap to Stop', ta: 'நிறுத்த தட்டவும்' },
    'voice.btn.start': { en: 'Tap to Speak', ta: 'பேச தட்டவும்' },
    'voice.btn.processing': { en: 'Processing...', ta: 'செயலாக்குகிறது...' },
    'voice.btn.speaking': { en: 'Speaking...', ta: 'பேசுகிறது...' },
    'voice.transcript.label': { en: 'Transcribed Speech:', ta: 'குரல் எழுத்தாக்கம்:' },
    'voice.response.label': { en: 'AI Audio Response', ta: 'AI குரல் பதில்' },
    'voice.replay': { en: 'Replay Audio', ta: 'மீண்டும் கேளுங்கள்' },
    'voice.input.placeholder': { en: 'Type or ask a voice question...', ta: 'கேள்வியை தட்டச்சு செய்க...' },
    'voice.no.mic': {
      en: 'Microphone access denied. You can still use the text input below.',
      ta: 'மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது. கீழே உள்ள உரை உள்ளீட்டை பயன்படுத்துங்கள்.',
    },
    'voice.not.supported': {
      en: 'Voice recognition not supported. Use Chrome or Edge, or type below.',
      ta: 'குரல் அங்கீகாரம் ஆதரிக்கப்படவில்லை. Chrome அல்லது Edge பயன்படுத்தவும் அல்லது கீழே தட்டச்சு செய்யவும்.',
    },
    'voice.card.audio': { en: 'Audio Support', ta: 'ஒலி ஆதரவு' },
    'voice.card.audio.desc': { en: 'Clear audio playback', ta: 'தெளிவான ஒலி இயக்கம்' },
    'voice.card.multi': { en: 'Continuous Stream', ta: 'தொடர்ந்த ஸ்ட்ரீம்' },
    'voice.card.multi.desc': { en: 'Zero auto-disconnects', ta: 'தானாக துண்டிக்கப்பாட்டு இல்லை' },

    // ── Location ──────────────────────────────────────────────────────────
    'loc.title': { en: 'Nearby Health Facilities', ta: 'அருகிலுள்ள மருத்துவ வசதிகள்' },
    'loc.subtitle': { en: 'Find public clinics, specialized doctors, and emergency centers near you.', ta: 'அருகிலுள்ள பொது மருத்துவமனைகள், நிபுணர்கள் மற்றும் அவசர சேவைகளை கண்டறியுங்கள்.' },
    'loc.filter': { en: 'Filter by Medical Need:', ta: 'மருத்துவ தேவையின்படி வடிகட்டு:' },
    'loc.refresh': { en: 'Refresh Directory', ta: 'மீண்டும் தேடு' },
    'loc.no.location': { en: 'Location Access Required', ta: 'இருப்பிட அணுகல் தேவை' },
    'loc.no.location.msg': { en: 'Enable GPS to find clinics near your position.', ta: 'GPS இயக்கி அருகிலுள்ள மருத்துவமனைகளைக் கண்டறியுங்கள்.' },
    'loc.call': { en: 'Call Center', ta: 'மருத்துவமனையை அழைக்கவும்' },
    'loc.directions': { en: 'Directions', ta: 'வழிகாட்டு' },
    'loc.verified': { en: 'Verified resource', ta: 'சரிபார்க்கப்பட்ட வளம்' },

    // ── Medication ────────────────────────────────────────────────────────
    'med.title': { en: 'Pill & Medication Guide', ta: 'மாத்திரை & மருந்து வழிகாட்டி' },
    'med.subtitle': { en: 'Search any medicine name for clear usage & safety instructions.', ta: 'எந்த மருந்தின் பெயரையும் தேடி தெளிவான பயன்பாடு மற்றும் பாதுகாப்பு வழிமுறைகளைப் பெறுங்கள்.' },
    'med.placeholder': { en: 'Type medicine name (e.g. Paracetamol)...', ta: 'மருந்தின் பெயரை உள்ளிடவும் (எ.கா. Paracetamol)...' },
    'med.search': { en: 'Search Info', ta: 'தேடு' },
    'med.common': { en: 'Common Community Medicines:', ta: 'அடிக்கடி பயன்படுத்தப்படும் மருந்துகள்:' },
    'med.disclaimer': {
      en: 'Always verify dosages with a doctor or pharmacist. Never double dose or take unprescribed antibiotics.',
      ta: 'அளவுகளை எப்போதும் மருத்துவர் அல்லது மருந்தாளுநரிடம் சரிபார்க்கவும். இரட்டை அளவு அல்லது மருந்தேட்டு இல்லாமல் ஆன்டிபயாடிக் எடுக்காதீர்கள்.',
    },

    // ── Symptom Checker ───────────────────────────────────────────────────
    'sym.title': { en: 'Interactive Symptom Triage', ta: 'அறிகுறி பரிசோதனை' },
    'sym.subtitle': { en: 'Select symptoms to calculate medical risk level and next steps.', ta: 'மருத்துவ அபாய நிலை மற்றும் அடுத்த படிகளை கணக்கிட அறிகுறிகளைத் தேர்ந்தெடுக்கவும்.' },
    'sym.reset': { en: 'Reset', ta: 'மீட்டமை' },
    'sym.step1': { en: 'Step 1: Select Affected Area', ta: 'படி 1: பாதிக்கப்பட்ட பகுதியைத் தேர்ந்தெடுக்கவும்' },
    'sym.step2.title': { en: 'Step 2: Check Specific Symptoms', ta: 'படி 2: குறிப்பிட்ட அறிகுறிகளை சரிபார்க்கவும்' },
    'sym.step2.change': { en: '← Change Area', ta: '← பகுதியை மாற்று' },
    'sym.duration': { en: 'Symptom Duration:', ta: 'அறிகுறி காலம்:' },
    'sym.redflag': { en: 'Any sudden severe red-flag symptoms?', ta: 'திடீர் கடுமையான அவசர அறிகுறிகள் உள்ளதா?' },
    'sym.redflag.desc': { en: 'Chest pain, sudden confusion, difficulty breathing, or severe fainting.', ta: 'நெஞ்சு வலி, திடீர் குழப்பம், சுவாசிக்கல் சிரமம் அல்லது கடுமையான மயக்கம்.' },
    'sym.redflag.yes': { en: 'YES (Critical)', ta: 'ஆம் (அவசரம்)' },
    'sym.redflag.no': { en: 'NO', ta: 'இல்லை' },
    'sym.view.result': { en: 'View Clinical Risk Assessment', ta: 'மருத்துவ அபாய மதிப்பீட்டை காண்க' },
    'sym.summary': { en: 'Summary of Selected Parameters:', ta: 'தேர்ந்தெடுக்கப்பட்ட அளவுருக்களின் சுருக்கம்:' },
    'sym.summary.symptoms': { en: 'Symptoms:', ta: 'அறிகுறிகள்:' },
    'sym.summary.duration': { en: 'Duration:', ta: 'காலம்:' },
    'sym.summary.flags': { en: 'Emergency Flags:', ta: 'அவசர குறிகள்:' },
    'sym.action.label': { en: 'Recommended Clinical Action', ta: 'பரிந்துரைக்கப்பட்ட மருத்துவ நடவடிக்கை' },
    'sym.call': { en: 'Call Live Health Line (104)', ta: 'நேரடி சுகாதார எண் (104) அழைக்கவும்' },
    'sym.startover': { en: 'Start Over', ta: 'மீண்டும் தொடங்கு' },

    // ── First Aid ─────────────────────────────────────────────────────────
    'fa.title': { en: 'Rural Emergency First-Aid Guide', ta: 'கிராம அவசர முதலுதவி வழிகாட்டி' },
    'fa.subtitle': { en: 'Instant offline-accessible critical protocols for rural health crises.', ta: 'கிராமப்புற சுகாதார நெருக்கடிகளுக்கான உடனடி முதலுதவி வழிமுறைகள்.' },

    // ── Immunization ──────────────────────────────────────────────────────
    'vac.title': { en: 'Child Immunization & Vaccine Tracker', ta: 'குழந்தை தடுப்பூசி & கண்காணிப்பு' },
    'vac.subtitle': { en: 'Track national Essential Immunization Schedule from birth through 2 years.', ta: 'பிறப்பு முதல் 2 வயது வரையிலான தேசிய தடுப்பூசி அட்டவணையை கண்காணிக்கவும்.' },
    'vac.protection': { en: 'Protection Level', ta: 'பாதுகாப்பு நிலை' },
    'vac.done': { en: 'Done', ta: 'முடிந்தது' },

    // ── Govt Schemes ──────────────────────────────────────────────────────
    'gov.title': { en: 'Government Health Schemes & Financial Aids', ta: 'அரசு சுகாதார திட்டங்கள் & நிதி உதவிகள்' },
    'gov.subtitle': { en: 'Explore free health insurance, maternal aids, and enrollment guidelines.', ta: 'இலவச மருத்துவக் காப்பீடு, மகப்பேறு உதவிகள் மற்றும் சேர்க்கை வழிகாட்டுதல்களை ஆராயுங்கள்.' },
    'gov.search.placeholder': { en: 'Search scheme name or benefit (e.g. CMCHIS, PM-JAY)...', ta: 'திட்டம் அல்லது சலுகை பெயர் தேடுக (எ.கா. CMCHIS, PM-JAY)...' },
    'gov.coverage': { en: 'Key Coverage & Benefit:', ta: 'முக்கிய பயன்கள் & சலுகைகள்:' },
    'gov.eligibility': { en: 'Eligibility:', ta: 'தகுதி:' },
    'gov.documents': { en: 'Required Documents:', ta: 'தேவையான ஆவணங்கள்:' },
    'gov.call': { en: 'Call Helpline', ta: 'உதவி எண் அழைக்கவும்' },
    'gov.portal': { en: 'Official Portal', ta: 'அதிகாரப்பூர்வ தளம்' },
    'gov.noresult': { en: 'No matching health schemes found. Try a different search term.', ta: 'பொருந்தும் திட்டங்கள் இல்லை. வேறு வார்த்தைகளில் தேடுங்கள்.' },
    'gov.cat.all': { en: 'All Schemes', ta: 'அனைத்து திட்டங்கள்' },
    'gov.cat.insurance': { en: 'Free Insurance', ta: 'இலவச காப்பீடு' },
    'gov.cat.maternal': { en: 'Maternal & Mother', ta: 'மகப்பேறு உதவி' },
    'gov.cat.doorstep': { en: 'Doorstep Care', ta: 'வீட்டு வாசல் சேவை' },
    'gov.cat.medicines': { en: 'Generic Meds', ta: 'குறைந்த விலை மருந்து' },

    // ── SOS Modal ─────────────────────────────────────────────────────────
    'sos.title': { en: 'Satellite SOS Beacon', ta: 'செயற்கைக்கோள் SOS அலற்றி' },
    'sos.subtitle': { en: 'Direct Satellite Telemetry & Dispatch Support', ta: 'நேரடி செயற்கைக்கோள் தரவு & அனுப்புதல் ஆதரவு' },
    'sos.tab.beacon': { en: 'Satellite Beacon Payload', ta: 'செயற்கைக்கோள் அலற்றி தரவு' },
    'sos.tab.firstaid': { en: 'Instant Life Support Protocol', ta: 'உடனடி உயிர் காப்பு வழிமுறை' },
    'sos.broadcast.title': { en: 'Broadcast Emergency Signal?', ta: 'அவசர சமிக்ஞை அனுப்பவா?' },
    'sos.broadcast.desc': {
      en: 'Transmits your precise GPS coordinates over the satellite telemetry network to emergency dispatch (112 / 108).',
      ta: 'உங்கள் துல்லியமான GPS ஆயத்தொலைவுகளை செயற்கைக்கோள் வழியாக அவசர சேவைகளுக்கு (112 / 108) அனுப்புகிறது.',
    },
    'sos.gps.acquired': { en: 'GPS Location Acquired', ta: 'GPS இருப்பிடம் கண்டறியப்பட்டது' },
    'sos.gps.accuracy': { en: 'Accuracy', ta: 'துல்லியம்' },
    'sos.transmit.btn': { en: 'Initiate Emergency Satellite Transmission', ta: 'அவசர செயற்கைக்கோள் அனுப்புதலை தொடங்கு' },
    'sos.connecting': { en: 'Establishing Constellation Connection...', ta: 'செயற்கைக்கோள் இணைப்பை நிறுவுகிறது...' },
    'sos.beacon.active': { en: 'Emergency Satellite Beacon Active', ta: 'அவசர செயற்கைக்கோள் அலற்றி செயல்படுகிறது' },
    'sos.beacon.active.desc': { en: 'Telemetry broadcast in progress. Emergency payload sent.', ta: 'தரவு அனுப்பல் நடைபெறுகிறது. அவசர தரவு அனுப்பப்பட்டது.' },
    'sos.helplines': { en: 'Direct Emergency Helplines', ta: 'நேரடி அவசர உதவி எண்கள்' },
    'sos.call.112': { en: 'Call 112 (Emergency)', ta: '112 அழைக்கவும் (அவசரம்)' },
    'sos.call.108': { en: 'Call 108 (Ambulance)', ta: '108 அழைக்கவும் (ஆம்புலன்ஸ்)' },
    'sos.close': { en: 'Close Beacon Window', ta: 'மூடு' },
    'sos.telemetry.active': { en: 'Telemetry Active', ta: 'தரவு அனுப்பல் செயல்படுகிறது' },
    'sos.firstaid.title': { en: 'Critical Immediate Life Support Checklist', ta: 'அவசர உயிர் காப்பு பட்டியல்' },
    'sos.fa.cardiac': { en: '1. Chest Pain / Cardiac Arrest Protocol', ta: '1. நெஞ்சு வலி / இதயத் துடிப்பு நின்றால்' },
    'sos.fa.cardiac.desc': {
      en: 'Keep patient seated comfortably. Loosen clothing. If unresponsive and not breathing, begin chest compressions at 100-120 BPM.',
      ta: 'நோயாளியை வசதியாக அமர வையுங்கள். உடைகளை தளர்த்துங்கள். சுவாசிக்கவில்லை என்றால் நெஞ்சை 100-120 BPM வேகத்தில் அழுத்துங்கள்.',
    },
    'sos.fa.bleeding': { en: '2. Severe Bleeding / Hemorrhage', ta: '2. கடுமையான இரத்தப்போக்கு' },
    'sos.fa.bleeding.desc': {
      en: 'Apply direct, heavy continuous pressure with a clean cloth. Elevate limb above heart if possible.',
      ta: 'சுத்தமான துணியால் நேரடியாக தொடர்ந்து அழுத்துங்கள். முடிந்தால் கையை இதயத்தை விட உயரமாக வையுங்கள்.',
    },
    'sos.fa.choking': { en: '3. Choking / Breathing Difficulty', ta: '3. மூச்சுத்திணறல் / சுவாசிக்கல் சிரமம்' },
    'sos.fa.choking.desc': {
      en: 'Encourage coughing. For severe obstruction, stand behind patient and administer firm abdominal thrusts (Heimlich).',
      ta: 'இருமலை ஊக்குவியுங்கள். கடுமையான அடைப்புக்கு நோயாளியின் பின்னால் நின்று வயிற்றை கையால் அழுத்துங்கள்.',
    },
    'sos.fa.fever': { en: '4. Pediatric High Fever / Convulsions', ta: '4. குழந்தைக்கு அதிக காய்ச்சல் / வலிப்பு' },
    'sos.fa.fever.desc': {
      en: 'Keep child cool, remove heavy blankets, apply lukewarm sponge baths. Keep airway clear.',
      ta: 'குழந்தையை குளிர்ச்சியாக வையுங்கள், போர்வைகளை அகற்றுங்கள், வெதுவெதுப்பான நீரில் ஸ்பாஞ்ச் குளிப்பாட்டுங்கள். சுவாசப்பாதை தெளிவாக இருக்கட்டும்.',
    },

    // ── Live Doctor Modal ─────────────────────────────────────────────────
    'doc.title': { en: 'Live Doctor Consultation', ta: 'நேரடி மருத்துவர் ஆலோசனை' },
    'doc.subtitle': { en: 'Connect with certified duty medical officers', ta: 'சான்றிதழ் பெற்ற கடமை மருத்துவர்களுடன் இணைக்கவும்' },
    'doc.notice': { en: '24/7 Telemedicine Hotline & Live Duty Officer', ta: '24/7 டெலிமெடிசின் ஹாட்லைன் & நேரடி கடமை மருத்துவர்' },
    'doc.notice.desc': {
      en: 'Free triage consultation via National Tele-Health Services (104) and local community healthcare networks.',
      ta: 'தேசிய டெலி-சுகாதார சேவைகள் (104) மற்றும் உள்ளூர் சமுதாய சுகாதார வலைப்பின்னல் வழியாக இலவச ஆலோசனை.',
    },
    'doc.mode': { en: 'Select Mode', ta: 'பயன்முறை தேர்வு' },
    'doc.audio': { en: 'Audio Call', ta: 'ஒலி அழைப்பு' },
    'doc.audio.desc': { en: 'Low bandwidth suitable', ta: 'குறைந்த அலைவரிசை ஏற்றது' },
    'doc.video': { en: 'Video Call', ta: 'வீடியோ அழைப்பு' },
    'doc.video.desc': { en: 'Visual symptom check', ta: 'காட்சி அறிகுறி பரிசோதனை' },
    'doc.available': { en: 'Duty Medical Officer Available', ta: 'கடமை மருத்துவர் கிடைக்கிறார்' },
    'doc.wait': { en: 'Avg wait time: < 1 min', ta: 'சராசரி காத்திருப்பு நேரம்: < 1 நிமிடம்' },
    'doc.online': { en: 'Online', ta: 'இணையில் இருக்கிறார்' },
    'doc.connect': { en: 'Connect to Available Doctor Now', ta: 'இப்போது மருத்துவரை இணைக்கவும்' },
    'doc.dial': { en: 'Or direct dial 104 (National Health Helpline)', ta: 'அல்லது நேரடியாக 104 (தேசிய சுகாதார ஹாட்லைன்) அழைக்கவும்' },
    'doc.searching': { en: 'Assigning Duty Medical Officer...', ta: 'கடமை மருத்துவரை நியமிக்கிறது...' },
    'doc.searching.desc': { en: 'Connecting via secure tele-health channel', ta: 'பாதுகாப்பான டெலி-சுகாதார சேனல் வழியாக இணைக்கிறது' },
    'doc.ready': { en: 'Consultation Line Ready!', ta: 'ஆலோசனை எண் தயாராக உள்ளது!' },
    'doc.standby': { en: 'Dr. S. Ramesh (MBBS, General Medicine) is on standby.', ta: 'டாக்டர். S. ரமேஷ் (MBBS, பொது மருத்துவம்) காத்திருக்கிறார்.' },
    'doc.hotline': { en: 'Hotline Number:', ta: 'ஹாட்லைன் எண்:' },
    'doc.language': { en: 'Language:', ta: 'மொழி:' },
    'doc.call.btn': { en: 'Tap to Call Duty Doctor (104)', ta: 'கடமை மருத்துவரை அழைக்க தட்டவும் (104)' },
    'doc.back': { en: 'Back to options', ta: 'விருப்பங்களுக்கு திரும்பு' },

    // ── Common ────────────────────────────────────────────────────────────
    'common.send': { en: 'Send', ta: 'அனுப்பு' },
    'common.loading': { en: 'Loading...', ta: 'ஏற்றுகிறது...' },
    'common.close': { en: 'Close', ta: 'மூடு' },
    'common.no.none': { en: 'None reported', ta: 'எதுவும் தெரிவிக்கப்படவில்லை' },
    'common.yes': { en: 'YES', ta: 'ஆம்' },
  };

  const entry = translations[key];
  if (!entry) return key;
  return entry[langCode] ?? entry['en'] ?? key;
};
