// JavaScript para página de cadastro
document.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('form-cadastro');
    const mensagemErro = document.getElementById('mensagem-erro');

    formCadastro.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome-cadastro').value;
        const email = document.getElementById('email-cadastro').value;
        const senha = document.getElementById('senha-cadastro').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;
        
        if (senha !== confirmarSenha) {
            mostrarErro('As senhas não coincidem!');
            return;
        }
        
        if (senha.length < 6) {
            mostrarErro('A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        const resultado = await DB.registrarUsuario(email, senha, nome);
        
        if (resultado.sucesso) {
            localStorage.setItem('usuarioLogado', JSON.stringify({
                email: email,
                nome: nome
            }));
            window.location.href = 'index.html';
        } else {
            mostrarErro(resultado.erro);
        }
    });
    
    function mostrarErro(mensagem) {
        mensagemErro.textContent = mensagem;
        mensagemErro.style.display = 'block';
        setTimeout(() => {
            mensagemErro.style.display = 'none';
        }, 5000);
    }
});