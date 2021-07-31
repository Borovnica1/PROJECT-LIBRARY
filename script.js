function Book(title, author, pages, hasRead = true) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.hasRead = hasRead;

  this.info = function() {
    return `The ${this.title} by ${this.author}, ${this.pages}, ${this.hasRead ? 'already read' : 'not read yet'}`
  } 
}

const book1 = new Book('titanic', 'osman', 101);
const book2 = new Book('GLADIATOR', 'ernest hemingway', 352);
const book3 = new Book('spider-man', 'Donald trump', 53);
const book4 = new Book('Darko saric', 'Mili', 20);

const overlay = document.querySelector('.overlay');
let myLibrary;
if (storageAvailable('localStorage')) {
  // Yippee! We can use localStorage awesomeness
  console.log('imamo storageeee', localStorage, localStorage["books"]);
  let books;
  if (localStorage["books"] !== undefined) {
    books = JSON.parse(localStorage["books"]);
  }
  console.log('idemo knjige', books)
  if (books.length === 0) {
    myLibrary = [book1, book2, book3, book4];
  } else {
    myLibrary = JSON.parse(localStorage["books"]);
    myLibrary.forEach(book => book.info = function() {
      return `The ${this.title} by ${this.author}, ${this.pages}, ${this.hasRead ? 'already read' : 'not read yet'}`
    });
  }
}
else {
  console.log('nemamo storageeee');
  // Too bad, no localStorage for us
}


console.log('KNJIGE ', book1, book2, book3);




function readBook() {
  const bookIndex = this.parentElement.dataset['id']
  const book = myLibrary[bookIndex];

  book.hasRead = !book.hasRead;
  localStorage["books"] = JSON.stringify(myLibrary);

  this.innerText = book.hasRead ? 'Read' : 'Not Read';
  this.style.backgroundColor = book.hasRead ?  '#8e44ad' : '#8d44ad5b';
}

function deleteBook() {
  const bookIndex = this.parentElement.dataset['id'];
  console.log(myLibrary[bookIndex].info());
  myLibrary.splice(bookIndex, 1);
  localStorage["books"] = JSON.stringify(myLibrary);
  displayBooksInLibrary(myLibrary);
};

function deleteAllBooks() {
  myLibrary = [];
  localStorage["books"] = JSON.stringify(myLibrary);
  displayBooksInLibrary(myLibrary);
}

function displayBooksInLibrary(books) {
  const libraryDiv = document.querySelector('.library');
  libraryDiv.innerHTML = '';
  books.forEach((book, i) => {
    const html = `<div class="library__book" data-id="${i}">
      <h2 class="library__title">${book.title}</h2>
      <h3 class="library__author">${book.author}</h3>
      <h3 class="library__pages">${book.pages} pages</h3>
      <button class="library__isRead">${book.hasRead ? 'Read' : 'Not Read'}</button>
      <button class="library__delete">Delete</button>
    </div>`;
    libraryDiv.insertAdjacentHTML('beforeend', html);
  });
  const deleteBookBtns = document.querySelectorAll('.library__delete');
  const readBookBtns = document.querySelectorAll('.library__isRead');
  readBookBtns.forEach(btn => btn.addEventListener('click', readBook))
  deleteBookBtns.forEach(btn => btn.addEventListener('click', deleteBook))
};

function displayBookForm() {
  overlay.style.display = 'flex';
}

function closeBookForm(e) {
  if (e.target.classList.contains('overlay') || e.target.classList.contains('form-btn-add-book')) {
    overlay.style.display = 'none';
  }
}

displayBooksInLibrary(myLibrary);

const deleteAllBooksBtn = document.querySelector('.btn-delete-books');
const addBookBtn = document.querySelector('.btn-add-book');
const formAddBookBtn = document.querySelector('.form-btn-add-book');


deleteAllBooksBtn.addEventListener('click', deleteAllBooks);
addBookBtn.addEventListener('click', displayBookForm);
formAddBookBtn.addEventListener('click', addBookToLibrary);
overlay.addEventListener('click', closeBookForm);

function addBookToLibrary() {
  const bookTitle = document.getElementById('bname').value;
  const bookAuthor = document.getElementById('aname').value;
  const bookPages = document.getElementById('pages').value;
  const bookRead = document.getElementById('book-read').value;
  const book = new Book(bookTitle, bookAuthor, bookPages, bookRead === 'yes' ? true : false);
  myLibrary.push(book);
  localStorage["books"] = JSON.stringify(myLibrary);
  
  displayBooksInLibrary(myLibrary);

  document.getElementById('bname').value = '';
  document.getElementById('aname').value = '';
  document.getElementById('pages').value = '';
  document.getElementById('book-read').options[0].selected = true;
};


function storageAvailable(type) {
  var storage;
  console.log('wwwww', type, window[type])
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}


