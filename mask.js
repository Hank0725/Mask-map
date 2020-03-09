
//設定地圖，將地圖定位在＃map，定位center座標，zoom定位17
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
    markers.addLayer(L.marker([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], { icon: mask }).bindPopup('<h2>藥局名稱:' + data[i].properties.name + '</h2><span>電話:' + data[i].properties.phone + '</span><span>住址:' + data[i].properties.address + '</span><p class="mask_adult clearfix">成人:' + data[i].properties.mask_adult + '</p><p class="mask_child clearifx">兒童:' + data[i].properties.mask_child + '</p><p class="note clearfix">備註:' + data[i].properties.note + data[i].properties.custom_note + '</p><span class="updatetime">更新時間:' + data[i].properties.updated + '</span>'));
    map.addLayer(markers);
  }
  let length = data.length;
  let county = [];
  //將城市加入select選項

  let optionlist_county = document.querySelector(".optionlist-county");
  let select = document.getElementById("select");
  let selection = document.getElementById("selecttown");

  // 監聽城市按鈕選項
  select.addEventListener("change", addtown, false);
  // //監聽地區增加藥局列表按鈕選項  
  selection.addEventListener("change", pharmacylist, false)



  //新增城市的陣列
  for (let i = 0; i < length; i++) {
    county.push(data[i].properties.county);
  };
  // 再用 foreach 去判斷陣列裡面所有值是否有吻合
  let countyoption = [];
  county.forEach(function (value) {
    if (countyoption.indexOf(value) == -1) {
      countyoption.push(value);
    }
  });
  //下拉式選單匯入子元素option
  for (let i = 0; i < countyoption.length; i++) {
    let str = document.createElement("option");
    str.textContent = countyoption[i];
    optionlist_county.appendChild(str);
  }



  //  使用change函式篩檢地區陣列出來
  function addtown(e) {
    let optionlist_town = document.querySelector(".optionlist-town");
    let town = [];
    let str = "";
    optionlist_town.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      if (e.target.value == data[i].properties.county) {
        //新增地區的陣列
        town.push(data[i].properties.town);
      }
    }
    // 再用 foreach 去判斷陣列裡面所有值是否有吻合
    let townoption = [];
    town.forEach(function (value) {
      if (townoption.indexOf(value) == -1) {
        townoption.push(value);
      }
    });

    //將地區加入select選項
    //下拉式選單匯入子元素option
    for (let i = 0; i < townoption.length; i++) {
      str = '<option>' + townoption[i] + '</option>';
      optionlist_town.innerHTML += str;
    }

  }

  //找出當地藥局資料加入list
  function pharmacylist(e) {
    let list = document.querySelector(".list");

    let str = "";
    let newdata = [];
    list.innerHTML = "";

    //新增地區的陣列 
    for (let i = 0; i < data.length; i++) {
      if (e.target.value == data[i].properties.town) {
        if (data[i].properties.mask_adult > 0 || data[i].properties.mask_child > 0) {
          newdata.push(data);
          document.getElementById("value").textContent = newdata.length;
          str += '<div class="pharmacy"><h2>藥局名稱:' + data[i].properties.name + '</h2><span>電話:' + data[i].properties.phone + '</span><span>住址:' + data[i].properties.address + '</span><p class="mask_adult">成人:' + data[i].properties.mask_adult + '</p><p class="mask_child">兒童:' + data[i].properties.mask_child + '</p><span class="note">備註:' + data[i].properties.note + data[i].properties.custom_note + '</span><p class="updatetime">更新時間:' + data[i].properties.updated + '</p></div>';
          list.innerHTML = str;
        }
      }
    }
  }


}


//開啟左側選單
let show = document.querySelector(".openmenu")
show.addEventListener("click", addclass, false);
function addclass(e) {
  e.preventDefault();
  let sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("close");
  sidebar.classList.add("open");
}

//關閉右側選單
let close = document.querySelector(".closemenu");
close.addEventListener("click", removeclass, false);
function removeclass(e) {
  e.preventDefault();
  let sidebar = document.querySelector(".sidebar");
  sidebar.classList.remove("open");
  sidebar.classList.add("close");
}
