/*
  Made by Damian Nowakowski
  https://github.com/Nairorox
  Inspired by codepen.io
  bugged, and there is 
  no color syntax
*/

const editableElements = document.querySelectorAll('.editable');
const resultWindow = document.querySelector('.result-window');
const htmlSection = editableElements[0];
const cssSection = editableElements[1];
const jsSection = editableElements[2];
const caret = document.querySelector('.caret');
let resultDocument;
let editing = false;
let editedSection = htmlSection;
let curCaretPos = 0;
let markColor = false;

function updateCaret(nextLine) {
  if(nextLine){
    caret.style.left = `${editedSection.offsetLeft + 5}px`
    caret.style.top = `${caret.offsetTop + 18}px`
  }
  else if(editedSection.innerText.length > 0){
    if(editedSection.lastChild.innerText.length > 0){
      caret.style.left = `${editedSection.children[curCaretPos - 1].offsetLeft + editedSection.children[curCaretPos - 1].offsetWidth}px`;
      caret.style.top = `${editedSection.children[curCaretPos - 1].offsetTop}px`;
    }
  }
  else{
    caret.style.left = `${editedSection.offsetLeft + 2}px`
    caret.style.top = `${editedSection.offsetTop}px`
  }
}

function setCSS(doc) {
  const css = document.createElement('style');
  css.innerText = cssSection.innerText;
  doc.appendChild(css);
}

function setJS(doc) {
  const js = document.createElement('script');
  js.innerText = jsSection.innerText;
  doc.appendChild(js);
}

function createHTML() {
  if (resultDocument) {
    resultWindow.removeChild(resultDocument);
  }
  const html = htmlSection.innerText;
  resultDocument = document.createElement('document');
  resultDocument.innerHTML = html;
  resultWindow.appendChild(resultDocument);
  setCSS(resultDocument);
  setJS(resultDocument);
}

function prepareText(string, to) {
	 	for (let i = 0; i < string.length; i += 1) {
	 		curCaretPos += 1;
    /*	 		if(string[i] == '<'){
	 			markColor = true;
	 		}
*/	 		let newInput = document.createElement('span');
	 			newInput.innerText = string[i];
	 			editedSection.insertBefore(newInput, editedSection.childNodes[curCaretPos]);

	 		to.children[curCaretPos - 1].addEventListener('click', lookForClick);
		}
}


function typing(e) {
  if (editing) {
   let enterPressed = false;
    if (e.key === 'ArrowLeft') {
      if (curCaretPos > 0) {
        curCaretPos -= 1;
      }
    } else if (e.key === 'ArrowRight') {
      if (curCaretPos < editedSection.children.length) { curCaretPos += 1; }
    }
    if (e.key === 'Delete') {
      editedSection.innerHTML = '';
      curCaretPos = 0;
      updateCaret();
    }
    if (e.key.length === 1) { 
      if(!e.ctrlKey && !e.altKey){
        prepareText(e.key, editedSection);
      }
    }
    else if (e.key === 'Enter') {
      curCaretPos += 1;
      let newInput = document.createElement('br');
      editedSection.insertBefore(newInput, editedSection.childNodes[curCaretPos]);
      enterPressed = true;
    }

    else if (e.key === 'Backspace') {
      if (editedSection.children[curCaretPos - 1]) {
        if (editedSection.children[curCaretPos - 1].innerText === '>') {
         // markColor = true;
        }
        editedSection.removeChild(editedSection.children[curCaretPos - 1]);
        curCaretPos -= 1;
      }
    }
    if (editedSection.children.length > 0) {
       updateCaret(enterPressed)
    }
  }
}

function editingMode(e) {
  if (this !== editedSection) {
    editedSection.addEventListener('click', editingMode);
  }
  editing = true;
  caret.classList.add('caret-active');
  curCaretPos = this.innerText.length;
  editedSection = this;
  updateCaret();
  this.removeEventListener('click', editingMode);
  document.addEventListener('keydown', typing);

  createHTML();
}

function lookForClick() {
  for (let i = 0; i < editedSection.children.length; i += 1) {
    if (editedSection.children[i] === this) {
       curCaretPos = i;
       console.log(15)
    }
  }
  updateCaret();
}

editableElements.forEach(element => element.addEventListener('click', editingMode));

