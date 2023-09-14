async function increasewidth(x)
{
    let search=document.getElementsByClassName("search")[0];
    let city=search.value;
    let len=search.value.length;
    let apiCall="https://api.weatherapi.com/v1/current.json?key=84781dcc9be14da3ab555707231409&q="+city+"&aqi=no";
    if(len>8)
    {
        search.style.width=len+"ch";
    }
    const response=await fetch(apiCall);
    const weather= await response.json();
    console.log(weather);
   
}