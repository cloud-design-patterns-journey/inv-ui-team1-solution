import axios from "axios";

export class StockItemService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || "/api";
  }

  async listStockItems() {
    return axios({
      url: "/api/graphql",
      method: "POST",
      data: {
        query: `
                {
                    stockItems {
                        id
                        manufacturer
                        name
                        picture
                        stock
                        unitPrice
                    }
                }
                `,
      },
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

  // Poll la réponse toutes les secondes jusqu'à obtenir une réponse ou timeout
  async pollStockItemResponse(correlationId, timeoutMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const response = await axios.get(
        `http://localhost:3001/stock-items/response/${correlationId}`
      );
      if (response.data && Object.keys(response.data).length > 0) {
        return response.data;
      }
      await new Promise((res) => setTimeout(res, 1000));
    }
    throw new Error("Timeout waiting for stock item response");
  }
}
