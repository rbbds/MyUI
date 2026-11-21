import type { CompleteLocale } from '../utils/locale';

/**
 * Dutch (Netherlands) for MyUI: formats through Intl (€ 1.234,56, dd-mm-yyyy) and every built-in text.
 * Informal ("je"), short, sentence case. The type CompleteLocale makes the type check fail when a text is missing.
 *
 * ```tsx
 * import { LocaleProvider } from '@rbbds/ui';
 * import { nlNL } from '@rbbds/ui/locales/nl-NL';
 *
 * <LocaleProvider locale={nlNL}>…</LocaleProvider>
 * ```
 */
export const nlNL: CompleteLocale = {
  locale: 'nl-NL',
  labels: {
    // E-commerce
    price: { was: 'Van', now: 'Voor', vatExcl: 'excl. btw', vatIncl: 'incl. btw' },
    rating: { rating: (value, max) => `${value} van ${max} sterren`, reviews: (count) => `${count} ${count === 1 ? 'beoordeling' : 'beoordelingen'}` },
    quantityStepper: { decrease: 'Eén minder', increase: 'Eén meer' },
    stock: { 'in-stock': 'Op voorraad', low: 'Bijna uitverkocht', out: 'Uitverkocht', preorder: 'Pre-order' },
    cartItem: { quantity: (quantity) => `Aantal: ${quantity}`, quantityOf: (title) => `Aantal ${title}`, remove: (title) => `Verwijder ${title}` },
    cartSummary: { subtotal: 'Subtotaal', total: 'Totaal' },
    promoCode: { empty: 'Vul een kortingscode in.', remove: (code) => `Verwijder kortingscode ${code}`, apply: 'Toepassen' },
    cartButton: { count: (count) => `${count} ${count === 1 ? 'artikel' : 'artikelen'}` },
    miniCart: {
      title: (count) => `Winkelwagen (${count})`, subtotal: 'Subtotaal', checkout: 'Afrekenen', viewCart: 'Bekijk winkelwagen',
      emptyTitle: 'Je winkelwagen is leeg', emptyText: 'Bekijk de winkel en voeg iets toe.', continueShopping: 'Verder winkelen',
    },
    addressFields: {
      postcode: 'Postcode', houseNumber: 'Huisnummer', addition: 'Toevoeging', additionHint: 'Bijvoorbeeld A of 2e verdieping',
      street: 'Straat', city: 'Plaats', postcodeInvalid: 'Vul een postcode in zoals 1234 AB.',
    },
    filterGroup: { showLess: 'Toon minder', showAll: (count) => `Toon alle ${count}` },
    activeFilters: {
      results: (count) => `${count} ${count === 1 ? 'product' : 'producten'}`, list: 'Actieve filters',
      remove: (label) => `Verwijder filter ${label}`, clearAll: 'Wis alles',
    },
    productGallery: {
      gallery: (label) => `Afbeeldingen ${label}`, roleDescription: 'carrousel', previous: 'Vorige afbeelding', next: 'Volgende afbeelding',
      image: (index, total, alt) => `Afbeelding ${index} van ${total}: ${alt}`,
    },
    variantPicker: { unavailable: ', niet beschikbaar' },
    addToCart: { quantity: 'Aantal', quantityOf: (productName) => `Aantal ${productName}`, soldOut: 'Uitverkocht' },
    productCard: {
      wishlist: (title) => `Zet ${title} op je verlanglijst`, colors: (count) => `${count} ${count === 1 ? 'kleur' : 'kleuren'}`, addToCart: 'In winkelwagen',
    },

    // Content and data
    tableCard: { region: 'Tabel' },
    tableBulkActions: { count: (n) => `${n} geselecteerd`, clear: 'Wis selectie' },
    fileUpload: { action: 'Klik om te uploaden', drop: 'of sleep een bestand hierheen' },
    fileUploadItem: {
      failed: 'Uploaden is mislukt. Probeer het opnieuw.', uploading: (name) => `${name} uploaden`, uploaded: 'Geüpload',
      remove: (name) => `Verwijder ${name}`, uploadedFile: (name) => `${name} is geüpload`, failedFile: (name) => `${name}: uploaden is mislukt`,
    },
    tag: { remove: (label) => `Verwijder ${label}`.trim() },
    avatar: { online: 'Online', offline: 'Offline' },
    avatarGroup: { more: (count) => `${count} ${count === 1 ? 'ander' : 'anderen'}` },
    documentItem: { download: (title) => `Download ${title}`, unread: 'Nieuw' },
    metricCard: { up: 'Gestegen', down: 'Gedaald', neutral: 'Geen verandering' },
    checklist: { progress: (d, t) => `${d} van ${t} stappen klaar` },
    checklistItem: { done: 'Klaar' },

    // Forms
    combobox: { count: (count) => `${count} ${count === 1 ? 'resultaat' : 'resultaten'}`, required: 'Kies een optie uit de lijst.', toggle: 'Toon opties' },
    calendar: {
      previous: 'Vorige maand', next: 'Volgende maand',
      switchView: (v) => (v === 'year' ? 'Kies een jaar' : v === 'month' ? 'Kies een maand' : 'Terug naar dagen'),
    },
    datePicker: {
      calendar: 'Kies een datum', format: (p) => `Notatie: ${p}`, invalid: (p) => `Vul een datum in als ${p}.`,
      unavailable: ({ min, max }) =>
        min && max ? `Kies een datum tussen ${min} en ${max}.`
        : min ? `Kies een datum op of na ${min}.`
        : max ? `Kies een datum op of voor ${max}.`
        : 'Deze datum is niet beschikbaar. Kies een andere datum.',
    },
    dateRangePreset: {
      today: 'Vandaag', yesterday: 'Gisteren', last7: 'Laatste 7 dagen', last30: 'Laatste 30 dagen',
      thisMonth: 'Deze maand', lastMonth: 'Vorige maand', thisYear: 'Dit jaar',
    },
    dateRangePicker: {
      quickPicks: 'Snelkeuzes', custom: 'Aangepast', cancel: 'Annuleren', apply: 'Toepassen',
      chooseStart: 'Kies een begindatum', chooseEnd: 'Kies een einddatum',
      days: (count) => `${count} ${count === 1 ? 'dag' : 'dagen'}`, dialog: 'Kies een periode',
    },
    input: { help: 'Meer informatie' },
    rangeSlider: { min: 'Minimum', max: 'Maximum' },
    searchInput: { clear: 'Wis zoekopdracht' },
    copyInput: { copy: 'Kopiëren', copied: 'Gekopieerd', copiedMessage: 'Gekopieerd naar het klembord.' },
    passwordRequirement: { length: 'Minstens 12 tekens', case: 'Een hoofdletter en een kleine letter', digit: 'Een cijfer of een symbool' },
    passwordInput: {
      empty: 'Kies een sterk wachtwoord', weak: 'Sterkte: zwak', fair: 'Sterkte: redelijk', good: 'Sterkte: goed', strong: 'Sterkte: sterk',
      met: ', voldaan', notMet: ', nog niet voldaan', show: 'Toon wachtwoord', hide: 'Verberg wachtwoord',
    },

    // Navigation
    header: { label: 'Hoofdmenu', menu: 'Open menu', menuTitle: 'Menu' },
    sidebar: { label: 'Hoofdmenu', footer: 'Meer', collapse: 'Klap zijbalk in', expand: 'Klap zijbalk uit' },
    dualSidebar: { rail: 'Onderdelen', railFooter: 'Meer', collapse: 'Klap paneel in', expand: 'Klap paneel uit' },
    breadcrumbs: { label: 'Kruimelpad', home: 'Home', back: 'Terug' },
    pagination: { label: 'Paginering', previous: 'Vorige', next: 'Volgende', pageStatus: (p, c) => `Pagina ${p} van ${c}`, page: (p) => `Pagina ${p}` },
    stepper: { label: 'Voortgang', complete: 'afgerond', current: 'huidige stap', upcoming: 'nog te doen' },

    // Feedback and overlays
    alert: { close: 'Sluiten' },
    banner: { close: 'Sluit melding', region: 'Melding' },
    modal: { close: 'Sluiten' },
    slideout: { close: 'Sluiten' },
    popover: { close: 'Sluiten' },
    commandMenu: {
      search: 'Zoeken', results: 'Resultaten', escapeKey: 'Esc', count: (count) => `${count} ${count === 1 ? 'resultaat' : 'resultaten'}`,
      navigate: 'navigeren', select: 'openen', close: 'sluiten',
    },
    notificationButton: { count: (n) => `${n} ongelezen` },
    notificationItem: { unread: 'Ongelezen' },
    notificationPanel: { emptyTitle: 'Geen nieuwe meldingen', emptyText: 'Je bent helemaal bij.', markAll: 'Markeer alles als gelezen' },
  },
  texts: {
    'addToCart.label': 'In winkelwagen',
    'bottomNavigation.label': 'Hoofdmenu',
    'cartButton.label': 'Winkelwagen',
    'cartSummary.title': 'Overzicht',
    'cartSummary.totalNote': 'Inclusief btw',
    'combobox.emptyText': 'Geen resultaten',
    'combobox.placeholder': 'Kies of typ om te zoeken',
    'commandMenu.emptyText': 'Geen resultaten gevonden.',
    'commandMenu.label': 'Opdrachten',
    'commandMenu.placeholder': 'Zoek of typ een opdracht…',
    'countrySelect.allLabel': 'Alle landen',
    'countrySelect.placeholder': 'Kies een land',
    'countrySelect.preferredLabel': 'Veelgekozen',
    'dateRangePicker.placeholder': 'Kies een periode',
    'notificationButton.label': 'Meldingen',
    'notificationPanel.title': 'Meldingen',
    'promoCode.label': 'Kortingscode',
    'quantityStepper.label': 'Aantal',
    'searchInput.placeholder': 'Zoeken',
    'spinner.label': 'Laden',
    'toastRegion.label': 'Meldingen',
  },
};
