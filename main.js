
function increasewidth(x)
{
    let search=document.getElementsByClassName("search")[0];
    let city=search.value;
    let len=search.value.length;
    if(len>3)
    {
        search.style.width=len+1+"ch";
    } 
}

async function getCityName() {
    try {
        let response = await fetch("https://api.geoapify.com/v1/ipinfo?apiKey=03a412f1fc0f41d192043550a81dcadd");
        let data = await response.json();
        return data.city.name;
    } catch (error) {
        console.error("Error fetching city name:", error);
    }
}

async function getWeatherData(cityName)
{
    try{
        let response=await fetch("http://api.weatherapi.com/v1/forecast.json?key=84781dcc9be14da3ab555707231409&q="+cityName+"&days=5&aqi=no&alerts=no");
        let data= await response.json();
        return data;
    }
    catch(error)
    {
        console.error("error while fetching weather for city"+cityName,error);
    }
}


async function updateAlldata(data,cityName)
{
    
    let day1=data.forecast.forecastday[1];
    let day2=data.forecast.forecastday[2];
    let day3=data.forecast.forecastday[3];
    let day4=data.forecast.forecastday[4];
    const searchInput=document.getElementsByClassName("search")[0];
    const weatherStatus=document.getElementsByClassName("weather_status")[0];
    const raindetails=document.getElementsByClassName("rainChance")[0];
    const winddetails=document.getElementsByClassName("windSpeed")[0];
    const perdetails=document.getElementsByClassName("percipitation")[0];
    const main_temp=document.getElementsByTagName("p")[0];
    const main_image=document.getElementsByClassName("main_image")[0];
    const day1Field=document.getElementById("day1");
    const day2Field=document.getElementById("day2");
    const day3Field=document.getElementById("day3");
    const day4Field=document.getElementById("day4");
    //updating all information
    searchInput.value=cityName;
    increasewidth();
    weatherStatus.innerHTML="its "+data.current.condition.text;
    raindetails.innerHTML=data.current.precip_mm+" mm";
    winddetails.innerHTML=data.current.wind_mph+ "kph";
    perdetails.innerHTML=data.current.humidity+"%";
    main_temp.innerHTML=data.current.temp_c;
    main_image.src=data.current.condition.icon;

    //updating day information
    day1Field.innerHTML=day1.day.maxtemp_c+" / "+day1.day.mintemp_c;
    day2Field.innerHTML=day2.day.maxtemp_c+" / "+day2.day.mintemp_c;
    day3Field.innerHTML=day3.day.maxtemp_c+" / "+day3.day.mintemp_c;
    day4Field.innerHTML=day4.day.maxtemp_c+" / "+day4.day.mintemp_c;
}


async function onRender()
{
    let cityName="";
    if(!window.localStorage.getItem("cityName"))
    {
        cityName=await getCityName();
        window.localStorage.setItem("cityName",cityName);
    }
    cityName=window.localStorage.getItem("cityName");
    let data=await getWeatherData(cityName);
    await updateAlldata(data,cityName);
} 

async function onSubmit()
{
    const searchInput=document.getElementsByClassName("search")[0];
    window.localStorage.setItem("cityName",searchInput.value);
    
}