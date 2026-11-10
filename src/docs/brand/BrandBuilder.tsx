import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Copy, Download, Search, Upload } from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Form/Input';
import { Textarea } from '../../components/Form/Textarea';
import { Select } from '../../components/Form/Select';
import { SelectionCard, SelectionCardGroup } from '../../components/Selection/SelectionCard';
import { Toggle } from '../../components/Selection/Checkbox';
import { Alert } from '../../components/Overlay/Alert';
import { Card } from '../../components/Content/Content';
import { Badge } from '../../components/Display/Display';
import { Header } from '../../components/Navigation/AppShell';
import { brandScale, contrast, STEPS } from './color';
import './BrandBuilder.css';

/* Styles = the brand modes in Figma (↳ brand) and the data-brand blocks in tokens.css. */
const STYLES = [
  { id: 'iris', name: 'Iris', shape: 'Soft', text: 'Small rounded corners and calm titles. This is the default.' },
  { id: 'forest', name: 'Forest', shape: 'Square', text: 'Straight corners. Clean and businesslike.' },
  { id: 'berry', name: 'Berry', shape: 'Round', text: 'Round buttons and fields, heavy titles and 2 px borders.' },
] as const;
type StyleId = (typeof STYLES)[number]['id'];
const STYLE_COLOR: Record<StyleId, string> = { iris: '#4f46e0', forest: '#176f42', berry: '#c21d67' };
const STYLE_ACCENT: Record<StyleId, string> = { iris: '#0d9488', forest: '#ea580c', berry: '#7c3aed' };

/* Free Google Fonts; self-host them in a project with @fontsource. */
const FONTS = ['Inter', 'DM Sans', 'Manrope', 'Work Sans', 'Nunito Sans', 'Source Sans 3', 'Open Sans', 'Lato', 'Roboto', 'Poppins', 'Montserrat', 'Plus Jakarta Sans', 'Figtree', 'Source Serif 4', 'Merriweather', 'Lora', 'Playfair Display', 'Fraunces'];
const SERIF = new Set(['Source Serif 4', 'Merriweather', 'Lora', 'Playfair Display', 'Fraunces']);
const stack = (f: string) => (SERIF.has(f) ? `"${f}", ui-serif, Georgia, serif` : `"${f}", ui-sans-serif, system-ui, sans-serif`);
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my-brand';

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
  const [name, setName] = useState('My brand');
  const [style, setStyle] = useState<StyleId>('iris');
  const [color, setColor] = useState(STYLE_COLOR.iris);
  const [hexText, setHexText] = useState(STYLE_COLOR.iris);
  const [accent, setAccent] = useState(STYLE_ACCENT.iris);
  const [accentText, setAccentText] = useState(STYLE_ACCENT.iris);
  const [body, setBody] = useState('Inter');
  const [title, setTitle] = useState('Inter');
  const [logo, setLogo] = useState<string | null>(null);
  const [showDark, setShowDark] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [extraFonts, setExtraFonts] = useState<string[]>([]);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState<string | undefined>();
  const [imported, setImported] = useState<string | null>(null);
  const fontOptions = [...FONTS, ...extraFonts.filter((f) => !FONTS.includes(f))].map((f) => ({ value: f, label: f }));

  const result = useMemo(() => brandScale(color), [color]);
  const scale = result?.scale;
  const accentResult = useMemo(() => brandScale(accent), [accent]);
  const accentScale = accentResult?.scale;

  /* Apply to the whole preview: tokens are computed on <html>, so overrides must live there. */
  useEffect(() => {
    const root = document.documentElement;
    const prevBrand = root.getAttribute('data-brand');
    if (style === 'iris') root.removeAttribute('data-brand'); else root.setAttribute('data-brand', style);
    const props: [string, string][] = [['--brand-font-body', stack(body)], ['--brand-font-title', stack(title)]];
    if (scale) STEPS.forEach((s) => props.push([`--brand-color-primary-${s}`, scale[s]]));
    if (accentScale) STEPS.forEach((s) => props.push([`--brand-color-accent-${s}`, accentScale[s]]));
    props.forEach(([k, v]) => root.style.setProperty(k, v));
    loadGoogleFont(body);
    loadGoogleFont(title);
    return () => {
      props.forEach(([k]) => root.style.removeProperty(k));
      if (prevBrand) root.setAttribute('data-brand', prevBrand); else root.removeAttribute('data-brand');
    };
  }, [style, scale, accentScale, body, title]);

  useEffect(() => () => { if (logo) URL.revokeObjectURL(logo); }, [logo]);

  const pickStyle = (id: StyleId) => {
    // keep a color the user picked; only follow the style color while it is still a style default
    if (Object.values(STYLE_COLOR).includes(color)) { setColor(STYLE_COLOR[id]); setHexText(STYLE_COLOR[id]); }
    if (Object.values(STYLE_ACCENT).includes(accent)) { setAccent(STYLE_ACCENT[id]); setAccentText(STYLE_ACCENT[id]); }
    setStyle(id);
  };
  const onHex = (v: string) => {
    setHexText(v);
    const h = v.startsWith('#') ? v : `#${v}`;
    if (/^#[0-9a-f]{6}$/i.test(h)) setColor(h.toLowerCase());
  };
  const onAccent = (v: string) => {
    setAccentText(v);
    const h = v.startsWith('#') ? v : `#${v}`;
    if (/^#[0-9a-f]{6}$/i.test(h)) setAccent(h.toLowerCase());
  };
  /* brand.json from the myui-brand skill: the input file or the full output (both have name, style, colors and fonts). */
  const applyBrandJson = (text: string) => {
    let data: { name?: unknown; style?: unknown; colors?: { primary?: unknown; accent?: unknown }; fonts?: { body?: unknown; title?: unknown } };
    try { data = JSON.parse(text); } catch { setImportError('This is not valid JSON. Paste the whole brand.json or brand-input.json.'); return; }
    const hex = (v: unknown) => typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v);
    const styleId = STYLES.find((st) => st.id === data.style)?.id;
    if (!styleId || !hex(data.colors?.primary) || typeof data.fonts?.body !== 'string' || typeof data.fonts?.title !== 'string') {
      setImportError('Some values are missing. You need style (iris, forest or berry), colors.primary as a hex code, and fonts.body and fonts.title.');
      return;
    }
    const primary = (data.colors!.primary as string).toLowerCase();
    const acc = hex(data.colors!.accent) ? (data.colors!.accent as string).toLowerCase() : null;
    const fb = data.fonts!.body as string, ft = data.fonts!.title as string;
    setExtraFonts((prev) => [...new Set([...prev, fb, ft])]);
    if (typeof data.name === 'string' && data.name.trim()) setName(data.name);
    setStyle(styleId);
    setColor(primary); setHexText(primary);
    if (acc) { setAccent(acc); setAccentText(acc); }
    setBody(fb); setTitle(ft);
    setImportError(undefined);
    setImported(typeof data.name === 'string' ? data.name : 'brand');
  };
  const onImportFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setImportText(text);
    applyBrandJson(text);
    e.target.value = '';
  };

  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setLogo(URL.createObjectURL(f));
  };

  /* Checks: button text on 600 (Light), links 600 on white, links 400 on dark surface. */
  const checks = scale ? [
    { label: 'White text on a button (primary 600)', ratio: contrast('#ffffff', scale['600']) },
    { label: 'Link on white (primary 600)', ratio: contrast(scale['600'], '#ffffff') },
    { label: 'Link in Dark (primary 400 on dark)', ratio: contrast(scale['400'], '#0b0f17') },
    ...(accentScale ? [{ label: 'Accent text on white (accent 700)', ratio: contrast(accentScale['700'], '#ffffff') }] : []),
  ] : [];
  const failing = checks.filter((c) => c.ratio < 4.5);

  const brandSlug = slug(name);
  const selector = style === 'iris' ? ':root' : `:root[data-brand="${style}"]`;
  const fontPkgs = [...new Set([body, title])].filter((f) => f !== 'Inter').map((f) => `@fontsource/${slug(f)}`);
  const css = scale ? `/* ${name}: brand based on the style ${STYLES.find((s) => s.id === style)!.name} (${STYLES.find((s) => s.id === style)!.shape.toLowerCase()}).
   1. Load this file after @rbbds/ui/styles.css.
${style === 'iris' ? '   2. You do not need data-brand: Iris is the default.' : `   2. Put data-brand="${style}" on <html>.`}
${fontPkgs.length ? `   3. Host the fonts yourself: npm i ${fontPkgs.join(' ')} and import the weights 400, 500, 600 and 700.` : '   3. Inter: npm i @fontsource-variable/inter'} */
${selector} {
${STEPS.map((s) => `  --brand-color-primary-${s}: ${scale[s]};`).join('\n')}
${accentScale ? STEPS.map((s) => `  --brand-color-accent-${s}: ${accentScale[s]};`).join('\n') : ''}
  --brand-font-body: ${stack(body)};
  --brand-font-title: ${stack(title)};
}
` : '';
  const figma = scale ? JSON.stringify({
    collection: '↳ brand',
    mode: name,
    basedOn: STYLES.find((s) => s.id === style)!.name,
    values: { ...Object.fromEntries(STEPS.map((s) => [`brand/color/primary/${s}`, scale[s]])), ...(accentScale ? Object.fromEntries(STEPS.map((s) => [`brand/color/accent/${s}`, accentScale[s]])) : {}), 'brand/font/body': body, 'brand/font/title': title },
  }, null, 2) : '';

  const copy = async (what: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(null), 2000); } catch { setCopied('error'); }
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
        navLabel={`Main menu example ${mode}`}
        logo={logo ? <img src={logo} alt={name} className="bb-logo" /> : <span className="bb-wordmark">{name}</span>}
        links={[{ label: 'Overview', href: '#', current: true }, { label: 'Products', href: '#' }]}
        actions={<Button size="sm">Log in</Button>}
      />
      <div className="bb-preview__body">
        <div className="bb-preview__intro">
          <Badge color="brand">New</Badge>
          <h2 className="bb-h">Welcome to {name}</h2>
          <p className="bb-p">This is how your brand looks in the MyUI components.</p>
          <div className="bb-row"><Button>Get started</Button><Button hierarchy="secondary">Learn more</Button><Button hierarchy="link">See examples</Button></div>
        </div>
        <div className="bb-grid">
          <div className="bb-stack">
            <Input label="Search" placeholder="What are you looking for?" iconLeading={<Search />} />
            <Select label="Topic" options={[{ value: 'a', label: 'General question' }, { value: 'b', label: 'Complaint' }]} />
            <Toggle label="Keep me updated" defaultChecked />
            <Alert color="brand" title="Good to know">You can change your choice later.</Alert>
          </div>
          <Card meta="News · 3 min read" title="A brand that fits everywhere" description="Colors, fonts and shapes from one source." action={<Button hierarchy="link">Read more</Button>} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bb">
      <div className="bb-intro">
        <h1 className="bb-h1">Brand builder</h1>
        <p className="bb-p">Pick a style, fill in your brand and take the CSS to your project. The style sets the shape (corners, borders, font weight). You set the colors, fonts and logo.</p>
      </div>

      <div className="bb-layout">
        <form className="bb-form" onSubmit={(e) => e.preventDefault()} aria-label="Brand">
          <details className="bb-import">
            <summary className="bb-legend">Import brand.json</summary>
            <p className="bb-note">From the myui-brand skill: paste brand-input.json or brand.json, or pick the file. The fields below are filled in for you.</p>
            <Textarea label="brand.json" value={importText} onChange={(e) => setImportText(e.target.value)} error={importError} rows={6} />
            <div className="bb-row">
              <Button size="sm" onClick={() => applyBrandJson(importText)} disabled={!importText.trim()}>Apply</Button>
              <label className="bb-file">
                <Upload aria-hidden="true" />
                <span>Choose file</span>
                <input type="file" accept="application/json,.json" onChange={onImportFile} className="rb-visually-hidden" />
              </label>
            </div>
            {imported && !importError && <Alert color="success" title={`Imported ${imported}`}>Check the colors and fonts, then copy the CSS or the Figma values below.</Alert>}
          </details>

          <Input label="Brand name" value={name} onChange={(e) => setName(e.target.value)} hint={`Becomes brand-${brandSlug}.css and the mode name in Figma.`} />

          <SelectionCardGroup legend="Style" columns={1}>
            {STYLES.map((s) => (
              <SelectionCard key={s.id} name="bb-style" value={s.id} checked={style === s.id} onChange={() => pickStyle(s.id)} title={`${s.name}: ${s.shape.toLowerCase()}`} description={s.text} />
            ))}
          </SelectionCardGroup>

          <fieldset className="bb-fieldset">
            <legend className="bb-legend">Primary color</legend>
            <div className="bb-color">
              <input type="color" aria-label="Pick the primary color" value={color} onChange={(e) => { setColor(e.target.value); setHexText(e.target.value); }} />
              <Input label="Primary hex code" hideLabel value={hexText} onChange={(e) => onHex(e.target.value)} error={hexText && !/^#?[0-9a-f]{6}$/i.test(hexText) ? 'Use 6 characters, for example #0e7c66.' : undefined} />
            </div>
            {scale && (
              <ol className="bb-scale" aria-label="Generated primary scale">
                {STEPS.map((s) => (
                  <li key={s} className={s === result!.anchor ? 'is-anchor' : undefined} title={`${s}: ${scale[s]}`}>
                    <span style={{ background: scale[s] }} />
                    <small>{s}</small>
                  </li>
                ))}
              </ol>
            )}
            <p className="bb-note">Your color is step {result?.anchor}. The other steps are calculated. Buttons use 600. Links in Dark use 400.</p>
            {failing.length > 0 && (
              <Alert color="warning" title="Contrast too low">
                {failing.map((f) => `${f.label}: ${f.ratio.toFixed(1)}:1 (at least 4.5:1)`).join('. ')}. Pick a darker color, or fix it in the token mapping.
              </Alert>
            )}
          </fieldset>

          <fieldset className="bb-fieldset">
            <legend className="bb-legend">Accent color</legend>
            <div className="bb-color">
              <input type="color" aria-label="Pick the accent color" value={accent} onChange={(e) => { setAccent(e.target.value); setAccentText(e.target.value); }} />
              <Input label="Accent hex code" hideLabel value={accentText} onChange={(e) => onAccent(e.target.value)} error={accentText && !/^#?[0-9a-f]{6}$/i.test(accentText) ? 'Use 6 characters, for example #ea580c.' : undefined} />
            </div>
            {accentScale && (
              <ol className="bb-scale" aria-label="Generated accent scale">
                {STEPS.map((s) => (
                  <li key={s} className={s === accentResult!.anchor ? 'is-anchor' : undefined} title={`${s}: ${accentScale[s]}`}>
                    <span style={{ background: accentScale[s] }} />
                    <small>{s}</small>
                  </li>
                ))}
              </ol>
            )}
            <p className="bb-note">A second brand color for highlights, badges, tags and illustrations.</p>
          </fieldset>

          <Select label="Font for text" value={body} onChange={(e) => setBody(e.target.value)} options={fontOptions} />
          <Select label="Font for titles" value={title} onChange={(e) => setTitle(e.target.value)} options={fontOptions} />

          <div className="bb-field">
            <label htmlFor="bb-logo" className="bb-legend">Logo (optional)</label>
            <input id="bb-logo" type="file" accept="image/svg+xml,image/png,image/webp" onChange={onLogo} />
            <p className="bb-note">Only for the preview. In your project, pass the logo to Header and Sidebar.</p>
          </div>
        </form>

        <section className="bb-preview" aria-label="Preview">
          <div className="bb-preview__bar">
            <h2 className="bb-h3">Preview</h2>
            <Toggle label="Show Dark" checked={showDark} onChange={(e) => setShowDark(e.target.checked)} />
          </div>
          <div className={showDark ? 'bb-preview__pair' : undefined}>
            <div data-theme="light" className="bb-preview__theme">{preview('Light')}</div>
            {showDark && <div data-theme="dark" className="bb-preview__theme">{preview('Dark')}</div>}
          </div>

          <div className="bb-output">
            <div className="bb-output__head">
              <h2 className="bb-h3">CSS for your project</h2>
              <div className="bb-row">
                <Button size="sm" hierarchy="secondary" iconLeading={<Copy />} onClick={() => copy('css', css)}>{copied === 'css' ? 'Copied' : 'Copy'}</Button>
                <Button size="sm" iconLeading={<Download />} onClick={download}>brand-{brandSlug}.css</Button>
              </div>
            </div>
            <pre className="bb-code" tabIndex={0} aria-label="CSS for your project"><code>{css}</code></pre>
          </div>
          <div className="bb-output">
            <div className="bb-output__head">
              <h2 className="bb-h3">Values for Figma</h2>
              <Button size="sm" hierarchy="secondary" iconLeading={<Copy />} onClick={() => copy('figma', figma)}>{copied === 'figma' ? 'Copied' : 'Copy'}</Button>
            </div>
            <p className="bb-note">In the ↳ brand collection, overwrite the values of the mode {STYLES.find((s) => s.id === style)!.name} with these. This also works on Figma plans with few modes. If your plan allows more modes, you can duplicate the mode and name it "{name}" instead.</p>
            <pre className="bb-code" tabIndex={0} aria-label="Values for Figma"><code>{figma}</code></pre>
          </div>
          <span className="rb-visually-hidden" role="status">{copied === 'error' ? 'Copy failed' : copied ? 'Copied to the clipboard' : ''}</span>
        </section>
      </div>
    </div>
  );
}
