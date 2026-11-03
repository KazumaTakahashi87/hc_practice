// 鬼滅の刃のキャラクター一覧を API から取得して表示する

// API の URL（ラジオボタンの value ごとに JSON ファイルが分かれている）
const API_BASE_URL = 'https://ihatov08.github.io/kimetsu_api/api/';
// 画像の URL は API では "/kimetsu_api/images/..." なので、前にこれをつなげる
const IMAGE_BASE_URL = 'https://ihatov08.github.io';

const radios = document.querySelectorAll('input[name="category"]');
const loading = document.querySelector('#loading');
const error = document.querySelector('#error');
const list = document.querySelector('#character-list');

// ---------- 表示の切り替え ----------
function showLoading() {
  list.innerHTML = '';
  error.hidden = true;
  loading.hidden = false;
}

function hideLoading() {
  loading.hidden = true;
}

function showError(message) {
  error.textContent = message;
  error.hidden = false;
}

// ---------- API ----------
// 選んだ種類のキャラクター一覧を取得する
async function fetchCharacters(category) {
  const response = await fetch(`${API_BASE_URL}${category}.json`);

  // 404 などのときはエラーにする
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

// ---------- 一覧の表示 ----------
// 1人分のカード（li）を作る
function createCharacterCard(character) {
  const card = document.createElement('li');
  card.className = 'overflow-hidden rounded-lg bg-white shadow';

  const image = document.createElement('img');
  image.src = IMAGE_BASE_URL + character.image;
  image.alt = character.name;
  image.loading = 'lazy';
  image.className = 'aspect-square w-full object-cover object-top';

  const body = document.createElement('div');
  body.className = 'p-3';

  const name = document.createElement('p');
  name.textContent = character.name;
  name.className = 'font-bold';

  const category = document.createElement('p');
  category.textContent = character.category;
  category.className = 'mt-1 text-sm text-stone-500';

  body.append(name, category);
  card.append(image, body);
  return card;
}

// 一覧を作り直す
function renderCharacters(characters) {
  list.innerHTML = '';
  characters.forEach((character) => {
    list.appendChild(createCharacterCard(character));
  });
}

// ---------- メイン ----------
// 何回目の読み込みか（ラジオボタンを素早く切り替えたとき、古い結果で上書きしないため）
let requestCount = 0;

async function loadCharacters(category) {
  requestCount++;
  const currentRequest = requestCount;

  showLoading();

  try {
    const characters = await fetchCharacters(category);

    // 待っている間に別のラジオボタンが選ばれていたら、この結果は使わない
    if (currentRequest !== requestCount) {
      return;
    }

    renderCharacters(characters);
  } catch (e) {
    if (currentRequest === requestCount) {
      showError('キャラクターを読み込めませんでした。時間をおいてもう一度お試しください。');
    }
  } finally {
    if (currentRequest === requestCount) {
      hideLoading();
    }
  }
}

// ラジオボタンが選ばれたら、その種類で読み込む
radios.forEach((radio) => {
  radio.addEventListener('change', () => {
    loadCharacters(radio.value);
  });
});

// ページを開いたときは全キャラクターを表示する
loadCharacters('all');
