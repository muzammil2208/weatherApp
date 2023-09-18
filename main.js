
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
        let response=await fetch("http://api.weatherapi.com/v1/current.json?key=84781dcc9be14da3ab555707231409&q="+cityName+"&aqi=no");
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
    const searchInput=document.getElementsByClassName("search")[0];
    const weatherStatus=document.getElementsByClassName("weather_status")[0];
    const raindetails=document.getElementsByClassName("rainChance")[0];
    const winddetails=document.getElementsByClassName("windSpeed")[0];
    const perdetails=document.getElementsByClassName("percipitation")[0];
    const main_temp=document.getElementsByTagName("p")[0];

    //updating all information
    searchInput.value=cityName;
    increasewidth();
    weatherStatus.innerHTML="its "+data.current.condition.text;
    raindetails.innerHTML=data.current.precip_mm+" mm";
    winddetails.innerHTML=data.current.wind_mph+ "kph";
    perdetails.innerHTML=data.current.humidity+"%";
    main_temp.innerHTML=data.current.temp_c;

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