import { encodeSvg } from "./appConstants";

export const EXAMPLES = [
  {
    name: "Crepúsculo no litoral",
    meta: "Verde-azulado · hora azul",
    src: encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071827"/><stop offset=".46" stop-color="#0b5261"/><stop offset="1" stop-color="#f59e0b"/></linearGradient><radialGradient id="r"><stop stop-color="#5eead4" stop-opacity=".9"/><stop offset="1" stop-color="#0f172a" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="760" fill="url(#g)"/><circle cx="860" cy="120" r="340" fill="url(#r)"/><path d="M0 590c130-95 230-22 355-81 137-65 211-19 331 10 144 35 247-54 514-138v379H0Z" fill="#071827" fill-opacity=".72"/><path d="M0 625c185-74 288-24 435-66 156-45 235 12 391 27 145 15 235-37 374-77v251H0Z" fill="#2dd4bf" fill-opacity=".22"/></svg>`,
    ),
  },
  {
    name: "Estúdio soft",
    meta: "Verde-limão · coral",
    src: encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#fef3c7"/><stop offset=".47" stop-color="#fb7185"/><stop offset="1" stop-color="#be123c"/></linearGradient></defs><rect width="1200" height="760" fill="url(#g)"/><circle cx="180" cy="110" r="250" fill="#fef08a" fill-opacity=".78"/><circle cx="970" cy="610" r="330" fill="#4d7c0f" fill-opacity=".52"/><path d="M150 560c85-170 227-185 348-74 92 83 163 69 220-33 75-135 212-175 354-96l-14 403H98Z" fill="#881337" fill-opacity=".48"/><path d="M95 210c98-106 211-113 311-7 85 91 172 96 263 26 96-73 204-69 343 25" fill="none" stroke="#fff7ed" stroke-opacity=".6" stroke-width="20" stroke-linecap="round"/></svg>`,
    ),
  },
  {
    name: "Mercado noturno",
    meta: "Índigo · neon",
    src: encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#17134b"/><stop offset=".5" stop-color="#312e81"/><stop offset="1" stop-color="#be185d"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="34"/></filter></defs><rect width="1200" height="760" fill="url(#g)"/><g filter="url(#b)" opacity=".8"><circle cx="210" cy="180" r="120" fill="#22d3ee"/><circle cx="880" cy="180" r="150" fill="#f0abfc"/><circle cx="740" cy="610" r="180" fill="#fb7185"/></g><g fill="none" stroke="#e0e7ff" stroke-opacity=".44" stroke-width="8"><path d="M0 500h1200M0 570h1200M120 0v760M230 0v760M1020 0v760"/></g><path d="M0 410h1200v350H0Z" fill="#0f172a" fill-opacity=".47"/><circle cx="250" cy="190" r="46" fill="#67e8f9"/><circle cx="860" cy="175" r="54" fill="#f5d0fe"/></svg>`,
    ),
  },
  {
    name: "Forma de terracota",
    meta: "Argila · verde-oliva",
    src: encodeSvg(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="760" viewBox="0 0 1200 760"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2f3e2f"/><stop offset=".52" stop-color="#8b5e3c"/><stop offset="1" stop-color="#f1c27d"/></linearGradient></defs><rect width="1200" height="760" fill="url(#g)"/><path d="M-50 510c170-132 325-158 486-61 161 98 264 77 374-73 105-143 230-170 441-119v503H-50Z" fill="#3f6212" fill-opacity=".8"/><path d="M-80 190C116 42 284 63 388 177c96 104 188 92 287-9 97-100 230-126 605-23" fill="none" stroke="#fde68a" stroke-opacity=".65" stroke-width="74" stroke-linecap="round"/><circle cx="905" cy="190" r="112" fill="#dc765b" fill-opacity=".84"/><circle cx="420" cy="545" r="82" fill="#f5deb3" fill-opacity=".55"/></svg>`,
    ),
  },
];
