
function increasewidth()
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
        let response=await fetch("https://api.weatherapi.com/v1/forecast.json?key=84781dcc9be14da3ab555707231409&q="+cityName+"&days=5&aqi=no&alerts=no");
        if(response.status!=200)
        {
            return(false);
        }
        else
        {
            let data= await response.json();
            return data;
        }
        
    }
    catch(error)
    {
        console.error("error while fetching weather for city"+cityName,error);
    }
}
function getDayName(date)
{
    const arr=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let day=new Date(date);
    return arr[day.getDay()];
}

async function updateAlldata(data,cityName)
{
    let day0=data.forecast.forecastday[0];
    let day1=data.forecast.forecastday[1];
    let day2=data.forecast.forecastday[2];
    let day3=data.forecast.forecastday[3];
    let day4=data.forecast.forecastday[4];
    const searchInput=document.getElementsByClassName("search")[0];
    const weatherStatus=document.getElementsByClassName("weather_status")[0];
    const raindetails=document.getElementsByClassName("rainChance")[0];
    const winddetails=document.getElementsByClassName("windSpeed")[0];
    const perdetails=document.getElementsByClassName("percipitation")[0];
    const rain_details_mobile=document.getElementsByClassName("rain_details_mobile")[0];
    const wind_details_mobile=document.getElementsByClassName("wind_details_mobile")[0];
    const humidity_details_mobile=document.getElementsByClassName("humid_details_mobile")[0];
    const main_temp=document.getElementsByTagName("p")[0];
    const main_image=document.getElementsByClassName("main_image")[0];
    const day1Field=document.getElementById("day1");
    const day2Field=document.getElementById("day2");
    const day3Field=document.getElementById("day3");
    const day4Field=document.getElementById("day4");
    const day1img=document.getElementById("day1_img");
    const day2img=document.getElementById("day2_img");
    const day3img=document.getElementById("day3_img");
    const day4img=document.getElementById("day4_img");
    const maxmin=document.getElementsByClassName("main_temp_maxmin")[0];
    const day2name=document.getElementById("day2_name");
    const day3name=document.getElementById("day3_name");
    const day4name=document.getElementById("day4_name");

    //updating all information
    searchInput.value=cityName;
    increasewidth();
    weatherStatus.innerHTML=",its "+data.current.condition.text;
    raindetails.innerHTML=data.current.precip_mm+" mm";
    winddetails.innerHTML=data.current.wind_mph+ "kph";
    perdetails.innerHTML=data.current.humidity+"%";
    rain_details_mobile.innerHTML=data.current.precip_mm+" mm";
    wind_details_mobile.innerHTML=data.current.wind_mph+ " kph";
    humidity_details_mobile.innerHTML=data.current.humidity+"%";
    main_image.src=data.current.condition.icon;
   

    //updating day information
    
    day1img.src=day1.day.condition.icon;
    day2img.src=day2.day.condition.icon;
    day3img.src=day3.day.condition.icon;
    day4img.src=day4.day.condition.icon;
    day2name.innerHTML=getDayName(day2.date);
    day3name.innerHTML=getDayName(day3.date);
    day4name.innerHTML=getDayName(day4.date);

    //displaying temperature based on unit 
    let unit=window.localStorage.getItem("temp_deg");
    
    if(unit==='c')
    {
        main_temp.innerHTML=data.current.temp_c+"&deg"+"C";
        maxmin.innerHTML=day0.day.maxtemp_c+"&deg / "+day0.day.mintemp_c+"&deg";
        day1Field.innerHTML=day1.day.maxtemp_c+"&deg / "+day1.day.mintemp_c+"&deg";
        day2Field.innerHTML=day2.day.maxtemp_c+"&deg / "+day2.day.mintemp_c+"&deg";
        day3Field.innerHTML=day3.day.maxtemp_c+"&deg / "+day3.day.mintemp_c+"&deg";
        day4Field.innerHTML=day4.day.maxtemp_c+"&deg / "+day4.day.mintemp_c+"&deg";
    }
    else
    {
        main_temp.innerHTML=data.current.temp_f+"&deg"+"F";
        maxmin.innerHTML=day0.day.maxtemp_f+"&deg / "+day0.day.mintemp_f+"&deg";
        day1Field.innerHTML=day1.day.maxtemp_f+"&deg / "+day1.day.mintemp_f+"&deg";
        day2Field.innerHTML=day2.day.maxtemp_f+"&deg / "+day2.day.mintemp_f+"&deg";
        day3Field.innerHTML=day3.day.maxtemp_f+"&deg / "+day3.day.mintemp_f+"&deg";
        day4Field.innerHTML=day4.day.maxtemp_f+"&deg / "+day4.day.mintemp_f+"&deg";
    }

}


async function onRender()
{
    //code to mantain state of unit and implement changes when required
    
    let farhenbtn=document.getElementById("farhenbtn");
    let celciusbtn=document.getElementById("celciusbtn");
    let cityName="";
    if(!window.localStorage.getItem("temp_deg"))
    {
        window.localStorage.setItem("temp_deg","c");
        
        farhenbtn.classList.remove("highlight");
        farhenbtn.classList.add("unhighlight");
        celciusbtn.classList.add("highlight");
        celciusbtn.classList.remove("unhighlight");
    }
    else
    {
        let unit=window.localStorage.getItem("temp_deg");
        if(unit==="c")
        {
           
            farhenbtn.classList.remove("highlight");
            farhenbtn.classList.add("unhighlight");
            celciusbtn.classList.add("highlight");
            celciusbtn.classList.remove("unhighlight");
            
            
        }
        else
        {
           
            farhenbtn.classList.add("highlight");
            celciusbtn.classList.remove("highlight");
            farhenbtn.classList.remove("unhighlight");
            celciusbtn.classList.add("unhighlight");
           
        }
    }
   
        
    if(!window.localStorage.getItem("cityName"))
    {
        cityName=await getCityName();
        window.localStorage.setItem("cityName",cityName);
    }
    cityName=window.localStorage.getItem("cityName");
    let data=await getWeatherData(cityName);
    if(data===false)
    {
        alert("city name is not correct please enter correct city name");
    }
    else{
        await updateAlldata(data,cityName);
    }
    

    //setting default mode
    if(!window.localStorage.getItem("mode"))
    {
        window.localStorage.setItem("mode","light");
    }
    else
    {
        let mode=window.localStorage.getItem("mode");
        let sun=document.getElementById("sun_icon");
        let moon=document.getElementById("moon_icon");
        let root=document.querySelector(':root');
        
        if(mode==="light")
        {
            
            
            moon.style.display="none";
            sun.style.display="flex";
            root.style.setProperty("--main-bg-color","#fafafa");
            root.style.setProperty("--main-bold-font","#2a2a2a");
            root.style.setProperty("--second-bg-color","#e7e7e7")
        }
        else
        {
            
            moon.style.display="flex";
            sun.style.display="none";
            root.style.setProperty("--main-bg-color","#2f2f2f");
            root.style.setProperty("--main-bold-font","white");
            root.style.setProperty("--second-bg-color","#464646")
            
        }
        
    }
} 

async function onSubmit()
{
    const searchInput=document.getElementsByClassName("search")[0];
    window.localStorage.setItem("cityName",searchInput.value);
    
}

function unitChange(degree)
{
    let farhenbtn=document.getElementById("farhenbtn");
    let celciusbtn=document.getElementById("celciusbtn");
    if(degree==="c")
    {
        window.localStorage.setItem("temp_deg","c");
        farhenbtn.classList.remove("highlight");
        farhenbtn.classList.add("unhighlight");
        celciusbtn.classList.add("highlight");
        celciusbtn.classList.remove("unhighlight");
        onRender();
        
    }
    else
    {
        window.localStorage.setItem("temp_deg","f");
        farhenbtn.classList.add("highlight");
        celciusbtn.classList.remove("highlight");
        farhenbtn.classList.remove("unhighlight");
        celciusbtn.classList.add("unhighlight");
        onRender();
    }
  
}

function modeChange()
{
    if(!window.localStorage.getItem("mode"))
    {
        window.localStorage.setItem("mode","light");
    }
    else
    {
        let mode=window.localStorage.getItem("mode");
        let sun=document.getElementById("sun_icon");
        let moon=document.getElementById("moon_icon");
        let root=document.querySelector(':root');
        
        if(mode==="light")
        {
            window.localStorage.setItem("mode","dark");
            moon.style.display="flex";
            sun.style.display="none";
            root.style.setProperty("--main-bg-color","#2f2f2f");
            root.style.setProperty("--main-bold-font","white");
            root.style.setProperty("--second-bg-color","#464646")

        }
        else
        {
            window.localStorage.setItem("mode","light");
            moon.style.display="none";
            sun.style.display="flex";
            root.style.setProperty("--main-bg-color","#fafafa");
            root.style.setProperty("--main-bold-font","#2a2a2a");
            root.style.setProperty("--second-bg-color","#e7e7e7")
            
        }
        
    }
}