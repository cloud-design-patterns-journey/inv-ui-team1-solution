import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    StructuredListWrapper, StructuredListHead, StructuredListRow,
    StructuredListCell, StructuredListBody, StructuredListSkeleton
} from '@carbon/react';

export default function StockItemList(props) {
    const { isLoading, error, data } = useQuery({
        queryKey: ['stock-items'],
        queryFn: props.stockService.listStockItems
    });

    return (
        <div className='stock-items-list'>
            <h2>Stock Items</h2>
            {isLoading ?
                <StructuredListSkeleton />
                : error ?
                    'Error retrieving stock items'
                    :
                    <StructuredListWrapper>
                        <StructuredListHead>
                            <StructuredListRow head>
                                <StructuredListCell head>Name</StructuredListCell>
                                <StructuredListCell head>Stock</StructuredListCell>
                                <StructuredListCell head>Unit Price</StructuredListCell>
                                <StructuredListCell head>Manufacturer</StructuredListCell>
                            </StructuredListRow>
                        </StructuredListHead>
                        <StructuredListBody>
                            {data.map(item => (
                                <StructuredListRow key={item.id}>
                                    <StructuredListCell noWrap>{item.name}</StructuredListCell>
                                    <StructuredListCell noWrap>{item.stock}</StructuredListCell>
                                    <StructuredListCell noWrap>{item.unitPrice}</StructuredListCell>
                                    <StructuredListCell noWrap>{item.manufacturer}</StructuredListCell>
                                </StructuredListRow>
                            ))}
                        </StructuredListBody>
                    </StructuredListWrapper>}
        </div>
    );
}