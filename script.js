function iniciarJogo(status) {
  var divinit = document.getElementById('div-init');
  var divcontent = document.getElementById('div-content');
  var cond1 = "none";
  var cond2 = "contents";
  if(status === 'fim') {
    cond1 = "contents";
    cond2 = "none";
    location.reload(); 
  }
  divinit.style.setProperty("display", cond1);
  divcontent.style.setProperty("display", cond2);
}

//Cadastro Palavras
var palavras = [];
//Chamada localStorage
var cadpalavras = localStorage;
//populate palavras array with localStorage items
if(cadpalavras.length > 0) {
  for(let key in cadpalavras) { 
    if (cadpalavras.hasOwnProperty(key)) {
      let palavra = cadpalavras.getItem(key);
      palavras.push([key,palavra]);
    }
  }
} else {
  //Se nao tem localStorage ou localStorage vazio
  //preenche array palavras
  palavras.push(['1', 'BANANA&FRUTA']);
  palavras.push(['2', 'MORANGO&FRUTA']);
  palavras.push(['3', 'PERA&FRUTA']);
  palavras.push(['4', 'ABACAXI&FRUTA']);
  palavras.push(['5', 'LARANJA&FRUTA']);
  palavras.push(['6', 'PITANGA&FRUTA']);
}

var edica = document.getElementById('div-assunto');
var asorteio = randomPalavra(palavras);
let atmp = asorteio[1].split(/&/);
const assunto = atmp[1];
const palavra = atmp[0];
edica.innerText = "Dica : " + assunto;

//Sorteia aleatoriamente um item de array palavras
function randomPalavra(array) {
  let nitem = array.length - 1; // porque indice inicial de array = 0 
  //let randompos = Math.round(Math.random() * nitem);
  //randompos inclui 0
  let randompos = Math.floor(Math.random() * nitem);
  //console.log(randompos);
  return array[randompos];
}

//Preenche com slots conforme tam. palavra sorteada
var aletras = [], aslots = [], aerros = [];
for(let letra of palavra) {
  aslots.push('_');
  aletras.push(letra);
}

var eslot = document.getElementById('div-slot');
aslots = aslots.join(' ');
aletras = aletras.join(' ');
eslot.innerText = aslots;
  
var setValue = function(evalue, eid, event) {
  var ebtn = document.getElementById(eid);
  var rgexp = RegExp(evalue,"g");
  var matchobj = aletras.matchAll(rgexp);
  var matches = Array.from(matchobj);
  var atmp = Array.from(aslots);
  var texto = edica.innerText;
  if(matches.length > 0) {
    for(let i= 0; i < matches.length; i++) {
      let aind = matches[i].index;
      atmp[aind] = matches[i][0];
    }
    aslots = atmp.join('');
    //
    eslot.innerText = aslots;
    //
    let slots = aslots.replaceAll('_','');
    slots = slots.replaceAll(' ','');
    //Teve match , desabilita tecla          
    ebtn.style.setProperty("background-color", "lightblue");
    ebtn.style.setProperty("transform", "scale(0.9, 0.9)");
    ebtn.style.setProperty("color", "green");
    //Todas as letras preenchidas
    if(palavra === slots) {
      texto = 'Parabéns, Vc venceu !';
      disableAllBtn();
      playAudio('win');
      setTimeout("showModal()", 3000);
    } 
  } else { // não match
    ebtn.style.setProperty("background-color", "lightgrey");
    ebtn.style.setProperty("transform", "scale(0.9, 0.9)");
    ebtn.style.setProperty("color", "red");
    aerros.push(evalue);
    let erecycle = document.getElementById('recycle-letra');
    //
    erecycle.innerText = aerros.join(', ');
    //
    let nimg = changeImg();
    if(nimg) {
      texto = 'Xii... vc perdeu !';
      disableAllBtn();
      playAudio('lose');
      setTimeout("showModal()", 3000);
    }
  }
  //se match ou descartada -> disable btn
  edica.innerText = texto;
  ebtn.disabled = true;
  //event.preventDefault();
}

//Set buttons click event listeners 
var evbtn = document.querySelectorAll('.vbtn');
evbtn.forEach(item => {
  //Event click of virtualkeyboard button
  item.addEventListener('click', function(e) { 
    setValue(item.value, item.id, e); 
    //e.stopPropagation(); 
  });

  //Custom Event keydown of real keyboard button
  item.addEventListener('kbddown', function(e) {
    let eventdetail = e.detail.origin;
    if(eventdetail.tagName === 'BODY') {
      //console.log('kbddown BODY : ' + item.value);
      setValue(item.value, item.id, e);
    } else if(eventdetail.tagName === 'INPUT') {
      //console.log('kbddown INPUT : ' + item.value);
      //para INPUT o valor vai direto para o box !
    } else {
      //algum outro possivel elemento
    }
  }); 
});
  
//Event keydown of real keyboard button
document.addEventListener('keydown', function(e) {
  var eactive = document.activeElement;
  if(e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122) {
    let evkey = e.key.toUpperCase();
    let btnid = 'btn' + evkey;
    let ebtn = document.getElementById(btnid);
    var kbdEvent = new CustomEvent("kbddown", {
      detail: { origin: eactive }
    });
    if(kbdEvent !== null) {
      ebtn.dispatchEvent(kbdEvent); 
    } else {
      console.log('kbdEvent error !');
    }
  } else {
    //Prevent Tab , Enter , etc
    e.preventDefault();
  }
}); 

var eassunto = document.getElementById("assunto");
var epalavra = document.getElementById("palavra");
var btninput = document.getElementById("cad-input-btn");
btninput.addEventListener('click', function() { incluirItem() });

function incluirItem() {
  let inputassunto = eassunto.value;
  let inputpalavra = epalavra.value;
  let ctrl = true;
  if(event instanceof MouseEvent) {
    // is 'click' event
  } else if(event instanceof KeyboardEvent) {
    //Somente letras maiusculas
    if(!(event.keyCode >= 65 && event.keyCode <= 90)) {
      ctrl = false;
    } else {
      alert('Atenção : Sem ACENTUAÇÂO ou caracter ESPECIAL !')
    }
  }
  if(ctrl) {
    let inputref = inputpalavra + '&' + inputassunto;
    //verifica se já está incluso
    let pos = palavras.findIndex(palavra => palavra[1] === inputref);
    if(pos >= 0) {
      alert('Palavra ja cadastrada !');
    } else {
      let npos = palavras.length + 1;
      npos = npos.toString(); // localStorage só aceita string
      palavras.push([npos,inputref]);
      cadpalavras.setItem(npos,inputref);
    }
  }
}
  
//Sequencia imgs Skeleton
var images = [
  {name:'img1', src:'hangman1.png'},
  {name:'img2', src:'hangman2.png'},
  {name:'img3', src:'hangman3.png'},
  {name:'img4', src:'hangman4.png'},
  {name:'img5', src:'hangman5.png'},
  {name:'img6', src:'hangman6.png'},
];
var imgind = 0;
function changeImg() {
  if(imgind < images.length) {
    let imgsrc = images[imgind].src;
    document.getElementById("img-hangman").src = imgsrc;
    imgind++;
  } else {
    imgind = 0;
  }
  return imgind === images.length; 
}

var modal = document.getElementById("modal-retorno");
var btnret = document.getElementById("btn-retorno");

function showModal() {
  modal.style.display = "block";
}

btnret.onclick = function() {
  modal.style.display = "none";
  iniciarJogo('fim');
}

function playAudio(audioid) {
  var audio = document.getElementById(audioid);
  audio.volume = 0.8;
  audio.play();
}

function disableAllBtn() {
  evbtn.forEach(item => {
    item.disabled = true;
  });
}  

function removeListeners() {
  //Elements with Listeners
  //evbtn and document

  evbtn.forEach(item => {
    //Event click of virtualkeyboard button
    item.removeEventListener('click', function(e) { 
      setValue(item.value, item.id, e);  
    });

    //Custom Event keydown of real keyboard button
    item.removeEventListener('kbddown', function(e) {
      let eventdetail = e.detail.origin;
      if(eventdetail.tagName === 'BODY') {
        //console.log('kbddown BODY : ' + item.value);
        setValue(item.value, item.id, e);
      } else if(eventdetail.tagName === 'INPUT') {
        //console.log('kbddown INPUT : ' + item.value);
        //para INPUT o valor vai direto para o box !
      } else {
        //algum outro possivel elemento
      }
    }); 
  });
    
  //Event keydown of real keyboard button
  document.removeEventListener('keydown', function(e) {
    var eactive = document.activeElement;
    if(e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122) {
      let evkey = e.key.toUpperCase();
      let btnid = 'btn' + evkey;
      let ebtn = document.getElementById(btnid);
      var kbdEvent = new CustomEvent("kbddown", {
        detail: { origin: eactive }
      });
      if(kbdEvent !== null) {
        ebtn.dispatchEvent(kbdEvent); 
      } else {
        console.log('kbdEvent error !');
      }
    } else {
      //Prevent Tab , Enter , etc
      e.preventDefault();
    }
  });   
}

function closePage() {
  //let location = "chrome://newtab"
  let location = "tst_open_page_1.html";
  let new_window = open(location, '_self');
  //console.log('Location : ' + new_window.location.href);
  // Close this window
  new_window.close();
}