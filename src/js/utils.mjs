export const DEFAULT_DISCOUNT_PERCENT = 10;
export const USE_DEFAULT_DISCOUNT = true;

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));
  if (key === 'so-cart') {
    return Array.isArray(data) ? data : [];
  }
  return data;
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  const htmlString = list.map(templateFn);
  if (clear) parentElement.innerHTML = '';
  parentElement.insertAdjacentHTML(position, htmlString.join(''));
  return parentElement;
}
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('../partials/header.html');
  const footerTemplate = await loadTemplate('../partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  
  updateCartCount();
}

export function discount(product) {
  const list = product.ListPrice;
  const final = product.FinalPrice;

  if (USE_DEFAULT_DISCOUNT && list && final && list === final) {
    const defaultPrice = (list * (1 - DEFAULT_DISCOUNT_PERCENT / 100)).toFixed(
      2,
    );
    return `
    <div class="discount">
      <span class="discount-badge">-${DEFAULT_DISCOUNT_PERCENT}%</span>
      <p class="old-price">$${list.toFixed(2)}</p>
      <p class="new-price">$${defaultPrice}</p>
      </div>
    `;
  }

  if (list && final && final < list) {
    const percent = Math.round(((list - final) / list) * 100);
    return `
      <div class="discount">
        <span class="discount-badge">-${percent}%</span>
        <p class="old-price">$${list.toFixed(2)}</p>
        <p class="new-price">$${final.toFixed(2)}</p>
      </div>
    `;
  }
  return '';
}
// superscript for the cart count logic
export function updateCartCount() {
  const cart = getLocalStorage('so-cart') || [];
  const count = cart.length;
  const badge = document.querySelector('.cart-count');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}


export function alertMessage(message, scroll = true) {
  // create element to hold the alert
  const alert = document.createElement('div');
  alert.classList.add('alert');

  // message content first
  const msgSpan = document.createElement('span');
  msgSpan.className = 'alert-message';
  msgSpan.textContent = message;

  // close button at end
  const closeBtn = document.createElement('span');
  closeBtn.className = 'closebtn';
  closeBtn.setAttribute('role', 'button');
  closeBtn.setAttribute('aria-label', 'Close alert');
  closeBtn.innerHTML = '&times;';

  // assemble and insert
  alert.appendChild(msgSpan);
  alert.appendChild(closeBtn);

  const main = document.querySelector('main');
  main.prepend(alert);

  // close handler
  closeBtn.addEventListener('click', () => {
    if (main.contains(alert)) main.removeChild(alert);
  });

  // optional scroll
  if (scroll) window.scrollTo(0, 0);
}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll('.alert');
  alerts.forEach((alert) => document.querySelector('main').removeChild(alert));
}
