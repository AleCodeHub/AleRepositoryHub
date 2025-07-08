// script.js

const letrasData = [
  { letra: "a", nombre: "A", audio: "A.mp3" },
  { letra: "b", nombre: "Be", audio: "Be.mp3" },
  { letra: "c", nombre: "Ce", audio: "Ce.mp3" },
  { letra: "ch", nombre: "Che", audio: "Che.mp3" },
  { letra: "d", nombre: "De", audio: "De.mp3" },
  { letra: "e", nombre: "E", audio: "E.mp3" },
  { letra: "f", nombre: "Efe", audio: "Efe.mp3" },
  { letra: "g", nombre: "Ge", audio: "Ge.mp3" },
  { letra: "h", nombre: "Hache", audio: "Hache.mp3" },
  { letra: "i", nombre: "I", audio: "I.mp3" },
  { letra: "j", nombre: "Jota", audio: "Jota.mp3" },
  { letra: "k", nombre: "Ka", audio: "Ka.mp3" },
  { letra: "l", nombre: "Ele", audio: "Ele.mp3" },
  { letra: "ll", nombre: "Elle", audio: "Elle.mp3" },
  { letra: "m", nombre: "Eme", audio: "Eme.mp3" },
  { letra: "n", nombre: "Ene", audio: "Ene.mp3" },
  { letra: "ñ", nombre: "Eñe", audio: "Enne.mp3" },
  { letra: "o", nombre: "O", audio: "O.mp3" },
  { letra: "p", nombre: "Pe", audio: "Pe.mp3" },
  { letra: "q", nombre: "Cu", audio: "Cu.mp3" },
  { letra: "r", nombre: "Erre", audio: "Erre.mp3" },
  { letra: "s", nombre: "Ese", audio: "Ese.mp3" },
  { letra: "t", nombre: "Te", audio: "Te.mp3" },
  { letra: "u", nombre: "U", audio: "U.mp3" },
  { letra: "v", nombre: "Uve", audio: "V.mp3" },
  { letra: "w", nombre: "Uve doble", audio: "Vdoble.mp3" },
  { letra: "x", nombre: "Equis", audio: "Equis.mp3" },
  { letra: "y", nombre: "I griega", audio: "iGriega.mp3" },
  { letra: "z", nombre: "Zeta", audio: "Zeta.mp3" }
];

const campoJuego = document.getElementById("campo-juego");
const aciertosEl = document.getElementById("aciertos");
const erroresEl = document.getElementById("errores");

let letrasDisponibles = [...letrasData];
let letrasEnPantalla = [];
let letraCorrecta;
let aciertos = 0;
let errores = 0;
let bloqueoClicks = false;
let cantidadLetras = 4;

function reproducirAudio(ruta) {
  const audio = new Audio(ruta);
  audio.play();
}

function elegirGrupo(letras, cantidad = 4) {
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
    div.style.fontSize = "25px";
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

    let x, y;
    let intentos = 0;
    do {
      x = Math.random() * (campoJuego.clientWidth - 100);
      y = Math.random() * (campoJuego.clientHeight - 100);
      intentos++;
    } while (
      letrasEnPantalla.some((l) => Math.hypot(l.x - x, l.y - y) < 100) && intentos < 50
    );

    const dx = (Math.random() - 0.5) * 6 || 2;
    const dy = (Math.random() - 0.5) * 6 || 2;

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

  const letraIndex = letrasEnPantalla.findIndex((l) => l.letra === letraObj.letra);
  if (letraIndex === -1) return;
  const letraData = letrasEnPantalla[letraIndex];

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

  letrasDisponibles = letrasDisponibles.filter((l) => l.letra !== letraObj.letra);

  setTimeout(() => generarGrupoLetras(), 1000);
}

function detectarColisiones() {
  for (let i = 0; i < letrasEnPantalla.length; i++) {
    for (let j = i + 1; j < letrasEnPantalla.length; j++) {
      const a = letrasEnPantalla[i];
      const b = letrasEnPantalla[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 100) {
        const tempDx = a.dx;
        const tempDy = a.dy;
        a.dx = b.dx;
        a.dy = b.dy;
        b.dx = tempDx;
        b.dy = tempDy;
      }
    }
  }
}

function animarLetras() {
  letrasEnPantalla.forEach((letra) => {
    letra.x += letra.dx;
    letra.y += letra.dy;

    if (letra.x <= 0 || letra.x >= campoJuego.clientWidth - 100) letra.dx *= -1;
    if (letra.y <= 0 || letra.y >= campoJuego.clientHeight - 100) letra.dy *= -1;

    letra.el.style.left = `${letra.x}px`;
    letra.el.style.top = `${letra.y}px`;
  });

  detectarColisiones();
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
  letrasDisponibles = [...letrasData];
  aciertos = 0;
  errores = 0;
  aciertosEl.textContent = aciertos;
  erroresEl.textContent = errores;
  document.getElementById("pantalla-instrucciones").classList.add("oculto");
  document.getElementById("pantalla-juego").classList.remove("oculto");
  generarGrupoLetras();
  animarLetras();
}

document.getElementById("btn-reiniciar").addEventListener("click", () => {
  document.getElementById("pantalla-final").classList.add("oculto");
  document.getElementById("pantalla-instrucciones").classList.remove("oculto");
});
