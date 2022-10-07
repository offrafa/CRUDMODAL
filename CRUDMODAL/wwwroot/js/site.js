// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.





$(document).ready(function () {
    carregarDados();
});



function carregarDados() {
    $.ajax({
        url: "Pessoas/PegarTodos",
        method: "GET",
        success: function (pessoas) {
            montarTabela(pessoas);
        }
    });
}



$(".novaPessoa").click(function () {
    escolherTituloModal("Cadastro de nova pessoa");
    mostrarModal();
    limparFormulario();
    $('.pessoaId').val(0);
});

$(".btnSalvar").click(function () {
    var pessoa = {
        pessoaId: $('.pessoaId').val(),
        nome: $('.nome').val(),
        idade: $('.idade').val(),
        profissao: $('.profissao').val()
    };
    if (validarFormulario(pessoa)) {
        if (parseInt(pessoa.pessoaId) > 0)
            atualizarPessoa(pessoa);
        criarPessoa(pessoa);
    }
});




function criarPessoa(pessoa) {
    $.ajax({
        url: "Pessoas/NovaPessoa",
        method: 'POST',
        data: {
            pessoa: pessoa
        },
        success: function (pessoaCriada) {
            $("#modal").modal('hide');
            var linhaNovaPessoa = `<tr id="${pessoaCriada.pessoaId}">`;
            linhaNovaPessoa += `<td>${pessoaCriada.nome}</td>`;
            linhaNovaPessoa += `<td>${pessoaCriada.idade}</td>`;
            linhaNovaPessoa += `<td>${pessoaCriada.profissao}</td>`;
            linhaNovaPessoa += `<td><button class="btn btn-sm btn-outline-info"
                            onclick="pegarPessoaPeloId(${pessoaCriada.pessoaId})">Atualizar</button> |
                            <button class="btn btn-sm btn-outline-danger"
                            onclick="excluirPessoaPeloId(${pessoaCriada.pessoaId})">Excluir</button></td>`;
            linhaNovaPessoa += '</tr>';
            $(".tabela tbody").append(linhaNovaPessoa);
            limparFormulario();
        }
    });
}



function pegarPessoaPeloId(pessoaId) {
    $.ajax({
        url: "Pessoas/PegarPessoaPeloId",
        method: 'GET',
        data: {
            pessoaId: pessoaId
        },
        success: function (pessoa) {
            mostrarModal();
            escolherTituloModal(`Atualizar pessoa ${pessoa.nome}`);
            $(".pessoaId").val(pessoa.pessoaId);
            $(".nome").val(pessoa.nome);
            $(".idade").val(pessoa.idade);
            $(".profissao").val(pessoa.profissao);
        }
    })
}



function atualizarPessoa(pessoa) {
    $.ajax({
        url: "Pessoas/AtualizarPessoa",
        method: 'POST',
        data: {
            pessoa: pessoa
        },
        success: function (pessoaAtualizada) {
            $("#modal").modal('hide');
            var linhaTabela = $(`#${pessoaAtualizada.pessoaId}`);
            linhaTabela[0].childNodes[0].innerText = pessoaAtualizada.nome;
            linhaTabela[0].childNodes[1].innerText = pessoaAtualizada.idade;
            linhaTabela[0].childNodes[2].innerText = pessoaAtualizada.profissao;
            limparFormulario();
        }
    });
}



function excluirPessoa(pessoaId) {
    $.ajax({
        url: "Pessoas/ExcluirPessoa",
        method: 'POST',
        data: {
            pessoaId: pessoaId
        },
        success: function (status) {
            if (status) {
                swal({
                    title: "Concluído!",
                    text: "Pessoa excluída com sucesso!",
                    icon: "success",
                    button: "OK!",
                });
                document.getElementById(pessoaId).remove();
            }
            else
                alert(status.mensagem);
        }
    })
}



function montarTabela(pessoas) {
    var indice = 0;
    var divTabela = document.getElementById("divTabela");
    var tabela = '<table class="table table-sm table-hover table-striped tabela">';
    tabela += '<thead>';
    tabela += '<tr>';
    tabela += '<th>Nome</th>';
    tabela += '<th>Idade</th>';
    tabela += '<th>Profissão</th>';
    tabela += '<th>Ações</th>';
    tabela += '</tr>';
    tabela += '</thead>';
    tabela += '<tbody>';
    for (indice = 0; indice < pessoas.length; indice++) {
        tabela += `<tr id="${pessoas[indice].pessoaId}">`;
        tabela += `<td>${pessoas[indice].nome}</td>`;
        tabela += `<td>${pessoas[indice].idade}</td>`;
        tabela += `<td>${pessoas[indice].profissao}</td>`;
        tabela += `<td><button class="btn btn-sm btn-outline-info" onclick="pegarPessoaPeloId(${pessoas[indice].pessoaId})">Atualizar</button> |
                                <button class="btn btn-sm btn-outline-danger" onclick="excluirPessoa(${pessoas[indice].pessoaId})">Excluir</button></td>`;
        tabela += '</tr>';
    }
    tabela += '</tbody>';
    tabela += '</table>';
    divTabela.innerHTML = tabela;
}



function validarFormulario(pessoa) {
    let nomeValido = validarNome(pessoa.nome);
    let idadeValida = validarIdade(pessoa.idade);
    let profissaoValida = validarProfissao(pessoa.profissao);
    if (nomeValido == true && idadeValida == true && profissaoValida == true)
        return true;
    return false;
}



function validarNome(nome) {
    let nomeValido = true;
    if (nome.trim() == '' || nome == undefined) {
        $(".nome").addClass('is-invalid');
        $(".erroNome").text("Preencha o nome");
        $(".erroNome").removeClass("d-none");
        nomeValido = false;
    }
    else if (nome.length > 20) {
        $(".nome").addClass('is-invalid');
        $(".erroNome").text("Use menos caracteres");
        $(".erroNome").removeClass("d-none");
        nomeValido = false;
    }
    else {
        $(".nome").removeClass('is-invalid');
        $(".nome").addClass('is-valid');
        $(".erroNome").addClass("d-none");
        nomeValido = true;
    }
    return nomeValido;
}




function validarIdade(idade) {
    let idadeValida = true;
    if (isNaN(idade) || idade == undefined || idade == '') {
        $(".idade").addClass('is-invalid');
        $(".erroIdade").text("Preencha a idade");
        $(".erroIdade").removeClass("d-none");
        idadeValida = false;
    }
    else if (parseInt(idade) < 18 || parseInt(idade) > 100) {
        $(".idade").addClass('is-invalid');
        $(".erroIdade").text("Idade inválida");
        $(".erroIdade").removeClass("d-none");
        idadeValida = false;
    }
    else {
        $(".idade").removeClass('is-invalid');
        $(".idade").addClass('is-valid');
        $(".erroIdade").addClass("d-none");
        idadeValida = true;
    }
    return idadeValida;
}



function validarProfissao(profissao) {
    let profissaoValida = true;
    if (profissao.trim() == '' || profissao == undefined) {
        $(".profissao").addClass('is-invalid');
        $(".erroProfissao").text("Preencha a profissão");
        $(".erroProfissao").removeClass("d-none");
        profissaoValida = false;
    }
    else if (profissao.length > 50) {
        $(".profissao").addClass('is-invalid');
        $(".erroProfissao").text("Use menos caracteres");
        $(".erroProfissao").removeClass("d-none");
        profissaoValida = false;
    }
    else {
        $(".profissao").removeClass('is-invalid');
        $(".profissao").addClass('is-valid');
        $(".erroProfissao").addClass("d-none");
        profissaoValida = true;
    }
    return profissaoValida;
}




function mostrarModal() {
    new bootstrap.Modal($("#modal"), {}).show();
}


function limparFormulario() {
    $(".nome").val('');
    $(".nome").removeClass('is-valid');
    $(".idade").val('');
    $(".idade").removeClass('is-valid');
    $(".profissao").val('');
    $(".profissao").removeClass('is-valid');
}


function escolherTituloModal(texto) {
    $(".modal-title").text(texto);
}
