let btn1 = document.querySelector('#b1');
let btn2 = document.querySelector('#b2');
let GAccess = document.querySelector('#GAccess');
const loading = document.querySelector('[loading]');
let weatherInfo = document.querySelector('#details');
cont = GAccessBtn = document.querySelector('[GAccessBtn');
const input  = document.querySelector('[input]');
const search = document.querySelector('[search]');
const searchForm = document.querySelector('#searchForm');
const notFound = document.querySelector('[notFound]');

let currentBtn = btn1; // initially btn 1 is selected btdefault
currentBtn.classList.add('bg-[#9896967a]'); // current selected button

const API_KEY = "99ee71bfa681bc5854a935b6fd229394"; // API Key declared globally
getFromSessionStorage();

function switchBtns(clickedBtn){ // helps to switch b/w buttons
    
    if(currentBtn != clickedBtn){ // clicked on different button the do these changes 
       currentBtn.classList.remove('bg-[#9896967a]') ;
       currentBtn=clickedBtn; //update current selected button
       currentBtn.classList.add('bg-[#9896967a]') ;
       if(currentBtn == btn1){                 // if button 1 is clicked do these
           searchForm.classList.add("hidden");
           weatherInfo.classList.add('hidden');
           notFound.classList.add('hidden');
           getFromSessionStorage(); // btn1 pe click hua  hai to check karo ki session storage me coordinates pade hai nahi, ager pade hai to weather data display karo ager nahi pade to ahi tk access grant nahi kiya ,access grant karte hi coordinates aa jae ge
       }
       else{                                   // if button 2 is clicked do these 
      searchForm.classList.remove("hidden");    
      GAccess.classList.add("hidden");
      weatherInfo.classList.add('hidden');
       }
    }
    else return; // if clicked on same button do nothing
}

btn2.addEventListener('click',()=>{
       switchBtns(btn2);
});
btn1.addEventListener('click',()=>{
    switchBtns(btn1);
});

function getFromSessionStorage(){ // perfoem action if coordinates recived or not;
    const coordinates = sessionStorage.getItem("user-coordinates"); // get coordinates, this name user-coordinates we have set while storng session data below, in showPosition() callback function below.
    if(!coordinates){ // if no coordinates recived
        GAccess.classList.remove("hidden");  // show grant access screen, to get coordinates
    }else{            // if coordinates recived then display the weather data and hide the grant acces screen
        const JsonCoordinates = JSON.parse(coordinates); //converting convert jason string into json object using jason.parse()
        fetchUserWeatherInfo(JsonCoordinates);
    }
}

async function fetchUserWeatherInfo(JsonCoordinates){
  const {lat,lon} = JsonCoordinates;
  GAccess.classList.add('hidden'); //ab weather info show karni hai to grant access wali screen hta do
  loading.classList.remove('hidden'); // show loading loading screen untill the data is fetched
   //API CALL:-
  try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    let data = await response.json(); // convert the data into jason format
    loading.classList.add("hidden"); // as now the data is ready to display so remove loader.
    weatherInfo.classList.remove("hidden"); // to show data make weatherinfo screen visible
    renderWeatherInfo(data); // it will put data in weatherInfo screen


  }
  catch(err){
    loading.classList.add("hidden");  // remove loader id there is error/ data not fetched.
  }
}

function renderWeatherInfo(weatherInfo){
    //first fetch all required elements & data
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo);
     //fetch values from weatherINfo object and put it UI elements (rendering):-
     cityName.innerText = weatherInfo?.name;
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; // YE PATHS ?. SARE ONLINE JSON VALIDAE KARKE PATA KIYE
     desc.innerText = weatherInfo?.weather?.[0]?.description;// Weather ke ander array with one element hai us element ke ander object pada hai usobject me se descrition select kiya, to check this format use use JSON formater online
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
     temp.innerText = `${weatherInfo?.main?.temp} °C`;
     windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
     humidity.innerText = `${weatherInfo?.main?.humidity}%`;
     cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){ // check if geolocation feature/api is available or not, we are abe to access it or not
       navigator.geolocation.getCurrentPosition(showPosition);// go w3school for geolocation
    }
    else{  //if not available then 
        alert('No geolocation support available');
    }
}
                            
function showPosition(position) { //If the getCurrentPosition() method is successful, it returns a coordinates object to the function specified in the parameter (showPosition)

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); // ye name
    fetchUserWeatherInfo(userCoordinates);

}
GAccessBtn.addEventListener('click', getLocation);

search.addEventListener('click', (e) => {
    e.preventDefault(); // prevenst ddefault operation/ functions
    let cityName = input.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loading.classList.remove("hidden");
    weatherInfo.classList.add("hidden");
    GAccess.classList.add("hidden");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loading.classList.add("hidden");
        if(data?.name != undefined){
            weatherInfo.classList.remove("hidden");
            notFound.classList.add('hidden')
            renderWeatherInfo(data);
        } 
        else{
            weatherInfo.classList.add("hidden");
            notFound.classList.remove('hidden');
        }
        
    }
    catch(err) {
        // I think error to ae ga hi nahi kyuki renderWeatherInfo() me humne optional chaining use ki hai,
        //  mtlb error ane pe error nahi dega undefined value return kare ga
        }
}
//*
   