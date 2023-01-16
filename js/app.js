const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const paginacionDiv = document.querySelector('#paginacion');
const registrosPorPagina = 20;
let totalPaginas;
let iterador;
let paginaActual = 1;
window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();
    // const terminoNombre = document.querySelector('#nombre').value;
    // const terminoEspecie= document.querySelector('#especie').value;
    // const terminoEstado = document.querySelector('#estado').value;
    // const terminoGenero = document.querySelector('#genero').value;
    // if(terminoNombre  === '' || terminoEstado  === '' || terminoGenero  === '' || terminoEspecie  === '') {
    //     mostrarAlerta('Agrega un termino de busqueda');
    //     return;
    // }
    buscarImagenes();
}

function mostrarAlerta(mensaje) {
    const existeAlerta = document.querySelector('.alerta-busqueda');
    if(!existeAlerta) {
        const alerta = document.createElement('P');
        alerta.classList.add('alerta-busqueda', 'bg-red-100', 'border-red-400', 'text-red-700', 'px-4' , 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta);
    
        setTimeout(() =>{
            alerta.remove();
        }, 3000)
    }

}

function buscarImagenes() {
    const terminoNombre = document.querySelector('#nombre').value;
    const terminoEspecie= document.querySelector('#especie').value;
    const terminoEstado = document.querySelector('#estado').value;
    const terminoGenero = document.querySelector('#genero').value;
    const url = `https://rickandmortyapi.com/api/character/?page=${paginaActual}&name=${terminoNombre}&status=${terminoEstado}&gender=${terminoGenero}&species=${terminoEspecie}`  ;
    fetch(url)
    .then(respuesta => respuesta.json(console.log(respuesta) ))
    .then(resultado => {
        console.log(resultado);
        totalPaginas = calcularPaginas(resultado.info.count);
        console.log(resultado);
        mostrarImagenes(resultado.results);
        // console.log(resultado.info.count);
    }).catch(error => {
               
                mostrarAlerta('No hay resultados nuevos para tu busqueda');
        
    })
    //             //  // Limpiar el paginador previo
    //             //  setTimeout(() =>{
    //             //     window.location = 'index.html';
    //             //  }, 2000)
    //                // Limpiar el paginador previo
  
    //     }
        
    // })
}

// Generar que registra la cantidad de elementos de acuerdo a las paginas

function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function calcularPaginas(total) {
    return parseInt(Math.ceil(total / registrosPorPagina));
}
function mostrarImagenes(imagenes) {
    // console.log(imagenes);
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
    // Iterar sobre el arreglo de imagenes y construir el HTML para verlo
    imagenes.forEach( (imagen) => {
        const { name, status, species, image, location, gender } = imagen;
        resultado.innerHTML +=`
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4>
        <div class="fondo bg-black">
        <p class="font-bold text-center bg-black text-white"> ${name} </p>
        <img class="w-full" src="${image}" >
        <div class="p-4 bg-gray-800">
            <p class="font-bold"> ${status === 'Alive' ? '🟢 Alive' :  status === 'Dead' ? '🔴 Dead' : '⚫ Unknown' } <span class="font-light"> </span> </p>
            <p class="font-bold"> ${species} <span class="font-light"> </span> </p>
            <p class="font-bold"> ${gender} <span class="font-light"> </span> </p>
            <p class="font-bold"> ${location.name} <span class="font-light"> </span> </p>
            <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"  href="${image}" target="_blank" rel="noopener noreferrer">
            Ver Imagen </a>
        </div>
        </div>
        </div>
        `;
    });

    // Limpiar el paginador previo
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    };

    // Generador el nuevo HTML

    imprimirPaginador();
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);
    while(true) {
        const { value, done} = iterador.next();
        if(done) return;
        // caso contrario genera un boton por cada elemento en el generador
        const boton = document.createElement('A');
        boton.href = '#';
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2' , 'font-bold', 'mb-10', 'rounded' );
        boton.onclick = () => {
            paginaActual = value;
            console.log(paginaActual);
            buscarImagenes();
        }
        paginacionDiv.append(boton);
    }
}


