import axios from "axios";

export class StockItemService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl || '/api';
    }

    async listStockItems() {
        return axios({
            url: '/api/graphql',
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
                `
            }
        }).then(response => response.data.data.stockItems);
    }
}
