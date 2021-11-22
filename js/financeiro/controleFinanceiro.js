'use strict'

$(document).ready(function()
{
    $("#valor").maskMoney({
        prefix: "R$ ",
        decimal: ",",
        thousands: "."
    });

    $(function() {
        $("#data").datepicker({
            dateFormat: 'dd/mm/yy',
            dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'],
            dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
            dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
            monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
            monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
        });
    });
});

// Abertura e Fechamento do pop-up

const abrirModal = () => {
    carregarAcoes()
    carregarContas()
    carregarCategorias()
    document.getElementById('modal').classList.add('active')
}

const fecharModal = () => {
    limparCampos()
    document.getElementById('modal').classList.remove('active')
}

// Leitura e Escrita na variavel local do navegador

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_movimentacoes')) ?? []

const getLocalStorageAcoes = () => JSON.parse(localStorage.getItem('db_acoes')) ?? []

const getLocalStorageContas = () => JSON.parse(localStorage.getItem('db_contas')) ?? []

const getLocalStorageCategorias = () => JSON.parse(localStorage.getItem('db_categorias')) ?? []

const setLocalStorage = (dbMovimentacoes) => localStorage.setItem("db_movimentacoes" , JSON.stringify(dbMovimentacoes))

// CRUD - create read update delete

const criarMovimentacoes = (movimentacoes) => {
    const dbMovimentacoes = getLocalStorage()
    dbMovimentacoes.push(movimentacoes)
    setLocalStorage(dbMovimentacoes)
}

const lerMovimentacoes = () => getLocalStorage()

const lerAcoes = () => getLocalStorageAcoes()

const lerContas = () => getLocalStorageContas()

const lerCategorias = () => getLocalStorageCategorias()

const atualizarMovimentacoes = (index, movimentacoes) => {
    const dbMovimentacoes = lerMovimentacoes()
    dbMovimentacoes[index] = movimentacoes
    setLocalStorage(dbMovimentacoes)
}

const deleteMovimentacoes = (index) => {
    const dbMovimentacoes = lerMovimentacoes()
    dbMovimentacoes.splice(index, 1)
    setLocalStorage(dbMovimentacoes)
}

//Interação com o Layout

const selectAcoes = $("#acao")

const carregarAcoes = () => {
    const dbAcoes = lerAcoes()
    selectAcoes.html("")
    selectAcoes.append('<option value="" hidden>Qual Ação?</option>')
    dbAcoes.forEach(createOptionAcoes)
}

const createOptionAcoes = (acoes, index) => {
    if (acoes.ativo) {
        selectAcoes.append(`<option>${acoes.nome}</option>`)
    }
}

const selectContas = $("#conta")

const carregarContas = () => {
    const dbContas = lerContas()
    selectContas.html("")
    selectContas.append('<option value="" hidden>Qual Conta?</option>')
    dbContas.forEach(createOptionContas)
}

const createOptionContas = (contas, index) => {
    if (contas.ativo) {
        selectContas.append(`<option>${contas.nome}</option>`)
    }
}

const selectCategorias = $("#categoria")

const carregarCategorias = () => {
    const dbCategorias = lerCategorias()
    selectCategorias.html("")
    selectCategorias.append('<option value="" hidden>Qual Categoria?</option>')
    dbCategorias.forEach(createOptionCategorias)
}

const createOptionCategorias = (categorias, index) => {
    if (categorias.ativo) {
        selectCategorias.append(`<option>${categorias.nome}</option>`)
    }
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const limparCampos = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('data').dataset.index = 'new'
}

const saveMovimentacoes = () => {
    if (isValidFields()) {
        let valor = document.getElementById('valor').value
        valor = valor.replace("R$" , "")
        valor = valor.replace("." , "")
        valor = valor.replace("," , ".")

        const movimentacoes = {
            data: document.getElementById('data').value,
            descricao: document.getElementById('descricao').value,
            categoria: document.getElementById('categoria').value,
            acao: document.getElementById('acao').value,
            conta: document.getElementById('conta').value,
            parcela: document.getElementById('parcela').value,
            valor: valor
        }

        const index = document.getElementById('data').dataset.index

        if (index == 'new') {
            criarMovimentacoes(movimentacoes)
        } else {
            atualizarMovimentacoes(index, movimentacoes)
        }

        atualizarTabela()
        fecharModal()
    }
}

let saldo = 0;

const createRow = (movimentacoes, index) => {
    const newRow = document.createElement('tr');
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

    newRow.innerHTML = `
   
        <td>${movimentacoes.data}</td>
        <td>${movimentacoes.descricao}</td>
        <td>${movimentacoes.categoria}</td>
        <td>${movimentacoes.acao}</td>
        <td>${movimentacoes.conta}</td>
        <td>${movimentacoes.parcela}</td>
        <td>${parseFloat(movimentacoes.valor).toLocaleString("pt-BR", {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</td>
        <td>${parseFloat(saldo).toLocaleString("pt-BR", {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tabelaMovimentacoes>tbody').appendChild(newRow)
}

const limparTabela = () => {
    const rows = document.querySelectorAll('#tabelaMovimentacoes>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const atualizarTabela = () => {
    const dbMovimentacoes = lerMovimentacoes()
    limparTabela()
    saldo = 0;
    dbMovimentacoes.forEach(createRow)
}

const preencherCampos = (movimentacoes) => {
    document.getElementById('data').value = movimentacoes.data
    document.getElementById('descricao').value = movimentacoes.descricao
    document.getElementById('categoria').value = movimentacoes.categoria
    document.getElementById('acao').value = movimentacoes.acao
    document.getElementById('conta').value = movimentacoes.conta
    document.getElementById('parcela').value = movimentacoes.parcela
    document.getElementById('valor').value = parseFloat(movimentacoes.valor).toLocaleString("pt-BR", {style: 'currency',currency: 'BRL', minimumFractionDigits: 2})
    document.getElementById('data').dataset.index = movimentacoes.index
}

const editarMovimentacoes = (index) => {
    const movimentacoes = lerMovimentacoes()[index]
    movimentacoes.index = index
    abrirModal()
    preencherCampos(movimentacoes)
}

const editarDeletar = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editarMovimentacoes(index)
            atualizarTabela()
        } else {
            const movimentacoes = lerMovimentacoes()[index]
            const response = confirm(`Deseja realmente excluir a movimentação ${movimentacoes.descricao}?`)
            
            if (response) {
                deleteMovimentacoes(index)
                atualizarTabela()
            }
        }
    }
}

atualizarTabela()

//Eventos

document.getElementById('cadastrarMovimentacoes').addEventListener('click' , abrirModal)

document.getElementById('modalClose').addEventListener('click' , fecharModal)

document.getElementById('salvar').addEventListener('click' , saveMovimentacoes)

document.querySelector('#tabelaMovimentacoes>tbody').addEventListener('click' , editarDeletar)

document.getElementById('cancelar').addEventListener('click' , fecharModal)
