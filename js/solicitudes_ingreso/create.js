let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let id = urlParams.get("id");

fetch('http://esenttiapp.test/api/')
.then((response)=>{
    if(!response.ok){
        throw new Error("Error al obtener los datos de la API") 
    }
    return response.json()
})
.then((data)=>{
    if(data.length >0){
        const soliIngre = data[0];
        document.getElementById('sp_do')
    }
})
