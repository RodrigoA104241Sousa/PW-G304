document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".formulario");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // impedir envio automático
  
      const tipo = form.querySelector("select").value;
      const email = form.querySelector("input[type='email']").value;
      const morada = form.querySelector("input[type='text']").value;
      const codPostal = form.querySelectorAll("input[type='text']")[1].value;
      const descricao = form.querySelector("textarea").value;
  
      // Validação simples
      if (
        tipo === "Selecione" ||
        !email.includes("@") ||
        morada.trim() === "" ||
        codPostal.trim() === "" ||
        descricao.trim() === ""
      ) {
        alert("Por favor preencha todos os campos obrigatórios corretamente.");
        return;
      }
  
      // Sucesso
      alert("Ocorrência registada com sucesso!");
      form.reset();
    });
  
    const uploadBtn = document.querySelector(".upload-btn");
    uploadBtn.addEventListener("click", function () {
      alert("Funcionalidade de upload de imagem ainda não implementada.");
    });
  });
  