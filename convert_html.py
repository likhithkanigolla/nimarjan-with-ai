import re

html_file = "/Users/likhithkanigolla/Personal/nimarjan-with-ai/ganesh_immersion_architecture_slide (4).html"
with open(html_file, 'r') as f:
    html = f.read()

# Extract styles
style_match = re.search(r'<style>(.*?)</style>', html, re.DOTALL)
css = style_match.group(1) if style_match else ""

# Prepend .arch- to some generic classes so they don't leak
css = css.replace('.head', '.arch-head')
css = css.replace('.legend', '.arch-legend')
css = css.replace('.box', '.arch-box')
css = css.replace('.cell', '.arch-cell')
css = css.replace('.row', '.arch-row')
css = css.replace('.grid', '.arch-grid')
css = css.replace('.approve', '.arch-approve')
css = css.replace('.item', '.arch-item')
css = css.replace('.core-region', '.arch-core-region')
css = css.replace('.core-frame', '.arch-core-frame')
css = css.replace('.core-caption', '.arch-core-caption')
css = css.replace('.hub', '.arch-hub')
css = css.replace('.node', '.arch-node')
css = css.replace('.leader-line', '.arch-leader-line')
css = css.replace('.flow-pill', '.arch-flow-pill')
css = css.replace('.fb-label', '.arch-fb-label')
css = css.replace('.start-badge', '.arch-start-badge')
css = css.replace('.start-ring', '.arch-start-ring')
css = css.replace('svg.wires', 'svg.arch-wires')

css = """
.arch-container {
    width: 100%; height: 100%; background: #0a1c38; font-family: 'Inter', sans-serif; color: var(--ink); overflow: hidden; position: relative;
}
""" + css

with open("src/components/AgenticApplicationOverview.css", "w") as f:
    f.write(css)

# Extract body
body_match = re.search(r'<div class="slide-stage" id="stage">(.*?)</div>\s*<script>', html, re.DOTALL)
body_html = body_match.group(1) if body_match else ""

# Replace classes
body_html = body_html.replace('class="head', 'class="arch-head')
body_html = body_html.replace('class="legend', 'class="arch-legend')
body_html = body_html.replace('class="box', 'class="arch-box')
body_html = body_html.replace('class="cell', 'class="arch-cell')
body_html = body_html.replace('class="row', 'class="arch-row')
body_html = body_html.replace('class="grid', 'class="arch-grid')
body_html = body_html.replace('class="approve', 'class="arch-approve')
body_html = body_html.replace('class="item', 'class="arch-item')
body_html = body_html.replace('class="core-region', 'class="arch-core-region')
body_html = body_html.replace('class="core-frame', 'class="arch-core-frame')
body_html = body_html.replace('class="core-caption', 'class="arch-core-caption')
body_html = body_html.replace('class="hub', 'class="arch-hub')
body_html = body_html.replace('class="node', 'class="arch-node')
body_html = body_html.replace('class="leader-line', 'class="arch-leader-line')
body_html = body_html.replace('class="flow-pill', 'class="arch-flow-pill')
body_html = body_html.replace('class="fb-label', 'class="arch-fb-label')
body_html = body_html.replace('class="start-badge', 'class="arch-start-badge')
body_html = body_html.replace('class="start-ring', 'class="arch-start-ring')
body_html = body_html.replace('class="wires', 'class="arch-wires')

# Convert HTML to JSX
body_html = body_html.replace('class=', 'className=')
# Convert stroke-width, stroke-linecap, stroke-linejoin, marker-end, stroke-dasharray
body_html = body_html.replace('stroke-width', 'strokeWidth')
body_html = body_html.replace('stroke-linecap', 'strokeLinecap')
body_html = body_html.replace('stroke-linejoin', 'strokeLinejoin')
body_html = body_html.replace('marker-end', 'markerEnd')
body_html = body_html.replace('stroke-dasharray', 'strokeDasharray')
# Convert styles
def repl_style(match):
    style_str = match.group(1)
    # simple parsing
    props = style_str.split(';')
    jsx_props = []
    for p in props:
        p = p.strip()
        if not p: continue
        if ':' not in p: continue
        k, v = p.split(':', 1)
        k = k.strip()
        v = v.strip()
        # camelCase
        parts = k.split('-')
        k_camel = parts[0] + ''.join(x.title() for x in parts[1:])
        jsx_props.append(f"{k_camel}: '{v}'")
    return "style={{" + ", ".join(jsx_props) + "}}"

body_html = re.sub(r'style="(.*?)"', repl_style, body_html)

tsx = f"""import {{ useEffect, useRef }} from "react";
import "./AgenticApplicationOverview.css";

export function AgenticApplicationOverview() {{
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {{
    function fitSlide() {{
      if (!stageRef.current) return;
      const stage = stageRef.current;
      const container = stage.parentElement;
      if (!container) return;
      const scale = Math.min(container.clientWidth / 1600, container.clientHeight / 900) * 0.97;
      stage.style.transform = `translate(-50%,-50%) scale(${{scale}})`;
      stage.classList.add('ready');
    }}
    window.addEventListener('resize', fitSlide);
    const ro = new ResizeObserver(fitSlide);
    if (stageRef.current?.parentElement) {{
      ro.observe(stageRef.current.parentElement);
    }}
    fitSlide();
    return () => {{
      window.removeEventListener('resize', fitSlide);
      ro.disconnect();
    }};
  }}, []);

  return (
    <div className="arch-container">
      <div className="slide-stage" id="stage" ref={{stageRef}}>
{body_html}
      </div>
    </div>
  );
}}
"""

with open("src/components/AgenticApplicationOverview.tsx", "w") as f:
    f.write(tsx)

print("done")
