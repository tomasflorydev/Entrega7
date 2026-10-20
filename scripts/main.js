const vinilos = [
  { id: 1, titulo: "Random Access Memories", artista: "Daft Punk", precio: 65000 },
  { id: 2, titulo: "Brothers in Arms", artista: "Dire Straits", precio: 52000 },
  { id: 3, titulo: "Luv(sic) Hexalogy", artista: "Nujabes", precio: 78000 }
];

let timerFeedback = null;

const formVinilo = document.getElementById("form-vinilo");
const inputTitulo = document.querySelector("#input-titulo");
const inputArtista = document.querySelector("#input-artista");
const inputPrecio = document.getElementById("input-precio");
const inputBusqueda = document.querySelector("#input-busqueda");
const contenedorItems = document.getElementById("contenedor-items");
const feedback = document.querySelector("#feedback");


function mostrarFeedback(texto, esError = false) {
  if (timerFeedback) {
    clearTimeout(timerFeedback);
  }

  feedback.textContent = texto;
  feedback.className = esError ? "mensaje-error" : "mensaje-exito";

  timerFeedback = setTimeout(function() {
    feedback.className = "oculto";
  }, 2500);
}


function renderizarVinilos(lista) {
  contenedorItems.innerHTML = "";

  if (lista.length === 0) {
    const itemVacio = document.createElement("li");
    itemVacio.className = "tarjeta-vinilo";
    itemVacio.textContent = "No hay vinilos para mostrar.";
    contenedorItems.appendChild(itemVacio);
    return;
  }

  lista.forEach(function(disco) {
    const li = document.createElement("li");
    li.className = "tarjeta-vinilo";

    
    li.innerHTML = `
      <div>
        <h3>${disco.titulo}</h3>
        <p>${disco.artista} — <span class="precio">$${disco.precio.toLocaleString("es-AR")}</span></p>
      </div>
      <button type="button" class="btn-eliminar" data-id="${disco.id}">Eliminar</button>
    `;

    contenedorItems.appendChild(li);
  });
}

formVinilo.addEventListener("submit", function(event) {
  event.preventDefault();

  const titulo = inputTitulo.value.trim();
  const artista = inputArtista.value.trim();
  const precio = Number(inputPrecio.value);

  if (!titulo || !artista || precio <= 0) {
    mostrarFeedback("Por favor, completa todos los campos correctamente.", true);
    return;
  }

  const nuevoVinilo = {
    id: Date.now(),
    titulo: titulo,
    artista: artista,
    precio: precio
  };

  vinilos.push(nuevoVinilo);

  formVinilo.reset();
  inputBusqueda.value = "";
  renderizarVinilos(vinilos);
  mostrarFeedback(`Se agregó "${nuevoVinilo.titulo}" a la colección.`);
});

contenedorItems.addEventListener("click", function(event) {
  if (event.target.classList.contains("btn-eliminar")) {
    const idSeleccionado = Number(event.target.getAttribute("data-id"));
    const indice = vinilos.findIndex(function(v) {
      return v.id === idSeleccionado;
    });

    if (indice !== -1) {
      const eliminado = vinilos[indice];
      vinilos.splice(indice, 1);

      const tarjetaLi = event.target.closest("li");
      tarjetaLi.remove();

      if (contenedorItems.children.length === 0) {
        renderizarVinilos(vinilos);
      }

      mostrarFeedback(`Se eliminó "${eliminado.titulo}".`, true);
    }
  }
});

inputBusqueda.addEventListener("input", function() {
  const texto = inputBusqueda.value.toLowerCase().trim();

  const filtrados = vinilos.filter(function(v) {
    return (
      v.titulo.toLowerCase().includes(texto) ||
      v.artista.toLowerCase().includes(texto)
    );
  });

  renderizarVinilos(filtrados);
});


renderizarVinilos(vinilos);
