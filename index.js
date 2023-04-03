const userTab=document.querySelector("[data-userWeather]")
const searchTab=document.querySelector("[data-searchWeather]")

const userContainer=document.querySelector(".weather-container")

const grantAccessContainer=document.querySelector(".grant-location-container")
const searchForm=document.querySelector("[data-searchForm]")
const loadingScreen=document.querySelector(".loading-container")
const userInfoContainer=document.querySelector(".user-info-container");
const errorPage=document.querySelector(".error-location");

let currentTab=userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

getfromSessionStorage();


userTab.addEventListener("click",()=>{
    switchTab(userTab);
    userTab.classList.add("current-tab")
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
    searchTab.classList.add("current-tab")
})


function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab
        currentTab.classList.add("currentTab");


        if(!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            // loadingScreen.classList.remove("active");
            grantAccessContainer.classList.remove("active")
            userInfoContainer.classList.remove("active")
        }
        else{
            searchForm.classList.remove("active")
            userInfoContainer.classList.remove("active");

            getfromSessionStorage();
        }
    }
}


 function getfromSessionStorage(){
    errorPage.classList.remove("active")
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWetherInfo(coordinates);
        // alert(`${localCoordinates}`)
    }
 }

 async function fetchUserWetherInfo(coordinates){
    const {lat,lon} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const  data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW
        alert(err)
        
        errorPage.classList.add("active")
        userInfoContainer.classList.remove("active");

    }
 }


function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}




function getLocation(){
    // if(!navigator.geolocation){
    //     navigator.geolocation.getCurrentPosition(showPosition);
    // }
    // else{
       
    // }


    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available

        alert("geolocation not supported")
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWetherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {

        errorPage.classList.remove("active")
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        // console.log(data)
        if(data?.message==="city not found"){
            // console.log("hello")
            // ErrorEvent
            throw new Error("hello")

        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        // errorPage.classList.add("active")
        renderWeatherInfo(data);
    }catch(e) {
        //hW
        // alert(e)
        loadingScreen.classList.remove("active");
        errorPage.classList.add("active")
        // userInfoContainer.classList.remove("active");

    }
}










