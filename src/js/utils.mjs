export const DEFAULT_DISCOUNT_PERCENT = 10;
export const USE_DEFAULT_DISCOUNT = true;


export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}



export function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));
  if (key === 'so-cart') {
    return Array.isArray(data) ? data : [];
  }
  return data;
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

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
export function renderWithTemplate( template,  parentElement,  data,  callback) {
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
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

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

export function alertMessage(message, scroll = true, duration = 3000) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  const cleanMessage = String(message).trim();
  alert.innerHTML = `<p>${cleanMessage}</p><span>X</span>`;
  console.log("Alert message:", message);



  alert.addEventListener("click", function (e) {
    if (e.target.tagName == "SPAN") {
      main.removeChild(this);
    }
  });
  const main = document.querySelector("main");
  main.prepend(alert);

  if (scroll) window.scrollTo(0, 0);

}

export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => document.querySelector("main").removeChild(alert));
}