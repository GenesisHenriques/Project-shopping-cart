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

const allValues = () => {
  let total = 0;
  const itens = document.querySelectorAll('.cart__item');
  itens.forEach((item) => {
    const value = parseFloat(item.innerText.match(/[^ $]*$/)); // /[^ \$]*$/   /(?<=PRICE: \$).*/g
    total += value;
  });
  document.getElementsByClassName('total-price')[0].innerText = Number(total.toFixed(2));
};
//  item.parentNode.removeChild(item));
function cartItemClickListener(event) {

  if (event.target.className === 'div_itens_cart') {
    event.target.remove();
  } else {
    event.target.parentNode.remove();
  }
  addDeleteLocalStorage();
  allValues();
}

function createCartItemElement({ sku, name, salePrice, image }) {
  const div = document.createElement('div');
  div.className = 'div_itens_cart';
  div.addEventListener('click', cartItemClickListener);

  const h6 = document.createElement('h5');
  h6.className = 'cart__item';
  h6.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;

  const img = document.createElement('img');
  img.setAttribute('src', image)
  img.className = 'img_cart';

  div.appendChild(img)
  div.appendChild(h6)

  return div;
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
      image: item.thumbnail,
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    };
    const div = createCartItemElement(obj);
    const father = document.getElementsByClassName('cart__items')[0];
    father.appendChild(div);
    addDeleteLocalStorage();
    allValues();
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
  allValues();
};

const deleteAll = () => {
  const a = document.getElementsByClassName('empty-cart')[0];
  a.addEventListener('click', () => {
    localStorage.clear();

    const itens = document.querySelectorAll('.cart__item');
    itens.forEach((item) => item.parentNode.removeChild(item));

    const imgs = document.querySelectorAll('.img_cart');
    imgs.forEach((item) => item.remove());

    allValues();
  });
};

const creatValue = () => {
  const father = document.querySelectorAll('.total-price')[0];
  const paragraph = document.createElement('p');
  paragraph.innerText = 0;
  father.appendChild(paragraph);
};

window.onload = async () => {
  await productList();
  await creatValue();
  await getDataLocalStorage();
  deleteAll();
};
