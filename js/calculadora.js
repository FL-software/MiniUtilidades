function insert(num)
{
    preencherResultado(obterResultado() + num);
}

function clean()
{
    preencherResultado("");
}

function back()
{
    preencherResultado(obterResultado().substring(0, obterResultado().length - 1));
}

function calcular()
{
    if (obterResultado())
    {
        preencherResultado(eval(obterResultado()));
    }
}

function obterResultado()
{
    return document.getElementById('resultado').innerHTML;
}

function preencherResultado(valor)
{
    document.getElementById('resultado').innerHTML = valor;
}