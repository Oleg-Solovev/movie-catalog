const email = "leg2012@bk.ru";

// первоначальная загрузка таблицы
async function firstRenderTable() {
  const films = await getFromServer();
  renderTable(films);
}

// Сохранение данных из формы
function handleFormSubmit(e) {
  e.preventDefault();

  const film = {
    title: document.querySelector('#title').value,
    genre: document.querySelector('#genre').value,
    releaseYear: document.querySelector('#releaseYear').value,
    isWatched: document.querySelector('#isWatched').checked
  }
  // Очистка полей
  document.querySelectorAll('input').forEach((el) => {
    el.value = ''
  })
  document.querySelector('#isWatched').checked = false;
  addFilm(film);
}

// сохранение данных на сервере
async function addFilm(film) {
  await fetch("https://sb-film.skillbox.cc/films", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email,
    },
    body: JSON.stringify(film),
  });
  const films = await getFromServer();
  renderTable(films);
}

// Функция получения данных с сервера
async function getFromServer(andpoint = '') {
  const filmsResponse = await fetch(`https://sb-film.skillbox.cc/films${andpoint}`, {
    method: "GET",
    headers: {
      email,
    },
  });
  const films = await filmsResponse.json();
  return films
}

// удаление данных о фильме
async function removeFilm(id = '') {
  await fetch(`https://sb-film.skillbox.cc/films/${id}`, {
    method: "DELETE",
    headers: {
      email,
    },
  });
  const films = await getFromServer();
  renderTable(films);
}

// Функция отрисовки таблицы всех фильмов
function renderTable(films) {
  const filmTableBody = document.querySelector('#film-tbody');
  filmTableBody.innerHTML = "";
  films.forEach(film => {
    filmTableBody.append(createFilmItem(film));
  })
}

// Функция отрисовки строки одного фильма
function createFilmItem(film) {
  const row = document.createElement('tr');
  const titleEl = createTd(film.title);
  const genreEl = createTd(film.genre);
  const releaseYearEl = createTd(film.releaseYear);
  const isWatchedEl = createTd(film.isWatched ? 'Да' : 'Нет');
  const actionEl = createTd('', 'action-td');
  const removeBtnEl = createBtn('btn-delateAll', 'Удалить');
  actionEl.append(removeBtnEl);
  removeBtnEl.addEventListener('click', function () {
    removeFilm(film.id)
  });
  row.append(titleEl, genreEl, releaseYearEl, isWatchedEl, actionEl);
  return row
}

// Функция создания ячейки таблицы
function createTd(text = '', className = 'x') {
  const element = document.createElement("td");
  element.classList.add(className);
  element.textContent = text;
  return element
}

// Функция создания кнопки
function createBtn(className, text = '') {
  const btn = document.createElement('button');
  btn.classList.add('btn', className);
  btn.textContent = text;
  return btn
}

// подключение библиотеки валидации форм
const validate = new JustValidate('#film-form');
validate.addField('#title', [
  {
    rule: 'required',
    errorMessage: 'Введите название фильма',
  },
]);
validate.addField('#genre', [
  {
    rule: 'required',
    errorMessage: 'Введите жанр фильма',
  },
]);
validate.addField('#releaseYear', [
  {
    rule: 'required',
    errorMessage: 'Введите год выхода фильма',
  },
  {
    rule: 'number',
  },
  {
    rule: 'minLength',
    value: 4,
  },
  {
    rule: 'maxLength',
    value: 4,
  },
]);
validate.onSuccess(handleFormSubmit);

// Кнопка удаления всех фильмов
document.querySelector('#btn-delateAll').addEventListener('click', () => { removeFilm() });

// Фильтрация таблицы с фильмами на выбор
const selectEl = document.querySelector('#film-select');
selectEl.addEventListener('change', (e) => { filterFilms(e) });

// Функция фмльтрации
async function filterFilms(e) {
  const prop = e.target.value;
  let andpoint = '';
  switch (prop) {
    case 'isWatched': andpoint = '?isWatched=true'; break;
    case 'title': case 'genre': case 'releaseYear': andpoint = `?${prop}=${document.querySelector(`#filter-${prop}`).value.toLowerCase()}`; break;
    default: break;
  }
  const films = await getFromServer(andpoint);
  renderTable(films);
}

// Display films on load
firstRenderTable()

