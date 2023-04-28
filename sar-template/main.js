import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { ITEM_ONLINE_DATING_APPLICATION, fetchOrgsOfInstance,
         vocabulary, query, sparqlItemPropertiesLabel,
         URL_PERSONALDATA_IO} from './pdio-wiki.js'
import nunjucks from 'nunjucks'


document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))

nunjucks.configure({ autoescape: true });
const hello = nunjucks.renderString('Hello {{ username }}', { username: 'James' });
console.log('h ', hello)
const datingApps = await fetchOrgsOfInstance(ITEM_ONLINE_DATING_APPLICATION)
console.log('da', datingApps)
const {items: {swisscom, instagram}, properties: {collects}} = vocabulary
const qSwColl = sparqlItemPropertiesLabel(swisscom, collects)
const collectedBySwisscom = await query(qSwColl, URL_PERSONALDATA_IO)
console.log('cbs', collectedBySwisscom)
