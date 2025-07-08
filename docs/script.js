// script.js

const letrasData = [
  { letra: "a", nombre: "A", audio: "001_A.mp3" },
  { letra: "b", nombre: "Be", audio: "002_Be.mp3" },
  { letra: "c", nombre: "Ce", audio: "003_Ce.mp3" },
  { letra: "ch", nombre: "Che", audio: "004_Che.mp3" },
  { letra: "d", nombre: "De", audio: "005_De.mp3" },
  { letra: "e", nombre: "E", audio: "006_E.mp3" },
  { letra: "f", nombre: "Efe", audio: "007_Efe.mp3" },
  { letra: "g", nombre: "Ge", audio: "008_Ge.mp3" },
  { letra: "h", nombre: "Hache", audio: "009_Hache.mp3" },
  { letra: "i", nombre: "I", audio: "010_I.mp3" },
  { letra: "j", nombre: "Jota", audio: "011_Jota.mp3" },
  { letra: "k", nombre: "Ka", audio: "012_Ka.mp3" },
  { letra: "l", nombre: "Ele", audio: "013_Ele.mp3" },
  { letra: "ll", nombre: "Elle", audio: "014_Elle.mp3" },
  { letra: "m", nombre: "Eme", audio: "015_Eme.mp3" },
  { letra: "n", nombre: "Ene", audio: "016_Ene.mp3" },
  { letra: "ñ", nombre: "Eñe", audio: "017_Enne.mp3" },
  { letra: "o", nombre: "O", audio: "018_O.mp3" },
  { letra: "p", nombre: "Pe", audio: "019_Pe.mp3" },
  { letra: "q", nombre: "Cu", audio: "020_Cu.mp3" },
  { letra: "r", nombre: "Erre", audio: "021_Erre.mp3" },
  { letra: "s", nombre: "Ese", audio: "022_Ese.mp3" },
  { letra: "t", nombre: "Te", audio: "023_Te.mp3" },
  { letra: "u", nombre: "U", audio: "024_U.mp3" },
  { letra: "v", nombre: "Uve", audio: "025_V.mp3" },
  { letra: "w", nombre: "Uve doble", audio: "026_Vdoble.mp3" },
  { letra: "x", nombre: "Equis", audio: "027_Equis.mp3" },
  { letra: "y", nombre: "I griega", audio: "028_iGriega.mp3" },
  { letra: "z", nombre: "Zeta", audio: "029_Zeta.mp3" }
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

  if (letrasDisponibles.length < cantidadLetras) {
    finalizarJuego();
    return;
  }

  const grupo = elegirGrupo(letrasDisponibles, cantidadLetras);
  letraCorrecta = grupo[Math.floor(Math.random() * grupo.length)];
  reproducirAudio(`assets/audio/letras/${letraCorrecta.audio}`);

  grupo.forEach((letraObj) => {
    const div = document.createElement("div");
    div.className = "letra-circulo";
    div.textContent = letraObj.letra;

    const x = Math.random() * (campoJuego.clientWidth - 100);
    const y = Math.random() * (campoJuego.clientHeight - 100);
    const dx = (Math.random() - 0.5) * 6;
    const dy = (Math.random() - 0.5) * 6;

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
  const letraData = letrasEnPantalla.find(l => l.letra === letraObj.letra);
  if (!letraData) return;

  if (letraObj.letra === letraCorrecta.letra) {
    reproducirAudio("assets/audio/interaccion/ding.mp3");
    letraData.el.style.backgroundColor = "green";
    letraData.el.textContent = letraObj.nombre;
    ajustarTexto(letraData.el, letraObj.nombre);
    aciertos++;
    aciertosEl.textContent = aciertos;
    bloqueoClicks = true;
    letrasDisponibles = letrasDisponibles.filter(l => l.letra !== letraCorrecta.letra);
  } else {
    reproducirAudio("assets/audio/interaccion/buzz.mp3");
    letraData.el.style.backgroundColor = "red";
    letraData.el.textContent = letraObj.nombre;
    errores++;
    erroresEl.textContent = errores;
    letrasDisponibles = letrasDisponibles.filter(l => l.letra !== letraObj.letra);
  }

  setTimeout(() => {
    generarGrupoLetras();
  }, 1000);
}

function animarLetras() {
  letrasEnPantalla.forEach((letra, i) => {
    letra.x += letra.dx;
    letra.y += letra.dy;

    if (letra.x <= 0 || letra.x >= campoJuego.clientWidth - 100) {
      letra.dx *= -1;
    }
    if (letra.y <= 0 || letra.y >= campoJuego.clientHeight - 100) {
      letra.dy *= -1;
    }

    // Verificar colisiones con otros círculos
    for (let j = i + 1; j < letrasEnPantalla.length; j++) {
      const otro = letrasEnPantalla[j];
      const dx = letra.x - otro.x;
      const dy = letra.y - otro.y;
      const distancia = Math.sqrt(dx * dx + dy * dy);
      if (distancia < 100) {
        // Rebote simple
        letra.dx *= -1;
        letra.dy *= -1;
        otro.dx *= -1;
        otro.dy *= -1;
      }
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

function iniciarJuego(cantidad) {
  cantidadLetras = cantidad;
  letrasDisponibles = [...letrasData];
  aciertos = 0;
  errores = 0;
  aciertosEl.textContent = "0";
  erroresEl.textContent = "0";

  document.getElementById("pantalla-instrucciones").classList.add("oculto");
  document.getElementById("pantalla-juego").classList.remove("oculto");
  generarGrupoLetras();
  animarLetras();
}

document.getElementById("btn-reiniciar").addEventListener("click", () => {
  document.getElementById("pantalla-final").classList.add("oculto");
  document.getElementById("pantalla-instrucciones").classList.remove("oculto");
});
