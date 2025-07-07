const letrasData = [
  { letra: "a", nombre: "A", audio: "_001_A.mp3" },
  { letra: "b", nombre: "Be", audio: "_002_Be.mp3" },
  { letra: "c", nombre: "Ce", audio: "_003_Ce.mp3" },
  { letra: "ch", nombre: "Che", audio: "_004_Che.mp3" },
  { letra: "d", nombre: "De", audio: "_005_De.mp3" },
  { letra: "e", nombre: "E", audio: "_006_E.mp3" },
  { letra: "f", nombre: "Efe", audio: "_007_Efe.mp3" },
  { letra: "g", nombre: "Ge", audio: "_008_Ge.mp3" },
  { letra: "h", nombre: "Hache", audio: "_009_Hache.mp3" },
  { letra: "i", nombre: "I", audio: "_010_I.mp3" },
  { letra: "j", nombre: "Jota", audio: "_011_Jota.mp3" },
  { letra: "k", nombre: "Ka", audio: "_012_Ka.mp3" },
  { letra: "l", nombre: "Ele", audio: "_013_Ele.mp3" },
  { letra: "ll", nombre: "Elle", audio: "_014_Elle.mp3" },
  { letra: "m", nombre: "Eme", audio: "_015_Eme.mp3" },
  { letra: "n", nombre: "Ene", audio: "_016_Ene.mp3" },
  { letra: "ñ", nombre: "Eñe", audio: "_017_Enne.mp3" },
  { letra: "o", nombre: "O", audio: "_018_O.mp3" },
  { letra: "p", nombre: "Pe", audio: "_019_Pe.mp3" },
  { letra: "q", nombre: "Cu", audio: "_020_Cu.mp3" },
  { letra: "r", nombre: "Erre", audio: "_021_Erre.mp3" },
  { letra: "s", nombre: "Ese", audio: "_022_Ese.mp3" },
  { letra: "t", nombre: "Te", audio: "_023_Te.mp3" },
  { letra: "u", nombre: "U", audio: "_024_U.mp3" },
  { letra: "v", nombre: "Uve", audio: "_025_V.mp3" },
  { letra: "w", nombre: "Uve doble", audio: "_026_Vdoble.mp3" },
  { letra: "x", nombre: "Equis", audio: "_027_Equis.mp3" },
  { letra: "y", nombre: "I griega", audio: "_028_iGriega.mp3" },
  { letra: "z", nombre: "Zeta", audio: "_029_Zeta.mp3" }
];

let campoJuego = document.getElementById("campo-juego");
let aciertos = 0;
let errores = 0;
let letrasEnPantalla = [];
let velocidades = [];
let objetivo;

document.getElementById("btn-comenzar").addEventListener("click", iniciarJuego);

function iniciarJuego() {
  document.getElementById("pantalla-instrucciones").classList.add("oculto");
  document.getElementById("pantalla-juego").classList.remove("oculto");
  generarGrupoLetras();
  animar();
}

function generarGrupoLetras() {
  campoJuego.innerHTML = "";
  letrasEnPantalla = [];
  velocidades = [];

  // Elegir letra objetivo
  objetivo = letrasData[Math.floor(Math.random() * letrasData.length)];

  // Reproducir audio de la letra objetivo
  let audio = new Audio(`assets/audio/letras/${objetivo.audio}`);
  audio.play();

  // Generar letras (nivel: 4 letras)
  let grupo = [objetivo];

  while (grupo.length < 4) {
    let candidata = letrasData[Math.floor(Math.random() * letrasData.length)];
    if (!grupo.includes(candidata)) {
      grupo.push(candidata);
    }
  }

  // Barajar grupo
  grupo.sort(() => Math.random() - 0.5);

  for (let letraObj of grupo) {
    let div = document.createElement("div");
    div.classList.add("letra-circulo");
    div.innerText = letraObj.letra;
    campoJuego.appendChild(div);

    let x = Math.random() * (campoJuego.clientWidth - 60);
    let y = Math.random() * (campoJuego.clientHeight - 60);

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    letrasEnPantalla.push({ element: div, data: letraObj, x, y });
    velocidades.push({ dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4 });

    div.addEventListener("click", () => manejarClick(div, letraObj));
  }
}

function manejarClick(div, letraObj) {
  if (letraObj.letra === objetivo.letra) {
    aciertos++;
    document.getElementById("aciertos").innerText = aciertos;
    div.innerText = letraObj.nombre;
    setTimeout(() => generarGrupoLetras(), 1000);
  } else {
    errores++;
    document.getElementById("errores").innerText = errores;
    div.innerText = letraObj.nombre;
    setTimeout(() => {
      div.innerText = letraObj.letra.toUpperCase();
    }, 1000);

    let buzz = new Audio("assets/audio/interaccion/buzz.mp3");
    buzz.play();
  }
}

function animar() {
  requestAnimationFrame(animar);
  for (let i = 0; i < letrasEnPantalla.length; i++) {
    let letra = letrasEnPantalla[i];
    let vel = velocidades[i];

    letra.x += vel.dx;
    letra.y += vel.dy;

    if (letra.x <= 0 || letra.x >= campoJuego.clientWidth - 100) vel.dx *= -1;
    if (letra.y <= 0 || letra.y >= campoJuego.clientHeight - 100) vel.dy *= -1;

    letra.element.style.left = `${letra.x}px`;
    letra.element.style.top = `${letra.y}px`;
  }
}