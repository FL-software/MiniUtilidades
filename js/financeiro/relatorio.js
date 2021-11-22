'use strict'

const getLocalStorageAcoes = () => JSON.parse(localStorage.getItem('db_acoes')) ?? []

const getLocalStorageContas = () => JSON.parse(localStorage.getItem('db_contas')) ?? []

const getLocalStorageCategorias = () => JSON.parse(localStorage.getItem('db_categorias')) ?? []

const getLocalStorageMovimentacoes = () => JSON.parse(localStorage.getItem('db_movimentacoes')) ?? []

const lerAcoes = () => getLocalStorageAcoes()

const lerContas = () => getLocalStorageContas()

const lerCategorias = () => getLocalStorageCategorias()

const lerMovimentacoes = () => getLocalStorageMovimentacoes()

const carregarAcoes = () => {
    const dbAcoes = lerAcoes()
    limparTabelaAcoes()
    dbAcoes.forEach(createRowAcoes)
}

const carregarContas = () => {
    const dbContas = lerContas()
    limparTabelaContas()
    dbContas.forEach(createRowContas)
}

const carregarCategorias = () => {
    const dbCategorias = lerCategorias()
    limparTabelaCategorias()
    dbCategorias.forEach(createRowCategorias)
}

const calcularSaldo = (saldo, movimentacoes) => {
    const dbAcoes = lerAcoes()
    let acao;

    dbAcoes.forEach(function(a, i){
        if (a.nome === movimentacoes.acao){
           acao = a 
        }
    })

    if (acao.funcao === "Somar") {
        saldo += parseFloat(movimentacoes.valor)
    }
    else if (acao.funcao === "Subtrair") {
        saldo -= parseFloat(movimentacoes.valor)
    }

    return saldo
}

const createRowAcoes = (acoes, index) => {
    const dbMovimentacoes = lerMovimentacoes()
    let saldo = 0

    dbMovimentacoes.forEach(function(movimentacao, i){
        if (movimentacao.acao === acoes.nome){
            saldo = calcularSaldo(saldo, movimentacao)
        }
    })

    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${acoes.nome}</td>
        <td>${parseFloat(saldo).toLocaleString("pt-BR", {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</td>
    `
    document.querySelector('#tabelaAcoes>tbody').appendChild(newRow)
}

const createRowContas = (contas, index) => {
    const dbMovimentacoes = lerMovimentacoes()
    let saldo = 0

    dbMovimentacoes.forEach(function(movimentacao, i){
        if (movimentacao.conta === contas.nome){
            saldo = calcularSaldo(saldo, movimentacao)
        }
    })

    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${contas.nome}</td>
        <td>${parseFloat(saldo).toLocaleString("pt-BR", {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</td>
    `
    document.querySelector('#tabelaContas>tbody').appendChild(newRow)
}

const createRowCategorias = (categorias, index) => {
    const ativo = document.getElementById('ativo').checked
    if (!ativo || categorias.ativo) {
        const dbMovimentacoes = lerMovimentacoes()
        let saldo = 0
    
        dbMovimentacoes.forEach(function(movimentacao, i){
            if (movimentacao.categoria === categorias.nome){
                saldo = calcularSaldo(saldo, movimentacao)
            }
        })
    
        const newRow = document.createElement('tr')
        newRow.innerHTML = `
            <td>${categorias.nome}</td>
            <td>${parseFloat(saldo).toLocaleString("pt-BR", {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</td>
        `
        document.querySelector('#tabelaCategorias>tbody').appendChild(newRow)
    }    
}

const limparTabelaAcoes = () => {
    const rows = document.querySelectorAll('#tabelaAcoes>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const limparTabelaContas = () => {
    const rows = document.querySelectorAll('#tabelaContas>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const limparTabelaCategorias = () => {
    const rows = document.querySelectorAll('#tabelaCategorias>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

carregarAcoes()
carregarContas()
carregarCategorias()

const clickItem = (evento) => {
    carregarAcoes()
    carregarContas()
    carregarCategorias()
}

document.getElementById('ativo').addEventListener('click', clickItem);