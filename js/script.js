/** not:
 * 
 * Esconde todos os fieldsets que não sejam o primeiro,
 * Eventlistener para o next e previous.
 */

function main() {
    //1.
    document.getElementById("btn-start").addEventListener("click", function () {
        // escolhe todos que não sejam o primeiro do tipo
        var fieldsets = document.querySelectorAll("fieldset:not(:first-of-type)");
        var fieldsetsArr = Array.prototype.slice.call(fieldsets);
        fieldsetsArr
            .forEach(function (x) {
                x.style.display = "none";
            })
        criarBotoes();
    });

    //2.
    document.getElementsByTagName("form")[0].addEventListener("click", function (e) {
        if (e.target && e.target.matches(".atualNext")) {
            prox();
        } else if (e.target && e.target.matches(".atualPrev")) {
            prev();
        }
    });
    document.getElementById("btn-start").addEventListener("click", escondeBtn); 
}

/**not:
 * Vi que o plugin jqueryvalidate usava de regras de regex para 
 * validar, então tive a ideia de usar essas 
 * regras dentro de objetos para o mesmo.
 * 
 * Cria uma array com todos os inputs atuais. Para cada ele 
 * realiza um teste de regex com o value, aumentando o contador
 * a cada erro. 
 * 
 * Retorna true caso não tenha nenhum erro
 * 
 */


function validar() {
    // Regras tiradas da página do mozilla sobre regex
    var regrasREGEX = {
        email: /[^\s]*8a-z0-9.-]*/i,
        num: /^[0-9]*$/,
        texto: /[a-zA-Z]/,
        nome: /[a-zA-Z]{5,15}/,
    };

    let contador = 0;
    var botaoAtual = document.querySelector('.atualNext');
    var inputs = botaoAtual.parentNode.getElementsByTagName('input');
    var inputsArr = Array.from(inputs);
    inputsArr.forEach(function (x) {
        if (!regrasREGEX.texto.test(x.value)) {
            x.placeholder = 'erro';
            contador++;
        }
    });

    // contador == 0 significa que não foi encontrado erros (return true)
    return contador === 0;
}



/** not: 
 * Reconhece o primeiro botão next, coloca o fieldset (parente) como none 
 * pega o proximo fieldset irmão do parente e coloca block.
 * 
 * No if é meio confuso mas é algo como se o ultimo elemento do proximo fieldset for também um botão 
 * que possui a classe next (para então não dar erro com o botão de previous) ele coloca .atualNext nele.
 * Se ele possuir um botão antes (prev) ele coloca atualPrev. Se não existir mais um next (else) ele coloca 
 * esse botao como atualPrev
 * 
 */

function prox() {
    // NEXT
    var botaoAtual = document.getElementsByClassName("atualNext")[0];
    // Usa a função validar para conferir os inputs e liberar o botão
    if(!validar()){
        return;
    }
    botaoAtual.parentElement.style.display = "none";
    botaoAtual.parentElement.nextElementSibling.style.display = "block";
    if (ultimoFilhoProximoPai(botaoAtual).classList.contains("next")) {
        ultimoFilhoProximoPai(botaoAtual).previousElementSibling.classList.add("atualPrev");
        ultimoFilhoProximoPai(botaoAtual).classList.add("atualNext");
    } else {
        ultimoFilhoProximoPai(botaoAtual).classList.add("atualPrev");
    }
    botaoAtual.parentNode.lastChild.previousElementSibling.classList.remove("atualPrev");
    botaoAtual.classList.remove("atualNext");
}

/** not: 
 * Reconhece o primeiro botão atualPrev, coloca o fieldset (parente) como display:none 
 * pega o proximo fieldset irmão do parente e coloca block.
 * 
 * No if ele pega o pai, depois pega o ultimo elemento igual ao pai antes dele, 
 * procura o ultimo filho, pega o ultimo irmão e ve se é next ou previous
 * a confusão maior é pra manter o atualNext e na hora que acaba os previous, 
 * mas isso é resolvido no else (que ve se ele possui um irmao pro ultimo filho).
 * 
 */

function prev() {
    // Previous
    var botaoAtual = document.getElementsByClassName("atualPrev")[0];
    botaoAtual.parentElement.style.display = "none";
    botaoAtual.parentElement.previousElementSibling.style.display = "block";
    if (ultimoFilhoPreviousPai(botaoAtual).previousElementSibling.classList.contains("prev")) {
        ultimoFilhoPreviousPai(botaoAtual).previousElementSibling.classList.add("atualPrev");
        ultimoFilhoPreviousPai(botaoAtual).classList.add("atualNext");
    } else {
        ultimoFilhoPreviousPai(botaoAtual).classList.add("atualNext");
    }
    botaoAtual.parentNode.lastChild.previousElementSibling.classList.remove("atualPrev");
    botaoAtual.classList.remove("atualNext");
}



/** not:
 * Criei pra melhorar a visualização do código, as classes estavam gigantescas então achei
 * melhor criar essas funções para facilitar a visualização
 * @param elementoDesejado
 * @returns o ultimo filho do irmão do pai
 */

function ultimoFilhoProximoPai(botaoAtual) {
    return botaoAtual.parentNode.nextElementSibling.lastChild;
}

/** not:
 * @param elementoDesejado
 * @returns o ultimo filho do irmão anterior do pai
 */


function ultimoFilhoPreviousPai(botaoAtual) {
    return botaoAtual.parentNode.previousElementSibling.lastChild;
}


/** not:
 * Pega as arrays e transforma em uma Array, depois realiza
 * a criação dos botões next e previous com as devidas classes
 * o primeiro botão next vem com a classe atualNext para
 * depois possibilitar a navegação
 * 
 */

function criarBotoes() {
    var fieldsets = document.getElementsByTagName("fieldset");
    var fieldsetArr = Array.prototype.slice.call(fieldsets);
    pegaFs(fieldsetArr);
}
function pegaFs(v){
    v.forEach(function(x){
       var prev = document.createElement("button")
           .classList.add("prev", "bgt")
           .textContent = "voltar"
           .type = "button";
       var next = document.createElement("button")
           .classList.add("next", "bgt")
           .textContent = "avançar"
           .type = "button";
       
       if (x.previousElementSibling && x.nextElementSibling) {
            x.appendChild(prev);
            x.appendChild(next);
        } else if (x.nextElementSibling) {
            next.classList.add("atualNext");
            x.appendChild(next);
        } else if (x.previousElementSibling) {
            x.appendChild(prev);
        }
       });
}
function escondeBtn(){
    var btn = document.getElementById("btn-start");
    btn.style.display = "none";
}


/** Prepara função ao ativar tela */
window.onload = main;