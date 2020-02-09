
//設定地圖，將地圖定位在＃map，定位center座標，zoom定位13
let map = L.map('map', {
    center: [25.1097598, 121.5255809],
    zoom: 17
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//新增圖層放上群組
let markers = new L.MarkerClusterGroup().addTo(map);

let redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let blueIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.marker([51.5, -0.09], { icon: blueIcon }).addTo(map);

//連接AJAX
let xhr = new XMLHttpRequest();

xhr.open('get', "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json", true);
xhr.send(null);

xhr.onload = function () {
    let data = JSON.parse(xhr.responseText).features;
    for (let i = 0; i < data.length; i++) {
        let mask;
        if (data[i].properties.mask_adult == 0 || data[i].properties.mask_child == 0) {
            mask = redIcon;
        } else { mask = blueIcon; }
        //在各個圖層上加上各個marker
        markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: mask }).bindPopup('<h1>藥局名稱:' + data[i].properties.name + '</h1><p>電話:' + data[i].properties.phone + '</p><p>住址:' + data[i].properties.address + '</p><p class="mask_adult">成人口罩:' + data[i].properties.mask_adult + '個</p><p class="mask_child">兒童口罩：' + data[i].properties.mask_child + '個</p><p class="note">備註:' + data[i].properties.note + '</p>'));

        map.addLayer(markers);
    }




    let list = document.querySelector(".list");
    let str = "";
    let newdata = [];
    list.innerHTML = "";
    for (let i = 0; i < 5; i++) {

        if (data[i].properties.mask_adult > 0 || data[i].properties.mask_child > 0) {
            newdata.push(data);
            str += '<div class="pharmacy"><h1>藥局名稱:' + data[i].properties.name + '</h1><p>電話:' + data[i].properties.phone + '</p><p>住址:' + data[i].properties.address + '</p><p class="mask_adult">成人口罩:' + data[i].properties.mask_adult + '個</p><p class="mask_child">兒童口罩：' + data[i].properties.mask_child + '個</p><p class="note">備註:' + data[i].properties.note + '</p></div>';
            list.innerHTML = str;
        }
    }

}


