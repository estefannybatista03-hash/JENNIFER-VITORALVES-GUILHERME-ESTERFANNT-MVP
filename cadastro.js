// Gerenciador de formulário
class FormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4; // Atualizado para 4 etapas
        this.formData = {}; // Objeto para armazenar os dados do formulário
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateProgressIndicator();
        this.showStep(this.currentStep); // Garante que a etapa inicial seja exibida
    }

    setupEventListeners() {
        // Navegação entre etapas
        document.getElementById("nextStep1")?.addEventListener("click", () => this.handleNextStep(1));
        document.getElementById("nextStep2")?.addEventListener("click", () => this.handleNextStep(2));
        document.getElementById("prevStep2")?.addEventListener("click", () => this.handlePrevStep(2));
        document.getElementById("prevStep3")?.addEventListener("click", () => this.handlePrevStep(3));
        document.getElementById("prevStep4")?.addEventListener("click", () => this.handlePrevStep(4));

        // Submit do formulário (para a etapa final)
        document.getElementById("cadastroForm")?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Toggle de senha
        document.querySelectorAll(".password-toggle").forEach(toggle => {
            toggle.addEventListener("click", (e) => {
                const targetId = e.currentTarget.dataset.target;
                const passwordField = document.getElementById(targetId);
                const icon = e.currentTarget.querySelector("i");

                if (passwordField.type === "password") {
                    passwordField.type = "text";
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                } else {
                    passwordField.type = "password";
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }
            });
        });

        // Listeners para modais de termos e política
        document.getElementById("openTermos")?.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("termosModal").style.display = "block";
        });
        document.getElementById("openPolitica")?.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("politicaModal").style.display = "block";
        });
        document.querySelectorAll(".close-button").forEach(button => {
            button.addEventListener("click", (e) => {
                e.target.closest(".modal").style.display = "none";
            });
        });
        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("modal")) {
                e.target.style.display = "none";
            }
        });

        // Listener para upload de foto do produto
        document.getElementById("fotoProduto")?.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.formData.fotoProduto = event.target.result; // Armazena a imagem como base64
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Validação de campos (simplificada para o momento)
    validateStep(stepNumber) {
        let isValid = true;
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        const inputs = currentStepElement.querySelectorAll("input[required], select[required], textarea[required]");

        inputs.forEach(input => {
            const errorElement = document.getElementById(`${input.id}Error`);
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add("invalid");
                if (errorElement) errorElement.textContent = "Campo obrigatório.";
            } else {
                input.classList.remove("invalid");
                if (errorElement) errorElement.textContent = "";
            }
        });

        // Validações específicas
        if (stepNumber === 1) {
            const emailInput = document.getElementById("email");
            if (emailInput && !this.isValidEmail(emailInput.value)) {
                isValid = false;
                emailInput.classList.add("invalid");
                document.getElementById("emailError").textContent = "E-mail inválido.";
            }
            const senhaInput = document.getElementById("senha");
            const confirmarSenhaInput = document.getElementById("confirmarSenha");
            if (senhaInput && confirmarSenhaInput && senhaInput.value !== confirmarSenhaInput.value) {
                isValid = false;
                confirmarSenhaInput.classList.add("invalid");
                document.getElementById("confirmarSenhaError").textContent = "As senhas não coincidem.";
            }
        }

        if (stepNumber === 4) { // Validação dos termos na última etapa
            const aceitarTermos = document.getElementById("aceitarTermos");
            if (aceitarTermos && !aceitarTermos.checked) {
                isValid = false;
                aceitarTermos.classList.add("invalid");
                document.getElementById("aceitarTermosError").textContent = "Você deve aceitar os termos de uso.";
            } else if (aceitarTermos) {
                aceitarTermos.classList.remove("invalid");
                document.getElementById("aceitarTermosError").textContent = "";
            }
        }

        return isValid;
    }

    // Coleta de dados
    collectData(stepNumber) {
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        const inputs = currentStepElement.querySelectorAll("input, select, textarea");
        inputs.forEach(input => {
            if (input.type === "file") return; // Lida com o arquivo separadamente
            this.formData[input.name] = input.value;
        });
    }

    // Manipuladores de navegação
    handleNextStep(stepNumber) {
        if (this.validateStep(stepNumber)) {
            this.collectData(stepNumber);
            this.showStep(stepNumber + 1);
            if (stepNumber + 1 === this.totalSteps) { // Se for para a última etapa (confirmação)
                this.populateSummary();
            }
        }
    }

    handlePrevStep(stepNumber) {
        this.showStep(stepNumber - 1);
    }

    showStep(stepNumber) {
        document.querySelectorAll(".form-step").forEach(step => {
            step.style.display = "none";
        });
        const newStepElement = document.getElementById(`step${stepNumber}`);
        if (newStepElement) {
            newStepElement.style.display = "block";
            this.currentStep = stepNumber;
            this.updateProgressIndicator();
        }
    }

    updateProgressIndicator() {
        document.querySelectorAll(".progress-step").forEach(step => {
            const stepData = parseInt(step.dataset.step);
            if (stepData === this.currentStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
            if (stepData < this.currentStep) {
                step.classList.add("completed");
            } else {
                step.classList.remove("completed");
            }
        });
    }

    populateSummary() {
        // Dados Pessoais
        document.getElementById("summaryNome").textContent = this.formData.nome || "N/A";
        document.getElementById("summaryEmail").textContent = this.formData.email || "N/A";
        document.getElementById("summaryTelefone").textContent = this.formData.telefone || "N/A";
        document.getElementById("summaryCpf").textContent = this.formData.cpf || "N/A";

        // Dados da Loja
        document.getElementById("summaryNomeLoja").textContent = this.formData.nomeLoja || "N/A";
        document.getElementById("summaryCnpj").textContent = this.formData.cnpj || "N/A";
        document.getElementById("summarySegmento").textContent = this.formData.segmento || "N/A";
        document.getElementById("summaryEndereco").textContent = this.formData.endereco || "N/A";
        document.getElementById("summaryCep").textContent = this.formData.cep || "N/A";
        document.getElementById("summaryQuantidadeProdutos").textContent = this.formData.quantidadeProdutos || "N/A";
        document.getElementById("summaryDescricaoLoja").textContent = this.formData.descricaoLoja || "N/A";

        // Dados do Produto
        document.getElementById("summaryNomeProduto").textContent = this.formData.nomeProduto || "N/A";
        document.getElementById("summaryCategoriaProduto").textContent = this.formData.categoriaProduto || "N/A";
        document.getElementById("summaryDescricaoProduto").textContent = this.formData.descricaoProduto || "N/A";
        const fotoProdutoImg = document.getElementById("summaryFotoProduto");
        if (this.formData.fotoProduto) {
            fotoProdutoImg.src = this.formData.fotoProduto;
            fotoProdutoImg.style.display = "block";
        } else {
            fotoProdutoImg.style.display = "none";
        }
    }

    handleSubmit() {
        if (this.validateStep(this.totalSteps)) {
            console.log("Dados do formulário:", this.formData);
            alert("Cadastro finalizado com sucesso! Seus dados foram salvos e seu QR Code será gerado.");
            this.generateQRCode(); // Chama a função para gerar o QR Code
        }
    }

    generateQRCode() {
        const qrcodeDiv = document.getElementById("qrcode");
        qrcodeDiv.innerHTML = ""; // Limpa o QR Code anterior, se houver

        // Converte os dados do formulário para uma string JSON
        const qrData = JSON.stringify(this.formData);

        // Cria o QR Code
        new QRCode(qrcodeDiv, {
            text: qrData,
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }

    // Funções auxiliares de validação (podem ser expandidas)
    isValidEmail(email) {
        return /^[^\]+@[^\.]+\.[^\.]+$/.test(email);
    }

    // Adicione outras funções de validação conforme necessário (CPF, CNPJ, Telefone, etc.)
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    new FormManager();
});


