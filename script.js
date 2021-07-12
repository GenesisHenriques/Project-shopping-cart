function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addDeleteLocalStorage = () => {
  localStorage.setItem('car', JSON.stringify(document.querySelector('.cart__items').innerHTML));
};

function cartItemClickListener(event) {
  event.target.remove();
  addDeleteLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
//---------------------------------------------------------------------------------------------------------

const creatObj = (index) => {
  const newObj = {
    sku: index.id,
    name: index.title,
    image: index.thumbnail,
  };
  return newObj;
};

const returnDados = (id) => {
  const url = `https://api.mercadolibre.com/items/${id}`;
  fetch(url)
  .then((obj) => obj.json())
  .then((item) => {
    const obj = {
      sku: item.id, 
      name: item.title, 
      salePrice: item.price,
    };
    const a = createCartItemElement(obj);
    const father = document.getElementsByClassName('cart__items')[0];
    father.appendChild(a);
    addDeleteLocalStorage();
    // allValues();
  });
};

const addEvent = () => {
  const btns = document.querySelectorAll('.item__add');
   btns.forEach((btn) => {
     btn.addEventListener('click', () => {
      const btnId = getSkuFromProductItem(btn.parentNode);
      returnDados(btnId);
    });
  });
};

const productList = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then((json) => json.json())
  .then((obj) => {
    const father = document.getElementsByClassName('items')[0];
    const objs = obj.results;
    objs.forEach((index) => {
      father.appendChild(createProductItemElement(creatObj(index)));
    });
    addEvent();
  });
};

const getDataLocalStorage = () => {
  const stringJson = localStorage.getItem('car');
  const objJson = JSON.parse(stringJson);
  const father = document.querySelectorAll('.cart__items')[0];
  father.innerHTML = objJson;
};

window.onload = () => {
  productList();
  getDataLocalStorage();
  // localStorage.clear();
};
