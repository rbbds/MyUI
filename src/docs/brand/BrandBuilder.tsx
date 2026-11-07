import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Copy, Download, Search } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Form/Input';
import { Select } from '../../components/Form/Select';
import { SelectionCard, SelectionCardGroup } from '../../components/Selection/SelectionCard';
import { Toggle } from '../../components/Selection/Checkbox';
import { Alert } from '../../components/Overlay/Alert';
import { Card } from '../../components/Content/Content';
import { Badge } from '../../components/Display/Display';
import { Header } from '../../components/Navigation/AppShell';
import { brandScale, contrast, STEPS } from './color';
import './BrandBuilder.css';

/* Styles = the brand modes in Figma (brand/wl) and the data-brand blocks in tokens.css. */
const STYLES = [
  { id: 'iris', name: 'Iris', shape: 'Licht afgerond', text: 'Kleine afronding, rustige titels. De standaard.' },
  { id: 'forest', name: 'Forest', shape: 'Hoekig', text: 'Rechte hoeken, strak en zakelijk.' },
  { id: 'berry', name: 'Berry', shape: 'Rond', text: 'Ronde knoppen en velden, zware titels, randen van 2 px.' },
] as const;
type StyleId = (typeof STYLES)[number]['id'];
const STYLE_COLOR: Record<StyleId, string> = { iris: '#4f46e0', forest: '#176f42', berry: '#c21d67' };

/* Free Google Fonts; self-host them in a project with @fontsource. */
const FONTS = ['Inter', 'DM Sans', 'Manrope', 'Work Sans', 'Nunito Sans', 'Source Sans 3', 'Open Sans', 'Lato', 'Roboto', 'Poppins', 'Montserrat', 'Plus Jakarta Sans', 'Figtree', 'Source Serif 4', 'Merriweather', 'Lora', 'Playfair Display', 'Fraunces'];
const SERIF = new Set(['Source Serif 4', 'Merriweather', 'Lora', 'Playfair Display', 'Fraunces']);
const stack = (f: string) => (SERIF.has(f) ? `"${f}", ui-serif, Georgia, serif` : `"${f}", ui-sans-serif, system-ui, sans-serif`);
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'mijn-merk';

function loadGoogleFont(family: string) {
  if (family === 'Inter') return; // already loaded in Storybook
  const id = `bb-font-${slug(family)}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

export function BrandBuilder() {
  const [name, setName] = useState('Mijn merk');
  const [style, setStyle] = useState<StyleId>('iris');
  const [color, setColor] = useState(STYLE_COLOR.iris);
  const [hexText, setHexText] = useState(STYLE_COLOR.iris);
  const [body, setBody] = useState('Inter');
  const [title, setTitle] = useState('Inter');
  const [logo, setLogo] = useState<string | null>(null);
  const [showDark, setShowDark] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => brandScale(color), [color]);
  const scale = result?.scale;

  /* Apply to the whole preview: tokens are computed on <html>, so overrides must live there. */
  useEffect(() => {
    const root = document.documentElement;
    const prevBrand = root.getAttribute('data-brand');
    if (style === 'iris') root.removeAttribute('data-brand'); else root.setAttribute('data-brand', style);
    const props: [string, string][] = [['--wl-fonts-body', stack(body)], ['--wl-fonts-title', stack(title)]];
    if (scale) STEPS.forEach((s) => props.push([`--wl-color-brand-${s}`, scale[s]]));
    props.forEach(([k, v]) => root.style.setProperty(k, v));
    loadGoogleFont(body);
    loadGoogleFont(title);
    return () => {
      props.forEach(([k]) => root.style.removeProperty(k));
      if (prevBrand) root.setAttribute('data-brand', prevBrand); else root.removeAttribute('data-brand');
    };
  }, [style, scale, body, title]);

  useEffect(() => () => { if (logo) URL.revokeObjectURL(logo); }, [logo]);

  const pickStyle = (id: StyleId) => {
    // keep a color the user picked; only follow the style color while it is still a style default
    if (Object.values(STYLE_COLOR).includes(color)) { setColor(STYLE_COLOR[id]); setHexText(STYLE_COLOR[id]); }
    setStyle(id);
  };
  const onHex = (v: string) => {
    setHexText(v);
    const h = v.startsWith('#') ? v : `#${v}`;
    if (/^#[0-9a-f]{6}$/i.test(h)) setColor(h.toLowerCase());
  };
  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setLogo(URL.createObjectURL(f));
  };

  /* Checks: button text on 600 (Light), links 600 on white, links 400 on dark surface. */
  const checks = scale ? [
    { label: 'Witte tekst op knop (brand-600)', ratio: contrast('#ffffff', scale['600']) },
    { label: 'Link op wit (brand-600)', ratio: contrast(scale['600'], '#ffffff') },
    { label: 'Link in Dark (brand-400 op donker)', ratio: contrast(scale['400'], '#0b0f17') },
  ] : [];
  const failing = checks.filter((c) => c.ratio < 4.5);

  const brandSlug = slug(name);
  const selector = style === 'iris' ? ':root' : `:root[data-brand="${style}"]`;
  const fontPkgs = [...new Set([body, title])].filter((f) => f !== 'Inter').map((f) => `@fontsource/${slug(f)}`);
  const css = scale ? `/* ${name}: huisstijl op basis van stijl ${STYLES.find((s) => s.id === style)!.name} (${STYLES.find((s) => s.id === style)!.shape.toLowerCase()}).
   1. Laad dit bestand na @rbbds/ui/styles.css.
${style === 'iris' ? '   2. Geen data-brand nodig: Iris is de standaard.' : `   2. Zet data-brand="${style}" op <html>.`}
${fontPkgs.length ? `   3. Fonts zelf hosten: npm i ${fontPkgs.join(' ')} en importeer de gewichten 400, 500, 600 en 700.` : '   3. Inter: npm i @fontsource-variable/inter'} */
${selector} {
${STEPS.map((s) => `  --wl-color-brand-${s}: ${scale[s]};`).join('\n')}
  --wl-fonts-body: ${stack(body)};
  --wl-fonts-title: ${stack(title)};
}
` : '';
  const figma = scale ? JSON.stringify({
    collection: 'brand/wl',
    mode: name,
    basedOn: STYLES.find((s) => s.id === style)!.name,
    values: { ...Object.fromEntries(STEPS.map((s) => [`WL/color/brand/${s}`, scale[s]])), 'WL/fonts/body': body, 'WL/fonts/title': title },
  }, null, 2) : '';

  const copy = async (what: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(null), 2000); } catch { setCopied('fout'); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([css], { type: 'text/css' }));
    const a = document.createElement('a');
    a.href = url; a.download = `brand-${brandSlug}.css`; a.click();
    URL.revokeObjectURL(url);
  };

  const preview = (mode: string) => (
    <div className="bb-preview__screen">
      <Header
        navLabel={`Hoofdmenu voorbeeld ${mode}`}
        logo={logo ? <img src={logo} alt={name} className="bb-logo" /> : <span className="bb-wordmark">{name}</span>}
        links={[{ label: 'Overzicht', href: '#', current: true }, { label: 'Producten', href: '#' }]}
        actions={<Button size="sm">Inloggen</Button>}
      />
      <div className="bb-preview__body">
        <div className="bb-preview__intro">
          <Badge color="brand">Nieuw</Badge>
          <h2 className="bb-h">Welkom bij {name}</h2>
          <p className="bb-p">Zo ziet je huisstijl eruit in de componenten van MyUI.</p>
          <div className="bb-row"><Button>Aan de slag</Button><Button hierarchy="secondary">Meer informatie</Button><Button hierarchy="link">Bekijk voorbeelden</Button></div>
        </div>
        <div className="bb-grid">
          <div className="bb-stack">
            <Input label="Zoeken" placeholder="Waar ben je naar op zoek?" iconLeading={<Search />} />
            <Select label="Onderwerp" options={[{ value: 'a', label: 'Algemene vraag' }, { value: 'b', label: 'Klacht' }]} />
            <Toggle label="Houd me op de hoogte" defaultChecked />
            <Alert color="brand" title="Goed om te weten">Je kunt je keuze later nog aanpassen.</Alert>
          </div>
          <Card meta="Nieuws · 3 min lezen" title="Een huisstijl die overal klopt" description="Kleuren, letters en vormen uit één bron." action={<Button hierarchy="link">Lees verder</Button>} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bb">
      <div className="bb-intro">
        <h1 className="bb-h1">Brand builder</h1>
        <p className="bb-p">Kies een stijl, vul je huisstijl in en neem de CSS mee naar je project. De stijl bepaalt de vorm (hoeken, randen, letterdikte); jij bepaalt kleur, letters en logo.</p>
      </div>

      <div className="bb-layout">
        <form className="bb-form" onSubmit={(e) => e.preventDefault()} aria-label="Huisstijl">
          <Input label="Naam van het merk" value={name} onChange={(e) => setName(e.target.value)} hint={`Wordt brand-${brandSlug}.css en de mode-naam in Figma.`} />

          <SelectionCardGroup legend="Stijl" columns={1}>
            {STYLES.map((s) => (
              <SelectionCard key={s.id} name="bb-style" value={s.id} checked={style === s.id} onChange={() => pickStyle(s.id)} title={`${s.name}: ${s.shape.toLowerCase()}`} description={s.text} />
            ))}
          </SelectionCardGroup>

          <fieldset className="bb-fieldset">
            <legend className="bb-legend">Merkkleur</legend>
            <div className="bb-color">
              <input type="color" aria-label="Kies merkkleur" value={color} onChange={(e) => { setColor(e.target.value); setHexText(e.target.value); }} />
              <Input label="Hex-code" hideLabel value={hexText} onChange={(e) => onHex(e.target.value)} error={hexText && !/^#?[0-9a-f]{6}$/i.test(hexText) ? 'Gebruik 6 tekens, bijvoorbeeld #0e7c66.' : undefined} />
            </div>
            {scale && (
              <ol className="bb-scale" aria-label="Gegenereerde kleurschaal">
                {STEPS.map((s) => (
                  <li key={s} className={s === result!.anchor ? 'is-anchor' : undefined} title={`${s}: ${scale[s]}`}>
                    <span style={{ background: scale[s] }} />
                    <small>{s}</small>
                  </li>
                ))}
              </ol>
            )}
            <p className="bb-note">Jouw kleur staat op stap {result?.anchor}; de rest is berekend. Knoppen gebruiken 600, links in Dark 400.</p>
            {failing.length > 0 && (
              <Alert color="warning" title="Contrast te laag">
                {failing.map((f) => `${f.label}: ${f.ratio.toFixed(1)}:1 (minimaal 4,5:1)`).join('. ')}. Kies een donkerdere kleur, of laat dit oplossen in de token-mapping.
              </Alert>
            )}
          </fieldset>

          <Select label="Lettertype voor tekst" value={body} onChange={(e) => setBody(e.target.value)} options={FONTS.map((f) => ({ value: f, label: f }))} />
          <Select label="Lettertype voor titels" value={title} onChange={(e) => setTitle(e.target.value)} options={FONTS.map((f) => ({ value: f, label: f }))} />

          <div className="bb-field">
            <label htmlFor="bb-logo" className="bb-legend">Logo (optioneel)</label>
            <input id="bb-logo" type="file" accept="image/svg+xml,image/png,image/webp" onChange={onLogo} />
            <p className="bb-note">Alleen voor de preview. In je project geef je het logo mee aan Header en Sidebar.</p>
          </div>
        </form>

        <section className="bb-preview" aria-label="Voorbeeld">
          <div className="bb-preview__bar">
            <h2 className="bb-h3">Voorbeeld</h2>
            <Toggle label="Toon Dark" checked={showDark} onChange={(e) => setShowDark(e.target.checked)} />
          </div>
          <div className={showDark ? 'bb-preview__pair' : undefined}>
            <div data-theme="light" className="bb-preview__theme">{preview('Light')}</div>
            {showDark && <div data-theme="dark" className="bb-preview__theme">{preview('Dark')}</div>}
          </div>

          <div className="bb-output">
            <div className="bb-output__head">
              <h2 className="bb-h3">CSS voor je project</h2>
              <div className="bb-row">
                <Button size="sm" hierarchy="secondary" iconLeading={<Copy />} onClick={() => copy('css', css)}>{copied === 'css' ? 'Gekopieerd' : 'Kopieer'}</Button>
                <Button size="sm" iconLeading={<Download />} onClick={download}>brand-{brandSlug}.css</Button>
              </div>
            </div>
            <pre className="bb-code" tabIndex={0} aria-label="CSS voor je project"><code>{css}</code></pre>
          </div>
          <div className="bb-output">
            <div className="bb-output__head">
              <h2 className="bb-h3">Waarden voor Figma</h2>
              <Button size="sm" hierarchy="secondary" iconLeading={<Copy />} onClick={() => copy('figma', figma)}>{copied === 'figma' ? 'Gekopieerd' : 'Kopieer'}</Button>
            </div>
            <p className="bb-note">Dupliceer in brand/wl de mode {STYLES.find((s) => s.id === style)!.name}, geef hem de naam "{name}" en vul deze waarden in. Of geef deze JSON aan Claude om de mode toe te voegen.</p>
            <pre className="bb-code" tabIndex={0} aria-label="Waarden voor Figma"><code>{figma}</code></pre>
          </div>
          <span className="rb-visually-hidden" role="status">{copied === 'fout' ? 'Kopiëren lukte niet' : copied ? 'Gekopieerd naar het klembord' : ''}</span>
        </section>
      </div>
    </div>
  );
}
