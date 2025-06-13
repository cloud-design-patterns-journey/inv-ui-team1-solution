export class StockItemMockService {
    async listStockItems() {
        return new Promise(resolve => {
            // Wait 1 second before returning data
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        name: 'Item 1',
                        stock: 10,
                        unitPrice: 51.2,
                        manufacturer: 'Sony'
                    },
                    {
                        id: 2,
                        name: 'Item 2',
                        stock: 50,
                        unitPrice: 10,
                        manufacturer: 'LG'
                    },
                ]);
            }, 1000)
        });
    }
}