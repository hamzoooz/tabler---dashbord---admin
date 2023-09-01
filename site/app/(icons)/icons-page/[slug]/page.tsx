'use client';

import Icon from '@/components/Icon';
import IconSvg from '@/components/IconSvg';
import { icons } from '@/config/tabler';
import { getHtmlChar, getIconReactName } from '@/helpers';
import { useClipboard } from '@/hooks';
import { IconType } from '@/types';
import React, { useState } from 'react';

export default function IconPreviewPage({ params }: { params: { slug: string } }) {
  const icon = Object.values(icons).find((i) => i.name == params.slug);
  const clipboard = useClipboard();

  if (!icon) {
    return (
      <>
        <section className="section section-light">
          <div className="container">
            <h1>Icon {params.slug} does not exist!</h1>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="section pb-0">
        <div className="container icon-preview-container">
          <IconData icon={icon} clipboard={clipboard} />
          <IconPreview icon={icon} clipboard={clipboard} />
        </div>
      </section>
    </>
  );
}

const IconData = ({ icon, clipboard }: { icon: IconType; clipboard: any }) => {
  const reactName = getIconReactName(icon.name);
  const htmlChar = getHtmlChar(icon.unicode);
  const webfont = '<i class="ti ti-' + icon.name + '"></i>';

  return (
    <div className="mb-8">
      <div className="row g-4">
        <div className="col-auto">
          <h1 className="m-0 mb-2">
            <a className="tooltip" data-title="Copy name" onClick={() => clipboard.copy(icon.name)}>
              {icon.name}
            </a>
          </h1>
          <div className="list-inline-dots font-h5">
            <div>
              <a className="tooltip link-muted" data-title="Copy React name" onClick={() => clipboard.copy(reactName)}>
                {reactName}
              </a>
            </div>
            <div>
              <a
                className="tooltip link-muted font-monospaced"
                data-title="Copy hex"
                onClick={() => clipboard.copy(icon.unicode)}
              >
                {icon.unicode}
              </a>
            </div>
            <div>
              <a
                className="tooltip link-muted font-monospaced"
                data-title="Copy HTML char"
                onClick={() => clipboard.copy(htmlChar)}
              >
                {htmlChar}
              </a>
            </div>
            <div>
              <a
                className="tooltip link-muted font-monospaced"
                data-title="Copy webfont HTML"
                onClick={() => clipboard.copy(webfont)}
              >
                {'<i class="'}
                <span className="text-base">ti ti-{icon.name}</span>
                {'"></i>'}
              </a>
            </div>
          </div>
        </div>
        <div className="col-auto ml-auto text-right">
          <div className="list-inline-dots font-h5">
            <div>
              <span className="text-muted">Category:&nbsp;</span>
              {icon.category}
            </div>
            <div>
              <span className="text-muted">Added:&nbsp;</span>
              <a className="link-muted" href={'/changelog#' + icon.version}>
                {' '}
                {/* Add changelog site */}
                {icon.version}
              </a>
            </div>
          </div>
          <div className="mt-3">
            <div className="tags-list">
              {icon.tags.map((tag) => (
                <span key={tag} className="tag tag-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IconPreview = ({ icon, clipboard }: { icon: IconType; clipboard: any }) => {
  const [stroke, setStroke] = useState(2);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const tabs = ['SVG Code', 'JSX code', 'Data URI', 'React', 'Vue', 'Webfont', 'SCSS'];

  return (
    <div className="icon-code-grid mb-8">
      <div>
        <div className="icon-preview icon-preview-big mx-auto">
          <IconSvg svg={icon.svg} key={icon.name} className={'s-w-' + stroke * 100} />
          <label className="icon-preview-slider">
            <div className="row">
              <div className="col-6">
                <input
                  type="range"
                  className="form-range"
                  min="1"
                  max="2"
                  step=".25"
                  onChange={(e) => setStroke(+e.target.value)}
                  defaultValue={stroke}
                />
              </div>
              <div className="col-auto">
                <code className="code-dark">
                  stroke-width="<strong>{stroke}</strong>"
                </code>
              </div>
            </div>
          </label>
        </div>
      </div>
      <div className="d-flex flex-column">
        <div>
          <div className="row g-2">
            <div className="col-12 lg:col-auto order-last lg:order-first">
              <a className="btn btn-primary w-100 lg:w-auto" onClick={() => clipboard.copy(icon.svg)}>
                <Icon name="copy" /> Copy SVG
              </a>
            </div>
            <div className="col-6 lg:col-auto">
              <a className="btn w-100 lg:w-auto">
                <Icon name="download" /> Download SVG {/* TODO Download SVG */}
              </a>
            </div>
            <div className="col-6 lg:col-auto">
              <a className="btn w-100 lg:w-auto">
                <Icon name="download" /> Download PNG {/* TODO Download PNG */}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div>
        <nav className="tabs">
          {tabs.map((tab, index) => (
            <a
              className={'tab' + (selectedTabIndex === index ? ' active' : '')}
              onClick={() => setSelectedTabIndex(index)}
              key={tab}
            >
              {tab}
            </a>
          ))}
        </nav>
        <div className="row">
          <div className="col">{switchTab(selectedTabIndex, icon)}</div>
        </div>
      </div>
    </div>
  );
};

const switchTab = (tabIndex: number, icon: IconType) => {
  switch (tabIndex) {
    case 0:
      return <SvgCode icon={icon}></SvgCode>;
    case 1:
      return <div>JSX</div>; // TODO
    case 2:
      return <div>URI</div>; // TODO
    case 3:
      return <ReactCode iconName={icon.name} />;
    case 4:
      return <VueCode iconName={icon.name} />;
    case 5:
      return <WebfontCode iconName={icon.name} iconUnicode={icon.unicode} />;
    default:
      return <ScssCode iconName={icon.name} />;
  }
};

const SvgCode = ({ icon }: { icon: IconType }) => (
  <div>
    <pre className="highlight m-0">
      <code>{icon.svg}</code>
    </pre>
  </div>
);

const ReactCode = ({ iconName }: { iconName: string }) => (
  <div>
    <p className="mb-2">
      Install <code>@tabler/icons-react</code>:
    </p>
    <pre className="highlight">
      <code>npm install @tabler/icons-react</code>
    </pre>
    <p className="mb-2">Import icon:</p>
    <pre className="highlight m-0">
      <code>
        <span className="k">import&nbsp;</span>
        <span className="p">{'{ '}</span>
        <span className="nx">{getIconReactName(iconName)}</span>
        <span className="p">{' } '}</span>
        <span className="k">from&nbsp;</span>
        <span className="dl">'</span>
        <span className="s1">@tabler/icons-react</span>
        <span className="dl">'</span>
        <span className="p">;</span>
      </code>
    </pre>
  </div>
);

const VueCode = ({ iconName }: { iconName: string }) => (
  <div>
    <p className="mb-2">
      Install <code>@tabler/icons-vue</code>:
    </p>
    <pre className="highlight">
      <code>npm install @tabler/icons-vue</code>
    </pre>
    <p className="mb-2">Import icon:</p>
    <pre className="highlight m-0">
      <code>
        <span className="k">import&nbsp;</span>
        <span className="p">{'{ '}</span>
        <span className="nx">{getIconReactName(iconName)}</span>
        <span className="p">{' } '}</span>
        <span className="k">from&nbsp;</span>
        <span className="dl">'</span>
        <span className="s1">@tabler/icons-vue</span>
        <span className="dl">'</span>
        <span className="p">;</span>
      </code>
    </pre>
  </div>
);

const WebfontCode = ({ iconName, iconUnicode }: { iconName: string; iconUnicode: string }) => (
  <div>
    <p className="mb-2">Stylesheet url:</p>
    <pre className="highlight">
      <code>
        <span className="nt">{'<link '}</span>
        <span className="na">rel=</span>
        <span className="s">"stylesheet"&nbsp;</span>
        <span className="na">href=</span>
        <span className="s">"https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"</span>
        <span className="nt">{'>'}</span>
      </code>
    </pre>
    <p className="mb-2">Usage in HTML:</p>
    <pre className="highlight">
      <code>
        <span className="nt">{'<i '}</span>
        <span className="na">class=</span>
        <span className="s">"ti ti-{iconName}"</span>
        <span className="nt">{'></i>'}</span>
      </code>
    </pre>
    <p className="mb-2">Usage in CSS:</p>
    <pre className="mb-0">
      <code>content: '\{iconUnicode}';</code>
    </pre>
  </div>
);

const ScssCode = ({ iconName }: { iconName: string }) => (
  <div>
    <p className="mb-2">SCSS file:</p>
    <pre className="highlight">
      <code>
        <span className="k">@import </span>
        <span className="s2">'node_modules/@tabler/icons-webfont/tabler-icons.scss'</span>
        <span className="p">;</span>
      </code>
    </pre>
    <p className="mb-2">Usage in SCSS:</p>
    <pre>
      <code>content: $ti-icon-{iconName}</code>
    </pre>
  </div>
);
