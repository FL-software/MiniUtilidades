var logado = false;

if(localStorage.getItem("acesso") == "true") {
    logado = true;
    console.log('entrou');
};

if (logado != true) {
    alert("Você não está logado!");
    window.location.href = "../index.html";
}