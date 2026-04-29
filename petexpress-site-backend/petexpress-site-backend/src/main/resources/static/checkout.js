document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("finalizar-compra");
    if (!button) {
        return;
    }

    button.addEventListener("click", async () => {
        const cartJson = localStorage.getItem("cart");
        const cart = cartJson ? JSON.parse(cartJson) : [];

        if (!Array.isArray(cart) || cart.length === 0) {
            alert("O carrinho está vazio.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8082/api/pagamento/criar-preferencia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cart)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || `Erro ${response.status}`);
            }

            const data = await response.json();
            if (!data.init_point) {
                throw new Error("Resposta inválida do servidor.");
            }

            window.location.href = data.init_point;
        } catch (error) {
            console.error("Erro ao criar preferência de pagamento:", error);
            alert("Não foi possível iniciar o pagamento. Veja o console para mais detalhes.");
        }
    });
});
