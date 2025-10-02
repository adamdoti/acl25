// File: js/splash-quote.js

const QUOTES_URL = 'data/quotes.json';       // your structure
const PREFERRED_GENRES = ["festival","house","EDM","alternative rock","rap/hip-hop","industrial","drum-and-bass","classical","jazz","punk","classic rock","pop","techno","electronic","general","literature"];

const overlay = document.getElementById('splash-quote-overlay');
const elText  = document.getElementById('splash-quote-text');
const elAuth  = document.getElementById('splash-quote-author');

const pick = a => a[Math.floor(Math.random()*a.length)];
const byGenre = (arr, g) => g ? arr.filter(q => q.genres?.includes(g)) : arr;

async function getQuotes() {
  try {
    const res = await fetch(QUOTES_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch quotes.json');
    return await res.json();
  } catch (e) {
    console.warn('[splash-quote] Using fallback quotes:', e);
    return [
      { text:"Music has healing power.", author:"Elton John", genres:["pop","rock"] },
      { text:"Punk is musical freedom.", author:"Kurt Cobain", genres:["punk","alternative rock"] },
      { text:"It’s not the notes you play; it’s the notes you don’t play.", author:"Miles Davis", genres:["jazz"] }
    ];
  }
}

function renderQuote(q, genre){
  elText.textContent = q?.text ?? 'Music is life.';
  elAuth.textContent = q?.author ? `— ${q.author}` : '— Unknown';
  if (genre) overlay.setAttribute('data-genre', genre);
}

function show({auto=true}={}) {
  overlay.style.display = 'grid';
  overlay.style.opacity = '1';
  overlay.style.visibility = 'visible';
  overlay.classList.toggle('sq-no-auto', !auto);
  if (auto) { overlay.style.animation = 'none'; void overlay.offsetHeight; overlay.style.animation = ''; }
}

function hide() {
  overlay.style.transition = 'opacity 200ms ease';
  overlay.style.opacity = '0';
  setTimeout(() => (overlay.style.display = 'none'), 220);
}

document.addEventListener('DOMContentLoaded', async () => {
  const quotes = await getQuotes();
  const genre  = pick(PREFERRED_GENRES);
  const pool   = byGenre(quotes, genre);
  const quote  = pick(pool.length ? pool : quotes);
  renderQuote(quote, genre);
  show({auto:true});
});

overlay?.addEventListener('click', hide);

// Optional global API
window.SplashQuote = {
  async shuffle() {
    const quotes = await getQuotes();
    const genre  = pick(PREFERRED_GENRES);
    renderQuote(pick(byGenre(quotes, genre)), genre);
    show({auto:false});
  },
  show, hide
};