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


export function renderListWithTemplate( templateFn,  parentElement,  list,  position = 'afterbegin', clear = false) {
  const htmlString = list.map(templateFn);
  if (clear) parentElement.innerHTML = '';
  parentElement.insertAdjacentHTML(position, htmlString.join(''));
  return parentElement;
}

export function discount(product) {
  const list = product.ListPrice;
  const final = product.FinalPrice;

  if (USE_DEFAULT_DISCOUNT && list && final && list === final) {
    const defaultPrice = (list * (1 - DEFAULT_DISCOUNT_PERCENT / 100)).toFixed(2);
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