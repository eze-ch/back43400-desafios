console.log("script conectado")

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event)=>{ //al apretar submit, envia el formulario y se recarga
    event.preventDefault(); //hace q no se recargue automaticamente el formulario
    const data = new FormData(form);
    //console.log(data);
    //asi se ve el form data: me deveulve una clase.. por lo tanto lo covierto con JSON

    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    console.log(obj)

    const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json" //para especificar q le estoy enviando un json
        }
    })
    
    /* const responseData = await response.json()
    console.log(responseData) */
})