// script.js

const letrasData = [
  { letra: "a", nombre: "A", audio: "../assets/audio/letras/_001_A.mp3" },
  { letra: "b", nombre: "Be", audio: "../assets/audio/letras/_002_Be.mp3" },
  { letra: "c", nombre: "Ce", audio: "../assets/audio/letras/_003_Ce.mp3" },
  { letra: "ch", nombre: "Che", audio: "../assets/audio/letras/_004_Che.mp3" },
  { letra: "d", nombre: "De", audio: "../assets/audio/letras/_005_De.mp3" },
  { letra: "e", nombre: "E", audio: "../assets/audio/letras/_006_E.mp3" },
  { letra: "f", nombre: "Efe", audio: "../assets/audio/letras/_007_Efe.mp3" },
  { letra: "g", nombre: "Ge", audio: "../assets/audio/letras/_008_Ge.mp3" },
  { letra: "h", nombre: "Hache", audio: "../assets/audio/letras/_009_Hache.mp3" },
  { letra: "i", nombre: "I", audio: "../assets/audio/letras/_010_I.mp3" },
  { letra: "j", nombre: "Jota", audio: "../assets/audio/letras/_011_Jota.mp3" },
  { letra: "k", nombre: "Ka", audio: "../assets/audio/letras/_012_Ka.mp3" },
  { letra: "l", nombre: "Ele", audio: "../assets/audio/letras/_013_Ele.mp3" },
  { letra: "ll", nombre: "Elle", audio: "../assets/audio/letras/_014_Elle.mp3" },
  { letra: "m", nombre: "Eme", audio: "../assets/audio/letras/_015_Eme.mp3" },
  { letra: "n", nombre: "Ene", audio: "../assets/audio/letras/_016_Ene.mp3" },
  { letra: "ñ", nombre: "Eñe", audio: "../assets/audio/letras/_017_Enne.mp3" },
  { letra: "o", nombre: "O", audio: "../assets/audio/letras/_018_O.mp3" },
  { letra: "p", nombre: "Pe", audio: "../assets/audio/letras/_019_Pe.mp3" },
  { letra: "q", nombre: "Cu", audio: "../assets/audio/letras/_020_Cu.mp3" },
  { letra: "r", nombre: "Erre", audio: "../assets/audio/letras/_021_Erre.mp3" },
  { letra: "s", nombre: "Ese", audio: "../assets/audio/letras/_022_Ese.mp3" },
  { letra: "t", nombre: "Te", audio: "_023_Te.mp3" },
  { letra: "u", nombre: "U", audio: "../assets/audio/letras/_024_U.mp3" },
  { letra: "v", nombre: "Uve", audio: "../assets/audio/letras/_025_V.mp3" },
  { letra: "w", nombre: "Uve doble", audio: "../assets/audio/letras/_026_Vdoble.mp3" },
  { letra: "x", nombre: "Equis", audio: "../assets/audio/letras/_027_Equis.mp3" },
  { letra: "y", nombre: "I griega", audio: "../assets/audio/letras/_028_iGriega.mp3" },
  { letra: "z", nombre: "Zeta", audio: "../assets/audio/letras/_029_Zeta.mp3" }
];

const campoJuego = document.getElementById("campo-juego");
const aciertosEl = document.getElementById("aciertos");
const erroresEl = document.getElementById("errores");
let cantidadLetras = 4;

let letrasDisponibles = [...letrasData];
let letrasEnPantalla = [];
let letraCorrecta;
let aciertos = 0;
let errores = 0;
let bloqueoClicks = false;

function reproducirAudio(ruta) {
  const audio = new Audio(ruta);
  audio.play();
}

function elegirGrupo(letras, cantidad) {
  const grupo = [];
  const disponibles = [...letras];
  while (grupo.length < cantidad && disponibles.length > 0) {
    const index = Math.floor(Math.random() * disponibles.length);
    grupo.push(disponibles.splice(index, 1)[0]);
  }
  return grupo;
}

function ajustarTexto(div, nombre) {
  if (["Hache", "Equis"].includes(nombre)) {
    div.style.fontSize = "35px";
  } else if (["Uve doble", "I griega"].includes(nombre)) {
    div.style.fontSize = "35px";
    div.style.lineHeight = "1";
    div.style.textAlign = "center";
  } else {
    div.style.fontSize = "50px";
  }
}

function generarGrupoLetras() {
  campoJuego.innerHTML = "";
  bloqueoClicks = false;
  letrasEnPantalla = [];

  if (letrasDisponibles.length < cantidadLetras) return finalizarJuego();
  const grupo = elegirGrupo(letrasDisponibles, cantidadLetras);

  letraCorrecta = grupo[Math.floor(Math.random() * grupo.length)];
  reproducirAudio(`assets/audio/letras/${letraCorrecta.audio}`);

  grupo.forEach((letraObj) => {
    const div = document.createElement("div");
    div.className = "letra-circulo";
    div.textContent = letraObj.letra;

    const x = Math.random() * (campoJuego.clientWidth - 100);
    const y = Math.random() * (campoJuego.clientHeight - 100);
    const dx = (Math.random() - 0.5) * 8;
    const dy = (Math.random() - 0.5) * 8;

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;

    campoJuego.appendChild(div);

    letrasEnPantalla.push({
      letra: letraObj.letra,
      nombre: letraObj.nombre,
      audio: letraObj.audio,
      x,
      y,
      dx,
      dy,
      el: div
    });

    div.addEventListener("click", () => manejarClick(letraObj));
  });
}

function manejarClick(letraObj) {
  if (bloqueoClicks) return;

  const letraIndex = letrasEnPantalla.findIndex(l => l.letra === letraObj.letra);
  if (letraIndex === -1) return;

  const letraData = letrasEnPantalla[letraIndex];
  letrasDisponibles = letrasDisponibles.filter(l => l.letra !== letraObj.letra);
  bloqueoClicks = true;

  if (letraObj.letra === letraCorrecta.letra) {
    reproducirAudio("assets/audio/interaccion/ding.mp3");
    letraData.el.style.backgroundColor = "green";
    letraData.el.textContent = letraObj.nombre;
    ajustarTexto(letraData.el, letraObj.nombre);
    aciertos++;
    aciertosEl.textContent = aciertos;
  } else {
    reproducirAudio("assets/audio/interaccion/buzz.mp3");
    letraData.el.style.backgroundColor = "red";
    letraData.el.textContent = letraObj.nombre;
    ajustarTexto(letraData.el, letraObj.nombre);
    errores++;
    erroresEl.textContent = errores;
  }

  setTimeout(() => {
    generarGrupoLetras();
  }, 1000);
}

function animarLetras() {
  letrasEnPantalla.forEach((letra) => {
    letra.x += letra.dx;
    letra.y += letra.dy;

    if (letra.x <= 0 || letra.x >= campoJuego.clientWidth - 100) {
      letra.dx *= -1;
    }
    if (letra.y <= 0 || letra.y >= campoJuego.clientHeight - 100) {
      letra.dy *= -1;
    }

    letra.el.style.left = `${letra.x}px`;
    letra.el.style.top = `${letra.y}px`;
  });

  requestAnimationFrame(animarLetras);
}

function finalizarJuego() {
  document.getElementById("pantalla-juego").classList.add("oculto");
  document.getElementById("pantalla-final").classList.remove("oculto");
  document.getElementById("total-aciertos").textContent = aciertos;
  document.getElementById("total-errores").textContent = errores;
}

function iniciarJuego(n) {
  cantidadLetras = n;
  document.getElementById("pantalla-instrucciones").classList.add("oculto");
  document.getElementById("pantalla-juego").classList.remove("oculto");
  generarGrupoLetras();
  animarLetras();
}

document.getElementById("btn-reiniciar").addEventListener("click", () => {
  document.getElementById("pantalla-final").classList.add("oculto");
  document.getElementById("pantalla-instrucciones").classList.remove("oculto");
  letrasDisponibles = [...letrasData];
  aciertos = 0;
  errores = 0;
  aciertosEl.textContent = aciertos;
  erroresEl.textContent = errores;
});
