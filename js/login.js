function logar() {
    var email = document.getElementById("email");
    var senha = document.getElementById("senha");

    if(email.value == "admin@admin.com" && senha.value == "admin") {
        localStorage.setItem("acesso", true);
        alert("Usuario autenticado");

        window.location.href = "views/dashboard.html"
    }else{
        alert("Usuario ou senha invalidos!");
    }
}