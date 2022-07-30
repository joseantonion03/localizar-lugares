const btnSearchCity = document.getElementById('button-search_city');
const inputSearchCity = document.getElementById('input-search_city');
const city = document.getElementById('city');
const mapa = document.getElementById('mapa');
const loading = document.querySelector('.loading');
const titulo = document.querySelector('.text-titulo');

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

btnSearchCity.addEventListener('click', async () => {
    if (inputSearchCity.value.trim().length) {
        city.innerHTML = '';
        titulo.innerHTML = 'Lugares encontrados'
        loading.classList.add('loading-active');
        city.innerHTML += '<p>Escolha abaixo um lugar para ser apresentado a localização</p>';
        let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(inputSearchCity.value)}.json?access_token=pk.eyJ1IjoiY2ZsYmVkdWNhdG9yIiwiYSI6ImNrMTZrYm1vNTA1dWEzaGxqN2tmMTZlazcifQ.XXsWkpgiguegb-C7WQpGBA`;
        let results = await fetch(url);
        let json = await results.json();
        if (json.features.length > 0) {
            json.features.map(element => {
                let lat = String(element.center[0]);
                let lot = String(element.center[1]);
                let nameCity = element.place_name;
                let textCity = element.text;
                city.innerHTML += `<button type="button" onclick="searchMapBox(${lot}, ${lat}, '${textCity}')" class="list-group-item list-group-item-action" aria-current="true">${nameCity}</button>`;
            });
        } else {
            Toast.fire({
                icon: 'warning',
                title: 'Não conseguimos encontrar nenhuma localização'
            })
        }
        inputSearchCity.value = '';
        loading.classList.remove('loading-active');
    } else {
        Toast.fire({
            icon: 'info',
            title: 'Você não preencheu o campo de busca'
        })
    }

})

function generateNewMap() {
    mapa.innerHTML = '';
    const mapaCreate = document.createElement('div');
    mapaCreate.setAttribute('id', 'map');
    mapa.appendChild(mapaCreate);
}

function searchMapBox(cord1, cord2, text) {
    generateNewMap();
    var map = L.map('map').setView([cord1, cord2], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([cord1, cord2]).addTo(map)
        .bindPopup(`${text}`)
        .openPopup();
    L.circle([cord1, cord2], 500, {
        color: 'white',
        fillColor: '#eebd1c',
        fillOpacity: 0.5
    }).addTo(map).bindPopup("Hello World!.");
}