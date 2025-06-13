import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  StructuredListSkeleton,
  Button,
  InlineNotification,
} from "@carbon/react";

export default function StockItemList(props) {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery({
    queryKey: ["stock-items"],
    queryFn: props.stockService.listStockItems,
  });

  const [createStatus, setCreateStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [notif, setNotif] = useState(null); // {kind, title, subtitle}

  // Example: create item with id 1 (à adapter selon votre UI)
  const handleCreateItem = async () => {
    setCreateStatus("loading");
    setNotif(null);
    try {
      // Ici, on met un id en dur (1), à remplacer par un sélecteur ou champ selon besoin
      const correlationId = await props.stockService.requestStockItem(1);
      const response = await props.stockService.pollStockItemResponse(
        correlationId
      );
      setCreateStatus("success");
      setNotif({
        kind: "success",
        title: "Création réussie",
        subtitle: JSON.stringify(response),
      });
      // Refresh la liste
      queryClient.invalidateQueries(["stock-items"]);
    } catch (e) {
      setCreateStatus("error");
      setNotif({
        kind: "error",
        title: "Erreur création",
        subtitle: e.message,
      });
    }
  };

  return (
    <div className="stock-items-list">
      <h2>Stock Items</h2>
      <Button
        kind="primary"
        onClick={handleCreateItem}
        disabled={createStatus === "loading"}
        style={{ marginBottom: 16 }}
      >
        {createStatus === "loading"
          ? "Création en cours..."
          : "Créer un item (id=1)"}
      </Button>
      {notif && (
        <InlineNotification
          kind={notif.kind}
          title={notif.title}
          subtitle={notif.subtitle}
          onClose={() => setNotif(null)}
        />
      )}
      {isLoading ? (
        <StructuredListSkeleton />
      ) : error ? (
        "Error retrieving stock items"
      ) : (
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
            {data.map((item) => (
              <StructuredListRow key={item.id}>
                <StructuredListCell noWrap>{item.name}</StructuredListCell>
                <StructuredListCell noWrap>{item.stock}</StructuredListCell>
                <StructuredListCell noWrap>{item.unitPrice}</StructuredListCell>
                <StructuredListCell noWrap>
                  {item.manufacturer}
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      )}
    </div>
  );
}
