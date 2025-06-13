import axios from "axios";

export class StockItemService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || "/api";
    }

    async listStockItems() {
        return axios({
            url: "http://localhost:3001/stock-items",
            method: "GET",
        }).then((response) => response.data.data.stockItems);
    } 

    // Demande un stock item, retourne le correlationId
    async requestStockItem(idItem) {
        const response = await axios.post(
            "http://localhost:3001/stock-items/request",
            { idItem }
        );
        return response.data.correlationId;
    }

    // Poll la réponse toutes les secondes jusqu'à obtenir une réponse ou timeout (sauf 404: continue indéfiniment)
    async pollStockItemResponse(correlationId, timeoutMs = 10000) {
        const start = Date.now();
        while (true) {
            try {
                const response = await axios.get(
                    `http://localhost:3001/stock-items/response/${correlationId}`
                );
                if (response.data && Object.keys(response.data).length > 0) {
                    return response.data;
                }
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    // Si ce n'est pas une 404, lever l'erreur ou timeout
                    if (Date.now() - start >= timeoutMs) {
                        throw new Error("Timeout waiting for stock item response");
                    }
                    throw error;
                }
                // Si 404, continuer à poller indéfiniment
            }
            // Si timeout atteint (pour les autres erreurs que 404)
            if (Date.now() - start >= timeoutMs) {
                throw new Error("Timeout waiting for stock item response");
            }
            await new Promise((res) => setTimeout(res, 1000));
        }
    }
}
