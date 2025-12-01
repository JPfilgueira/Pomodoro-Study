// JavaScript para página de login
document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('form-login');
    const mensagemErro = document.getElementById('mensagem-erro');

    formLogin.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        
        const resultado = await DB.fazerLogin(email, senha);
        
        if (resultado.sucesso) {
            localStorage.setItem('usuarioLogado', JSON.stringify({
                email: email,
                nome: resultado.usuario.nome
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